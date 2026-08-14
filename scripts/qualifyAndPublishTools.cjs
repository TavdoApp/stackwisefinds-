const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const net = require('net');
const path = require('path');
const { readAllTools, readAutoPublishedData, writeAutoPublishedData } = require('./toolData.cjs');

const queuePath = path.join(__dirname, '..', 'data', 'ingestion-candidates.json');
const maxPublishesPerRun = 10;
const minimumGitHubStars = 1000;
const allowedCategories = new Set(['ai-content', 'trending-video-ai', 'ai-music-audio', 'design-creative', 'ai-coding-dev', 'meeting-ai', 'crm', 'invoicing', 'email-marketing', 'social-media', 'project-mgmt', 'seo-analytics', 'forms-leadgen', 'ecommerce-funnels', 'hr-payroll', 'customer-support', 'dev-cloud', 'web-builders', 'analytics-heatmaps', 'publishing-cms', 'time-productivity', 'esign-documents', 'security-passwords', 'nocode-databases']);

function readQueue() {
  if (!fs.existsSync(queuePath)) return { schemaVersion: 1, updatedAt: null, candidates: [] };
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  return { schemaVersion: 1, updatedAt: queue.updatedAt || null, candidates: Array.isArray(queue.candidates) ? queue.candidates : [] };
}

function writeQueue(queue) {
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
}

function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !hostname || hostname === 'localhost' || hostname.endsWith('.local')) return false;
    if (net.isIP(hostname)) return false;
    return !/^(10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(hostname);
  } catch {
    return false;
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}

function probeWebsite(url, redirects = 0) {
  if (!isPublicHttpsUrl(url)) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = https.get(url, { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' 
        }, 
        timeout: 9000 
      }, (response) => {
        const statusCode = response.statusCode || 0;
        const location = response.headers.location;

        if (statusCode >= 300 && statusCode < 400 && location && redirects < 3) {
          response.resume();
          try { 
            const nextUrl = new URL(location, url).toString();
            // Reject redirects to known domain parking / sales registrars
            if (/godaddy|namecheap|sedo|dan\.com|afternic|hugedomains|parking/i.test(nextUrl)) {
              return resolve(null);
            }
            return resolve(probeWebsite(nextUrl, redirects + 1)); 
          } catch { 
            return resolve(null); 
          }
        }

        if (statusCode < 200 || statusCode >= 400) {
          response.resume();
          return resolve(null);
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
          if (body.length > 35000) {
            response.destroy();
          }
        });

        response.on('end', () => {
          const lowerBody = body.toLowerCase();
          
          // Anti-Parked / Expired Domain Detection Heuristics
          const parkedSignals = [
            'domain is parked',
            'buy this domain',
            'domain for sale',
            'this domain has expired',
            'parked free courtesy',
            'hugedomains',
            'afternic.com',
            'dan.com/buy-domain',
            'sedo.com/search',
            'godaddy.com/park',
            'renew your domain',
            'domain name registration',
            'under construction',
            'default web site page',
            'welcome to nginx'
          ];

          const isParked = parkedSignals.some(signal => lowerBody.includes(signal));
          if (isParked || body.length < 250) {
            return resolve(null);
          }

          resolve(url);
        });

        response.on('error', () => resolve(null));
      });

      request.on('error', () => resolve(null));
      request.on('timeout', () => { request.destroy(); resolve(null); });
    } catch {
      resolve(null);
    }
  });
}

function getEligibilityIssues(candidate, knownNames, knownDomains) {
  const issues = [];
  const repository = candidate.repository || {};
  if (candidate.source?.id !== 'github-trending') issues.push('source_not_eligible');
  if (!candidate.sourceUrl?.startsWith('https://github.com/')) issues.push('repository_url_missing');
  if (!candidate.name || candidate.name.length < 3 || candidate.name.length > 80) issues.push('invalid_name');
  if (!candidate.description || candidate.description.length < 60 || candidate.description.length > 280) issues.push('insufficient_description');
  if (!isPublicHttpsUrl(candidate.proposedWebsite)) issues.push('invalid_https_homepage');
  if (!candidate.proposedDomain || knownDomains.has(candidate.proposedDomain)) issues.push('duplicate_domain');
  if (knownNames.has(candidate.name?.toLowerCase())) issues.push('duplicate_name');
  if (!allowedCategories.has(candidate.categorySuggestion)) issues.push('invalid_category');
  if (!Number.isInteger(repository.stars) || repository.stars < minimumGitHubStars) issues.push('insufficient_repository_signal');
  if (repository.archived) issues.push('archived_repository');
  return issues;
}

async function run() {
  const queue = readQueue();
  const allTools = readAllTools();
  const autoData = readAutoPublishedData();
  const knownNames = new Set(allTools.map((tool) => tool.name.toLowerCase()));
  const knownDomains = new Set(allTools.map((tool) => tool.domain.toLowerCase()));
  const checkedAt = new Date().toISOString();
  let published = 0;

  for (const candidate of queue.candidates) {
    if (published >= maxPublishesPerRun || candidate.status === 'auto_published') continue;
    const issues = getEligibilityIssues(candidate, knownNames, knownDomains);
    candidate.autoQualification = { checkedAt, eligible: false, issues };
    if (issues.length > 0) continue;

    const verifiedWebsite = await probeWebsite(candidate.proposedWebsite);
    if (!verifiedWebsite) {
      candidate.autoQualification.issues = ['website_unreachable'];
      continue;
    }

    const idSeed = `${candidate.proposedDomain}:${candidate.name.toLowerCase()}`;
    const tool = {
      id: `${slugify(candidate.name)}-${crypto.createHash('sha256').update(idSeed).digest('hex').slice(0, 8)}`,
      name: candidate.name,
      domain: candidate.proposedDomain,
      category: candidate.categorySuggestion,
      tagline: candidate.description.slice(0, 120),
      description: candidate.description,
      pricing: 'Check website',
      affiliateUrl: verifiedWebsite,
      featured: false,
      badge: 'Newly added',
      isFreeTier: false,
      isOpenSource: Boolean(candidate.repository?.license),
      sourceUrl: candidate.sourceUrl,
      autoQualifiedAt: checkedAt,
      verification: { method: 'Automated GitHub source and HTTPS reachability checks', repositoryStars: candidate.repository.stars, websiteReachable: true }
    };

    autoData.tools.unshift(tool);
    candidate.status = 'auto_published';
    candidate.autoQualification = { checkedAt, eligible: true, issues: [], verifiedWebsite };
    knownNames.add(tool.name.toLowerCase());
    knownDomains.add(tool.domain);
    published += 1;
  }

  autoData.updatedAt = checkedAt;
  autoData.tools = autoData.tools.slice(0, 1000);
  writeAutoPublishedData(autoData);
  writeQueue(queue);
  console.log(`Auto-published ${published} high-confidence tools. Candidates that do not meet every gate remain unpublished.`);
}

run().catch((error) => {
  console.error(`Tool qualification failed: ${error.message}`);
  process.exit(1);
});
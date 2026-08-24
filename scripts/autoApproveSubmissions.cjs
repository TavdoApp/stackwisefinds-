const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { readAutoPublishedData, writeAutoPublishedData } = require('./toolData.cjs');

const candidatesPath = path.join(__dirname, '..', 'data', 'ingestion-candidates.json');

const BANNED_PARKED_DOMAINS = [
  'godaddy.com',
  'hugedomains.com',
  'dan.com',
  'afternic.com',
  'sedo.com',
  'domainmarket.com',
  'bodis.com',
  'parkingcrew.net',
  'namebright.com'
];

function checkDomainHealth(url, redirects = 0) {
  if (!url || !url.startsWith('http')) return Promise.resolve({ isHealthy: false, reason: 'Invalid URL scheme' });
  if (redirects > 4) return Promise.resolve({ isHealthy: false, reason: 'Too many redirects' });

  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      
      // Check for parking domain signatures
      for (const banned of BANNED_PARKED_DOMAINS) {
        if (parsedUrl.hostname.includes(banned)) {
          return resolve({ isHealthy: false, reason: `Redirected to parked domain (${banned})` });
        }
      }

      const request = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        },
        timeout: 8000
      }, (response) => {
        const code = response.statusCode || 0;
        const location = response.headers.location;

        if (location && code >= 300 && code < 400 && redirects < 3) {
          response.resume();
          try {
            const redirectUrl = new URL(location, url).toString();
            if (/godaddy|namecheap|sedo|dan\.com|afternic|hugedomains|parking/i.test(redirectUrl)) {
              return resolve({ isHealthy: false, reason: 'Redirected to parked domain registrar' });
            }
            return resolve(checkDomainHealth(redirectUrl, redirects + 1));
          } catch {
            return resolve({ isHealthy: false, reason: 'Invalid redirect header' });
          }
        }

        if (code < 200 || code >= 400) {
          response.resume();
          return resolve({ isHealthy: false, reason: `HTTP status ${code}` });
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
          if (body.length > 30000) response.destroy();
        });

        response.on('end', () => {
          const lowerBody = body.toLowerCase();
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
            'under construction',
            'default web site page'
          ];

          const isParked = parkedSignals.some(s => lowerBody.includes(s));
          if (isParked || body.length < 250) {
            return resolve({ isHealthy: false, reason: 'Parked / expired domain detected' });
          }

          resolve({ isHealthy: true, finalUrl: url, statusCode: code });
        });

        response.on('error', (err) => resolve({ isHealthy: false, reason: err.message }));
      });

      request.on('error', (err) => resolve({ isHealthy: false, reason: err.message }));
      request.on('timeout', () => { request.destroy(); resolve({ isHealthy: false, reason: 'Connection timeout' }); });
    } catch (err) {
      resolve({ isHealthy: false, reason: err.message });
    }
  });
}

async function fetchLivePendingSubmissions() {
  return new Promise((resolve) => {
    https.get('https://stakdock.com/api/pending-submissions', { timeout: 5000 }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.success && Array.isArray(parsed.pending)) {
            return resolve(parsed.pending.map(item => ({
              id: `vendor-${item.id}`,
              name: item.software_name || item.vendor_name,
              softwareWebsite: item.software_website,
              category: 'crm',
              status: 'pending'
            })));
          }
        } catch {}
        resolve([]);
      });
    }).on('error', () => resolve([]));
  });
}

async function runAutoApprovalProcess() {
  console.log('[StakDock Auto-Approval] Starting live URL health verification for founder submissions...');

  let candidatesData = { candidates: [] };
  if (fs.existsSync(candidatesPath)) {
    try {
      candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
    } catch {
      candidatesData = { candidates: [] };
    }
  }

  const livePending = await fetchLivePendingSubmissions();
  const localPending = Array.isArray(candidatesData.candidates)
    ? candidatesData.candidates.filter(c => c.status === 'pending_review' || c.status === 'pending')
    : [];

  const pending = [...localPending, ...livePending];

  if (pending.length === 0) {
    console.log('[StakDock Auto-Approval] No pending submissions in queue.');
    return;
  }

  const autoPublishedData = readAutoPublishedData();
  const existingTools = Array.isArray(autoPublishedData.tools) ? autoPublishedData.tools : [];
  const newlyApproved = [];

  for (const candidate of pending) {
    const targetUrl = candidate.proposedWebsite || candidate.softwareWebsite || candidate.url;
    console.log(`[Health Verification] Checking ${candidate.name} (${targetUrl})...`);

    const health = await checkDomainHealth(targetUrl);

    if (health.isHealthy) {
      console.log(`✅ [APPROVED] ${candidate.name} passed live domain & SSL health checks.`);
      
      const newToolRecord = {
        id: candidate.id || `tool-${Date.now()}`,
        name: candidate.name,
        domain: new URL(targetUrl).hostname.replace(/^www\./, ''),
        category: candidate.categorySuggestion || candidate.category || 'ai-content',
        tagline: candidate.tagline || candidate.description || `${candidate.name} AI & Software Solution`,
        description: candidate.description || `${candidate.name} is a software platform listed on StakDock.`,
        rating: null,
        reviewsCount: 0,
        upvotes: 0,
        pricing: candidate.pricing || 'Check website',
        affiliateUrl: targetUrl,
        website: targetUrl,
        featured: false,
        badge: null,
        websiteChecked: true,
        founderVerified: false,
        isFreeTier: false,
        isOpenSource: false,
        features: candidate.features || ['Active Web App', 'Cloud Hosted'],
        pros: ['Active Domain Identified'],
        cons: ['Standard Feature Tier'],
        bestFor: 'Founders & Teams',
        publishedAt: new Date().toISOString()
      };

      newlyApproved.push(newToolRecord);
      candidate.status = 'approved';
    } else {
      console.warn(`❌ [REJECTED] ${candidate.name} failed health check: ${health.reason}`);
      candidate.status = 'rejected';
      candidate.rejectionReason = health.reason;
    }
  }

  if (newlyApproved.length > 0) {
    const updatedTools = [...existingTools, ...newlyApproved];
    writeAutoPublishedData({
      ...autoPublishedData,
      updatedAt: new Date().toISOString(),
      tools: updatedTools
    });

    // Write back candidates status
    fs.writeFileSync(candidatesPath, `${JSON.stringify(candidatesData, null, 2)}\n`, 'utf8');
    console.log(`[StakDock Auto-Approval] Successfully approved ${newlyApproved.length} tools with clean zero-rating baseline.`);
  } else {
    console.log('[StakDock Auto-Approval] Process complete. 0 submissions approved in this cycle.');
  }
}

if (require.main === module) {
  runAutoApprovalProcess().catch(err => {
    console.error('Auto-approval error:', err);
    process.exit(0);
  });
}

module.exports = { runAutoApprovalProcess, checkDomainHealth };

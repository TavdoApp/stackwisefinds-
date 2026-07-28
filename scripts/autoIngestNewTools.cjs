const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { readAllTools } = require('./toolData.cjs');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
const queuePath = path.join(__dirname, '..', 'data', 'ingestion-candidates.json');
const maxCandidatesPerRun = 25;

const sources = [
  {
    id: 'product-hunt',
    label: 'Product Hunt RSS',
    url: 'https://www.producthunt.com/feed',
    categorySuggestion: 'ai-content'
  },
  {
    id: 'appsumo',
    label: 'AppSumo RSS',
    url: 'https://appsumo.com/feed/',
    categorySuggestion: 'time-productivity'
  },
  {
    id: 'github-trending',
    label: 'GitHub Trending API',
    url: 'https://api.github.com/search/repositories?q=topic:ai-tool+stars:>200&sort=updated&order=desc',
    categorySuggestion: 'ai-coding-dev'
  }
];

function fetchText(url) {
  return new Promise((resolve) => {
    const request = https.get(url, {
      headers: {
        Accept: 'application/xml, text/xml, application/json, */*',
        'User-Agent': 'StakDockCandidateCollector/1.0 (+https://stakdock.com)'
      },
      timeout: 8000
    }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve(body));
    });

    request.on('error', () => resolve(''));
    request.on('timeout', () => { request.destroy(); resolve(''); });
  });
}

function decodeText(value) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeName(value) {
  return decodeText(value)
    .replace(/^\[[^\]]+\]\s*/g, '')
    .replace(/\s+[–—-]\s+(?:Product Hunt|AppSumo).*$/i, '')
    .trim()
    .slice(0, 120);
}

function candidateId(source, name) {
  return crypto.createHash('sha256').update(`${source}:${name.toLowerCase()}`).digest('hex').slice(0, 16);
}

function readExistingTools() {
  return readAllTools();
}

function readQueue() {
  if (!fs.existsSync(queuePath)) {
    return { schemaVersion: 1, updatedAt: null, candidates: [] };
  }

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  return {
    schemaVersion: 1,
    updatedAt: queue.updatedAt || null,
    candidates: Array.isArray(queue.candidates) ? queue.candidates : []
  };
}

function extractRssCandidates(source, feed) {
  const titles = [...feed.matchAll(/<title>([\s\S]*?)<\/title>/gi)]
    .map((match) => normalizeName(match[1]))
    .filter((name) => name && !/^(product hunt|appsumo|rss)$/i.test(name));

  return titles.slice(1, 16).map((name) => ({
    name,
    description: null,
    proposedWebsite: null,
    sourceUrl: source.url
  }));
}

function extractGitHubCandidates(source, payload) {
  try {
    const repositories = JSON.parse(payload).items || [];
    return repositories.slice(0, 15)
      .filter((repository) => repository.name)
      .map((repository) => ({
        name: normalizeName(repository.name.replace(/[-_]/g, ' ')),
        description: repository.description ? decodeText(repository.description).slice(0, 280) : null,
        proposedWebsite: repository.homepage && /^https:\/\//i.test(repository.homepage) ? repository.homepage : null,
        sourceUrl: repository.html_url || source.url,
        repository: {
          stars: repository.stargazers_count,
          archived: Boolean(repository.archived),
          license: repository.license?.spdx_id || null,
          updatedAt: repository.updated_at || null
        }
      }));
  } catch {
    return [];
  }
}

async function collectFromSource(source) {
  const payload = await fetchText(source.url);
  if (!payload) {
    return [];
  }

  if (source.id === 'github-trending') {
    return extractGitHubCandidates(source, payload);
  }

  return extractRssCandidates(source, payload);
}

async function run() {
  const tools = readExistingTools();
  const queue = readQueue();
  const existingNames = new Set(tools.map((tool) => tool.name.toLowerCase()));
  const existingDomains = new Set(tools.map((tool) => tool.domain.toLowerCase()));
  const queuedIds = new Set(queue.candidates.map((candidate) => candidate.id));
  const discoveredAt = new Date().toISOString();
  const additions = [];

  for (const source of sources) {
    if (additions.length >= maxCandidatesPerRun) {
      break;
    }

    const rawCandidates = await collectFromSource(source);
    for (const candidate of rawCandidates) {
      const name = normalizeName(candidate.name);
      if (!name || existingNames.has(name.toLowerCase())) {
        continue;
      }

      const proposedWebsite = candidate.proposedWebsite || null;
      let proposedDomain = null;
      if (proposedWebsite) {
        try {
          proposedDomain = new URL(proposedWebsite).hostname.replace(/^www\./i, '').toLowerCase();
        } catch {
          continue;
        }
      }

      if (proposedDomain && existingDomains.has(proposedDomain)) {
        continue;
      }

      const id = candidateId(source.id, name);
      if (queuedIds.has(id)) {
        continue;
      }

      additions.push({
        id,
        status: 'pending_review',
        source: {
          id: source.id,
          label: source.label,
          url: candidate.sourceUrl
        },
        discoveredAt,
        name,
        description: candidate.description,
        proposedWebsite,
        proposedDomain,
        categorySuggestion: source.categorySuggestion,
        repository: candidate.repository || null,
        review: {
          officialWebsiteConfirmed: false,
          duplicateChecked: false,
          contentQualityChecked: false,
          termsReviewed: false,
          reviewer: null,
          reviewedAt: null,
          notes: null
        }
      });

      queuedIds.add(id);
      if (additions.length >= maxCandidatesPerRun) {
        break;
      }
    }
  }

  queue.updatedAt = discoveredAt;
  queue.candidates = [...additions, ...queue.candidates].slice(0, 1000);
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  console.log(`Queued ${additions.length} tool candidates for qualification. Only candidates passing all quality gates can publish automatically.`);
}

run().catch((error) => {
  console.error(`Candidate collection failed: ${error.message}`);
  process.exit(1);
});
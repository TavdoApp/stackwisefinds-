const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');

const draftPath = path.join(__dirname, '..', 'data', 'reddit-content-drafts.json');
const maxDraftsPerRun = 20;
const maxQueueSize = 1000;

const sources = [
  { subreddit: 'SaaS', query: 'alternative' },
  { subreddit: 'SaaS', query: 'recommendations' },
  { subreddit: 'artificial', query: 'best tool' },
  { subreddit: 'webdev', query: 'best stack' },
  { subreddit: 'marketing', query: 'automation tool' },
  { subreddit: 'ecommerce', query: 'shopify alternative' },
  { subreddit: 'realestate', query: 'best crm' },
  { subreddit: 'automation', query: 'n8n make' }
];

function fetchText(url) {
  return new Promise((resolve) => {
    const request = https.get(url, {
      headers: {
        Accept: 'application/atom+xml, application/xml, text/xml, */*',
        'User-Agent': 'StakDockEditorialResearch/1.0 (+https://stakdock.com)'
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
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isBuyerQuestion(title) {
  if (title.length < 20 || title.length > 180) {
    return false;
  }

  return /\?|\b(best|how|what|which|where|why|alternative|recommend|suggestion|tool|software|stack|crm|automation)\b/i.test(title);
}

function inferIntent(question) {
  const lower = question.toLowerCase();
  if (lower.includes('alternative')) return 'alternatives';
  if (lower.includes('crm')) return 'crm-selection';
  if (lower.includes('automation')) return 'automation';
  if (lower.includes('ai') || lower.includes('model')) return 'ai-tools';
  return 'tool-selection';
}

function readDraftQueue() {
  if (!fs.existsSync(draftPath)) {
    return { schemaVersion: 1, updatedAt: null, drafts: [] };
  }

  const queue = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
  return {
    schemaVersion: 1,
    updatedAt: queue.updatedAt || null,
    drafts: Array.isArray(queue.drafts) ? queue.drafts : []
  };
}

function extractEntries(xml, source) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];

  return entries.map((entry) => {
    const content = entry[1];
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = content.match(/<link[^>]+href="([^"]+)"[^>]*>/i);
    const updatedMatch = content.match(/<updated>([^<]+)<\/updated>/i);
    const question = titleMatch ? decodeText(titleMatch[1]) : '';
    const sourceUrl = linkMatch ? linkMatch[1] : '';

    if (!question || !sourceUrl || !isBuyerQuestion(question)) {
      return null;
    }

    return {
      question,
      sourceUrl,
      source: {
        platform: 'reddit',
        subreddit: source.subreddit,
        searchQuery: source.query
      },
      sourcePublishedAt: updatedMatch ? updatedMatch[1] : null
    };
  }).filter(Boolean);
}

async function collectDrafts() {
  const collected = [];

  for (const source of sources) {
    const url = `https://www.reddit.com/r/${source.subreddit}/search.rss?q=${encodeURIComponent(source.query)}&restrict_sr=on&sort=new`;
    const xml = await fetchText(url);
    if (xml) {
      collected.push(...extractEntries(xml, source));
    }
  }

  return collected;
}

async function run() {
  const queue = readDraftQueue();
  const knownSources = new Set(queue.drafts.map((draft) => draft.sourceUrl));
  const discoveredAt = new Date().toISOString();
  const additions = [];

  for (const candidate of await collectDrafts()) {
    if (knownSources.has(candidate.sourceUrl) || additions.length >= maxDraftsPerRun) {
      continue;
    }

    const id = crypto.createHash('sha256').update(candidate.sourceUrl).digest('hex').slice(0, 16);
    additions.push({
      id,
      status: 'pending_review',
      question: candidate.question,
      suggestedSlug: slugify(candidate.question),
      intent: inferIntent(candidate.question),
      source: candidate.source,
      sourceUrl: candidate.sourceUrl,
      sourcePublishedAt: candidate.sourcePublishedAt,
      discoveredAt,
      editorial: {
        duplicateChecked: false,
        searchIntentValidated: false,
        sourceReviewed: false,
        answerResearchComplete: false,
        reviewer: null,
        reviewedAt: null,
        notes: null
      }
    });
    knownSources.add(candidate.sourceUrl);
  }

  queue.updatedAt = discoveredAt;
  queue.drafts = [...additions, ...queue.drafts].slice(0, maxQueueSize);
  fs.writeFileSync(draftPath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  console.log(`Queued ${additions.length} Reddit research drafts for editorial review. No articles were published automatically.`);
}

run().catch((error) => {
  console.error(`Reddit draft collection failed: ${error.message}`);
  process.exit(1);
});
const fs = require('fs');
const https = require('https');
const path = require('path');
const { readAllTools } = require('./toolData.cjs');

const apiKey = process.env.OPENPAGERANK_API_KEY;
const cachePath = path.join(__dirname, '..', 'data', 'openpagerank-cache.json');

function readCache() {
  if (!fs.existsSync(cachePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch {
    return {};
  }
}

function writeCache(data) {
  fs.writeFileSync(cachePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function fetchPageRanks(domains) {
  if (!apiKey || !domains || domains.length === 0) return Promise.resolve({});

  // Batch domains in groups of 100 max per request
  const batch = domains.slice(0, 100);
  const query = batch.map((d, i) => `domains%5B${i}%5D=${encodeURIComponent(d)}`).join('&');
  const url = `https://openpagerank.com/api/v1.0/getPageRank?${query}`;

  return new Promise((resolve) => {
    const options = {
      headers: {
        'API-OPR': apiKey
      },
      timeout: 10000
    };

    const req = https.get(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const results = {};
          if (parsed && Array.isArray(parsed.response)) {
            for (const item of parsed.response) {
              if (item && item.domain) {
                results[item.domain.toLowerCase()] = {
                  rankDecimal: item.page_rank_decimal || 0,
                  rankInteger: item.page_rank_integer || 0,
                  globalRank: item.rank || 'N/A'
                };
              }
            }
          }
          resolve(results);
        } catch {
          resolve({});
        }
      });
    });

    req.on('error', () => resolve({}));
    req.on('timeout', () => { req.destroy(); resolve({}); });
  });
}

async function run() {
  if (!apiKey) {
    console.log('[OpenPageRank] OPENPAGERANK_API_KEY environment variable missing. Skipping live domain authority sync.');
    return;
  }

  console.log('[OpenPageRank] Starting Real Domain Authority Sync...');
  const tools = readAllTools();
  const cache = readCache();
  const domainsToFetch = [];

  for (const tool of tools) {
    const domain = (tool.domain || '').toLowerCase().trim();
    if (domain && !cache[domain]) {
      domainsToFetch.push(domain);
    }
  }

  if (domainsToFetch.length === 0) {
    console.log(`[OpenPageRank] Cache up-to-date for all ${tools.length} tool domains.`);
    return;
  }

  console.log(`[OpenPageRank] Querying real PageRank authority scores for ${domainsToFetch.length} new domains...`);
  const fetched = await fetchPageRanks(domainsToFetch);

  const updatedCache = { ...cache, ...fetched };
  writeCache(updatedCache);
  console.log(`[OpenPageRank] Successfully updated cache with ${Object.keys(fetched).length} real domain authority scores.`);
}

if (require.main === module) {
  run().catch(err => {
    console.error('OpenPageRank Sync error:', err);
    process.exit(0); // Non-blocking exit
  });
}

module.exports = { fetchPageRanks, readCache };

/**
 * StakDock Detailed Recovery Batch #1 Audit & Mapping Generator
 */

const fs = require('fs');
const path = require('path');

const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
const preQueriesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'pre-crash', 'Queries.csv');
const postQueriesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'post-crash', 'Queries.csv');

function parseCsv(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    rows.push({
      item: cols[0],
      clicks: parseInt(cols[1], 10) || 0,
      impressions: parseInt(cols[2], 10) || 0,
      ctr: parseFloat((cols[3] || '0%').replace('%', '')) || 0,
      position: parseFloat(cols[4]) || 0
    });
  }
  return rows;
}

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const allItems = recoveryData.items || [];
const itemsMap = new Map(allItems.map(i => [i.url, i]));

const preQueries = parseCsv(preQueriesPath);
const postQueries = parseCsv(postQueriesPath);

// Target 20 URLs for Batch #1
const batch1Urls = [
  // Software (6)
  { url: '/software/microsoft-power-automate/', type: 'software', slug: 'microsoft-power-automate', terms: ['power automate', 'microsoft power automate'] },
  { url: '/software/all-in-one-seo-aioseo/', type: 'software', slug: 'all-in-one-seo-aioseo', terms: ['all in one seo', 'aioseo'] },
  { url: '/software/screaming-frog-seo-spider/', type: 'software', slug: 'screaming-frog-seo-spider', terms: ['screaming frog'] },
  { url: '/software/seoclarity/', type: 'software', slug: 'seoclarity', terms: ['seoclarity', 'seo clarity'] },
  { url: '/software/appsumo/', type: 'software', slug: 'appsumo', terms: ['appsumo'] },
  { url: '/software/hetzner/', type: 'software', slug: 'hetzner', terms: ['hetzner'] },

  // Alternatives (6)
  { url: '/alternatives/invoice-ninja/', type: 'alternatives', slug: 'invoice-ninja', terms: ['invoice ninja', 'invoicing'] },
  { url: '/alternatives/se-ranking/', type: 'alternatives', slug: 'se-ranking', terms: ['se ranking'] },
  { url: '/alternatives/accuranker/', type: 'alternatives', slug: 'accuranker', terms: ['accuranker'] },
  { url: '/alternatives/funnel-io/', type: 'alternatives', slug: 'funnel-io', terms: ['funnel io', 'funnel.io'] },
  { url: '/alternatives/databox/', type: 'alternatives', slug: 'databox', terms: ['databox'] },
  { url: '/alternatives/albacross/', type: 'alternatives', slug: 'albacross', terms: ['albacross'] },

  // VS Comparisons (4)
  { url: '/vs/moz-pro-vs-se-ranking/', type: 'vs', slug: 'moz-pro-vs-se-ranking', terms: ['moz pro vs se ranking', 'moz vs se ranking'] },
  { url: '/vs/screaming-frog-seo-spider-vs-se-ranking/', type: 'vs', slug: 'screaming-frog-seo-spider-vs-se-ranking', terms: ['screaming frog vs se ranking'] },
  { url: '/vs/aws-vs-google-cloud/', type: 'vs', slug: 'aws-vs-google-cloud', terms: ['aws vs google cloud', 'aws vs gcp'] },
  { url: '/vs/lancedb-vs-surrealdb/', type: 'vs', slug: 'lancedb-vs-surrealdb', terms: ['lancedb vs surrealdb', 'surrealdb vs lancedb'] },

  // Best / Category (4)
  { url: '/best/invoicing/', type: 'best', slug: 'invoicing', terms: ['invoicing'] },
  { url: '/best/seo-analytics/', type: 'best', slug: 'seo-analytics', terms: ['seo analytics', 'all in one seo'] },
  { url: '/best/crm/', type: 'best', slug: 'crm', terms: ['crm'] },
  { url: '/best/ai-coding-dev/', type: 'best', slug: 'ai-coding-dev', terms: ['coding', 'developer'] }
];

const batchDetails = batch1Urls.map(target => {
  const item = itemsMap.get(target.url) || {};
  
  // Find matching queries from both exports
  const matchedQueries = [];
  const seenQ = new Set();

  [...preQueries, ...postQueries].forEach(q => {
    const qLower = q.item.toLowerCase();
    const isMatch = target.terms.some(t => qLower.includes(t));
    if (isMatch && !seenQ.has(q.item)) {
      seenQ.add(q.item);
      matchedQueries.push(q);
    }
  });

  matchedQueries.sort((a, b) => b.impressions - a.impressions);

  return {
    url: target.url,
    pageType: target.type,
    recoveryState: item.recoveryState,
    preCrash: item.preCrash || {},
    postCrash: item.postCrash || {},
    qualityScore: item.qualityScore,
    queries: matchedQueries.slice(0, 8)
  };
});

const outputPath = path.join(__dirname, '..', '..', 'reports', 'recovery-batch-1-plan.json');
fs.writeFileSync(outputPath, JSON.stringify(batchDetails, null, 2), 'utf8');

console.log(`✨ Generated ${outputPath} with ${batchDetails.length} detailed recovery candidate plans.`);

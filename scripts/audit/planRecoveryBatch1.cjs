/**
 * StakDock Recovery Batch #1 & GSC Query Matcher
 */

const fs = require('fs');
const path = require('path');

const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
const preQueriesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'pre-crash', 'Queries.csv');
const postQueriesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'post-crash', 'Queries.csv');
const prePagesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'pre-crash', 'Pages.csv');
const postPagesPath = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'post-crash', 'Pages.csv');

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
const prePages = parseCsv(prePagesPath);
const postPages = parseCsv(postPagesPath);

console.log(`Loaded ${allItems.length} recovery items, ${preQueries.length} pre queries, ${postQueries.length} post queries.`);

// Function to match queries to pages
function findMatchingQueries(toolSlug, toolName, categorySlug) {
  const matched = [];
  const cleanSlug = toolSlug.toLowerCase().replace(/-/g, ' ');
  const cleanName = (toolName || '').toLowerCase();

  const allQ = [...preQueries, ...postQueries];
  const seenQ = new Set();

  for (const q of allQ) {
    const qText = q.item.toLowerCase();
    let isMatch = false;

    if (cleanName && qText.includes(cleanName)) isMatch = true;
    if (cleanSlug && qText.includes(cleanSlug)) isMatch = true;
    if (categorySlug && qText.includes(categorySlug.replace(/-/g, ' '))) isMatch = true;

    if (isMatch && !seenQ.has(q.item)) {
      seenQ.add(q.item);
      matched.push(q);
    }
  }

  // Sort by impressions descending
  matched.sort((a, b) => b.impressions - a.impressions);
  return matched;
}

// Inspect candidate URLs for Recovery Batch #1
const candidates = [
  // Software Profiles (6)
  '/software/microsoft-power-automate/',
  '/software/all-in-one-seo-aioseo/',
  '/software/screaming-frog-seo-spider/',
  '/software/seoclarity/',
  '/software/hetzner/',
  '/software/security-onion/',
  
  // Alternatives Hubs (6)
  '/alternatives/invoice-ninja/',
  '/alternatives/se-ranking/',
  '/alternatives/accuranker/',
  '/alternatives/funnel-io/',
  '/alternatives/databox/',
  '/alternatives/homarr-dashboard/',

  // VS Comparisons (4)
  '/vs/opensearch-vs-turbopuffer/',
  '/vs/moz-pro-vs-se-ranking/',
  '/vs/screaming-frog-seo-spider-vs-se-ranking/',
  '/vs/basecamp-vs-planview-leankit-clarizen/',

  // Best / Category Hubs (4)
  '/best/invoicing/',
  '/best/seo-analytics/',
  '/best/workflow-automation/',
  '/best/crm/'
];

console.log('\n--- EXTRACTING GSC QUERIES FOR RECOVERY BATCH #1 ---');
const report = candidates.map(url => {
  const item = itemsMap.get(url) || {};
  let slug = url.split('/')[2] || '';
  let toolName = slug.replace(/-/g, ' ');
  let queries = findMatchingQueries(slug, toolName, slug);
  return {
    url,
    pageType: item.pageType,
    recoveryState: item.recoveryState,
    preCrash: item.preCrash || {},
    postCrash: item.postCrash || {},
    qualityScore: item.qualityScore,
    queries: queries.slice(0, 10)
  };
});

console.log(JSON.stringify(report, null, 2));

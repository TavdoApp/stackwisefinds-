/**
 * Diagnostic script to trace exact count of P, R, K, Q, T and sitemap URLs
 */
const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../toolData.cjs');

const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryItems = recoveryData.items || [];
const recoveryMap = new Map(recoveryItems.map(item => [item.url, item]));

const distDir = path.join(__dirname, '..', '..', 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');

const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
const sitemapUrls = new Set(locMatches.map(m => m.replace(/<\/?loc>/g, '').replace('https://stakdock.com', '')));

console.log('=== GSC RECOVERY MAP BREAKDOWN ===');
const stateCounts = {};
recoveryItems.forEach(i => {
  stateCounts[i.recoveryState] = (stateCounts[i.recoveryState] || 0) + 1;
});
console.log('Recovery map counts:', stateCounts);
console.log('Total recovery map items:', recoveryItems.length);
console.log('Sitemap URL count:', sitemapUrls.size);

console.log('\n=== RECOVERY STATES IN SITEMAP ===');
const sitemapStateCounts = {};
sitemapUrls.forEach(url => {
  const item = recoveryMap.get(url);
  if (!item) {
    console.log('❌ Sitemap URL not in recovery map:', url);
  } else {
    sitemapStateCounts[item.recoveryState] = (sitemapStateCounts[item.recoveryState] || 0) + 1;
  }
});
console.log('Sitemap states:', sitemapStateCounts);

console.log('\n=== CHECKING ALL P/R/K URLS IN SITEMAP ===');
recoveryItems.filter(i => ['P', 'R', 'K'].includes(i.recoveryState)).forEach(i => {
  if (!sitemapUrls.has(i.url)) {
    console.log(`❌ ${i.recoveryState} URL missing from sitemap: ${i.url}`);
  }
});

console.log('\n=== CHECKING WHICH PAGES PRERENDER BUILDS ===');
// Let's see all calls in prerenderDistPages.cjs
const tools = readAllTools();
const categories = readCategories();

let builtPages = [];

// 1. Software
tools.forEach(t => {
  if (t && t.id) builtPages.push({ type: 'software', url: `/software/${t.id}/` });
});

// 2. Alternatives
tools.forEach(t => {
  if (t && t.id) builtPages.push({ type: 'alternatives', url: `/alternatives/${t.id}/` });
});

// 3. VS pairs
const approvedFlagshipComparisons = [
  { toolAId: 'cursor-ai', toolBId: 'github-copilot', vsSlug: 'cursor-ai-vs-github-copilot', isFlagship: true },
  { toolAId: 'moz-pro', toolBId: 'se-ranking', vsSlug: 'moz-pro-vs-se-ranking', isFlagship: true },
  { toolAId: 'screaming-frog-seo-spider', toolBId: 'se-ranking', vsSlug: 'screaming-frog-seo-spider-vs-se-ranking', isFlagship: true }
];

function getVsPairsList(tools) {
  const map = new Map();
  const catMap = {};
  approvedFlagshipComparisons.forEach(f => {
    const tA = tools.find(t => t.id === f.toolAId);
    const tB = tools.find(t => t.id === f.toolBId);
    if (tA && tB) {
      map.set(f.vsSlug, { tA, tB, vsSlug: f.vsSlug, isFlagship: true });
    }
  });
  tools.forEach(t => {
    if (!t || !t.category) return;
    const c = String(t.category).toLowerCase();
    if (!catMap[c]) catMap[c] = [];
    catMap[c].push(t);
  });
  Object.values(catMap).forEach(list => {
    if (list.length < 2) return;
    const top = list.slice(0, 6);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const slug = `${top[i].id}-vs-${top[j].id}`;
        if (!map.has(slug)) {
          map.set(slug, { tA: top[i], tB: top[j], vsSlug: slug, isFlagship: false });
        }
      }
    }
  });
  return Array.from(map.values());
}

const vsPairs = getVsPairsList(tools);
vsPairs.forEach(p => {
  builtPages.push({ type: 'vs', url: `/vs/${p.vsSlug}/` });
});

// 4. Best categories & direct categories
categories.forEach(c => {
  if (!c || !c.id || c.id === 'all') return;
  const matched = tools.filter(t => t.category === c.id);
  if (matched.length === 0) return;
  builtPages.push({ type: 'best', url: `/best/${c.id}/` });
  builtPages.push({ type: 'category', url: `/category/${c.id}/` });
});

// 5. Semantic aliases
const semanticBuyerAliases = [
  { slug: 'all-in-one-seo-software', category: 'seo-analytics' },
  { slug: 'workflow-automation', category: 'nocode-databases' },
  { slug: 'document-automation', category: 'esign-documents' },
  { slug: 'ai-video-generators', category: 'trending-video-ai' },
  { slug: 'real-estate-crms', category: 'crm' }
];
semanticBuyerAliases.forEach(a => {
  builtPages.push({ type: 'alias', url: `/best/${a.slug}/` });
});

// 6. Guides
const { officialGuides } = require('../guidesData.cjs');
officialGuides.forEach(g => {
  builtPages.push({ type: 'guides', url: `/guides/${g.slug || g.id}/` });
});

// 7. Core pages
const corePages = [
  { path: '/', title: 'Home' },
  { path: '/categories/', title: 'Categories' },
  { path: '/alternatives/', title: 'Alternatives' },
  { path: '/vs/', title: 'Comparisons' },
  { path: '/guides/', title: 'Guides' },
  { path: '/privacy/', title: 'Privacy' },
  { path: '/terms/', title: 'Terms' }
];
corePages.forEach(p => {
  builtPages.push({ type: 'core', url: p.path });
});

console.log('Total pages generated in buildPages:', builtPages.length);

let prerenderIndexed = 0;
let prerenderQuarantined = 0;
let prerenderTechnical = 0;
let prerenderUnmapped = [];

builtPages.forEach(p => {
  const item = recoveryMap.get(p.url);
  if (!item) {
    prerenderQuarantined++;
    prerenderUnmapped.push(p);
  } else if (item.recoveryState === 'T') {
    prerenderTechnical++;
  } else if (item.recoveryState === 'Q') {
    prerenderQuarantined++;
  } else {
    prerenderIndexed++;
  }
});

console.log(`Prerender stats calculation on built pages:`);
console.log(`  Indexed (P/R/K): ${prerenderIndexed}`);
console.log(`  Quarantined (Q/Unmapped): ${prerenderQuarantined}`);
console.log(`  Technical (T): ${prerenderTechnical}`);
console.log(`  Unmapped count: ${prerenderUnmapped.length}`);
if (prerenderUnmapped.length > 0) {
  console.log('  Unmapped items:', prerenderUnmapped);
}

// Compare which P/R/K URL is in recovery map but NOT built by prerender, or vice versa
const builtUrlsSet = new Set(builtPages.map(p => p.url));
recoveryItems.filter(i => ['P', 'R', 'K'].includes(i.recoveryState)).forEach(i => {
  if (!builtUrlsSet.has(i.url)) {
    console.log(`⚠️  P/R/K URL in recovery map NOT built by prerender: ${i.url} (${i.recoveryState})`);
  }
});

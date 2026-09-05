const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function runAudit() {
  const tools = readAllTools();
  const categories = readCategories();
  const toolMap = new Map(tools.map(t => [t.id, t]));
  const catMap = new Map(categories.map(c => [c.id, c]));

  const seedModule = await import('../src/data/stackIntelligenceSeedData.js');
  const seedTools = seedModule.seedSoftwareTools || [];
  const seedMap = new Map(seedTools.map(t => [t.toolId, t]));

  const gscMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
  const gscMapData = JSON.parse(fs.readFileSync(gscMapPath, 'utf8'));
  const allRoutes = gscMapData.items || [];

  // Parse GSC historical exports to merge impression data
  function parseCsv(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(l => {
      const parts = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < l.length; i++) {
        const c = l[i];
        if (c === '"') inQuotes = !inQuotes;
        else if (c === ',' && !inQuotes) {
          parts.push(cur.trim().replace(/^"|"$/g, ''));
          cur = '';
        } else cur += c;
      }
      parts.push(cur.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = parts[idx] !== undefined ? parts[idx] : '';
      });
      return obj;
    });
  }

  const prePages = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'pre-crash', 'Pages.csv'));
  const postPages = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'post-crash', 'Pages.csv'));

  const metricsByUrl = new Map();
  prePages.forEach(p => {
    let cleanUrl = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
    if (!cleanUrl.endsWith('/')) cleanUrl = cleanUrl + '/';
    const existing = metricsByUrl.get(cleanUrl) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0, prePos: 0, prePosCount: 0 };
    existing.preImpr += parseFloat(p.Impressions) || 0;
    existing.preClicks += parseFloat(p.Clicks) || 0;
    if (p.Position) {
      existing.prePos += parseFloat(p.Position) || 0;
      existing.prePosCount++;
    }
    metricsByUrl.set(cleanUrl, existing);
  });

  postPages.forEach(p => {
    let cleanUrl = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
    if (!cleanUrl.endsWith('/')) cleanUrl = cleanUrl + '/';
    const existing = metricsByUrl.get(cleanUrl) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0, prePos: 0, prePosCount: 0 };
    existing.postImpr += parseFloat(p.Impressions) || 0;
    existing.postClicks += parseFloat(p.Clicks) || 0;
    metricsByUrl.set(cleanUrl, existing);
  });

  console.log(`Total routes in inventory: ${allRoutes.length}`);
  console.log(`Tools in saasData: ${tools.length}`);
  console.log(`Stack Intelligence seed tools: ${seedTools.length}`);
  console.log(`URLs with GSC pre/post impression history: ${metricsByUrl.size}`);

  // Breakdown of routes
  const routeBreakdown = {
    core: [],
    software: [],
    alternatives: [],
    vs: [],
    best: [],
    category: [],
    guides: [],
    other: []
  };

  allRoutes.forEach(item => {
    const url = item.url;
    const gsc = metricsByUrl.get(url) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0 };
    item.preImpr = gsc.preImpr;
    item.preClicks = gsc.preClicks;
    item.postImpr = gsc.postImpr;
    item.postClicks = gsc.postClicks;

    if (url === '/' || url === '/categories/' || url === '/ranking/' || url === '/advertise/' || url === '/submit/' || url === '/stack-builder/' || url === '/about/' || url === '/editorial-methodology/' || url === '/terms/' || url === '/privacy/' || url === '/refund/') {
      routeBreakdown.core.push(item);
    } else if (url.startsWith('/software/')) {
      routeBreakdown.software.push(item);
    } else if (url.startsWith('/alternatives/')) {
      routeBreakdown.alternatives.push(item);
    } else if (url.startsWith('/vs/')) {
      routeBreakdown.vs.push(item);
    } else if (url.startsWith('/best/')) {
      routeBreakdown.best.push(item);
    } else if (url.startsWith('/category/')) {
      routeBreakdown.category.push(item);
    } else if (url.startsWith('/guides/')) {
      routeBreakdown.guides.push(item);
    } else {
      routeBreakdown.other.push(item);
    }
  });

  console.log('\n--- Route Breakdown ---');
  Object.keys(routeBreakdown).forEach(k => {
    console.log(`${k}: ${routeBreakdown[k].length}`);
  });

  // Analyze GSC high-performing routes
  const highDemandRoutes = allRoutes.filter(r => r.preImpr > 50 || r.postImpr > 10).sort((a, b) => (b.preImpr + b.postImpr * 5) - (a.preImpr + a.postImpr * 5));
  console.log(`\nHigh demand routes (preImpr > 50 or postImpr > 10): ${highDemandRoutes.length}`);
  console.log('Top 20 high demand routes:');
  highDemandRoutes.slice(0, 20).forEach(r => {
    console.log(`- ${r.url} | type: ${r.pageType} | state: ${r.recoveryState} | preImpr: ${r.preImpr} | preClicks: ${r.preClicks} | postImpr: ${r.postImpr}`);
  });

  // Analyze duplicate routes: e.g. /category/ vs /best/
  console.log(`\nCategory duplicate check:`);
  let catDuplicates = 0;
  routeBreakdown.category.forEach(catRoute => {
    const slug = catRoute.url.replace(/^\/category\//, '').replace(/\/$/, '');
    const bestEquivalent = `/best/${slug}/`;
    const hasBest = allRoutes.some(r => r.url === bestEquivalent);
    if (hasBest) catDuplicates++;
  });
  console.log(`Found ${catDuplicates} /category/ routes that duplicate /best/ routes (should be consolidated/redirected).`);

  // Analyze VS pair validity
  console.log(`\nVS Pair Analysis:`);
  let invalidVs = 0;
  let crossCatVs = 0;
  let validVs = 0;
  routeBreakdown.vs.forEach(vsRoute => {
    const slug = vsRoute.url.replace(/^\/vs\//, '').replace(/\/$/, '');
    const parts = slug.split('-vs-');
    if (parts.length !== 2) {
      invalidVs++;
      return;
    }
    const tA = toolMap.get(parts[0]);
    const tB = toolMap.get(parts[1]);
    if (!tA || !tB) {
      invalidVs++;
    } else if (tA.category !== tB.category) {
      crossCatVs++;
    } else {
      validVs++;
    }
  });
  console.log(`VS Routes: Total=${routeBreakdown.vs.length}, Valid Same-Category=${validVs}, Cross-Category=${crossCatVs}, Missing Tools/Invalid=${invalidVs}`);

  // Analyze Alternatives validity
  console.log(`\nAlternatives Analysis:`);
  let validAlts = 0;
  let missingToolAlts = 0;
  let thinAlts = 0;
  routeBreakdown.alternatives.forEach(altRoute => {
    const slug = altRoute.url.replace(/^\/alternatives\//, '').replace(/\/$/, '');
    const tool = toolMap.get(slug);
    if (!tool) {
      missingToolAlts++;
    } else {
      const explicitAlts = Array.isArray(tool.alternatives) ? tool.alternatives : [];
      const catMatches = tools.filter(t => t.category === tool.category && t.id !== tool.id);
      if (explicitAlts.length === 0 && catMatches.length < 2) {
        thinAlts++;
      } else {
        validAlts++;
      }
    }
  });
  console.log(`Alternatives Routes: Total=${routeBreakdown.alternatives.length}, Valid=${validAlts}, Thin=<2 options=${thinAlts}, Missing Tool=${missingToolAlts}`);
}

runAudit().catch(console.error);

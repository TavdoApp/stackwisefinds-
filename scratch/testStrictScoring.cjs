const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function testStrict() {
  const tools = readAllTools();
  const categories = readCategories();
  const toolMap = new Map(tools.map(t => [t.id, t]));
  const catMap = new Map(categories.map(c => [c.id, c]));

  const seedModule = await import('../src/data/stackIntelligenceSeedData.js');
  const seedTools = seedModule.seedSoftwareTools || [];
  const seedMap = new Map(seedTools.map(t => [t.toolId, t]));

  const gscMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
  const existingMapData = JSON.parse(fs.readFileSync(gscMapPath, 'utf8'));
  const allRoutes = existingMapData.items || [];

  // Parse GSC CSVs
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

  const gscDataMap = new Map();
  prePages.forEach(p => {
    let cleanUrl = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
    if (!cleanUrl.endsWith('/')) cleanUrl = cleanUrl + '/';
    const cur = gscDataMap.get(cleanUrl) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0, prePos: 0 };
    cur.preImpr += parseFloat(p.Impressions) || 0;
    cur.preClicks += parseFloat(p.Clicks) || 0;
    if (p.Position) cur.prePos = parseFloat(p.Position) || 0;
    gscDataMap.set(cleanUrl, cur);
  });

  postPages.forEach(p => {
    let cleanUrl = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
    if (!cleanUrl.endsWith('/')) cleanUrl = cleanUrl + '/';
    const cur = gscDataMap.get(cleanUrl) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0, prePos: 0 };
    cur.postImpr += parseFloat(p.Impressions) || 0;
    cur.postClicks += parseFloat(p.Clicks) || 0;
    gscDataMap.set(cleanUrl, cur);
  });

  const strictClassified = {
    P: [], // Flagship / Stack Intelligence / Dedicated Renderers
    R: [], // High Demand GSC Rebuilt Routes
    K: [], // Curated & Verified Multi-Feature Assets
    Q: [], // Quarantined / Supporting Tier (noindex, follow)
    T: [], // Technical Legal (noindex, follow)
    D: []  // Consolidated (301 redirect)
  };

  allRoutes.forEach(route => {
    const url = route.url;
    const gsc = gscDataMap.get(url) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0 };
    const hasDemand = gsc.preImpr > 30 || gsc.postImpr > 5 || gsc.preClicks > 0 || gsc.postClicks > 0;

    // 1. Core pages
    if (url === '/' || url === '/categories/' || url === '/ranking/' || url === '/advertise/' || url === '/submit/' || url === '/about/' || url === '/editorial-methodology/' || url === '/stack-builder/') {
      strictClassified.P.push({ url, pageType: 'core', reason: 'Core Product & Directory Asset' });
      return;
    }
    if (url === '/terms/' || url === '/privacy/' || url === '/refund/') {
      strictClassified.T.push({ url, pageType: 'core', reason: 'Technical Compliance' });
      return;
    }

    // 2. Category duplicate alias
    if (url.startsWith('/category/')) {
      strictClassified.D.push({ url, pageType: 'category', reason: 'Consolidated into /best/' });
      return;
    }

    // 3. Best category hubs
    if (url.startsWith('/best/')) {
      const slug = url.replace(/^\/best\//, '').replace(/\/$/, '');
      const matchedTools = tools.filter(t => t.category === slug);
      if (matchedTools.length >= 3 || hasDemand) {
        strictClassified.P.push({ url, pageType: 'best', reason: `Curated Category Hub (${matchedTools.length} tools)` });
      } else {
        strictClassified.Q.push({ url, pageType: 'best', reason: 'Thin category' });
      }
      return;
    }

    // 4. Guides
    if (url.startsWith('/guides/')) {
      strictClassified.P.push({ url, pageType: 'guides', reason: 'Editorial Guide & Cost Index' });
      return;
    }

    // 5. Software
    if (url.startsWith('/software/')) {
      const slug = url.replace(/^\/software\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);

      if (seedTool) {
        strictClassified.P.push({ url, pageType: 'software', reason: 'Stack Intelligence Enriched Tool' });
      } else if (hasDemand) {
        strictClassified.R.push({ url, pageType: 'software', reason: `High Historical GSC Demand (${gsc.preImpr + gsc.postImpr} impr)` });
      } else if (tool && Array.isArray(tool.features) && tool.features.length >= 3 && tool.description && tool.description.length > 80 && tool.bestFor && tool.pricing && tool.pricing !== 'Freemium') {
        strictClassified.K.push({ url, pageType: 'software', reason: 'Rich Structured Tool' });
      } else {
        strictClassified.Q.push({ url, pageType: 'software', reason: 'Quarantined Supporting Catalog' });
      }
      return;
    }

    // 6. Alternatives
    if (url.startsWith('/alternatives/')) {
      const slug = url.replace(/^\/alternatives\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);
      const explicitAlts = tool && Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length >= 2;

      if (seedTool || explicitAlts) {
        strictClassified.P.push({ url, pageType: 'alternatives', reason: 'Stack Intel / Curated Alternatives Hub' });
      } else if (hasDemand) {
        strictClassified.R.push({ url, pageType: 'alternatives', reason: `High Historical GSC Demand Alternatives (${gsc.preImpr + gsc.postImpr} impr)` });
      } else {
        strictClassified.Q.push({ url, pageType: 'alternatives', reason: 'Quarantined Supporting Alternatives' });
      }
      return;
    }

    // 7. VS
    if (url.startsWith('/vs/')) {
      const slug = url.replace(/^\/vs\//, '').replace(/\/$/, '');
      const parts = slug.split('-vs-');
      const seedA = parts.length === 2 ? seedMap.get(parts[0]) : null;
      const seedB = parts.length === 2 ? seedMap.get(parts[1]) : null;

      if (seedA && seedB) {
        strictClassified.P.push({ url, pageType: 'vs', reason: 'Stack Intel Seed Head-to-Head' });
      } else if (hasDemand && parts.length === 2 && toolMap.has(parts[0]) && toolMap.has(parts[1])) {
        strictClassified.R.push({ url, pageType: 'vs', reason: `High Historical GSC Demand Comparison (${gsc.preImpr + gsc.postImpr} impr)` });
      } else {
        strictClassified.Q.push({ url, pageType: 'vs', reason: 'Quarantined Long-Tail Comparison' });
      }
      return;
    }

    strictClassified.Q.push({ url, pageType: 'other', reason: 'Quarantined' });
  });

  const totalIndex = strictClassified.P.length + strictClassified.R.length + strictClassified.K.length;
  console.log('==============================================');
  console.log('STRICT QUALITY-GATED INDEXABLE FOOTPRINT:');
  console.log('==============================================');
  console.log(`P (Primary Authority):   ${strictClassified.P.length}`);
  console.log(`R (Recovery Demand):     ${strictClassified.R.length}`);
  console.log(`K (Knowledge Verified):  ${strictClassified.K.length}`);
  console.log(`Q (Quarantined/Noindex): ${strictClassified.Q.length}`);
  console.log(`T (Technical Noindex):   ${strictClassified.T.length}`);
  console.log(`D (Consolidated):        ${strictClassified.D.length}`);
  console.log(`----------------------------------------------`);
  console.log(`TOTAL STRICT INDEXABLE SITEMAP FOOTPRINT: ${totalIndex} URLs`);
  console.log('==============================================');

  const byType = {};
  [...strictClassified.P, ...strictClassified.R, ...strictClassified.K].forEach(i => {
    byType[i.pageType] = (byType[i.pageType] || 0) + 1;
  });
  console.log('Indexable Breakdown by Page Type:', byType);
}

testStrict().catch(console.error);

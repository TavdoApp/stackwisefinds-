const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function classifyInventory() {
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

  // Parse GSC historical exports
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

  const classification = {
    indexNow: [],       // A: High data completeness, verified primary provenance, passes all quality gates
    upgradeThenIndex: [], // B: High GSC demand or core Stack Intelligence tool upgraded to full quality specs
    keepNoindex: [],    // C: Lower demand / unverified catalog tools maintained for user site browsing with noindex
    consolidate: [],    // D: Near-duplicates / duplicate taxonomy (e.g. /category/* -> /best/*)
    retire: []          // E: Broken, nonsensical, or invalid routes
  };

  const approvedIndexUrls = new Set();
  const redirects = [];

  allRoutes.forEach(route => {
    const url = route.url;
    const gsc = gscDataMap.get(url) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0 };
    const hasDemand = gsc.preImpr > 30 || gsc.postImpr > 5 || gsc.preClicks > 0 || gsc.postClicks > 0;

    // 1. Core pages
    if (url === '/') {
      classification.indexNow.push({ url, reason: 'Homepage core product & directory hub', pageType: 'core' });
      approvedIndexUrls.add(url);
      return;
    }
    if (url === '/categories/' || url === '/ranking/' || url === '/advertise/' || url === '/submit/' || url === '/about/' || url === '/editorial-methodology/' || url === '/stack-builder/') {
      classification.indexNow.push({ url, reason: 'Core navigational/authority/product asset', pageType: 'core' });
      approvedIndexUrls.add(url);
      return;
    }
    if (url === '/terms/' || url === '/privacy/' || url === '/refund/') {
      classification.keepNoindex.push({ url, reason: 'Technical compliance page (noindex, follow)', pageType: 'core', technical: true });
      return;
    }

    // 2. Category routes -> Duplicate of /best/
    if (url.startsWith('/category/')) {
      const slug = url.replace(/^\/category\//, '').replace(/\/$/, '');
      const target = `/best/${slug}/`;
      classification.consolidate.push({ url, target, reason: 'Consolidated into canonical /best/ equivalent', pageType: 'category' });
      redirects.push({ from: url, to: target });
      return;
    }

    // 3. Best / Category Hubs
    if (url.startsWith('/best/')) {
      const slug = url.replace(/^\/best\//, '').replace(/\/$/, '');
      const matchedTools = tools.filter(t => t.category === slug);
      if (matchedTools.length >= 3 || hasDemand) {
        classification.indexNow.push({ url, reason: `Category hub with ${matchedTools.length} tools and curated guide`, pageType: 'best' });
        approvedIndexUrls.add(url);
      } else {
        classification.keepNoindex.push({ url, reason: `Thin category with <3 tools (${matchedTools.length})`, pageType: 'best' });
      }
      return;
    }

    // 4. Guides
    if (url.startsWith('/guides/')) {
      classification.indexNow.push({ url, reason: 'Curated editorial research guide', pageType: 'guides' });
      approvedIndexUrls.add(url);
      return;
    }

    // 5. Software Pages
    if (url.startsWith('/software/')) {
      const slug = url.replace(/^\/software\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);

      if (!tool) {
        classification.retire.push({ url, reason: 'Unknown tool slug', pageType: 'software' });
        return;
      }

      // Check if tool has Stack Intelligence backing or rich verified data or high historical GSC demand
      const hasRichData = (seedTool !== undefined) || 
                          (Array.isArray(tool.features) && tool.features.length >= 3 && tool.description && tool.description.length > 50) ||
                          (tool.bestFor && tool.pricing && tool.pricing !== 'Freemium');

      if (seedTool || (hasDemand && hasRichData)) {
        classification.indexNow.push({ url, reason: `Enriched software review (Stack Intel: ${!!seedTool}, GSC impr: ${gsc.preImpr + gsc.postImpr})`, pageType: 'software', toolId: slug });
        approvedIndexUrls.add(url);
      } else if (hasDemand) {
        classification.upgradeThenIndex.push({ url, reason: `Historical demand requires enriched schema upgrade (GSC impr: ${gsc.preImpr + gsc.postImpr})`, pageType: 'software', toolId: slug });
        approvedIndexUrls.add(url); // We upgrade them in this rebuild!
      } else {
        classification.keepNoindex.push({ url, reason: 'Standard catalog entry (noindex, follow for user browsing)', pageType: 'software', toolId: slug });
      }
      return;
    }

    // 6. Alternatives Pages
    if (url.startsWith('/alternatives/')) {
      const slug = url.replace(/^\/alternatives\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);

      if (!tool) {
        classification.retire.push({ url, reason: 'Unknown tool slug for alternatives', pageType: 'alternatives' });
        return;
      }

      const explicitAlts = Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length >= 2;
      const catMatches = tools.filter(t => t.category === tool.category && t.id !== tool.id);

      if (seedTool || explicitAlts || (hasDemand && catMatches.length >= 2)) {
        classification.indexNow.push({ url, reason: `Verified alternatives hub (Stack Intel: ${!!seedTool}, Curated: ${explicitAlts}, GSC impr: ${gsc.preImpr + gsc.postImpr})`, pageType: 'alternatives', toolId: slug });
        approvedIndexUrls.add(url);
      } else if (hasDemand) {
        classification.upgradeThenIndex.push({ url, reason: `Historical demand requires curated alternative matrix upgrade (GSC impr: ${gsc.preImpr + gsc.postImpr})`, pageType: 'alternatives', toolId: slug });
        approvedIndexUrls.add(url);
      } else {
        classification.keepNoindex.push({ url, reason: 'Programmatic alternative page (noindex, follow)', pageType: 'alternatives', toolId: slug });
      }
      return;
    }

    // 7. VS Pages
    if (url.startsWith('/vs/')) {
      const slug = url.replace(/^\/vs\//, '').replace(/\/$/, '');
      const parts = slug.split('-vs-');
      if (parts.length !== 2) {
        classification.retire.push({ url, reason: 'Malformed VS URL slug', pageType: 'vs' });
        return;
      }

      const tA = toolMap.get(parts[0]);
      const tB = toolMap.get(parts[1]);

      if (!tA || !tB) {
        classification.retire.push({ url, reason: 'Missing tools in VS pair', pageType: 'vs' });
        return;
      }

      // Check if both tools are Stack Intelligence tools or high demand or flagship pairings
      const seedA = seedMap.get(parts[0]);
      const seedB = seedMap.get(parts[1]);
      const isSeedPair = (seedA && seedB);

      if (isSeedPair || hasDemand) {
        classification.indexNow.push({ url, reason: `High-intent comparison (Seed Pair: ${!!isSeedPair}, GSC impr: ${gsc.preImpr + gsc.postImpr})`, pageType: 'vs' });
        approvedIndexUrls.add(url);
      } else {
        classification.keepNoindex.push({ url, reason: 'Standard comparison pair (noindex, follow)', pageType: 'vs' });
      }
      return;
    }

    // 8. Unclassified
    classification.keepNoindex.push({ url, reason: 'Unclassified route (noindex, follow)', pageType: 'other' });
  });

  console.log('==============================================');
  console.log('SITE-WIDE INVENTORY CLASSIFICATION SUMMARY:');
  console.log('==============================================');
  console.log(`Total Routes Processed: ${allRoutes.length}`);
  console.log(`A — INDEX NOW:           ${classification.indexNow.length}`);
  console.log(`B — UPGRADE THEN INDEX:  ${classification.upgradeThenIndex.length}`);
  console.log(`C — KEEP NOINDEX:        ${classification.keepNoindex.length}`);
  console.log(`D — CONSOLIDATE:         ${classification.consolidate.length}`);
  console.log(`E — REMOVE / RETIRE:     ${classification.retire.length}`);
  console.log(`----------------------------------------------`);
  console.log(`TOTAL INDEXABLE APPROVED SET (A + B): ${approvedIndexUrls.size} URLs`);
  console.log('==============================================');

  // Breakdown by page type of final approved index set
  const indexTypeCounts = {};
  approvedIndexUrls.forEach(url => {
    let pType = 'core';
    if (url.startsWith('/software/')) pType = 'software';
    else if (url.startsWith('/alternatives/')) pType = 'alternatives';
    else if (url.startsWith('/vs/')) pType = 'vs';
    else if (url.startsWith('/best/')) pType = 'best';
    else if (url.startsWith('/guides/')) pType = 'guides';
    indexTypeCounts[pType] = (indexTypeCounts[pType] || 0) + 1;
  });
  console.log('Approved Index Set by Page Type:', indexTypeCounts);

  return { classification, approvedIndexUrls, redirects };
}

classifyInventory().catch(console.error);

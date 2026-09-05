const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

const SEED_ALIASES = {
  'hubspot': 'hubspot-crm',
  'quickbooks-online': 'quickbooks',
  'brevo': 'brevo-crm',
  'convertkit': 'convertkit-kit',
  'medusa': 'medusa-js',
  'neon': 'neon-db'
};

async function buildStrictMasterRecoveryMap() {
  const tools = readAllTools();
  const categories = readCategories();
  const toolMap = new Map(tools.map(t => [t.id, t]));
  const catMap = new Map(categories.map(c => [c.id, c]));

  const seedModule = await import('../src/data/stackIntelligenceSeedData.js');
  const seedTools = seedModule.seedSoftwareTools || [];
  const seedMap = new Map();
  seedTools.forEach(t => {
    seedMap.set(t.toolId, t);
    if (SEED_ALIASES[t.toolId]) {
      seedMap.set(SEED_ALIASES[t.toolId], t);
    }
  });

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

  const updatedItems = [];
  const stateCounts = { P: 0, R: 0, K: 0, Q: 0, T: 0 };
  const typeCounts = {};

  allRoutes.forEach(route => {
    const url = route.url;
    const gsc = gscDataMap.get(url) || { preImpr: 0, preClicks: 0, postImpr: 0, postClicks: 0 };
    const hasDemand = gsc.preImpr > 30 || gsc.postImpr > 5 || gsc.preClicks > 0 || gsc.postClicks > 0;

    let recoveryState = 'Q';
    let tier = 'QUARANTINE';
    let rationale = '';
    let pageType = route.pageType || 'software';

    // 1. Core pages
    if (url === '/' || url === '/categories/' || url === '/ranking/' || url === '/advertise/' || url === '/submit/' || url === '/about/' || url === '/methodology/' || url === '/editorial-methodology/' || url === '/stack-builder/') {
      recoveryState = 'P';
      tier = 'AUTHORITY_CORE';
      rationale = 'Core Product & Authority Directory Asset';
      pageType = 'core';
    } else if (url === '/terms/' || url === '/privacy/' || url === '/refund/') {
      recoveryState = 'T';
      tier = 'TECHNICAL';
      rationale = 'Technical compliance page (noindex, follow)';
      pageType = 'core';
    }
    // 2. Category duplicate alias
    else if (url.startsWith('/category/')) {
      const slug = url.replace(/^\/category\//, '').replace(/\/$/, '');
      recoveryState = 'Q';
      tier = 'CONSOLIDATED';
      rationale = `301 Consolidated into canonical /best/${slug}/ equivalent`;
      pageType = 'category';
    }
    // 3. Best category hubs
    else if (url.startsWith('/best/')) {
      const slug = url.replace(/^\/best\//, '').replace(/\/$/, '');
      const matchedTools = tools.filter(t => t.category === slug);
      if (matchedTools.length >= 3 || hasDemand) {
        recoveryState = 'P';
        tier = 'AUTHORITY_CORE';
        rationale = `Curated Category Hub (${matchedTools.length} tools)`;
      } else {
        recoveryState = 'Q';
        tier = 'QUARANTINE';
        rationale = 'Thin category (<3 tools)';
      }
      pageType = 'best';
    }
    // 4. Guides
    else if (url.startsWith('/guides/')) {
      recoveryState = 'P';
      tier = 'AUTHORITY_CORE';
      rationale = 'Editorial Research Guide & Cost Index';
      pageType = 'guides';
    }
    // 5. Software
    else if (url.startsWith('/software/')) {
      pageType = 'software';
      const slug = url.replace(/^\/software\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);

      if (seedTool) {
        recoveryState = 'P';
        tier = 'AUTHORITY_CORE';
        rationale = 'Stack Intelligence Enriched Tool with verified primary provenance';
      } else if (hasDemand) {
        recoveryState = 'R';
        tier = 'RECOVERY_EXPANSION';
        rationale = `High Historical GSC Demand (${gsc.preImpr + gsc.postImpr} impr) upgraded with structured specs`;
      } else if (tool && Array.isArray(tool.features) && tool.features.length >= 3 && tool.description && tool.description.length > 80 && tool.bestFor && tool.pricing && tool.pricing !== 'Freemium') {
        recoveryState = 'K';
        tier = 'KNOWLEDGE_CORE';
        rationale = 'Rich Structured Software Tool with complete pricing and features';
      } else {
        recoveryState = 'Q';
        tier = 'QUARANTINE';
        rationale = 'Quarantined Supporting Catalog (noindex, follow)';
      }
    }
    // 6. Alternatives
    else if (url.startsWith('/alternatives/')) {
      pageType = 'alternatives';
      const slug = url.replace(/^\/alternatives\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      const seedTool = seedMap.get(slug);
      const explicitAlts = tool && Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length >= 2;

      if (seedTool || explicitAlts) {
        recoveryState = 'P';
        tier = 'AUTHORITY_CORE';
        rationale = 'Stack Intel / Curated Alternatives Hub with architectural differentiators';
      } else if (hasDemand) {
        recoveryState = 'R';
        tier = 'RECOVERY_EXPANSION';
        rationale = `High Historical GSC Demand Alternatives (${gsc.preImpr + gsc.postImpr} impr) with verified category substitutes`;
      } else {
        recoveryState = 'Q';
        tier = 'QUARANTINE';
        rationale = 'Quarantined Supporting Alternatives (noindex, follow)';
      }
    }
    // 7. VS Pages
    else if (url.startsWith('/vs/')) {
      pageType = 'vs';
      const slug = url.replace(/^\/vs\//, '').replace(/\/$/, '');
      const parts = slug.split('-vs-');
      const seedA = parts.length === 2 ? seedMap.get(parts[0]) : null;
      const seedB = parts.length === 2 ? seedMap.get(parts[1]) : null;

      if (seedA && seedB) {
        recoveryState = 'P';
        tier = 'AUTHORITY_CORE';
        rationale = 'Stack Intel Seed Head-to-Head Flagship Comparison';
      } else if (hasDemand && parts.length === 2 && toolMap.has(parts[0]) && toolMap.has(parts[1])) {
        recoveryState = 'R';
        tier = 'RECOVERY_EXPANSION';
        rationale = `High Historical GSC Demand Comparison (${gsc.preImpr + gsc.postImpr} impr) with verified comparison specs`;
      } else {
        recoveryState = 'Q';
        tier = 'QUARANTINE';
        rationale = 'Quarantined Long-Tail Comparison (noindex, follow)';
      }
    }

    stateCounts[recoveryState] = (stateCounts[recoveryState] || 0) + 1;
    typeCounts[pageType] = (typeCounts[pageType] || 0) + 1;

    updatedItems.push({
      url,
      pageType,
      recoveryState,
      tier,
      rationale,
      preImpr: gsc.preImpr,
      preClicks: gsc.preClicks,
      postImpr: gsc.postImpr,
      postClicks: gsc.postClicks,
      prePos: gsc.prePos
    });
  });

  const totalIndexable = (stateCounts.P || 0) + (stateCounts.R || 0) + (stateCounts.K || 0);

  console.log('==============================================');
  console.log('STRICT RECOVERY MAP GENERATED:');
  console.log('==============================================');
  console.log(`Total Routes: ${updatedItems.length}`);
  console.log(`P (Primary Authority):   ${stateCounts.P}`);
  console.log(`R (Recovery Expansion):  ${stateCounts.R}`);
  console.log(`K (Knowledge Verified):  ${stateCounts.K}`);
  console.log(`Q (Quarantined/Noindex): ${stateCounts.Q}`);
  console.log(`T (Technical Noindex):   ${stateCounts.T}`);
  console.log(`----------------------------------------------`);
  console.log(`TOTAL STRICT INDEXABLE SITEMAP FOOTPRINT: ${totalIndexable} URLs`);
  console.log('==============================================');

  const indexableByType = {};
  updatedItems.filter(i => i.recoveryState === 'P' || i.recoveryState === 'R' || i.recoveryState === 'K').forEach(i => {
    indexableByType[i.pageType] = (indexableByType[i.pageType] || 0) + 1;
  });
  console.log('Indexable footprint breakdown by pageType:', indexableByType);

  // Save to master recovery map
  const outputData = {
    manifestVersion: '3.0.0-final-sitewide-rebuild',
    updatedDate: new Date().toISOString().split('T')[0],
    summary: {
      totalRoutes: updatedItems.length,
      indexableCount: totalIndexable,
      stateCounts,
      indexableByType
    },
    items: updatedItems
  };

  fs.writeFileSync(gscMapPath, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`✅ Saved to ${gscMapPath}`);

  // Save to authority whitelist
  const whitelistPath = path.join(__dirname, '..', 'reports', 'authority-core-whitelist.json');
  const whitelistData = {
    manifestVersion: '3.0.0-final-sitewide-rebuild',
    generatedDate: new Date().toISOString().split('T')[0],
    summary: {
      totalRoutes: updatedItems.length,
      indexableCount: totalIndexable,
      stateCounts,
      indexableByType
    },
    approvedUrls: updatedItems.filter(i => i.recoveryState === 'P' || i.recoveryState === 'R' || i.recoveryState === 'K').map(i => i.url)
  };
  fs.writeFileSync(whitelistPath, JSON.stringify(whitelistData, null, 2), 'utf8');
  console.log(`✅ Saved to ${whitelistPath}`);
}

buildStrictMasterRecoveryMap().catch(console.error);

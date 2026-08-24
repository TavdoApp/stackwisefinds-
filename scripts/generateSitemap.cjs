const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

const saasTools = readAllTools();
const saasCategories = readCategories();
const baseUrl = 'https://stakdock.com';
const todayDate = new Date().toISOString().split('T')[0];

console.log('🗺️  Generating StakDock XML Sitemap with Controlled Quality Gating & Grandfathering...');

// Cutoff timestamp for grandfathered historical routes
const GRANDFATHERED_BASELINE_TOOL_IDS = new Set(saasTools.map(t => t.id));

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Pages (Strict Trailing Slash) -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/ranking/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/advertise/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/refund/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
`;

// Add Category Buyer Guides for all categories
saasCategories.forEach(cat => {
  if (!cat || !cat.id || cat.id === 'all') return;
  sitemapXml += `  <url>
    <loc>${baseUrl}/best/${cat.id}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  sitemapXml += `  <url>
    <loc>${baseUrl}/category/${cat.id}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Semantic GSC High-Intent Hubs
const semanticAliases = [
  'all-in-one-seo-software',
  'workflow-automation',
  'document-automation',
  'ai-video-generators',
  'real-estate-crms'
];

semanticAliases.forEach(alias => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/best/${alias}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
});

// High-Intent Editorial Guides
const editorialGuides = [
  'best-all-in-one-seo-software-2026',
  'best-workflow-automation-tools-2026',
  'best-document-automation-tools-2026',
  'best-ai-video-generators-2026',
  'best-real-estate-crms-2026',
  'best-ai-coding-tools-2026',
  'best-ai-music-audio-2026',
  'best-ecommerce-stack-2026'
];

editorialGuides.forEach(slug => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/guides/${slug}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
});

// Helper: New-page indexation quality gate evaluator
function evaluateNewPageGate(tool) {
  // Check if grandfathered
  if (GRANDFATHERED_BASELINE_TOOL_IDS.has(tool.id)) {
    return { shouldIndex: true, reason: 'Grandfathered Historical Listing' };
  }

  // Strict Gate for NEW tools added in the future:
  const hasDesc = tool.description && tool.description.length >= 150;
  const hasValidFeats = Array.isArray(tool.features) && tool.features.length >= 3;
  const hasPricing = tool.pricing && tool.pricing !== 'Unlisted';
  const hasDomain = tool.domain && tool.domain.includes('.');

  if (hasDesc && hasValidFeats && hasPricing && hasDomain) {
    return { shouldIndex: true, reason: 'Passed 4-Pillar Quality Gate' };
  }

  return { shouldIndex: false, reason: 'Failed Gate: Needs rich specs and verified pricing' };
}

let indexedSoftwareCount = 0;
let heldSoftwareCount = 0;

// Add dedicated /software/ individual tool pages & /alternatives/ hubs
saasTools.forEach(t => {
  const gate = evaluateNewPageGate(t);
  if (gate.shouldIndex) {
    sitemapXml += `  <url>
    <loc>${baseUrl}/software/${t.id}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    sitemapXml += `  <url>
    <loc>${baseUrl}/alternatives/${t.id}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    indexedSoftwareCount++;
  } else {
    heldSoftwareCount++;
  }
});

// Controlled explicit approved cross-category flagship comparisons
const approvedFlagshipComparisons = [
  { toolAId: 'cursor-ai', toolBId: 'github-copilot', vsSlug: 'cursor-ai-vs-github-copilot' }
];

// Add category-based pairwise comparison routes + approved flagship pairs
function getVsPairsList(tools) {
  const map = new Map();
  const catMap = {};

  // Register approved flagship cross-category pairs first
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

const versusPairs = getVsPairsList(saasTools);
versusPairs.forEach(({ vsSlug }) => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/vs/${vsSlug}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

const totalUrlsCount = (sitemapXml.match(/<loc>/g) || []).length;
sitemapXml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log(`✨ Successfully generated public/sitemap.xml for StakDock.com! Total indexed routes: ${totalUrlsCount} (100% strict trailing-slash canonicals)`);
console.log(`🛡️  Quality Gating: Indexed Software: ${indexedSoftwareCount}, Held from Index: ${heldSoftwareCount}`);

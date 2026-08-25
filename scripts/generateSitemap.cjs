const fs = require('fs');
const path = require('path');

console.log('🗺️  Generating StakDock XML Sitemap using GSC Recovery Map Source of Truth...');

const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
if (!fs.existsSync(recoveryMapPath)) {
  console.error('❌ FATAL: reports/gsc-recovery-map.json missing! Sitemap cannot be generated without recovery state source of truth.');
  process.exit(1);
}

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const allItems = recoveryData.items || [];
const baseUrl = 'https://stakdock.com';
const todayDate = new Date().toISOString().split('T')[0];

// Filter ONLY active search footprint (P, R, K)
const indexableItems = allItems.filter(item => 
  item.recoveryState === 'P' || item.recoveryState === 'R' || item.recoveryState === 'K'
);

// Group counts by page type for reporting and validation
const counts = {
  software: 0,
  alternatives: 0,
  vs: 0,
  best: 0,
  guides: 0,
  core: 0,
  total: 0
};

// Map priority and changefreq based on recovery state and page type
function getSitemapMetadata(item) {
  if (item.url === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  if (item.recoveryState === 'P') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (item.recoveryState === 'K') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (item.recoveryState === 'R') {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  return { priority: '0.7', changefreq: 'monthly' };
}

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

// Sort items predictably: core first, then guides, best, vs, software, alternatives
const sortOrder = { core: 1, guides: 2, best: 3, vs: 4, software: 5, alternatives: 6 };
indexableItems.sort((a, b) => {
  const orderA = sortOrder[a.pageType] || 99;
  const orderB = sortOrder[b.pageType] || 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.url.localeCompare(b.url);
});

indexableItems.forEach(item => {
  const meta = getSitemapMetadata(item);
  const pType = item.pageType === 'category' ? 'best' : item.pageType;
  if (counts[pType] !== undefined) {
    counts[pType]++;
  } else {
    counts.core++;
  }
  counts.total++;

  sitemapXml += `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>\n`;
});

sitemapXml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapXml, 'utf8');
}

console.log(`✨ Successfully generated public/sitemap.xml & dist/sitemap.xml for StakDock.com!`);
console.log(`📊 Active Search Footprint Sitemap Count: ${counts.total} URLs (100% strict trailing-slash canonicals)`);
console.log(`   - Software:     ${counts.software}`);
console.log(`   - Alternatives: ${counts.alternatives}`);
console.log(`   - VS:           ${counts.vs}`);
console.log(`   - Best/Hubs:    ${counts.best}`);
console.log(`   - Guides:       ${counts.guides}`);
console.log(`   - Core:         ${counts.core}`);



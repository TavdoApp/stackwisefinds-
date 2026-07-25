const fs = require('fs');
const path = require('path');

const saasDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
const saasDataContent = fs.readFileSync(saasDataPath, 'utf8');

const toolsMatch = saasDataContent.match(/export const saasTools = (\[[\s\S]*\]);/);
if (!toolsMatch) {
  console.error('Could not match saasTools');
  process.exit(1);
}

const saasTools = JSON.parse(toolsMatch[1]);
const baseUrl = 'https://stackwisefinds.com';
const todayDate = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/refund</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- High-Intent Editorial Guides -->
  <url>
    <loc>${baseUrl}/#guide-best-ai-video-generators-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#guide-best-real-estate-crms-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#guide-best-ai-coding-tools-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#guide-best-ai-music-audio-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#guide-best-ecommerce-stack-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Add dedicated /alternatives/ hubs for all tools
saasTools.forEach(t => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/alternatives/${t.id}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add top 150 pairwise comparison routes
const topToolsForCompare = saasTools.slice(0, 20);
for (let i = 0; i < topToolsForCompare.length; i++) {
  for (let j = i + 1; j < topToolsForCompare.length; j++) {
    sitemapXml += `  <url>
    <loc>${baseUrl}/vs/${topToolsForCompare[i].id}-vs-${topToolsForCompare[j].id}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  }
}

sitemapXml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log(`✨ Successfully generated public/sitemap.xml with official sitemaps.org namespace! Total indexed routes: ${saasTools.length + 199}`);

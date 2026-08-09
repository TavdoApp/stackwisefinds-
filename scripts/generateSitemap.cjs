const fs = require('fs');
const path = require('path');
const { readAllTools } = require('./toolData.cjs');

const saasTools = readAllTools();
const answerDataPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');
const answerData = fs.existsSync(answerDataPath) ? JSON.parse(fs.readFileSync(answerDataPath, 'utf8')) : { answers: [] };
const autoPublishedAnswers = Array.isArray(answerData.answers) ? answerData.answers : [];
const baseUrl = 'https://stakdock.com';
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
    <loc>${baseUrl}/guides/best-ai-video-generators-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides/best-real-estate-crms-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides/best-ai-coding-tools-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides/best-ai-music-audio-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides/best-ecommerce-stack-2026</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Add real static URLs for automated answer pages.
autoPublishedAnswers.forEach((answer) => {
  if (!answer.canonicalUrl || !/^https:\/\/stakdock\.com\/guides\//.test(answer.canonicalUrl)) return;
  sitemapXml += `  <url>
    <loc>${answer.canonicalUrl}</loc>
    <lastmod>${(answer.publishedAt || todayDate).slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
});
// Add dedicated /software/ individual tool pages & /alternatives/ hubs for all tools
saasTools.forEach(t => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/software/${t.id}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  sitemapXml += `  <url>
    <loc>${baseUrl}/alternatives/${t.id}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add 480 category-based pairwise comparison routes
function getVsPairsList(tools) {
  const map = new Map();
  const catMap = {};

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
          map.set(slug, { tA: top[i], tB: top[j], vsSlug: slug });
        }
      }
    }
  });

  return Array.from(map.values());
}

const versusPairs = getVsPairsList(saasTools);
versusPairs.forEach(({ vsSlug }) => {
  sitemapXml += `  <url>
    <loc>${baseUrl}/vs/${vsSlug}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

const totalUrlsCount = (sitemapXml.match(/<loc>/g) || []).length;
sitemapXml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log(`✨ Successfully generated public/sitemap.xml for StakDock.com! Total indexed routes: ${totalUrlsCount}`);

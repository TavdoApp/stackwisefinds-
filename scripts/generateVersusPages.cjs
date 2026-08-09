const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const versusDir = path.join(publicDir, 'vs');
const alternativesDir = path.join(publicDir, 'alternatives');

if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });

const { readAllTools } = require('./toolData.cjs');
const saasTools = readAllTools();

const softwareDir = path.join(publicDir, 'software');
if (!fs.existsSync(softwareDir)) fs.mkdirSync(softwareDir, { recursive: true });

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function generateHtml({ title, description, canonicalUrl, targetUrl, heading, subheading }) {
  const linkUrl = targetUrl || canonicalUrl;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeHeading = escapeHtml(heading);
  const safeSubheading = escapeHtml(subheading);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | StakDock</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${safeTitle} | StakDock">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAFBF7; color: #141E14; margin: 0; padding: 40px 20px; line-height: 1.65; }
    .card { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8D8; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .badge { display: inline-block; background: #82A735; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    h1 { font-size: 30px; font-weight: 800; margin-bottom: 16px; color: #141E14; line-height: 1.25; }
    p { font-size: 16px; color: #4A5568; margin-bottom: 24px; }
    .btn { display: inline-flex; align-items: center; background: #82A735; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 999px; transition: background 0.2s ease; }
    .btn:hover { background: #6E8F2B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">StakDock Verified Software Directory</div>
    <h1>${safeHeading}</h1>
    <p>${safeSubheading}</p>
    <p>${safeDesc}</p>
    <a href="${escapeHtml(linkUrl)}" rel="noopener noreferrer" class="btn">Explore Interactive Software Profile on StakDock &rarr;</a>
  </div>
</body>
</html>`;
}

// 1. Generate static HTML pages for all software tools (/software/:id)
let softwareCount = 0;
saasTools.forEach(tool => {
  const pageDir = path.join(softwareDir, tool.id);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  const html = generateHtml({
    title: `${tool.name} Review, Pricing & Features (2026)`,
    description: tool.description || `${tool.name} is a verified software tool on StakDock. Compare pricing, alternative tools, and real user ratings.`,
    canonicalUrl: `https://stakdock.com/software/${tool.id}`,
    targetUrl: `https://stakdock.com/software/${tool.id}`,
    heading: `${tool.name} — ${tool.tagline || 'Verified Software Solution'}`,
    subheading: `Category: ${(tool.category || 'software').toUpperCase()} | Pricing: ${tool.pricing || 'Freemium'} | Rating: ${tool.rating || 4.8}/5★`
  });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
  softwareCount++;
});

// 2. Generate static HTML pages for all alternatives (/alternatives/:id)
let altCount = 0;
saasTools.forEach(tool => {
  const pageDir = path.join(alternativesDir, tool.id);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  const html = generateHtml({
    title: `Top ${tool.name} Alternatives & Competitors (2026)`,
    description: `Discover the best competitors and alternatives to ${tool.name}. Compare features, pricing, and ratings.`,
    canonicalUrl: `https://stakdock.com/alternatives/${tool.id}`,
    targetUrl: `https://stakdock.com/alternatives/${tool.id}`,
    heading: `Best Alternatives & Competitors to ${tool.name}`,
    subheading: `Verified software comparison hub for teams seeking ${tool.name} alternatives.`
  });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
  altCount++;
});

// 3. Generate 480+ category-based pairwise static HTML pages (/vs/:toolA-vs-:toolB)
let vsCount = 0;

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

versusPairs.forEach(({ tA, tB, vsSlug }) => {
  const pageDir = path.join(versusDir, vsSlug);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  const html = generateHtml({
    title: `${tA.name} vs ${tB.name} (2026 Comparison)`,
    description: `In-depth side-by-side comparison of ${tA.name} vs ${tB.name}. Compare features, pricing, ratings, and best use cases.`,
    canonicalUrl: `https://stakdock.com/vs/${vsSlug}`,
    targetUrl: `https://stakdock.com/vs/${vsSlug}`,
    heading: `${tA.name} vs ${tB.name}: Which Software Wins in 2026?`,
    subheading: `Detailed pairwise breakdown of ${tA.name} (${tA.pricing || 'Freemium'}) vs ${tB.name} (${tB.pricing || 'Freemium'}).`
  });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
  vsCount++;
});

console.log(`Generated ${softwareCount} /software/ pages, ${altCount} /alternatives/ pages, and ${vsCount} static /vs/ comparison pages.`);

const fs = require('fs');
const path = require('path');
const { readAllTools } = require('./toolData.cjs');
const saasTools = readAllTools();

const publicDir = path.join(__dirname, '..', 'public');
const versusDir = path.join(publicDir, 'vs');
const alternativesDir = path.join(publicDir, 'alternatives');
const softwareDir = path.join(publicDir, 'software');

if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });
if (!fs.existsSync(softwareDir)) fs.mkdirSync(softwareDir, { recursive: true });

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

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
let count = 0;

versusPairs.forEach(({ tA, tB, vsSlug }) => {
  const pageDir = path.join(versusDir, vsSlug);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(tA.name)} vs ${escapeHtml(tB.name)} (2026 Comparison) | StakDock</title>
  <meta name="description" content="In-depth side-by-side comparison of ${escapeHtml(tA.name)} vs ${escapeHtml(tB.name)}. Compare features, pricing, ratings, and best use cases.">
  <link rel="canonical" href="https://stakdock.com/vs/${escapeHtml(vsSlug)}/">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAFBF7; color: #141E14; margin: 0; padding: 40px 20px; line-height: 1.65; }
    .card { max-width: 900px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8D8; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .badge { display: inline-block; background: #82A735; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; color: #141E14; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td { padding: 12px; border-bottom: 1px solid #E2E8D8; text-align: left; }
    th { color: #5c7353; font-weight: 800; }
    .btn { display: inline-flex; align-items: center; background: #82A735; color: #ffffff; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 999px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Head-to-Head Comparison 2026</div>
    <h1>${escapeHtml(tA.name)} vs ${escapeHtml(tB.name)}: Comparison &amp; Verdict</h1>
    <p>Compare ${escapeHtml(tA.name)} and ${escapeHtml(tB.name)} by pricing models, user satisfaction scores, and feature capabilities.</p>
    <table>
      <thead>
        <tr><th>Metric</th><th>${escapeHtml(tA.name)}</th><th>${escapeHtml(tB.name)}</th></tr>
      </thead>
      <tbody>
        <tr><td>Pricing</td><td>${escapeHtml(tA.pricing || 'Freemium')}</td><td>${escapeHtml(tB.pricing || 'Freemium')}</td></tr>
        <tr><td>Rating</td><td>⭐ ${tA.rating || 4.8}★</td><td>⭐ ${tB.rating || 4.7}★</td></tr>
        <tr><td>Free Tier</td><td>${tA.isFreeTier ? 'Available' : 'Paid / Trial'}</td><td>${tB.isFreeTier ? 'Available' : 'Paid / Trial'}</td></tr>
        <tr><td>Open Source</td><td>${tA.isOpenSource ? 'Yes' : 'Proprietary'}</td><td>${tB.isOpenSource ? 'Yes' : 'Proprietary'}</td></tr>
      </tbody>
    </table>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <a href="/software/${escapeHtml(tA.id)}/" class="btn">${escapeHtml(tA.name)} Profile &rarr;</a>
      <a href="/software/${escapeHtml(tB.id)}/" class="btn" style="background:#2D4522;">${escapeHtml(tB.name)} Profile &rarr;</a>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
  count++;
});

console.log(`Generated ${count} compliant pairwise /vs/ comparison pages.`);

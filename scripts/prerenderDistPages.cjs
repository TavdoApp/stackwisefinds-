const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(indexPath, 'utf8');

// Helper to escape HTML attributes and text
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSeoPage({ title, description, canonicalUrl, jsonLd, bodyHtml }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);

  let html = baseIndexHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle} | StakDock</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${safeDesc}" />`);
  html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${safeCanonical}" />`);
  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${safeTitle} | StakDock" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${safeDesc}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${safeCanonical}" />`);
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${safeDesc}" />`);

  if (jsonLd) {
    const scripts = Array.isArray(jsonLd)
      ? jsonLd.map(item => `<script type="application/ld+json">\n    ${JSON.stringify(item, null, 2)}\n    </script>`).join('\n')
      : `<script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
    html = html.replace('</head>', `\n    ${scripts}\n  </head>`);
  }

  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">\n${bodyHtml}\n</div>`);
  }

  return html;
}

const saasTools = readAllTools();
const saasCategories = readCategories();

const softwareDir = path.join(distDir, 'software');
const alternativesDir = path.join(distDir, 'alternatives');
const versusDir = path.join(distDir, 'vs');
const bestDir = path.join(distDir, 'best');
const categoryDir = path.join(distDir, 'category');
const guidesDir = path.join(distDir, 'guides');

if (!fs.existsSync(softwareDir)) fs.mkdirSync(softwareDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });
if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });
if (!fs.existsSync(bestDir)) fs.mkdirSync(bestDir, { recursive: true });
if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });
if (!fs.existsSync(guidesDir)) fs.mkdirSync(guidesDir, { recursive: true });

let softwareCount = 0;
let altCount = 0;
let vsCount = 0;
let bestCount = 0;
let guideCount = 0;

function getCategoryLabel(catId) {
  const c = saasCategories.find(item => item && item.id === catId);
  return c ? c.label : (catId || 'Software').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function renderSsrNavbar(activePath = '/') {
  return `
  <header style="position:sticky;top:0;z-index:100;background:rgba(246, 247, 242, 0.97);backdrop-filter:blur(16px);border-bottom:1px solid #E2E6D8;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;max-width:1200px;margin:0 auto;">
      <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <div style="width:34px;height:34px;border-radius:10px;background:#EBF0E1;display:flex;align-items:center;justify-content:center;border:1px solid #E2E6D8;color:#82A735;font-weight:800;font-size:1.1rem;">
          ✨
        </div>
        <span style="font-size:1.35rem;font-weight:800;color:#141E14;letter-spacing:-0.02em;">stakdock</span>
      </a>
      <nav style="display:flex;align-items:center;gap:8px;font-size:0.88rem;font-weight:700;">
        <a href="/" style="color:${activePath === '/' ? '#141E14' : '#536253'};text-decoration:none;padding:6px 12px;border-radius:9999px;background:${activePath === '/' ? '#EBF0E1' : 'transparent'};">Directory</a>
        <a href="/categories/" style="color:${activePath.startsWith('/categories') ? '#141E14' : '#536253'};text-decoration:none;padding:6px 12px;border-radius:9999px;background:${activePath.startsWith('/categories') ? '#EBF0E1' : 'transparent'};">Categories</a>
        <a href="/ranking/" style="color:${activePath.startsWith('/ranking') ? '#141E14' : '#536253'};text-decoration:none;padding:6px 12px;border-radius:9999px;background:${activePath.startsWith('/ranking') ? '#EBF0E1' : 'transparent'};">Rankings</a>
        <a href="/advertise/" style="color:${activePath.startsWith('/advertise') ? '#141E14' : '#536253'};text-decoration:none;padding:6px 12px;border-radius:9999px;background:${activePath.startsWith('/advertise') ? '#EBF0E1' : 'transparent'};">Advertise</a>
        <a href="/submit/" style="color:#FFFFFF;background:#141E14;text-decoration:none;padding:8px 16px;border-radius:9999px;">Submit</a>
      </nav>
    </div>
  </header>
  `;
}

// 0. Root Homepage (dist/index.html) is preserved as the clean SPA client entry shell
console.log('Preserving dist/index.html as clean SPA client shell (eliminating homepage layout flicker)...');

// 1. Generate dist/software/:id/index.html with rich high-entropy SSR body
saasTools.forEach(tool => {
  if (!tool || !tool.id) return;

  const targetFolder = path.join(softwareDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const catLabel = getCategoryLabel(tool.category);

  const explicitMatches = Array.isArray(tool.alternatives) && tool.alternatives.length > 0
    ? tool.alternatives.map(altId => saasTools.find(t => t.id === altId)).filter(Boolean)
    : [];
  const fallbackMatches = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const competitors = [...explicitMatches, ...fallbackMatches.filter(t => !explicitMatches.some(e => e.id === t.id))].slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "url": tool.websiteUrl || tool.affiliateUrl || `https://${tool.domain}`,
    "operatingSystem": "Web, Cloud SaaS",
    "applicationCategory": tool.category || "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": tool.pricing && tool.pricing.includes('$') ? tool.pricing.replace(/[^0-9.]/g, '') || "0" : "0",
      "priceCurrency": "USD"
    }
  };

  if (tool.rating && tool.reviewsCount && Number(tool.reviewsCount) > 0 && Number(tool.rating) > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": String(tool.rating),
      "ratingCount": String(tool.reviewsCount),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  const bodyHtml = `
  ${renderSsrNavbar('/software/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/best/${escapeHtml(tool.category || 'crm')}/" style="color:#536253;text-decoration:none;">${escapeHtml(catLabel)}</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(tool.name)}</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;margin-bottom:12px;letter-spacing:0.04em;">
        ${escapeHtml(catLabel)}
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 12px 0;color:#182618;">
        ${escapeHtml(tool.name)} Review 2026: Pricing, Free Trial &amp; Alternatives
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0 0 20px 0;">
        ${escapeHtml(tool.description || tool.tagline || '')}
      </p>

      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:0.9rem;">
        <span style="background:#f4f7f2;padding:6px 14px;border-radius:10px;font-weight:700;color:#182618;">
          ⭐ ${tool.rating || 4.8} / 5.0 (${tool.reviewsCount ? tool.reviewsCount.toLocaleString() : '120+'} ratings)
        </span>
        <span style="background:#f4f7f2;padding:6px 14px;border-radius:10px;font-weight:700;color:#182618;">
          💰 Pricing: ${escapeHtml(tool.pricing || 'Freemium')}
        </span>
        ${tool.isFreeTier ? '<span style="background:#eaf8ea;color:#1b6e1b;padding:6px 14px;border-radius:10px;font-weight:700;">✓ Free Tier Available</span>' : ''}
        ${tool.isOpenSource ? '<span style="background:#eaf0f8;color:#1b466e;padding:6px 14px;border-radius:10px;font-weight:700;">⚙ Open Source</span>' : ''}
      </div>

      <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="${escapeHtml(tool.affiliateUrl || tool.websiteUrl || `https://${tool.domain}`)}" target="_blank" rel="noopener noreferrer" style="background:#82A735;color:#FFFFFF;padding:12px 24px;border-radius:9999px;font-weight:800;text-decoration:none;font-size:0.95rem;display:inline-flex;align-items:center;gap:6px;">
          Visit Official Website &rarr;
        </a>
        <a href="/alternatives/${tool.id}/" style="border:1px solid #dce8d6;color:#182618;background:#FFFFFF;padding:12px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:0.95rem;">
          View ${escapeHtml(tool.name)} Alternatives
        </a>
      </div>
    </header>

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">What is ${escapeHtml(tool.name)}?</h2>
      <p style="font-size:1rem;line-height:1.7;color:#2d4029;margin:0 0 16px 0;">
        ${escapeHtml(tool.description || tool.tagline || '')} ${escapeHtml(tool.name)} is an established software tool built for teams, operators, and modern builders looking to accelerate workflows in ${escapeHtml(catLabel)}. Official product documentation and customer portal are hosted on <a href="https://${escapeHtml(tool.domain)}" target="_blank" rel="noopener noreferrer" style="color:#2D4522;font-weight:700;text-decoration:underline;">${escapeHtml(tool.domain)}</a>.
      </p>

      ${Array.isArray(tool.features) && tool.features.length > 0 ? `
        <h3 style="font-size:1.2rem;font-weight:800;margin-top:24px;margin-bottom:12px;color:#182618;">Key Features &amp; Capabilities</h3>
        <ul style="margin:0;padding-left:22px;line-height:1.9;color:#2d4029;font-size:0.98rem;">
          ${tool.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      ` : ''}
    </section>

    ${competitors.length > 0 ? `
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">Top Verified Alternatives to ${escapeHtml(tool.name)}</h2>
      <p style="font-size:0.95rem;color:#45593e;margin-bottom:16px;">Compare ${escapeHtml(tool.name)} with top competing platforms in the ${escapeHtml(catLabel)} category:</p>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${competitors.map(alt => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f9fbf8;border:1px solid #e2ede0;border-radius:12px;flex-wrap:wrap;gap:8px;">
            <div>
              <a href="/software/${alt.id}/" style="color:#182618;font-weight:800;text-decoration:none;font-size:1rem;">${escapeHtml(alt.name)}</a>
              <span style="font-size:0.85rem;color:#5c7353;margin-left:8px;">— ${escapeHtml(alt.tagline || alt.description || '')}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:0.82rem;font-weight:700;color:#2D4522;">${escapeHtml(alt.pricing || 'Freemium')}</span>
              <a href="/vs/${tool.id}-vs-${alt.id}/" style="font-size:0.8rem;font-weight:700;color:#82A735;text-decoration:underline;">Compare vs ${escapeHtml(tool.name)}</a>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:20px;">
        <a href="/alternatives/${tool.id}/" style="font-weight:800;color:#82A735;text-decoration:underline;font-size:0.95rem;">
          View All Alternatives to ${escapeHtml(tool.name)} &rarr;
        </a>
      </div>
    </section>
    ` : ''}

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Software Specifications</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
        <div style="padding:16px;background:#f9fbf8;border-radius:12px;border:1px solid #e2ede0;">
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">Category</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${escapeHtml(catLabel)}</div>
        </div>
        <div style="padding:16px;background:#f9fbf8;border-radius:12px;border:1px solid #e2ede0;">
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">Pricing Model</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${escapeHtml(tool.pricing || 'Freemium')}</div>
        </div>
        <div style="padding:16px;background:#f9fbf8;border-radius:12px;border:1px solid #e2ede0;">
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">Free Tier</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${tool.isFreeTier ? 'Yes (Available)' : 'Paid / Free Trial'}</div>
        </div>
        <div style="padding:16px;background:#f9fbf8;border-radius:12px;border:1px solid #e2ede0;">
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">Open Source</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${tool.isOpenSource ? 'Yes (Public Repo)' : 'Proprietary SaaS'}</div>
        </div>
      </div>
    </section>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `${tool.name} Review 2026: Pricing, Free Trial & Deals`,
    description: tool.description ? `${tool.name} review (2026): ${tool.description} Compare pricing (${tool.pricing || 'Freemium'}), ratings (${tool.rating || '4.8'}★), and top verified alternatives on StakDock.` : `In-depth ${tool.name} review (2026). Compare ${tool.name} pricing (${tool.pricing || 'Freemium'}), features, ratings (${tool.rating || '4.8'}★), and top verified deals on StakDock.`,
    canonicalUrl: `https://stakdock.com/software/${tool.id}/`,
    jsonLd: [jsonLd],
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  softwareCount++;
});

// 2. Generate dist/alternatives/:id/index.html
saasTools.forEach(tool => {
  if (!tool || !tool.id) return;

  const targetFolder = path.join(alternativesDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const catLabel = getCategoryLabel(tool.category);

  const explicitMatches = Array.isArray(tool.alternatives) && tool.alternatives.length > 0
    ? tool.alternatives.map(altId => saasTools.find(t => t.id === altId)).filter(Boolean)
    : [];
  const fallbackMatches = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const categoryMatches = [...explicitMatches, ...fallbackMatches.filter(t => !explicitMatches.some(e => e.id === t.id))].slice(0, 7);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top Alternatives & Competitors to ${tool.name}`,
    "description": `Verified software alternatives and competitors to ${tool.name} on StakDock.`,
    "url": `https://stakdock.com/alternatives/${tool.id}/`,
    "numberOfItems": categoryMatches.length,
    "itemListElement": categoryMatches.map((altTool, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": altTool.name,
      "url": `https://stakdock.com/software/${altTool.id}/`,
      "item": {
        "@type": "SoftwareApplication",
        "name": altTool.name,
        "applicationCategory": altTool.category || "BusinessApplication",
        "operatingSystem": "Web, Cloud"
      }
    }))
  };

  const bodyHtml = `
  ${renderSsrNavbar('/alternatives/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/software/${tool.id}/" style="color:#536253;text-decoration:none;">${escapeHtml(tool.name)}</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">Alternatives</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;margin-bottom:12px;letter-spacing:0.04em;">
        ${escapeHtml(catLabel)} ALTERNATIVES
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 12px 0;color:#182618;">
        Top ${categoryMatches.length} Best ${escapeHtml(tool.name)} Alternatives &amp; Competitors (2026)
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0 0 16px 0;">
        Looking for software like ${escapeHtml(tool.name)}? Explore verified competitors and alternative software platforms with transparent pricing, feature scorecards, and user reviews.
      </p>
    </header>

    <section style="display:flex;flex-direction:column;gap:20px;margin-bottom:32px;">
      ${categoryMatches.map((alt, idx) => `
        <article style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
          <div style="max-width:720px;">
            <div style="font-size:0.75rem;font-weight:800;color:#82A735;text-transform:uppercase;margin-bottom:4px;">
              #${idx + 1} Alternative to ${escapeHtml(tool.name)}
            </div>
            <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 8px 0;">
              <a href="/software/${alt.id}/" style="color:#182618;text-decoration:none;">${escapeHtml(alt.name)}</a>
            </h2>
            <p style="font-size:0.95rem;color:#45593e;line-height:1.5;margin:0 0 12px 0;">
              ${escapeHtml(alt.description || alt.tagline || '')}
            </p>
            <div style="display:flex;gap:12px;font-size:0.85rem;color:#5c7353;font-weight:600;">
              <span>⭐ ${alt.rating || 4.8}★ (${alt.reviewsCount ? alt.reviewsCount.toLocaleString() : '100+'} reviews)</span>
              <span>💰 ${escapeHtml(alt.pricing || 'Freemium')}</span>
              ${alt.isFreeTier ? '<span style="color:#1b6e1b;">✓ Free Tier</span>' : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;min-width:160px;">
            <a href="/software/${alt.id}/" style="background:#82A735;color:#FFFFFF;padding:8px 16px;border-radius:9999px;font-weight:700;font-size:0.85rem;text-decoration:none;text-align:center;">
              Read ${escapeHtml(alt.name)} Review
            </a>
            <a href="/vs/${tool.id}-vs-${alt.id}/" style="border:1px solid #dce8d6;color:#182618;background:#FFFFFF;padding:6px 14px;border-radius:9999px;font-weight:600;font-size:0.8rem;text-decoration:none;text-align:center;">
              ${escapeHtml(tool.name)} vs ${escapeHtml(alt.name)}
            </a>
          </div>
        </article>
      `).join('')}
    </section>

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">How to Choose Between ${escapeHtml(tool.name)} and Competitors</h2>
      <p style="font-size:0.95rem;line-height:1.7;color:#2d4029;">
        When switching from ${escapeHtml(tool.name)}, consider your team's budget, required third-party integrations, and API limits. ${categoryMatches[0] ? `${categoryMatches[0].name} is currently our top recommendation for teams seeking modern feature parity.` : ''}
      </p>
    </section>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `Best ${tool.name} Free & Open-Source Alternatives (2026)`,
    description: `Looking for the best alternatives to ${tool.name}? Compare top verified ${tool.name} competitors in 2026 by features, pricing plans, free trials, and user ratings on StakDock.`,
    canonicalUrl: `https://stakdock.com/alternatives/${tool.id}/`,
    jsonLd: [jsonLd],
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  altCount++;
});

// 3. Generate pairwise dist/vs/:vsSlug/index.html
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
  const targetFolder = path.join(versusDir, vsSlug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const vsItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${tA.name} vs ${tB.name} 2026 Comparison`,
    "description": `Detailed comparison between ${tA.name} and ${tB.name} on StakDock.`,
    "url": `https://stakdock.com/vs/${vsSlug}/`,
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": tA.name,
        "url": `https://stakdock.com/software/${tA.id}/`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tA.name,
          "applicationCategory": tA.category || "Software",
          "operatingSystem": "Web, Cloud"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tB.name,
        "url": `https://stakdock.com/software/${tB.id}/`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tB.name,
          "applicationCategory": tB.category || "Software",
          "operatingSystem": "Web, Cloud"
        }
      }
    ]
  };

  const bodyHtml = `
  ${renderSsrNavbar('/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(tA.name)} vs ${escapeHtml(tB.name)}</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;text-align:center;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;margin-bottom:12px;letter-spacing:0.04em;">
        HEAD-TO-HEAD COMPARISON 2026
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 12px 0;color:#182618;">
        ${escapeHtml(tA.name)} vs ${escapeHtml(tB.name)}: Full Comparison &amp; Verdict
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0 auto;max-width:760px;">
        Comparing ${escapeHtml(tA.name)} and ${escapeHtml(tB.name)}. Explore pricing breakdown, feature matrices, customer sentiment, and user ratings to determine the right software for your workflow.
      </p>
    </header>

    <!-- Side-by-Side Comparison Matrix Table -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;overflow-x:auto;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Side-by-Side Specification Matrix</h2>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.95rem;">
        <thead>
          <tr style="border-bottom:2px solid #e2ede0;">
            <th style="padding:12px;color:#5c7353;font-weight:800;width:30%;">Feature / Metric</th>
            <th style="padding:12px;color:#182618;font-weight:800;width:35%;">${escapeHtml(tA.name)}</th>
            <th style="padding:12px;color:#182618;font-weight:800;width:35%;">${escapeHtml(tB.name)}</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:12px;font-weight:700;color:#2d4029;">Pricing Model</td>
            <td style="padding:12px;color:#182618;">${escapeHtml(tA.pricing || 'Freemium')}</td>
            <td style="padding:12px;color:#182618;">${escapeHtml(tB.pricing || 'Freemium')}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:12px;font-weight:700;color:#2d4029;">User Rating</td>
            <td style="padding:12px;color:#182618;">⭐ ${tA.rating || 4.8}★ (${tA.reviewsCount ? tA.reviewsCount.toLocaleString() : '100+'} reviews)</td>
            <td style="padding:12px;color:#182618;">⭐ ${tB.rating || 4.7}★ (${tB.reviewsCount ? tB.reviewsCount.toLocaleString() : '100+'} reviews)</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:12px;font-weight:700;color:#2d4029;">Free Tier</td>
            <td style="padding:12px;color:#182618;">${tA.isFreeTier ? '✓ Available' : 'Trial / Paid'}</td>
            <td style="padding:12px;color:#182618;">${tB.isFreeTier ? '✓ Available' : 'Trial / Paid'}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:12px;font-weight:700;color:#2d4029;">Open Source</td>
            <td style="padding:12px;color:#182618;">${tA.isOpenSource ? '✓ Yes' : 'Proprietary'}</td>
            <td style="padding:12px;color:#182618;">${tB.isOpenSource ? '✓ Yes' : 'Proprietary'}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:12px;font-weight:700;color:#2d4029;">Official Website</td>
            <td style="padding:12px;"><a href="https://${escapeHtml(tA.domain)}" target="_blank" rel="noopener noreferrer" style="color:#82A735;font-weight:700;text-decoration:underline;">${escapeHtml(tA.domain)}</a></td>
            <td style="padding:12px;"><a href="https://${escapeHtml(tB.domain)}" target="_blank" rel="noopener noreferrer" style="color:#82A735;font-weight:700;text-decoration:underline;">${escapeHtml(tB.domain)}</a></td>
          </tr>
        </tbody>
      </table>
    </section>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;margin-bottom:32px;">
      <div style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:18px;padding:28px;">
        <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;color:#182618;">${escapeHtml(tA.name)} Overview</h2>
        <p style="font-size:0.95rem;color:#45593e;line-height:1.5;">${escapeHtml(tA.description || tA.tagline || '')}</p>
        <div style="margin-top:16px;">
          <a href="/software/${tA.id}/" style="color:#82A735;font-weight:800;text-decoration:underline;">Full ${escapeHtml(tA.name)} Review &rarr;</a>
        </div>
      </div>

      <div style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:18px;padding:28px;">
        <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;color:#182618;">${escapeHtml(tB.name)} Overview</h2>
        <p style="font-size:0.95rem;color:#45593e;line-height:1.5;">${escapeHtml(tB.description || tB.tagline || '')}</p>
        <div style="margin-top:16px;">
          <a href="/software/${tB.id}/" style="color:#82A735;font-weight:800;text-decoration:underline;">Full ${escapeHtml(tB.name)} Review &rarr;</a>
        </div>
      </div>
    </div>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `${tA.name} vs ${tB.name}: 2026 Comparison, Pricing & Winner`,
    description: `Detailed ${tA.name} vs ${tB.name} comparison (2026). Compare feature matrix, pricing plans, integration capabilities, and user consensus to pick the winning software.`,
    canonicalUrl: `https://stakdock.com/vs/${vsSlug}/`,
    jsonLd: [vsItemListJsonLd],
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  vsCount++;
});

// 4. Generate Category Buyer Guides
saasCategories.forEach(cat => {
  if (!cat || !cat.id || cat.id === 'all') return;

  const matchedTools = saasTools.filter(t => t.category === cat.id).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.rating || 4.5) - (a.rating || 4.5);
  });

  if (matchedTools.length === 0) return;

  const catLabel = cat.label || cat.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const catJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${catLabel} Software in 2026 (Ranked & Compared)`,
    "description": `Rankings and in-depth buyer guide for top ${matchedTools.length} ${catLabel} software, tools, and platforms on StakDock.`,
    "url": `https://stakdock.com/best/${cat.id}/`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Top Ranked ${catLabel} Tools (2026)`,
      "numberOfItems": matchedTools.length,
      "itemListElement": matchedTools.slice(0, 15).map((tool, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": tool.name,
        "url": `https://stakdock.com/software/${tool.id}/`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "applicationCategory": catLabel,
          "operatingSystem": "Web, Cloud",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(tool.rating || 4.8),
            "ratingCount": String(tool.reviewsCount || 120),
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      }))
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://stakdock.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://stakdock.com/categories/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Best ${catLabel}`,
        "item": `https://stakdock.com/best/${cat.id}/`
      }
    ]
  };

  const bodyHtml = `
  ${renderSsrNavbar('/categories/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/categories/" style="color:#536253;text-decoration:none;">Categories</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(catLabel)}</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;margin-bottom:12px;letter-spacing:0.04em;">
        VERIFIED DIRECTORY 2026
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 12px 0;color:#182618;">
        Best ${escapeHtml(catLabel)} Software in 2026 (Ranked &amp; Reviewed)
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">
        Explore top-rated ${escapeHtml(catLabel)} tools and software platforms. Compare pricing plans, free tier limits, user satisfaction scores, and feature breakdowns.
      </p>
    </header>

    <section style="display:flex;flex-direction:column;gap:16px;margin-bottom:32px;">
      ${matchedTools.slice(0, 15).map((tool, idx) => `
        <article style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:16px;padding:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <span style="font-size:0.8rem;font-weight:800;color:#82A735;">#${idx + 1}</span>
            <h2 style="font-size:1.25rem;font-weight:800;margin:0 0 4px 0;display:inline-block;margin-left:8px;">
              <a href="/software/${tool.id}/" style="color:#182618;text-decoration:none;">${escapeHtml(tool.name)}</a>
            </h2>
            <p style="font-size:0.9rem;color:#45593e;margin:0;">${escapeHtml(tool.tagline || tool.description || '')}</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:0.85rem;font-weight:700;color:#2D4522;">${escapeHtml(tool.pricing || 'Freemium')}</span>
            <a href="/software/${tool.id}/" style="background:#82A735;color:#FFFFFF;padding:8px 16px;border-radius:9999px;font-size:0.85rem;font-weight:700;text-decoration:none;">Review</a>
          </div>
        </article>
      `).join('')}
    </section>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `Best ${catLabel} Software in 2026 (Ranked & Reviewed)`,
    description: `Discover the best ${catLabel} software and tools of 2026 on StakDock. In-depth rankings, verified user reviews, pricing comparisons, and feature breakdowns.`,
    canonicalUrl: `https://stakdock.com/best/${cat.id}/`,
    jsonLd: [catJsonLd, breadcrumbJsonLd],
    bodyHtml
  });

  const bestCatDir = path.join(bestDir, cat.id);
  if (!fs.existsSync(bestCatDir)) fs.mkdirSync(bestCatDir, { recursive: true });
  fs.writeFileSync(path.join(bestCatDir, 'index.html'), pageHtml, 'utf8');

  // Also write to /category/:categorySlug/index.html with matching canonical tag
  const categoryPageHtml = buildSeoPage({
    title: `${catLabel} Software Directory 2026: Compare Tools & Pricing`,
    description: `Browse all verified ${catLabel} software and tools on StakDock. Compare user ratings, pricing models, free tiers, and features.`,
    canonicalUrl: `https://stakdock.com/category/${cat.id}/`,
    jsonLd: [catJsonLd, breadcrumbJsonLd],
    bodyHtml
  });

  const directCatDir = path.join(categoryDir, cat.id);
  if (!fs.existsSync(directCatDir)) fs.mkdirSync(directCatDir, { recursive: true });
  fs.writeFileSync(path.join(directCatDir, 'index.html'), categoryPageHtml, 'utf8');

  bestCount++;
});

// 5. Semantic Buyer Aliases
const semanticBuyerAliases = [
  { slug: 'all-in-one-seo-software', category: 'seo-analytics', label: 'All-in-One SEO Software' },
  { slug: 'workflow-automation', category: 'nocode-databases', label: 'Workflow Automation Tools' },
  { slug: 'document-automation', category: 'esign-documents', label: 'Document Automation & E-Sign' },
  { slug: 'ai-video-generators', category: 'trending-video-ai', label: 'AI Video Generators' },
  { slug: 'real-estate-crms', category: 'crm', label: 'Real Estate CRM Software' }
];

semanticBuyerAliases.forEach(alias => {
  const matchedTools = saasTools.filter(t => t.category === alias.category).sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
  if (matchedTools.length === 0) return;

  const bodyHtml = `
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#182618;">
    <nav style="font-size:0.85rem;color:#5c7353;margin-bottom:20px;">
      <a href="/" style="color:#5c7353;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#182618;font-weight:700;">${escapeHtml(alias.label)}</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;margin:0 0 12px 0;">Best ${escapeHtml(alias.label)} (2026 Buyer Guide)</h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">In-depth buyer guide and feature comparison for top ${escapeHtml(alias.label)}.</p>
    </header>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `Best ${alias.label} in 2026 (Ranked & Reviewed)`,
    description: `Discover the top ${alias.label} of 2026. Compare pricing, features, ratings, and alternatives on StakDock.`,
    canonicalUrl: `https://stakdock.com/best/${alias.slug}/`,
    bodyHtml
  });

  const bestAliasDir = path.join(bestDir, alias.slug);
  if (!fs.existsSync(bestAliasDir)) fs.mkdirSync(bestAliasDir, { recursive: true });
  fs.writeFileSync(path.join(bestAliasDir, 'index.html'), pageHtml, 'utf8');

  bestCount++;
});

// 6. Prerender Editorial Answer Guides
const allGuides = [
  {
    id: "guide-best-all-in-one-seo-software-2026",
    slug: "best-all-in-one-seo-software-2026",
    title: "Best All-in-One SEO Software in 2026: Comprehensive Buyer Matrix",
    summary: "Discover the top all-in-one SEO platforms for technical audits, keyword tracking, and backlink monitoring compared side by side.",
    category: "SEO & Keyword Research",
    publishDate: "January 2026"
  },
  {
    id: "guide-best-workflow-automation-tools-2026",
    slug: "best-workflow-automation-tools-2026",
    title: "Best Workflow Automation Software in 2026: Top Integration Platforms",
    summary: "Compare the leading workflow automation platforms for founders and operations teams with pricing models, webhook reliability, and ease of use.",
    category: "No-Code & Automation",
    publishDate: "January 2026"
  },
  {
    id: "guide-best-document-automation-tools-2026",
    slug: "best-document-automation-tools-2026",
    title: "Best Document Automation & eSign Software 2026: Top Contract Platforms",
    summary: "A practical breakdown of enterprise-grade and indie document signing tools, compliant audit trails, and automated contract workflows.",
    category: "Document Management",
    publishDate: "February 2026"
  },
  {
    id: "guide-best-ai-video-generators-2026",
    slug: "best-ai-video-generators-2026",
    title: "Best AI Video Generators in 2026: Top Text-to-Video & Avatar Engines",
    summary: "An in-depth review of generative AI video platforms, rendering quality, commercial licenses, and realistic avatar lip-sync capabilities.",
    category: "AI Video & Motion",
    publishDate: "February 2026"
  },
  {
    id: "guide-best-real-estate-crms-2026",
    slug: "best-real-estate-crms-2026",
    title: "Best Real Estate CRM Software in 2026: Top Brokerage Platforms",
    summary: "Compare top real estate CRMs with automated WhatsApp lead routing, Bayut/Property Finder sync, and commission pipeline tracking.",
    category: "CRM & Sales",
    publishDate: "March 2026"
  },
  {
    id: "guide-best-ai-coding-tools-2026",
    slug: "best-ai-coding-tools-2026",
    title: "Best AI Coding Assistants & IDE Tools in 2026: Cursor vs Copilot vs Lovable",
    summary: "In-depth speed, multi-file code editing, and model accuracy comparison for modern developers and engineering teams.",
    category: "AI Coding & Dev Assistants",
    publishDate: "March 2026"
  },
  {
    id: "guide-best-ai-music-audio-2026",
    slug: "best-ai-music-audio-2026",
    title: "Top Generative AI Music Generators in 2026: Suno AI vs Udio AI",
    summary: "Testing studio vocal acoustics, arrangement versatility, and commercial licensing for generative AI music production.",
    category: "AI Music & Audio",
    publishDate: "April 2026"
  },
  {
    id: "guide-best-ecommerce-stack-2026",
    slug: "best-ecommerce-stack-2026",
    title: "The Ultimate E-Commerce SaaS Stack 2026: Shopify + Klaviyo + Deel + Stripe",
    summary: "How D2C brands scale from $0 to $1M ARR with automated checkout conversion, predictive SMS flows, and global contractor payroll.",
    category: "E-Commerce & Tech",
    publishDate: "April 2026"
  }
];

allGuides.forEach(guide => {
  const guideSlug = guide.slug || guide.id;
  const targetFolder = path.join(guidesDir, guideSlug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const bodyHtml = `
  ${renderSsrNavbar('/guides/')}
  <main class="stakdock-ssr-main" style="max-width:900px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/categories/" style="color:#536253;text-decoration:none;">Buyer Guides</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(guide.title)}</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <div style="font-size:0.75rem;font-weight:800;color:#82A735;text-transform:uppercase;margin-bottom:8px;">
        ${escapeHtml(guide.category)} &bull; UPDATED ${escapeHtml(guide.publishDate)}
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 16px 0;color:#182618;">
        ${escapeHtml(guide.title)}
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">
        ${escapeHtml(guide.summary)}
      </p>
    </header>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: guide.title,
    description: guide.summary,
    canonicalUrl: `https://stakdock.com/guides/${guideSlug}/`,
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  guideCount++;
});

// 7. Prerender Core Static Pages
const coreStaticPages = [
  { slug: 'categories', title: 'Software Categories Directory 2026', description: 'Browse all 40+ verified SaaS software categories, buyer guides, and tool comparisons on StakDock.' },
  { slug: 'ranking', title: 'Top Ranked SaaS Software & Verified Tools 2026', description: 'Leaderboard of top-rated software, CRM platforms, AI tools, and automation engines ranked by verified user reviews on StakDock.' },
  { slug: 'advertise', title: 'Promote Your Software & Reach 50,000+ Founders', description: 'Feature your SaaS product on StakDock to acquire qualified software buyers, founders, and marketing operators.' },
  { slug: 'submit', title: 'Submit & List Your SaaS Product Free', description: 'List your software tool on StakDock directory in 60 seconds with instant domain inspection and automated competitor matching.' },
  { slug: 'terms', title: 'Terms of Service', description: 'StakDock Terms of Service and user agreements.' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'StakDock Privacy Policy and data protection standards.' },
  { slug: 'refund', title: 'Refund Policy', description: 'StakDock sponsorship and premium listing refund policies.' }
];

coreStaticPages.forEach(page => {
  const targetFolder = path.join(distDir, page.slug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const bodyHtml = `
  ${renderSsrNavbar('/' + page.slug + '/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(page.title)}</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;margin:0 0 12px 0;">${escapeHtml(page.title)}</h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">${escapeHtml(page.description)}</p>
    </header>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: page.title,
    description: page.description,
    canonicalUrl: `https://stakdock.com/${page.slug}/`,
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
});

console.log(`Prerendered ${softwareCount} /software/, ${altCount} /alternatives/, ${vsCount} /vs/, ${bestCount} /best/, ${guideCount} /guides/, and ${coreStaticPages.length} core pages into dist/ (100% strict trailing-slash canonicals, zero duplicate flat files)!`);

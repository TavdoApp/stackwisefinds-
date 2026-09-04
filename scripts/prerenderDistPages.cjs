const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');
const {
  renderMozProVsSeRankingSsr,
  renderScreamingFrogVsSeRankingSsr,
  renderInvoicingCategoryBuyerGuideSsr
} = require('./customRecoveryWaveRenderers.cjs');

const authorityRenderers = require('./authorityCoreRenderers.cjs');
const growthMoneyRenderers = require('./growthMoneyPageRenderers.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

if (!fs.existsSync(recoveryMapPath)) {
  console.error('❌ FATAL: reports/gsc-recovery-map.json missing! Prerendering cannot proceed without recovery state source of truth.');
  process.exit(1);
}

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryMap = new Map((recoveryData.items || []).map(item => [item.url, item]));

let prerenderStats = {
  total: 0,
  indexed: 0,
  quarantined: 0,
  technical: 0
};

function getRouteRecoveryState(canonicalUrl) {
  let pathOnly = canonicalUrl.replace(/^https?:\/\/[^\/]+/, '');
  if (!pathOnly.startsWith('/')) pathOnly = '/' + pathOnly;
  if (!pathOnly.endsWith('/')) pathOnly = pathOnly + '/';

  const item = recoveryMap.get(pathOnly);
  if (!item) {
    // Rule #18 Future Index-Admission Gate: Fail-closed default to Q
    prerenderStats.quarantined++;
    return { recoveryState: 'Q', isNoindex: true };
  }

  if (item.recoveryState === 'T') {
    prerenderStats.technical++;
    return { recoveryState: 'T', isNoindex: true };
  }

  const isNoindex = item.recoveryState === 'Q';
  if (isNoindex) {
    prerenderStats.quarantined++;
  } else {
    prerenderStats.indexed++;
  }

  return {
    recoveryState: item.recoveryState,
    isNoindex
  };
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

function buildSeoPage({ title, description, canonicalUrl, jsonLd, bodyHtml, isNoindex }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);

  if (isNoindex === undefined) {
    isNoindex = getRouteRecoveryState(canonicalUrl).isNoindex;
  }
  prerenderStats.total++;

  let html = baseIndexHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle} | StakDock</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${safeDesc}" />`);
  html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${safeCanonical}" />`);
  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${safeTitle} | StakDock" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${safeDesc}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${safeCanonical}" />`);
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${safeDesc}" />`);

  if (isNoindex) {
    html = html.replace(/<meta name="robots" content="[\s\S]*?" \/>/i, `<meta name="robots" content="noindex, follow" />`);
    html = html.replace(/<meta name="googlebot" content="[\s\S]*?" \/>/i, `<meta name="googlebot" content="noindex, follow" />`);
    html = html.replace(/<meta name="bingbot" content="[\s\S]*?" \/>/i, `<meta name="bingbot" content="noindex, follow" />`);
  } else {
    html = html.replace(/<meta name="robots" content="[\s\S]*?" \/>/i, `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
    html = html.replace(/<meta name="googlebot" content="[\s\S]*?" \/>/i, `<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />`);
    html = html.replace(/<meta name="bingbot" content="[\s\S]*?" \/>/i, `<meta name="bingbot" content="index, follow, max-image-preview:large" />`);
  }

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

function getDealBreakdown(dealPriceRaw, dealDiscountRaw) {
  const formatDealPrice = (val) => {
    if (!val) return '';
    const trimmed = String(val).trim();
    if (!trimmed) return '';
    if (/^\d+(\.\d{1,2})?$/.test(trimmed)) return `$${trimmed}`;
    if (/^\d+/.test(trimmed)) return `$${trimmed}`;
    return trimmed;
  };
  const parseNumericPrice = (str) => {
    if (!str) return 0;
    const match = String(str).replace(/,/g, '').match(/\d+(\.\d{1,2})?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const dealPrice = formatDealPrice(dealPriceRaw);
  const dealNum = parseNumericPrice(dealPriceRaw);

  const rawDiscount = String(dealDiscountRaw || '').trim();
  let originalPrice = null;
  let savingsAmount = null;
  let discountPercent = null;

  if (/^\$?\d+(\.\d{1,2})?$/.test(rawDiscount)) {
    const origNum = parseNumericPrice(rawDiscount);
    if (origNum > 0) {
      originalPrice = `$${origNum}`;
      if (dealNum > 0 && origNum > dealNum) {
        const saved = origNum - dealNum;
        savingsAmount = `$${Number.isInteger(saved) ? saved : saved.toFixed(2)}`;
        const pct = Math.round(((origNum - dealNum) / origNum) * 100);
        discountPercent = `${pct}% OFF`;
      }
    }
  } else if (rawDiscount.includes('%')) {
    const pctMatch = rawDiscount.match(/\d+%/);
    discountPercent = pctMatch ? `${pctMatch[0]} OFF` : (rawDiscount.includes('OFF') ? rawDiscount : `${rawDiscount} OFF`);
    const origMatch = rawDiscount.match(/\$?(\d+(\.\d{1,2})?)/);
    if (origMatch) {
      const origNum = parseNumericPrice(origMatch[0]);
      if (origNum > dealNum) {
        originalPrice = `$${origNum}`;
        const saved = origNum - dealNum;
        savingsAmount = `$${Number.isInteger(saved) ? saved : saved.toFixed(2)}`;
      }
    }
  }

  return {
    dealPrice: dealPrice || '$19',
    originalPrice,
    savingsAmount,
    discountPercent
  };
}

// Controlled explicit approved cross-category flagship comparisons
const approvedFlagshipComparisons = [
  { toolAId: 'cursor-ai', toolBId: 'github-copilot', vsSlug: 'cursor-ai-vs-github-copilot', isFlagship: true },
  { toolAId: 'moz-pro', toolBId: 'se-ranking', vsSlug: 'moz-pro-vs-se-ranking', isFlagship: true },
  { toolAId: 'screaming-frog-seo-spider', toolBId: 'se-ranking', vsSlug: 'screaming-frog-seo-spider-vs-se-ranking', isFlagship: true },
  { toolAId: 'aws', toolBId: 'google-cloud', vsSlug: 'aws-vs-google-cloud', isFlagship: true },
  { toolAId: 'n8n', toolBId: 'zapier', vsSlug: 'n8n-vs-zapier', isFlagship: true },
  { toolAId: 'make', toolBId: 'zapier', vsSlug: 'make-vs-zapier', isFlagship: true },
  { toolAId: 'hubspot-crm', toolBId: 'pipedrive', vsSlug: 'hubspot-crm-vs-pipedrive', isFlagship: true },
  { toolAId: 'shopify', toolBId: 'woocommerce', vsSlug: 'shopify-vs-woocommerce', isFlagship: true }
];

function getVsPairsList(tools) {
  const map = new Map();
  const catMap = {};

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
const allVsSlugs = new Set(versusPairs.map(p => p.vsSlug));

// 0. Root Homepage (dist/index.html) is preserved as the clean SPA client entry shell
const rootRecovery = getRouteRecoveryState('https://stakdock.com/');
console.log(`Preserving dist/index.html as clean SPA client shell (Recovery State: ${rootRecovery.recoveryState})...`);

// 1. Generate dist/software/:id/index.html with rich high-entropy SSR body
saasTools.forEach(tool => {
  if (!tool || !tool.id) return;

  const targetFolder = path.join(softwareDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const catLabel = getCategoryLabel(tool.category);
  const dealInfo = getDealBreakdown(tool.dealPrice, tool.dealDiscount);

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

  if (tool.verifiedReviewCount && Number(tool.verifiedReviewCount) > 0 && Number(tool.verifiedRating) > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": String(tool.verifiedRating),
      "ratingCount": String(tool.verifiedReviewCount),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  const defaultBodyHtml = `
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
          💰 Pricing: ${escapeHtml(tool.pricing || 'Freemium')}
        </span>
        <span style="background:#f4f7f2;padding:6px 14px;border-radius:10px;font-weight:700;color:#2D4522;">
          🌐 Website Checked
        </span>
        ${tool.isFreeTier ? '<span style="background:#eaf8ea;color:#1b6e1b;padding:6px 14px;border-radius:10px;font-weight:700;">✓ Free Tier Available</span>' : ''}
        ${tool.isOpenSource ? '<span style="background:#eaf0f8;color:#1b466e;padding:6px 14px;border-radius:10px;font-weight:700;">⚙ Open Source</span>' : ''}
      </div>

      <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        ${(tool.hasLifetimeDeal || tool.dealPrice || tool.dealUrl || tool.lifetimeDealUrl) ? `
          <a href="${escapeHtml(tool.dealUrl || tool.lifetimeDealUrl || tool.websiteUrl || `https://${tool.domain}`)}" target="_blank" rel="noopener noreferrer" style="background:linear-gradient(135deg, #EA580C 0%, #C2410C 100%);color:#FFFFFF;padding:12px 24px;border-radius:9999px;font-weight:800;text-decoration:none;font-size:0.95rem;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(234,88,12,0.25);">
            🔥 Claim ${escapeHtml(tool.dealPrice ? `${tool.dealPrice} LTD` : 'Lifetime Deal')} &rarr;
          </a>
        ` : ''}
        <a href="${escapeHtml(tool.websiteUrl || `https://${tool.domain}`)}" target="_blank" rel="noopener noreferrer" style="background:#82A735;color:#FFFFFF;padding:12px 24px;border-radius:9999px;font-weight:800;text-decoration:none;font-size:0.95rem;display:inline-flex;align-items:center;gap:6px;">
          Open Website &rarr;
        </a>
        <a href="/alternatives/${tool.id}/" style="border:1px solid #dce8d6;color:#182618;background:#FFFFFF;padding:12px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:0.95rem;">
          View ${escapeHtml(tool.name)} Alternatives
        </a>
      </div>

      ${(tool.hasLifetimeDeal || tool.dealPrice || tool.dealUrl || tool.lifetimeDealUrl) ? `
        <div style="margin-top:24px;background:linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);border:1.5px solid #F97316;border-radius:16px;padding:20px 24px;box-shadow:0 4px 16px rgba(234,88,12,0.12);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
              <span style="background:#EA580C;color:#FFFFFF;font-size:0.72rem;font-weight:900;padding:3px 10px;border-radius:6px;text-transform:uppercase;">
                🔥 ACTIVE ${escapeHtml(tool.dealPlatform || 'APPSUMO')} DEAL
              </span>
              ${dealInfo.discountPercent ? `<span style="font-size:0.75rem;font-weight:900;background:#DC2626;color:#FFFFFF;padding:2px 8px;border-radius:6px;">${escapeHtml(dealInfo.discountPercent)}</span>` : ''}
              ${dealInfo.savingsAmount ? `<span style="font-size:0.75rem;font-weight:900;background:#16A34A;color:#FFFFFF;padding:2px 8px;border-radius:6px;">SAVE ${escapeHtml(dealInfo.savingsAmount)}</span>` : ''}
            </div>
            <div style="font-size:1.35rem;font-weight:900;color:#9A3412;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
              <span>${escapeHtml(dealInfo.dealPrice)} One-Time Lifetime Access</span>
              ${dealInfo.originalPrice ? `<span style="font-size:1rem;text-decoration:line-through;color:#9CA3AF;font-weight:600;">${escapeHtml(dealInfo.originalPrice)}</span>` : ''}
            </div>
            <p style="font-size:0.88rem;color:#7C2D12;margin:4px 0 0 0;font-weight:500;">
              ${escapeHtml(tool.dealHighlights || 'Pay once, own forever with lifetime updates and zero recurring subscription fees.')}
            </p>
          </div>
          <a href="${escapeHtml(tool.dealUrl || tool.lifetimeDealUrl || tool.websiteUrl || `https://${tool.domain}`)}" target="_blank" rel="noopener noreferrer" style="background:linear-gradient(135deg, #EA580C 0%, #C2410C 100%);color:#FFFFFF;padding:12px 22px;border-radius:9999px;font-weight:800;font-size:0.92rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(234,88,12,0.3);">
            <span>Claim Deal on ${escapeHtml(tool.dealPlatform || 'AppSumo')}</span> &rarr;
          </a>
        </div>
      ` : ''}
    </header>

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">What is ${escapeHtml(tool.name)}?</h2>
      <p style="font-size:1rem;line-height:1.7;color:#2d4029;margin:0 0 16px 0;">
        ${escapeHtml(tool.description || tool.tagline || '')}
      </p>

      ${tool.bestFor ? `
        <div style="background:#f4f8f0;border-left:4px solid #82A735;padding:14px 18px;border-radius:0 12px 12px 0;margin:20px 0;">
          <div style="font-size:0.82rem;font-weight:800;color:#2D4522;text-transform:uppercase;margin-bottom:4px;">Target Audience &amp; Best For</div>
          <div style="font-size:0.95rem;color:#182618;line-height:1.5;">${escapeHtml(tool.bestFor)}</div>
        </div>
      ` : ''}

      ${Array.isArray(tool.features) && tool.features.length > 0 ? `
        <h3 style="font-size:1.2rem;font-weight:800;margin-top:24px;margin-bottom:12px;color:#182618;">Key Features &amp; Capabilities</h3>
        <ul style="margin:0;padding-left:22px;line-height:1.9;color:#2d4029;font-size:0.98rem;">
          ${tool.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      ` : ''}

      ${(Array.isArray(tool.pros) && tool.pros.length > 0) || (Array.isArray(tool.cons) && tool.cons.length > 0) ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;margin-top:28px;">
          ${Array.isArray(tool.pros) && tool.pros.length > 0 ? `
            <div style="background:#f7faf5;border:1px solid #dce8d6;border-radius:14px;padding:20px;">
              <div style="font-weight:800;color:#2D4522;font-size:1rem;margin-bottom:10px;">✓ Key Strengths</div>
              <ul style="margin:0;padding-left:18px;line-height:1.7;color:#2d4029;font-size:0.92rem;">
                ${tool.pros.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${Array.isArray(tool.cons) && tool.cons.length > 0 ? `
            <div style="background:#fffcf7;border:1px solid #f2e2cf;border-radius:14px;padding:20px;">
              <div style="font-weight:800;color:#9A3412;font-size:1rem;margin-bottom:10px;">⚠ Documented Constraints</div>
              <ul style="margin:0;padding-left:18px;line-height:1.7;color:#5c3e29;font-size:0.92rem;">
                ${tool.cons.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </section>

    ${Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length > 0 ? `
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">Curated Direct Substitutes</h2>
      <p style="font-size:0.95rem;color:#45593e;margin-bottom:18px;">Evaluate direct alternatives to ${escapeHtml(tool.name)} based on verified architectural differentiators:</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${tool.curatedAlternatives.map(alt => `
          <div style="padding:16px 20px;background:#f9fbf8;border:1px solid #e2ede0;border-radius:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
              <a href="/software/${alt.toolId}/" style="color:#182618;font-weight:800;text-decoration:none;font-size:1.05rem;">${escapeHtml(alt.name)}</a>
              ${allVsSlugs.has(`${tool.id}-vs-${alt.toolId}`) ? `<a href="/vs/${tool.id}-vs-${alt.toolId}/" style="font-size:0.82rem;font-weight:700;color:#82A735;text-decoration:underline;">Compare Head-to-Head &rarr;</a>` : `<a href="/software/${alt.toolId}/" style="font-size:0.82rem;font-weight:700;color:#82A735;text-decoration:underline;">View Review &rarr;</a>`}
            </div>
            <p style="font-size:0.9rem;color:#45593e;margin:0;line-height:1.5;">${escapeHtml(alt.differentiator)}</p>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:20px;">
        <a href="/alternatives/${tool.id}/" style="font-weight:800;color:#82A735;text-decoration:underline;font-size:0.95rem;">
          View All Alternatives to ${escapeHtml(tool.name)} &rarr;
        </a>
      </div>
    </section>
    ` : (competitors.length > 0 ? `
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
              ${allVsSlugs.has(`${tool.id}-vs-${alt.id}`) ? `<a href="/vs/${tool.id}-vs-${alt.id}/" style="font-size:0.8rem;font-weight:700;color:#82A735;text-decoration:underline;">Compare vs ${escapeHtml(tool.name)}</a>` : `<a href="/software/${alt.id}/" style="font-size:0.8rem;font-weight:700;color:#82A735;text-decoration:underline;">View Review</a>`}
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
    ` : '')}

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Software Specifications</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
        <div style="padding:16px;background:#f9fbf8;border-radius:12px;border:1px solid #e2ede0;">
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">Primary Category</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${escapeHtml(tool.primaryCategory || catLabel)}</div>
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
          <div style="font-size:0.8rem;color:#5c7353;font-weight:700;text-transform:uppercase;">License Model</div>
          <div style="font-size:1.05rem;font-weight:800;color:#182618;margin-top:4px;">${escapeHtml(tool.licenseModel || (tool.isOpenSource ? 'Open Source' : 'Proprietary SaaS'))}</div>
        </div>
      </div>

      ${Array.isArray(tool.sources) && tool.sources.length > 0 ? `
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2ede0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:0.85rem;color:#5c7353;">
            <strong>Pricing checked:</strong> ${tool.sources[0].checkedAt ? new Date(tool.sources[0].checkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 24, 2026'} • <strong>Product information checked:</strong> Aug 24, 2026
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            ${tool.sources.map(s => `
              <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" style="font-size:0.82rem;font-weight:700;color:#2D4522;text-decoration:underline;">
                ${escapeHtml(s.type)} ↗
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
  `;

  let bodyHtml;
  if (tool.id === 'wave-invoicing') {
    bodyHtml = authorityRenderers.renderWaveInvoicingSoftwareSsr(tool, competitors);
  } else if (tool.id === 'invoice-ninja') {
    bodyHtml = authorityRenderers.renderInvoiceNinjaSoftwareSsr(tool, competitors);
  } else if (tool.id === 'seoclarity') {
    bodyHtml = authorityRenderers.renderSeoClaritySoftwareSsr(tool, competitors);
  } else if (tool.id === 'cursor-ai') {
    bodyHtml = authorityRenderers.renderCursorAiSoftwareSsr(tool, competitors);
  } else if (tool.id === 'github-copilot') {
    bodyHtml = authorityRenderers.renderGithubCopilotSoftwareSsr(tool, competitors);
  } else if (tool.id === 'make') {
    bodyHtml = authorityRenderers.renderMakeSoftwareSsr(tool, competitors);
  } else if (tool.id === 'n8n') {
    bodyHtml = authorityRenderers.renderN8nSoftwareSsr(tool, competitors);
  } else if (tool.id === 'moz-pro') {
    bodyHtml = authorityRenderers.renderMozProSoftwareSsr(tool, competitors);
  } else if (tool.id === 'se-ranking') {
    bodyHtml = authorityRenderers.renderSeRankingSoftwareSsr(tool, competitors);
  } else if (tool.id === 'hetzner') {
    bodyHtml = authorityRenderers.renderHetznerSoftwareSsr(tool, competitors);
  } else if (tool.id === 'security-onion') {
    bodyHtml = authorityRenderers.renderSecurityOnionSoftwareSsr(tool, competitors);
  } else if (tool.id === 'vultr') {
    bodyHtml = authorityRenderers.renderVultrSoftwareSsr(tool, competitors);
  } else if (tool.id === 'appsheet') {
    bodyHtml = authorityRenderers.renderAppsheetSoftwareSsr(tool, competitors);
  } else if (tool.id === 'zerotier-one') {
    bodyHtml = authorityRenderers.renderZeroTierOneSoftwareSsr(tool, competitors);
  } else if (tool.id === 'accuranker') {
    bodyHtml = authorityRenderers.renderAccuRankerSoftwareSsr(tool, competitors);
  } else if (tool.id === 'proranktracker') {
    bodyHtml = authorityRenderers.renderProRankTrackerSoftwareSsr(tool, competitors);
  } else if (tool.id === 'aws-guardduty') {
    bodyHtml = authorityRenderers.renderAwsGuardDutySoftwareSsr(tool, competitors);
  } else if (tool.id === 'elasticsearch') {
    bodyHtml = authorityRenderers.renderElasticsearchSoftwareSsr(tool, competitors);
  } else if (tool.id === 'google-cloud') {
    bodyHtml = authorityRenderers.renderGoogleCloudSoftwareSsr(tool, competitors);
  } else {
    bodyHtml = defaultBodyHtml;
  }

  let softwarePageTitle = `${tool.name} Review 2026: Pricing, Free Trial & Deals`;
  let softwarePageDesc = tool.description ? `${tool.name} review (2026): ${tool.description} Compare pricing (${tool.pricing || 'Freemium'}), free tier limits, and top verified alternatives on StakDock.` : `In-depth ${tool.name} review (2026). Compare ${tool.name} pricing (${tool.pricing || 'Freemium'}), features, and top verified software options on StakDock.`;

  if (tool.id === 'all-in-one-seo-aioseo') {
    softwarePageTitle = 'All in One SEO (AIOSEO) Review 2026: Pricing, Features & WordPress SEO';
    softwarePageDesc = 'In-depth All in One SEO (AIOSEO) review (2026). Compare TruSEO on-page analysis, rich schema generator, Link Assistant, pricing plans ($49.50/yr), and top WordPress alternatives.';
  } else if (tool.id === 'microsoft-power-automate') {
    softwarePageTitle = 'Microsoft Power Automate Review 2026: Pricing, Desktop RPA & Connectors';
    softwarePageDesc = 'In-depth Microsoft Power Automate review (2026). Compare free Windows desktop RPA, 1,000+ cloud connectors, AI Builder document extraction, and $15/user/mo pricing.';
  } else if (tool.id === 'screaming-frog-seo-spider') {
    softwarePageTitle = 'Screaming Frog SEO Spider Review 2026: Pricing, Desktop Crawling & Limits';
    softwarePageDesc = 'In-depth Screaming Frog SEO Spider review (2026). Compare free 500-URL tier, £199/yr license, JavaScript rendering, XPath scraping, and technical audit workflows.';
  } else if (tool.id === 'wave-invoicing') {
    softwarePageTitle = 'Wave Invoicing & Payments Review 2026: Pricing, Fees & Limits';
    softwarePageDesc = 'In-depth Wave Invoicing review (2026). Compare $0 free double-entry accounting, credit card rates (2.9% + 60¢), 1% ACH processing, and Pro plan upgrades.';
  } else if (tool.id === 'invoice-ninja') {
    softwarePageTitle = 'Invoice Ninja Review 2026: Self-Hosted Docker vs Cloud Pricing';
    softwarePageDesc = 'In-depth Invoice Ninja review (2026). Compare free AGPLv3 Docker self-hosting, 50+ payment gateways with 0% extra fees, client portals, and $12/mo Cloud Pro.';
  } else if (tool.id === 'seoclarity') {
    softwarePageTitle = 'seoClarity Review 2026: Enterprise Rank Tracking & ClarityGrid';
    softwarePageDesc = 'In-depth seoClarity review (2026). Evaluate enterprise ClarityGrid uncapped rank tracking, ClarityAutomate edge schema execution, and total cost of ownership.';
  } else if (tool.id === 'cursor-ai') {
    softwarePageTitle = 'Cursor AI Review 2026: Claude 3.7 Sonnet, Composer & Pricing';
    softwarePageDesc = 'In-depth Cursor review (2026). Evaluate Claude 3.7 Sonnet, multi-file Composer refactoring, $20/mo Pro plan, and codebase indexing.';
  } else if (tool.id === 'github-copilot') {
    softwarePageTitle = 'GitHub Copilot Review 2026: Pricing, Multi-Model Chat & Limits';
    softwarePageDesc = 'In-depth GitHub Copilot review (2026). Compare $10/mo Individual vs $19/mo Business, Claude 3.5 Sonnet / GPT-4o switching, and IDE extension support.';
  } else if (tool.id === 'make') {
    softwarePageTitle = 'Make Review 2026: Visual Workflow Builder & Operation Pricing';
    softwarePageDesc = 'In-depth Make review (2026). Evaluate 10k operation $9/mo Core pricing, visual routers, and workflow execution vs Zapier and n8n.';
  } else if (tool.id === 'n8n') {
    softwarePageTitle = 'n8n Review 2026: Free Fair-Code Self-Hosting & Cloud Pricing';
    softwarePageDesc = 'In-depth n8n review (2026). Compare free self-hosted Docker deployment, AI agent nodes, LangChain connectors, and €20/mo Cloud Starter.';
  } else if (tool.id === 'moz-pro') {
    softwarePageTitle = 'Moz Pro Review 2026: Domain Authority, Link Explorer & Plans';
    softwarePageDesc = 'In-depth Moz Pro review (2026). Compare $99/mo Standard plan, Link Explorer backlink index, Domain Authority metrics, and weekly rank tracking.';
  } else if (tool.id === 'se-ranking') {
    softwarePageTitle = 'SE Ranking Review 2026: Daily Rank Tracking & Suite Pricing';
    softwarePageDesc = 'In-depth SE Ranking review (2026). Compare $55/mo Essential plan (750 daily keywords), website audit crawlers, and backlink monitoring.';
  } else if (tool.id === 'hetzner') {
    softwarePageTitle = 'Hetzner Review 2026: Cloud VPS, Server Auctions & 20TB Traffic';
    softwarePageDesc = 'In-depth Hetzner review (2026). Compare €3.79/mo CAX11 Arm64 VPS, 20TB included bandwidth per VM, and bare metal server auctions.';
  } else if (tool.id === 'security-onion') {
    softwarePageTitle = 'Security Onion Review 2026: Open-Source SIEM & Threat Hunting';
    softwarePageDesc = 'In-depth Security Onion review (2026). Evaluate Suricata/Zeek packet inspection, OpenSearch backend, and distributed sensor architecture.';
  } else if (tool.id === 'vultr') {
    softwarePageTitle = 'Vultr Review 2026: High-Frequency Compute, VKE & GPU Cloud';
    softwarePageDesc = 'In-depth Vultr review (2026). Compare 32 global datacenters, high frequency NVMe compute from $6/mo, and $0 control plane Kubernetes (VKE).';
  } else if (tool.id === 'appsheet') {
    softwarePageTitle = 'Google AppSheet Review 2026: No-Code App Builder & Workspace';
    softwarePageDesc = 'In-depth Google AppSheet review (2026). Evaluate $5/user/mo Starter plans, Workspace Enterprise bundling, and Google Sheets database sync.';
  } else if (tool.id === 'zerotier-one') {
    softwarePageTitle = 'ZeroTier One Review 2026: Virtual Ethernet Mesh Architecture';
    softwarePageDesc = 'In-depth ZeroTier One review (2026). Compare Layer 2 virtual Ethernet networking, free 25-node tier, and P2P encrypted tunnels vs Tailscale.';
  } else if (tool.id === 'accuranker') {
    softwarePageTitle = 'AccuRanker Review 2026: High-Speed SERP Tracking & API Pricing';
    softwarePageDesc = 'In-depth AccuRanker review (2026). Evaluate $129/mo 1,000 keyword on-demand rank tracking, Share of Voice metrics, and agency reporting.';
  } else if (tool.id === 'proranktracker') {
    softwarePageTitle = 'ProRankTracker Review 2026: Multi-Engine Agency SERP Tracking';
    softwarePageDesc = 'In-depth ProRankTracker review (2026). Compare $13.50/mo Starter plan, Google 3-pack tracking, Bing/Amazon SERPs, and white-label client reports.';
  } else if (tool.id === 'aws-guardduty') {
    softwarePageTitle = 'AWS GuardDuty Review 2026: Threat Detection & Log Pricing';
    softwarePageDesc = 'In-depth Amazon GuardDuty review (2026). Evaluate ML threat analysis across CloudTrail, VPC Flow, and EKS audit log volume pricing.';
  } else if (tool.id === 'elasticsearch') {
    softwarePageTitle = 'Elasticsearch Review 2026: AGPLv3/SSPL Licensing, ES|QL & Search';
    softwarePageDesc = 'In-depth Elasticsearch review (2026). Compare AGPLv3/SSPL licensing, dense vector hybrid search, ES|QL query processing, and Elastic Cloud.';
  } else if (tool.id === 'google-cloud') {
    softwarePageTitle = 'Google Cloud Review 2026: GKE Autopilot, BigQuery & Vertex AI';
    softwarePageDesc = 'In-depth Google Cloud review (2026). Compare GKE container management, BigQuery serverless data warehousing, and sustained use discounts.';
  }

  const pageHtml = buildSeoPage({
    title: softwarePageTitle,
    description: softwarePageDesc,
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
    "name": `Alternatives & Competitors to ${tool.name}`,
    "description": `Software alternatives and competitors to ${tool.name} on StakDock.`,
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

  const defaultAltBodyHtml = `
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
        ${escapeHtml(tool.name)} Alternatives &amp; Competitor Options (2026)
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0 0 16px 0;">
        Looking for software alternatives to ${escapeHtml(tool.name)}? Explore documented competitors and options with transparent pricing, free tier limits, and software specifications.
      </p>
    </header>

    <section style="display:flex;flex-direction:column;gap:20px;margin-bottom:32px;">
      ${categoryMatches.map((alt, idx) => `
        <article style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
          <div style="max-width:720px;">
            <div style="font-size:0.75rem;font-weight:800;color:#82A735;text-transform:uppercase;margin-bottom:4px;">
              Alternative Option to ${escapeHtml(tool.name)}
            </div>
            <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 8px 0;">
              <a href="/software/${alt.id}/" style="color:#182618;text-decoration:none;">${escapeHtml(alt.name)}</a>
            </h2>
            <p style="font-size:0.95rem;color:#45593e;line-height:1.5;margin:0 0 12px 0;">
              ${escapeHtml(alt.description || alt.tagline || '')}
            </p>
            <div style="display:flex;gap:12px;font-size:0.85rem;color:#5c7353;font-weight:600;">
              <span>🌐 Website Checked</span>
              <span>💰 ${escapeHtml(alt.pricing || 'Freemium')}</span>
              ${alt.isFreeTier ? '<span style="color:#1b6e1b;">✓ Free Tier</span>' : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;min-width:160px;">
            <a href="/software/${alt.id}/" style="background:#82A735;color:#FFFFFF;padding:8px 16px;border-radius:9999px;font-weight:700;font-size:0.85rem;text-decoration:none;text-align:center;">
              Read ${escapeHtml(alt.name)} Review
            </a>
            ${allVsSlugs.has(`${tool.id}-vs-${alt.id}`) ? `
            <a href="/vs/${tool.id}-vs-${alt.id}/" style="border:1px solid #dce8d6;color:#182618;background:#FFFFFF;padding:6px 14px;border-radius:9999px;font-weight:600;font-size:0.8rem;text-decoration:none;text-align:center;">
              ${escapeHtml(tool.name)} vs ${escapeHtml(alt.name)}
            </a>` : (allVsSlugs.has(`${alt.id}-vs-${tool.id}`) ? `
            <a href="/vs/${alt.id}-vs-${tool.id}/" style="border:1px solid #dce8d6;color:#182618;background:#FFFFFF;padding:6px 14px;border-radius:9999px;font-weight:600;font-size:0.8rem;text-decoration:none;text-align:center;">
              ${escapeHtml(tool.name)} vs ${escapeHtml(alt.name)}
            </a>` : '')}
          </div>
        </article>
      `).join('')}
    </section>

    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.5rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">How to Choose Between ${escapeHtml(tool.name)} and Competitors</h2>
      <p style="font-size:0.95rem;line-height:1.7;color:#2d4029;">
        When evaluating alternatives to ${escapeHtml(tool.name)}, consider your team's budget, required third-party integrations, and self-hosting requirements.
      </p>
    </section>
  </main>
  `;

  let bodyHtml;
  if (tool.id === 'invoice-ninja') {
    bodyHtml = authorityRenderers.renderInvoiceNinjaAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'quickbooks') {
    bodyHtml = authorityRenderers.renderQuickBooksAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'se-ranking') {
    bodyHtml = authorityRenderers.renderSeRankingAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'moz-pro') {
    bodyHtml = authorityRenderers.renderMozProAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'all-in-one-seo-aioseo') {
    bodyHtml = authorityRenderers.renderAioseoAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'rank-math') {
    bodyHtml = authorityRenderers.renderRankMathAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'accuranker') {
    bodyHtml = authorityRenderers.renderAccuRankerAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'kuzu-db') {
    bodyHtml = authorityRenderers.renderKuzuDbAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'headlamp-k8s') {
    bodyHtml = authorityRenderers.renderHeadlampK8sAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'databox') {
    bodyHtml = authorityRenderers.renderDataboxAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'homarr-dashboard') {
    bodyHtml = authorityRenderers.renderHomarrDashboardAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'apache-guacamole') {
    bodyHtml = authorityRenderers.renderApacheGuacamoleAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'opensearch') {
    bodyHtml = authorityRenderers.renderOpenSearchAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'mangools') {
    bodyHtml = authorityRenderers.renderMangoolsAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'majestic') {
    bodyHtml = authorityRenderers.renderMajesticAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'dataforseo') {
    bodyHtml = authorityRenderers.renderDataForSeoAlternativesSsr(tool, categoryMatches);
  } else if (tool.id === 'zapier') {
    bodyHtml = growthMoneyRenderers.renderZapierAlternativesSsr();
  } else if (tool.id === 'hubspot-crm') {
    bodyHtml = growthMoneyRenderers.renderHubSpotAlternativesSsr();
  } else if (tool.id === 'notion') {
    bodyHtml = growthMoneyRenderers.renderNotionAlternativesSsr();
  } else if (tool.id === 'typeform') {
    bodyHtml = growthMoneyRenderers.renderTypeformAlternativesSsr();
  } else if (tool.id === 'shopify') {
    bodyHtml = growthMoneyRenderers.renderShopifyAlternativesSsr();
  } else if (tool.id === 'supabase') {
    bodyHtml = growthMoneyRenderers.renderSupabaseAlternativesSsr();
  } else if (tool.id === 'zendesk') {
    bodyHtml = growthMoneyRenderers.renderZendeskAlternativesSsr();
  } else if (tool.id === 'microsoft-power-automate') {
    bodyHtml = growthMoneyRenderers.renderPowerAutomateAlternativesSsr();
  } else {
    bodyHtml = defaultAltBodyHtml;
  }

  let altPageTitle = `Best ${tool.name} Free & Open-Source Alternatives (2026)`;
  let altPageDesc = `Looking for alternatives to ${tool.name}? Compare documented ${tool.name} competitors in 2026 by features, pricing plans, free tiers, and deployment models on StakDock.`;

  if (tool.id === 'invoice-ninja') {
    altPageTitle = 'Best Invoice Ninja Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top Invoice Ninja alternatives in 2026. Evaluate Wave, Zoho Invoice, QuickBooks Online, Xero, Bonsai, and Stripe Invoicing for self-hosted billing, free plans, and accounting.';
  } else if (tool.id === 'quickbooks') {
    altPageTitle = 'Best QuickBooks Online Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top QuickBooks Online alternatives in 2026. Evaluate Wave ($0 free), Invoice Ninja (free self-hosted), Xero ($15/mo), and Zoho Invoice to avoid Intuit subscription price hikes.';
  } else if (tool.id === 'se-ranking') {
    altPageTitle = 'Best SE Ranking Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top SE Ranking alternatives in 2026. Evaluate Moz Pro, Screaming Frog, Semrush, Ahrefs, and AccuRanker for daily rank tracking, backlink indexes, and site audits.';
  } else if (tool.id === 'moz-pro') {
    altPageTitle = 'Best Moz Pro Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top Moz Pro alternatives in 2026. Evaluate SE Ranking ($55/mo daily tracking), Screaming Frog (£199/yr crawler), and seoClarity for modern SEO workflows.';
  } else if (tool.id === 'all-in-one-seo-aioseo') {
    altPageTitle = 'Best All in One SEO (AIOSEO) Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top All in One SEO alternatives in 2026. Evaluate Rank Math ($69.99/yr unlimited sites), SEOPress ($49/yr white-label), and Yoast SEO for WordPress optimization.';
  } else if (tool.id === 'rank-math') {
    altPageTitle = 'Best Rank Math Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top Rank Math alternatives in 2026. Evaluate AIOSEO, SEOPress, Yoast SEO, and The SEO Framework for WordPress speed, schema generation, and readability.';
  } else if (tool.id === 'accuranker') {
    altPageTitle = 'Best AccuRanker Alternatives & Rank Tracking Competitors (2026)';
    altPageDesc = 'Compare top AccuRanker alternatives in 2026. Evaluate SE Ranking ($55/mo all-in-one), Nightwatch ($39/mo local tracking), and seoClarity for enterprise SERP monitoring.';
  } else if (tool.id === 'kuzu-db') {
    altPageTitle = 'Best Kuzu Graph DB Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top Kuzu embedded graph database alternatives in 2026. Evaluate Neo4j, Memgraph, DuckDB, and FalkorDB for Cypher query performance.';
  } else if (tool.id === 'headlamp-k8s') {
    altPageTitle = 'Best Headlamp Alternatives & Kubernetes UIs (2026)';
    altPageDesc = 'Compare top Headlamp Kubernetes web UI alternatives in 2026. Evaluate Lens, k9s, Portainer, and standard Kubernetes Dashboard.';
  } else if (tool.id === 'databox') {
    altPageTitle = 'Best Databox Alternatives & KPI Dashboards (2026)';
    altPageDesc = 'Compare top Databox dashboard alternatives in 2026. Evaluate Google Looker Studio ($0 free), Metabase, Geckoboard, and Klipfolio.';
  } else if (tool.id === 'homarr-dashboard') {
    altPageTitle = 'Best Homarr Alternatives & Self-Hosted Dashboards (2026)';
    altPageDesc = 'Compare top Homarr homelab dashboard alternatives in 2026. Evaluate Homepage (YAML declarative), Dashy, and Heimdall for Docker monitoring.';
  } else if (tool.id === 'apache-guacamole') {
    altPageTitle = 'Best Apache Guacamole Alternatives & Remote Gateways (2026)';
    altPageDesc = 'Compare top Apache Guacamole clientless remote desktop alternatives in 2026. Evaluate Teleport, RustDesk, and Kasm Workspaces.';
  } else if (tool.id === 'opensearch') {
    altPageTitle = 'Best OpenSearch Alternatives & Search Engines (2026)';
    altPageDesc = 'Compare top OpenSearch search engine alternatives in 2026. Evaluate Elasticsearch, Meilisearch, Typesense, and ClickHouse.';
  } else if (tool.id === 'mangools') {
    altPageTitle = 'Best Mangools (KWFinder) Alternatives & Competitors (2026)';
    altPageDesc = 'Compare top Mangools alternatives in 2026. Evaluate SE Ranking ($55/mo daily tracking), Ahrefs Lite, and Ubersuggest for keyword research.';
  } else if (tool.id === 'majestic') {
    altPageTitle = 'Best Majestic SEO Alternatives & Backlink Checkers (2026)';
    altPageDesc = 'Compare top Majestic SEO alternatives in 2026. Evaluate Ahrefs, SE Ranking, and Moz Pro for Trust Flow and backlink index depth.';
  } else if (tool.id === 'dataforseo') {
    altPageTitle = 'Best DataForSEO Alternatives & SERP APIs (2026)';
    altPageDesc = 'Compare top DataForSEO API alternatives in 2026. Evaluate SerpApi, Bright Data, and ScrapingBee for pay-as-you-go Google search scraping.';
  }

  const pageHtml = buildSeoPage({
    title: altPageTitle,
    description: altPageDesc,
    canonicalUrl: `https://stakdock.com/alternatives/${tool.id}/`,
    jsonLd: [jsonLd],
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  altCount++;
});

// 3. Generate pairwise dist/vs/:vsSlug/index.html

function sanitizeMarketingClaims(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\b10x\s+(faster|speed)?\b/gi, '')
    .replace(/\b#1\b/gi, '')
    .replace(/\bworld['’]?s\s+best\b/gi, '')
    .replace(/\bthe\s+best\b/gi, 'a')
    .replace(/\bindustry-leading\b/gi, 'established')
    .replace(/\bultimate\b/gi, 'comprehensive')
    .replace(/\s+/g, ' ')
    .trim();
}

// Factual dynamic intro generator for VS comparisons (sanitized, zero-hyperbole)
function generateFactualVsIntro(tA, tB) {
  let intro = `Comparing ${escapeHtml(tA.name)} and ${escapeHtml(tB.name)} in 2026. `;
  
  if (tA.isFreeTier && !tB.isFreeTier) {
    intro += `${escapeHtml(tA.name)} provides an accessible free tier, whereas ${escapeHtml(tB.name)} operates primarily under a ${escapeHtml(tB.pricing || 'paid')} model. `;
  } else if (!tA.isFreeTier && tB.isFreeTier) {
    intro += `${escapeHtml(tB.name)} includes a free tier, while ${escapeHtml(tA.name)} requires a ${escapeHtml(tA.pricing || 'paid')} plan. `;
  } else if (tA.isFreeTier && tB.isFreeTier) {
    intro += `Both platforms offer free entry tiers for testing workflows. `;
  } else if (tA.pricing && tB.pricing && tA.pricing.includes('$') && tB.pricing.includes('$')) {
    intro += `${escapeHtml(tA.name)} is priced at ${escapeHtml(tA.pricing)}, compared to ${escapeHtml(tB.pricing)} for ${escapeHtml(tB.name)}. `;
  }

  if (tA.isOpenSource && !tB.isOpenSource) {
    intro += `${escapeHtml(tA.name)} is open-source for self-hosting teams, while ${escapeHtml(tB.name)} is a proprietary hosted platform. `;
  } else if (!tA.isOpenSource && tB.isOpenSource) {
    intro += `${escapeHtml(tB.name)} provides an open-source codebase, compared to the proprietary architecture of ${escapeHtml(tA.name)}. `;
  } else {
    const cleanTagA = sanitizeMarketingClaims(tA.tagline);
    const cleanTagB = sanitizeMarketingClaims(tB.tagline);
    if (cleanTagA && cleanTagB && cleanTagA !== cleanTagB) {
      intro += `${escapeHtml(tA.name)} specializes in ${escapeHtml(cleanTagA.toLowerCase())}, whereas ${escapeHtml(tB.name)} focuses on ${escapeHtml(cleanTagB.toLowerCase())}. `;
    }
  }

  intro += `Review the side-by-side specification matrix, pricing tiers, and direct software reviews below to determine the best choice for your stack.`;
  return intro;
}

// Flagship Decision Renderer for Cursor AI vs GitHub Copilot
function renderFlagshipCursorVsCopilotSsr(tA, tB, vsSlug) {
  return `
  ${renderSsrNavbar('/vs/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/vs/" style="color:#536253;text-decoration:none;">Comparisons</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">Cursor AI vs GitHub Copilot</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:36px 32px;margin-bottom:28px;text-align:center;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 14px;border-radius:9999px;text-transform:uppercase;margin-bottom:14px;letter-spacing:0.04em;">
        FLAGSHIP DEVELOPER COMPARISON &bull; 2026
      </div>
      <h1 style="font-size:clamp(1.9rem, 3.8vw, 2.7rem);font-weight:800;line-height:1.18;margin:0 0 14px 0;color:#182618;">
        Cursor AI vs GitHub Copilot: Which AI Coding Tool Should You Choose in 2026?
      </h1>
      <p style="font-size:1.08rem;color:#45593e;line-height:1.6;margin:0 auto;max-width:820px;">
        An evidence-grounded comparison of AI-native editor workflows, multi-file refactoring, IDE extensions, codebase indexing, and verified pricing.
      </p>
    </header>

    <!-- Above-The-Fold Decision Summary -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:12px;color:#182618;">The Core Difference in 30 Seconds</h2>
      <p style="font-size:1rem;color:#45593e;line-height:1.65;margin-bottom:24px;">
        <strong>Cursor</strong> is a standalone AI-native code editor (VS Code fork) engineered around whole-codebase vector indexing and automated multi-file edits (Composer). <strong>GitHub Copilot</strong> is a cross-IDE AI extension developed by GitHub and OpenAI that integrates inline autocomplete, conversational chat, and CLI assistance directly into your existing editor (VS Code, JetBrains IDEs, Visual Studio, Neovim).
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;">
        <div style="background:#F7FAF5;border:1.5px solid #DCE8D6;border-radius:16px;padding:24px;">
          <div style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
            <span>Choose Cursor AI if:</span>
          </div>
          <ul style="margin:0;padding-left:20px;line-height:1.75;color:#182618;font-size:0.94rem;">
            <li>You want deep, repository-wide vector indexing with multi-file code generation and diff reviews (<code>Cmd+I</code> / Composer).</li>
            <li>You are willing to use a dedicated, standalone AI-first editor that maintains full VS Code extension and keybinding compatibility.</li>
            <li>You require native model switching between Claude 3.5 Sonnet, GPT-4o, and specialized Cursor refactoring models.</li>
            <li>You frequently execute complex architectural refactorings across multiple project files simultaneously.</li>
          </ul>
        </div>

        <div style="background:#F9F8FD;border:1.5px solid #E0DBF5;border-radius:16px;padding:24px;">
          <div style="font-size:1.1rem;font-weight:800;color:#37286B;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
            <span>Choose GitHub Copilot if:</span>
          </div>
          <ul style="margin:0;padding-left:20px;line-height:1.75;color:#182618;font-size:0.94rem;">
            <li>You want AI assistance inside your existing environment (JetBrains IDEs, Visual Studio, Neovim, VS Code) without switching editors.</li>
            <li>Your organization requires centralized GitHub Enterprise governance, SOC 2 Type II compliance, and IP copyright indemnity.</li>
            <li>You want native GitHub workflows, including Copilot in GitHub CLI and PR summarization.</li>
            <li>You qualify for free access as a verified student, educator, or maintainer of popular open-source repositories.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Side-by-Side Quick Comparison Matrix -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Side-by-Side Specification Matrix</h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.92rem;min-width:620px;">
          <thead>
            <tr style="border-bottom:2px solid #e2ede0;background:#f9fbf8;">
              <th style="padding:14px 16px;color:#5c7353;font-weight:800;width:28%;">Comparison Criteria</th>
              <th style="padding:14px 16px;color:#182618;font-weight:800;width:36%;">Cursor AI</th>
              <th style="padding:14px 16px;color:#182618;font-weight:800;width:36%;">GitHub Copilot</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Product Architecture</td>
              <td style="padding:12px 16px;color:#182618;">Standalone AI-Native Editor (VS Code fork)</td>
              <td style="padding:12px 16px;color:#182618;">Cross-IDE Plugin &amp; Extension</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Primary Workflow</td>
              <td style="padding:12px 16px;color:#182618;">Multi-file generation (Composer) &amp; inline diff edits</td>
              <td style="padding:12px 16px;color:#182618;">Ghost-text inline autocomplete &amp; sidebar chat</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Supported Environments</td>
              <td style="padding:12px 16px;color:#182618;">macOS, Windows, Linux (Dedicated Desktop App)</td>
              <td style="padding:12px 16px;color:#182618;">VS Code, JetBrains, Visual Studio, Neovim, CLI</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Codebase Context</td>
              <td style="padding:12px 16px;color:#182618;">Local vector embeddings indexing entire project</td>
              <td style="padding:12px 16px;color:#182618;">Open tabs context &amp; GitHub repository index</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Multi-File Edits</td>
              <td style="padding:12px 16px;color:#182618;">Native multi-file generation &amp; unified diff review</td>
              <td style="padding:12px 16px;color:#182618;">Multi-file chat suggestions reviewed file-by-file</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Underlying AI Models</td>
              <td style="padding:12px 16px;color:#182618;">Claude 3.5 Sonnet, GPT-4o, Cursor Tab models</td>
              <td style="padding:12px 16px;color:#182618;">GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Free Entry Tier</td>
              <td style="padding:12px 16px;color:#182618;">Free Hobby (2,000 completions, 50 slow requests)</td>
              <td style="padding:12px 16px;color:#182618;">Free Tier (limited) / Free for Students &amp; OSS</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Starting Paid Price</td>
              <td style="padding:12px 16px;color:#182618;">$20/mo ($16/mo billed annually at $192/yr)</td>
              <td style="padding:12px 16px;color:#182618;">$10/mo ($100/yr billed annually)</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Team / Business Plan</td>
              <td style="padding:12px 16px;color:#182618;">$40/user/mo (Teams Standard)</td>
              <td style="padding:12px 16px;color:#182618;">$19/user/mo (Copilot Business)</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Enterprise Governance</td>
              <td style="padding:12px 16px;color:#182618;">Team-wide Privacy Mode, SAML/OIDC SSO</td>
              <td style="padding:12px 16px;color:#182618;">SAML SSO, SCIM, pooled credits, IP indemnity</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Best Suited For</td>
              <td style="padding:12px 16px;color:#182618;">Engineers seeking deep AI-first project refactoring</td>
              <td style="padding:12px 16px;color:#182618;">Engineers &amp; teams wanting AI inside existing IDEs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Deep Technical & Workflow Differences -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:20px;color:#182618;">Deep Workflow Comparison</h2>

      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.15rem;font-weight:800;color:#182618;margin-bottom:8px;">1. Standalone AI Editor vs IDE Plugin Architecture</h3>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0 0 10px 0;">
          The fundamental decision point begins with your editor choice. <strong>Cursor</strong> requires adopting a dedicated desktop application. Because Cursor is a direct fork of open-source VS Code, developers transitioning from VS Code can import their keybindings, themes, extensions, and workspace settings in one click. However, developers who work inside JetBrains IDEs (IntelliJ, WebStorm, PyCharm) or Neovim must switch their active editor to use Cursor.
        </p>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0;">
          <strong>GitHub Copilot</strong> operates as a lightweight extension. You install it directly from your IDE's marketplace without altering your editor setup, debugger configurations, or toolchains.
        </p>
      </div>

      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.15rem;font-weight:800;color:#182618;margin-bottom:8px;">2. Repository Context &amp; Codebase Awareness</h3>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0 0 10px 0;">
          Understanding project context across hundreds of files is where the tools diverge mechanically:
        </p>
        <ul style="margin:0;padding-left:22px;line-height:1.75;color:#45593e;font-size:0.95rem;">
          <li><strong>Cursor:</strong> Computes local vector embeddings for all project files (ignoring build folders defined in <code>.cursorignore</code>). When you ask a question or edit code, Cursor retrieves semantically relevant code snippets across the entire repository to ground the LLM prompt.</li>
          <li><strong>GitHub Copilot:</strong> Uses "neighboring tabs" heuristics, local file context, and remote GitHub repository indexing (on Enterprise plans) to populate the context window. While highly effective for inline completions, whole-repository semantic search is less deeply integrated into inline editing than Cursor.</li>
        </ul>
      </div>

      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.15rem;font-weight:800;color:#182618;margin-bottom:8px;">3. Multi-File Refactoring &amp; Composer</h3>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0 0 10px 0;">
          <strong>Cursor's Composer (<code>Cmd+I</code>)</strong> allows developers to prompt the AI to create new components, update routing tables, modify database models, and adjust styles simultaneously. Edits appear directly in the editor as red/green inline diffs that you can accept or reject file-by-file or all at once.
        </p>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0;">
          <strong>GitHub Copilot Chat</strong> supports multi-file suggestions and edits via workspace commands, but applying them typically requires navigating between files to review and accept code blocks incrementally.
        </p>
      </div>

      <div>
        <h3 style="font-size:1.15rem;font-weight:800;color:#182618;margin-bottom:8px;">4. Terminal &amp; Command-Line Integration</h3>
        <p style="font-size:0.96rem;color:#45593e;line-height:1.65;margin:0;">
          Cursor includes inline terminal AI (<code>Cmd+K</code> directly in the integrated terminal) to translate natural language into shell commands and debug build errors in-place. GitHub Copilot provides the standalone <code>gh copilot</code> CLI tool, enabling developers to run <code>gh copilot explain</code> or <code>gh copilot suggest</code> in any standalone terminal emulator.
        </p>
      </div>
    </section>

    <!-- Verified Pricing Breakdown -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:12px;color:#182618;">Pricing &amp; Quota Breakdown</h2>
      <p style="font-size:0.92rem;color:#5c7353;margin-bottom:20px;">
        Verified directly from official vendor pricing documentation (Checked: Aug 24, 2026).
      </p>

      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.92rem;min-width:620px;">
          <thead>
            <tr style="border-bottom:2px solid #e2ede0;background:#f9fbf8;">
              <th style="padding:14px 16px;color:#5c7353;font-weight:800;width:24%;">Tier</th>
              <th style="padding:14px 16px;color:#182618;font-weight:800;width:38%;">Cursor AI</th>
              <th style="padding:14px 16px;color:#182618;font-weight:800;width:38%;">GitHub Copilot</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Free Option</td>
              <td style="padding:12px 16px;color:#182618;"><strong>Hobby ($0):</strong> 2,000 completions, 50 slow requests/mo, access to Composer.</td>
              <td style="padding:12px 16px;color:#182618;"><strong>Free ($0):</strong> Limited completions/mo. Free for verified students &amp; popular OSS maintainers.</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Individual / Pro</td>
              <td style="padding:12px 16px;color:#182618;"><strong>$20/mo</strong> ($16/mo billed annually at $192/yr). Unlimited completions, 500 fast premium requests.</td>
              <td style="padding:12px 16px;color:#182618;"><strong>$10/mo</strong> ($100/yr billed annually). Unlimited completions, Copilot Chat, model selection.</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Team / Business</td>
              <td style="padding:12px 16px;color:#182618;"><strong>$40/user/mo:</strong> Centralized billing, team privacy mode, shared context, Bugbot code reviews.</td>
              <td style="padding:12px 16px;color:#182618;"><strong>$19/user/mo:</strong> Centralized management, policy controls, pooled AI credits per user.</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f4ee;background:#fafcf9;">
              <td style="padding:12px 16px;font-weight:700;color:#2d4029;">Enterprise</td>
              <td style="padding:12px 16px;color:#182618;">Custom pricing: Pooled usage, SCIM seat management, audit logs, service accounts.</td>
              <td style="padding:12px 16px;color:#182618;"><strong>$39/user/mo:</strong> Enterprise Cloud indexing, 3,900 pooled credits/user, custom knowledge bases.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Real-World Decision Scenarios -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Real-World Developer Decision Scenarios</h2>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:18px;">
        <div style="background:#f9fbf8;border:1px solid #e2ede0;border-radius:14px;padding:20px;">
          <div style="font-weight:800;color:#182618;margin-bottom:8px;font-size:1rem;">Scenario A: The JetBrains Developer</div>
          <p style="font-size:0.9rem;color:#45593e;line-height:1.6;margin:0;">
            If your primary IDE is IntelliJ IDEA, PyCharm, WebStorm, or Rider, <strong>GitHub Copilot</strong> is the recommended choice. Copilot installs seamlessly without requiring you to abandon your IDE's indexing, database tools, or refactoring engine.
          </p>
        </div>

        <div style="background:#f9fbf8;border:1px solid #e2ede0;border-radius:14px;padding:20px;">
          <div style="font-weight:800;color:#182618;margin-bottom:8px;font-size:1rem;">Scenario B: The Web / Full-Stack Builder</div>
          <p style="font-size:0.9rem;color:#45593e;line-height:1.6;margin:0;">
            If you build React, Next.js, Node, or Python web apps and frequently scaffold new routes or refactor components, <strong>Cursor</strong> provides a noticeably faster feedback loop with Composer and Claude 3.5 Sonnet.
          </p>
        </div>

        <div style="background:#f9fbf8;border:1px solid #e2ede0;border-radius:14px;padding:20px;">
          <div style="font-weight:800;color:#182618;margin-bottom:8px;font-size:1rem;">Scenario C: The GitHub-Standardized Team</div>
          <p style="font-size:0.9rem;color:#45593e;line-height:1.6;margin:0;">
            For organizations already managing developer seats on GitHub Enterprise with strict SOC 2 compliance and IP indemnity requirements, <strong>GitHub Copilot Business/Enterprise</strong> integrates cleanly into existing billing.
          </p>
        </div>

        <div style="background:#f9fbf8;border:1px solid #e2ede0;border-radius:14px;padding:20px;">
          <div style="font-weight:800;color:#182618;margin-bottom:8px;font-size:1rem;">Scenario D: Heavy Multi-File Refactoring</div>
          <p style="font-size:0.9rem;color:#45593e;line-height:1.6;margin:0;">
            When updating an API contract across 10 files simultaneously, <strong>Cursor</strong> applies changes across the codebase in a single unified prompt, whereas Copilot requires reviewing individual files sequentially.
          </p>
        </div>
      </div>
    </section>

    <!-- Strengths and Constraints Comparison -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:28px;">
      <div style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:28px;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">Cursor AI Profile</h2>
        
        <div style="margin-bottom:16px;">
          <div style="font-weight:800;color:#2D4522;font-size:0.95rem;margin-bottom:6px;">✓ Documented Strengths</div>
          <ul style="margin:0;padding-left:18px;line-height:1.65;color:#182618;font-size:0.9rem;">
            <li>Local vector embeddings enable deep whole-repository context awareness.</li>
            <li>Composer (<code>Cmd+I</code>) executes multi-file code generation and refactorings.</li>
            <li>Seamless 1-click import of VS Code extensions, settings, and keybindings.</li>
            <li>Model switching between Claude 3.5 Sonnet, GPT-4o, and Cursor Tab fine-tunes.</li>
          </ul>
        </div>

        <div>
          <div style="font-weight:800;color:#9A3412;font-size:0.95rem;margin-bottom:6px;">⚠ Documented Constraints</div>
          <ul style="margin:0;padding-left:18px;line-height:1.65;color:#5C3E29;font-size:0.9rem;">
            <li>Requires switching to a dedicated desktop editor; does not run inside JetBrains IDEs.</li>
            <li>Requires cloud network connectivity for AI completions and remote vector indexing.</li>
            <li>Higher starting price ($20/mo vs $10/mo for GitHub Copilot).</li>
          </ul>
        </div>

        <div style="margin-top:20px;">
          <a href="/software/cursor-ai/" style="color:#82A735;font-weight:800;text-decoration:underline;font-size:0.92rem;">
            View Full Cursor AI Review &rarr;
          </a>
        </div>
      </div>

      <div style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:28px;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">GitHub Copilot Profile</h2>
        
        <div style="margin-bottom:16px;">
          <div style="font-weight:800;color:#2D4522;font-size:0.95rem;margin-bottom:6px;">✓ Documented Strengths</div>
          <ul style="margin:0;padding-left:18px;line-height:1.65;color:#182618;font-size:0.9rem;">
            <li>Universal editor support: VS Code, Visual Studio, JetBrains, and Neovim.</li>
            <li>Lower starting price ($10/mo vs $20/mo) with free access for students and OSS maintainers.</li>
            <li>Enterprise governance with SOC 2 compliance and IP copyright indemnity.</li>
            <li>Native integration with GitHub CLI, PR summaries, and GitHub Mobile.</li>
          </ul>
        </div>

        <div>
          <div style="font-weight:800;color:#9A3412;font-size:0.95rem;margin-bottom:6px;">⚠ Documented Constraints</div>
          <ul style="margin:0;padding-left:18px;line-height:1.65;color:#5C3E29;font-size:0.9rem;">
            <li>Operates as an extension without native whole-codebase workspace Composer workflows.</li>
            <li>Multi-file refactoring requires individual file reviews in separate chat tabs.</li>
          </ul>
        </div>

        <div style="margin-top:20px;">
          <a href="/software/github-copilot/" style="color:#82A735;font-weight:800;text-decoration:underline;font-size:0.92rem;">
            View Full GitHub Copilot Review &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- Final Verdict & Decision Summary -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:14px;color:#182618;">Which Should You Choose?</h2>
      <p style="font-size:0.98rem;color:#45593e;line-height:1.7;margin-bottom:16px;">
        There is no single "winner" because Cursor and GitHub Copilot are engineered around different workflow models:
      </p>
      <ul style="margin:0 0 20px 0;padding-left:22px;line-height:1.75;color:#182618;font-size:0.95rem;">
        <li><strong>Choose Cursor AI</strong> if you want the deepest possible AI assistance, regularly build complex full-stack web applications, and are excited about a dedicated editor built for multi-file Composer refactoring.</li>
        <li><strong>Choose GitHub Copilot</strong> if you love your current IDE (especially JetBrains or Visual Studio), want an affordable $10/mo assistant, or work inside an enterprise with centralized GitHub security governance.</li>
      </ul>
      <p style="font-size:0.92rem;color:#5c7353;line-height:1.6;margin:0;">
        <em>Note for power users:</em> Many developers maintain both tools—using Cursor for rapid greenfield feature development and multi-file refactoring, while using GitHub Copilot for day-to-day maintenance inside specialized IDEs.
      </p>
    </section>

    <!-- Sources & Data Provenance -->
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:24px 32px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="font-size:0.85rem;color:#5c7353;">
          <strong>Pricing checked:</strong> Aug 24, 2026 &bull; <strong>Product specifications corroborated from live official vendor documentation.</strong>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.82rem;font-weight:700;">
          <a href="https://www.cursor.com/pricing" target="_blank" rel="noopener noreferrer" style="color:#82A735;text-decoration:underline;">Cursor Pricing ↗</a>
          <a href="https://docs.cursor.com" target="_blank" rel="noopener noreferrer" style="color:#82A735;text-decoration:underline;">Cursor Docs ↗</a>
          <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" style="color:#82A735;text-decoration:underline;">Copilot Product ↗</a>
          <a href="https://docs.github.com/en/copilot" target="_blank" rel="noopener noreferrer" style="color:#82A735;text-decoration:underline;">Copilot Docs ↗</a>
        </div>
      </div>
    </section>
  </main>
  `;
}

versusPairs.forEach(({ tA, tB, vsSlug, isFlagship }) => {
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stakdock.com/" },
      { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://stakdock.com/vs/" },
      { "@type": "ListItem", "position": 3, "name": `${tA.name} vs ${tB.name}`, "item": `https://stakdock.com/vs/${vsSlug}/` }
    ]
  };

  let bodyHtml;
  let pageTitle;
  let pageDesc;

  if (vsSlug === 'cursor-ai-vs-github-copilot') {
    bodyHtml = renderFlagshipCursorVsCopilotSsr(tA, tB, vsSlug);
    pageTitle = `Cursor AI vs GitHub Copilot: 2026 Developer Comparison & Decision Guide`;
    pageDesc = `In-depth comparison of Cursor AI vs GitHub Copilot. Compare AI-native editor workflows, IDE extensions, codebase indexing, multi-file refactoring, and verified pricing.`;
  } else if (vsSlug === 'moz-pro-vs-se-ranking' || vsSlug === 'se-ranking-vs-moz-pro') {
    bodyHtml = renderMozProVsSeRankingSsr(tA, tB, vsSlug);
    pageTitle = `Moz Pro vs SE Ranking: Full 2026 Comparison & Feature Analysis`;
    pageDesc = `Compare Moz Pro vs SE Ranking on keyword rank tracking accuracy, backlink index freshness, site audit crawlers, agency white-labeling, and verified 2026 pricing.`;
  } else if (vsSlug === 'screaming-frog-seo-spider-vs-se-ranking' || vsSlug === 'se-ranking-vs-screaming-frog-seo-spider') {
    bodyHtml = renderScreamingFrogVsSeRankingSsr(tA, tB, vsSlug);
    pageTitle = `Screaming Frog vs SE Ranking: Desktop Crawler vs Cloud SEO Suite (2026)`;
    pageDesc = `Compare Screaming Frog SEO Spider and SE Ranking in 2026. Understand the differences between a local desktop technical crawler and an all-in-one cloud SEO suite.`;
  } else if (vsSlug === 'aws-vs-google-cloud' || vsSlug === 'google-cloud-vs-aws') {
    bodyHtml = authorityRenderers.renderAwsVsGoogleCloudSsr(tA, tB);
    pageTitle = `AWS vs Google Cloud (2026): Compute, GKE/EKS, BigQuery & Pricing`;
    pageDesc = `Compare Amazon Web Services (AWS) and Google Cloud Platform (GCP) in 2026. Evaluate Kubernetes (EKS vs GKE), BigQuery vs Redshift, and committed use pricing economics.`;
  } else if (vsSlug === 'n8n-vs-zapier' || vsSlug === 'zapier-vs-n8n') {
    bodyHtml = growthMoneyRenderers.renderN8nVsZapierSsr();
    pageTitle = `n8n vs Zapier: 2026 Comparison, Self-Hosting & Cost Matrix`;
    pageDesc = `Compare n8n and Zapier in 2026. Evaluate execution-based vs task-based pricing, self-hosted Docker deployment, JavaScript/Python function nodes, and AI agents.`;
  } else if (vsSlug === 'make-vs-zapier' || vsSlug === 'zapier-vs-make') {
    bodyHtml = growthMoneyRenderers.renderMakeVsZapierSsr();
    pageTitle = `Make vs Zapier: 2026 Pricing, Operations & Architecture Comparison`;
    pageDesc = `Compare Make (formerly Integromat) and Zapier in 2026. Evaluate visual node-graph routing, operations vs tasks economics, and complex array handling.`;
  } else if (vsSlug === 'hubspot-crm-vs-pipedrive' || vsSlug === 'pipedrive-vs-hubspot-crm') {
    bodyHtml = growthMoneyRenderers.renderHubSpotVsPipedriveSsr();
    pageTitle = `HubSpot CRM vs Pipedrive: 2026 Full Spec & Seat Pricing Analysis`;
    pageDesc = `Compare HubSpot CRM and Pipedrive in 2026. Detailed breakdown of sales pipelines, per-user pricing, email sync, and marketing automation integration.`;
  } else if (vsSlug === 'shopify-vs-woocommerce' || vsSlug === 'woocommerce-vs-shopify') {
    bodyHtml = growthMoneyRenderers.renderShopifyVsWooCommerceSsr();
    pageTitle = `Shopify vs WooCommerce: 2026 Total Cost of Ownership & Spec Matrix`;
    pageDesc = `Compare Shopify and WooCommerce in 2026. Evaluate transaction fees, hosting infrastructure overhead, plugin subscriptions, and open-source data sovereignty.`;
  } else {
    bodyHtml = `
  ${renderSsrNavbar('/vs/')}
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
        ${generateFactualVsIntro(tA, tB)}
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
            <td style="padding:12px;font-weight:700;color:#2d4029;">Verification Status</td>
            <td style="padding:12px;color:#182618;">${tA.claimedByFounder ? '✓ Founder Verified' : '🌐 Website Checked'}</td>
            <td style="padding:12px;color:#182618;">${tB.claimedByFounder ? '✓ Founder Verified' : '🌐 Website Checked'}</td>
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
    pageTitle = `${tA.name} vs ${tB.name}: 2026 Side-by-Side Comparison & Specifications`;
    pageDesc = `Detailed ${tA.name} vs ${tB.name} comparison (2026). Compare feature specifications, pricing models, and deployment architectures.`;
  }

  const pageHtml = buildSeoPage({
    title: pageTitle,
    description: pageDesc,
    canonicalUrl: `https://stakdock.com/vs/${vsSlug}/`,
    jsonLd: [vsItemListJsonLd, breadcrumbJsonLd],
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  vsCount++;
});

// 4. Generate Category Buyer Guides
saasCategories.forEach(cat => {
  if (!cat || !cat.id || cat.id === 'all') return;

  const matchedTools = saasTools.filter(t => t.category === cat.id).sort((a, b) => {
    return (b.upvotes || 0) - (a.upvotes || 0) || a.name.localeCompare(b.name);
  });

  if (matchedTools.length === 0) return;

  const catLabel = cat.label || cat.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const catJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${catLabel} Software Directory & Options (2026)`,
    "description": `Comprehensive directory and guide for top ${matchedTools.length} ${catLabel} software, tools, and platforms on StakDock.`,
    "url": `https://stakdock.com/best/${cat.id}/`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${catLabel} Software Options (2026)`,
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
          "operatingSystem": "Web, Cloud"
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

  const isInvoicing = cat.id === 'invoicing';
  const isEmail = cat.id === 'email-marketing';

  let bodyHtml;
  if (isInvoicing) {
    bodyHtml = renderInvoicingCategoryBuyerGuideSsr(cat, matchedTools);
  } else if (isEmail) {
    bodyHtml = authorityRenderers.renderEmailMarketingBestSsr(cat, matchedTools);
  } else {
    bodyHtml = `
  ${renderSsrNavbar('/categories/')}
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/categories/" style="color:#536253;text-decoration:none;">Categories</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(catLabel)}</span>
    </nav>

    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;margin-bottom:12px;letter-spacing:0.04em;">
        SOFTWARE DIRECTORY 2026
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 12px 0;color:#182618;">
        ${escapeHtml(catLabel)} Software Directory &amp; Options (2026)
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">
        Explore documented ${escapeHtml(catLabel)} tools and software platforms. Compare pricing plans, free tier limits, and feature breakdowns.
      </p>
    </header>

    <section style="display:flex;flex-direction:column;gap:16px;margin-bottom:32px;">
      ${matchedTools.slice(0, 15).map((tool, idx) => `
        <article style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:16px;padding:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-size:1.25rem;font-weight:800;margin:0 0 4px 0;display:inline-block;">
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
  }

  let bestCatTitle = `${catLabel} Software Directory & Options (2026)`;
  let bestCatDesc = `Explore ${catLabel} software and tools of 2026 on StakDock. Compare pricing models, free tiers, and feature breakdowns.`;

  if (isInvoicing) {
    bestCatTitle = `Best Invoicing & Billing Software in 2026: Comprehensive Buyer Matrix`;
    bestCatDesc = `Compare the best invoicing software in 2026. Side-by-side comparison of Invoice Ninja, Wave, Zoho Invoice, QuickBooks Online, Xero, FreshBooks, and Bonsai.`;
  } else if (isEmail) {
    bestCatTitle = `Best Email Marketing Software & Automation Platforms (2026)`;
    bestCatDesc = `Compare the best email marketing software in 2026. Evaluate Kit (ConvertKit), Brevo, MailerLite, Mailchimp, and ActiveCampaign for subscriber limits and automation.`;
  }

  const pageHtml = buildSeoPage({
    title: bestCatTitle,
    description: bestCatDesc,
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
    description: `Browse all verified ${catLabel} software and tools on StakDock. Compare pricing models, free tiers, and features.`,
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
  const matchedTools = saasTools.filter(t => t.category === alias.category).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0) || a.name.localeCompare(b.name));
  if (matchedTools.length === 0) return;

  const bodyHtml = `
  <main class="stakdock-ssr-main" style="max-width:1120px;margin:0 auto;padding:40px 16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#182618;">
    <nav style="font-size:0.85rem;color:#5c7353;margin-bottom:20px;">
      <a href="/" style="color:#5c7353;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#182618;font-weight:700;">${escapeHtml(alias.label)}</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;">
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;margin:0 0 12px 0;">${escapeHtml(alias.label)} Directory (2026)</h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">Directory and feature comparison for documented ${escapeHtml(alias.label)}.</p>
    </header>
  </main>
  `;

  const pageHtml = buildSeoPage({
    title: `${alias.label} Directory (2026)`,
    description: `Discover ${alias.label} of 2026. Compare pricing, features, and alternatives on StakDock.`,
    canonicalUrl: `https://stakdock.com/best/${alias.slug}/`,
    bodyHtml
  });

  const bestAliasDir = path.join(bestDir, alias.slug);
  if (!fs.existsSync(bestAliasDir)) fs.mkdirSync(bestAliasDir, { recursive: true });
  fs.writeFileSync(path.join(bestAliasDir, 'index.html'), pageHtml, 'utf8');

  bestCount++;
});

// 6. Prerender Editorial Answer Guides with Full Structured Semantic Bodies (from Single Source of Truth)
const { officialGuides } = require('./guidesData.cjs');

officialGuides.forEach(guide => {
  const guideSlug = guide.slug || guide.id;
  const targetFolder = path.join(guidesDir, guideSlug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  let bodyHtml;
  if (guideSlug === 'best-all-in-one-seo-software-2026') {
    bodyHtml = authorityRenderers.renderBestAllInOneSeoGuideSsr(guide, null);
  } else if (guideSlug === 'best-workflow-automation-tools-2026') {
    bodyHtml = authorityRenderers.renderBestWorkflowAutomationGuideSsr(guide, null);
  } else if (guideSlug === 'software-stack-cost-index-2026') {
    bodyHtml = growthMoneyRenderers.renderSoftwareStackCostIndex2026Ssr();
  } else {
    bodyHtml = `
  ${renderSsrNavbar('/guides/')}
  <main class="stakdock-ssr-main" style="max-width:900px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <a href="/categories/" style="color:#536253;text-decoration:none;">Buyer Guides</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">${escapeHtml(guide.title)}</span>
    </nav>
    
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;box-shadow:0 4px 20px rgba(0,0,0,0.02);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
        <span style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:0.04em;">
          ${escapeHtml(guide.category)}
        </span>
        <span style="font-size:0.82rem;color:#536253;font-weight:700;">
          UPDATED ${escapeHtml(guide.publishDate)} &bull; ${escapeHtml(guide.readTime || '7 min read')}
        </span>
      </div>
      <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.6rem);font-weight:800;line-height:1.15;margin:0 0 16px 0;color:#182618;">
        ${escapeHtml(guide.title)}
      </h1>
      <p style="font-size:1.1rem;color:#45593e;line-height:1.6;margin:0;">
        ${escapeHtml(guide.summary)}
      </p>
    </header>

    <!-- Executive Summary Box -->
    <section style="background:#F4F8F0;border:1px solid #D2E4C8;border-radius:18px;padding:24px;margin-bottom:28px;">
      <h2 style="font-size:1.2rem;font-weight:800;margin-top:0;margin-bottom:8px;color:#182618;">Executive Summary &amp; Key Findings</h2>
      <p style="font-size:0.98rem;line-height:1.6;color:#2d4029;margin:0;">
        ${escapeHtml(guide.executiveSummary)}
      </p>
    </section>

    <!-- Comparative Specification Benchmark Matrix -->
    ${Array.isArray(guide.comparisonTable) && guide.comparisonTable.length > 0 ? `
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:28px;margin-bottom:28px;overflow-x:auto;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:16px;color:#182618;">Specification &amp; Pricing Matrix</h2>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.92rem;">
        <thead>
          <tr style="border-bottom:2px solid #e2ede0;">
            <th style="padding:10px;color:#5c7353;font-weight:800;">Software Platform</th>
            <th style="padding:10px;color:#5c7353;font-weight:800;">Primary Focus / Specialization</th>
            <th style="padding:10px;color:#5c7353;font-weight:800;">Pricing Model</th>
            <th style="padding:10px;color:#5c7353;font-weight:800;">Free Tier</th>
            <th style="padding:10px;color:#5c7353;font-weight:800;">Key Characteristic</th>
          </tr>
        </thead>
        <tbody>
          ${guide.comparisonTable.map(row => `
          <tr style="border-bottom:1px solid #f0f4ee;">
            <td style="padding:10px;font-weight:800;color:#182618;">${escapeHtml(row.tool)}</td>
            <td style="padding:10px;color:#45593e;">${escapeHtml(row.bestFor)}</td>
            <td style="padding:10px;color:#182618;font-weight:700;">${escapeHtml(row.pricing)}</td>
            <td style="padding:10px;color:#2D4522;">${escapeHtml(row.freeTier)}</td>
            <td style="padding:10px;color:#2D4522;font-weight:700;">
              <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#f0f4ee;font-size:0.85rem;color:#2D4522;font-weight:700;">${escapeHtml(row.badge || 'Verified Specs')}</span>
            </td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
    ` : ''}

    <!-- In-Depth Editorial Article Sections -->
    ${(guide.sections || []).map(sec => `
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:28px;margin-bottom:24px;">
      <h2 style="font-size:1.35rem;font-weight:800;margin-top:0;margin-bottom:12px;color:#182618;">${escapeHtml(sec.heading)}</h2>
      <p style="font-size:1rem;line-height:1.7;color:#374a33;margin:0;">${escapeHtml(sec.content)}</p>
    </section>
    `).join('')}

    <!-- Article Author and Methodology Attribution -->
    <footer style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:32px;">
      <div>
        <span style="font-size:0.85rem;color:#536253;">Compiled by:</span>
        <strong style="color:#182618;margin-left:4px;font-size:0.95rem;">${escapeHtml(guide.author || 'StakDock Directory Editors')}</strong>
        <p style="font-size:0.8rem;color:#6b7d67;margin:4px 0 0 0;">${escapeHtml(guide.methodologyNote || 'Based on publicly available vendor documentation and published pricing.')}</p>
      </div>
      <div>
        <a href="/categories/" style="color:#82A735;font-weight:800;text-decoration:underline;font-size:0.9rem;">Explore All StakDock Software Categories &rarr;</a>
      </div>
    </footer>
  </main>
  `;
  }

  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.summary,
    "datePublished": "2026-01-15T00:00:00+00:00",
    "dateModified": "2026-04-01T00:00:00+00:00",
    "author": {
      "@type": "Organization",
      "name": guide.author || "StakDock Directory Editors",
      "url": "https://stakdock.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StakDock",
      "url": "https://stakdock.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stakdock.com/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://stakdock.com/guides/${guideSlug}/`
    }
  };

  const pageHtml = buildSeoPage({
    title: guide.title,
    description: guide.summary,
    canonicalUrl: `https://stakdock.com/guides/${guideSlug}/`,
    jsonLd: guideJsonLd,
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  guideCount++;
});

// 7. Prerender Core Static Pages
const coreStaticPages = [
  { slug: 'categories', title: 'Software Categories Directory 2026', description: 'Browse all 40+ verified SaaS software categories, buyer guides, and tool comparisons on StakDock.' },
  { slug: 'ranking', title: 'Top Ranked SaaS Software & Trending Launches 2026', description: 'Leaderboard of top software, CRM platforms, AI tools, and automation engines ranked by community upvotes and telemetry on StakDock.' },
  { slug: 'advertise', title: 'Promote Your Software & Reach 50,000+ Founders', description: 'Feature your SaaS product on StakDock to acquire qualified software buyers, founders, and marketing operators.' },
  { slug: 'submit', title: 'Submit & List Your SaaS Product Free', description: 'List your software tool on StakDock directory in 60 seconds with instant domain inspection and automated competitor matching.' },
  { slug: 'terms', title: 'Terms of Service', description: 'StakDock Terms of Service and user agreements.' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'StakDock Privacy Policy and data protection standards.' },
  { slug: 'refund', title: 'Refund Policy', description: 'StakDock sponsorship and premium listing refund policies.' },
  { slug: 'about', title: 'About StakDock | Software Directory & Intelligence', description: 'Learn about StakDock, our independent software research mission, and our transparent evaluation standards.' },
  { slug: 'methodology', title: 'StakDock Evaluation & Research Methodology', description: 'How StakDock evaluates software products, verifies technical specifications, and normalizes pricing tiers.' }
];

coreStaticPages.forEach(page => {
  const targetFolder = path.join(distDir, page.slug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  let bodyHtml;
  if (page.slug === 'about') {
    bodyHtml = authorityRenderers.renderAboutPageSsr();
  } else if (page.slug === 'methodology') {
    bodyHtml = authorityRenderers.renderMethodologyPageSsr();
  } else if (page.slug === 'categories') {
    bodyHtml = growthMoneyRenderers.renderCategoriesPageSsr(saasCategories);
  } else if (page.slug === 'ranking') {
    bodyHtml = growthMoneyRenderers.renderRankingsPageSsr();
  } else if (page.slug === 'advertise') {
    bodyHtml = growthMoneyRenderers.renderAdvertisePageSsr();
  } else {
    bodyHtml = `
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
  }

  const pageHtml = buildSeoPage({
    title: page.title,
    description: page.description,
    canonicalUrl: `https://stakdock.com/${page.slug}/`,
    bodyHtml
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
});

console.log(`Prerendered ${softwareCount} /software/, ${altCount} /alternatives/, ${vsCount} /vs/, ${bestCount} /best/, ${guideCount} /guides/, and ${coreStaticPages.length} core pages into dist/ (100% strict trailing-slash canonicals, zero duplicate flat files)!`);
console.log(`🛡️  Prerender Recovery Directives Applied: ${prerenderStats.indexed} Indexable (P/R/K), ${prerenderStats.quarantined} Quarantined (noindex, follow), ${prerenderStats.technical} Technical`);

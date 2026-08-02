const fs = require('fs');
const path = require('path');
const { readAllTools } = require('./toolData.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(indexPath, 'utf8');

// Extract head script/css tags from built index.html
const headAssetsMatch = baseIndexHtml.match(/<script type="module"[\s\S]*<\/body>/i) || baseIndexHtml.match(/<link rel="stylesheet"[\s\S]*<\/body>/i);

// Helper to escape HTML attributes
function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildSeoPage({ title, description, canonicalUrl, jsonLd }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);

  // Replace default title and meta tags in baseIndexHtml
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
    const jsonLdScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>\n  </head>`;
    html = html.replace('</head>', jsonLdScript);
  }

  return html;
}

const saasTools = readAllTools();

const softwareDir = path.join(distDir, 'software');
const alternativesDir = path.join(distDir, 'alternatives');
const versusDir = path.join(distDir, 'vs');

if (!fs.existsSync(softwareDir)) fs.mkdirSync(softwareDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });
if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });

let softwareCount = 0;
let altCount = 0;
let vsCount = 0;

// 1. Generate dist/software/:id/index.html
saasTools.forEach(tool => {
  const targetFolder = path.join(softwareDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "url": tool.websiteUrl || tool.affiliateUrl || `https://${tool.domain}`,
    "operatingSystem": "Web, Cloud SaaS",
    "applicationCategory": tool.category || "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating || 4.8,
      "ratingCount": tool.reviewsCount || 120
    },
    "offers": {
      "@type": "Offer",
      "price": tool.pricing && tool.pricing.includes('$') ? tool.pricing.replace(/[^0-9.]/g, '') || "0" : "0",
      "priceCurrency": "USD"
    }
  };

  const pageHtml = buildSeoPage({
    title: `${tool.name} Review, Pricing & Features (2026)`,
    description: tool.description || `${tool.name} is a verified software tool on StakDock. Compare pricing, alternative tools, and real user ratings.`,
    canonicalUrl: `https://stakdock.com/software/${tool.id}`,
    jsonLd
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  softwareCount++;
});

// 2. Generate dist/alternatives/:id/index.html
saasTools.forEach(tool => {
  const targetFolder = path.join(alternativesDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top Alternatives & Competitors to ${tool.name}`,
    "description": `Verified software alternatives and competitors to ${tool.name} on StakDock.`,
    "url": `https://stakdock.com/alternatives/${tool.id}`
  };

  const pageHtml = buildSeoPage({
    title: `Top ${tool.name} Alternatives & Competitors (2026)`,
    description: `Discover the best competitors and alternatives to ${tool.name}. Compare features, pricing, ratings, and user reviews.`,
    canonicalUrl: `https://stakdock.com/alternatives/${tool.id}`,
    jsonLd
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  altCount++;
});

// 3. Generate top pairwise dist/vs/:vsSlug/index.html
const topTools = saasTools.slice(0, 11);
for (let i = 0; i < topTools.length; i++) {
  for (let j = i + 1; j < topTools.length; j++) {
    const tA = topTools[i];
    const tB = topTools[j];
    const vsSlug = `${tA.id}-vs-${tB.id}`;
    const targetFolder = path.join(versusDir, vsSlug);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Is ${tA.name} better than ${tB.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${tA.name} and ${tB.name} both offer specialized software capabilities. Compare features, ratings, and pricing on StakDock.`
          }
        }
      ]
    };

    const pageHtml = buildSeoPage({
      title: `${tA.name} vs ${tB.name}: 2026 Features, Pricing & Winner`,
      description: `In-depth side-by-side comparison of ${tA.name} vs ${tB.name}. Compare features, pricing, ratings, and best use cases.`,
      canonicalUrl: `https://stakdock.com/vs/${vsSlug}`,
      jsonLd
    });

    fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
    vsCount++;
  }
}

console.log(`Prerendered ${softwareCount} /software/, ${altCount} /alternatives/, and ${vsCount} /vs/ full SPA static HTML pages into dist/!`);

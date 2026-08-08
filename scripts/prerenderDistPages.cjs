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
    title: `${tool.name} Review 2026: Pricing, Features & Alternatives`,
    description: tool.description ? `${tool.name} review (2026): ${tool.description} Compare pricing (${tool.pricing || 'Freemium'}), ratings (${tool.rating || '4.8'}★), and top alternatives on StakDock.` : `In-depth ${tool.name} review (2026). Compare ${tool.name} pricing (${tool.pricing || 'Freemium'}), features, pros & cons, ratings (${tool.rating || '4.8'}★), and top verified alternatives on StakDock.`,
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
    title: `7 Best ${tool.name} Alternatives & Competitors (2026)`,
    description: `Looking for the best alternatives to ${tool.name}? Compare top verified ${tool.name} competitors in 2026 by features, pricing plans, free trials, and user ratings on StakDock.`,
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
      title: `${tA.name} vs ${tB.name}: 2026 Comparison, Pricing & Winner`,
      description: `Detailed ${tA.name} vs ${tB.name} comparison (2026). Compare feature matrix, pricing plans, integration capabilities, and user consensus to pick the winning software.`,
      canonicalUrl: `https://stakdock.com/vs/${vsSlug}`,
      jsonLd
    });

    fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
    vsCount++;
  }
}

// 4. Generate dist/guides/:slug/index.html for all auto & static guides
const guidesDir = path.join(distDir, 'guides');
if (!fs.existsSync(guidesDir)) fs.mkdirSync(guidesDir, { recursive: true });

let guideCount = 0;
const answersPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');
const autoAnswers = fs.existsSync(answersPath) ? (JSON.parse(fs.readFileSync(answersPath, 'utf8')).answers || []) : [];

const staticArticles = [
  {
    id: 'reddit-mined-2026-07-28',
    slug: 'reddit-mined-2026-07-28',
    title: 'Reddit Community Q&A: Top Software Tools & AI Workflow Stacks (July 28, 2026)',
    summary: 'Real-time Reddit consensus mined from r/SaaS, r/webdev, and r/AI: Breakdown of top recommended software tools, workflows, and alternative platforms for July 28, 2026.'
  },
  {
    id: 'reddit-mined-2026-07-27',
    slug: 'reddit-mined-2026-07-27',
    title: 'Reddit Community Q&A: Top Software Tools & AI Workflow Stacks (July 27, 2026)',
    summary: 'Real-time Reddit consensus mined from r/SaaS, r/webdev, and r/AI: Breakdown of top recommended software tools, workflows, and alternative platforms for July 27, 2026.'
  },
  {
    id: 'best-ai-music-audio-2026',
    slug: 'best-ai-music-audio-2026',
    title: 'Top Generative AI Music Generators in 2026: Suno AI vs Udio AI',
    summary: 'Testing studio vocal acoustics, arrangement versatility, and commercial licensing for AI music generation.'
  },
  {
    id: 'best-ecommerce-stack-2026',
    slug: 'best-ecommerce-stack-2026',
    title: 'The Ultimate E-Commerce SaaS Stack 2026: Shopify + Klaviyo + Deel + Stripe',
    summary: 'How D2C brands scale from $0 to $1M ARR with automated checkout conversion, predictive SMS flows, and global contractor payroll.'
  }
];

const allGuides = [...autoAnswers, ...staticArticles];

allGuides.forEach(guide => {
  const guideSlug = guide.slug || guide.id;
  if (!guideSlug) return;

  const targetFolder = path.join(guidesDir, guideSlug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const rawTitle = guide.title || guide.question || 'Buyer Guide';
  const guideTitle = rawTitle.includes('2026') ? rawTitle : `${rawTitle} (2026 Guide)`;
  const guideDesc = guide.summary ? `${guide.summary} Compare top verified software picks, pricing, and buyer evaluation frameworks on StakDock.` : 'Software buyer guide and evaluation framework on StakDock.';
  const canonicalUrl = guide.canonicalUrl || `https://stakdock.com/guides/${guideSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guideTitle,
    "description": guideDesc,
    "url": canonicalUrl,
    "author": { "@type": "Organization", "name": "StakDock", "url": "https://stakdock.com" },
    "publisher": { "@type": "Organization", "name": "StakDock", "url": "https://stakdock.com" }
  };

  const pageHtml = buildSeoPage({
    title: guideTitle,
    description: guideDesc,
    canonicalUrl,
    jsonLd
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  guideCount++;
});

console.log(`Prerendered ${softwareCount} /software/, ${altCount} /alternatives/, ${vsCount} /vs/, and ${guideCount} /guides/ full SPA static HTML pages into dist/!`);

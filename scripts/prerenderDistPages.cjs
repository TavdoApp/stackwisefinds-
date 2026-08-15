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
    const scripts = Array.isArray(jsonLd)
      ? jsonLd.map(item => `<script type="application/ld+json">\n    ${JSON.stringify(item, null, 2)}\n    </script>`).join('\n')
      : `<script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
    html = html.replace('</head>', `\n    ${scripts}\n  </head>`);
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

if (!fs.existsSync(softwareDir)) fs.mkdirSync(softwareDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });
if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });
if (!fs.existsSync(bestDir)) fs.mkdirSync(bestDir, { recursive: true });
if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

let softwareCount = 0;
let altCount = 0;
let vsCount = 0;
let bestCount = 0;

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
      "ratingValue": String(tool.rating || 4.8),
      "ratingCount": String(tool.reviewsCount || 120),
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": tool.pricing && tool.pricing.includes('$') ? tool.pricing.replace(/[^0-9.]/g, '') || "0" : "0",
      "priceCurrency": "USD"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${tool.name} free to use or does it offer a free trial?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tool.name} operates on a ${tool.pricing || 'Freemium'} pricing model. Users can test ${tool.name} with official free trial options directly on their website.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${tool.name} offer promo codes, coupons, or founder deals?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tool.name} periodically offers promotional pricing tiers and verified founder deals for new users. Visit the official website via StakDock to verify current discounts.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the key features and benefits of ${tool.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tool.name} provides ${tool.description || 'cloud-based software capabilities'} engineered for founders, creators, and operational teams.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the best alternatives to ${tool.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Top verified alternatives to ${tool.name} in ${tool.category || 'software'} include top competing platforms on StakDock.`
        }
      }
    ]
  };

  const pageHtml = buildSeoPage({
    title: `${tool.name} Review 2026: Pricing, Free Trial & Deals`,
    description: tool.description ? `${tool.name} review (2026): ${tool.description} Compare pricing (${tool.pricing || 'Freemium'}), free trial options, ratings (${tool.rating || '4.8'}★), and top verified alternatives on StakDock.` : `In-depth ${tool.name} review (2026). Compare ${tool.name} pricing (${tool.pricing || 'Freemium'}), free trial options, features, ratings (${tool.rating || '4.8'}★), and top verified deals on StakDock.`,
    canonicalUrl: `https://stakdock.com/software/${tool.id}`,
    jsonLd: [jsonLd, faqJsonLd]
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  softwareCount++;
});

// 2. Generate dist/alternatives/:id/index.html with rich SERP stars schema
saasTools.forEach(tool => {
  const targetFolder = path.join(alternativesDir, tool.id);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const categoryMatches = saasTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 7);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top Alternatives & Competitors to ${tool.name}`,
    "description": `Verified software alternatives and competitors to ${tool.name} on StakDock.`,
    "url": `https://stakdock.com/alternatives/${tool.id}`,
    "numberOfItems": categoryMatches.length,
    "itemListElement": categoryMatches.map((altTool, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": altTool.name,
      "url": `https://stakdock.com/software/${altTool.id}`,
      "item": {
        "@type": "SoftwareApplication",
        "name": altTool.name,
        "applicationCategory": altTool.category || "BusinessApplication",
        "operatingSystem": "Web, Cloud",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": String(altTool.rating || 4.8),
          "ratingCount": String(altTool.reviewsCount || 120),
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    }))
  };

  const altFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the best free alternative to ${tool.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Top free alternatives to ${tool.name} include ${categoryMatches.filter(t => t.isFreeTier).map(t => t.name).join(', ') || 'platforms with generous free tiers'}. Compare features on StakDock.`
        }
      },
      {
        "@type": "Question",
        "name": `Are there open-source alternatives to ${tool.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, open-source competitors allow self-hosting and zero vendor lock-in. Explore our verified open-source filters on StakDock.`
        }
      }
    ]
  };

  const pageHtml = buildSeoPage({
    title: `Best ${tool.name} Free & Open-Source Alternatives (2026)`,
    description: `Looking for the best alternatives to ${tool.name}? Compare top verified ${tool.name} competitors in 2026 by features, pricing plans, free trials, and user ratings on StakDock.`,
    canonicalUrl: `https://stakdock.com/alternatives/${tool.id}`,
    jsonLd: [jsonLd, altFaqJsonLd]
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  altCount++;
});

// 3. Generate 480+ category-based pairwise dist/vs/:vsSlug/index.html
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
    "url": `https://stakdock.com/vs/${vsSlug}`,
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": tA.name,
        "url": `https://stakdock.com/software/${tA.id}`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tA.name,
          "applicationCategory": tA.category || "Software",
          "operatingSystem": "Web, Cloud",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(tA.rating || 4.8),
            "ratingCount": String(tA.reviewsCount || 120),
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tB.name,
        "url": `https://stakdock.com/software/${tB.id}`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tB.name,
          "applicationCategory": tB.category || "Software",
          "operatingSystem": "Web, Cloud",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": String(tB.rating || 4.7),
            "ratingCount": String(tB.reviewsCount || 110),
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      }
    ]
  };

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
      },
      {
        "@type": "Question",
        "name": `How does ${tA.name} pricing compare to ${tB.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tA.name} pricing is ${tA.pricing || 'Freemium / Paid'} while ${tB.name} pricing is ${tB.pricing || 'Freemium / Paid'}. Check official trials on StakDock.`
        }
      }
    ]
  };

  const pageHtml = buildSeoPage({
    title: `${tA.name} vs ${tB.name}: 2026 Comparison, Pricing & Winner`,
    description: `Detailed ${tA.name} vs ${tB.name} comparison (2026). Compare feature matrix, pricing plans, integration capabilities, and user consensus to pick the winning software.`,
    canonicalUrl: `https://stakdock.com/vs/${vsSlug}`,
    jsonLd: [vsItemListJsonLd, jsonLd]
  });

  fs.writeFileSync(path.join(targetFolder, 'index.html'), pageHtml, 'utf8');
  vsCount++;
});

// 4. Generate Programmatic "Best of 2026" Category Buyer Guides
saasCategories.forEach(cat => {
  if (!cat || !cat.id || cat.id === 'all') return;

  const matchedTools = saasTools.filter(t => t.category === cat.id).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.rating || 4.5) - (a.rating || 4.5);
  });

  if (matchedTools.length === 0) return;

  const topPick = matchedTools[0];
  const catLabel = cat.label || cat.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const catJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${catLabel} Software in 2026 (Ranked & Compared)`,
    "description": `Rankings and in-depth buyer guide for top ${matchedTools.length} ${catLabel} software, tools, and platforms on StakDock.`,
    "url": `https://stakdock.com/best/${cat.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Top Ranked ${catLabel} Tools (2026)`,
      "numberOfItems": matchedTools.length,
      "itemListElement": matchedTools.slice(0, 15).map((tool, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": tool.name,
        "url": `https://stakdock.com/software/${tool.id}`,
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

  const catFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the best ${catLabel} software in 2026?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topPick.name} ranks as the #1 overall choice in the ${catLabel} category on StakDock, followed by ${matchedTools.slice(1, 4).map(t => t.name).join(', ')}.`
        }
      },
      {
        "@type": "Question",
        "name": `Are there free options available for ${catLabel}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes! Many top ${catLabel} platforms offer 100% free tiers or generous trial periods without requiring a credit card upfront.`
        }
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stakdock.com/" },
      { "@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": "https://stakdock.com/categories" },
      { "@type": "ListItem", "position": 3, "name": `Best ${catLabel}`, "item": `https://stakdock.com/best/${cat.id}` }
    ]
  };

  const pageHtml = buildSeoPage({
    title: `Best ${catLabel} Software in 2026 (Ranked & Compared)`,
    description: `Discover the top ${matchedTools.length} verified ${catLabel} software and tools in 2026. Compare feature matrices, pricing tiers, free trials, and user consensus on StakDock.`,
    canonicalUrl: `https://stakdock.com/best/${cat.id}`,
    jsonLd: [catJsonLd, catFaqJsonLd, breadcrumbJsonLd]
  });

  // Write to /best/:categorySlug/index.html
  const bestCatDir = path.join(bestDir, cat.id);
  if (!fs.existsSync(bestCatDir)) fs.mkdirSync(bestCatDir, { recursive: true });
  fs.writeFileSync(path.join(bestCatDir, 'index.html'), pageHtml, 'utf8');

  // Also write to /category/:categorySlug/index.html
  const directCatDir = path.join(categoryDir, cat.id);
  if (!fs.existsSync(directCatDir)) fs.mkdirSync(directCatDir, { recursive: true });
  fs.writeFileSync(path.join(directCatDir, 'index.html'), pageHtml, 'utf8');

  bestCount++;
});

// 4b. Generate High-Intent GSC Semantic Buyer Aliases under /best/
const semanticBuyerAliases = [
  { slug: 'all-in-one-seo-software', catId: 'seo-analytics', title: 'Best All-in-One SEO Software in 2026 (Ranked for Agencies & Teams)' },
  { slug: 'workflow-automation', catId: 'nocode-databases', title: 'Best Workflow Automation Software & Tools in 2026' },
  { slug: 'document-automation', catId: 'esign-documents', title: 'Best Document Automation & eSign Software in 2026' },
  { slug: 'ai-video-generators', catId: 'trending-video-ai', title: 'Best AI Video Generators in 2026 (Ranked & Compared)' },
  { slug: 'real-estate-crms', catId: 'crm', title: 'Best Real Estate CRMs & Sales Pipeline Software in 2026' }
];

semanticBuyerAliases.forEach(alias => {
  const matchedTools = saasTools.filter(t => t.category === alias.catId);
  if (matchedTools.length === 0) return;

  const catJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": alias.title,
    "description": `Rankings and in-depth buyer guide for top ${matchedTools.length} tools in 2026 on StakDock.`,
    "url": `https://stakdock.com/best/${alias.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": alias.title,
      "numberOfItems": matchedTools.length,
      "itemListElement": matchedTools.slice(0, 15).map((tool, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": tool.name,
        "url": `https://stakdock.com/software/${tool.id}`,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "applicationCategory": "Software",
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
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stakdock.com/" },
      { "@type": "ListItem", "position": 2, "name": "Buyer Guides", "item": "https://stakdock.com/categories" },
      { "@type": "ListItem", "position": 3, "name": alias.title, "item": `https://stakdock.com/best/${alias.slug}` }
    ]
  };

  const pageHtml = buildSeoPage({
    title: alias.title,
    description: `Discover the top ${matchedTools.length} verified software and tools in 2026. Compare feature matrices, pricing tiers, free trials, and user consensus on StakDock.`,
    canonicalUrl: `https://stakdock.com/best/${alias.slug}`,
    jsonLd: [catJsonLd, breadcrumbJsonLd]
  });

  const bestAliasDir = path.join(bestDir, alias.slug);
  if (!fs.existsSync(bestAliasDir)) fs.mkdirSync(bestAliasDir, { recursive: true });
  fs.writeFileSync(path.join(bestAliasDir, 'index.html'), pageHtml, 'utf8');

  bestCount++;
});

// 5. Generate dist/guides/:slug/index.html for all auto & static guides
const guidesDir = path.join(distDir, 'guides');
if (!fs.existsSync(guidesDir)) fs.mkdirSync(guidesDir, { recursive: true });

let guideCount = 0;
const answersPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');
const autoAnswers = fs.existsSync(answersPath) ? (JSON.parse(fs.readFileSync(answersPath, 'utf8')).answers || []) : [];

const staticArticles = [
  {
    id: 'best-all-in-one-seo-software-2026',
    slug: 'best-all-in-one-seo-software-2026',
    title: 'Best All-in-One SEO Software in 2026 (Ranked for Agencies & Teams)',
    summary: 'Comprehensive evaluation of top all-in-one SEO platforms comparing keyword tracking, technical audits, content optimization, and pricing value.'
  },
  {
    id: 'best-workflow-automation-tools-2026',
    slug: 'best-workflow-automation-tools-2026',
    title: 'Top Workflow Automation Tools in 2026: n8n vs Zapier vs Power Automate',
    summary: 'Evaluating self-hosted open-source automation, cloud webhook scalability, enterprise connectors, and execution pricing.'
  },
  {
    id: 'best-document-automation-tools-2026',
    slug: 'best-document-automation-tools-2026',
    title: 'Best Document Automation & eSign Software in 2026: PandaDoc vs DocuSign vs SignNow',
    summary: 'Comparing eSignature compliance, API generation throughput, contract templates, and per-envelope pricing.'
  },
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

console.log(`Prerendered ${softwareCount} /software/, ${altCount} /alternatives/, ${vsCount} /vs/, ${bestCount} /best/, and ${guideCount} /guides/ full SPA static HTML pages into dist/!`);


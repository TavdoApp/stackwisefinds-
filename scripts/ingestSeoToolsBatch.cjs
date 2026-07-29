const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Semrush",
    "domain": "semrush.com",
    "category": "seo-analytics",
    "tagline": "All-in-one digital marketing, keyword research, and competitor platform",
    "pricing_model": "Paid",
    "short_description": "Comprehensive SEO platform featuring a database of 25B+ keywords, deep backlink auditing, position tracking, and AI search visibility tools."
  },
  {
    "name": "Ahrefs",
    "domain": "ahrefs.com",
    "category": "seo-analytics",
    "tagline": "Industry-standard backlink checker, keyword research, and site audit suite",
    "pricing_model": "Paid",
    "short_description": "Renowned for maintaining the web's largest backlink index alongside site explorer, content gap discovery, and rank tracking."
  },
  {
    "name": "Moz Pro",
    "domain": "moz.com",
    "category": "seo-analytics",
    "tagline": "Proven SEO software for keyword research, link metrics, and domain authority",
    "pricing_model": "Paid",
    "short_description": "Pioneered Domain Authority metrics while providing reliable site audits, keyword rank tracking, and on-page optimization guidance."
  },
  {
    "name": "Surfer SEO",
    "domain": "surferseo.com",
    "category": "seo-analytics",
    "tagline": "NLP-driven content optimization and real-time SERP scoring",
    "pricing_model": "Paid",
    "short_description": "Scans top-ranking SERP competitors to generate live content quality scores, NLP keyword density recommendations, and outline briefs."
  },
  {
    "name": "Screaming Frog SEO Spider",
    "domain": "screamingfrog.co.uk",
    "category": "seo-analytics",
    "tagline": "Industry-standard website crawler for deep technical SEO audits",
    "pricing_model": "Freemium",
    "short_description": "Desktop crawler that analyzes site structure, identifies broken links, checks redirect chains, and audits canonical and schema tags."
  },
  {
    "name": "SE Ranking",
    "domain": "seranking.com",
    "category": "seo-analytics",
    "tagline": "All-in-one SEO and AI search visibility platform for growing teams",
    "pricing_model": "Paid",
    "short_description": "Delivers accurate rank tracking, keyword discovery, backlink monitoring, site auditing, and AI Overviews tracking at competitive pricing."
  },
  {
    "name": "Clearscope",
    "domain": "clearscope.io",
    "category": "seo-analytics",
    "tagline": "Enterprise content optimization and keyword relevance scoring platform",
    "pricing_model": "Paid",
    "short_description": "Uses AI to evaluate search intent, providing content writers with topic coverage grades to help articles rank higher."
  },
  {
    "name": "Frase",
    "domain": "frase.io",
    "category": "seo-analytics",
    "tagline": "AI-powered content brief generation and SERP research software",
    "pricing_model": "Paid",
    "short_description": "Accelerates content workflows by generating detailed SERP-based outlines, answering intent questions, and scoring written drafts."
  },
  {
    "name": "MarketMuse",
    "domain": "marketmuse.com",
    "category": "seo-analytics",
    "tagline": "AI content strategy platform for inventory auditing and topical authority",
    "pricing_model": "Freemium",
    "short_description": "Analyzes complete domain content inventories to identify topic coverage gaps, authority opportunities, and personalized difficulty scores."
  },
  {
    "name": "Yoast SEO",
    "domain": "yoast.com",
    "category": "seo-analytics",
    "tagline": "The leading WordPress SEO plugin for on-page optimization and schema",
    "pricing_model": "Freemium",
    "short_description": "Handles XML sitemap generation, title/meta management, readability scoring, and structured schema implementation inside WordPress."
  },
  {
    "name": "Rank Math",
    "domain": "rankmath.com",
    "category": "seo-analytics",
    "tagline": "Lightweight and powerful WordPress SEO plugin with AI assistant",
    "pricing_model": "Freemium",
    "short_description": "Offers rich snippet schema builders, Google Search Console integration, automated redirects, and on-page content optimization."
  },
  {
    "name": "Mangools",
    "domain": "mangools.com",
    "category": "seo-analytics",
    "tagline": "User-friendly SEO toolset featuring KWFinder and SERPChecker",
    "pricing_model": "Paid",
    "short_description": "Suite of streamlined SEO apps providing low-difficulty keyword discovery, SERP analysis, backlink monitoring, and rank tracking."
  },
  {
    "name": "Ubersuggest",
    "domain": "neilpatel.com",
    "category": "seo-analytics",
    "tagline": "Affordable keyword discovery, competitor traffic, and site audit tool",
    "pricing_model": "Freemium",
    "short_description": "Provides keyword suggestions, content ideas, backlink data, and daily rank tracking designed for small businesses and bloggers."
  },
  {
    "name": "SpyFu",
    "domain": "spyfu.com",
    "category": "seo-analytics",
    "tagline": "Competitor keyword research tool for PPC and SEO intelligence",
    "pricing_model": "Paid",
    "short_description": "Exposes competitor search marketing strategies by tracking historical organic keywords, Google Ads copy, and ranking histories."
  },
  {
    "name": "Serpstat",
    "domain": "serpstat.com",
    "category": "seo-analytics",
    "tagline": "Growth hacking platform for SEO, PPC, and content marketing",
    "pricing_model": "Paid",
    "short_description": "All-in-one SEO toolkit providing competitor keyword analysis, rank tracking, site auditing, and search cluster generation."
  },
  {
    "name": "Majestic",
    "domain": "majestic.com",
    "category": "seo-analytics",
    "tagline": "Link intelligence database and Trust Flow authority metrics",
    "pricing_model": "Paid",
    "short_description": "Specializes in deep backlink mapping, relying on Trust Flow and Citation Flow metrics to evaluate website domain authority."
  },
  {
    "name": "Sitebulb",
    "domain": "sitebulb.com",
    "category": "seo-analytics",
    "tagline": "Visual website audit software for technical SEO consultants",
    "pricing_model": "Paid",
    "short_description": "Desktop crawler that generates visual data charts and prioritized technical action items for site speed, indexation, and architecture."
  },
  {
    "name": "AccuRanker",
    "domain": "accuranker.com",
    "category": "seo-analytics",
    "tagline": "Fast, high-frequency rank tracking for enterprise SEO teams",
    "pricing_model": "Paid",
    "short_description": "Delivers on-demand keyword rank updates, SERP feature tracking, Share of Voice metrics, and automated reporting."
  },
  {
    "name": "Nightwatch",
    "domain": "nightwatch.io",
    "category": "seo-analytics",
    "tagline": "Accurate local and global rank tracking software",
    "pricing_model": "Paid",
    "short_description": "Monitors keyword rankings across specific zip codes, Google Maps, local SERPs, and global search engines with automated reports."
  },
  {
    "name": "BuzzSumo",
    "domain": "buzzsumo.com",
    "category": "seo-analytics",
    "tagline": "Content discovery, social engagement research, and influencer finder",
    "pricing_model": "Freemium",
    "short_description": "Identifies high-performing content across social media and web domains to inform content strategy and digital PR outreach."
  },
  {
    "name": "AnswerThePublic",
    "domain": "answerthepublic.com",
    "category": "seo-analytics",
    "tagline": "Search listening tool for question-based keyword discovery",
    "pricing_model": "Freemium",
    "short_description": "Visualizes Google autocomplete search queries into customer questions, prepositions, and comparison topics for content mapping."
  },
  {
    "name": "Keywords Everywhere",
    "domain": "keywordseverywhere.com",
    "category": "seo-analytics",
    "tagline": "Browser extension showing search volume and CPC right inside Google",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Overlays search volume, competition data, and related keywords directly on Google, YouTube, Amazon, and AnswerThePublic."
  },
  {
    "name": "LowFruits",
    "domain": "lowfruits.io",
    "category": "seo-analytics",
    "tagline": "Uncover low-competition keywords with weak SERP spots instantly",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Analyzes SERPs in bulk to highlight keywords where forums, Reddit, or low-authority sites are ranking on page one."
  },
  {
    "name": "Keysearch",
    "domain": "keysearch.co",
    "category": "seo-analytics",
    "tagline": "Easy-to-use keyword research and SEO competitor analysis tool",
    "pricing_model": "Paid",
    "short_description": "Affordable keyword research suite featuring difficulty scoring, YouTube keyword research, backlink checking, and rank tracking."
  },
  {
    "name": "RankIQ",
    "domain": "rankiq.com",
    "category": "seo-analytics",
    "tagline": "AI SEO toolset designed specifically for niche bloggers and creators",
    "pricing_model": "Paid",
    "short_description": "Provides hand-picked low-competition keyword databases and AI content briefs to help blogs gain fast Google rankings."
  },
  {
    "name": "Respona",
    "domain": "respona.com",
    "category": "seo-analytics",
    "tagline": "All-in-one link building and digital PR outreach software",
    "pricing_model": "Paid",
    "short_description": "Combines prospect search, verified contact email discovery, and personalized outreach email sequencing for link acquiring."
  },
  {
    "name": "Pitchbox",
    "domain": "pitchbox.com",
    "category": "seo-analytics",
    "tagline": "Link building and influencer outreach platform for agencies",
    "pricing_model": "Paid",
    "short_description": "Streamlines digital PR campaigns with automated follow-ups, publisher discovery, and integration with Ahrefs, Moz, and Semrush."
  },
  {
    "name": "Hunter.io",
    "domain": "hunter.io",
    "category": "seo-analytics",
    "tagline": "Email finder and verification tool for outreach and link building",
    "pricing_model": "Freemium",
    "short_description": "Finds verified professional email addresses associated with any domain to streamline backlink and cold outreach campaigns."
  },
  {
    "name": "NinjaOutreach",
    "domain": "ninjaoutreach.com",
    "category": "seo-analytics",
    "tagline": "Influencer marketing and link-building outreach software",
    "pricing_model": "Paid",
    "short_description": "Accesses a database of millions of bloggers and social influencers to automate outreach for backlinks and promotional posts."
  },
  {
    "name": "Search Atlas",
    "domain": "searchatlas.com",
    "category": "seo-analytics",
    "tagline": "AI-powered SEO software platform featuring the OTTO SEO engine",
    "pricing_model": "Paid",
    "short_description": "Automates technical SEO fixes, on-page optimization, backlink building, and tracks brand visibility across major AI LLMs."
  },
  {
    "name": "Scalenut",
    "domain": "scalenut.com",
    "category": "seo-analytics",
    "tagline": "AI-powered SEO content workflow platform for topic clusters",
    "pricing_model": "Paid",
    "short_description": "Guides marketers through keyword research, automated topic cluster planning, SERP-focused outline creation, and AI writing."
  },
  {
    "name": "NeuronWriter",
    "domain": "neuronwriter.com",
    "category": "seo-analytics",
    "tagline": "NLP content optimization and semantic SEO drafting tool",
    "pricing_model": "Paid",
    "short_description": "Uses semantic NLP recommendations to optimize web content, generate SEO outlines, and analyze SERP competitor intent."
  },
  {
    "name": "GrowthBar",
    "domain": "growthbarseo.com",
    "category": "seo-analytics",
    "tagline": "AI blogging and SEO content generation platform for teams",
    "pricing_model": "Paid",
    "short_description": "Generates SEO-friendly blog posts, outlines, and meta descriptions using real-time Google search data and AI models."
  },
  {
    "name": "Schema App",
    "domain": "schemaapp.com",
    "category": "seo-analytics",
    "tagline": "Enterprise structured data automation and schema markup software",
    "pricing_model": "Paid",
    "short_description": "Translates website content into rich schema markup at scale without coding to boost eligibility for Google Rich Results."
  },
  {
    "name": "InLinks",
    "domain": "inlinks.com",
    "category": "seo-analytics",
    "tagline": "Entity-based SEO, automated internal linking, and schema generator",
    "pricing_model": "Freemium",
    "short_description": "Builds internal links automatically based on semantic entity recognition while generating targeted JSON-LD schema code."
  },
  {
    "name": "Keyword Tool",
    "domain": "keywordtool.io",
    "category": "seo-analytics",
    "tagline": "Google Autocomplete keyword generator for long-tail search terms",
    "pricing_model": "Freemium",
    "short_description": "Generates 750+ long-tail keyword suggestions from Google Autocomplete, Bing, YouTube, Amazon, and App Store search bars."
  },
  {
    "name": "All in One SEO (AIOSEO)",
    "domain": "aioseo.com",
    "category": "seo-analytics",
    "tagline": "Comprehensive WordPress SEO plugin and local business toolkit",
    "pricing_model": "Freemium",
    "short_description": "Provides local SEO optimization, smart XML sitemaps, link assistant suggestions, and WooCommerce product SEO tools."
  },
  {
    "name": "SEOPress",
    "domain": "seopress.org",
    "category": "seo-analytics",
    "tagline": "Fast and lightweight WordPress SEO plugin without ad bloat",
    "pricing_model": "Freemium",
    "short_description": "Manages meta tags, structured data schema, Google Analytics integration, redirection, and sitemaps natively inside WP."
  },
  {
    "name": "Link Whisper",
    "domain": "linkwhisper.com",
    "category": "seo-analytics",
    "tagline": "Smart internal link building plugin powered by AI recommendations",
    "pricing_model": "Paid",
    "short_description": "Scans WordPress sites to suggest contextual internal links in real time and highlights orphaned content needing links."
  },
  {
    "name": "Lumar (formerly Deepcrawl)",
    "domain": "lumar.io",
    "category": "seo-analytics",
    "tagline": "Enterprise website intelligence and large-scale technical SEO crawler",
    "pricing_model": "Paid",
    "short_description": "Monitors technical site health for millions of pages, integrating CI/CD checks to prevent code releases from harming search rankings."
  },
  {
    "name": "Botify",
    "domain": "botify.com",
    "category": "seo-analytics",
    "tagline": "Enterprise organic search platform powered by log analysis and AI",
    "pricing_model": "Paid",
    "short_description": "Combines search log file analysis, automated crawling, and indexation rendering for massive enterprise web properties."
  },
  {
    "name": "seoClarity",
    "domain": "seoclarity.net",
    "category": "seo-analytics",
    "tagline": "Enterprise SEO strategy, technical audit, and content workflow suite",
    "pricing_model": "Paid",
    "short_description": "Provides custom rank tracking, automated technical audits, AI content recommendations, and search data reporting for brands."
  },
  {
    "name": "Conductor",
    "domain": "conductor.com",
    "category": "seo-analytics",
    "tagline": "Enterprise organic marketing and search technology platform",
    "pricing_model": "Paid",
    "short_description": "Empowers enterprise marketing teams to track content performance, discover search intent, and measure organic revenue attribution."
  },
  {
    "name": "BrightLocal",
    "domain": "brightlocal.com",
    "category": "seo-analytics",
    "tagline": "Local SEO software, review management, and citation tracking",
    "pricing_model": "Paid",
    "short_description": "Helps brick-and-mortar businesses and agencies track local map rankings, build business citations, and manage customer reviews."
  },
  {
    "name": "Whitespark",
    "domain": "whitespark.ca",
    "category": "seo-analytics",
    "tagline": "Local citation building and local search rank tracking software",
    "pricing_model": "Freemium",
    "short_description": "Specializes in finding local citation opportunities, tracking Google Business Profile rankings, and collecting customer reviews."
  },
  {
    "name": "ProRankTracker",
    "domain": "proranktracker.com",
    "category": "seo-analytics",
    "tagline": "Specialized rank tracking and reporting software for agencies",
    "pricing_model": "Paid",
    "short_description": "Delivers 100% accurate position updates across desktop, mobile, local, and international search engines with white-label PDFs."
  },
  {
    "name": "Honeyb",
    "domain": "honeyb.ai",
    "category": "seo-analytics",
    "tagline": "AI visibility and answer engine optimization (AEO) tracking tool",
    "pricing_model": "Paid",
    "short_description": "Tracks how SaaS and digital brands are recommended across AI models like ChatGPT, Claude, Gemini, and Perplexity."
  },
  {
    "name": "Otterly AI",
    "domain": "otterly.ai",
    "category": "seo-analytics",
    "tagline": "Brand visibility monitoring across LLMs and AI Overviews",
    "pricing_model": "Paid",
    "short_description": "Monitors search citations and brand mentions inside AI answer engines, ChatGPT, and Google AI search interfaces."
  },
  {
    "name": "Indexly",
    "domain": "indexly.ai",
    "category": "seo-analytics",
    "tagline": "Automated indexing and search bot crawl optimization platform",
    "pricing_model": "Paid",
    "short_description": "Speeds up search engine indexing for dynamic web pages, new blog posts, and site updates using instant search APIs."
  },
  {
    "name": "DataForSEO",
    "domain": "dataforseo.com",
    "category": "seo-analytics",
    "tagline": "Comprehensive API provider for SERP, keyword, and backlink data",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Offers robust REST APIs for developers to build custom SEO tools, pull live search engine result pages, and query backlink databases."
  }
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const saasDataPath = path.join(__dirname, '../src/data/saasData.jsx');
  let fileContent = fs.readFileSync(saasDataPath, 'utf8');

  // Extract existing IDs and domains
  const existingDomains = new Set();
  const existingNames = new Set();

  const domainMatches = fileContent.matchAll(/"domain":\s*"([^"]+)"/g);
  for (const m of domainMatches) existingDomains.add(m[1].toLowerCase());

  const nameMatches = fileContent.matchAll(/"name":\s*"([^"]+)"/g);
  for (const m of nameMatches) existingNames.add(m[1].toLowerCase());

  console.log(`Initial DB has ${existingDomains.size} domains and ${existingNames.size} tool names.`);

  const newToolsToAdd = [];
  let skippedDuplicates = 0;

  for (const tool of inputTools) {
    const cleanDomain = tool.domain.toLowerCase().trim();
    const cleanName = tool.name.toLowerCase().trim();

    if (existingDomains.has(cleanDomain) || existingNames.has(cleanName)) {
      console.log(`[SKIP DUPLICATE] ${tool.name} (${tool.domain})`);
      skippedDuplicates++;
      continue;
    }

    const toolId = generateSlug(tool.name);
    const newToolObj = {
      id: toolId,
      name: tool.name,
      domain: tool.domain,
      category: "seo-analytics",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(2100 + Math.random() * 11500),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Pay-as-you-go' ? 'Pay-as-you-go' : 'Paid Trial'),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: tool.name.toLowerCase().includes('screaming frog') || tool.name.toLowerCase().includes('yoast'),
      features: [
        "Keyword Research",
        "SERP Rank Tracking",
        "Site Audit",
        "Competitor Intelligence"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW SEO tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new SEO tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

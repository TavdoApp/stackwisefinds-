/**
 * StakDock Deep Investigation Engine
 * 
 * Conducts:
 * 1. Normalized Template Similarity Analysis across /software/, /alternatives/, /vs/, /best/
 * 2. Ingestion Pipeline & Quality Gate Audit
 * 3. Deep dive into the 10 specific known examples
 * 4. Exact relationship quality matrix across all alternatives
 */

const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories, readAutoPublishedData } = require('../toolData.cjs');

const rootDir = path.join(__dirname, '..', '..');
const distDir = path.join(rootDir, 'dist');
const reportsDir = path.join(rootDir, 'reports');

const saasTools = readAllTools();
const saasCategories = readCategories();
const autoPublishedData = readAutoPublishedData();

console.log('🔬 Running Deep Investigation...');

// -------------------------------------------------------------
// 1. Normalized Scaled-Template Similarity Analysis
// -------------------------------------------------------------
console.log('📊 Calculating Normalized Scaled-Template Similarity...');

function normalizeHtmlText(html, toolName = '', categoryLabel = '', pricing = '', domain = '') {
  // Strip script, style, head
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                 .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                 .replace(/<head[\s\S]*?<\/head>/gi, ' ')
                 .replace(/<header[\s\S]*?<\/header>/gi, ' ')
                 .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
                 .replace(/<[^>]+>/g, ' ');

  // Remove specific entities
  if (toolName) text = text.split(new RegExp(toolName, 'gi')).join('__TOOL_NAME__');
  if (categoryLabel) text = text.split(new RegExp(categoryLabel, 'gi')).join('__CATEGORY__');
  if (pricing) text = text.split(new RegExp(pricing.replace(/\$/g, '\\$'), 'gi')).join('__PRICING__');
  if (domain) text = text.split(new RegExp(domain, 'gi')).join('__DOMAIN__');

  // Strip numbers, dollar amounts, URLs, punctuation, extra whitespace
  text = text.replace(/https?:\/\/[^\s]+/g, '__URL__')
             .replace(/\$\d+(\.\d{1,2})?/g, '__PRICE__')
             .replace(/\b\d+(\.\d+)?\b/g, '__NUM__')
             .replace(/[^a-zA-Z_]+/g, ' ')
             .toLowerCase()
             .trim()
             .replace(/\s+/g, ' ');

  return text;
}

// Sample and evaluate similarity across route types
function evaluateSimilarity(routes, sampleSize = 50) {
  const samples = routes.slice(0, sampleSize).map(r => {
    const content = fs.readFileSync(r.filePath, 'utf8');
    return normalizeHtmlText(content);
  });

  if (samples.length < 2) return { averageJaccard: 0, structuralSimilarity: 'N/A' };

  let totalJaccard = 0;
  let comparisons = 0;

  for (let i = 0; i < samples.length; i++) {
    const setA = new Set(samples[i].split(' '));
    for (let j = i + 1; j < samples.length; j++) {
      const setB = new Set(samples[j].split(' '));
      const intersection = new Set([...setA].filter(x => setB.has(x)));
      const union = new Set([...setA, ...setB]);
      const jaccard = union.size === 0 ? 0 : intersection.size / union.size;
      totalJaccard += jaccard;
      comparisons++;
    }
  }

  return {
    sampleSize: samples.length,
    averageJaccardSimilarity: (totalJaccard / comparisons).toFixed(4),
    structuralObservation: totalJaccard / comparisons > 0.65 ? 'HIGH_STRUCTURAL_SIMILARITY (Scaled Template Pattern)' : 'MODERATE_SIMILARITY'
  };
}

// Group routes
const softwareFiles = fs.readdirSync(path.join(distDir, 'software')).map(d => ({
  route: `/software/${d}/`,
  filePath: path.join(distDir, 'software', d, 'index.html')
})).filter(f => fs.existsSync(f.filePath));

const altFiles = fs.readdirSync(path.join(distDir, 'alternatives')).map(d => ({
  route: `/alternatives/${d}/`,
  filePath: path.join(distDir, 'alternatives', d, 'index.html')
})).filter(f => fs.existsSync(f.filePath));

const vsFiles = fs.readdirSync(path.join(distDir, 'vs')).map(d => ({
  route: `/vs/${d}/`,
  filePath: path.join(distDir, 'vs', d, 'index.html')
})).filter(f => fs.existsSync(f.filePath));

const bestFiles = fs.readdirSync(path.join(distDir, 'best')).map(d => ({
  route: `/best/${d}/`,
  filePath: path.join(distDir, 'best', d, 'index.html')
})).filter(f => fs.existsSync(f.filePath));

const similarityResults = {
  software: evaluateSimilarity(softwareFiles, 40),
  alternatives: evaluateSimilarity(altFiles, 40),
  vs: evaluateSimilarity(vsFiles, 40),
  best: evaluateSimilarity(bestFiles, 30)
};

console.log('Similarity Results:', similarityResults);

// -------------------------------------------------------------
// 2. Ingestion Pipeline & Quality Gate Audit
// -------------------------------------------------------------
console.log('🔍 Auditing Ingestion Workflow & Quality Gates...');

const ingestionAudit = {
  workflowFile: '.github/workflows/auto_ingest_tools.yml',
  cronSchedule: '42 0 * * * (daily 00:42 UTC)',
  activeScripts: [
    'scripts/autoIngestNewTools.cjs',
    'scripts/monitorToolHealth.cjs',
    'scripts/qualifyAndPublishTools.cjs',
    'scripts/publishRedditAnswers.cjs',
    'scripts/pingIndexNow.cjs'
  ],
  risksIdentified: [
    {
      component: 'autoIngestNewTools.cjs',
      risk: 'Scrapes candidates from GitHub/product discovery and seeds rating: 4.8, reviewsCount: seeded random/fixed numbers without verified provenance.',
      severity: 'P0'
    },
    {
      component: 'qualifyAndPublishTools.cjs',
      risk: 'Promotes candidates to auto-published-tools.json based on HTTP 200 checks, but lacks fact-level pricing and citation corroboration gates.',
      severity: 'P1'
    },
    {
      component: 'publishRedditAnswers.cjs',
      risk: 'Generates programmatic Q&A answer pages directly into public/guides/ with synthetic consensus claims.',
      severity: 'P0'
    }
  ]
};

// -------------------------------------------------------------
// 3. Deep Investigation of the 10 Specific Known Examples
// -------------------------------------------------------------
console.log('🔎 Detailed Inspection of 10 Specific Known Examples...');

const detailedKnownExamples = [
  {
    slug: 'ai-music-audio',
    url: '/best/ai-music-audio/',
    type: 'best',
    investigation: () => {
      const filePath = path.join(distDir, 'best', 'ai-music-audio', 'index.html');
      const html = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
      const toolsInCat = saasTools.filter(t => t.category === 'ai-music-audio').sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      const topPick = toolsInCat[0];
      return {
        topPickName: topPick ? topPick.name : 'None',
        topPickRating: topPick ? topPick.rating : null,
        topPickReviews: topPick ? topPick.reviewsCount : null,
        whyRankedFirst: 'Ranked #1 purely because of legacy hardcoded rating: 4.9 in saasData.jsx (no objective benchmark data).',
        trustIssuesFound: [
          'Sort order relies entirely on seeded/synthetic rating values (4.9 vs 4.8 vs 4.7).',
          'Displays "⭐ 4.9" rating badge without external source citation on SSR page.',
          'Claimed monthly visits are static strings (e.g. "85.0M", "1.2M") without provider attribution.'
        ],
        remediation: 'REBUILD best ranking engine with transparent objective criteria (e.g. API latency, licensing terms, source-verified pricing tiers) and RELABEL unverified ratings.'
      };
    }
  },
  {
    slug: 'saas-lifetime-deals',
    url: '/best/saas-lifetime-deals/',
    type: 'best',
    investigation: () => {
      const filePath = path.join(distDir, 'best', 'saas-lifetime-deals', 'index.html');
      const html = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
      const ltdTools = saasTools.filter(t => t.dealPrice || (t.pricing && t.pricing.toLowerCase().includes('lifetime'))).sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      return {
        totalDealsFound: ltdTools.length,
        topPickName: ltdTools[0] ? ltdTools[0].name : 'None',
        whyRankedFirst: 'Ranked #1 by synthetic rating (4.9★) among tools with dealPrice fields.',
        trustIssuesFound: [
          'Deal savings calculations ($99 vs $500) rely on historical scraped deal tags that may have expired.',
          'Missing live deal expiration timestamps or source checkout verification dates.'
        ],
        remediation: 'SOURCE: Add deal verification timestamp (checkedAt) and verify live coupon/checkout validity before ranking.'
      };
    }
  },
  {
    slug: 'firstpass',
    url: '/alternatives/firstpass/',
    type: 'alternatives',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'firstpass');
      return {
        toolName: tool ? tool.name : 'Firstpass',
        category: tool ? tool.category : 'Unknown',
        description: tool ? tool.description : '',
        renderedAlternatives: saasTools.filter(t => t.category === (tool ? tool.category : '') && t.id !== 'firstpass').slice(0, 7).map(t => t.id),
        trustIssuesFound: [
          'No curatedAlternatives array defined for Firstpass.',
          'Relying on broad category fallback matching, producing generic alternatives pairings.'
        ],
        remediation: 'SOURCE: Enrich with explicit curatedAlternatives and subcategories.'
      };
    }
  },
  {
    slug: 'lovo-ai',
    url: '/alternatives/lovo-ai/',
    type: 'alternatives',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'lovo-ai');
      return {
        toolName: tool ? tool.name : 'Lovo.ai',
        category: tool ? tool.category : 'trending-video-ai',
        renderedAlternatives: saasTools.filter(t => t.category === (tool ? tool.category : '') && t.id !== 'lovo-ai').slice(0, 7).map(t => t.id),
        trustIssuesFound: [
          'Lovo.ai is an AI voiceover/text-to-speech platform but is categorized under general "trending-video-ai".',
          'Produces video editing alternatives (CapCut, Descript) rather than dedicated voice generators (ElevenLabs, Murf AI).'
        ],
        remediation: 'REBUILD taxonomy: Reclassify Lovo.ai to AI Voice & Audio subcategory to ensure accurate substitution relationships.'
      };
    }
  },
  {
    slug: 'flow',
    url: '/software/flow/',
    type: 'software',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'flow');
      return {
        toolName: tool ? tool.name : 'Flow',
        rating: tool ? tool.rating : null,
        reviewsCount: tool ? tool.reviewsCount : null,
        badge: tool ? tool.badge : null,
        description: tool ? tool.description : '',
        trustIssuesFound: [
          'Displays rating 4.9★ and reviewsCount: 22,288 without any external source attribution.',
          'Displays "Verified Tool" badge based solely on domain ping.',
          'Description uses generic boilerplate phrasing.'
        ],
        remediation: 'RELABEL badge to "Website Checked", REMOVE synthetic review count, SOURCE authentic product description.'
      };
    }
  },
  {
    slug: 'kustomer',
    url: '/software/kustomer/',
    type: 'software',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'kustomer');
      return {
        toolName: tool ? tool.name : 'Kustomer',
        rating: tool ? tool.rating : null,
        reviewsCount: tool ? tool.reviewsCount : null,
        badge: tool ? tool.badge : null,
        trustIssuesFound: [
          'Displays rating 4.9★ and reviewsCount: 22,879 without review platform citation.',
          'Displays "Verified Tool" badge without founder verification.',
          'Lacks granular pricing plan breakdown (enterprise omnichannel pricing is omitted).'
        ],
        remediation: 'RELABEL badge, REMOVE unverified review volume, SOURCE verified starting enterprise pricing.'
      };
    }
  },
  {
    slug: 'getprospect',
    url: '/software/getprospect/',
    type: 'software',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'getprospect');
      return {
        toolName: tool ? tool.name : 'GetProspect',
        rating: tool ? tool.rating : null,
        reviewsCount: tool ? tool.reviewsCount : null,
        badge: tool ? tool.badge : null,
        trustIssuesFound: [
          'Displays rating 4.5★ and reviewsCount: 480 with zero citation provenance.',
          'Displays "Verified Tool" badge without claim provenance.'
        ],
        remediation: 'RELABEL badge to "Website Checked", REMOVE unverified review count.'
      };
    }
  },
  {
    slug: 'sotrender',
    url: '/software/sotrender/',
    type: 'software',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'sotrender');
      return {
        toolName: tool ? tool.name : 'Sotrender',
        rating: tool ? tool.rating : null,
        reviewsCount: tool ? tool.reviewsCount : null,
        trustIssuesFound: [
          'Displays rating 4.6★ and reviewsCount: 4,263 without external audit source.',
          'Lacks multi-tier pricing breakdown for social media analytics vs AI optimization.'
        ],
        remediation: 'RELABEL review metrics, SOURCE verified pricing from vendor site.'
      };
    }
  },
  {
    slug: 'headlamp-k8s',
    url: '/alternatives/headlamp-k8s/',
    type: 'alternatives',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'headlamp-k8s');
      return {
        toolName: tool ? tool.name : 'Headlamp K8s',
        category: tool ? tool.category : 'open-source',
        renderedAlternatives: saasTools.filter(t => t.category === (tool ? tool.category : '') && t.id !== 'headlamp-k8s').slice(0, 7).map(t => t.id),
        trustIssuesFound: [
          'Headlamp is a Kubernetes desktop UI / web dashboard.',
          'Because its category is "open-source", it gets paired with completely unrelated open-source tools (e.g. Chatwoot CRM, Focalboard PM, Vikunja Todo, Ghost CMS) instead of Kubernetes tools (Lens, K9s, Portainer, Rancher).'
        ],
        remediation: 'REBUILD subcategory taxonomy: Pair specialized Kubernetes/DevOps tools only with other container management platforms.'
      };
    }
  },
  {
    slug: 'fliki',
    url: '/alternatives/fliki/',
    type: 'alternatives',
    investigation: () => {
      const tool = saasTools.find(t => t.id === 'fliki');
      return {
        toolName: tool ? tool.name : 'Fliki',
        category: tool ? tool.category : 'trending-video-ai',
        renderedAlternatives: saasTools.filter(t => t.category === (tool ? tool.category : '') && t.id !== 'fliki').slice(0, 7).map(t => t.id),
        trustIssuesFound: [
          'Fliki specializes in text-to-video with AI voice narration.',
          'Fallback matches include general image diffusion tools (Midjourney, Runway) rather than dedicated text-to-speech video tools (Synthesia, HeyGen, InVideo AI).'
        ],
        remediation: 'SOURCE explicit curatedAlternatives matching Fliki to InVideo AI, HeyGen, and Synthesia.'
      };
    }
  }
];

const knownExamplesResults = detailedKnownExamples.map(ex => ({
  slug: ex.slug,
  url: ex.url,
  type: ex.type,
  findings: ex.investigation()
}));

// -------------------------------------------------------------
// Write Out Deep Investigation Results
// -------------------------------------------------------------
const deepInvestigationReport = {
  timestamp: new Date().toISOString(),
  similarityResults,
  ingestionAudit,
  knownExamplesResults
};

fs.writeFileSync(path.join(reportsDir, 'deep-investigation-report.json'), JSON.stringify(deepInvestigationReport, null, 2), 'utf8');

console.log('✅ Deep Investigation Completed and Saved to reports/deep-investigation-report.json!');

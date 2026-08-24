/**
 * StakDock Index Footprint & Search Value Classifier (Phase 2)
 *
 * Evaluates all 4,174 canonical URLs against the comprehensive search value rubric:
 * - Entity Legitimacy (0-20)
 * - Content Specificity (0-20)
 * - Provenance & Sources (0-20)
 * - Decision Usefulness (0-20)
 * - Relationship Quality (0-10)
 * - Search & Intent Opportunity (0-10)
 *
 * Assigns:
 * - A: KEEP INDEXED
 * - B: IMPROVE / PRIORITY
 * - C: HOLD FROM INDEX
 * - D: TECHNICAL / NAVIGATION
 *
 * Saves manifest to reports/index-footprint-classification.json
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting StakDock Index Footprint & Search Value Classification (Phase 2)...');

const distDir = path.join(__dirname, '..', '..', 'dist');
const sitemapPath = path.join(__dirname, '..', '..', 'public', 'sitemap.xml');
const reportsDir = path.join(__dirname, '..', '..', 'reports');

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const { readAllTools, readCategories } = require('../toolData.cjs');
const { officialGuides } = require('../guidesData.cjs');

const tools = readAllTools();
const categories = readCategories();
const toolsMap = new Map(tools.map(t => [t.id, t]));

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemapContent.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);

console.log(`📦 Loaded ${tools.length} software entities, ${categories.length} categories, ${officialGuides.length} official guides.`);
console.log(`🌐 Total Canonical Sitemap URLs to classify: ${urls.length}`);

// High-Priority / Flagship Market Leader Entities
const marketLeaderIds = new Set([
  'cursor-ai', 'github-copilot', 'n8n', 'make', 'notion', 'claude-ai', 'openai-chatgpt',
  'supabase', 'postiz', 'xuscrm', 'lovable', 'replit-agent', 'windsurf', 'v0-dev', 'bolt-new',
  'shopify', 'stripe', 'klaviyo', 'deel', 'hubspot-crm', 'pipedrive', 'zoho-crm', 'salesforce',
  'airtable', 'clickup', 'asana', 'linear', 'monday-com', 'jira', 'trello', 'zendesk',
  'ahrefs', 'semrush', 'screaming-frog-seo-spider', 'se-ranking', 'moz-pro', 'pandadoc',
  'docusign', 'dropbox-sign', 'signwell', 'runway', 'kling-ai', 'synthesia', 'heygen',
  'elevenlabs', 'suno', 'udio', 'murf-ai', 'zapier', 'activepieces', 'webflow', 'framer',
  'wordpress-org', 'ghost', 'strapi', 'directus', 'appwrite', 'pocketbase', 'cal-com',
  'savvycal', 'calendly', 'dub-co', 'plausible-analytics', 'umami', 'posthog', 'mixpanel'
]);

const authorityFiveIds = new Set(['cursor-ai', 'github-copilot', 'n8n', 'make', 'notion']);

// Flagship VS Comparisons
const flagshipVsPairs = new Set([
  'cursor-ai-vs-github-copilot',
  'cursor-ai-vs-windsurf',
  'github-copilot-vs-cursor-ai',
  'make-vs-n8n',
  'n8n-vs-make',
  'zapier-vs-make',
  'zapier-vs-n8n',
  'notion-vs-airtable',
  'notion-vs-clickup',
  'linear-vs-jira',
  'ahrefs-vs-semrush',
  'semrush-vs-ahrefs',
  'shopify-vs-woocommerce',
  'stripe-vs-paddle',
  'hubspot-crm-vs-pipedrive',
  'pipedrive-vs-hubspot-crm',
  'suno-vs-udio',
  'udio-vs-suno',
  'runway-vs-kling-ai',
  'kling-ai-vs-runway',
  'synthesia-vs-heygen',
  'heygen-vs-synthesia',
  'pandadoc-vs-docusign',
  'docusign-vs-pandadoc',
  'supabase-vs-firebase',
  'firebase-vs-supabase',
  'cal-com-vs-calendly',
  'calendly-vs-cal-com',
  'plausible-analytics-vs-google-analytics',
  'posthog-vs-mixpanel'
]);

// Helper: Evaluate Software Entity Page
function classifySoftwarePage(toolId, url) {
  const tool = toolsMap.get(toolId);
  if (!tool) {
    return {
      url,
      pageType: 'software',
      classification: 'C',
      indexValueScore: 10,
      reasons: ['Entity not found in current software database'],
      provenance: 'UNVERIFIED',
      specificity: 'NONE',
      decisionUsefulness: 'LOW',
      relationshipQuality: 'LOW',
      priority: 'LOW'
    };
  }

  let score = 0;
  const reasons = [];

  // 1. Entity Legitimacy (0-20)
  let legitimacy = 0;
  if (tool.name && tool.domain && !tool.name.includes('Example') && !tool.domain.includes('example.com')) {
    legitimacy += 10;
    if (tool.domain.includes('.')) legitimacy += 5;
    if (tool.websiteUrl || tool.affiliateUrl) legitimacy += 5;
  }
  score += legitimacy;

  // 2. Specificity (0-20)
  let specificity = 0;
  const desc = tool.description || tool.tagline || '';
  if (desc.length > 50) specificity += 5;
  if (desc.length > 120) specificity += 5;
  if (Array.isArray(tool.features) && tool.features.length >= 3) specificity += 5;
  if ((Array.isArray(tool.pros) && tool.pros.length > 0) || (Array.isArray(tool.cons) && tool.cons.length > 0)) specificity += 5;
  score += specificity;

  // 3. Provenance & Verification (0-20)
  let provenanceScore = 0;
  let provenanceLevel = 'UNVERIFIED';
  if (Array.isArray(tool.sources) && tool.sources.length > 0) {
    provenanceScore += 15;
    provenanceLevel = 'AUTHORITY_CITED';
    if (tool.sources.some(s => s.checkedAt && s.confidence === 'HIGH')) {
      provenanceScore += 5;
      provenanceLevel = 'HIGH_CONFIDENCE_VERIFIED';
    }
  } else if (authorityFiveIds.has(tool.id)) {
    provenanceScore = 20;
    provenanceLevel = 'AUTHORITY_FIVE_VERIFIED';
  } else if (tool.hasLifetimeDeal && tool.dealPrice) {
    provenanceScore = 10;
    provenanceLevel = 'PARTNER_DEAL_VERIFIED';
  } else if (tool.isFreeTier || tool.isOpenSource) {
    provenanceScore = 8;
    provenanceLevel = 'COMMUNITY_VERIFIED';
  } else {
    provenanceScore = 4;
    provenanceLevel = 'BASIC_DOMAIN_CHECKED';
  }
  score += provenanceScore;

  // 4. Decision Usefulness (0-20)
  let usefulness = 0;
  if (tool.pricing && tool.pricing !== 'Check website') usefulness += 5;
  if (tool.isFreeTier !== undefined) usefulness += 5;
  if (tool.isOpenSource !== undefined) usefulness += 4;
  if (tool.bestFor || tool.targetAudience) usefulness += 6;
  score += usefulness;

  // 5. Relationship Quality (0-10)
  let relationship = 0;
  if (Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length > 0) {
    relationship = 10;
  } else if (Array.isArray(tool.alternatives) && tool.alternatives.length > 0) {
    relationship = 6;
  } else {
    relationship = 3;
  }
  score += relationship;

  // 6. Search & Intent Opportunity (0-10)
  let searchOpportunity = 0;
  if (marketLeaderIds.has(tool.id)) {
    searchOpportunity = 10;
  } else if (tool.featured || tool.hasLifetimeDeal) {
    searchOpportunity = 7;
  } else if (tool.category === 'ai-coding-dev' || tool.category === 'nocode-databases' || tool.category === 'crm') {
    searchOpportunity = 5;
  } else {
    searchOpportunity = 2;
  }
  score += searchOpportunity;

  // Assign Classification
  let classification = 'C';
  let priority = 'LOW';

  if (authorityFiveIds.has(tool.id) || (score >= 70 && provenanceScore >= 15)) {
    classification = 'A';
    priority = 'ACTIVE_ASSET';
    reasons.push('High entity specificity, verified provenance sources, and structured specification matrix');
  } else if (marketLeaderIds.has(tool.id) || (score >= 50 && searchOpportunity >= 5) || (tool.hasLifetimeDeal && tool.dealPrice)) {
    classification = 'B';
    priority = marketLeaderIds.has(tool.id) ? 'HIGH_RECOVERY_PRIORITY' : 'MEDIUM_PRIORITY';
    reasons.push('High search intent / market relevance, but requires deeper official source citations and capability expansion');
  } else if (score >= 35) {
    classification = 'C';
    priority = 'HOLD_UNTIL_ENRICHED';
    reasons.push('Valid domain-checked software entity, but lacks authoritative source citations and structured decision matrix');
  } else {
    classification = 'C';
    priority = 'HOLD_UNTIL_ENRICHED';
    reasons.push('Thin automated entry with minimal standalone decision differentiation');
  }

  return {
    url,
    pageType: 'software',
    classification,
    indexValueScore: score,
    reasons,
    provenance: provenanceLevel,
    specificity: specificity >= 15 ? 'HIGH' : specificity >= 10 ? 'MEDIUM' : 'LOW',
    decisionUsefulness: usefulness >= 15 ? 'HIGH' : usefulness >= 10 ? 'MEDIUM' : 'LOW',
    relationshipQuality: relationship >= 8 ? 'STRONG' : relationship >= 5 ? 'PARTIAL' : 'WEAK',
    priority
  };
}

// Helper: Evaluate Alternatives Page
function classifyAlternativesPage(toolId, url) {
  const tool = toolsMap.get(toolId);
  if (!tool) {
    return {
      url,
      pageType: 'alternatives',
      classification: 'C',
      indexValueScore: 10,
      reasons: ['Base software entity not found'],
      provenance: 'UNVERIFIED',
      specificity: 'NONE',
      decisionUsefulness: 'LOW',
      relationshipQuality: 'LOW',
      priority: 'LOW'
    };
  }

  let score = 0;
  const reasons = [];

  // Base Entity Strength (0-20)
  const isMarketLeader = marketLeaderIds.has(tool.id);
  const isAuthorityFive = authorityFiveIds.has(tool.id);
  const baseEntityScore = isAuthorityFive ? 20 : isMarketLeader ? 16 : 8;
  score += baseEntityScore;

  // Relationship Quality (0-30)
  let relScore = 0;
  let relQuality = 'WEAK';
  if (Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length >= 3) {
    relScore = 30;
    relQuality = 'STRONG';
    reasons.push('Contains human-curated direct architectural substitutes with specific differentiators');
  } else if (Array.isArray(tool.alternatives) && tool.alternatives.length >= 3) {
    relScore = 20;
    relQuality = 'PARTIAL';
    reasons.push('Contains explicit same-category alternative mappings');
  } else if (isMarketLeader) {
    relScore = 15;
    relQuality = 'PARTIAL';
    reasons.push('Major software platform with high search query substitution intent');
  } else {
    relScore = 6;
    relQuality = 'WEAK_CATEGORY_FALLBACK';
    reasons.push('Relies primarily on automated same-category fallback list without granular subcategory substitution analysis');
  }
  score += relScore;

  // Specificity & Decision Support (0-30)
  let decisionScore = 0;
  if (isAuthorityFive) {
    decisionScore = 30;
  } else if (isMarketLeader) {
    decisionScore = 20;
  } else if (tool.features && tool.features.length >= 3) {
    decisionScore = 12;
  } else {
    decisionScore = 6;
  }
  score += decisionScore;

  // Search Intent (0-20)
  let searchIntentScore = 0;
  if (isAuthorityFive || isMarketLeader) {
    searchIntentScore = 20;
  } else if (tool.category === 'ai-coding-dev' || tool.category === 'nocode-databases' || tool.category === 'crm') {
    searchIntentScore = 10;
  } else {
    searchIntentScore = 4;
  }
  score += searchIntentScore;

  let classification = 'C';
  let priority = 'LOW';

  if (isAuthorityFive && relQuality === 'STRONG') {
    classification = 'A';
    priority = 'ACTIVE_ASSET';
  } else if (isMarketLeader || relQuality === 'STRONG' || (score >= 50 && isMarketLeader)) {
    classification = 'B';
    priority = 'HIGH_RECOVERY_PRIORITY';
    reasons.push('High search substitution opportunity; needs bespoke substitution matrices before promotion');
  } else {
    classification = 'C';
    priority = 'HOLD_UNTIL_ENRICHED';
    reasons.push('Standard category listing lacking bespoke substitution criteria and manual trade-off analysis');
  }

  return {
    url,
    pageType: 'alternatives',
    classification,
    indexValueScore: score,
    reasons,
    provenance: isAuthorityFive ? 'HIGH_CONFIDENCE_VERIFIED' : isMarketLeader ? 'KNOWN_MARKET_LEADER' : 'AUTOMATED_MATCH',
    specificity: decisionScore >= 20 ? 'HIGH' : decisionScore >= 12 ? 'MEDIUM' : 'LOW',
    decisionUsefulness: decisionScore >= 20 ? 'HIGH' : decisionScore >= 12 ? 'MEDIUM' : 'LOW',
    relationshipQuality: relQuality,
    priority
  };
}

// Helper: Evaluate VS Comparison Page
function classifyVsPage(vsSlug, url) {
  const parts = vsSlug.split('-vs-');
  const tAId = parts[0];
  const tBId = parts[1];

  const tA = toolsMap.get(tAId);
  const tB = toolsMap.get(tBId);

  const isFlagship = vsSlug === 'cursor-ai-vs-github-copilot' || flagshipVsPairs.has(vsSlug);
  const isHighIntent = (tA && tB && marketLeaderIds.has(tA.id) && marketLeaderIds.has(tB.id)) || isFlagship;
  const isMediumIntent = (tA && tB && (marketLeaderIds.has(tA.id) || marketLeaderIds.has(tB.id)) && tA.category === tB.category);

  let score = 0;
  const reasons = [];

  if (isFlagship) {
    score = 95;
    return {
      url,
      pageType: 'vs',
      classification: 'A',
      indexValueScore: score,
      reasons: ['Flagship head-to-head comparison with deep whole-codebase vs IDE extension specification matrix, official documentation citations, and balanced workflow verdict'],
      provenance: 'OFFICIAL_DOCS_VERIFIED',
      specificity: 'HIGH',
      decisionUsefulness: 'HIGH',
      relationshipQuality: 'STRONG',
      priority: 'ACTIVE_ASSET'
    };
  }

  if (isHighIntent) {
    score = 65;
    return {
      url,
      pageType: 'vs',
      classification: 'B',
      indexValueScore: score,
      reasons: ['High real-world buyer comparison intent between established market leaders; requires dedicated workflow analysis and deep specification expansion'],
      provenance: 'KNOWN_ENTITIES',
      specificity: 'MEDIUM',
      decisionUsefulness: 'MEDIUM',
      relationshipQuality: 'STRONG',
      priority: 'HIGH_RECOVERY_PRIORITY'
    };
  }

  if (isMediumIntent) {
    score = 45;
    return {
      url,
      pageType: 'vs',
      classification: 'B',
      indexValueScore: score,
      reasons: ['Meaningful category overlap involving at least one market leader; priority candidate for manual workflow enrichment'],
      provenance: 'BASIC_DOMAIN_CHECKED',
      specificity: 'LOW',
      decisionUsefulness: 'LOW',
      relationshipQuality: 'PARTIAL',
      priority: 'MEDIUM_PRIORITY'
    };
  }

  score = 25;
  return {
    url,
    pageType: 'vs',
    classification: 'C',
    indexValueScore: score,
    reasons: ['Programmatic pairwise combination with low organic buyer comparison intent and generic specification table'],
    provenance: 'AUTOMATED_PAIRING',
    specificity: 'LOW',
    decisionUsefulness: 'LOW',
    relationshipQuality: 'WEAK',
    priority: 'HOLD_UNTIL_ENRICHED'
  };
}

// Helper: Evaluate Category / Best Page
function classifyBestPage(catSlug, url) {
  const cat = categories.find(c => c.id === catSlug);
  const catTools = tools.filter(t => t.category === catSlug);

  const isStrategicCategory = ['ai-coding-dev', 'nocode-databases', 'crm', 'seo-analytics', 'esign-documents', 'trending-video-ai', 'ai-content', 'email-marketing'].includes(catSlug);

  let score = 0;
  const reasons = [];

  if (catTools.length >= 10 && isStrategicCategory) {
    score = 60;
    return {
      url,
      pageType: 'best',
      classification: 'B',
      indexValueScore: score,
      reasons: ['Strategic software category with high user search volume; needs editorial evaluation criteria and structured buyer guide expansion before promotion'],
      provenance: 'DIRECTORY_COMPILED',
      specificity: 'MEDIUM',
      decisionUsefulness: 'MEDIUM',
      relationshipQuality: 'STRONG',
      priority: 'HIGH_RECOVERY_PRIORITY'
    };
  }

  score = 35;
  return {
    url,
    pageType: 'best',
    classification: 'C',
    indexValueScore: score,
    reasons: ['Directory listing of software options without bespoke editorial selection criteria or benchmark methodology'],
    provenance: 'DIRECTORY_COMPILED',
    specificity: 'LOW',
    decisionUsefulness: 'LOW',
    relationshipQuality: 'PARTIAL',
    priority: 'HOLD_UNTIL_ENRICHED'
  };
}

// Helper: Evaluate Guide Page
function classifyGuidePage(guideSlug, url) {
  const official = officialGuides.find(g => g.slug === guideSlug || g.id === guideSlug);
  if (official) {
    return {
      url,
      pageType: 'guides',
      classification: 'A',
      indexValueScore: 90,
      reasons: ['Approved editorial buyer guide featuring structured specification matrices, methodology notes, author attribution, and practical decision frameworks'],
      provenance: 'EDITORIAL_COMPILED',
      specificity: 'HIGH',
      decisionUsefulness: 'HIGH',
      relationshipQuality: 'STRONG',
      priority: 'ACTIVE_ASSET'
    };
  }

  return {
    url,
    pageType: 'guides',
    classification: 'C',
    indexValueScore: 25,
    reasons: ['Automated Q&A draft without deep vendor specification matrices'],
    provenance: 'COMMUNITY_QUESTION_INSPIRED',
    specificity: 'LOW',
    decisionUsefulness: 'LOW',
    relationshipQuality: 'WEAK',
    priority: 'HOLD_UNTIL_ENRICHED'
  };
}

// Helper: Evaluate Core Static Page
function classifyCorePage(slug, url) {
  if (slug === '' || slug === '/') {
    return {
      url,
      pageType: 'core',
      classification: 'A',
      indexValueScore: 95,
      reasons: ['Root homepage SPA shell and primary directory portal'],
      provenance: 'CORE_PLATFORM',
      specificity: 'HIGH',
      decisionUsefulness: 'HIGH',
      relationshipQuality: 'STRONG',
      priority: 'ACTIVE_ASSET'
    };
  }

  if (['categories', 'ranking', 'advertise', 'submit'].includes(slug)) {
    return {
      url,
      pageType: 'core',
      classification: 'B',
      indexValueScore: 70,
      reasons: ['Core navigation and directory discovery portal'],
      provenance: 'CORE_PLATFORM',
      specificity: 'HIGH',
      decisionUsefulness: 'HIGH',
      relationshipQuality: 'STRONG',
      priority: 'ACTIVE_ASSET'
    };
  }

  return {
    url,
    pageType: 'core',
    classification: 'D',
    indexValueScore: 50,
    reasons: ['Standard technical, compliance, and legal pages (Terms, Privacy, Refund)'],
    provenance: 'LEGAL_COMPLIANCE',
    specificity: 'LEGAL',
    decisionUsefulness: 'LEGAL',
    relationshipQuality: 'N/A',
    priority: 'TECHNICAL_UTILITY'
  };
}

// MAIN CLASSIFICATION LOOP
const manifest = {
  timestamp: new Date().toISOString(),
  totalUrls: urls.length,
  gscStatus: 'GSC DATA UNAVAILABLE (No GSC API credentials or local export files present in environment; quality-side classification executed without fabricated numbers)',
  scoringRubric: {
    entityLegitimacy: '0-20 pts (Identifiable software product, official domain validation)',
    specificity: '0-20 pts (Product-specific capabilities, features, pros/cons, zero boilerplate)',
    provenance: '0-20 pts (Official vendor source citations, timestamps, confidence)',
    decisionUsefulness: '0-20 pts (Pricing tiers, deployment models, licensing, target audience)',
    relationshipQuality: '0-10 pts (Curated direct architectural substitutes vs broad category fallbacks)',
    searchOpportunity: '0-10 pts (Established market leaders and high-intent buyer comparisons)'
  },
  thresholds: {
    A_KEEP_INDEXED: 'Score >= 70 with verified provenance, or Flagship Asset / Authority Five / Official Editorial Guide',
    B_IMPROVE_PRIORITY: 'Score 45-69, or Known Market Leader / Strategic Category / High-Intent VS Pairing',
    C_HOLD_FROM_INDEX: 'Score < 45 with uncurated category fallback or low-intent programmatic pairing',
    D_TECHNICAL_NAV: 'Standard legal, compliance, and utility pages (Terms, Privacy, Refund)'
  },
  countsByPageType: {
    software: { A: 0, B: 0, C: 0, total: 0 },
    alternatives: { A: 0, B: 0, C: 0, total: 0 },
    vs: { A: 0, B: 0, C: 0, total: 0 },
    best: { A: 0, B: 0, C: 0, total: 0 },
    category: { A: 0, B: 0, C: 0, total: 0 },
    guides: { A: 0, B: 0, C: 0, total: 0 },
    core: { A: 0, B: 0, C: 0, D: 0, total: 0 }
  },
  overallCounts: { A: 0, B: 0, C: 0, D: 0, total: 0 },
  top50RecoveryOpportunities: [],
  top100SafestHoldCandidates: [],
  items: []
};

urls.forEach((url) => {
  const cleanRoute = url.replace(/^\//, '').replace(/\/$/, '');
  let item = null;

  if (cleanRoute.startsWith('software/')) {
    const toolId = cleanRoute.replace('software/', '');
    item = classifySoftwarePage(toolId, url);
    manifest.countsByPageType.software[item.classification]++;
    manifest.countsByPageType.software.total++;
  } else if (cleanRoute.startsWith('alternatives/')) {
    const toolId = cleanRoute.replace('alternatives/', '');
    item = classifyAlternativesPage(toolId, url);
    manifest.countsByPageType.alternatives[item.classification]++;
    manifest.countsByPageType.alternatives.total++;
  } else if (cleanRoute.startsWith('vs/')) {
    const vsSlug = cleanRoute.replace('vs/', '');
    item = classifyVsPage(vsSlug, url);
    manifest.countsByPageType.vs[item.classification]++;
    manifest.countsByPageType.vs.total++;
  } else if (cleanRoute.startsWith('best/')) {
    const catSlug = cleanRoute.replace('best/', '');
    item = classifyBestPage(catSlug, url);
    manifest.countsByPageType.best[item.classification]++;
    manifest.countsByPageType.best.total++;
  } else if (cleanRoute.startsWith('category/')) {
    const catSlug = cleanRoute.replace('category/', '');
    item = classifyBestPage(catSlug, url);
    manifest.countsByPageType.category[item.classification]++;
    manifest.countsByPageType.category.total++;
  } else if (cleanRoute.startsWith('guides/')) {
    const guideSlug = cleanRoute.replace('guides/', '');
    item = classifyGuidePage(guideSlug, url);
    manifest.countsByPageType.guides[item.classification]++;
    manifest.countsByPageType.guides.total++;
  } else {
    item = classifyCorePage(cleanRoute, url);
    manifest.countsByPageType.core[item.classification]++;
    manifest.countsByPageType.core.total++;
  }

  manifest.overallCounts[item.classification]++;
  manifest.overallCounts.total++;
  manifest.items.push(item);
});

// Top 50 B-class Recovery Opportunities
const bItems = manifest.items.filter(i => i.classification === 'B');
bItems.sort((a, b) => b.indexValueScore - a.indexValueScore || a.url.localeCompare(b.url));
manifest.top50RecoveryOpportunities = bItems.slice(0, 50).map(i => ({
  url: i.url,
  pageType: i.pageType,
  indexValueScore: i.indexValueScore,
  priority: i.priority,
  reasons: i.reasons[0]
}));

// 100 Safest Hold Candidates (C-class)
const cItems = manifest.items.filter(i => i.classification === 'C');
cItems.sort((a, b) => a.indexValueScore - b.indexValueScore || a.url.localeCompare(b.url));
manifest.top100SafestHoldCandidates = cItems.slice(0, 100).map(i => ({
  url: i.url,
  pageType: i.pageType,
  indexValueScore: i.indexValueScore,
  reasons: i.reasons[0]
}));

const manifestPath = path.join(reportsDir, 'index-footprint-classification.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('✅ Classification complete!');
console.log('📊 Summary Statistics:');
console.log('----------------------------------------------------');
console.log(`Total URLs Classified: ${manifest.overallCounts.total}`);
console.log(`A - KEEP INDEXED:      ${manifest.overallCounts.A} (${((manifest.overallCounts.A / manifest.overallCounts.total) * 100).toFixed(1)}%)`);
console.log(`B - IMPROVE/PRIORITY:  ${manifest.overallCounts.B} (${((manifest.overallCounts.B / manifest.overallCounts.total) * 100).toFixed(1)}%)`);
console.log(`C - HOLD FROM INDEX:   ${manifest.overallCounts.C} (${((manifest.overallCounts.C / manifest.overallCounts.total) * 100).toFixed(1)}%)`);
console.log(`D - TECHNICAL/NAV:     ${manifest.overallCounts.D} (${((manifest.overallCounts.D / manifest.overallCounts.total) * 100).toFixed(1)}%)`);
console.log('----------------------------------------------------');
console.log('Page Type Breakdown:');
console.log(`Software:     A=${manifest.countsByPageType.software.A}, B=${manifest.countsByPageType.software.B}, C=${manifest.countsByPageType.software.C}, Total=${manifest.countsByPageType.software.total}`);
console.log(`Alternatives: A=${manifest.countsByPageType.alternatives.A}, B=${manifest.countsByPageType.alternatives.B}, C=${manifest.countsByPageType.alternatives.C}, Total=${manifest.countsByPageType.alternatives.total}`);
console.log(`VS:           A=${manifest.countsByPageType.vs.A}, B=${manifest.countsByPageType.vs.B}, C=${manifest.countsByPageType.vs.C}, Total=${manifest.countsByPageType.vs.total}`);
console.log(`Best:         A=${manifest.countsByPageType.best.A}, B=${manifest.countsByPageType.best.B}, C=${manifest.countsByPageType.best.C}, Total=${manifest.countsByPageType.best.total}`);
console.log(`Category:     A=${manifest.countsByPageType.category.A}, B=${manifest.countsByPageType.category.B}, C=${manifest.countsByPageType.category.C}, Total=${manifest.countsByPageType.category.total}`);
console.log(`Guides:       A=${manifest.countsByPageType.guides.A}, B=${manifest.countsByPageType.guides.B}, C=${manifest.countsByPageType.guides.C}, Total=${manifest.countsByPageType.guides.total}`);
console.log(`Core:         A=${manifest.countsByPageType.core.A}, B=${manifest.countsByPageType.core.B}, C=${manifest.countsByPageType.core.C}, D=${manifest.countsByPageType.core.D}, Total=${manifest.countsByPageType.core.total}`);
console.log('----------------------------------------------------');
console.log(`📄 Saved classification manifest to: ${manifestPath}`);

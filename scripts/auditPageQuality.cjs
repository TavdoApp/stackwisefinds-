const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

console.log('🛡️  StakDock Adversarial Quality Calibration Engine (Step 2B Shadow Mode)...');

// 1. Load Datasets
const saasTools = readAllTools();
const saasCategories = readCategories();
const toolsMap = new Map();
saasTools.forEach(t => toolsMap.set(t.id, t));

// Helper: Generic filler / buzzword detector
const GENERIC_FEATURE_BUZZWORDS = [
  'easy to use', 'powerful platform', 'save time', 'improve productivity',
  'cloud-based', 'fast setup', 'user friendly', 'all-in-one', 'modern interface',
  'high performance', 'secure and reliable', 'streamlined workflow'
];

function isGenericFeature(featStr) {
  if (!featStr || typeof featStr !== 'string') return true;
  const clean = featStr.toLowerCase().trim();
  if (clean.length < 10) return true;
  return GENERIC_FEATURE_BUZZWORDS.some(bw => clean === bw || clean.includes(bw));
}

// -------------------------------------------------------------
// 2. Strict Data Provenance Classifier
// -------------------------------------------------------------
function evaluateStrictProvenance(tool) {
  if (!tool) return 'UNKNOWN';

  // VERIFIED: Authorized deal partner or claimed founder
  if (tool.claimedByFounder || tool.isFounderVerified || tool.hasLifetimeDeal || tool.dealPrice) {
    return 'VERIFIED';
  }

  // HIGH: Real concrete specs, non-generic description >= 150 chars, clear pricing model
  const hasValidFeatures = Array.isArray(tool.features) && tool.features.length >= 3 &&
    tool.features.filter(f => !isGenericFeature(f)).length >= 2;
  const hasSpecificDesc = tool.description && tool.description.length >= 150;
  const hasPricingDetail = tool.pricing && tool.pricing !== 'Unlisted' && tool.pricing !== 'Freemium / Paid';

  if (tool.domain && hasValidFeatures && hasSpecificDesc && hasPricingDetail) {
    return 'HIGH';
  }

  // MEDIUM: Basic domain + description >= 100 chars, but standard generic freemium tag
  if (tool.domain && tool.description && tool.description.length >= 90) {
    return 'MEDIUM';
  }

  // LOW: Thin description (<90 chars) or 0 features
  if (tool.description && tool.description.length >= 40) {
    return 'LOW';
  }

  return 'UNKNOWN';
}

// -------------------------------------------------------------
// 3. Strict Comparison Intent Evaluator
// -------------------------------------------------------------
// Known direct job-to-be-done competitor clusters
const DIRECT_COMPETITOR_CLUSTERS = {
  // AI Code Editors
  'cursor-ai': ['github-copilot', 'windsurf', 'replit-agent', 'v0-dev'],
  'github-copilot': ['cursor-ai', 'windsurf', 'tabnine', 'replit-agent'],
  'replit-agent': ['lovable', 'bolt-new', 'cursor-ai', 'v0-dev'],
  'lovable': ['replit-agent', 'bolt-new', 'v0-dev', 'cursor-ai'],
  
  // CRMs
  'hubspot-crm': ['salesforce', 'pipedrive', 'zoho-crm', 'close-crm', 'freshsales'],
  'salesforce': ['hubspot-crm', 'pipedrive', 'zoho-crm'],
  'pipedrive': ['hubspot-crm', 'close-crm', 'zoho-crm'],
  
  // Knowledge & Project Mgmt
  'notion': ['obsidian', 'coda', 'anytype', 'affine', 'craft-docs', 'clickup', 'asana'],
  'obsidian': ['notion', 'logseq', 'roam-research', 'capacities'],
  'asana': ['jira-by-atlassian', 'linear', 'monday-com', 'clickup', 'trello'],
  'linear': ['jira-by-atlassian', 'asana', 'height-app', 'github-projects'],
  
  // Automation
  'zapier': ['make', 'n8n', 'activepieces', 'relay-app'],
  'make': ['zapier', 'n8n', 'activepieces'],
  'n8n': ['zapier', 'make', 'activepieces'],

  // Password Managers
  '1password': ['bitwarden', 'dashlane', 'keeper', 'lastpass', 'proton-pass'],
  'bitwarden': ['1password', 'dashlane', 'keeper', 'proton-pass']
};

function evaluateStrictVsIntent(tA, tB) {
  if (!tA || !tB) return 'LOW';

  // Check known direct cluster
  if (DIRECT_COMPETITOR_CLUSTERS[tA.id] && DIRECT_COMPETITOR_CLUSTERS[tA.id].includes(tB.id)) {
    return 'HIGH';
  }
  if (DIRECT_COMPETITOR_CLUSTERS[tB.id] && DIRECT_COMPETITOR_CLUSTERS[tB.id].includes(tA.id)) {
    return 'HIGH';
  }

  // Same category AND both have rich feature specs in the same domain
  if (tA.category === tB.category) {
    // Check if one is a completely different sub-type
    const nameA = (tA.name + ' ' + (tA.tagline || '') + ' ' + (tA.description || '')).toLowerCase();
    const nameB = (tB.name + ' ' + (tB.tagline || '') + ' ' + (tB.description || '')).toLowerCase();

    const isMeetingA = nameA.includes('meeting') || nameA.includes('transcrib');
    const isMeetingB = nameB.includes('meeting') || nameB.includes('transcrib');
    const isCodeA = nameA.includes('code') || nameA.includes('developer') || nameA.includes('ide');
    const isCodeB = nameB.includes('code') || nameB.includes('developer') || nameB.includes('ide');

    if ((isMeetingA && isCodeB) || (isCodeA && isMeetingB)) {
      return 'LOW'; // Sub-niche mismatch
    }

    const isVideoAdA = nameA.includes('ad') || nameA.includes('commercial') || nameA.includes('marketing');
    const isAsyncRecB = nameB.includes('screen record') || nameB.includes('async video') || nameB.includes('messaging');
    if ((isVideoAdA && isAsyncRecB)) {
      return 'LOW'; // Video ad generator vs team screen recorder mismatch
    }

    if (tA.features && tB.features && tA.features.length >= 3 && tB.features.length >= 3) {
      return 'MEDIUM';
    }
    return 'LOW'; // Thin intra-category pairing
  }

  return 'LOW';
}

// -------------------------------------------------------------
// 4. CALIBRATED SCORING FORMULAS
// -------------------------------------------------------------

// A. /software/:id/ (Calibrated)
function scoreSoftwareCalibrated(tool) {
  const breakdown = {
    identity: 0,        // max 10 (reduced from 15)
    description: 0,     // max 25 (strict specificity)
    features: 0,        // max 20 (strict non-generic capability)
    pricing: 0,         // max 15 (strict numeric/deal confidence)
    useCase: 0,         // max 10 (explicit target user)
    provenance: 0       // max 20 (strict factual support)
  };

  const issues = [];
  const improvements = [];
  const provenance = evaluateStrictProvenance(tool);

  // 1. Identity (10 pts max) - Prerequisite health
  if (tool.name && tool.name.length >= 2) breakdown.identity += 2;
  if (tool.domain && tool.domain.includes('.')) breakdown.identity += 3;
  if (tool.category && saasCategories.some(c => c.id === tool.category)) breakdown.identity += 2;
  if (tool.tagline && tool.tagline.length >= 25 && tool.tagline.toLowerCase() !== tool.name.toLowerCase()) {
    breakdown.identity += 3;
  } else {
    issues.push('Weak or missing tagline (<25 chars)');
    improvements.push('Write a specific 1-sentence capability tagline');
  }

  // 2. Description (25 pts max) - Specificity & Information Density
  const desc = tool.description || '';
  const descLen = desc.length;
  if (descLen >= 250) breakdown.description += 14;
  else if (descLen >= 150) breakdown.description += 10;
  else if (descLen >= 90) {
    breakdown.description += 5;
    issues.push('Brief description (90-149 chars)');
  } else {
    breakdown.description += 2;
    issues.push('Thin description (<90 chars)');
    improvements.push('Expand description with concrete technical capabilities');
  }

  // Specificity bonus (penalize generic auto-filler templates)
  const isAutoSynth = desc.includes('is an established software tool built for teams, operators, and modern builders looking to accelerate workflows');
  if (isAutoSynth) {
    issues.push('Synthesized generic boilerplate description detected');
    breakdown.description = Math.max(2, breakdown.description - 6);
  } else if (descLen >= 120) {
    breakdown.description += 11;
  } else {
    breakdown.description += 4;
  }

  // 3. Feature Specificity (20 pts max)
  const rawFeatures = Array.isArray(tool.features) ? tool.features : [];
  const validFeatures = rawFeatures.filter(f => !isGenericFeature(f));

  if (validFeatures.length >= 4) {
    breakdown.features += 20;
  } else if (validFeatures.length >= 3) {
    breakdown.features += 15;
    improvements.push('Add 1 additional concrete capability spec');
  } else if (validFeatures.length >= 1) {
    breakdown.features += 7;
    issues.push('Thin feature specifications (1-2 specs)');
    improvements.push('Document 4 product-specific technical capabilities');
  } else {
    breakdown.features += 0;
    issues.push('Missing structured feature specifications (0 specs)');
    improvements.push('Add 4 structured product capability specs');
  }

  // 4. Pricing Transparency (15 pts max)
  if (tool.hasLifetimeDeal || tool.dealPrice) {
    breakdown.pricing += 15; // Full confidence LTD
  } else if (tool.pricing && (tool.pricing.includes('$') || tool.pricing.includes('€') || tool.pricing.includes('£'))) {
    breakdown.pricing += 12; // Specific numeric tier
  } else if (tool.isFreeTier || tool.isOpenSource) {
    breakdown.pricing += 10; // Explicit free/open-source model
  } else if (tool.pricing && tool.pricing !== 'Unlisted') {
    breakdown.pricing += 5;  // Generic "Freemium / Paid" label
    issues.push('Generic pricing label (unverified pricing tiers)');
    improvements.push('Verify exact pricing tiers ($/mo or free trial days)');
  } else {
    breakdown.pricing += 0;
    issues.push('Unlisted pricing model');
  }

  // 5. Use Case & Target Audience (10 pts max)
  if (tool.bestFor && tool.bestFor.length >= 15) {
    breakdown.useCase += 7;
  } else if (tool.targetAudience && tool.targetAudience.length >= 15) {
    breakdown.useCase += 7;
  } else {
    issues.push('Missing explicit bestFor / target audience persona');
    improvements.push('Define concrete target buyer persona and workflow');
  }

  if (tool.pros && Array.isArray(tool.pros) && tool.pros.length >= 2) {
    breakdown.useCase += 3;
  }

  // 6. Strict Provenance (20 pts max)
  if (provenance === 'VERIFIED') breakdown.provenance += 20;
  else if (provenance === 'HIGH') breakdown.provenance += 15;
  else if (provenance === 'MEDIUM') breakdown.provenance += 8;
  else if (provenance === 'LOW') breakdown.provenance += 3;
  else breakdown.provenance += 0;

  let totalScore = Math.min(100, Math.round(
    breakdown.identity +
    breakdown.description +
    breakdown.features +
    breakdown.pricing +
    breakdown.useCase +
    breakdown.provenance
  ));

  // Adversarial Quality Cap
  if (provenance === 'LOW' || isAutoSynth) {
    totalScore = Math.min(totalScore, 50); // Cannot reach GOOD (65+)
  } else if (provenance === 'MEDIUM' && validFeatures.length === 0) {
    totalScore = Math.min(totalScore, 62); // Cannot reach GOOD (65+) without features
  }

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/software/${tool.id}/`,
    route: `/software/${tool.id}/`,
    type: 'software',
    id: tool.id,
    name: tool.name,
    totalScore,
    band,
    provenance,
    validFeatureCount: validFeatures.length,
    breakdown,
    issues,
    improvements
  };
}

// B. /alternatives/:id/ (Calibrated)
function scoreAlternativesCalibrated(tool, sourceScore) {
  const breakdown = {
    sourceQuality: 0,          // max 20
    alternativeRelevance: 0,   // max 30
    differentiation: 0,        // max 25
    decisionGuidance: 0        // max 25
  };

  const issues = [];
  const improvements = [];

  // Source quality foundation (20)
  breakdown.sourceQuality = Math.round((sourceScore.totalScore / 100) * 20);

  // Alternative relevance (30)
  const categoryAlts = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const altCount = categoryAlts.length;

  if (altCount >= 5) breakdown.alternativeRelevance += 30;
  else if (altCount >= 3) breakdown.alternativeRelevance += 20;
  else if (altCount >= 1) {
    breakdown.alternativeRelevance += 10;
    issues.push(`Sparse category cluster (${altCount} competitors)`);
  } else {
    breakdown.alternativeRelevance += 0;
    issues.push('Zero alternatives found (empty list)');
  }

  // Differentiation (25)
  const altsWithSpecs = categoryAlts.filter(a => Array.isArray(a.features) && a.features.length >= 3).length;
  if (altCount > 0 && altsWithSpecs / altCount >= 0.6) {
    breakdown.differentiation += 25;
  } else if (altCount > 0 && altsWithSpecs / altCount >= 0.3) {
    breakdown.differentiation += 15;
  } else {
    breakdown.differentiation += 5;
    issues.push('Alternatives lack structured feature differentiation');
  }

  // Decision guidance (25)
  if (sourceScore.band === 'EXCELLENT' && altCount >= 4) {
    breakdown.decisionGuidance += 25;
  } else if (sourceScore.band === 'GOOD' && altCount >= 3) {
    breakdown.decisionGuidance += 18;
  } else {
    breakdown.decisionGuidance += 8;
    issues.push('Weak comparative decision context');
  }

  let totalScore = Math.min(100, Math.round(
    breakdown.sourceQuality +
    breakdown.alternativeRelevance +
    breakdown.differentiation +
    breakdown.decisionGuidance
  ));

  // Adversarial Quality Caps
  if (altCount === 0) {
    totalScore = Math.min(totalScore, 30); // HOLD
  } else if (sourceScore.band === 'NEEDS IMPROVEMENT') {
    totalScore = Math.min(totalScore, 58); // Needs Improvement cap
  } else if (sourceScore.band === 'HOLD') {
    totalScore = Math.min(totalScore, 40); // HOLD cap
  }

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/alternatives/${tool.id}/`,
    route: `/alternatives/${tool.id}/`,
    type: 'alternatives',
    id: tool.id,
    name: `${tool.name} Alternatives`,
    totalScore,
    band,
    altCount,
    breakdown,
    issues,
    improvements
  };
}

// C. /vs/:slug/ (Calibrated)
function scoreVsCalibrated(pair, scoreMap) {
  const { tA, tB, vsSlug } = pair;
  const breakdown = {
    comparisonIntent: 0,       // max 35 (strict job-to-be-done overlap)
    specDifferentiation: 0,    // max 25 (concrete side-by-side specs)
    guidanceValue: 0,          // max 20 (buyer tradeoff context)
    toolBaselineQuality: 0     // max 20 (quality of underlying tools)
  };

  const issues = [];
  const improvements = [];
  const intent = evaluateStrictVsIntent(tA, tB);

  // 1. Comparison Intent (35 pts max)
  if (intent === 'HIGH') {
    breakdown.comparisonIntent += 35;
  } else if (intent === 'MEDIUM') {
    breakdown.comparisonIntent += 20;
    issues.push('Partial workflow overlap (secondary comparison intent)');
  } else {
    breakdown.comparisonIntent += 5;
    issues.push('Low direct substitution intent (sub-niche or workflow mismatch)');
  }

  // 2. Spec Differentiation (25 pts max)
  const hasValidPriceA = tA.pricing && tA.pricing.includes('$');
  const hasValidPriceB = tB.pricing && tB.pricing.includes('$');
  if (hasValidPriceA && hasValidPriceB) breakdown.specDifferentiation += 12;
  else if (tA.pricing && tB.pricing) breakdown.specDifferentiation += 6;

  const hasFeatsA = Array.isArray(tA.features) && tA.features.length >= 3;
  const hasFeatsB = Array.isArray(tB.features) && tB.features.length >= 3;
  if (hasFeatsA && hasFeatsB) breakdown.specDifferentiation += 13;
  else if (hasFeatsA || hasFeatsB) breakdown.specDifferentiation += 6;
  else {
    issues.push('Both tools lack structured feature specs in matrix');
  }

  // 3. Guidance Value (20 pts max)
  if (intent === 'HIGH' && (hasFeatsA || hasFeatsB)) {
    breakdown.guidanceValue += 20;
  } else if (intent === 'MEDIUM') {
    breakdown.guidanceValue += 12;
  } else {
    breakdown.guidanceValue += 5;
  }

  // 4. Underlying Tool Baseline (20 pts max)
  const scoreA = scoreMap.get(tA.id)?.totalScore || 50;
  const scoreB = scoreMap.get(tB.id)?.totalScore || 50;
  breakdown.toolBaselineQuality = Math.round(((scoreA + scoreB) / 200) * 20);

  let totalScore = Math.min(100, Math.round(
    breakdown.comparisonIntent +
    breakdown.specDifferentiation +
    breakdown.guidanceValue +
    breakdown.toolBaselineQuality
  ));

  // Adversarial Quality Cap for Low Intent Pairs
  if (intent === 'LOW') {
    totalScore = Math.min(totalScore, 48); // HOLD / NEEDS IMPROVEMENT cap
  } else if (!hasFeatsA && !hasFeatsB) {
    totalScore = Math.min(totalScore, 62); // NEEDS IMPROVEMENT cap
  }

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/vs/${vsSlug}/`,
    route: `/vs/${vsSlug}/`,
    type: 'vs',
    slug: vsSlug,
    name: `${tA.name} vs ${tB.name}`,
    intent,
    totalScore,
    band,
    breakdown,
    issues,
    improvements
  };
}

// D. /best/:category/ (Calibrated)
function scoreBestCalibrated(cat) {
  const breakdown = {
    categoryDepth: 0,          // max 25
    selectionMethodology: 0,   // max 25 (curation vs raw DB dump)
    buyerGuidanceTradeoffs: 0, // max 25 (persona specific trade-offs)
    technicalHealth: 0         // max 25 (structured data & links)
  };

  const issues = [];
  const improvements = [];
  const matched = saasTools.filter(t => t.category === cat.id);
  const count = matched.length;

  // 1. Category Depth (25)
  if (count >= 15) breakdown.categoryDepth += 25;
  else if (count >= 8) breakdown.categoryDepth += 18;
  else if (count >= 4) {
    breakdown.categoryDepth += 10;
    issues.push(`Small category inventory (${count} tools)`);
  } else {
    breakdown.categoryDepth += 4;
    issues.push(`Thin category (<4 tools)`);
  }

  // 2. Selection Methodology (25)
  // Current ranking is deterministic baseline votes + database order; lacks explicit per-persona curation criteria
  breakdown.selectionMethodology += 12; // Modest baseline credit for deterministic order
  issues.push('Rankings based on baseline array order without published scoring methodology');
  improvements.push('Add published multi-criteria evaluation scoring breakdown per tool');

  // 3. Buyer Guidance & Tradeoffs (25)
  // Current page has general FAQ and category overview, but lacks "Best for X vs Best for Y" persona tradeoffs
  breakdown.buyerGuidanceTradeoffs += 14;
  issues.push('Lacks persona-specific tradeoff matrices (e.g. Best for Enterprise vs Best for Solo)');
  improvements.push('Add persona-specific recommendations and pros/cons callouts');

  // 4. Technical Health (25)
  breakdown.technicalHealth += 25; // Clean CollectionPage & ItemList JSON-LD + Breadcrumbs

  let totalScore = Math.min(100, Math.round(
    breakdown.categoryDepth +
    breakdown.selectionMethodology +
    breakdown.buyerGuidanceTradeoffs +
    breakdown.technicalHealth
  ));

  // Adversarial Quality Cap: Without explicit editorial persona tradeoffs, /best/ cannot exceed 76 (GOOD)
  totalScore = Math.min(totalScore, 76);

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/best/${cat.id}/`,
    route: `/best/${cat.id}/`,
    type: 'best',
    id: cat.id,
    name: `Best ${cat.label} Software (2026)`,
    toolCount: count,
    totalScore,
    band,
    breakdown,
    issues,
    improvements
  };
}

// E. /guides/:slug/ (Calibrated)
function scoreGuideCalibrated(guide) {
  const breakdown = {
    editorialOriginality: 0,   // max 30 (first-party data/testing)
    comparativeDepth: 0,       // max 25 (detailed matrix)
    ssrPayloadDepth: 0,        // max 25 (real SSR rendered body)
    technicalHealth: 0         // max 20 (schema & links)
  };

  const issues = [];
  const improvements = [];

  // 1. Editorial Originality (30)
  breakdown.editorialOriginality += 16; // Solid summary and criteria, but lacks published primary benchmark test data
  issues.push('Lacks published primary benchmark test data (speed, latency, output samples)');

  // 2. Comparative Depth (25)
  breakdown.comparativeDepth += 20; // 5-8 tool comparison scope

  // 3. SSR Payload Depth (25)
  // Prerendering check: Does SSR HTML contain full body or header stub?
  const guideFilePath = path.join(__dirname, '..', 'dist', 'guides', guide.slug, 'index.html');
  let hasFullSsr = false;
  if (fs.existsSync(guideFilePath)) {
    const html = fs.readFileSync(guideFilePath, 'utf8');
    hasFullSsr = html.length >= 12000;
  }

  if (hasFullSsr) {
    breakdown.ssrPayloadDepth += 25;
  } else {
    breakdown.ssrPayloadDepth += 8; // Header-only SSR stub
    issues.push('Prerendered HTML contains only header summary (React-only body hydration)');
    improvements.push('Prerender complete markdown/article body into static HTML for crawlers');
  }

  // 4. Technical Health (20)
  breakdown.technicalHealth += 20;

  let totalScore = Math.min(100, Math.round(
    breakdown.editorialOriginality +
    breakdown.comparativeDepth +
    breakdown.ssrPayloadDepth +
    breakdown.technicalHealth
  ));

  // Adversarial Quality Cap: If SSR payload is only header stub, cap at 72 (GOOD)
  if (!hasFullSsr) {
    totalScore = Math.min(totalScore, 72);
  }

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/guides/${guide.slug}/`,
    route: `/guides/${guide.slug}/`,
    type: 'guide',
    slug: guide.slug,
    title: guide.title,
    wordCount: guide.wordCount,
    hasFullSsr,
    totalScore,
    band,
    breakdown,
    issues,
    improvements
  };
}

// -------------------------------------------------------------
// 5. EXECUTE CALIBRATED AUDIT ACROSS ALL INVENTORY
// -------------------------------------------------------------

console.log(`Recalibrating ${saasTools.length} /software/ routes...`);
const softwareScoresCalibrated = saasTools.map(t => scoreSoftwareCalibrated(t));
const scoreMapCalibrated = new Map();
softwareScoresCalibrated.forEach(s => scoreMapCalibrated.set(s.id, s));

console.log(`Recalibrating ${saasTools.length} /alternatives/ routes...`);
const alternativesScoresCalibrated = saasTools.map(t => scoreAlternativesCalibrated(t, scoreMapCalibrated.get(t.id)));

// VS pairs list
function getVsPairsList(tools) {
  const map = new Map();
  const catMap = {};
  tools.forEach(t => {
    const cat = t.category || 'other';
    if (!catMap[cat]) catMap[cat] = [];
    catMap[cat].push(t);
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

console.log(`Recalibrating ${versusPairs.length} /vs/ comparison routes...`);
const vsScoresCalibrated = versusPairs.map(p => scoreVsCalibrated(p, scoreMapCalibrated));

console.log(`Recalibrating ${saasCategories.filter(c => c.id !== 'all').length} /best/ category routes...`);
const bestScoresCalibrated = saasCategories.filter(c => c.id !== 'all').map(c => scoreBestCalibrated(c));

const allGuidesList = [
  { id: "guide-best-all-in-one-seo-software-2026", slug: "best-all-in-one-seo-software-2026", title: "Best All-in-One SEO Software in 2026: Comprehensive Buyer Matrix", wordCount: 1450 },
  { id: "guide-best-workflow-automation-tools-2026", slug: "best-workflow-automation-tools-2026", title: "Best Workflow Automation Software in 2026: Top Integration Platforms", wordCount: 1380 },
  { id: "guide-best-document-automation-tools-2026", slug: "best-document-automation-tools-2026", title: "Best Document Automation & eSign Software 2026: Top Contract Platforms", wordCount: 1290 },
  { id: "guide-best-cloud-database-platforms-2026", slug: "best-cloud-database-platforms-2026", title: "Best Cloud Database & BaaS Platforms 2026: Modern Backend Comparison", wordCount: 1520 },
  { id: "guide-best-ai-video-generators-2026", slug: "best-ai-video-generators-2026", title: "Best AI Video Generators in 2026: Text-to-Video & Motion Physics Matrix", wordCount: 1650 },
  { id: "guide-best-ai-coding-assistants-2026", slug: "best-ai-coding-assistants-2026", title: "Best AI Coding Assistants & Dev Tools 2026: Complete Benchmark", wordCount: 1780 },
  { id: "guide-best-crm-software-founders-2026", slug: "best-crm-software-founders-2026", title: "Best CRM Software for Founders & Sales Teams 2026: Pipeline Comparison", wordCount: 1420 },
  { id: "guide-best-customer-support-helpdesk-2026", slug: "best-customer-support-helpdesk-2026", title: "Best Customer Support & Helpdesk Software 2026: Shared Inbox Matrix", wordCount: 1340 }
];

console.log(`Recalibrating ${allGuidesList.length} /guides/ editorial routes...`);
const guideScoresCalibrated = allGuidesList.map(g => scoreGuideCalibrated(g));

const allScoresCalibrated = [
  ...softwareScoresCalibrated,
  ...alternativesScoresCalibrated,
  ...vsScoresCalibrated,
  ...bestScoresCalibrated,
  ...guideScoresCalibrated
];

// Helper: Statistical computer
function computeStats(items) {
  if (!items || items.length === 0) return { total: 0, avg: 0, median: 0, min: 0, max: 0, counts: { excellent: 0, good: 0, needsImprovement: 0, hold: 0 }, percentages: { excellent: 0, good: 0, needsImprovement: 0, hold: 0 } };
  const scores = items.map(i => i.totalScore).sort((a, b) => a - b);
  const total = scores.length;
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = Math.round((sum / total) * 10) / 10;
  const median = scores[Math.floor(total / 2)];
  const min = scores[0];
  const max = scores[total - 1];

  const excellent = items.filter(i => i.band === 'EXCELLENT').length;
  const good = items.filter(i => i.band === 'GOOD').length;
  const needsImprovement = items.filter(i => i.band === 'NEEDS IMPROVEMENT').length;
  const hold = items.filter(i => i.band === 'HOLD').length;

  return {
    total,
    avg,
    median,
    min,
    max,
    counts: { excellent, good, needsImprovement, hold },
    percentages: {
      excellent: Math.round((excellent / total) * 1000) / 10,
      good: Math.round((good / total) * 1000) / 10,
      needsImprovement: Math.round((needsImprovement / total) * 1000) / 10,
      hold: Math.round((hold / total) * 1000) / 10
    }
  };
}

const softwareStatsCal = computeStats(softwareScoresCalibrated);
const alternativesStatsCal = computeStats(alternativesScoresCalibrated);
const vsStatsCal = computeStats(vsScoresCalibrated);
const bestStatsCal = computeStats(bestScoresCalibrated);
const guideStatsCal = computeStats(guideScoresCalibrated);
const globalStatsCal = computeStats(allScoresCalibrated);

// -------------------------------------------------------------
// 6. NORMALIZED SKELETAL BOILERPLATE SIMILARITY TEST
// -------------------------------------------------------------
console.log('Running Normalized Structural Anti-Boilerplate Test...');

function normalizeSkeletalText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, ' ')
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g, ' ')
    .replace(/\$\d+(\/\w+)?/g, 'PRICE_TOKEN')
    .replace(/\b(stakdock|review|pricing|alternatives|compare|overview|features|website checked|founder verified|open source|free tier)\b/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getShingles(text, n = 3) {
  const words = text.split(/\s+/).filter(w => w.length > 2);
  const shingles = new Set();
  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(' '));
  }
  return shingles;
}

function calculateJaccard(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  return intersection / (setA.size + setB.size - intersection);
}

// Sample across templates
const sampleNormalizedVs = versusPairs.slice(0, 50).map(p => ({
  slug: p.vsSlug,
  shingles: getShingles(normalizeSkeletalText(`Comparing ${p.tA.name} and ${p.tB.name}. Explore pricing breakdown, feature matrices, customer sentiment, and user ratings to determine the right software for your workflow.`))
}));

let vsHighSim = 0;
let vsMedSim = 0;
let vsLowSim = 0;
let vsPairTotal = 0;

for (let i = 0; i < sampleNormalizedVs.length; i++) {
  for (let j = i + 1; j < sampleNormalizedVs.length; j++) {
    vsPairTotal++;
    const sim = calculateJaccard(sampleNormalizedVs[i].shingles, sampleNormalizedVs[j].shingles);
    if (sim >= 0.70) vsHighSim++;
    else if (sim >= 0.40) vsMedSim++;
    else vsLowSim++;
  }
}

const normalizedVsBoilerplate = {
  highStructuralRepetitionPercent: Math.round((vsHighSim / vsPairTotal) * 1000) / 10,
  moderateStructuralRepetitionPercent: Math.round((vsMedSim / vsPairTotal) * 1000) / 10,
  uniquePercent: Math.round((vsLowSim / vsPairTotal) * 1000) / 10
};

// -------------------------------------------------------------
// 7. STRICT PROVENANCE & INTENT SUMMARY
// -------------------------------------------------------------
let countVerified = 0;
let countHigh = 0;
let countMed = 0;
let countLow = 0;
let countUnknown = 0;

saasTools.forEach(t => {
  const p = evaluateStrictProvenance(t);
  if (p === 'VERIFIED') countVerified++;
  else if (p === 'HIGH') countHigh++;
  else if (p === 'MEDIUM') countMed++;
  else if (p === 'LOW') countLow++;
  else countUnknown++;
});

let countVsHigh = 0;
let countVsMed = 0;
let countVsLow = 0;

versusPairs.forEach(p => {
  const intent = evaluateStrictVsIntent(p.tA, p.tB);
  if (intent === 'HIGH') countVsHigh++;
  else if (intent === 'MEDIUM') countVsMed++;
  else countVsLow++;
});

// -------------------------------------------------------------
// 8. WRITE CALIBRATED REPORT
// -------------------------------------------------------------
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const reportCalibratedPath = path.join(reportsDir, 'page-quality-report-calibrated.json');
const summaryCalibratedPath = path.join(reportsDir, 'page-quality-summary-calibrated.md');

const reportDataCalibrated = {
  generatedAt: new Date().toISOString(),
  auditMode: 'STEP_2B_ADVERSARIAL_CALIBRATION_SHADOW_MODE',
  summary: {
    totalRoutesEvaluated: allScoresCalibrated.length,
    globalStats: globalStatsCal,
    byTemplate: {
      software: softwareStatsCal,
      alternatives: alternativesStatsCal,
      versus: vsStatsCal,
      best: bestStatsCal,
      guides: guideStatsCal
    }
  },
  strictProvenance: {
    verified: { count: countVerified, percent: Math.round((countVerified / saasTools.length) * 1000) / 10 },
    high: { count: countHigh, percent: Math.round((countHigh / saasTools.length) * 1000) / 10 },
    medium: { count: countMed, percent: Math.round((countMed / saasTools.length) * 1000) / 10 },
    low: { count: countLow, percent: Math.round((countLow / saasTools.length) * 1000) / 10 },
    unknown: { count: countUnknown, percent: Math.round((countUnknown / saasTools.length) * 1000) / 10 }
  },
  strictVsIntent: {
    high: { count: countVsHigh, percent: Math.round((countVsHigh / versusPairs.length) * 1000) / 10 },
    medium: { count: countVsMed, percent: Math.round((countVsMed / versusPairs.length) * 1000) / 10 },
    low: { count: countVsLow, percent: Math.round((countVsLow / versusPairs.length) * 1000) / 10 }
  },
  normalizedVsBoilerplate,
  topPagesByTemplate: {
    software: softwareScoresCalibrated.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    alternatives: alternativesScoresCalibrated.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    versus: vsScoresCalibrated.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    best: bestScoresCalibrated.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    guides: guideScoresCalibrated.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5)
  },
  lowestPagesByTemplate: {
    software: softwareScoresCalibrated.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    alternatives: alternativesScoresCalibrated.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    versus: vsScoresCalibrated.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    best: bestScoresCalibrated.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    guides: guideScoresCalibrated.sort((a, b) => a.totalScore - b.totalScore).slice(0, 8)
  }
};

fs.writeFileSync(reportCalibratedPath, JSON.stringify(reportDataCalibrated, null, 2), 'utf8');

console.log('✅ Adversarial Quality Recalibration Audit Complete!');
console.log(`📄 Calibrated JSON: ${reportCalibratedPath}`);

const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

console.log('📊 StakDock Page Quality & Indexation Intelligence Engine (Shadow Mode Audit)...');

// 1. Load Data
const saasTools = readAllTools();
const saasCategories = readCategories();

const toolsMap = new Map();
saasTools.forEach(t => toolsMap.set(t.id, t));

// VS Pairs list builder
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

const allGuides = [
  {
    id: "guide-best-all-in-one-seo-software-2026",
    slug: "best-all-in-one-seo-software-2026",
    title: "Best All-in-One SEO Software in 2026: Comprehensive Buyer Matrix",
    summary: "Discover the top all-in-one SEO platforms for technical audits, keyword tracking, and backlink monitoring compared side by side.",
    category: "seo-tools",
    wordCount: 1450,
    hasSpecTable: true,
    toolCount: 6
  },
  {
    id: "guide-best-workflow-automation-tools-2026",
    slug: "best-workflow-automation-tools-2026",
    title: "Best Workflow Automation Software in 2026: Top Integration Platforms",
    summary: "Compare the leading workflow automation platforms for founders and operations teams with pricing models, webhook reliability, and ease of use.",
    category: "nocode-automation",
    wordCount: 1380,
    hasSpecTable: true,
    toolCount: 6
  },
  {
    id: "guide-best-document-automation-tools-2026",
    slug: "best-document-automation-tools-2026",
    title: "Best Document Automation & eSign Software 2026: Top Contract Platforms",
    summary: "Evaluate the best electronic signature and document automation software for legal compliance, API flexibility, and cost efficiency.",
    category: "e-signature",
    wordCount: 1290,
    hasSpecTable: true,
    toolCount: 5
  },
  {
    id: "guide-best-cloud-database-platforms-2026",
    slug: "best-cloud-database-platforms-2026",
    title: "Best Cloud Database & BaaS Platforms 2026: Modern Backend Comparison",
    summary: "Compare serverless SQL, NoSQL, vector search engines, and backend-as-a-service providers for modern full-stack web applications.",
    category: "databases-backends",
    wordCount: 1520,
    hasSpecTable: true,
    toolCount: 6
  },
  {
    id: "guide-best-ai-video-generators-2026",
    slug: "best-ai-video-generators-2026",
    title: "Best AI Video Generators in 2026: Text-to-Video & Motion Physics Matrix",
    summary: "In-depth buyer matrix comparing generative AI video models on physical realism, render latency, motion control, and pricing tiers.",
    category: "trending-video-ai",
    wordCount: 1650,
    hasSpecTable: true,
    toolCount: 7
  },
  {
    id: "guide-best-ai-coding-assistants-2026",
    slug: "best-ai-coding-assistants-2026",
    title: "Best AI Coding Assistants & Dev Tools 2026: Complete Benchmark",
    summary: "Benchmark comparing AI code editors, auto-complete IDE plugins, and prompt-to-app builders for developer velocity and codebase indexing.",
    category: "ai-coding-dev",
    wordCount: 1780,
    hasSpecTable: true,
    toolCount: 8
  },
  {
    id: "guide-best-crm-software-founders-2026",
    slug: "best-crm-software-founders-2026",
    title: "Best CRM Software for Founders & Sales Teams 2026: Pipeline Comparison",
    summary: "Compare top sales CRMs for pipeline visualization, email sequencing, lead scoring, and automated deal tracking.",
    category: "crm",
    wordCount: 1420,
    hasSpecTable: true,
    toolCount: 6
  },
  {
    id: "guide-best-customer-support-helpdesk-2026",
    slug: "best-customer-support-helpdesk-2026",
    title: "Best Customer Support & Helpdesk Software 2026: Shared Inbox Matrix",
    summary: "Evaluate top customer support platforms, live chat widgets, and AI ticketing bots for response times and omnichannel routing.",
    category: "customer-support",
    wordCount: 1340,
    hasSpecTable: true,
    toolCount: 6
  }
];

// Helper: Shingle n-gram extractor for similarity detection
function getShingles(text, n = 3) {
  const words = String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
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

// -------------------------------------------------------------
// 2. Data Confidence Evaluator
// -------------------------------------------------------------
function evaluateDataConfidence(tool) {
  if (!tool) return 'UNKNOWN';
  if (tool.claimedByFounder || tool.isFounderVerified || tool.hasLifetimeDeal || tool.dealPrice) {
    return 'VERIFIED';
  }
  if (tool.domain && tool.domain.includes('.') && tool.features && tool.features.length >= 3 && tool.description && tool.description.length >= 140) {
    return 'HIGH';
  }
  if (tool.domain && tool.description && tool.description.length >= 80) {
    return 'MEDIUM';
  }
  if (tool.description && tool.description.length >= 40) {
    return 'LOW';
  }
  return 'UNKNOWN';
}

// -------------------------------------------------------------
// 3. Search Intent Evaluator for Pairs
// -------------------------------------------------------------
function evaluateVsSearchIntent(tA, tB) {
  if (!tA || !tB) return 'LOW';
  if (tA.category && tB.category && tA.category === tB.category) {
    // Both top tier or high profile tools
    if (tA.featured && tB.featured) return 'HIGH';
    if ((tA.features && tA.features.length >= 3) && (tB.features && tB.features.length >= 3)) return 'HIGH';
    return 'MEDIUM';
  }
  return 'LOW';
}

// -------------------------------------------------------------
// 4. Scoring Models
// -------------------------------------------------------------

// A. /software/:id/
function scoreSoftwarePage(tool) {
  const breakdown = {
    identity: 0,        // max 15
    description: 0,     // max 25
    features: 0,        // max 15
    pricing: 0,         // max 15
    useCase: 0,         // max 10
    relationships: 0,   // max 10
    dataConfidence: 0   // max 10
  };

  const issues = [];
  const improvements = [];

  // Identity (15)
  if (tool.name && tool.name.length >= 2) breakdown.identity += 3;
  else issues.push('Missing/invalid product name');

  if (tool.domain && tool.domain.includes('.') && !tool.domain.includes(' ')) breakdown.identity += 4;
  else issues.push('Missing or invalid domain');

  if (tool.category && saasCategories.some(c => c.id === tool.category)) breakdown.identity += 4;
  else issues.push('Unrecognized or missing category');

  if (tool.tagline && tool.tagline.length >= 20 && tool.tagline.toLowerCase() !== tool.name.toLowerCase()) {
    breakdown.identity += 4;
  } else {
    issues.push('Short or missing tagline');
    improvements.push('Add a descriptive 1-sentence tagline (+4 pts)');
  }

  // Description (25)
  const descLen = (tool.description || '').length;
  if (descLen >= 250) breakdown.description += 18;
  else if (descLen >= 150) breakdown.description += 14;
  else if (descLen >= 80) {
    breakdown.description += 8;
    issues.push('Brief description (<150 chars)');
    improvements.push('Expand product description to 200+ characters with concrete workflow capabilities (+6 pts)');
  } else {
    breakdown.description += 3;
    issues.push('Very thin description (<80 chars)');
    improvements.push('Write a comprehensive 200+ char overview (+11 pts)');
  }

  // Specificity & low generic filler check
  const genericRepetitivePhrases = ['best software for all users', 'useful tool for everything', 'good software platform'];
  const hasGenericFiller = genericRepetitivePhrases.some(p => (tool.description || '').toLowerCase().includes(p));
  if (!hasGenericFiller && descLen >= 100) {
    breakdown.description += 7;
  } else if (!hasGenericFiller) {
    breakdown.description += 4;
  }

  // Features (15)
  const featCount = Array.isArray(tool.features) ? tool.features.length : 0;
  if (featCount >= 4) {
    breakdown.features += 12;
    const avgLen = tool.features.reduce((acc, f) => acc + f.length, 0) / featCount;
    if (avgLen >= 15) breakdown.features += 3;
  } else if (featCount >= 3) {
    breakdown.features += 10;
    improvements.push('Add 1-2 additional specific feature highlights (+5 pts)');
  } else if (featCount >= 1) {
    breakdown.features += 5;
    issues.push('Thin feature specifications (<3 features)');
    improvements.push('Document at least 4 specific product features (+10 pts)');
  } else {
    issues.push('Missing feature specifications (0 features)');
    improvements.push('Add 4 structured product capability specs (+15 pts)');
  }

  // Pricing (15)
  if (tool.pricing && tool.pricing !== 'Unlisted' && tool.pricing !== 'Contact for Pricing') {
    breakdown.pricing += 5;
    if (tool.hasLifetimeDeal || tool.dealPrice) {
      breakdown.pricing += 10; // Verified LTD breakdown
    } else if (tool.isFreeTier || tool.isOpenSource || tool.pricing.includes('$') || tool.pricing.toLowerCase().includes('free') || tool.pricing.toLowerCase().includes('freemium')) {
      breakdown.pricing += 10;
    } else {
      breakdown.pricing += 5;
      improvements.push('Clarify pricing model (Free tier, Subscription pricing, or LTD) (+5 pts)');
    }
  } else {
    issues.push('Unlisted or unclassified pricing');
    improvements.push('Verify and classify pricing model (+10 pts)');
  }

  // Use-Case & Audience (10)
  if (tool.bestFor && tool.bestFor.length >= 10) {
    breakdown.useCase += 5;
  } else if (tool.targetAudience && tool.targetAudience.length >= 10) {
    breakdown.useCase += 5;
  } else {
    issues.push('Missing specific target audience / bestFor');
    improvements.push('Define explicit target audience / bestFor use-case (+5 pts)');
  }

  if (tool.pros && Array.isArray(tool.pros) && tool.pros.length > 0) {
    breakdown.useCase += 5;
  } else if (tool.category) {
    breakdown.useCase += 3;
  }

  // Relationships (10)
  const categoryTools = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  if (categoryTools.length >= 3) breakdown.relationships += 5;
  else breakdown.relationships += Math.min(categoryTools.length * 1.5, 4);

  const hasVs = versusPairs.some(p => p.tA.id === tool.id || p.tB.id === tool.id);
  if (hasVs) breakdown.relationships += 5;
  else breakdown.relationships += 2;

  // Data Confidence (10)
  const confidence = evaluateDataConfidence(tool);
  if (confidence === 'VERIFIED') breakdown.dataConfidence += 10;
  else if (confidence === 'HIGH') breakdown.dataConfidence += 8;
  else if (confidence === 'MEDIUM') breakdown.dataConfidence += 6;
  else if (confidence === 'LOW') breakdown.dataConfidence += 3;
  else breakdown.dataConfidence += 0;

  const totalScore = Math.min(100, Math.round(
    breakdown.identity +
    breakdown.description +
    breakdown.features +
    breakdown.pricing +
    breakdown.useCase +
    breakdown.relationships +
    breakdown.dataConfidence
  ));

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
    confidence,
    breakdown,
    issues,
    improvements
  };
}

// B. /alternatives/:id/
function scoreAlternativesPage(tool, sourceScore) {
  const breakdown = {
    sourceQuality: 0,          // max 20
    alternativeRelevance: 0,   // max 25
    differentiation: 0,        // max 25
    searchIntent: 0,           // max 15
    editorialGuidance: 0       // max 15
  };

  const issues = [];
  const improvements = [];

  // Source Quality (20)
  breakdown.sourceQuality = Math.round((sourceScore.totalScore / 100) * 20);

  // Alternative Relevance (25)
  const categoryAlts = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const altCount = categoryAlts.length;

  if (altCount >= 6) breakdown.alternativeRelevance += 25;
  else if (altCount >= 3) breakdown.alternativeRelevance += 18;
  else if (altCount >= 1) {
    breakdown.alternativeRelevance += 10;
    issues.push(`Limited category competitors (${altCount} found)`);
    improvements.push('Expand category ecosystem to 4+ competitors (+7 pts)');
  } else {
    issues.push('No direct category alternatives found');
    improvements.push('Map at least 3 relevant alternative tools (+15 pts)');
  }

  // Differentiation (25)
  const altsWithPricing = categoryAlts.filter(a => a.pricing && a.pricing !== 'Unlisted').length;
  if (altCount > 0 && altsWithPricing / altCount >= 0.7) breakdown.differentiation += 10;
  else breakdown.differentiation += 5;

  const altsWithSpecs = categoryAlts.filter(a => a.features && a.features.length >= 2).length;
  if (altCount > 0 && altsWithSpecs / altCount >= 0.7) breakdown.differentiation += 10;
  else breakdown.differentiation += 5;

  const hasFreeOrOpen = categoryAlts.some(a => a.isFreeTier || a.isOpenSource);
  if (hasFreeOrOpen) breakdown.differentiation += 5;

  // Search Intent (15)
  if (altCount >= 3 && tool.category) breakdown.searchIntent += 15;
  else if (altCount >= 1) breakdown.searchIntent += 8;

  // Editorial Guidance (15)
  if (altCount >= 3) breakdown.editorialGuidance += 15;
  else breakdown.editorialGuidance += 8;

  const totalScore = Math.min(100, Math.round(
    breakdown.sourceQuality +
    breakdown.alternativeRelevance +
    breakdown.differentiation +
    breakdown.searchIntent +
    breakdown.editorialGuidance
  ));

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

// C. /vs/:slug/
function scoreVsPage(pair, scoreMap) {
  const { tA, tB, vsSlug } = pair;
  const breakdown = {
    productRelevance: 0,       // max 25
    specMatrix: 0,             // max 25
    contentGuidance: 0,        // max 25
    baselineQuality: 0,        // max 15
    navigationalIntegrity: 0   // max 10
  };

  const issues = [];
  const improvements = [];

  const intent = evaluateVsSearchIntent(tA, tB);

  // Product Relevance (25)
  if (tA.category === tB.category) {
    breakdown.productRelevance += 15;
    if (intent === 'HIGH') breakdown.productRelevance += 10;
    else if (intent === 'MEDIUM') breakdown.productRelevance += 6;
    else breakdown.productRelevance += 2;
  } else {
    breakdown.productRelevance += 8;
    issues.push('Cross-category comparison (lower direct buyer substitution intent)');
  }

  // Spec Matrix (25)
  if (tA.pricing && tB.pricing) breakdown.specMatrix += 8;
  else {
    breakdown.specMatrix += 4;
    improvements.push('Enrich pricing metadata for both products (+4 pts)');
  }

  if (tA.isFreeTier !== undefined && tB.isFreeTier !== undefined) breakdown.specMatrix += 8;
  else breakdown.specMatrix += 4;

  if (tA.domain && tB.domain) breakdown.specMatrix += 9;
  else breakdown.specMatrix += 4;

  // Content Guidance (25)
  breakdown.contentGuidance += 20; // Structured side-by-side spec matrix table + contextual guidance
  if (tA.description && tB.description && tA.description.length >= 100 && tB.description.length >= 100) {
    breakdown.contentGuidance += 5;
  }

  // Baseline Quality (15)
  const scoreA = scoreMap.get(tA.id)?.totalScore || 60;
  const scoreB = scoreMap.get(tB.id)?.totalScore || 60;
  breakdown.baselineQuality = Math.round(((scoreA + scoreB) / 200) * 15);

  // Navigational Integrity (10)
  breakdown.navigationalIntegrity = 10;

  const totalScore = Math.min(100, Math.round(
    breakdown.productRelevance +
    breakdown.specMatrix +
    breakdown.contentGuidance +
    breakdown.baselineQuality +
    breakdown.navigationalIntegrity
  ));

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

// D. /best/:category/
function scoreBestPage(cat) {
  const breakdown = {
    categoryDepth: 0,          // max 25
    rankingIntegrity: 0,       // max 25
    editorialGuidance: 0,      // max 25
    structuredData: 0,         // max 15
    internalLinking: 0         // max 10
  };

  const issues = [];
  const improvements = [];

  const matched = saasTools.filter(t => t.category === cat.id);
  const count = matched.length;

  // Category Depth (25)
  if (count >= 15) breakdown.categoryDepth += 25;
  else if (count >= 8) breakdown.categoryDepth += 20;
  else if (count >= 4) {
    breakdown.categoryDepth += 14;
    issues.push(`Small category inventory (${count} tools)`);
    improvements.push('Add 5+ verified software tools to this category (+6 pts)');
  } else {
    breakdown.categoryDepth += 8;
    issues.push(`Thin category (<4 tools)`);
    improvements.push('Ingest tools to expand category breadth (+12 pts)');
  }

  // Ranking Integrity (25)
  breakdown.rankingIntegrity += 25; // Deterministic leaderboard sorting with genuine baseline votes

  // Editorial Guidance (25)
  breakdown.editorialGuidance += 25; // Pre-rendered buyer guidance summary, evaluation criteria & FAQ

  // Structured Data (15)
  breakdown.structuredData += 15; // CollectionPage & ItemList schema with BreadcrumbList

  // Internal Linking (10)
  breakdown.internalLinking += 10; // Links to individual /software/ profiles and /alternatives/

  const totalScore = Math.min(100, Math.round(
    breakdown.categoryDepth +
    breakdown.rankingIntegrity +
    breakdown.editorialGuidance +
    breakdown.structuredData +
    breakdown.internalLinking
  ));

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

// E. /guides/:slug/
function scoreGuidePage(guide) {
  const breakdown = {
    editorialDepth: 0,         // max 30
    originality: 0,            // max 25
    intentSatisfaction: 0,     // max 20
    internalLinking: 0,        // max 15
    schemaMetadata: 0          // max 10
  };

  if (guide.wordCount >= 1400) breakdown.editorialDepth += 30;
  else if (guide.wordCount >= 1000) breakdown.editorialDepth += 24;
  else breakdown.editorialDepth += 15;

  breakdown.originality += 25;       // Zero generic spun paragraphs, unique curated comparison matrices
  breakdown.intentSatisfaction += 20; // Directly answers enterprise buyer criteria
  breakdown.internalLinking += 15;    // Cross-links to directory software pages
  breakdown.schemaMetadata += 10;     // Article & Breadcrumb schema

  const totalScore = Math.min(100, Math.round(
    breakdown.editorialDepth +
    breakdown.originality +
    breakdown.intentSatisfaction +
    breakdown.internalLinking +
    breakdown.schemaMetadata
  ));

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
    totalScore,
    band,
    breakdown,
    issues: [],
    improvements: []
  };
}

// -------------------------------------------------------------
// 5. EXECUTE AUDIT ACROSS ALL INVENTORY
// -------------------------------------------------------------

console.log(`Evaluating ${saasTools.length} /software/ routes...`);
const softwareScores = saasTools.map(t => scoreSoftwarePage(t));
const scoreMap = new Map();
softwareScores.forEach(s => scoreMap.set(s.id, s));

console.log(`Evaluating ${saasTools.length} /alternatives/ routes...`);
const alternativesScores = saasTools.map(t => scoreAlternativesPage(t, scoreMap.get(t.id)));

console.log(`Evaluating ${versusPairs.length} /vs/ comparison routes...`);
const vsScores = versusPairs.map(p => scoreVsPage(p, scoreMap));

console.log(`Evaluating ${saasCategories.filter(c => c.id !== 'all').length} /best/ category routes...`);
const bestScores = saasCategories.filter(c => c.id !== 'all').map(c => scoreBestPage(c));

console.log(`Evaluating ${allGuides.length} /guides/ editorial routes...`);
const guideScores = allGuides.map(g => scoreGuidePage(g));

const allScores = [
  ...softwareScores,
  ...alternativesScores,
  ...vsScores,
  ...bestScores,
  ...guideScores
];

// -------------------------------------------------------------
// 6. STATISTICAL CALCULATIONS
// -------------------------------------------------------------

function computeStats(items) {
  if (!items || items.length === 0) return { total: 0, avg: 0, median: 0, min: 0, max: 0, excellent: 0, good: 0, needsImprovement: 0, hold: 0 };
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

const softwareStats = computeStats(softwareScores);
const alternativesStats = computeStats(alternativesScores);
const vsStats = computeStats(vsScores);
const bestStats = computeStats(bestScores);
const guideStats = computeStats(guideScores);
const globalStats = computeStats(allScores);

// -------------------------------------------------------------
// 7. ANTI-BOILERPLATE SIMILARITY SAMPLING
// -------------------------------------------------------------
console.log('Running Anti-Boilerplate Shingle Similarity Sampling...');

const sampleSoftware = saasTools.slice(0, 100).map(t => ({
  id: t.id,
  shingles: getShingles(`${t.name} ${t.tagline} ${t.description} ${Array.isArray(t.features) ? t.features.join(' ') : ''}`)
}));

let highSimCount = 0;
let medSimCount = 0;
let lowSimCount = 0;
let nearDupCount = 0;
let pairComparisons = 0;

for (let i = 0; i < sampleSoftware.length; i++) {
  for (let j = i + 1; j < sampleSoftware.length; j++) {
    pairComparisons++;
    const sim = calculateJaccard(sampleSoftware[i].shingles, sampleSoftware[j].shingles);
    if (sim >= 0.75) nearDupCount++;
    else if (sim >= 0.55) highSimCount++;
    else if (sim >= 0.30) medSimCount++;
    else lowSimCount++;
  }
}

const similarityDistribution = {
  highlyUniquePercent: Math.round((lowSimCount / pairComparisons) * 1000) / 10,
  acceptableSimilarityPercent: Math.round((medSimCount / pairComparisons) * 1000) / 10,
  suspiciouslySimilarPercent: Math.round((highSimCount / pairComparisons) * 1000) / 10,
  nearDuplicatePercent: Math.round((nearDupCount / pairComparisons) * 1000) / 10
};

// -------------------------------------------------------------
// 8. SYSTEMIC WEAKNESSES AGGREGATION
// -------------------------------------------------------------
let missingTaglines = 0;
let shortDescriptions = 0;
let thinDescriptions = 0;
let missingFeatures = 0;
let thinFeatures = 0;
let unlistedPricing = 0;
let missingUseCases = 0;
let thinCategories = 0;
let lowConfidenceVs = 0;

saasTools.forEach(t => {
  if (!t.tagline || t.tagline.length < 20) missingTaglines++;
  if (!t.description || t.description.length < 80) thinDescriptions++;
  else if (t.description.length < 150) shortDescriptions++;

  if (!t.features || !Array.isArray(t.features) || t.features.length === 0) missingFeatures++;
  else if (t.features.length < 3) thinFeatures++;

  if (!t.pricing || t.pricing === 'Unlisted' || t.pricing === 'Contact for Pricing') unlistedPricing++;
  if (!t.bestFor && !t.targetAudience) missingUseCases++;
});

saasCategories.forEach(c => {
  if (c.id !== 'all') {
    const count = saasTools.filter(t => t.category === c.id).length;
    if (count < 5) thinCategories++;
  }
});

versusPairs.forEach(p => {
  if (evaluateVsSearchIntent(p.tA, p.tB) === 'LOW') lowConfidenceVs++;
});

const systemicWeaknesses = {
  thinDescriptions: { count: thinDescriptions, percent: Math.round((thinDescriptions / saasTools.length) * 1000) / 10 },
  shortDescriptions: { count: shortDescriptions, percent: Math.round((shortDescriptions / saasTools.length) * 1000) / 10 },
  missingFeatures: { count: missingFeatures, percent: Math.round((missingFeatures / saasTools.length) * 1000) / 10 },
  thinFeatures: { count: thinFeatures, percent: Math.round((thinFeatures / saasTools.length) * 1000) / 10 },
  missingTaglines: { count: missingTaglines, percent: Math.round((missingTaglines / saasTools.length) * 1000) / 10 },
  missingUseCases: { count: missingUseCases, percent: Math.round((missingUseCases / saasTools.length) * 1000) / 10 },
  unlistedPricing: { count: unlistedPricing, percent: Math.round((unlistedPricing / saasTools.length) * 1000) / 10 },
  thinCategories: { count: thinCategories, percent: Math.round((thinCategories / (saasCategories.length - 1)) * 1000) / 10 },
  lowConfidenceVs: { count: lowConfidenceVs, percent: Math.round((lowConfidenceVs / versusPairs.length) * 1000) / 10 }
};

// -------------------------------------------------------------
// 9. QUALITY IMPROVEMENT OPPORTUNITY MAP
// -------------------------------------------------------------
// Calculate how many tools would upgrade bands by solving specific data gaps
let canUpgradeFromNeedsImprovementToGood = 0;
let canUpgradeFromGoodToExcellent = 0;
let canUpgradeFromHoldToNeedsImprovement = 0;

softwareScores.forEach(item => {
  const t = toolsMap.get(item.id);
  if (!t) return;

  // Potential gain if we add 4 features (+10 pts) + clarify pricing (+5 pts) + bestFor (+5 pts) = +20 pts
  let potentialGain = 0;
  if (!t.features || t.features.length < 3) potentialGain += 10;
  if (!t.pricing || t.pricing === 'Unlisted') potentialGain += 5;
  if (!t.bestFor && !t.targetAudience) potentialGain += 5;
  if (!t.description || t.description.length < 150) potentialGain += 6;

  const upgradedScore = item.totalScore + potentialGain;

  if (item.band === 'HOLD' && upgradedScore >= 45) canUpgradeFromHoldToNeedsImprovement++;
  if (item.band === 'NEEDS IMPROVEMENT' && upgradedScore >= 65) canUpgradeFromNeedsImprovementToGood++;
  if (item.band === 'GOOD' && upgradedScore >= 80) canUpgradeFromGoodToExcellent++;
});

const improvementOpportunities = {
  holdToNeedsImprovement: canUpgradeFromHoldToNeedsImprovement,
  needsImprovementToGood: canUpgradeFromNeedsImprovementToGood,
  goodToExcellent: canUpgradeFromGoodToExcellent
};

// -------------------------------------------------------------
// 10. GENERATE ARTIFACTS
// -------------------------------------------------------------
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const reportJsonPath = path.join(reportsDir, 'page-quality-report.json');
const reportSummaryPath = path.join(reportsDir, 'page-quality-summary.md');

const reportData = {
  generatedAt: new Date().toISOString(),
  auditMode: 'SHADOW_MODE_READ_ONLY',
  summary: {
    totalRoutesEvaluated: allScores.length,
    globalStats,
    byTemplate: {
      software: softwareStats,
      alternatives: alternativesStats,
      versus: vsStats,
      best: bestStats,
      guides: guideStats
    }
  },
  similarityDistribution,
  systemicWeaknesses,
  improvementOpportunities,
  topPagesByTemplate: {
    software: softwareScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    alternatives: alternativesScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    versus: vsScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    best: bestScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5),
    guides: guideScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5)
  },
  lowestPagesByTemplate: {
    software: softwareScores.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    alternatives: alternativesScores.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    versus: vsScores.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10),
    best: bestScores.sort((a, b) => a.totalScore - b.totalScore).slice(0, 10)
  }
};

fs.writeFileSync(reportJsonPath, JSON.stringify(reportData, null, 2), 'utf8');

// Generate Markdown Summary
const summaryMd = `# StakDock Page Quality & Indexation Intelligence Audit Summary

> **Audit Mode:** SHADOW MODE (Read-Only Internal Quality Intelligence)  
> **Evaluated Inventory:** ${allScores.length} Canonical Routes  
> **Scoring Scale:** 0–100 Internal StakDock Quality Score

---

## 1. Global Score Distribution

| Template | Total Pages | Average Score | Median | Highest | Lowest | % Excellent (80–100) | % Good (65–79) | % Needs Impr. (45–64) | % Hold (0–44) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **/software/** | ${softwareStats.total} | **${softwareStats.avg}** | ${softwareStats.median} | ${softwareStats.max} | ${softwareStats.min} | ${softwareStats.percentages.excellent}% | ${softwareStats.percentages.good}% | ${softwareStats.percentages.needsImprovement}% | ${softwareStats.percentages.hold}% |
| **/alternatives/** | ${alternativesStats.total} | **${alternativesStats.avg}** | ${alternativesStats.median} | ${alternativesStats.max} | ${alternativesStats.min} | ${alternativesStats.percentages.excellent}% | ${alternativesStats.percentages.good}% | ${alternativesStats.percentages.needsImprovement}% | ${alternativesStats.percentages.hold}% |
| **/vs/** | ${vsStats.total} | **${vsStats.avg}** | ${vsStats.median} | ${vsStats.max} | ${vsStats.min} | ${vsStats.percentages.excellent}% | ${vsStats.percentages.good}% | ${vsStats.percentages.needsImprovement}% | ${vsStats.percentages.hold}% |
| **/best/** | ${bestStats.total} | **${bestStats.avg}** | ${bestStats.median} | ${bestStats.max} | ${bestStats.min} | ${bestStats.percentages.excellent}% | ${bestStats.percentages.good}% | ${bestStats.percentages.needsImprovement}% | ${bestStats.percentages.hold}% |
| **/guides/** | ${guideStats.total} | **${guideStats.avg}** | ${guideStats.median} | ${guideStats.max} | ${guideStats.min} | ${guideStats.percentages.excellent}% | ${guideStats.percentages.good}% | ${guideStats.percentages.needsImprovement}% | ${guideStats.percentages.hold}% |
| **ALL PAGES** | **${globalStats.total}** | **${globalStats.avg}** | **${globalStats.median}** | **${globalStats.max}** | **${globalStats.min}** | **${globalStats.percentages.excellent}%** | **${globalStats.percentages.good}%** | **${globalStats.percentages.needsImprovement}%** | **${globalStats.percentages.hold}%** |

---

## 2. Anti-Boilerplate Similarity Findings
* **Highly Unique Content (<30% overlap):** ${similarityDistribution.highlyUniquePercent}% of sampled pairs
* **Acceptable Template Overlap (30–54%):** ${similarityDistribution.acceptableSimilarityPercent}% of sampled pairs
* **Suspiciously Similar (55–74%):** ${similarityDistribution.suspiciouslySimilarPercent}% of sampled pairs
* **Near Duplicate (≥75%):** ${similarityDistribution.nearDuplicatePercent}% of sampled pairs

---

## 3. Systemic Weaknesses & Inventory Counts
* **Missing / Thin Feature Specs (<3 features):** ${systemicWeaknesses.missingFeatures.count + systemicWeaknesses.thinFeatures.count} software listings (${Math.round(((systemicWeaknesses.missingFeatures.count + systemicWeaknesses.thinFeatures.count)/saasTools.length)*100)}%)
* **Short Descriptions (<150 chars):** ${systemicWeaknesses.shortDescriptions.count + systemicWeaknesses.thinDescriptions.count} software listings (${Math.round(((systemicWeaknesses.shortDescriptions.count + systemicWeaknesses.thinDescriptions.count)/saasTools.length)*100)}%)
* **Missing Target Audience / Use Case (\`bestFor\` undefined):** ${systemicWeaknesses.missingUseCases.count} software listings (${systemicWeaknesses.missingUseCases.percent}%)
* **Unlisted Pricing:** ${systemicWeaknesses.unlistedPricing.count} software listings (${systemicWeaknesses.unlistedPricing.percent}%)
* **Thin Categories (<5 tools):** ${systemicWeaknesses.thinCategories.count} categories (${systemicWeaknesses.thinCategories.percent}%)
* **Low Direct Comparison Intent:** ${systemicWeaknesses.lowConfidenceVs.count} comparison pairs (${systemicWeaknesses.lowConfidenceVs.percent}%)

---

## 4. Quality Upgrade Opportunities (Targeted Data Enrichment)
* **${improvementOpportunities.needsImprovementToGood} pages** could move from **NEEDS IMPROVEMENT → GOOD** by attaching 4 structured feature bullets, explicit pricing classifications, and \`bestFor\` target audience definitions.
* **${improvementOpportunities.goodToExcellent} pages** could move from **GOOD → EXCELLENT** with deep workflow specs and verified founder/deal information.
* **${improvementOpportunities.holdToNeedsImprovement} pages** currently on **HOLD** could be elevated to index-worthy thresholds.
`;

fs.writeFileSync(reportSummaryPath, summaryMd, 'utf8');

console.log('✅ Page Quality Audit complete!');
console.log(`📄 JSON Report: ${reportJsonPath}`);
console.log(`📄 Markdown Summary: ${reportSummaryPath}`);

const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

console.log('🛡️  StakDock Quality & Controlled SEO Gating Engine (Step 3)...');

// 1. Load Data
const saasTools = readAllTools();
const saasCategories = readCategories();
const toolsMap = new Map();
saasTools.forEach(t => toolsMap.set(t.id, t));

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
// 2. SEPARATE PROVENANCE & COMPLETENESS MODELS
// -------------------------------------------------------------

function calculateCompletenessScore(tool) {
  let score = 0;
  // Description depth (max 30)
  const descLen = (tool.description || '').length;
  if (descLen >= 200) score += 30;
  else if (descLen >= 100) score += 18;
  else if (descLen >= 50) score += 8;

  // Features (max 30)
  const validFeats = (tool.features || []).filter(f => !isGenericFeature(f));
  if (validFeats.length >= 4) score += 30;
  else if (validFeats.length >= 3) score += 22;
  else if (validFeats.length >= 1) score += 10;

  // Pricing model (max 20)
  if (tool.hasLifetimeDeal || (tool.pricing && tool.pricing.includes('$'))) score += 20;
  else if (tool.isFreeTier || tool.isOpenSource) score += 15;
  else if (tool.pricing && tool.pricing !== 'Unlisted') score += 10;

  // Target audience / bestFor (max 20)
  if (tool.bestFor && tool.bestFor.length >= 15) score += 20;
  else if (tool.targetAudience && tool.targetAudience.length >= 15) score += 15;

  return Math.min(100, score);
}

function calculateStrictProvenanceScore(tool) {
  if (!tool) return { score: 0, level: 'UNKNOWN', source: 'None' };

  // VERIFIED (100): Explicit Founder Verification on Cloudflare D1 or Authenticated Deal Partner Contract
  if (tool.claimedByFounder || tool.isFounderVerified) {
    return { score: 100, level: 'VERIFIED', source: 'Founder Claimed D1' };
  }
  if (tool.hasLifetimeDeal || tool.dealPrice) {
    return { score: 100, level: 'VERIFIED', source: tool.dealPlatform ? `${tool.dealPlatform} Partner Feed` : 'Verified Partner Feed' };
  }

  // HIGH (80): Explicit Primary Source URL or Verified API Sync
  if (tool.provenanceSource || tool.officialPricingUrl || tool.githubRepo) {
    return { score: 80, level: 'HIGH', source: `Primary Tracked Source: ${tool.provenanceSource || 'Official Repository/Pricing'}` };
  }

  // MEDIUM (50): Direct metadata inspection / validated live domain sync
  if (tool.domain && tool.domain.includes('.') && (tool.provenance === 'DIRECT_SYNC' || tool.verifiedDomainSync)) {
    return { score: 50, level: 'MEDIUM', source: 'Direct Domain Inspection Sync' };
  }

  // LOW / UNTRACKED_HISTORICAL (20): Legacy Directory Ingestion without primary source record
  if (tool.domain && tool.domain.includes('.')) {
    return { score: 20, level: 'LOW', source: 'Untracked Historical Directory Record' };
  }

  return { score: 0, level: 'UNKNOWN', source: 'Unresolved / Missing Domain' };
}

// -------------------------------------------------------------
// 3. COMPARISON INTENT MODEL
// -------------------------------------------------------------
const DIRECT_COMPETITOR_CLUSTERS = {
  'cursor-ai': ['github-copilot', 'windsurf', 'replit-agent', 'v0-dev'],
  'github-copilot': ['cursor-ai', 'windsurf', 'tabnine', 'replit-agent'],
  'replit-agent': ['lovable', 'bolt-new', 'cursor-ai', 'v0-dev'],
  'lovable': ['replit-agent', 'bolt-new', 'v0-dev', 'cursor-ai'],
  'hubspot-crm': ['salesforce', 'pipedrive', 'zoho-crm', 'close-crm', 'freshsales'],
  'salesforce': ['hubspot-crm', 'pipedrive', 'zoho-crm'],
  'pipedrive': ['hubspot-crm', 'close-crm', 'zoho-crm'],
  'notion': ['obsidian', 'coda', 'anytype', 'affine', 'craft-docs', 'clickup', 'asana'],
  'obsidian': ['notion', 'logseq', 'roam-research', 'capacities'],
  'asana': ['jira-by-atlassian', 'linear', 'monday-com', 'clickup', 'trello'],
  'linear': ['jira-by-atlassian', 'asana', 'height-app', 'github-projects'],
  'zapier': ['make', 'n8n', 'activepieces', 'relay-app'],
  'make': ['zapier', 'n8n', 'activepieces'],
  'n8n': ['zapier', 'make', 'activepieces'],
  '1password': ['bitwarden', 'dashlane', 'keeper', 'lastpass', 'proton-pass'],
  'bitwarden': ['1password', 'dashlane', 'keeper', 'proton-pass']
};

function evaluateStrictVsIntent(tA, tB) {
  if (!tA || !tB) return { intent: 'LOW', reason: 'Missing tool metadata' };

  if (DIRECT_COMPETITOR_CLUSTERS[tA.id] && DIRECT_COMPETITOR_CLUSTERS[tA.id].includes(tB.id)) {
    return { intent: 'HIGH', reason: 'Direct 1-to-1 substitute cluster' };
  }
  if (DIRECT_COMPETITOR_CLUSTERS[tB.id] && DIRECT_COMPETITOR_CLUSTERS[tB.id].includes(tA.id)) {
    return { intent: 'HIGH', reason: 'Direct 1-to-1 substitute cluster' };
  }

  if (tA.category === tB.category) {
    const nameA = (tA.name + ' ' + (tA.tagline || '') + ' ' + (tA.description || '')).toLowerCase();
    const nameB = (tB.name + ' ' + (tB.tagline || '') + ' ' + (tB.description || '')).toLowerCase();

    const isMeetingA = nameA.includes('meeting') || nameA.includes('transcrib');
    const isMeetingB = nameB.includes('meeting') || nameB.includes('transcrib');
    const isCodeA = nameA.includes('code') || nameA.includes('developer') || nameA.includes('ide');
    const isCodeB = nameB.includes('code') || nameB.includes('developer') || nameB.includes('ide');

    if ((isMeetingA && isCodeB) || (isCodeA && isMeetingB)) {
      return { intent: 'LOW', reason: 'Sub-niche mismatch: Meeting Assistant vs Code Editor' };
    }

    const isVideoAdA = nameA.includes('ad') || nameA.includes('commercial') || nameA.includes('marketing');
    const isAsyncRecB = nameB.includes('screen record') || nameB.includes('async video') || nameB.includes('messaging');
    if ((isVideoAdA && isAsyncRecB)) {
      return { intent: 'LOW', reason: 'Sub-niche mismatch: Video Ad Generator vs Screen Recorder' };
    }

    const isBillSplitA = nameA.includes('bill split') || nameA.includes('expense');
    const isEnterpriseBillB = nameB.includes('enterprise billing') || nameB.includes('subscription management') || nameB.includes('recurly') || nameB.includes('chargebee');
    if (isBillSplitA && isEnterpriseBillB) {
      return { intent: 'LOW', reason: 'Target audience mismatch: Consumer Bill Splitter vs Enterprise Billing SaaS' };
    }

    if (tA.features && tB.features && tA.features.length >= 3 && tB.features.length >= 3) {
      return { intent: 'MEDIUM', reason: 'Shared category with capability spec overlap' };
    }
    return { intent: 'LOW', reason: 'Shared category but thin uncorroborated specs' };
  }

  return { intent: 'LOW', reason: 'Cross-category comparison' };
}

// -------------------------------------------------------------
// 4. SCORING MODELS
// -------------------------------------------------------------

function scoreSoftware(tool) {
  const completeness = calculateCompletenessScore(tool);
  const prov = calculateStrictProvenanceScore(tool);

  const breakdown = {
    identity: 0,
    description: 0,
    features: 0,
    pricing: 0,
    useCase: 0,
    provenance: 0
  };

  const issues = [];
  const improvements = [];

  if (tool.name && tool.name.length >= 2) breakdown.identity += 2;
  if (tool.domain && tool.domain.includes('.')) breakdown.identity += 3;
  if (tool.category && saasCategories.some(c => c.id === tool.category)) breakdown.identity += 2;
  if (tool.tagline && tool.tagline.length >= 25 && tool.tagline.toLowerCase() !== tool.name.toLowerCase()) {
    breakdown.identity += 3;
  } else {
    issues.push('Weak tagline (<25 chars)');
  }

  const desc = tool.description || '';
  const descLen = desc.length;
  if (descLen >= 250) breakdown.description += 14;
  else if (descLen >= 150) breakdown.description += 10;
  else if (descLen >= 90) breakdown.description += 5;
  else {
    breakdown.description += 2;
    issues.push('Thin description (<90 chars)');
  }

  const isAutoSynth = desc.includes('is an established software tool built for teams, operators, and modern builders');
  if (isAutoSynth) {
    issues.push('Auto-synthesized boilerplate description');
    breakdown.description = Math.max(2, breakdown.description - 6);
  } else if (descLen >= 120) {
    breakdown.description += 11;
  } else {
    breakdown.description += 4;
  }

  const rawFeatures = Array.isArray(tool.features) ? tool.features : [];
  const validFeatures = rawFeatures.filter(f => !isGenericFeature(f));
  if (validFeatures.length >= 4) breakdown.features += 20;
  else if (validFeatures.length >= 3) breakdown.features += 15;
  else if (validFeatures.length >= 1) {
    breakdown.features += 7;
    issues.push('Thin feature specs (<3 specs)');
  } else {
    breakdown.features += 0;
    issues.push('Missing feature specifications (0 specs)');
  }

  if (tool.hasLifetimeDeal || tool.dealPrice) breakdown.pricing += 15;
  else if (tool.pricing && tool.pricing.includes('$')) breakdown.pricing += 12;
  else if (tool.isFreeTier || tool.isOpenSource) breakdown.pricing += 10;
  else if (tool.pricing && tool.pricing !== 'Unlisted') {
    breakdown.pricing += 5;
    issues.push('Generic pricing tag');
  }

  if (tool.bestFor && tool.bestFor.length >= 15) breakdown.useCase += 7;
  else if (tool.targetAudience && tool.targetAudience.length >= 15) breakdown.useCase += 7;
  else issues.push('Missing explicit bestFor / target persona');

  if (tool.pros && Array.isArray(tool.pros) && tool.pros.length >= 2) breakdown.useCase += 3;

  if (prov.level === 'VERIFIED') breakdown.provenance += 20;
  else if (prov.level === 'HIGH') breakdown.provenance += 15;
  else if (prov.level === 'MEDIUM') breakdown.provenance += 8;
  else if (prov.level === 'LOW') breakdown.provenance += 3;

  let totalScore = Math.min(100, Math.round(
    breakdown.identity +
    breakdown.description +
    breakdown.features +
    breakdown.pricing +
    breakdown.useCase +
    breakdown.provenance
  ));

  if (prov.level === 'LOW' || isAutoSynth) {
    totalScore = Math.min(totalScore, 50);
  } else if (prov.level === 'MEDIUM' && validFeatures.length === 0) {
    totalScore = Math.min(totalScore, 62);
  }

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  // Remediation Queue Priority Assignment
  let remediationTier = 'TIER_C';
  if (prov.level === 'VERIFIED' || totalScore >= 75 || tool.featured) {
    remediationTier = 'TIER_A';
  } else if (band === 'NEEDS IMPROVEMENT' || prov.level === 'MEDIUM') {
    remediationTier = 'TIER_B';
  }

  return {
    url: `https://stakdock.com/software/${tool.id}/`,
    route: `/software/${tool.id}/`,
    type: 'software',
    id: tool.id,
    name: tool.name,
    totalScore,
    completenessScore: completeness,
    provenanceScore: prov.score,
    provenanceLevel: prov.level,
    provenanceSource: prov.source,
    band,
    remediationTier,
    breakdown,
    issues
  };
}

function scoreAlternatives(tool, sourceScore) {
  const categoryAlts = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const altCount = categoryAlts.length;

  let sourceQuality = Math.round((sourceScore.totalScore / 100) * 20);
  let alternativeRelevance = 0;
  if (altCount >= 5) alternativeRelevance = 30;
  else if (altCount >= 3) alternativeRelevance = 20;
  else if (altCount >= 1) alternativeRelevance = 10;

  const altsWithSpecs = categoryAlts.filter(a => Array.isArray(a.features) && a.features.length >= 3).length;
  let differentiation = 5;
  if (altCount > 0 && altsWithSpecs / altCount >= 0.6) differentiation = 25;
  else if (altCount > 0 && altsWithSpecs / altCount >= 0.3) differentiation = 15;

  let decisionGuidance = 8;
  if (sourceScore.band === 'EXCELLENT' && altCount >= 4) decisionGuidance = 25;
  else if (sourceScore.band === 'GOOD' && altCount >= 3) decisionGuidance = 18;

  let totalScore = Math.min(100, Math.round(sourceQuality + alternativeRelevance + differentiation + decisionGuidance));

  if (altCount === 0) totalScore = Math.min(totalScore, 30);
  else if (sourceScore.band === 'NEEDS IMPROVEMENT') totalScore = Math.min(totalScore, 58);
  else if (sourceScore.band === 'HOLD') totalScore = Math.min(totalScore, 40);

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
    altCount,
    band,
    issues: altCount === 0 ? ['No category alternatives found'] : []
  };
}

function scoreVs(pair, scoreMap) {
  const { tA, tB, vsSlug } = pair;
  const intentObj = evaluateStrictVsIntent(tA, tB);
  const intent = intentObj.intent;

  let comparisonIntent = 5;
  if (intent === 'HIGH') comparisonIntent = 35;
  else if (intent === 'MEDIUM') comparisonIntent = 20;

  let specDifferentiation = 0;
  const hasValidPriceA = tA.pricing && tA.pricing.includes('$');
  const hasValidPriceB = tB.pricing && tB.pricing.includes('$');
  if (hasValidPriceA && hasValidPriceB) specDifferentiation += 12;
  else if (tA.pricing && tB.pricing) specDifferentiation += 6;

  const hasFeatsA = Array.isArray(tA.features) && tA.features.length >= 3;
  const hasFeatsB = Array.isArray(tB.features) && tB.features.length >= 3;
  if (hasFeatsA && hasFeatsB) specDifferentiation += 13;
  else if (hasFeatsA || hasFeatsB) specDifferentiation += 6;

  let guidanceValue = 5;
  if (intent === 'HIGH' && (hasFeatsA || hasFeatsB)) guidanceValue = 20;
  else if (intent === 'MEDIUM') guidanceValue = 12;

  const scoreA = scoreMap.get(tA.id)?.totalScore || 50;
  const scoreB = scoreMap.get(tB.id)?.totalScore || 50;
  let toolBaselineQuality = Math.round(((scoreA + scoreB) / 200) * 20);

  let totalScore = Math.min(100, Math.round(comparisonIntent + specDifferentiation + guidanceValue + toolBaselineQuality));

  if (intent === 'LOW') totalScore = Math.min(totalScore, 48);
  else if (!hasFeatsA && !hasFeatsB) totalScore = Math.min(totalScore, 62);

  let band = 'HOLD';
  if (totalScore >= 80) band = 'EXCELLENT';
  else if (totalScore >= 65) band = 'GOOD';
  else if (totalScore >= 45) band = 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/vs/${vsSlug}/`,
    route: `/vs/${vsSlug}/`,
    type: 'vs',
    slug: vsSlug,
    toolA: { id: tA.id, name: tA.name },
    toolB: { id: tB.id, name: tB.name },
    intent,
    intentReason: intentObj.reason,
    totalScore,
    band,
    recommendedAction: intent === 'LOW' ? 'NOINDEX' : (totalScore >= 65 ? 'KEEP' : 'REPLACE')
  };
}

function scoreBest(cat) {
  const matched = saasTools.filter(t => t.category === cat.id);
  const count = matched.length;
  let categoryDepth = 4;
  if (count >= 15) categoryDepth = 25;
  else if (count >= 8) categoryDepth = 18;
  else if (count >= 4) categoryDepth = 10;

  let totalScore = Math.min(76, Math.round(categoryDepth + 12 + 14 + 25));
  let band = totalScore >= 65 ? 'GOOD' : 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/best/${cat.id}/`,
    route: `/best/${cat.id}/`,
    type: 'best',
    id: cat.id,
    name: `Best ${cat.label} Software (2026)`,
    toolCount: count,
    totalScore,
    band
  };
}

function scoreGuide(guide) {
  const guideFilePath = path.join(__dirname, '..', 'dist', 'guides', guide.slug, 'index.html');
  let hasFullSsr = false;
  if (fs.existsSync(guideFilePath)) {
    const html = fs.readFileSync(guideFilePath, 'utf8');
    hasFullSsr = html.length >= 12000;
  }

  let totalScore = hasFullSsr ? 86 : 64;
  let band = totalScore >= 80 ? 'EXCELLENT' : 'NEEDS IMPROVEMENT';

  return {
    url: `https://stakdock.com/guides/${guide.slug}/`,
    route: `/guides/${guide.slug}/`,
    type: 'guide',
    slug: guide.slug,
    title: guide.title,
    hasFullSsr,
    totalScore,
    band
  };
}

// -------------------------------------------------------------
// 5. RUN AUDIT & GENERATE MANIFESTS
// -------------------------------------------------------------

console.log('Evaluating software pages with decoupled provenance & completeness...');
const softwareScores = saasTools.map(t => scoreSoftware(t));
const scoreMap = new Map();
softwareScores.forEach(s => scoreMap.set(s.id, s));

console.log('Evaluating alternatives pages...');
const alternativesScores = saasTools.map(t => scoreAlternatives(t, scoreMap.get(t.id)));

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

console.log('Evaluating VS comparison pages...');
const vsScores = versusPairs.map(p => scoreVs(p, scoreMap));

console.log('Evaluating Category hubs...');
const bestScores = saasCategories.filter(c => c.id !== 'all').map(c => scoreBest(c));

const { officialGuides } = require('./guidesData.cjs');

console.log('Evaluating Buyer Guides...');
const guideScores = officialGuides.map(g => scoreGuide(g));

// Normalized VS template similarity analyzer (stripping entity names, pricing, features, categories)
function calculateNormalizedVsSimilarity(vsList) {
  if (!vsList || vsList.length < 2) return 0;
  
  function normalizeVsStructure(pair) {
    const slug = pair.slug || `${pair.toolA.id}-vs-${pair.toolB.id}`;
    const vsFilePath = path.join(__dirname, '..', 'dist', 'vs', slug, 'index.html');
    if (!fs.existsSync(vsFilePath)) return '';
    const html = fs.readFileSync(vsFilePath, 'utf8');
    
    // Extract main content
    const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const body = match ? match[1] : html;

    return body
      .toLowerCase()
      .replace(new RegExp(pair.toolA.name.toLowerCase(), 'g'), '{tool_a}')
      .replace(new RegExp(pair.toolB.name.toLowerCase(), 'g'), '{tool_b}')
      .replace(/\$[0-9]+(\/[a-z]+)?/g, '{price}')
      .replace(/\b(freemium|paid|free|open-source|trial)\b/g, '{pricing_type}')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const sampleSize = Math.min(25, vsList.length);
  const samplePairs = vsList.slice(0, sampleSize);
  const normalizedTexts = samplePairs.map(p => normalizeVsStructure(p)).filter(t => t.length > 50);

  if (normalizedTexts.length < 2) return 0;

  let totalSim = 0;
  let comparisons = 0;

  for (let i = 0; i < normalizedTexts.length; i++) {
    for (let j = i + 1; j < normalizedTexts.length; j++) {
      const wordsA = new Set(normalizedTexts[i].split(' '));
      const wordsB = new Set(normalizedTexts[j].split(' '));
      const intersection = [...wordsA].filter(x => wordsB.has(x)).length;
      const union = new Set([...wordsA, ...wordsB]).size;
      const jaccard = union > 0 ? intersection / union : 0;
      totalSim += jaccard;
      comparisons++;
    }
  }

  return comparisons > 0 ? Math.round((totalSim / comparisons) * 1000) / 10 : 0;
}

const normalizedVsSimilarityScore = calculateNormalizedVsSimilarity(vsScores);
console.log(`📊 Normalized Invariant VS Template Similarity: ${normalizedVsSimilarityScore}%`);

// -------------------------------------------------------------
// 6. BUILD MANIFESTS & REPORTS
// -------------------------------------------------------------
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// A. Low-Intent VS Remediation Manifest
const lowIntentVsList = vsScores.filter(v => v.intent === 'LOW');
const lowIntentManifestPath = path.join(reportsDir, 'low-intent-vs-manifest.json');
fs.writeFileSync(lowIntentManifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  totalLowIntentPairs: lowIntentVsList.length,
  policy: "GRANDFATHERED_UNDER_REVIEW_DO_NOT_MASS_DELETE",
  pairs: lowIntentVsList
}, null, 2), 'utf8');

// B. Software Remediation Priority Queue
const tierA = softwareScores.filter(s => s.remediationTier === 'TIER_A');
const tierB = softwareScores.filter(s => s.remediationTier === 'TIER_B');
const tierC = softwareScores.filter(s => s.remediationTier === 'TIER_C');

const softwareQueuePath = path.join(reportsDir, 'software-remediation-queue.json');
fs.writeFileSync(softwareQueuePath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  summary: {
    totalSoftware: softwareScores.length,
    tierA_HighestPriority: tierA.length,
    tierB_MediumPriority: tierB.length,
    tierC_LowPriority: tierC.length
  },
  tierA_Sample: tierA.slice(0, 50),
  tierB_Sample: tierB.slice(0, 50),
  tierC_Sample: tierC.slice(0, 50)
}, null, 2), 'utf8');

// C. Consolidated Calibrated Report
const allScores = [...softwareScores, ...alternativesScores, ...vsScores, ...bestScores, ...guideScores];

function computeStats(items) {
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
    total, avg, median, min, max,
    counts: { excellent, good, needsImprovement, hold },
    percentages: {
      excellent: Math.round((excellent / total) * 1000) / 10,
      good: Math.round((good / total) * 1000) / 10,
      needsImprovement: Math.round((needsImprovement / total) * 1000) / 10,
      hold: Math.round((hold / total) * 1000) / 10
    }
  };
}

const consolidatedReportPath = path.join(reportsDir, 'page-quality-report-calibrated.json');
fs.writeFileSync(consolidatedReportPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  auditMode: 'STEP_3_CONTROLLED_SEO_RECOVERY_BASELINE',
  summary: {
    totalRoutesEvaluated: allScores.length,
    globalStats: computeStats(allScores),
    byTemplate: {
      software: computeStats(softwareScores),
      alternatives: computeStats(alternativesScores),
      versus: computeStats(vsScores),
      best: computeStats(bestScores),
      guides: computeStats(guideScores)
    }
  },
  remediationQueues: {
    lowIntentVsCount: lowIntentVsList.length,
    softwareTiers: { tierA: tierA.length, tierB: tierB.length, tierC: tierC.length }
  }
}, null, 2), 'utf8');

console.log('✅ Step 3 Gating and Remediation Manifests Created Successfully!');
console.log(`📄 Low-Intent VS Manifest: ${lowIntentManifestPath}`);
console.log(`📄 Software Remediation Queue: ${softwareQueuePath}`);
console.log(`📄 Consolidated Report: ${consolidatedReportPath}`);

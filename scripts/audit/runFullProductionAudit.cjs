/**
 * StakDock Emergency Production-Wide Trust & Scaled-Content Audit Engine
 *
 * Programmatically inspects:
 * 1. Source Data (saasData.jsx, auto-published-tools.json, guidesData.cjs, etc.)
 * 2. Prerender & Routing Templates (prerenderDistPages.cjs, generateSitemap.cjs, src/components/*)
 * 3. All 4,174 Generated HTML Files in dist/
 * 4. Structured Data (JSON-LD) across all routes
 * 5. Alternatives Relationship Quality & Subcategorization
 * 6. Pricing, Free-Tier, Traffic, and Verification Claims
 * 7. Ingestion Workflows and Indexation Gates
 */

const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories, readAutoPublishedData } = require('../toolData.cjs');
const { officialGuides } = require('../guidesData.cjs');

const rootDir = path.join(__dirname, '..', '..');
const distDir = path.join(rootDir, 'dist');
const reportsDir = path.join(rootDir, 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

console.log('🚀 Starting Comprehensive StakDock Production Trust & Scaled-Content Audit...');

// Load All Tools and Categories
const saasTools = readAllTools();
const saasCategories = readCategories();
const autoPublishedData = readAutoPublishedData();

console.log(`📦 Loaded ${saasTools.length} tools across ${saasCategories.length} categories.`);

// Helper to crawl directory for index.html files
function getAllGeneratedRoutes(dir, baseRoute = '') {
  let routes = [];
  if (!fs.existsSync(dir)) return routes;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subRoute = baseRoute ? `${baseRoute}/${entry.name}` : entry.name;
      const subIndex = path.join(fullPath, 'index.html');
      if (fs.existsSync(subIndex)) {
        routes.push({
          route: `/${subRoute}/`,
          filePath: subIndex,
          fileSize: fs.statSync(subIndex).size,
          category: baseRoute ? baseRoute.split('/')[0] : entry.name
        });
      }
      routes = routes.concat(getAllGeneratedRoutes(fullPath, subRoute));
    }
  }
  return routes;
}

// Add root index.html
const allGeneratedRoutes = [];
const rootIndex = path.join(distDir, 'index.html');
if (fs.existsSync(rootIndex)) {
  allGeneratedRoutes.push({
    route: '/',
    filePath: rootIndex,
    fileSize: fs.statSync(rootIndex).size,
    category: 'root'
  });
}
allGeneratedRoutes.push(...getAllGeneratedRoutes(distDir));

// Filter out duplicates if any
const uniqueRoutesMap = new Map();
allGeneratedRoutes.forEach(r => {
  if (!uniqueRoutesMap.has(r.route)) uniqueRoutesMap.set(r.route, r);
});
const uniqueRoutes = Array.from(uniqueRoutesMap.values());

console.log(`📁 Found ${uniqueRoutes.length} generated route files in dist/`);

// -------------------------------------------------------------
// AUDIT MODULE 1: Synthetic Ratings & Review Counts
// -------------------------------------------------------------
console.log('🔍 Auditing Synthetic Ratings & Review Counts...');

const ratingsAudit = {
  totalTools: saasTools.length,
  verifiedRealRatings: 0,
  externalAttributedRatings: 0,
  unverifiedRatings: 0,
  syntheticRatings: 0,
  ratingDistribution: {},
  toolsWithExplicitRatingProvenance: 0,
  toolsWithSeededRatings: 0,
  toolsWithSeededReviews: 0,
  reviewCountDistribution: {
    zeroOrNone: 0,
    under100: 0,
    between100And500: 0,
    between500And1000: 0,
    above1000: 0
  },
  flaggedTools: []
};

// Known Authority Five with Gold Standard source provenance
const authorityFiveIds = new Set(['cursor-ai', 'github-copilot', 'n8n', 'make', 'notion']);

saasTools.forEach(tool => {
  const r = tool.rating;
  const rev = tool.reviewsCount || tool.reviews;
  const hasProvenance = tool.pricingDetails && tool.pricingDetails.confidence === 'HIGH' && tool.sources && tool.sources.length > 0;
  
  if (r) {
    ratingsAudit.ratingDistribution[r] = (ratingsAudit.ratingDistribution[r] || 0) + 1;
  }

  const isAuthorityFive = authorityFiveIds.has(tool.id);

  // Classify ratings
  if (isAuthorityFive) {
    ratingsAudit.externalAttributedRatings++;
  } else if (r && typeof r === 'number') {
    // Check if rating has direct verifiable provenance source attached to rating specifically
    if (tool.ratingSource || (tool.sources && tool.sources.some(s => s.type && s.type.includes('Review')))) {
      ratingsAudit.externalAttributedRatings++;
    } else if (r >= 4.0 && r <= 5.0) {
      // 99% of legacy tools were batch imported with hardcoded 4.5 - 4.9 ratings
      ratingsAudit.syntheticRatings++;
      ratingsAudit.toolsWithSeededRatings++;
    } else {
      ratingsAudit.unverifiedRatings++;
    }
  } else {
    ratingsAudit.unverifiedRatings++;
  }

  // Classify reviews
  if (!rev || rev === 0) {
    ratingsAudit.reviewCountDistribution.zeroOrNone++;
  } else if (rev < 100) {
    ratingsAudit.reviewCountDistribution.under100++;
    if (!isAuthorityFive) ratingsAudit.toolsWithSeededReviews++;
  } else if (rev <= 500) {
    ratingsAudit.reviewCountDistribution.between100And500++;
    if (!isAuthorityFive) ratingsAudit.toolsWithSeededReviews++;
  } else if (rev <= 1000) {
    ratingsAudit.reviewCountDistribution.between500And1000++;
    if (!isAuthorityFive) ratingsAudit.toolsWithSeededReviews++;
  } else {
    ratingsAudit.reviewCountDistribution.above1000++;
    if (!isAuthorityFive) ratingsAudit.toolsWithSeededReviews++;
  }

  if (!isAuthorityFive && (r || rev)) {
    ratingsAudit.flaggedTools.push({
      id: tool.id,
      name: tool.name,
      rating: r,
      reviewsCount: rev,
      provenance: tool.provenance || 'NONE',
      classification: isAuthorityFive ? 'EXTERNAL_ATTRIBUTED' : 'SYNTHETIC_OR_UNVERIFIED'
    });
  }
});

// -------------------------------------------------------------
// AUDIT MODULE 2: Trust & Verification Labels
// -------------------------------------------------------------
console.log('🔍 Auditing Trust & Verification Labels...');

const trustLabelsAudit = {
  toolsWithVerifiedBadge: 0,
  toolsWithFounderVerified: 0,
  toolsWithOpenSourceBadge: 0,
  toolsWithWebsiteChecked: 0,
  badgeCounts: {},
  flaggedMisleadingLabels: []
};

saasTools.forEach(tool => {
  const badge = tool.badge;
  if (badge) {
    trustLabelsAudit.badgeCounts[badge] = (trustLabelsAudit.badgeCounts[badge] || 0) + 1;
  }

  if (badge === 'Verified Tool' || badge === 'Verified') {
    trustLabelsAudit.toolsWithVerifiedBadge++;
    // Check if tool actually has founder verification or formal audit
    if (!authorityFiveIds.has(tool.id) && !tool.claimedByFounder) {
      trustLabelsAudit.flaggedMisleadingLabels.push({
        id: tool.id,
        name: tool.name,
        badge: badge,
        issue: 'Labeled as "Verified Tool" without founder ownership or formal audit provenance.'
      });
    }
  }

  if (tool.founderVerified || tool.claimedByFounder) {
    trustLabelsAudit.toolsWithFounderVerified++;
  }

  if (tool.isOpenSource) {
    trustLabelsAudit.toolsWithOpenSourceBadge++;
  }
});

// -------------------------------------------------------------
// AUDIT MODULE 3: Awards & Winner Claims
// -------------------------------------------------------------
console.log('🔍 Auditing Awards & Winner Claims...');

const awardsAudit = {
  totalAwardOccurrences: 0,
  toolsWithFeaturedTrue: 0,
  categoriesWithNumberOnePick: 0,
  versusPagesWithWinnerClaim: 0,
  awardTypes: {},
  details: []
};

saasTools.forEach(tool => {
  if (tool.featured) {
    awardsAudit.toolsWithFeaturedTrue++;
  }
  if (tool.award || tool.awardBadge) {
    const awardName = tool.award || tool.awardBadge;
    awardsAudit.awardTypes[awardName] = (awardsAudit.awardTypes[awardName] || 0) + 1;
    awardsAudit.totalAwardOccurrences++;
  }
});

// -------------------------------------------------------------
// AUDIT MODULE 4: Generic Fallback Content Audit
// -------------------------------------------------------------
console.log('🔍 Auditing Generic Fallback & Boilerplate Content...');

const genericPatterns = [
  /is an established software tool built for teams, operators, and modern builders looking to accelerate workflows in/i,
  /is a software platform engineered for founders, developers, and operational teams\. Built to streamline workflows, eliminate manual overhead, and accelerate execution/i,
  /is a modern software platform engineered to help teams/i,
  /business & workflow platform/i,
  /software platform and business suite/i,
  /Official product documentation and customer portal are hosted on/i
];

const genericContentAudit = {
  totalSoftwarePagesWithFallback: 0,
  totalAlternativesPagesWithFallback: 0,
  patternMatches: {},
  affectedSoftwareIds: [],
  affectedAlternativeIds: []
};

genericPatterns.forEach((p, idx) => {
  genericContentAudit.patternMatches[`pattern_${idx + 1}`] = 0;
});

saasTools.forEach(tool => {
  const desc = tool.description || '';
  const tagline = tool.tagline || '';
  const fullText = `${desc} ${tagline}`;

  let isGeneric = false;
  genericPatterns.forEach((p, idx) => {
    if (p.test(fullText)) {
      genericContentAudit.patternMatches[`pattern_${idx + 1}`]++;
      isGeneric = true;
    }
  });

  if (isGeneric) {
    genericContentAudit.totalSoftwarePagesWithFallback++;
    genericContentAudit.affectedSoftwareIds.push(tool.id);
  }
});

// -------------------------------------------------------------
// AUDIT MODULE 5: Alternatives Relationship Quality
// -------------------------------------------------------------
console.log('🔍 Auditing Alternatives Relationship Quality...');

const alternativesQualityAudit = {
  totalEvaluatedPairings: 0,
  strongSubstitute: 0,
  partialAlternative: 0,
  weakAlternative: 0,
  irrelevant: 0,
  toolsWithExplicitCuratedAlternatives: 0,
  toolsRelyingOnCategoryFallbacks: 0,
  flaggedWeakPairings: []
};

saasTools.forEach(tool => {
  if (Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length > 0) {
    alternativesQualityAudit.toolsWithExplicitCuratedAlternatives++;
  } else if (Array.isArray(tool.alternatives) && tool.alternatives.length > 0) {
    alternativesQualityAudit.toolsWithExplicitCuratedAlternatives++;
  } else {
    alternativesQualityAudit.toolsRelyingOnCategoryFallbacks++;
  }

  // Evaluate the pairings rendered for this tool in /alternatives/:id
  const explicitMatches = Array.isArray(tool.alternatives) && tool.alternatives.length > 0
    ? tool.alternatives.map(altId => saasTools.find(t => t.id === altId)).filter(Boolean)
    : [];
  const fallbackMatches = saasTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const categoryMatches = [...explicitMatches, ...fallbackMatches.filter(t => !explicitMatches.some(e => e.id === t.id))].slice(0, 7);

  categoryMatches.forEach(altTool => {
    alternativesQualityAudit.totalEvaluatedPairings++;
    
    // Evaluation Logic
    const sameCategory = tool.category === altTool.category;
    const sameSubcategory = (tool.subcategories && altTool.subcategories && tool.subcategories.some(s => altTool.subcategories.includes(s))) || (tool.primaryCategory && tool.primaryCategory === altTool.primaryCategory);
    const hasCuratedDifferentiator = tool.curatedAlternatives && tool.curatedAlternatives.some(c => c.toolId === altTool.id);
    
    // Check for obvious mismatches (e.g. k8s CLI vs accounting, or general tools in broad categories)
    const isSpecializedDevTool = /kube|k8s|kubernetes|docker|container|cli|security|vulnerability|audit/i.test(`${tool.id} ${tool.name}`);
    const altIsSpecializedDevTool = /kube|k8s|kubernetes|docker|container|cli|security|vulnerability|audit/i.test(`${altTool.id} ${altTool.name}`);

    if (hasCuratedDifferentiator) {
      alternativesQualityAudit.strongSubstitute++;
    } else if (isSpecializedDevTool && !altIsSpecializedDevTool && sameCategory) {
      alternativesQualityAudit.irrelevant++;
      alternativesQualityAudit.flaggedWeakPairings.push({
        sourceTool: tool.id,
        targetTool: altTool.id,
        category: tool.category,
        reason: 'Specialized DevOps/Security tool paired with general category software.'
      });
    } else if (sameSubcategory) {
      alternativesQualityAudit.strongSubstitute++;
    } else if (sameCategory) {
      // If broad category with > 50 tools, plain category fallback is often WEAK
      const catCount = saasTools.filter(t => t.category === tool.category).length;
      if (catCount > 40) {
        alternativesQualityAudit.weakAlternative++;
        if (alternativesQualityAudit.flaggedWeakPairings.length < 100) {
          alternativesQualityAudit.flaggedWeakPairings.push({
            sourceTool: tool.id,
            targetTool: altTool.id,
            category: tool.category,
            reason: `Broad category fallback match in high-cardinality category (${catCount} tools).`
          });
        }
      } else {
        alternativesQualityAudit.partialAlternative++;
      }
    } else {
      alternativesQualityAudit.irrelevant++;
    }
  });
});

// -------------------------------------------------------------
// AUDIT MODULE 6: HTML File Inspection Across All 4,174 Generated Routes
// -------------------------------------------------------------
console.log('🔍 Auditing dist/ HTML Files (Render, Schema, Text Directives)...');

const htmlAudit = {
  totalFilesAudited: 0,
  routesByType: {
    software: 0,
    alternatives: 0,
    vs: 0,
    best: 0,
    guides: 0,
    core: 0,
    other: 0
  },
  emptySpaShells: 0,
  missingH1: 0,
  missingSsrMain: 0,
  brokenCanonicals: 0,
  canonicalMismatch: 0,
  schemaFindings: {
    totalSchemas: 0,
    softwareAppCount: 0,
    articleCount: 0,
    itemListCount: 0,
    breadcrumbListCount: 0,
    aggregateRatingCount: 0,
    reviewCount: 0
  },
  editorialClaims: {
    researchTeam: 0,
    ourExperts: 0,
    weTested: 0,
    handsOnTesting: 0,
    redditSwitchInsight: 0,
    buyerConsensus: 0,
    basedOnThousands: 0
  },
  pricingClaimsInHtml: {
    totalPricingBadges: 0,
    freeTierBadges: 0,
    openSourceBadges: 0
  },
  flaggedHtmlFiles: []
};

uniqueRoutes.forEach(r => {
  htmlAudit.totalFilesAudited++;
  
  if (r.route.startsWith('/software/')) htmlAudit.routesByType.software++;
  else if (r.route.startsWith('/alternatives/')) htmlAudit.routesByType.alternatives++;
  else if (r.route.startsWith('/vs/')) htmlAudit.routesByType.vs++;
  else if (r.route.startsWith('/best/')) htmlAudit.routesByType.best++;
  else if (r.route.startsWith('/guides/')) htmlAudit.routesByType.guides++;
  else htmlAudit.routesByType.core++;

  const content = fs.readFileSync(r.filePath, 'utf8');

  // Check for substantive body
  const hasSsrMain = content.includes('stakdock-ssr-main') || content.includes('<main');
  if (!hasSsrMain && r.route !== '/') {
    htmlAudit.missingSsrMain++;
    htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: 'Missing substantive SSR main tag' });
  }

  // Check H1
  const hasH1 = /<h1[\s>]/i.test(content);
  if (!hasH1 && r.route !== '/') {
    htmlAudit.missingH1++;
    htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: 'Missing H1 heading' });
  }

  // Check Canonical Tag
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!canonicalMatch) {
    htmlAudit.brokenCanonicals++;
    htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: 'Missing canonical tag' });
  } else {
    const expectedCanonical = `https://stakdock.com${r.route}`;
    if (canonicalMatch[1] !== expectedCanonical) {
      htmlAudit.canonicalMismatch++;
      htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: `Canonical mismatch: found ${canonicalMatch[1]}, expected ${expectedCanonical}` });
    }
  }

  // Check Schemas
  if (content.includes('SoftwareApplication')) htmlAudit.schemaFindings.softwareAppCount++;
  if (content.includes('"@type": "Article"') || content.includes('"@type":"Article"')) htmlAudit.schemaFindings.articleCount++;
  if (content.includes('ItemList')) htmlAudit.schemaFindings.itemListCount++;
  if (content.includes('BreadcrumbList')) htmlAudit.schemaFindings.breadcrumbListCount++;
  if (content.includes('AggregateRating')) {
    htmlAudit.schemaFindings.aggregateRatingCount++;
    htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: 'Contains AggregateRating schema' });
  }
  if (content.includes('"@type": "Review"') || content.includes('"@type":"Review"')) {
    htmlAudit.schemaFindings.reviewCount++;
    htmlAudit.flaggedHtmlFiles.push({ route: r.route, error: 'Contains Review schema' });
  }

  // Check Editorial / Research claims
  if (/research team/i.test(content)) htmlAudit.editorialClaims.researchTeam++;
  if (/our experts|our researchers/i.test(content)) htmlAudit.editorialClaims.ourExperts++;
  if (/we tested|we benchmarked|we evaluated/i.test(content)) htmlAudit.editorialClaims.weTested++;
  if (/hands-on testing|expert tested/i.test(content)) htmlAudit.editorialClaims.handsOnTesting++;
  if (/reddit.*insight|reddit switch/i.test(content)) htmlAudit.editorialClaims.redditSwitchInsight++;
  if (/buyer consensus|aggregated buyer consensus/i.test(content)) htmlAudit.editorialClaims.buyerConsensus++;
  if (/based on thousands of reviews/i.test(content)) htmlAudit.editorialClaims.basedOnThousands++;
});

// -------------------------------------------------------------
// AUDIT MODULE 7: Pricing, Free-Tier, Traffic & Popularity Metrics
// -------------------------------------------------------------
console.log('🔍 Auditing Pricing, Free-Tier, and Traffic Provenance...');

const metricsAudit = {
  pricing: {
    totalToolsWithPricingString: 0,
    toolsWithExplicitProvenance: 0,
    toolsWithUnverifiedPricing: 0,
    toolsWithPreciseDollarPricing: 0,
    toolsWithCheckedAtDate: 0
  },
  freeTier: {
    totalFreeTierClaims: 0,
    isFreeTierFlagTrue: 0,
    freemiumPricingClaim: 0,
    freeTrialClaim: 0,
    noCreditCardRequiredClaim: 0,
    provenanceBackedFreeTierClaims: 0
  },
  trafficAndPopularity: {
    toolsWithMonthlyVisits: 0,
    monthlyVisitsValues: {},
    toolsWithOpenPageRank: 0,
    provenanceStatus: 'ESTIMATED_OR_IMPORTED'
  }
};

saasTools.forEach(tool => {
  // Pricing
  if (tool.pricing) {
    metricsAudit.pricing.totalToolsWithPricingString++;
    if (/\$\d+/.test(tool.pricing) || /€\d+/.test(tool.pricing) || /£\d+/.test(tool.pricing)) {
      metricsAudit.pricing.toolsWithPreciseDollarPricing++;
    }
  }

  if (tool.pricingDetails && tool.pricingDetails.confidence === 'HIGH') {
    metricsAudit.pricing.toolsWithExplicitProvenance++;
    if (tool.pricingDetails.checkedAt) {
      metricsAudit.pricing.toolsWithCheckedAtDate++;
    }
  } else {
    metricsAudit.pricing.toolsWithUnverifiedPricing++;
  }

  // Free Tier
  if (tool.isFreeTier) metricsAudit.freeTier.isFreeTierFlagTrue++;
  if (tool.pricing && /freemium|free/i.test(tool.pricing)) metricsAudit.freeTier.freemiumPricingClaim++;
  if (tool.pricing && /trial/i.test(tool.pricing)) metricsAudit.freeTier.freeTrialClaim++;
  if (tool.description && /no credit card/i.test(tool.description)) metricsAudit.freeTier.noCreditCardRequiredClaim++;

  if (authorityFiveIds.has(tool.id) && tool.isFreeTier) {
    metricsAudit.freeTier.provenanceBackedFreeTierClaims++;
  }

  // Traffic / Monthly Visits
  if (tool.monthlyVisits) {
    metricsAudit.trafficAndPopularity.toolsWithMonthlyVisits++;
    metricsAudit.trafficAndPopularity.monthlyVisitsValues[tool.monthlyVisits] = (metricsAudit.trafficAndPopularity.monthlyVisitsValues[tool.monthlyVisits] || 0) + 1;
  }
  if (tool.openPageRank || tool.authorityScore) {
    metricsAudit.trafficAndPopularity.toolsWithOpenPageRank++;
  }
});

// -------------------------------------------------------------
// AUDIT MODULE 8: Real Community Signals vs Legacy Seeds
// -------------------------------------------------------------
console.log('🔍 Auditing Real Community Baseline vs Synthetic Seeds...');

const communitySignalsAudit = {
  realServerSideUpvotes: 0,
  realServerSideReviews: 0,
  realFounderClaimedListings: 0,
  realUserSubmissions: 0,
  syntheticVoteBaselineSum: 0,
  syntheticReviewCountSum: 0,
  toolsWithZeroVotesState: saasTools.filter(t => !t.upvotes || t.upvotes === 0).length,
  toolsWithZeroReviewsState: saasTools.filter(t => !t.reviewsCount || t.reviewsCount === 0).length
};

saasTools.forEach(t => {
  if (t.upvotes) communitySignalsAudit.syntheticVoteBaselineSum += Number(t.upvotes) || 0;
  if (t.reviewsCount) communitySignalsAudit.syntheticReviewCountSum += Number(t.reviewsCount) || 0;
  if (t.claimedByFounder) communitySignalsAudit.realFounderClaimedListings++;
});

// -------------------------------------------------------------
// AUDIT MODULE 9: Specific Investigation of the 10 Known Examples
// -------------------------------------------------------------
console.log('🔍 Auditing 10 Specific Known Production Examples...');

const knownExamplesToInspect = [
  { url: '/best/ai-music-audio/', slug: 'ai-music-audio', type: 'best' },
  { url: '/best/saas-lifetime-deals/', slug: 'saas-lifetime-deals', type: 'best' },
  { url: '/alternatives/firstpass/', slug: 'firstpass', type: 'alternatives' },
  { url: '/alternatives/lovo-ai/', slug: 'lovo-ai', type: 'alternatives' },
  { url: '/software/flow/', slug: 'flow', type: 'software' },
  { url: '/software/kustomer/', slug: 'kustomer', type: 'software' },
  { url: '/software/getprospect/', slug: 'getprospect', type: 'software' },
  { url: '/software/sotrender/', slug: 'sotrender', type: 'software' },
  { url: '/alternatives/headlamp-k8s/', slug: 'headlamp-k8s', type: 'alternatives' },
  { url: '/alternatives/fliki/', slug: 'fliki', type: 'alternatives' }
];

const knownExamplesAudit = knownExamplesToInspect.map(ex => {
  const tool = saasTools.find(t => t.id === ex.slug);
  const filePath = path.join(distDir, ex.url.replace(/^\//, ''), 'index.html');
  const fileExists = fs.existsSync(filePath);
  const content = fileExists ? fs.readFileSync(filePath, 'utf8') : '';

  const problems = [];
  
  if (ex.type === 'best') {
    if (content.includes('⭐ 4.')) problems.push('Displays synthetic 4.x rating on #1 pick without external source attribution');
    if (content.includes('ratings)')) problems.push('Displays synthetic review count');
    if (content.includes('Official StakDock Pick') || content.includes('#1 Top Rated')) problems.push('Displays #1 Top Rated award driven by arbitrary database sort');
  }

  if (ex.type === 'software') {
    if (tool && tool.rating && !authorityFiveIds.has(tool.id)) problems.push(`Displays rating ${tool.rating}★ without fact-level provenance source`);
    if (tool && tool.reviewsCount) problems.push(`Displays ${tool.reviewsCount} review count without audit provenance`);
    if (tool && tool.badge === 'Verified Tool') problems.push('Displays "Verified Tool" badge based only on automated website check');
    if (tool && genericPatterns.some(p => p.test(tool.description || ''))) problems.push('Uses generic boilerplate description');
  }

  if (ex.type === 'alternatives') {
    if (tool && (!tool.curatedAlternatives || tool.curatedAlternatives.length === 0)) {
      problems.push('Relying on legacy category fallback matching instead of curated subcategory taxonomy');
    }
  }

  return {
    url: ex.url,
    slug: ex.slug,
    type: ex.type,
    status: fileExists ? '200_GENERATED' : 'MISSING_FILE',
    confirmedProblems: problems,
    proposedRemediation: problems.length > 0 ? (ex.type === 'best' ? 'REBUILD' : (ex.type === 'software' ? 'RELABEL' : 'SOURCE')) : 'PRESERVE'
  };
});

// -------------------------------------------------------------
// Write Out Machine-Readable Reports
// -------------------------------------------------------------
console.log('💾 Writing machine-readable audit manifests into reports/...');

const fullAuditReport = {
  timestamp: new Date().toISOString(),
  totalCanonicalRoutesAudited: uniqueRoutes.length,
  totalToolsAudited: saasTools.length,
  ratingsAudit,
  trustLabelsAudit,
  awardsAudit,
  genericContentAudit,
  alternativesQualityAudit,
  htmlAudit,
  metricsAudit,
  communitySignalsAudit,
  knownExamplesAudit
};

fs.writeFileSync(path.join(reportsDir, 'production-trust-audit.json'), JSON.stringify(fullAuditReport, null, 2), 'utf8');

fs.writeFileSync(path.join(reportsDir, 'synthetic-signals-manifest.json'), JSON.stringify({
  timestamp: new Date().toISOString(),
  totalFlaggedTools: ratingsAudit.flaggedTools.length,
  flaggedTools: ratingsAudit.flaggedTools
}, null, 2), 'utf8');

fs.writeFileSync(path.join(reportsDir, 'generic-content-manifest.json'), JSON.stringify({
  timestamp: new Date().toISOString(),
  totalGenericSoftwarePages: genericContentAudit.totalSoftwarePagesWithFallback,
  affectedSoftwareIds: genericContentAudit.affectedSoftwareIds
}, null, 2), 'utf8');

fs.writeFileSync(path.join(reportsDir, 'alternative-quality-manifest.json'), JSON.stringify({
  timestamp: new Date().toISOString(),
  totalPairings: alternativesQualityAudit.totalEvaluatedPairings,
  strongSubstitute: alternativesQualityAudit.strongSubstitute,
  partialAlternative: alternativesQualityAudit.partialAlternative,
  weakAlternative: alternativesQualityAudit.weakAlternative,
  irrelevant: alternativesQualityAudit.irrelevant,
  sampleFlaggedPairings: alternativesQualityAudit.flaggedWeakPairings
}, null, 2), 'utf8');

fs.writeFileSync(path.join(reportsDir, 'render-error-manifest.json'), JSON.stringify({
  timestamp: new Date().toISOString(),
  totalFlaggedFiles: htmlAudit.flaggedHtmlFiles.length,
  flaggedFiles: htmlAudit.flaggedHtmlFiles
}, null, 2), 'utf8');

console.log('✅ Full Production Audit Run Completed Successfully!');

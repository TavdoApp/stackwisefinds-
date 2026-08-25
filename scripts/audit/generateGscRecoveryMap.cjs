/**
 * StakDock GSC-Aware Recovery Mapping Engine (Phase 2B)
 *
 * Merges:
 * 1. 4,174 Canonical URLs from Quality Classification (Phase 2)
 * 2. Pre-Crash GSC Performance (Aug 2–17, 2026: 40,754 impressions, 97 clicks)
 * 3. Post-Crash GSC Performance (Aug 17–24, 2026: 4,308 impressions, 6 clicks)
 * 4. Query Intent & High-Ranking SERP Position Analysis
 *
 * Outputs:
 * - P: PROTECT
 * - R: RECOVER
 * - K: KEEP
 * - Q: QUARANTINE CANDIDATE (Q1, Q2, Q3)
 * - T: TECHNICAL / NAVIGATION
 *
 * Saves to: reports/gsc-recovery-map.json
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing StakDock GSC-Aware Recovery Mapping Engine (Phase 2B)...');

const gscPreDir = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'pre-crash');
const gscPostDir = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'post-crash');
const reportsDir = path.join(__dirname, '..', '..', 'reports');
const qualityManifestPath = path.join(reportsDir, 'index-footprint-classification.json');

if (!fs.existsSync(qualityManifestPath)) {
  console.error('❌ Quality manifest not found at reports/index-footprint-classification.json');
  process.exit(1);
}

const qualityManifest = JSON.parse(fs.readFileSync(qualityManifestPath, 'utf8'));

// CSV Parser Helper
function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: CSV file not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle simple CSV splitting with possible quotes
    const rawLine = lines[i];
    const values = [];
    let insideQuotes = false;
    let currentVal = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim().replace(/^"|"$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^"|"$/g, ''));

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(rowObj);
  }
  return rows;
}

// 1. Read CSVs
const prePages = parseCsv(path.join(gscPreDir, 'Pages.csv'));
const preQueries = parseCsv(path.join(gscPreDir, 'Queries.csv'));
const preChart = parseCsv(path.join(gscPreDir, 'Chart.csv'));

const postPages = parseCsv(path.join(gscPostDir, 'Pages.csv'));
const postQueries = parseCsv(path.join(gscPostDir, 'Queries.csv'));
const postChart = parseCsv(path.join(gscPostDir, 'Chart.csv'));

console.log(`📊 Loaded Pre-Crash Data: ${prePages.length} pages, ${preQueries.length} queries, ${preChart.length} daily chart rows`);
console.log(`📊 Loaded Post-Crash Data: ${postPages.length} pages, ${postQueries.length} queries, ${postChart.length} daily chart rows`);

// URL Normalizer Helper
function normalizeGscUrl(rawUrl) {
  if (!rawUrl) return null;
  let clean = rawUrl.trim();
  // Strip protocol and domain
  clean = clean.replace(/^https?:\/\/[^\/]+/, '');
  if (!clean.startsWith('/')) clean = '/' + clean;
  // Ensure trailing slash
  if (!clean.endsWith('/')) clean = clean + '/';
  // Normalize redundant slashes
  clean = clean.replace(/\/+/g, '/');
  return clean;
}

// 2. Aggregate GSC Pages
function aggregateGscPages(rows) {
  const map = new Map();

  rows.forEach(row => {
    const rawUrl = row['Top pages'] || row['Page'] || row['URL'] || '';
    if (!rawUrl) return;
    const canonical = normalizeGscUrl(rawUrl);
    const clicks = parseInt(row['Clicks'] || '0', 10) || 0;
    const impressions = parseInt(row['Impressions'] || '0', 10) || 0;
    const position = parseFloat(row['Position'] || '0') || 0;

    if (!map.has(canonical)) {
      map.set(canonical, {
        canonicalUrl: canonical,
        clicks: 0,
        impressions: 0,
        impWeightedPosSum: 0,
        variants: new Set()
      });
    }

    const entry = map.get(canonical);
    entry.clicks += clicks;
    entry.impressions += impressions;
    entry.impWeightedPosSum += (impressions * position);
    entry.variants.add(rawUrl);
  });

  const finalMap = new Map();
  map.forEach((val, key) => {
    finalMap.set(key, {
      canonicalUrl: key,
      clicks: val.clicks,
      impressions: val.impressions,
      ctr: val.impressions > 0 ? (val.clicks / val.impressions) : 0,
      position: val.impressions > 0 ? (val.impWeightedPosSum / val.impressions) : 0,
      variants: Array.from(val.variants)
    });
  });

  return finalMap;
}

const prePagesMap = aggregateGscPages(prePages);
const postPagesMap = aggregateGscPages(postPages);

console.log(`🔗 Normalized Unique GSC Canonical URLs: ${prePagesMap.size} Pre-Crash, ${postPagesMap.size} Post-Crash`);

// 3. Query Intent Classifier
function classifyQueryIntent(query) {
  const q = query.toLowerCase();
  if (q.includes(' vs ') || q.includes(' versus ') || q.includes(' compared to ') || q.includes(' vs. ')) {
    return 'comparison';
  }
  if (q.includes('alternative') || q.includes('alternativas') || q.includes('replacement') || q.includes('similar to') || q.includes('like ')) {
    return 'alternatives';
  }
  if (q.includes('pricing') || q.includes('cost') || q.includes('free tier') || q.includes('deal') || q.includes('discount') || q.includes('payment')) {
    return 'pricing';
  }
  if (q.includes('best ') || q.includes('top ') || q.includes('software for') || q.includes('tools for') || q.includes('guide')) {
    return 'category/best';
  }
  if (q.includes('how to') || q.includes('what is') || q.includes('tutorial') || q.includes('review') || q.includes('documentation')) {
    return 'informational';
  }
  return 'branded/product';
}

const queryIntentStats = {
  pre: {
    comparison: { impressions: 0, clicks: 0, count: 0 },
    alternatives: { impressions: 0, clicks: 0, count: 0 },
    pricing: { impressions: 0, clicks: 0, count: 0 },
    'category/best': { impressions: 0, clicks: 0, count: 0 },
    informational: { impressions: 0, clicks: 0, count: 0 },
    'branded/product': { impressions: 0, clicks: 0, count: 0 }
  },
  post: {
    comparison: { impressions: 0, clicks: 0, count: 0 },
    alternatives: { impressions: 0, clicks: 0, count: 0 },
    pricing: { impressions: 0, clicks: 0, count: 0 },
    'category/best': { impressions: 0, clicks: 0, count: 0 },
    informational: { impressions: 0, clicks: 0, count: 0 },
    'branded/product': { impressions: 0, clicks: 0, count: 0 }
  }
};

preQueries.forEach(row => {
  const q = row['Top queries'] || '';
  const clicks = parseInt(row['Clicks'] || '0', 10) || 0;
  const impressions = parseInt(row['Impressions'] || '0', 10) || 0;
  const intent = classifyQueryIntent(q);
  queryIntentStats.pre[intent].impressions += impressions;
  queryIntentStats.pre[intent].clicks += clicks;
  queryIntentStats.pre[intent].count++;
});

postQueries.forEach(row => {
  const q = row['Top queries'] || '';
  const clicks = parseInt(row['Clicks'] || '0', 10) || 0;
  const impressions = parseInt(row['Impressions'] || '0', 10) || 0;
  const intent = classifyQueryIntent(q);
  queryIntentStats.post[intent].impressions += impressions;
  queryIntentStats.post[intent].clicks += clicks;
  queryIntentStats.post[intent].count++;
});

// 4. Merge Data for all 4,174 Canonical URLs
const mergedMap = [];
const clickEarningUrls = [];

const pageTypeBreakdown = {
  pre: {
    software: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    alternatives: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    vs: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    best: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    category: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    guides: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    core: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 }
  },
  post: {
    software: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    alternatives: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    vs: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    best: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    category: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    guides: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 },
    core: { impressions: 0, clicks: 0, impPosSum: 0, urlCount: 0 }
  }
};

const recoveryCounts = {
  P: 0,
  R: 0,
  K: 0,
  Q: 0,
  T: 0,
  total: 0
};

const recoveryByPageType = {
  software: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  alternatives: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  vs: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  best: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  category: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  guides: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 },
  core: { P: 0, R: 0, K: 0, Q: 0, T: 0, total: 0 }
};

const quarantineSafety = {
  Q1_VERY_SAFE: { count: 0, preImp: 0, preClicks: 0, postImp: 0, postClicks: 0 },
  Q2_PROBABLY_SAFE: { count: 0, preImp: 0, preClicks: 0, postImp: 0, postClicks: 0 },
  Q3_REVIEW_BEFORE_HOLD: { count: 0, preImp: 0, preClicks: 0, postImp: 0, postClicks: 0 }
};

qualityManifest.items.forEach(qItem => {
  const normUrl = normalizeGscUrl(qItem.url);
  const preGsc = prePagesMap.get(normUrl) || { clicks: 0, impressions: 0, ctr: 0, position: 0, variants: [] };
  const postGsc = postPagesMap.get(normUrl) || { clicks: 0, impressions: 0, ctr: 0, position: 0, variants: [] };

  const allVariants = Array.from(new Set([...preGsc.variants, ...postGsc.variants]));

  // Track page type aggregates
  const pType = qItem.pageType;
  if (pageTypeBreakdown.pre[pType]) {
    pageTypeBreakdown.pre[pType].impressions += preGsc.impressions;
    pageTypeBreakdown.pre[pType].clicks += preGsc.clicks;
    pageTypeBreakdown.pre[pType].impPosSum += (preGsc.impressions * preGsc.position);
    if (preGsc.impressions > 0) pageTypeBreakdown.pre[pType].urlCount++;
  }

  if (pageTypeBreakdown.post[pType]) {
    pageTypeBreakdown.post[pType].impressions += postGsc.impressions;
    pageTypeBreakdown.post[pType].clicks += postGsc.clicks;
    pageTypeBreakdown.post[pType].impPosSum += (postGsc.impressions * postGsc.position);
    if (postGsc.impressions > 0) pageTypeBreakdown.post[pType].urlCount++;
  }

  const totalClicks = preGsc.clicks + postGsc.clicks;
  const totalImpressions = preGsc.impressions + postGsc.impressions;

  if (totalClicks >= 1) {
    clickEarningUrls.push({
      canonicalUrl: normUrl,
      pageType: pType,
      preClicks: preGsc.clicks,
      preImpressions: preGsc.impressions,
      prePosition: preGsc.position > 0 ? preGsc.position.toFixed(1) : 'N/A',
      postClicks: postGsc.clicks,
      postImpressions: postGsc.impressions,
      postPosition: postGsc.position > 0 ? postGsc.position.toFixed(1) : 'N/A',
      previousClass: qItem.classification
    });
  }

  // Calculate Recovery State (P, R, K, Q, T)
  let recoveryState = 'Q';
  let recoveryPriority = 0;
  const reasons = [];

  if (qItem.classification === 'D') {
    recoveryState = 'T';
    reasons.push('Technical / Legal compliance page (Terms, Privacy, Refund)');
  } else if (
    totalClicks >= 1 ||
    preGsc.impressions >= 300 ||
    postGsc.impressions >= 100 ||
    (qItem.classification === 'A' && (preGsc.impressions >= 50 || normUrl === '/'))
  ) {
    recoveryState = 'P';
    reasons.push(
      totalClicks >= 1
        ? `Demonstrated Google search click conversion (${totalClicks} clicks recorded)`
        : `High Google visibility volume (${preGsc.impressions} pre / ${postGsc.impressions} post impressions)`
    );
  } else if (
    preGsc.impressions >= 10 ||
    postGsc.impressions >= 5 ||
    (preGsc.position > 0 && preGsc.position <= 30) ||
    qItem.priority === 'HIGH_RECOVERY_PRIORITY' ||
    ['/best/invoicing/', '/best/seo-analytics/', '/best/email-marketing/'].includes(normUrl)
  ) {
    recoveryState = 'R';
    reasons.push(
      preGsc.impressions > 0
        ? `Proven Google impression traction (${preGsc.impressions} pre / ${postGsc.impressions} post impressions) — priority recovery candidate`
        : `Strategic market entity / high-intent buyer comparison requiring enrichment`
    );
  } else if (qItem.classification === 'A' || (qItem.classification === 'B' && qItem.indexValueScore >= 70)) {
    recoveryState = 'K';
    reasons.push('High standalone quality / recent Authority asset maintained in active index');
  } else {
    recoveryState = 'Q';
    reasons.push('Low current quality, generic broad-category fallback, and negligible historical search traction');
  }

  // Calculate Recovery Priority Score (0-100)
  // Considers: Google Exposure (40%), Quality Baseline (30%), Strategic Role (20%), Clicks (10%)
  const gscImpScore = Math.min(40, (preGsc.impressions / 25) + (postGsc.impressions / 10));
  const qualityScore = (qItem.indexValueScore / 100) * 30;
  const clickBonus = Math.min(10, totalClicks * 5);
  const strategicBonus = (qItem.priority === 'HIGH_RECOVERY_PRIORITY' || qItem.classification === 'A') ? 20 : 5;

  recoveryPriority = Math.round(gscImpScore + qualityScore + clickBonus + strategicBonus);

  // Quarantine Safety Sub-Tier
  let qSafety = null;
  if (recoveryState === 'Q') {
    if (totalClicks === 0 && preGsc.impressions <= 2 && postGsc.impressions === 0 && qItem.indexValueScore < 35) {
      qSafety = 'Q1_VERY_SAFE';
      quarantineSafety.Q1_VERY_SAFE.count++;
      quarantineSafety.Q1_VERY_SAFE.preImp += preGsc.impressions;
      quarantineSafety.Q1_VERY_SAFE.preClicks += preGsc.clicks;
      quarantineSafety.Q1_VERY_SAFE.postImp += postGsc.impressions;
      quarantineSafety.Q1_VERY_SAFE.postClicks += postGsc.clicks;
    } else if (totalClicks === 0 && preGsc.impressions < 10 && postGsc.impressions < 5) {
      qSafety = 'Q2_PROBABLY_SAFE';
      quarantineSafety.Q2_PROBABLY_SAFE.count++;
      quarantineSafety.Q2_PROBABLY_SAFE.preImp += preGsc.impressions;
      quarantineSafety.Q2_PROBABLY_SAFE.preClicks += preGsc.clicks;
      quarantineSafety.Q2_PROBABLY_SAFE.postImp += postGsc.impressions;
      quarantineSafety.Q2_PROBABLY_SAFE.postClicks += postGsc.clicks;
    } else {
      qSafety = 'Q3_REVIEW_BEFORE_HOLD';
      quarantineSafety.Q3_REVIEW_BEFORE_HOLD.count++;
      quarantineSafety.Q3_REVIEW_BEFORE_HOLD.preImp += preGsc.impressions;
      quarantineSafety.Q3_REVIEW_BEFORE_HOLD.preClicks += preGsc.clicks;
      quarantineSafety.Q3_REVIEW_BEFORE_HOLD.postImp += postGsc.impressions;
      quarantineSafety.Q3_REVIEW_BEFORE_HOLD.postClicks += postGsc.clicks;
    }
  }

  recoveryCounts[recoveryState]++;
  recoveryCounts.total++;

  if (recoveryByPageType[pType]) {
    recoveryByPageType[pType][recoveryState]++;
    recoveryByPageType[pType].total++;
  }

  mergedMap.push({
    url: normUrl,
    pageType: pType,
    previousClass: qItem.classification,
    recoveryState,
    recoveryPriority,
    qSafetyTier: qSafety,
    preCrash: {
      impressions: preGsc.impressions,
      clicks: preGsc.clicks,
      ctr: (preGsc.ctr * 100).toFixed(2) + '%',
      position: preGsc.position > 0 ? parseFloat(preGsc.position.toFixed(1)) : null
    },
    postCrash: {
      impressions: postGsc.impressions,
      clicks: postGsc.clicks,
      ctr: (postGsc.ctr * 100).toFixed(2) + '%',
      position: postGsc.position > 0 ? parseFloat(postGsc.position.toFixed(1)) : null
    },
    historicalVariants: allVariants,
    qualityScore: qItem.indexValueScore,
    provenance: qItem.provenance,
    specificity: qItem.specificity,
    decisionUsefulness: qItem.decisionUsefulness,
    relationshipQuality: qItem.relationshipQuality,
    reasons
  });
});

// Sort Merged Map for Top 100 Recovery / Protect Opportunities
const top100Recovery = [...mergedMap]
  .filter(item => item.recoveryState === 'P' || item.recoveryState === 'R')
  .sort((a, b) => b.recoveryPriority - a.recoveryPriority || b.preCrash.impressions - a.preCrash.impressions)
  .slice(0, 100);

// High Ranking Queries Analysis (Pos 1-5, 6-10, 11-20)
const highRankingQueries = {
  pos1_5: [],
  pos6_10: [],
  pos11_20: []
};

preQueries.forEach(row => {
  const query = row['Top queries'] || '';
  const clicks = parseInt(row['Clicks'] || '0', 10) || 0;
  const impressions = parseInt(row['Impressions'] || '0', 10) || 0;
  const pos = parseFloat(row['Position'] || '0');

  if (pos > 0 && pos <= 5) {
    highRankingQueries.pos1_5.push({ query, clicks, impressions, position: pos, intent: classifyQueryIntent(query) });
  } else if (pos > 5 && pos <= 10) {
    highRankingQueries.pos6_10.push({ query, clicks, impressions, position: pos, intent: classifyQueryIntent(query) });
  } else if (pos > 10 && pos <= 20) {
    highRankingQueries.pos11_20.push({ query, clicks, impressions, position: pos, intent: classifyQueryIntent(query) });
  }
});

// Final Manifest Structure
const finalManifest = {
  timestamp: new Date().toISOString(),
  totalUrls: mergedMap.length,
  preCrashTotals: {
    dates: 'Aug 2 – Aug 17, 2026',
    totalImpressions: 40754,
    totalClicks: 97,
    avgCtr: '0.24%',
    avgPosition: 57.2
  },
  postCrashTotals: {
    dates: 'Aug 17 – Aug 24, 2026',
    totalImpressions: 4308,
    totalClicks: 6,
    avgCtr: '0.14%',
    avgPosition: 58.7
  },
  queryIntentBreakdown: queryIntentStats,
  pageTypePerformance: {
    preCrash: {
      software: {
        impressions: pageTypeBreakdown.pre.software.impressions,
        clicks: pageTypeBreakdown.pre.software.clicks,
        ctr: pageTypeBreakdown.pre.software.impressions > 0 ? ((pageTypeBreakdown.pre.software.clicks / pageTypeBreakdown.pre.software.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.software.impressions > 0 ? (pageTypeBreakdown.pre.software.impPosSum / pageTypeBreakdown.pre.software.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.software.impressions / 40754) * 100).toFixed(1) + '%'
      },
      alternatives: {
        impressions: pageTypeBreakdown.pre.alternatives.impressions,
        clicks: pageTypeBreakdown.pre.alternatives.clicks,
        ctr: pageTypeBreakdown.pre.alternatives.impressions > 0 ? ((pageTypeBreakdown.pre.alternatives.clicks / pageTypeBreakdown.pre.alternatives.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.alternatives.impressions > 0 ? (pageTypeBreakdown.pre.alternatives.impPosSum / pageTypeBreakdown.pre.alternatives.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.alternatives.impressions / 40754) * 100).toFixed(1) + '%'
      },
      vs: {
        impressions: pageTypeBreakdown.pre.vs.impressions,
        clicks: pageTypeBreakdown.pre.vs.clicks,
        ctr: pageTypeBreakdown.pre.vs.impressions > 0 ? ((pageTypeBreakdown.pre.vs.clicks / pageTypeBreakdown.pre.vs.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.vs.impressions > 0 ? (pageTypeBreakdown.pre.vs.impPosSum / pageTypeBreakdown.pre.vs.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.vs.impressions / 40754) * 100).toFixed(1) + '%'
      },
      best: {
        impressions: pageTypeBreakdown.pre.best.impressions,
        clicks: pageTypeBreakdown.pre.best.clicks,
        ctr: pageTypeBreakdown.pre.best.impressions > 0 ? ((pageTypeBreakdown.pre.best.clicks / pageTypeBreakdown.pre.best.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.best.impressions > 0 ? (pageTypeBreakdown.pre.best.impPosSum / pageTypeBreakdown.pre.best.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.best.impressions / 40754) * 100).toFixed(1) + '%'
      },
      category: {
        impressions: pageTypeBreakdown.pre.category.impressions,
        clicks: pageTypeBreakdown.pre.category.clicks,
        ctr: pageTypeBreakdown.pre.category.impressions > 0 ? ((pageTypeBreakdown.pre.category.clicks / pageTypeBreakdown.pre.category.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.category.impressions > 0 ? (pageTypeBreakdown.pre.category.impPosSum / pageTypeBreakdown.pre.category.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.category.impressions / 40754) * 100).toFixed(1) + '%'
      },
      guides: {
        impressions: pageTypeBreakdown.pre.guides.impressions,
        clicks: pageTypeBreakdown.pre.guides.clicks,
        ctr: pageTypeBreakdown.pre.guides.impressions > 0 ? ((pageTypeBreakdown.pre.guides.clicks / pageTypeBreakdown.pre.guides.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.guides.impressions > 0 ? (pageTypeBreakdown.pre.guides.impPosSum / pageTypeBreakdown.pre.guides.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.guides.impressions / 40754) * 100).toFixed(1) + '%'
      },
      core: {
        impressions: pageTypeBreakdown.pre.core.impressions,
        clicks: pageTypeBreakdown.pre.core.clicks,
        ctr: pageTypeBreakdown.pre.core.impressions > 0 ? ((pageTypeBreakdown.pre.core.clicks / pageTypeBreakdown.pre.core.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.pre.core.impressions > 0 ? (pageTypeBreakdown.pre.core.impPosSum / pageTypeBreakdown.pre.core.impressions).toFixed(1) : 'N/A',
        percentOfTotalImpressions: ((pageTypeBreakdown.pre.core.impressions / 40754) * 100).toFixed(1) + '%'
      }
    },
    postCrash: {
      software: {
        impressions: pageTypeBreakdown.post.software.impressions,
        clicks: pageTypeBreakdown.post.software.clicks,
        ctr: pageTypeBreakdown.post.software.impressions > 0 ? ((pageTypeBreakdown.post.software.clicks / pageTypeBreakdown.post.software.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.software.impressions > 0 ? (pageTypeBreakdown.post.software.impPosSum / pageTypeBreakdown.post.software.impressions).toFixed(1) : 'N/A'
      },
      alternatives: {
        impressions: pageTypeBreakdown.post.alternatives.impressions,
        clicks: pageTypeBreakdown.post.alternatives.clicks,
        ctr: pageTypeBreakdown.post.alternatives.impressions > 0 ? ((pageTypeBreakdown.post.alternatives.clicks / pageTypeBreakdown.post.alternatives.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.alternatives.impressions > 0 ? (pageTypeBreakdown.post.alternatives.impPosSum / pageTypeBreakdown.post.alternatives.impressions).toFixed(1) : 'N/A'
      },
      vs: {
        impressions: pageTypeBreakdown.post.vs.impressions,
        clicks: pageTypeBreakdown.post.vs.clicks,
        ctr: pageTypeBreakdown.post.vs.impressions > 0 ? ((pageTypeBreakdown.post.vs.clicks / pageTypeBreakdown.post.vs.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.vs.impressions > 0 ? (pageTypeBreakdown.post.vs.impPosSum / pageTypeBreakdown.post.vs.impressions).toFixed(1) : 'N/A'
      },
      best: {
        impressions: pageTypeBreakdown.post.best.impressions,
        clicks: pageTypeBreakdown.post.best.clicks,
        ctr: pageTypeBreakdown.post.best.impressions > 0 ? ((pageTypeBreakdown.post.best.clicks / pageTypeBreakdown.post.best.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.best.impressions > 0 ? (pageTypeBreakdown.post.best.impPosSum / pageTypeBreakdown.post.best.impressions).toFixed(1) : 'N/A'
      },
      category: {
        impressions: pageTypeBreakdown.post.category.impressions,
        clicks: pageTypeBreakdown.post.category.clicks,
        ctr: pageTypeBreakdown.post.category.impressions > 0 ? ((pageTypeBreakdown.post.category.clicks / pageTypeBreakdown.post.category.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.category.impressions > 0 ? (pageTypeBreakdown.post.category.impPosSum / pageTypeBreakdown.post.category.impressions).toFixed(1) : 'N/A'
      },
      guides: {
        impressions: pageTypeBreakdown.post.guides.impressions,
        clicks: pageTypeBreakdown.post.guides.clicks,
        ctr: pageTypeBreakdown.post.guides.impressions > 0 ? ((pageTypeBreakdown.post.guides.clicks / pageTypeBreakdown.post.guides.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.guides.impressions > 0 ? (pageTypeBreakdown.post.guides.impPosSum / pageTypeBreakdown.post.guides.impressions).toFixed(1) : 'N/A'
      },
      core: {
        impressions: pageTypeBreakdown.post.core.impressions,
        clicks: pageTypeBreakdown.post.core.clicks,
        ctr: pageTypeBreakdown.post.core.impressions > 0 ? ((pageTypeBreakdown.post.core.clicks / pageTypeBreakdown.post.core.impressions) * 100).toFixed(2) + '%' : '0%',
        weightedPos: pageTypeBreakdown.post.core.impressions > 0 ? (pageTypeBreakdown.post.core.impPosSum / pageTypeBreakdown.post.core.impressions).toFixed(1) : 'N/A'
      }
    }
  },
  recoveryStateTotals: recoveryCounts,
  recoveryStateByPageType: recoveryByPageType,
  quarantineSafetyBreakdown: quarantineSafety,
  clickEarningUrlsCount: clickEarningUrls.length,
  clickEarningUrls,
  top100RecoveryOpportunities: top100Recovery,
  highRankingQueries,
  items: mergedMap
};

const mapOutputPath = path.join(reportsDir, 'gsc-recovery-map.json');
fs.writeFileSync(mapOutputPath, JSON.stringify(finalManifest, null, 2), 'utf8');

console.log('✅ GSC Recovery Map generation complete!');
console.log('----------------------------------------------------');
console.log(`Total URLs Processed: ${finalManifest.totalUrls}`);
console.log(`P - PROTECT:               ${recoveryCounts.P} (${((recoveryCounts.P / recoveryCounts.total) * 100).toFixed(1)}%)`);
console.log(`R - RECOVER:               ${recoveryCounts.R} (${((recoveryCounts.R / recoveryCounts.total) * 100).toFixed(1)}%)`);
console.log(`K - KEEP:                  ${recoveryCounts.K} (${((recoveryCounts.K / recoveryCounts.total) * 100).toFixed(1)}%)`);
console.log(`Q - QUARANTINE CANDIDATE:  ${recoveryCounts.Q} (${((recoveryCounts.Q / recoveryCounts.total) * 100).toFixed(1)}%)`);
console.log(`T - TECHNICAL / NAV:       ${recoveryCounts.T} (${((recoveryCounts.T / recoveryCounts.total) * 100).toFixed(1)}%)`);
console.log('----------------------------------------------------');
console.log('Quarantine Cohort Safety Sub-Tiers:');
console.log(`Q1 (Very Safe):            ${quarantineSafety.Q1_VERY_SAFE.count} URLs (Pre: ${quarantineSafety.Q1_VERY_SAFE.preImp} imp / ${quarantineSafety.Q1_VERY_SAFE.preClicks} clicks)`);
console.log(`Q2 (Probably Safe):        ${quarantineSafety.Q2_PROBABLY_SAFE.count} URLs (Pre: ${quarantineSafety.Q2_PROBABLY_SAFE.preImp} imp / ${quarantineSafety.Q2_PROBABLY_SAFE.preClicks} clicks)`);
console.log(`Q3 (Review Before Hold):   ${quarantineSafety.Q3_REVIEW_BEFORE_HOLD.count} URLs (Pre: ${quarantineSafety.Q3_REVIEW_BEFORE_HOLD.preImp} imp / ${quarantineSafety.Q3_REVIEW_BEFORE_HOLD.preClicks} clicks)`);
console.log('----------------------------------------------------');
console.log(`📄 Saved recovery map manifest to: ${mapOutputPath}`);

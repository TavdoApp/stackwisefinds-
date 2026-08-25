/**
 * StakDock Recovery Baseline & Checkpoint Analyzer (Phase 3C / 3D)
 * 
 * Usage:
 *   node scripts/audit/generateRecoveryBaseline.cjs
 *     -> Generates/refreshes reports/recovery-baseline-2026-08-25.json & .md
 * 
 *   node scripts/audit/generateRecoveryBaseline.cjs --checkpoint <path_to_gsc_export_dir>
 *     -> Evaluates a new post-deployment checkpoint against the baseline
 *     -> Generates reports/recovery-checkpoint-[date].json & .md
 */

const fs = require('fs');
const path = require('path');

const preCrashDir = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'pre-crash');
const postCrashDir = path.join(__dirname, '..', '..', 'data', 'gsc-exports', 'post-crash');
const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryMap = new Map((recoveryData.items || []).map(i => [i.url, i]));

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const lines = content.split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let insideQuotes = false;
    let currentVal = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
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

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(obj);
  }
  return rows;
}

// Parse command-line args for checkpoint mode
const args = process.argv.slice(2);
const checkpointFlagIdx = args.indexOf('--checkpoint');
const isCheckpointMode = checkpointFlagIdx !== -1 && args[checkpointFlagIdx + 1];
const checkpointDir = isCheckpointMode ? path.resolve(args[checkpointFlagIdx + 1]) : null;

if (isCheckpointMode) {
  console.log(`🔍 Processing Checkpoint from: ${checkpointDir}`);
  if (!fs.existsSync(checkpointDir)) {
    console.error(`❌ Checkpoint directory not found: ${checkpointDir}`);
    process.exit(1);
  }

  const cpChart = parseCsv(path.join(checkpointDir, 'Chart.csv'));
  const cpPages = parseCsv(path.join(checkpointDir, 'Pages.csv'));
  const cpQueries = parseCsv(path.join(checkpointDir, 'Queries.csv'));

  const baselineJsonPath = path.join(__dirname, '..', '..', 'reports', 'recovery-baseline-2026-08-25.json');
  if (!fs.existsSync(baselineJsonPath)) {
    console.error(`❌ Baseline file not found: ${baselineJsonPath}`);
    process.exit(1);
  }
  const baseline = JSON.parse(fs.readFileSync(baselineJsonPath, 'utf8'));

  let cpClicks = 0;
  let cpImps = 0;
  let cpWeightedPosSum = 0;
  cpChart.forEach(r => {
    const c = parseInt(r.Clicks, 10) || 0;
    const i = parseInt(r.Impressions, 10) || 0;
    const p = parseFloat(r.Position) || 0;
    cpClicks += c;
    cpImps += i;
    cpWeightedPosSum += p * i;
  });

  const cpDays = cpChart.length || 1;
  const cpDailyImps = Math.round(cpImps / cpDays);
  const cpDailyClicks = (cpClicks / cpDays).toFixed(1);
  const cpAvgCtr = ((cpClicks / (cpImps || 1)) * 100).toFixed(2) + '%';
  const cpAvgPos = (cpWeightedPosSum / (cpImps || 1)).toFixed(1);
  const cpRecoveryRatio = ((cpDailyImps / baseline.searchMetrics.preCrash.dailyImpressionsAverage) * 100).toFixed(2) + '%';

  const cpDate = cpChart[cpChart.length - 1] ? cpChart[cpChart.length - 1].Date : new Date().toISOString().split('T')[0];

  // Evaluate Decision Signal
  let decisionSignal = 'NEUTRAL';
  let decisionReason = 'Performance is within stable observation variance.';
  if (cpDailyImps >= baseline.searchMetrics.preCrash.dailyImpressionsAverage * 0.1 || cpDailyClicks >= 1.0) {
    decisionSignal = 'STRONG POSITIVE';
    decisionReason = 'Daily impressions have increased beyond 10% milestone or regular clicks have resumed.';
  } else if (cpDailyImps < 10 && cpDays >= 7) {
    decisionSignal = 'NEGATIVE';
    decisionReason = 'Active URL search impressions continue to trend downwards after 7+ days of recrawl.';
  }

  const checkpointData = {
    checkpointDate: cpDate,
    evaluationDate: new Date().toISOString().split('T')[0],
    decisionSignal,
    decisionReason,
    metrics: {
      dailyImpressions: cpDailyImps,
      dailyClicks: cpDailyClicks,
      averageCtr: cpAvgCtr,
      averagePosition: cpAvgPos,
      trackedQueries: cpQueries.length,
      trackedPages: cpPages.length,
      recoveryRatio: cpRecoveryRatio,
      preCrashBaselineDailyImps: baseline.searchMetrics.preCrash.dailyImpressionsAverage
    }
  };

  const cpOutJson = path.join(__dirname, '..', '..', 'reports', `recovery-checkpoint-${cpDate}.json`);
  fs.writeFileSync(cpOutJson, JSON.stringify(checkpointData, null, 2), 'utf8');

  const cpOutMd = path.join(__dirname, '..', '..', 'reports', `recovery-checkpoint-${cpDate}.md`);
  const cpMdContent = `# StakDock Recovery Checkpoint — ${cpDate}

**Checkpoint Date**: ${cpDate}  
**Decision Signal**: **\`${decisionSignal}\`**  
**Assessment**: ${decisionReason}  

---

## 1. Checkpoint Performance Summary

| Metric | Pre-Crash Baseline | 2026-08-25 Baseline | Current Checkpoint (${cpDate}) | Delta vs Baseline |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Impressions** | ${baseline.searchMetrics.preCrash.dailyImpressionsAverage} / day | 17 / day | **${cpDailyImps} / day** | ${cpDailyImps - 17 >= 0 ? '+' : ''}${cpDailyImps - 17} imps/day |
| **Daily Clicks** | ${baseline.searchMetrics.preCrash.dailyClicksAverage} / day | 0.0 / day | **${cpDailyClicks} / day** | ${cpDailyClicks} clicks/day |
| **Average CTR** | ${baseline.searchMetrics.preCrash.averageCtr} | 0.00% | **${cpAvgCtr}** | — |
| **Average Position** | ${baseline.searchMetrics.preCrash.averagePosition} | 67.2 | **${cpAvgPos}** | — |
| **Recovery Ratio** | 100.0% | 0.68% | **${cpRecoveryRatio}** | — |

---

## 2. Recommended Next Step

${decisionSignal === 'STRONG POSITIVE' 
  ? 'Positive momentum confirmed. Prepare Wave 2 candidate specs for review.' 
  : (decisionSignal === 'NEUTRAL' 
      ? 'Continue holding in observation mode. Do not make architectural changes.' 
      : 'Perform root-cause diagnostics on crawl errors or index coverage before any page modifications.')}
`;

  fs.writeFileSync(cpOutMd, cpMdContent, 'utf8');
  console.log(`✅ Generated ${cpOutJson}`);
  console.log(`✅ Generated ${cpOutMd}`);
  process.exit(0);
}

// Default Mode: Generate Baseline
const preChart = parseCsv(path.join(preCrashDir, 'Chart.csv'));
const prePages = parseCsv(path.join(preCrashDir, 'Pages.csv'));
const preQueries = parseCsv(path.join(preCrashDir, 'Queries.csv'));

const postChart = parseCsv(path.join(postCrashDir, 'Chart.csv'));
const postPages = parseCsv(path.join(postCrashDir, 'Pages.csv'));
const postQueries = parseCsv(path.join(postCrashDir, 'Queries.csv'));

// Pre-crash metrics (Aug 2 - Aug 16)
let preTotalClicks = 0;
let preTotalImpressions = 0;
let preWeightedPositionSum = 0;
preChart.forEach(row => {
  if (row.Date < '2026-08-17') {
    const clicks = parseInt(row.Clicks, 10) || 0;
    const imps = parseInt(row.Impressions, 10) || 0;
    const pos = parseFloat(row.Position) || 0;
    preTotalClicks += clicks;
    preTotalImpressions += imps;
    preWeightedPositionSum += pos * imps;
  }
});
const preDaysCount = preChart.filter(r => r.Date < '2026-08-17').length || 15;
const preDailyImps = Math.round(preTotalImpressions / preDaysCount);
const preDailyClicks = (preTotalClicks / preDaysCount).toFixed(1);
const preAvgCtr = ((preTotalClicks / (preTotalImpressions || 1)) * 100).toFixed(2) + '%';
const preAvgPos = (preWeightedPositionSum / (preTotalImpressions || 1)).toFixed(1);

// Post-crash metrics (Aug 18 - Aug 24)
let postTotalClicks = 0;
let postTotalImpressions = 0;
let postWeightedPositionSum = 0;
postChart.forEach(row => {
  if (row.Date >= '2026-08-18') {
    const clicks = parseInt(row.Clicks, 10) || 0;
    const imps = parseInt(row.Impressions, 10) || 0;
    const pos = parseFloat(row.Position) || 0;
    postTotalClicks += clicks;
    postTotalImpressions += imps;
    postWeightedPositionSum += pos * imps;
  }
});
const postDaysCount = postChart.filter(r => r.Date >= '2026-08-18').length || 7;
const postDailyImps = Math.round(postTotalImpressions / postDaysCount);
const postDailyClicks = (postTotalClicks / postDaysCount).toFixed(1);
const postAvgCtr = ((postTotalClicks / (postTotalImpressions || 1)) * 100).toFixed(2) + '%';
const postAvgPos = (postWeightedPositionSum / (postTotalImpressions || 1)).toFixed(1);

// Latest day baseline (Aug 24, 2026)
const latestDay = postChart[postChart.length - 1] || { Date: '2026-08-24', Impressions: '17', Clicks: '0', CTR: '0%', Position: '67.2' };
const currentRecoveryRatio = ((parseInt(latestDay.Impressions, 10) / preDailyImps) * 100).toFixed(2) + '%';

const prePagesMap = new Map();
prePages.forEach(p => {
  const urlPath = p['Top pages'] ? p['Top pages'].replace('https://stakdock.com', '') : '';
  prePagesMap.set(urlPath, {
    clicks: parseInt(p.Clicks, 10) || 0,
    impressions: parseInt(p.Impressions, 10) || 0,
    ctr: p.CTR,
    position: parseFloat(p.Position) || 0
  });
});

const postPagesMap = new Map();
postPages.forEach(p => {
  const urlPath = p['Top pages'] ? p['Top pages'].replace('https://stakdock.com', '') : '';
  postPagesMap.set(urlPath, {
    clicks: parseInt(p.Clicks, 10) || 0,
    impressions: parseInt(p.Impressions, 10) || 0,
    ctr: p.CTR,
    position: parseFloat(p.Position) || 0
  });
});

// Wave 1 URLs Baseline
const wave1Targets = [
  {
    url: '/alternatives/invoice-ninja/',
    name: 'Invoice Ninja Alternatives',
    cluster: 'Invoicing & Billing',
    primaryQuery: 'invoice ninja alternatives',
    rationale: 'High commercial intent; top-converting category page with multiple direct open-source & SaaS substitutes.'
  },
  {
    url: '/software/microsoft-power-automate/',
    name: 'Microsoft Power Automate',
    cluster: 'Workflow Automation',
    primaryQuery: 'microsoft power automate pricing / review',
    rationale: 'Enterprise automation keyword earner; high search volume for desktop vs cloud pricing models.'
  },
  {
    url: '/software/all-in-one-seo-aioseo/',
    name: 'All in One SEO (AIOSEO)',
    cluster: 'SEO Software',
    primaryQuery: 'aioseo review / aioseo pricing',
    rationale: 'High-volume WordPress SEO query earner with strong pre-crash impressions.'
  },
  {
    url: '/software/screaming-frog-seo-spider/',
    name: 'Screaming Frog SEO Spider',
    cluster: 'SEO Software',
    primaryQuery: 'screaming frog seo spider review / pricing',
    rationale: 'Industry-standard technical audit tool; core pillar of the SEO tooling cluster.'
  },
  {
    url: '/vs/moz-pro-vs-se-ranking/',
    name: 'Moz Pro vs SE Ranking',
    cluster: 'SEO Software',
    primaryQuery: 'moz pro vs se ranking',
    rationale: 'High-intent agency buyer query comparing Domain Authority vs daily tracking.'
  },
  {
    url: '/vs/screaming-frog-seo-spider-vs-se-ranking/',
    name: 'Screaming Frog vs SE Ranking',
    cluster: 'SEO Software',
    primaryQuery: 'screaming frog vs se ranking',
    rationale: 'Architectural comparison between desktop crawlers and cloud suites with strong organic search demand.'
  },
  {
    url: '/best/invoicing/',
    name: 'Best Invoicing Software',
    cluster: 'Invoicing & Billing',
    primaryQuery: 'best invoicing software 2026',
    rationale: 'High commercial CPC category hub connecting Invoice Ninja, Wave, Zoho, QBO, and Xero.'
  }
];

const wave1Baseline = wave1Targets.map(target => {
  const pre = prePagesMap.get(target.url) || { clicks: 0, impressions: 0, position: 0 };
  const post = postPagesMap.get(target.url) || { clicks: 0, impressions: 0, position: 0 };
  const recItem = recoveryMap.get(target.url) || { recoveryState: 'R' };

  return {
    url: target.url,
    name: target.name,
    cluster: target.cluster,
    recoveryState: recItem.recoveryState,
    primaryQuery: target.primaryQuery,
    rationale: target.rationale,
    preCrash: {
      impressions: pre.impressions,
      clicks: pre.clicks,
      position: pre.position ? pre.position.toFixed(1) : 'N/A'
    },
    postCrash: {
      impressions: post.impressions,
      clicks: post.clicks,
      position: post.position ? post.position.toFixed(1) : 'N/A'
    },
    deploymentDate: '2026-08-25',
    status: 'LIVE'
  };
});

// Top 8 Additional Priority Candidates (Total 15 Queue)
const eligibleAdditional = [];
prePages.forEach(p => {
  const urlPath = p['Top pages'] ? p['Top pages'].replace('https://stakdock.com', '') : '';
  if (!urlPath || urlPath === '/' || wave1Targets.some(w => w.url === urlPath)) return;

  const item = recoveryMap.get(urlPath);
  if (!item || !['P', 'R', 'K'].includes(item.recoveryState)) return;

  const clicks = parseInt(p.Clicks, 10) || 0;
  const imps = parseInt(p.Impressions, 10) || 0;
  const pos = parseFloat(p.Position) || 100;

  if (imps >= 10 || clicks >= 1) {
    eligibleAdditional.push({
      url: urlPath,
      recoveryState: item.recoveryState,
      clicks,
      impressions: imps,
      position: pos.toFixed(1)
    });
  }
});

eligibleAdditional.sort((a, b) => (b.clicks - a.clicks) || (b.impressions - a.impressions) || (parseFloat(a.position) - parseFloat(b.position)));
const top8Additional = eligibleAdditional.slice(0, 8);

const manual15Queue = [
  ...wave1Baseline.map((w, idx) => ({
    priorityIndex: idx + 1,
    category: 'Wave 1 (Deployed & Live)',
    url: w.url,
    recoveryState: w.recoveryState,
    reason: w.rationale,
    preCrashImps: w.preCrash.impressions,
    preCrashClicks: w.preCrash.clicks
  })),
  ...top8Additional.map((a, idx) => ({
    priorityIndex: idx + 8,
    category: 'High-Value Recovery Candidate',
    url: a.url,
    recoveryState: a.recoveryState,
    reason: `Proven historical earner (${a.clicks} clicks, ${a.impressions} imps, avg pos ${a.position}) with demonstrated organic demand.`,
    preCrashImps: a.impressions,
    preCrashClicks: a.clicks
  }))
];

// Wave 2 Candidates (12 high opportunity URLs from P and R)
const wave2CandidatesPool = [];
prePages.forEach(p => {
  const urlPath = p['Top pages'] ? p['Top pages'].replace('https://stakdock.com', '') : '';
  if (!urlPath || urlPath === '/' || wave1Targets.some(w => w.url === urlPath) || top8Additional.some(t => t.url === urlPath)) return;

  const item = recoveryMap.get(urlPath);
  if (!item || !['P', 'R'].includes(item.recoveryState)) return;

  const clicks = parseInt(p.Clicks, 10) || 0;
  const imps = parseInt(p.Impressions, 10) || 0;
  const pos = parseFloat(p.Position) || 100;

  let pageType = 'software';
  if (urlPath.startsWith('/alternatives/')) pageType = 'alternatives';
  else if (urlPath.startsWith('/vs/')) pageType = 'vs';
  else if (urlPath.startsWith('/best/')) pageType = 'best';
  else if (urlPath.startsWith('/guides/')) pageType = 'guide';

  let cluster = 'Developer & Cloud Infrastructure';
  if (/seo|rank|moz|frog/i.test(urlPath)) cluster = 'SEO Software';
  else if (/invoice|bill|accounting/i.test(urlPath)) cluster = 'Invoicing & Billing';
  else if (/automate|make|n8n|zapier/i.test(urlPath)) cluster = 'Workflow Automation';
  else if (/ai|copilot|cursor|model/i.test(urlPath)) cluster = 'AI & Developer Tools';

  wave2CandidatesPool.push({
    url: urlPath,
    recoveryState: item.recoveryState,
    pageType,
    cluster,
    preCrashImps: imps,
    preCrashClicks: clicks,
    preCrashPos: pos.toFixed(1)
  });
});

wave2CandidatesPool.sort((a, b) => (b.preCrashClicks - a.preCrashClicks) || (b.preCrashImps - a.preCrashImps));
const wave2Candidates = wave2CandidatesPool.slice(0, 12).map((c, idx) => ({
  rank: idx + 1,
  url: c.url,
  recoveryState: c.recoveryState,
  pageType: c.pageType,
  cluster: c.cluster,
  preCrashOpportunity: `${c.preCrashImps} impressions, ${c.preCrashClicks} clicks (avg pos ${c.preCrashPos})`,
  primaryQuery: c.url.replace(/^\/(software|alternatives|vs|best|guides)\//, '').replace(/\/$/, '').replace(/-/g, ' '),
  currentQualityWeakness: 'Baseline directory template; lacks rich comparative spec matrices, verified pricing tiers, and vendor documentation citations.',
  expectedImprovement: 'Enrich with corroborated spec comparison table, transparent pricing breakdown, and evidence-grounded pros/cons.',
  commercialIntent: c.pageType === 'vs' || c.pageType === 'alternatives' ? 'High Commercial Intent (Buyer Comparison)' : 'Commercial Evaluation Intent',
  priority: idx < 5 ? 'High' : 'Medium'
}));

// Build JSON
const baselineData = {
  baselineDate: '2026-08-25',
  domain: 'https://stakdock.com',
  summary: {
    totalSystemRoutes: 4174,
    activeIndexableSitemapUrls: 841,
    recoveryBreakdown: { P: 73, R: 740, K: 28, Q: 3330, T: 3 }
  },
  searchMetrics: {
    preCrash: {
      period: '2026-08-02 to 2026-08-16 (15 days)',
      totalImpressions: preTotalImpressions,
      totalClicks: preTotalClicks,
      dailyImpressionsAverage: preDailyImps,
      dailyClicksAverage: preDailyClicks,
      averageCtr: preAvgCtr,
      averagePosition: preAvgPos,
      totalQueriesTracked: preQueries.length,
      totalPagesTracked: prePages.length
    },
    crashPeriod: {
      period: '2026-08-18 to 2026-08-24 (7 days)',
      totalImpressions: postTotalImpressions,
      totalClicks: postTotalClicks,
      dailyImpressionsAverage: postDailyImps,
      dailyClicksAverage: postDailyClicks,
      averageCtr: postAvgCtr,
      averagePosition: postAvgPos,
      impressionDropPercentage: (((preDailyImps - postDailyImps) / preDailyImps) * 100).toFixed(1) + '%'
    },
    currentDayBaseline: {
      date: latestDay.Date,
      dailyImpressions: parseInt(latestDay.Impressions, 10),
      dailyClicks: parseInt(latestDay.Clicks, 10),
      ctr: latestDay.CTR,
      position: parseFloat(latestDay.Position),
      recoveryRatio: currentRecoveryRatio
    }
  },
  wave1Baseline,
  manual15Queue,
  wave2Candidates
};

// Write JSON
const outputJsonPath = path.join(__dirname, '..', '..', 'reports', 'recovery-baseline-2026-08-25.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(baselineData, null, 2), 'utf8');

// Write Markdown Report
const outputMdPath = path.join(__dirname, '..', '..', 'reports', 'recovery-baseline-2026-08-25.md');
const mdContent = `# StakDock Recovery Baseline & Measurement Framework (Phase 3C)

**Baseline Date**: August 25, 2026  
**Domain**: \`https://stakdock.com\`  
**Active Search Footprint**: 841 URLs (P=73, R=740, K=28)  
**Quarantined Footprint**: 3,330 URLs (Q=3,330)

---

## 1. Domain Performance Summary

| Metric | Pre-Crash Baseline (Aug 2–16) | Crash Period (Aug 18–24) | Current Baseline (Aug 24) | Recovery Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Impressions** | **${preDailyImps} / day** | 157 / day | **17 / day** | **${currentRecoveryRatio}** |
| **Daily Clicks** | **${preDailyClicks} / day** | 0.1 / day | **0 / day** | 0.00% |
| **Average CTR** | **${preAvgCtr}** | 0.09% | 0.00% | — |
| **Average Position** | **${preAvgPos}** | 42.6 | 67.2 | — |
| **Tracked Queries** | **1,004** | 93 | 11 | 1.10% |
| **Tracked Pages** | **1,000** | 92 | 11 | 1.10% |

---

## 2. Wave 1 Live Baseline Table

| URL | Cluster | State | Pre-Crash Imps (Pos) | Post-Crash Imps (Pos) | Pre Clicks | Post Clicks | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${wave1Baseline.map(w => `| \`${w.url}\` | ${w.cluster} | \`${w.recoveryState}\` | ${w.preCrash.impressions} (${w.preCrash.position}) | ${w.postCrash.impressions} (${w.postCrash.position}) | ${w.preCrash.clicks} | ${w.postCrash.clicks} | **LIVE** |`).join('\n')}

---

## 3. Top 15 Priority Indexing Queue (Manual GSC Request List)

| # | Priority | URL | State | Reason / Evidence Basis | Pre Imps | Pre Clicks |
| :-: | :--- | :--- | :-: | :--- | :-: | :-: |
${manual15Queue.map(q => `| ${q.priorityIndex} | **${q.category}** | \`${q.url}\` | \`${q.recoveryState}\` | ${q.reason} | ${q.preCrashImps} | ${q.preCrashClicks} |`).join('\n')}

---

## 4. Recovery Milestones Framework

| Milestone | Target Daily Impressions | Target Daily Clicks | Expected Search Engine Behavior |
| :--- | :--- | :--- | :--- |
| **RECOVERY 10%** | ~250 / day | ~1 / day | Google recrawls cleaned sitemap; Wave 1 URLs begin re-indexing and earning impressions. |
| **RECOVERY 25%** | ~625 / day | ~2 / day | Meaningful visibility returns across SEO and Invoicing topic clusters. |
| **RECOVERY 50%** | ~1,250 / day | ~3 / day | Algorithmic quality reassessment underway; core comparison pages regain top 20 rankings. |
| **RECOVERY 75%** | ~1,875 / day | ~4–5 / day | Majority of pre-crash keyword footprint restored across P and R URLs. |
| **RECOVERY 100%** | **2,500 / day** | **6+ / day** | Complete baseline restoration; healthy crawl budget established on 841 clean URLs. |
| **GROWTH MODE** | > 3,500 / day | > 10 / day | Expansion of high-entropy editorial hubs and curated software comparisons. |

---

## 5. Wave 2 Candidate Queue (12 Prepared High-Opportunity URLs)

*Note: These URLs are identified for future consideration based on pre-crash performance. DO NOT IMPLEMENT YET.*

| # | Candidate URL | State | Type | Cluster | Pre-Crash Opportunity | Primary Search Query | Commercial Intent |
| :-: | :--- | :-: | :--- | :--- | :--- | :--- | :--- |
${wave2Candidates.map(c => `| ${c.rank} | \`${c.url}\` | \`${c.recoveryState}\` | \`${c.pageType}\` | ${c.cluster} | ${c.preCrashOpportunity} | "${c.primaryQuery}" | ${c.commercialIntent} |`).join('\n')}

---

## 6. Topic Cluster Opportunity Analysis

1. **SEO Software Cluster** (AIOSEO, Screaming Frog, Moz Pro, SE Ranking, seoClarity, Rank Math):
   - **GSC Evidence**: Generated >4,000 pre-crash impressions and multiple high-intent clicks.
   - **Opportunity**: Agency and in-house marketing buyers actively compare feature matrices (daily tracking, desktop vs cloud, DA/PA).
2. **Invoicing & Billing Cluster** (Invoice Ninja, Wave Invoicing, Zoho Invoice, QuickBooks, Xero):
   - **GSC Evidence**: Highest post-crash impression resilience (Invoice Ninja alternatives earned 451 impressions at avg pos 6.46).
   - **Opportunity**: Clear operational differentiator (open-source vs free hosted vs double-entry accounting).
3. **Workflow Automation Cluster** (Microsoft Power Automate, Make, n8n, Zapier):
   - **GSC Evidence**: Generated ~2,000 pre-crash impressions on enterprise search queries.
   - **Opportunity**: Enterprise pricing ambiguity (attended desktop RPA vs cloud licensing).
4. **Developer & Infrastructure Cluster** (Kuzu DB, Telegraph, Headlamp K8s, Vendure, Databox, Hetzner, Vultr):
   - **GSC Evidence**: High CTRs and top-10 average positions on specific developer tooling searches.
`;

fs.writeFileSync(outputMdPath, mdContent, 'utf8');

console.log('✅ Generated reports/recovery-baseline-2026-08-25.md');

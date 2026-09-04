const fs = require('fs');
const path = require('path');

console.log('📈 Running StakDock GSC Performance & Striking-Distance Engine...');

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(l => {
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') inQuotes = !inQuotes;
      else if (c === ',' && !inQuotes) {
        parts.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else cur += c;
    }
    parts.push(cur.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = parts[idx] !== undefined ? parts[idx] : '';
    });
    return obj;
  });
}

const prePages = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'pre-crash', 'Pages.csv'));
const postPages = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'post-crash', 'Pages.csv'));
const postQueries = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'post-crash', 'Queries.csv'));

const pagePerformance = new Map();

prePages.forEach(p => {
  let url = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
  if (!url.startsWith('/')) url = '/' + url;
  if (!url.endsWith('/')) url = url + '/';

  pagePerformance.set(url, {
    url,
    preImpr: parseFloat(p.Impressions) || 0,
    preClicks: parseFloat(p.Clicks) || 0,
    prePos: parseFloat(p.Position) || 0,
    postImpr: 0,
    postClicks: 0,
    postPos: 0
  });
});

postPages.forEach(p => {
  let url = p['Top pages'].replace(/^https?:\/\/[^\/]+/, '');
  if (!url.startsWith('/')) url = '/' + url;
  if (!url.endsWith('/')) url = url + '/';

  const cur = pagePerformance.get(url) || {
    url,
    preImpr: 0,
    preClicks: 0,
    prePos: 0,
    postImpr: 0,
    postClicks: 0,
    postPos: 0
  };

  cur.postImpr = parseFloat(p.Impressions) || 0;
  cur.postClicks = parseFloat(p.Clicks) || 0;
  cur.postPos = parseFloat(p.Position) || 0;
  pagePerformance.set(url, cur);
});

const report = {
  reportDate: new Date().toISOString(),
  newWinners: [],
  rising: [],
  flat: [],
  declining: [],
  strikingDistancePages: [],
  newQueries: []
};

pagePerformance.forEach(item => {
  // Striking distance: average position between 8.0 and 30.0
  const activePos = item.postPos > 0 ? item.postPos : item.prePos;
  if (activePos >= 8.0 && activePos <= 35.0 && (item.postImpr > 0 || item.preImpr > 10)) {
    report.strikingDistancePages.push({
      url: item.url,
      currentPosition: activePos,
      impressions: item.postImpr || item.preImpr,
      clicks: item.postClicks || item.preClicks,
      recommendedAction: 'Optimize title snippet, add 2 internal links from parent Best Hub, and expand specification table.'
    });
  }

  // Classification
  if (item.postImpr > 50 && item.preImpr < 50) {
    report.newWinners.push(item);
  } else if (item.postImpr > item.preImpr && item.postImpr > 0) {
    report.rising.push(item);
  } else if (item.postImpr > 0 && Math.abs(item.postImpr - item.preImpr) < 10) {
    report.flat.push(item);
  } else if (item.preImpr > 50 && item.postImpr < 10) {
    report.declining.push(item);
  }
});

// Emerging queries
postQueries.forEach(q => {
  const queryText = q['Top queries'];
  const impr = parseFloat(q.Impressions) || 0;
  const clicks = parseFloat(q.Clicks) || 0;
  const pos = parseFloat(q.Position) || 0;

  if (impr > 5 || clicks > 0) {
    report.newQueries.push({
      query: queryText,
      impressions: impr,
      clicks,
      position: pos
    });
  }
});

report.strikingDistancePages.sort((a, b) => a.currentPosition - b.currentPosition);
report.newQueries.sort((a, b) => b.impressions - a.impressions);

console.log(`📊 GSC Intelligence Analysis:`);
console.log(`   - Striking Distance Pages (Pos 8-35): ${report.strikingDistancePages.length}`);
console.log(`   - New Winners:                        ${report.newWinners.length}`);
console.log(`   - Rising URLs:                        ${report.rising.length}`);
console.log(`   - Tracked Emerging Queries:           ${report.newQueries.length}`);

const reportOutputPath = path.join(__dirname, '..', 'reports', 'gsc-monitoring-report.json');
fs.writeFileSync(reportOutputPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`✅ Machine-readable GSC monitoring report saved to reports/gsc-monitoring-report.json`);

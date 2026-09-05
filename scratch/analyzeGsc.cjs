const fs = require('fs');
const path = require('path');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(l => {
    // Basic CSV row split handling quotes
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        parts.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += c;
      }
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
console.log('Pre-crash Pages.csv count:', prePages.length);
if (prePages.length > 0) {
  console.log('Top 15 pre-crash pages by impressions:');
  const sorted = [...prePages].sort((a, b) => (parseFloat(b.Impressions) || 0) - (parseFloat(a.Impressions) || 0));
  sorted.slice(0, 15).forEach(p => {
    console.log(`Page: ${p['Top pages']} | Clicks: ${p.Clicks} | Impr: ${p.Impressions} | CTR: ${p.CTR} | Pos: ${p.Position}`);
  });
}

const postPages = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'post-crash', 'Pages.csv'));
console.log('\nPost-crash Pages.csv count:', postPages.length);
if (postPages.length > 0) {
  console.log('Top 15 post-crash pages by impressions:');
  const sortedPost = [...postPages].sort((a, b) => (parseFloat(b.Impressions) || 0) - (parseFloat(a.Impressions) || 0));
  sortedPost.slice(0, 15).forEach(p => {
    console.log(`Page: ${p['Top pages']} | Clicks: ${p.Clicks} | Impr: ${p.Impressions} | CTR: ${p.CTR} | Pos: ${p.Position}`);
  });
}

const preQueries = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'pre-crash', 'Queries.csv'));
console.log('\nPre-crash Queries.csv count:', preQueries.length);
if (preQueries.length > 0) {
  console.log('Top 15 pre-crash queries by impressions:');
  const sortedQ = [...preQueries].sort((a, b) => (parseFloat(b.Impressions) || 0) - (parseFloat(a.Impressions) || 0));
  sortedQ.slice(0, 15).forEach(q => {
    console.log(`Query: ${q['Top queries']} | Clicks: ${q.Clicks} | Impr: ${q.Impressions} | CTR: ${q.CTR} | Pos: ${q.Position}`);
  });
}

const preChart = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'pre-crash', 'Chart.csv'));
console.log('\nPre-crash Chart.csv timeline:');
preChart.forEach(row => {
  console.log(`Date: ${row.Date} | Clicks: ${row.Clicks} | Impr: ${row.Impressions} | CTR: ${row.CTR} | Pos: ${row.Position}`);
});

const postChart = parseCsv(path.join(__dirname, '..', 'data', 'gsc-exports', 'post-crash', 'Chart.csv'));
console.log('\nPost-crash Chart.csv timeline:');
postChart.forEach(row => {
  console.log(`Date: ${row.Date} | Clicks: ${row.Clicks} | Impr: ${row.Impressions} | CTR: ${row.CTR} | Pos: ${row.Position}`);
});

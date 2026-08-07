const fs = require('fs');
const content = fs.readFileSync('src/data/saasData.jsx', 'utf8');
const domainMatches = content.match(/"domain":/g);
console.log('TOTAL_TOOLS_COUNT:', domainMatches ? domainMatches.length : 0);

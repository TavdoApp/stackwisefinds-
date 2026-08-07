const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/saasData.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const matches = [...content.matchAll(/"category":\s*"([^"]+)"/g)].map(m => m[1]);
const counts = {};
matches.forEach(c => {
  counts[c] = (counts[c] || 0) + 1;
});

console.log('Category Counts in staticSaasTools:');
console.log(counts);
console.log('Total categories:', Object.keys(counts).length);
console.log('Total tool references:', matches.length);

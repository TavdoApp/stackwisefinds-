const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function testPrerenderQuality() {
  const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
  const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
  const allItems = recoveryData.items || [];
  const indexable = allItems.filter(i => i.recoveryState === 'P' || i.recoveryState === 'R' || i.recoveryState === 'K');
  
  console.log(`Testing quality for all ${indexable.length} indexable pages...`);

  const tools = readAllTools();
  const toolMap = new Map(tools.map(t => [t.id, t]));

  let thinCount = 0;
  let goodCount = 0;

  indexable.forEach(item => {
    if (item.url.startsWith('/software/')) {
      const slug = item.url.replace(/^\/software\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      if (!tool) {
        console.log(`[Missing Tool]: ${slug}`);
        thinCount++;
      } else {
        goodCount++;
      }
    } else if (item.url.startsWith('/alternatives/')) {
      const slug = item.url.replace(/^\/alternatives\//, '').replace(/\/$/, '');
      const tool = toolMap.get(slug);
      if (!tool) {
        console.log(`[Missing Tool for Alts]: ${slug}`);
        thinCount++;
      } else {
        goodCount++;
      }
    } else if (item.url.startsWith('/vs/')) {
      const slug = item.url.replace(/^\/vs\//, '').replace(/\/$/, '');
      const parts = slug.split('-vs-');
      if (parts.length !== 2 || !toolMap.has(parts[0]) || !toolMap.has(parts[1])) {
        console.log(`[Invalid VS Pair]: ${slug}`);
        thinCount++;
      } else {
        goodCount++;
      }
    } else {
      goodCount++;
    }
  });

  console.log(`Quality check result: Good=${goodCount}, Issues=${thinCount}`);
}

testPrerenderQuality().catch(console.error);

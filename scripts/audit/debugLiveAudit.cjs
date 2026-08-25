const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function debugLeaks() {
  const bodies = [
    { name: 'Moz vs SE', body: await fetchUrl('https://stakdock.com/vs/moz-pro-vs-se-ranking/') },
    { name: 'SF vs SE', body: await fetchUrl('https://stakdock.com/vs/screaming-frog-seo-spider-vs-se-ranking/') },
    { name: 'SEO Guide', body: await fetchUrl('https://stakdock.com/guides/best-all-in-one-seo-software-2026/') },
    { name: 'Auto Guide', body: await fetchUrl('https://stakdock.com/guides/best-workflow-automation-tools-2026/') },
    { name: 'Power Automate', body: await fetchUrl('https://stakdock.com/software/microsoft-power-automate/') }
  ];

  bodies.forEach(({ name, body }) => {
    ['file://', 'localhost', '127.0.0.1', 'C:\\Users'].forEach(term => {
      if (body.includes(term)) {
        const idx = body.indexOf(term);
        console.log(`[${name}] Matched '${term}' around: "${body.substring(Math.max(0, idx - 40), idx + 60)}"`);
      }
    });
  });

  const pa = bodies.find(b => b.name === 'Power Automate').body;
  console.log('Power Automate terms check:');
  console.log('  Includes RPA:', pa.includes('RPA'));
  console.log('  Includes $15:', pa.includes('$15'));
  console.log('  Includes Windows 10/11:', pa.includes('Windows 10/11'));
  console.log('  Includes Windows:', pa.includes('Windows'));
  console.log('  Includes Win10:', pa.includes('Win10'));
}

debugLeaks();

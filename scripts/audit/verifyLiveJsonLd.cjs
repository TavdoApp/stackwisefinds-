const https = require('https');

const urls = [
  '/software/all-in-one-seo-aioseo/',
  '/software/microsoft-power-automate/',
  '/software/screaming-frog-seo-spider/',
  '/alternatives/invoice-ninja/',
  '/vs/moz-pro-vs-se-ranking/',
  '/vs/screaming-frog-seo-spider-vs-se-ranking/',
  '/best/invoicing/'
];

async function verifyLiveJsonLd() {
  for (const urlPath of urls) {
    const fullUrl = `https://stakdock.com${urlPath}`;
    const body = await new Promise((res, rej) => {
      https.get(fullUrl, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(d));
      }).on('error', rej);
    });

    const scriptMatches = body.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
    console.log(`\n📄 ${urlPath} (JSON-LD Tags: ${scriptMatches.length})`);
    scriptMatches.forEach((tag, idx) => {
      const jsonStr = tag.replace(/<\/?script[^>]*>/gi, '');
      const parsed = JSON.parse(jsonStr);
      const types = parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).join(', ') : parsed['@type'];
      const str = JSON.stringify(parsed);
      const hasRating = str.includes('AggregateRating') || str.includes('reviewRating') || str.includes('ratingValue');
      console.log(`   [Tag ${idx + 1}] Type: ${types} | Rating Schema: ${hasRating ? '❌ FOUND' : '✅ None'}`);
    });
  }
}

verifyLiveJsonLd();

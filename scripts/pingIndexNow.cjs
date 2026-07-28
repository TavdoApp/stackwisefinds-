const fs = require('fs');
const path = require('path');
const https = require('https');

const host = 'stakdock.com';
const indexNowKey = process.env.INDEXNOW_KEY;

if (!indexNowKey) {
  console.error('INDEXNOW_KEY is not configured.');
  process.exit(1);
}

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/stakdock\.com[^<]+)<\/loc>/g)].map((match) => match[1]);

if (urlList.length === 0) {
  console.error('No canonical sitemap URLs were found.');
  process.exit(1);
}

const payload = JSON.stringify({
  host,
  key: indexNowKey,
  keyLocation: `https://${host}/${indexNowKey}.txt`,
  urlList
});

function postJson(endpoint) {
  return new Promise((resolve, reject) => {
    const request = https.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    }, (response) => {
      response.resume();
      resolve(response.statusCode);
    });

    request.on('error', reject);
    request.on('timeout', () => request.destroy(new Error('IndexNow request timed out.')));
    request.write(payload);
    request.end();
  });
}

(async () => {
  const [indexNowStatus, bingStatus] = await Promise.all([
    postJson('https://api.indexnow.org/indexnow'),
    postJson('https://www.bing.com/indexnow')
  ]);

  console.log(`Submitted ${urlList.length} canonical URLs. IndexNow: ${indexNowStatus}; Bing: ${bingStatus}.`);

  if (indexNowStatus >= 400 || bingStatus >= 400) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(`IndexNow ping failed: ${error.message}`);
  process.exit(1);
});
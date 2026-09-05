const https = require('https');

function fetchText(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', err => {
      resolve({ url, statusCode: 0, error: err.message, data: '' });
    });
  });
}

(async () => {
  console.log('Testing live sitemap and robots on https://stakdock.com...');
  const sitemap = await fetchText('https://stakdock.com/sitemap.xml');
  console.log(`Live sitemap statusCode: ${sitemap.statusCode}`);
  const sitemapUrls = [...sitemap.data.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);
  console.log(`Live sitemap URL count: ${sitemapUrls.length}`);

  const robots = await fetchText('https://stakdock.com/robots.txt');
  console.log(`Live robots.txt statusCode: ${robots.statusCode}`);
  console.log(`Robots content snippet:\n${robots.data.slice(0, 200)}...`);

  // Test redirect of /category/invoicing/
  const redirectTest = await fetchText('https://stakdock.com/category/invoicing/');
  console.log(`Redirect /category/invoicing/ statusCode: ${redirectTest.statusCode}, location: ${redirectTest.headers.location || 'NONE'}`);
})();

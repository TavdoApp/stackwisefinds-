const https = require('https');

function getUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve({ raw: body }); }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  const pending = await getUrl('https://stakdock.com/api/pending-submissions');
  const approved = await getUrl('https://stakdock.com/api/approved-submissions');
  console.log('Pending submissions API:', JSON.stringify(pending, null, 2));
  console.log('Approved submissions API:', JSON.stringify(approved, null, 2));
}

run();

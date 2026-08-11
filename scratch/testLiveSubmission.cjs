const https = require('https');

const data = JSON.stringify({
  vendorName: 'SuiteDash Test Team',
  softwareName: 'SuiteDash',
  softwareWebsite: 'https://suitedash.com',
  vendorEmail: 'support@suitedash.com',
  category: 'crm',
  packageType: 'free'
});

const req = https.request('https://stakdock.com/api/submit-vendor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Live Submission API Response:', body));
});

req.write(data);
req.end();

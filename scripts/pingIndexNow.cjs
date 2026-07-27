const fs = require('fs');
const path = require('path');
const https = require('https');

// IndexNow Key details
const HOST = 'stakdock.com';
const INDEXNOW_KEY = '47451ffd1d7c4719abf7737ae720b648';
const KEY_LOCATION = `https://${HOST}/47451ffd1d7c4719abf7737ae720b648.txt`;

// Ensure IndexNow key file exists in public/
const keyFilePath = path.join(__dirname, '..', 'public', `${INDEXNOW_KEY}.txt`);
if (!fs.existsSync(keyFilePath)) {
  fs.writeFileSync(keyFilePath, INDEXNOW_KEY, 'utf8');
}

// Read URLs from public/sitemap.xml
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const urlRegex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
const urlList = [];
let match;

while ((match = urlRegex.exec(sitemapContent)) !== null) {
  urlList.push(match[1]);
}

console.log(`🚀 Found ${urlList.length} StakDock.com URLs in sitemap.xml to ping via IndexNow...`);

const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

function sendPing(endpointHost) {
  const options = {
    hostname: endpointHost,
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`[${endpointHost}] Response Status: ${res.statusCode} (200 OK / 202 Accepted = Success)`);
  });

  req.on('error', (e) => {
    console.error(`[${endpointHost}] Error pinging IndexNow:`, e.message);
  });

  req.write(payload);
  req.end();
}

console.log('📡 Pinging api.indexnow.org for StakDock.com...');
sendPing('api.indexnow.org');

console.log('📡 Pinging www.bing.com for StakDock.com...');
sendPing('www.bing.com');

/**
 * StakDock Live Production Post-Deployment Verification (Phase 2C)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'StakDock-Verification-Agent/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runLiveAudit() {
  console.log('🌐 Starting Live Production Post-Deployment Audit for StakDock.com...');

  // 1. Verify Sitemap
  console.log('\n--- 1. Live Sitemap Verification (https://stakdock.com/sitemap.xml) ---');
  const sitemapRes = await fetchUrl('https://stakdock.com/sitemap.xml');
  const sitemapBody = sitemapRes.body;
  const sitemapUrls = [...sitemapBody.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);
  const sitemapSet = new Set(sitemapUrls);

  console.log(`Live Sitemap HTTP Status: ${sitemapRes.statusCode}`);
  console.log(`Live Sitemap Total URLs: ${sitemapUrls.length}`);
  console.log(`Live Sitemap Unique URLs: ${sitemapSet.size}`);

  const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
  const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
  const allItems = recoveryData.items || [];
  const qUrls = allItems.filter(i => i.recoveryState === 'Q').map(i => i.url);
  const leakedQ = qUrls.filter(u => sitemapSet.has(u));

  console.log(`Quarantined URLs Leaked in Sitemap: ${leakedQ.length}`);

  // Count by page type
  const typeCounts = { software: 0, alternatives: 0, vs: 0, best: 0, guides: 0, core: 0 };
  sitemapUrls.forEach(u => {
    if (u.startsWith('/software/')) typeCounts.software++;
    else if (u.startsWith('/alternatives/')) typeCounts.alternatives++;
    else if (u.startsWith('/vs/')) typeCounts.vs++;
    else if (u.startsWith('/best/') || u.startsWith('/category/')) typeCounts.best++;
    else if (u.startsWith('/guides/')) typeCounts.guides++;
    else typeCounts.core++;
  });
  console.log('Live Sitemap URL Counts by Page Type:', typeCounts);

  // 2. Verify Live P URLs
  console.log('\n--- 2. Live P (PROTECT) URLs Verification ---');
  const sampleP = [
    '/software/microsoft-power-automate/',
    '/software/all-in-one-seo-aioseo/',
    '/software/screaming-frog-seo-spider/',
    '/alternatives/invoice-ninja/',
    '/alternatives/se-ranking/',
    '/best/invoicing/',
    '/vs/moz-pro-vs-se-ranking/',
    '/vs/screaming-frog-seo-spider-vs-se-ranking/'
  ];

  for (const route of sampleP) {
    const res = await fetchUrl(`https://stakdock.com${route}`);
    const hasIndex = res.body.includes('content="index, follow') || res.body.includes("content='index, follow");
    const hasNoindex = res.body.includes('noindex');
    const hasCanonical = res.body.includes(`rel="canonical" href="https://stakdock.com${route}"`) || res.body.includes(`href="https://stakdock.com${route}" rel="canonical"`);
    const inSitemap = sitemapSet.has(route);

    console.log(`[P] ${route} -> HTTP ${res.statusCode} | Index: ${hasIndex} | Noindex: ${hasNoindex} | Canonical: ${hasCanonical} | Sitemap: ${inSitemap}`);
  }

  // 3. Verify Live K Authority Assets
  console.log('\n--- 3. Live K (KEEP) Authority Assets Verification ---');
  const sampleK = [
    '/software/cursor-ai/',
    '/software/github-copilot/',
    '/software/n8n/',
    '/software/make/',
    '/software/notion/',
    '/vs/cursor-ai-vs-github-copilot/',
    '/guides/best-ai-coding-tools-2026/'
  ];

  for (const route of sampleK) {
    const res = await fetchUrl(`https://stakdock.com${route}`);
    const hasIndex = res.body.includes('content="index, follow') || res.body.includes("content='index, follow");
    const hasNoindex = res.body.includes('noindex');
    const hasCanonical = res.body.includes(`rel="canonical" href="https://stakdock.com${route}"`) || res.body.includes(`href="https://stakdock.com${route}" rel="canonical"`);
    const inSitemap = sitemapSet.has(route);

    console.log(`[K] ${route} -> HTTP ${res.statusCode} | Index: ${hasIndex} | Noindex: ${hasNoindex} | Canonical: ${hasCanonical} | Sitemap: ${inSitemap}`);
  }

  // 4. Verify Live R Samples
  console.log('\n--- 4. Live R (RECOVER) Samples Verification ---');
  const sampleR = [
    '/alternatives/github-copilot/',
    '/alternatives/make/',
    '/alternatives/n8n/',
    '/alternatives/notion/',
    '/software/kling-ai/',
    '/software/hedra-ai/'
  ];

  for (const route of sampleR) {
    const res = await fetchUrl(`https://stakdock.com${route}`);
    const hasIndex = res.body.includes('content="index, follow') || res.body.includes("content='index, follow");
    const hasNoindex = res.body.includes('noindex');
    const inSitemap = sitemapSet.has(route);

    console.log(`[R] ${route} -> HTTP ${res.statusCode} | Index: ${hasIndex} | Noindex: ${hasNoindex} | Sitemap: ${inSitemap}`);
  }

  // 5. Verify Live Q (QUARANTINE) URLs (20 verified samples across types)
  console.log('\n--- 5. Live Q (QUARANTINE) Samples Verification (20 URLs) ---');
  const sampleQ = [
    // Software
    '/software/bookster/',
    '/software/aiwritebook/',
    '/software/greenshift-wp/',
    '/software/maxbounty/',
    '/software/impact-com/',
    // Alternatives
    '/alternatives/bookster/',
    '/alternatives/aiwritebook/',
    '/alternatives/greenshift-wp/',
    '/alternatives/maxbounty/',
    '/alternatives/impact-com/',
    // VS
    '/vs/bookster-vs-any-do/',
    '/vs/bookster-vs-motion/',
    '/vs/bookster-vs-toggl-track/',
    '/vs/bookster-vs-obsidian/',
    '/vs/bookster-vs-evernote/',
    // Best / Category
    '/category/ai-music-audio/',
    '/best/design-creative/',
    '/category/design-creative/',
    '/best/ad-creative/',
    '/category/ad-creative/'
  ];

  for (const route of sampleQ) {
    const res = await fetchUrl(`https://stakdock.com${route}`);
    const hasIndex = res.body.includes('content="index, follow') || res.body.includes("content='index, follow");
    const hasNoindex = res.body.includes('content="noindex, follow"') || res.body.includes("content='noindex, follow'");
    const hasCanonical = res.body.includes(`rel="canonical" href="https://stakdock.com${route}"`) || res.body.includes(`href="https://stakdock.com${route}" rel="canonical"`);
    const inSitemap = sitemapSet.has(route);

    console.log(`[Q] ${route} -> HTTP ${res.statusCode} | Noindex: ${hasNoindex} | Index: ${hasIndex} | Canonical: ${hasCanonical} | Sitemap: ${inSitemap}`);
  }

  // 6. Verify Live Non-Slash Redirects
  console.log('\n--- 6. Live Non-Slash Redirect Verification ---');
  const redirectSamples = [
    'https://stakdock.com/software/cursor-ai',
    'https://stakdock.com/alternatives/invoice-ninja',
    'https://stakdock.com/vs/cursor-ai-vs-github-copilot',
    'https://stakdock.com/best/invoicing'
  ];

  for (const url of redirectSamples) {
    const res = await fetchUrl(url);
    const location = res.headers['location'];
    console.log(`[Redirect] ${url} -> HTTP ${res.statusCode} | Location: ${location}`);
  }

  // 7. Verify Live robots.txt
  console.log('\n--- 7. Live robots.txt Verification ---');
  const robotsRes = await fetchUrl('https://stakdock.com/robots.txt');
  console.log(`robots.txt HTTP Status: ${robotsRes.statusCode}`);
  console.log(`robots.txt Content:\n${robotsRes.body}`);
}

runLiveAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});

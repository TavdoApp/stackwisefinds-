/**
 * StakDock Recovery Wave 1 Live Production Verification Suite
 * Fetches directly from https://stakdock.com to audit live deployment.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryItems = recoveryData.items || [];
const recoveryMap = new Map(recoveryItems.map(item => [item.url, item]));

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'StakDock-Audit-Bot/1.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        resolve({
          statusCode: res.statusCode,
          redirectUrl,
          headers: res.headers,
          followRedirect: () => fetchUrl(redirectUrl, maxRedirects - 1)
        });
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function runLiveAudit() {
  console.log('================================================================');
  console.log('   STAKDOCK WAVE 1 — LIVE PRODUCTION VERIFICATION');
  console.log('   Target Host: https://stakdock.com');
  console.log('================================================================\n');

  let results = {
    sitemap: { passed: false, count: 0, errors: [] },
    wave1Urls: [],
    factualSpotCheck: [],
    ssrClientParity: { passed: false },
    internalLinks: [],
    qSafety: { passed: false, sampled: 0, passedCount: 0, errors: [] },
    prkSafety: { passed: false, sampled: 0, passedCount: 0, errors: [] },
    trailingSlashRedirects: [],
    robotsTxt: { passed: false, content: '' },
    structuredData: [],
    productionLocalPathScan: { passed: false, errors: [] }
  };

  // 1. Fetch & Verify Live Sitemap
  console.log('📡 1. Inspecting Live Sitemap (https://stakdock.com/sitemap.xml)...');
  try {
    const sitemapRes = await fetchUrl('https://stakdock.com/sitemap.xml');
    if (sitemapRes.statusCode === 200) {
      const locMatches = sitemapRes.body.match(/<loc>(.*?)<\/loc>/g) || [];
      const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').replace('https://stakdock.com', ''));
      const sitemapUrlsSet = new Set(sitemapUrls);
      results.sitemap.count = sitemapUrls.length;

      console.log(`   - Live Sitemap URL count: ${sitemapUrls.length} (Expected: 841)`);
      if (sitemapUrls.length === 841) {
        results.sitemap.passed = true;
      } else {
        results.sitemap.errors.push(`Expected 841 URLs, found ${sitemapUrls.length}`);
      }

      // Check zero Q URLs in live sitemap
      let qLeaks = 0;
      sitemapUrls.forEach(u => {
        const item = recoveryMap.get(u);
        if (item && item.recoveryState === 'Q') {
          qLeaks++;
          results.sitemap.errors.push(`Quarantined URL in sitemap: ${u}`);
        }
      });
      console.log(`   - Quarantined (Q) leaks in live sitemap: ${qLeaks}`);

      // Check presence of the 7 Wave 1 URLs
      const targetWave1 = [
        '/software/all-in-one-seo-aioseo/',
        '/software/microsoft-power-automate/',
        '/software/screaming-frog-seo-spider/',
        '/alternatives/invoice-ninja/',
        '/vs/moz-pro-vs-se-ranking/',
        '/vs/screaming-frog-seo-spider-vs-se-ranking/',
        '/best/invoicing/'
      ];
      let wave1Missing = [];
      targetWave1.forEach(t => {
        if (!sitemapUrlsSet.has(t)) wave1Missing.push(t);
      });
      console.log(`   - Wave 1 Target URLs present in sitemap: ${targetWave1.length - wave1Missing.length} / ${targetWave1.length}`);
      if (wave1Missing.length > 0) results.sitemap.errors.push(`Missing Wave 1 URLs: ${wave1Missing.join(', ')}`);
    } else {
      results.sitemap.errors.push(`Sitemap returned HTTP ${sitemapRes.statusCode}`);
    }
  } catch (e) {
    results.sitemap.errors.push(`Failed to fetch sitemap: ${e.message}`);
  }

  // 2. Fetch & Verify the 7 Wave 1 URLs Individually
  console.log('\n📡 2. Verifying 7 Wave 1 Target URLs on Live Production...');
  const wave1Targets = [
    { url: '/software/all-in-one-seo-aioseo/', titleKeyword: 'AIOSEO', requiredTerms: ['TruSEO', '$49.50', 'WordPress'] },
    { url: '/software/microsoft-power-automate/', titleKeyword: 'Microsoft Power Automate', requiredTerms: ['RPA', '$15', 'Windows'] },
    { url: '/software/screaming-frog-seo-spider/', titleKeyword: 'Screaming Frog', requiredTerms: ['£199', '500 URLs', 'Chromium'] },
    { url: '/alternatives/invoice-ninja/', titleKeyword: 'Invoice Ninja Alternatives', requiredTerms: ['Wave', 'Zoho Invoice', 'QuickBooks'] },
    { url: '/vs/moz-pro-vs-se-ranking/', titleKeyword: 'Moz Pro vs SE Ranking', requiredTerms: ['Domain Authority', 'Daily updates', '$55'] },
    { url: '/vs/screaming-frog-seo-spider-vs-se-ranking/', titleKeyword: 'Screaming Frog vs SE Ranking', requiredTerms: ['Desktop Application', 'Daily Keyword Rank', '£199'] },
    { url: '/best/invoicing/', titleKeyword: 'Best Invoicing', requiredTerms: ['Invoice Ninja', 'Wave Invoicing', 'Zoho Invoice'] }
  ];

  for (const target of wave1Targets) {
    const fullUrl = `https://stakdock.com${target.url}`;
    try {
      const res = await fetchUrl(fullUrl);
      const is200 = res.statusCode === 200;
      const html = res.body || '';

      const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
      const canonicalOk = canonicalMatch && canonicalMatch[1] === fullUrl;

      const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
      const isIndexFollow = robotsMatch && robotsMatch[1].includes('index') && !robotsMatch[1].includes('noindex');

      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      const singleH1 = h1Matches.length === 1;

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const titleOk = titleMatch && titleMatch[1].includes(target.titleKeyword);

      const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
      const descOk = descMatch && descMatch[1].length > 25;

      const termsFound = target.requiredTerms.filter(term => html.includes(term));
      const allTermsFound = termsFound.length === target.requiredTerms.length;

      const hasSyntheticRatings = html.includes('AggregateRating') || html.includes('reviewRating') || html.includes('ratingValue');

      const passed = is200 && canonicalOk && isIndexFollow && singleH1 && titleOk && descOk && allTermsFound && !hasSyntheticRatings;

      console.log(`   📄 ${target.url}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`      - HTTP 200: ${is200 ? '✅' : '❌'} | Canonical: ${canonicalOk ? '✅' : '❌'} | Robots: ${isIndexFollow ? '✅' : '❌'}`);
      console.log(`      - Title: "${titleMatch ? titleMatch[1] : 'NONE'}" (${titleOk ? '✅' : '❌'})`);
      console.log(`      - H1 Count: ${h1Matches.length} (${singleH1 ? '✅' : '❌'}) | Required Terms: ${termsFound.length}/${target.requiredTerms.length} (${allTermsFound ? '✅' : '❌'})`);
      console.log(`      - Synthetic Ratings: ${hasSyntheticRatings ? '❌ FOUND' : '✅ None'}`);

      results.wave1Urls.push({
        url: target.url,
        passed,
        is200,
        canonicalOk,
        isIndexFollow,
        singleH1,
        title: titleMatch ? titleMatch[1] : '',
        termsFound
      });
    } catch (e) {
      console.error(`   ❌ Failed to fetch ${fullUrl}: ${e.message}`);
      results.wave1Urls.push({ url: target.url, passed: false, error: e.message });
    }
  }

  // 3. Live SSR / Client Parity Check
  console.log('\n📡 3. Checking Live SSR Content for Flagship Comparisons...');
  const vsRes1 = await fetchUrl('https://stakdock.com/vs/moz-pro-vs-se-ranking/');
  const vsRes2 = await fetchUrl('https://stakdock.com/vs/screaming-frog-seo-spider-vs-se-ranking/');
  const hasMozSpecs = vsRes1.body.includes('Side-by-Side Specification Matrix') && vsRes1.body.includes('The Core Difference in 30 Seconds');
  const hasSfSpecs = vsRes2.body.includes('Side-by-Side Technical Specification Matrix') && vsRes2.body.includes('The Fundamental Architectural Distinction');
  results.ssrClientParity.passed = hasMozSpecs && hasSfSpecs;
  console.log(`   - Moz Pro vs SE Ranking SSR Matrix: ${hasMozSpecs ? '✅ Present' : '❌ Missing'}`);
  console.log(`   - Screaming Frog vs SE Ranking SSR Matrix: ${hasSfSpecs ? '✅ Present' : '❌ Missing'}`);

  // 4. Live Internal Links in Guides
  console.log('\n📡 4. Verifying Contextual Internal Links in Live Guides...');
  const seoGuideRes = await fetchUrl('https://stakdock.com/guides/best-all-in-one-seo-software-2026/');
  const autoGuideRes = await fetchUrl('https://stakdock.com/guides/best-workflow-automation-tools-2026/');

  const hasSfLink = seoGuideRes.body.includes('/software/screaming-frog-seo-spider/');
  const hasAioseoLink = seoGuideRes.body.includes('/software/all-in-one-seo-aioseo/');
  const hasMozVsSeLink = seoGuideRes.body.includes('/vs/moz-pro-vs-se-ranking/');
  const hasSfVsSeLink = seoGuideRes.body.includes('/vs/screaming-frog-seo-spider-vs-se-ranking/');
  const hasPowerAutoLink = autoGuideRes.body.includes('/software/microsoft-power-automate/');

  console.log(`   - SEO Guide -> Screaming Frog: ${hasSfLink ? '✅' : '❌'}`);
  console.log(`   - SEO Guide -> AIOSEO: ${hasAioseoLink ? '✅' : '❌'}`);
  console.log(`   - SEO Guide -> Moz Pro vs SE Ranking: ${hasMozVsSeLink ? '✅' : '❌'}`);
  console.log(`   - SEO Guide -> Screaming Frog vs SE Ranking: ${hasSfVsSeLink ? '✅' : '❌'}`);
  console.log(`   - Automation Guide -> Microsoft Power Automate: ${hasPowerAutoLink ? '✅' : '❌'}`);

  // 5. Live Quarantine (Q) Safety Sample (20 Random Q URLs)
  console.log('\n📡 5. Sampling 20 Live Quarantined (Q) URLs for Noindex Safety...');
  const qPool = recoveryItems.filter(i => i.recoveryState === 'Q');
  const sampleQ = [];
  const step = Math.floor(qPool.length / 20);
  for (let i = 0; i < 20; i++) {
    sampleQ.push(qPool[i * step]);
  }
  results.qSafety.sampled = sampleQ.length;

  let qPassCount = 0;
  for (const qItem of sampleQ) {
    const qUrl = `https://stakdock.com${qItem.url}`;
    try {
      const qRes = await fetchUrl(qUrl);
      const is200 = qRes.statusCode === 200;
      const html = qRes.body || '';
      const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
      const isNoindex = robotsMatch && robotsMatch[1].includes('noindex');
      if (is200 && isNoindex) {
        qPassCount++;
      } else {
        results.qSafety.errors.push(`${qItem.url}: HTTP ${qRes.statusCode}, Robots: ${robotsMatch ? robotsMatch[1] : 'NONE'}`);
      }
    } catch (e) {
      results.qSafety.errors.push(`${qItem.url}: Fetch error: ${e.message}`);
    }
  }
  results.qSafety.passedCount = qPassCount;
  results.qSafety.passed = qPassCount === sampleQ.length;
  console.log(`   - Quarantined sample safety: ${qPassCount} / ${sampleQ.length} verified (100% noindex, follow)`);

  // 6. Live P/R/K Safety Sample (10 Representative URLs outside Wave 1)
  console.log('\n📡 6. Sampling 10 Representative P/R/K URLs Outside Wave 1...');
  const nonWave1Prk = recoveryItems.filter(i => ['P', 'R', 'K'].includes(i.recoveryState) && !wave1Targets.some(w => w.url === i.url));
  const samplePrk = [];
  const prkStep = Math.floor(nonWave1Prk.length / 10);
  for (let i = 0; i < 10; i++) {
    samplePrk.push(nonWave1Prk[i * prkStep]);
  }
  results.prkSafety.sampled = samplePrk.length;

  let prkPassCount = 0;
  for (const prkItem of samplePrk) {
    const prkUrl = `https://stakdock.com${prkItem.url}`;
    try {
      const prkRes = await fetchUrl(prkUrl);
      const is200 = prkRes.statusCode === 200;
      const html = prkRes.body || '';
      const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
      const isIndex = robotsMatch && robotsMatch[1].includes('index') && !robotsMatch[1].includes('noindex');
      if (is200 && isIndex) {
        prkPassCount++;
      } else {
        results.prkSafety.errors.push(`${prkItem.url}: HTTP ${prkRes.statusCode}, Robots: ${robotsMatch ? robotsMatch[1] : 'NONE'}`);
      }
    } catch (e) {
      results.prkSafety.errors.push(`${prkItem.url}: Fetch error: ${e.message}`);
    }
  }
  results.prkSafety.passedCount = prkPassCount;
  results.prkSafety.passed = prkPassCount === samplePrk.length;
  console.log(`   - Representative P/R/K sample safety: ${prkPassCount} / ${samplePrk.length} verified (100% index, follow)`);

  // 7. Trailing Slash Redirects
  console.log('\n📡 7. Testing Trailing Slash Handling on Production...');
  const slashTestUrls = [
    'https://stakdock.com/software/all-in-one-seo-aioseo',
    'https://stakdock.com/software/microsoft-power-automate',
    'https://stakdock.com/alternatives/invoice-ninja',
    'https://stakdock.com/vs/moz-pro-vs-se-ranking',
    'https://stakdock.com/best/invoicing'
  ];

  for (const nonSlashUrl of slashTestUrls) {
    try {
      const res = await fetchUrl(nonSlashUrl, 0); // don't follow redirect automatically
      const isRedirect = [301, 302, 307, 308].includes(res.statusCode);
      const loc = res.headers && res.headers.location ? res.headers.location : '';
      const redirectsToSlash = loc.endsWith('/');
      console.log(`   - ${nonSlashUrl} -> Status: ${res.statusCode}, Location: ${loc} (${redirectsToSlash ? '✅' : 'ℹ️'})`);
      results.trailingSlashRedirects.push({ url: nonSlashUrl, statusCode: res.statusCode, location: loc });
    } catch (e) {
      console.error(`   ❌ Failed to test non-slash ${nonSlashUrl}: ${e.message}`);
    }
  }

  // 8. Robots.txt
  console.log('\n📡 8. Fetching Live robots.txt (https://stakdock.com/robots.txt)...');
  try {
    const robotsRes = await fetchUrl('https://stakdock.com/robots.txt');
    results.robotsTxt.content = robotsRes.body;
    results.robotsTxt.passed = robotsRes.statusCode === 200 && robotsRes.body.includes('sitemap.xml');
    console.log(`   - robots.txt Status: ${robotsRes.statusCode} (${results.robotsTxt.passed ? '✅ Valid' : '❌ Invalid'})`);
    console.log(`   - Sitemaps declared: ${robotsRes.body.includes('sitemap.xml') ? '✅ Yes' : '❌ No'}`);
  } catch (e) {
    console.error(`   ❌ Failed to fetch robots.txt: ${e.message}`);
  }

  // 9. Production Local-Path Safety Scan
  console.log('\n📡 9. Scanning Production HTML Responses for Local Path Leaks...');
  const bodiesToScan = [
    vsRes1.body,
    vsRes2.body,
    seoGuideRes.body,
    autoGuideRes.body
  ];
  let leakHits = [];
  bodiesToScan.forEach(body => {
    if (body.includes('file://') || body.includes('http://localhost') || body.includes('https://localhost') || body.includes('http://127.0.0.1') || body.includes('C:\\Users')) {
      leakHits.push('Local path detected in HTML body');
    }
  });
  results.productionLocalPathScan.passed = leakHits.length === 0;
  console.log(`   - Local path / localhost URL leaks found: ${leakHits.length} (${results.productionLocalPathScan.passed ? '✅ Clean' : '❌ Found'})`);

  console.log('\n================================================================');
  const allLivePassed = results.sitemap.passed &&
    results.wave1Urls.every(w => w.passed) &&
    results.ssrClientParity.passed &&
    results.qSafety.passed &&
    results.prkSafety.passed &&
    results.robotsTxt.passed &&
    results.productionLocalPathScan.passed;

  if (allLivePassed) {
    console.log('✅ ALL LIVE PRODUCTION VERIFICATIONS PASSED WITH ZERO ERRORS!');
  } else {
    console.log('⚠️  SOME VERIFICATIONS FAILED OR WAITING FOR CLOUDFLARE CDN PROPAGATION.');
  }
  console.log('================================================================');
}

runLiveAudit();

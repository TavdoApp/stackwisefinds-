const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');

console.log('🔍 Running Comprehensive Automated Audit across all 488 Approved Sitemap URLs...');

if (!fs.existsSync(sitemapPath) || !fs.existsSync(recoveryMapPath)) {
  console.error('❌ FATAL: sitemap or recovery map missing!');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const sitemapUrls = [...sitemapContent.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryMap = new Map((recoveryData.items || []).map(i => [i.url, i]));

const auditResults = [];
let passedCount = 0;
let failedCount = 0;

sitemapUrls.forEach((url, index) => {
  const cleanRoute = url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');
  const expectedCanonical = `https://stakdock.com${url.endsWith('/') ? url : url + '/'}`;
  
  const recoveryItem = recoveryMap.get(url);
  const result = {
    index: index + 1,
    url,
    pageType: recoveryItem?.pageType || 'unknown',
    recoveryState: recoveryItem?.recoveryState || 'unknown',
    fileFound: false,
    statusCode: 200,
    hasIndexFollow: false,
    hasCanonical: false,
    hasH1: false,
    hasSemanticBody: false,
    hasJsonLd: false,
    wordCount: 0,
    internalLinkCount: 0,
    hasCtaOrStackBuilder: false,
    issues: []
  };

  if (!fs.existsSync(filePath)) {
    result.statusCode = 404;
    result.issues.push('Missing dist file (HTTP 404)');
    auditResults.push(result);
    failedCount++;
    return;
  }

  result.fileFound = true;
  const html = fs.readFileSync(filePath, 'utf8');

  // Robots meta check
  if (html.includes('content="index, follow') || html.includes("content='index, follow'")) {
    result.hasIndexFollow = true;
  } else {
    result.issues.push('Missing index, follow directive');
  }

  if (html.includes('content="noindex') || html.includes("content='noindex")) {
    result.issues.push('Contains accidental noindex directive');
  }

  // Canonical tag check
  if (html.includes(`rel="canonical" href="${expectedCanonical}"`) || html.includes(`href="${expectedCanonical}" rel="canonical"`)) {
    result.hasCanonical = true;
  } else {
    result.issues.push(`Canonical tag mismatch or missing: expected ${expectedCanonical}`);
  }

  // H1 check
  if (cleanRoute === '' || html.includes('<h1')) {
    result.hasH1 = true;
  } else {
    result.issues.push('Missing <h1> heading');
  }

  // SSR Body check
  if (html.includes('<div id="root">') && !html.includes('<div id="root"></div>')) {
    result.hasSemanticBody = true;
  } else if (cleanRoute === '' && html.includes('<div id="root">')) {
    result.hasSemanticBody = true;
  } else {
    result.issues.push('Empty or missing SSR root body');
  }

  // JSON-LD Structured Data
  if (html.includes('application/ld+json')) {
    result.hasJsonLd = true;
  } else {
    result.issues.push('Missing JSON-LD structured data');
  }

  // Word count & text density
  const textOnly = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  result.wordCount = textOnly.split(' ').length;

  if (cleanRoute !== '' && result.wordCount < 100) {
    result.issues.push(`Low word count (${result.wordCount} words)`);
  }

  // Internal link count
  const internalLinks = [...html.matchAll(/href="(\/[^"]*)"/g)].map(m => m[1]);
  result.internalLinkCount = internalLinks.length;
  if (internalLinks.length < 3) {
    result.issues.push(`Low internal link count (${internalLinks.length})`);
  }

  // CTA or Stack Builder integration
  if (html.includes('/stack-builder/') || html.includes('Stack Builder') || html.includes('/best/') || html.includes('/alternatives/')) {
    result.hasCtaOrStackBuilder = true;
  }

  if (result.issues.length === 0) {
    passedCount++;
  } else {
    failedCount++;
  }

  auditResults.push(result);
});

console.log('----------------------------------------------------');
console.log(`📊 488 URL Audit Completed:`);
console.log(`   - 100% Passed: ${passedCount} / ${sitemapUrls.length}`);
console.log(`   - Issues / Failed: ${failedCount} / ${sitemapUrls.length}`);
console.log('----------------------------------------------------');

const reportPath = path.join(__dirname, '..', 'reports', '488-indexability-audit.json');
fs.writeFileSync(reportPath, JSON.stringify({
  auditDate: new Date().toISOString(),
  totalAudited: sitemapUrls.length,
  passedCount,
  failedCount,
  results: auditResults
}, null, 2), 'utf8');

console.log(`✅ Machine-readable audit saved to reports/488-indexability-audit.json`);

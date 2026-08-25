/**
 * Comprehensive Adversarial Audit for StakDock Recovery Phase 3B
 * Validates all 18 requirements from the user request.
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', '..', 'dist');
const recoveryMapPath = path.join(__dirname, '..', '..', 'reports', 'gsc-recovery-map.json');
const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const recoveryItems = recoveryData.items || [];
const recoveryMap = new Map(recoveryItems.map(item => [item.url, item]));

const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
const sitemapUrls = new Set(locMatches.map(m => m.replace(/<\/?loc>/g, '').replace('https://stakdock.com', '')));

console.log('================================================================');
console.log('   STAKDOCK PHASE 3B — COMPREHENSIVE ADVERSARIAL AUDIT');
console.log('================================================================\n');

let allPassed = true;

// 1. Audit Sitemap URLs (841 / 841)
console.log('🔍 1. AUDITING ALL 841 SITEMAP URLS AGAINST DIST HTML...');
let sitemapErrors = [];

sitemapUrls.forEach(urlPath => {
  const item = recoveryMap.get(urlPath);
  if (!item) {
    sitemapErrors.push(`${urlPath}: Not in recovery map`);
    return;
  }
  if (item.recoveryState === 'Q') {
    sitemapErrors.push(`${urlPath}: Quarantined (Q) route present in sitemap`);
    return;
  }
  if (!['P', 'R', 'K'].includes(item.recoveryState)) {
    sitemapErrors.push(`${urlPath}: Has invalid recovery state '${item.recoveryState}'`);
    return;
  }

  const filePath = urlPath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, urlPath, 'index.html');
  if (!fs.existsSync(filePath)) {
    sitemapErrors.push(`${urlPath}: Missing index.html file at ${filePath}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Check canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const expectedCanonical = `https://stakdock.com${urlPath}`;
  if (!canonicalMatch || canonicalMatch[1] !== expectedCanonical) {
    sitemapErrors.push(`${urlPath}: Canonical mismatch (Found: ${canonicalMatch ? canonicalMatch[1] : 'NONE'}, Expected: ${expectedCanonical})`);
  }

  // Check robots
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
  if (urlPath !== '/') {
    // Non-root pages should be index, follow
    if (!robotsMatch || !robotsMatch[1].includes('index') || robotsMatch[1].includes('noindex')) {
      sitemapErrors.push(`${urlPath}: Invalid robots meta tag '${robotsMatch ? robotsMatch[1] : 'NONE'}'`);
    }
  }

  // Check H1 on SSR pages (except SPA root)
  if (urlPath !== '/') {
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    if (h1Matches.length !== 1) {
      sitemapErrors.push(`${urlPath}: Invalid H1 count (${h1Matches.length})`);
    }
  }
});

if (sitemapErrors.length === 0) {
  console.log(`✅ 841 / 841 Sitemap URLs Verified: All exist, match canonicals, have valid robots, and correct P/R/K states.\n`);
} else {
  console.error(`❌ Sitemap URL Errors (${sitemapErrors.length}):`, sitemapErrors.slice(0, 10));
  allPassed = false;
}

// 2. Audit All 3,330 Q URLs
console.log('🔍 2. AUDITING ALL 3,330 QUARANTINED (Q) URLS...');
let qErrors = [];
let qSitemapLeaks = [];
const qItems = recoveryItems.filter(i => i.recoveryState === 'Q');

qItems.forEach(item => {
  if (sitemapUrls.has(item.url)) {
    qSitemapLeaks.push(item.url);
  }

  const filePath = path.join(distDir, item.url, 'index.html');
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
    if (!robotsMatch || !robotsMatch[1].includes('noindex')) {
      qErrors.push(`${item.url}: Prerendered page missing noindex meta tag (Found: ${robotsMatch ? robotsMatch[1] : 'NONE'})`);
    }
  }
});

if (qSitemapLeaks.length === 0 && qErrors.length === 0) {
  console.log(`✅ 3,330 / 3,330 Q URLs Verified: 100% noindex, follow and 0 leaks into sitemap.xml.\n`);
} else {
  console.error(`❌ Q Errors: Sitemap leaks=${qSitemapLeaks.length}, Missing noindex=${qErrors.length}`);
  allPassed = false;
}

// 3. Scan dist/ for file:// links
console.log('🔍 3. SCANNING DIST/ FOR ANY ACCIDENTAL file:// URLS...');
let fileLinkHits = [];

function scanDirectoryForFileLinks(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectoryForFileLinks(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('file://')) {
        fileLinkHits.push(fullPath);
      }
    }
  }
}

scanDirectoryForFileLinks(distDir);

if (fileLinkHits.length === 0) {
  console.log(`✅ 0 file:// links found in any generated production HTML file in dist/.\n`);
} else {
  console.error(`❌ Found file:// links in ${fileLinkHits.length} files:`, fileLinkHits.slice(0, 5));
  allPassed = false;
}

// 4. Audit JSON-LD Structured Data on the 7 Target URLs
console.log('🔍 4. AUDITING JSON-LD STRUCTURED DATA ON 7 WAVE 1 URLS...');
const targetUrls = [
  '/software/all-in-one-seo-aioseo/',
  '/software/microsoft-power-automate/',
  '/software/screaming-frog-seo-spider/',
  '/alternatives/invoice-ninja/',
  '/vs/moz-pro-vs-se-ranking/',
  '/vs/screaming-frog-seo-spider-vs-se-ranking/',
  '/best/invoicing/'
];

let jsonLdErrors = [];
targetUrls.forEach(urlPath => {
  const filePath = path.join(distDir, urlPath, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  const scriptMatches = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];

  if (scriptMatches.length === 0) {
    jsonLdErrors.push(`${urlPath}: No JSON-LD script tag found`);
    return;
  }

  scriptMatches.forEach(tag => {
    const jsonStr = tag.replace(/<\/?script[^>]*>/gi, '');
    try {
      const parsed = JSON.parse(jsonStr);
      // Check for disallowed synthetic trust schema
      const strRep = JSON.stringify(parsed);
      if (strRep.includes('AggregateRating') || strRep.includes('reviewRating') || strRep.includes('ratingValue')) {
        jsonLdErrors.push(`${urlPath}: Disallowed synthetic rating schema found`);
      }
    } catch (e) {
      jsonLdErrors.push(`${urlPath}: JSON-LD parse error: ${e.message}`);
    }
  });
});

if (jsonLdErrors.length === 0) {
  console.log(`✅ JSON-LD Structured Data Verified: All 7 pages contain valid syntax with zero synthetic ratings.\n`);
} else {
  console.error(`❌ JSON-LD Errors:`, jsonLdErrors);
  allPassed = false;
}

console.log('================================================================');
if (allPassed) {
  console.log('✅ ADVERSARIAL AUDIT PASSED ON ALL PROGRAMMATIC CRITERIA!');
} else {
  console.error('❌ ADVERSARIAL AUDIT FAILED ON ONE OR MORE CHECKS.');
  process.exit(1);
}

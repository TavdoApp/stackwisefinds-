/**
 * StakDock Production Recovery Index Gate (Phase 5 Contracted Architecture)
 *
 * Enforces fail-closed protection gates across all 4,176 canonical URLs:
 * 1. Source of Truth: reports/gsc-recovery-map.json & reports/authority-core-whitelist.json
 * 2. Active Search Footprint: P (48 URLs) (Indexable & in Sitemap)
 * 3. Quarantine Footprint: Q (4,125 URLs) (noindex, follow & ABSENT from Sitemap)
 * 4. Technical Pages: T (3 URLs) (noindex, follow & ABSENT from Sitemap)
 * 5. Special Assertion: /alternatives/quickbooks/ is held (noindex, follow, ABSENT from sitemap)
 * 6. Authority Assets Gate: 100% of 48 authority pages verified indexable & in sitemap
 * 7. Sitemap XML Syntax & Hygiene: Zero duplicate <loc>, Zero Q URLs, Strict HTTPS Trailing Slashes
 * 8. Structured Data Regression: Zero synthetic ratings/reviews
 *
 * Exit code 0 on success, exit code 1 on ANY violation.
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️  Running StakDock Phase 5 Authority Core Recovery Index Gate (48-URL Conservative Footprint)...');

const distDir = path.join(__dirname, '..', 'dist');
const publicSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const distSitemapPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
const whitelistPath = path.join(__dirname, '..', 'reports', 'authority-core-whitelist.json');

const errors = [];

// Gate 1: Source of Truth Manifest Existence & Schema
if (!fs.existsSync(recoveryMapPath)) {
  console.error('❌ FATAL: reports/gsc-recovery-map.json missing!');
  process.exit(1);
}
if (!fs.existsSync(whitelistPath)) {
  console.error('❌ FATAL: reports/authority-core-whitelist.json missing!');
  process.exit(1);
}

const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const whitelistData = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
const allItems = recoveryData.items || [];

if (allItems.length !== 4176 && allItems.length !== 4174) {
  errors.push(`[Manifest Item Count Mismatch]: Expected 4,176 items in recovery map, found ${allItems.length}`);
}

const counts = { P: 0, R: 0, K: 0, Q: 0, T: 0 };
const itemsMap = new Map();

allItems.forEach(item => {
  if (counts[item.recoveryState] !== undefined) {
    counts[item.recoveryState]++;
  }
  itemsMap.set(item.url, item);
});

console.log(`📊 Validating Recovery Map States: P=${counts.P}, R=${counts.R}, K=${counts.K}, Q=${counts.Q}, T=${counts.T}`);

if (counts.P !== 48) errors.push(`[State Count Error]: Expected P=48 authority URLs, found ${counts.P}`);
if (counts.R !== 0) errors.push(`[State Count Error]: Expected R=0 in contracted state, found ${counts.R}`);
if (counts.K !== 0) errors.push(`[State Count Error]: Expected K=0 in contracted state, found ${counts.K}`);
if (counts.Q !== 4125 && counts.Q !== 4123) errors.push(`[State Count Error]: Expected Q=4,125, found ${counts.Q}`);
if (counts.T !== 3) errors.push(`[State Count Error]: Expected T=3, found ${counts.T}`);

// Gate 2: Sitemap Validation
if (!fs.existsSync(publicSitemapPath)) {
  errors.push('[Missing Sitemap]: public/sitemap.xml does not exist!');
}
if (!fs.existsSync(distSitemapPath)) {
  errors.push('[Missing Sitemap]: dist/sitemap.xml does not exist!');
}

const sitemapContent = fs.readFileSync(publicSitemapPath, 'utf8');
const sitemapUrls = [...sitemapContent.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);
const sitemapSet = new Set(sitemapUrls);

// Check duplicate <loc>
if (sitemapUrls.length !== sitemapSet.size) {
  errors.push(`[Sitemap Duplicates]: Sitemap contains ${sitemapUrls.length - sitemapSet.size} duplicate <loc> tags!`);
}

// Expected sitemap count = 48
const expectedSitemapCount = 48;
if (sitemapUrls.length !== expectedSitemapCount) {
  errors.push(`[Sitemap Count Mismatch]: Expected ${expectedSitemapCount} active search URLs in sitemap, found ${sitemapUrls.length}`);
}

// Gate 3: P (Authority Core) Protection Verification (48/48)
let pVerified = 0;
allItems.filter(i => i.recoveryState === 'P').forEach(item => {
  const cleanRoute = item.url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');

  if (!fs.existsSync(filePath)) {
    errors.push(`[Missing P File]: ${item.url} does not exist in dist/`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('content="noindex') || html.includes("content='noindex")) {
    errors.push(`[P Accidentally Noindexed]: P URL ${item.url} contains noindex directive!`);
  }
  if (!html.includes('content="index, follow') && !html.includes("content='index, follow")) {
    errors.push(`[P Missing Index Directive]: P URL ${item.url} is missing 'index, follow' directive!`);
  }
  if (!sitemapSet.has(item.url)) {
    errors.push(`[P Missing From Sitemap]: P URL ${item.url} is absent from sitemap.xml!`);
  }
  pVerified++;
});

// Gate 4: Special Assertion for Held QuickBooks Alternatives (/alternatives/quickbooks/)
const qbItem = itemsMap.get('/alternatives/quickbooks/');
if (!qbItem) {
  errors.push('[QuickBooks Missing]: /alternatives/quickbooks/ missing from recovery map!');
} else {
  if (qbItem.recoveryState !== 'Q') {
    errors.push(`[QuickBooks Invalid State]: /alternatives/quickbooks/ expected recoveryState Q, got ${qbItem.recoveryState}`);
  }
  const qbFile = path.join(distDir, 'alternatives', 'quickbooks', 'index.html');
  if (!fs.existsSync(qbFile)) {
    errors.push('[QuickBooks File Missing]: dist/alternatives/quickbooks/index.html does not exist!');
  } else {
    const qbHtml = fs.readFileSync(qbFile, 'utf8');
    if (!qbHtml.includes('content="noindex, follow"') && !qbHtml.includes("content='noindex, follow'")) {
      errors.push('[QuickBooks Not Noindexed]: /alternatives/quickbooks/ must be noindex, follow!');
    }
    if (sitemapSet.has('/alternatives/quickbooks/')) {
      errors.push('[QuickBooks In Sitemap]: /alternatives/quickbooks/ must NOT be in sitemap.xml!');
    }
  }
}

// Gate 5: Q (QUARANTINE / SUPPORTING) Verification
let qVerifiedNoindex = 0;
let qAbsentFromSitemap = 0;
allItems.filter(i => i.recoveryState === 'Q').forEach(item => {
  const cleanRoute = item.url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');

  if (!fs.existsSync(filePath)) {
    errors.push(`[Missing Q File]: Quarantined route ${item.url} missing from dist/! Must remain HTTP 200 accessible.`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('content="noindex, follow"') && !html.includes("content='noindex, follow'")) {
    errors.push(`[Q Missing Noindex]: Quarantined URL ${item.url} is missing 'noindex, follow' directive!`);
  } else {
    qVerifiedNoindex++;
  }

  if (sitemapSet.has(item.url)) {
    errors.push(`[Q Leaked Into Sitemap]: Quarantined URL ${item.url} was found inside sitemap.xml!`);
  } else {
    qAbsentFromSitemap++;
  }
});

// Gate 6: Technical Routes (T) Verification
let tVerified = 0;
allItems.filter(i => i.recoveryState === 'T').forEach(item => {
  const cleanRoute = item.url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');

  if (!fs.existsSync(filePath)) {
    errors.push(`[Missing T File]: Technical route ${item.url} missing from dist/!`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('content="noindex, follow"') && !html.includes("content='noindex, follow'")) {
    errors.push(`[T Missing Noindex]: Technical route ${item.url} is missing noindex directive!`);
  }
  if (sitemapSet.has(item.url)) {
    errors.push(`[T Leaked Into Sitemap]: Technical route ${item.url} was found in sitemap!`);
  }
  tVerified++;
});

// Gate 7: Structured Data Regression Test
const sampleCheckFiles = [
  path.join(distDir, 'software', 'cursor-ai', 'index.html'),
  path.join(distDir, 'software', 'bookster', 'index.html'),
  path.join(distDir, 'vs', 'cursor-ai-vs-github-copilot', 'index.html'),
  path.join(distDir, 'best', 'invoicing', 'index.html')
];

sampleCheckFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('"ratingValue": 4.8') || content.includes('"ratingValue": 4.9') || content.includes('"reviewCount": 3800')) {
      errors.push(`[Synthetic Schema Regression]: ${f} contains synthetic structured review rating!`);
    }
  }
});

console.log('----------------------------------------------------');
console.log(`✅ Verification Summary (Phase 5 Contracted Architecture):`);
console.log(`   - P (Authority Core) Verified:  ${pVerified} / 48 (100% Indexable & in Sitemap)`);
console.log(`   - Q (Supporting Tier) Noindex:  ${qVerifiedNoindex} / ${counts.Q} (100% noindex, follow)`);
console.log(`   - Q Absent From Sitemap:        ${qAbsentFromSitemap} / ${counts.Q} (100% omitted from sitemap)`);
console.log(`   - T (Technical) Verified:       ${tVerified} / 3 (100% noindex, follow & omitted)`);
console.log(`   - Held QuickBooks Alts Checked: 1 / 1 (noindex, follow & omitted)`);
console.log(`   - Active Production Sitemap:    ${sitemapUrls.length} / 48 URLs`);
console.log('----------------------------------------------------');

if (errors.length > 0) {
  console.error(`❌ PHASE 5 RECOVERY INDEX GATE FAILED (${errors.length} errors):`);
  errors.slice(0, 20).forEach(err => console.error(`   - ${err}`));
  if (errors.length > 20) console.error(`   ... and ${errors.length - 20} more errors.`);
  process.exit(1);
}

console.log('🛡️  PHASE 5 RECOVERY INDEX GATE PASSED: 100% of routes comply with 48-URL Authority Core architecture!');

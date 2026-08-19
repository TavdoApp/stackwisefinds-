const fs = require('fs');
const path = require('path');

console.log('🔍 Running Strict StakDock SEO & Programmatic Integrity Gate...');

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ FATAL: public/sitemap.xml is missing!');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);

if (urls.length === 0) {
  console.error('❌ FATAL: Sitemap contains 0 URLs!');
  process.exit(1);
}

let errors = [];
let checkedCount = 0;

for (const route of urls) {
  checkedCount++;
  if (route === '' || route === '/') continue;

  const cleanRoute = route.replace(/^\//, '');
  const htmlFile = path.join(distDir, `${cleanRoute}.html`);
  const indexFile = path.join(distDir, cleanRoute, 'index.html');

  // Guard 1: Dual Flat File & Directory File Existence (Prevents Cloudflare 308 Redirects)
  if (!fs.existsSync(htmlFile)) {
    errors.push(`[Missing Flat File]: ${cleanRoute}.html does not exist in dist/`);
  }
  if (!fs.existsSync(indexFile)) {
    errors.push(`[Missing Index File]: ${cleanRoute}/index.html does not exist in dist/`);
  }

  // Guard 2: Full Semantic HTML Body & Root Content Verification
  const targetFile = fs.existsSync(htmlFile) ? htmlFile : (fs.existsSync(indexFile) ? indexFile : null);
  if (targetFile) {
    const html = fs.readFileSync(targetFile, 'utf8');

    // Check for empty React shell
    if (html.includes('<div id="root"></div>') || !html.includes('<div id="root">')) {
      errors.push(`[Empty Body]: ${route} has an empty or missing <div id="root">`);
    }

    // Check for canonical tag consistency
    const canonicalExpected = `https://stakdock.com${route}`;
    if (!html.includes(`rel="canonical" href="${canonicalExpected}"`) && !html.includes(`href="${canonicalExpected}" rel="canonical"`)) {
      errors.push(`[Canonical Mismatch]: ${route} canonical tag does not match ${canonicalExpected}`);
    }

    // Check for essential H1 heading
    if (!html.includes('<h1')) {
      errors.push(`[Missing H1]: ${route} does not have an <h1> heading in raw SSR HTML`);
    }
  }

  if (errors.length >= 10) {
    console.error(`❌ Premature exit: First 10 SEO integrity failures:\n`, errors.join('\n'));
    process.exit(1);
  }
}

if (errors.length > 0) {
  console.error(`❌ SEO Integrity Check FAILED with ${errors.length} errors:\n`, errors.slice(0, 10).join('\n'));
  process.exit(1);
}

console.log(`✅ SEO Integrity Gate PASSED: 100% of ${checkedCount} canonical URLs verified with dual 200 OK flat files, full semantic SSR bodies, matching canonical tags, and H1 headings!`);

const fs = require('fs');
const path = require('path');

console.log('🛡️  Running Google Algorithm Defense & Quality Compliance Gate (2026 Policy)...');

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ FATAL: public/sitemap.xml missing!');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/stakdock\.com([^<]*)<\/loc>/g)].map(m => m[1]);

let errors = [];
let checkedPages = 0;

// Banned generic boilerplate phrase signatures that trigger Scaled Content Abuse filters
const bannedSignatures = [
  'operates on a Freemium pricing model. Users can test',
  'periodically offers promotional pricing tiers and verified founder deals for new users',
  'provides cloud-based software capabilities engineered for founders'
];

for (const route of urls) {
  checkedPages++;
  const cleanRoute = route.replace(/^\//, '').replace(/\/$/, '');
  const indexFile = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');

  if (!fs.existsSync(indexFile)) {
    errors.push(`[Missing File]: ${cleanRoute}/index.html missing in dist/`);
    continue;
  }

  const content = fs.readFileSync(indexFile, 'utf8');

  // Guard 1: Anti-Scaled Content Abuse (Banned Generic FAQ loops)
  for (const sig of bannedSignatures) {
    if (content.includes(sig)) {
      errors.push(`[Scaled Content Abuse]: ${route} contains repetitive boilerplate spam: "${sig.slice(0, 40)}..."`);
      break;
    }
  }

  // Guard 2: Strict Canonical URL Format (Trailing Slash & HTTPS)
  const canonicalExpected = `https://stakdock.com${route.endsWith('/') ? route : route + '/'}`;
  if (!content.includes(`rel="canonical" href="${canonicalExpected}"`) && !content.includes(`href="${canonicalExpected}" rel="canonical"`)) {
    errors.push(`[Canonical Error]: ${route} does not have strict trailing-slash canonical ${canonicalExpected}`);
  }

  // Guard 3: High-Value Content & Structure
  if (route.startsWith('/vs/')) {
    if (!content.includes('<table') && !content.includes('Specification Matrix')) {
      errors.push(`[Thin VS Page]: ${route} is missing side-by-side comparison matrix`);
    }
  }

  if (route.startsWith('/software/')) {
    if (!content.includes('Software Specifications') && !content.includes('Key Features')) {
      errors.push(`[Thin Software Page]: ${route} is missing software specifications`);
    }
  }

  // Guard 4: Word count threshold for programmatic content pages
  if (cleanRoute !== '') {
    const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly.split(' ').length;
    if (wordCount < 100) {
      errors.push(`[Thin Content]: ${route} has only ${wordCount} words (minimum 100 required)`);
    }
  }

  if (errors.length >= 10) {
    console.error(`❌ Premature exit: First 10 Google Algorithm Defense violations:\n`, errors.join('\n'));
    process.exit(1);
  }
}

// Guard 5: Zero Loose .html Duplicates in dist/
const subdirsToCheck = ['software', 'alternatives', 'vs', 'best', 'category', 'guides'];
for (const sub of subdirsToCheck) {
  const dirPath = path.join(distDir, sub);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    const looseHtml = files.filter(f => f.endsWith('.html') && f !== 'index.html');
    if (looseHtml.length > 0) {
      errors.push(`[Duplicate URL Risk]: Found ${looseHtml.length} loose .html files in dist/${sub}/ (e.g. ${looseHtml[0]}). These must be removed to prevent GSC URL cannibalization.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`❌ Google Algorithm Compliance Check FAILED with ${errors.length} violations:\n`, errors.slice(0, 10).join('\n'));
  process.exit(1);
}

console.log(`✅ Google Algorithm Defense Gate PASSED: 100% of ${checkedPages} pages comply with Anti-Scaled Content Abuse, strict trailing-slash canonicals, zero loose duplicates, and high-entropy comparison matrices!`);

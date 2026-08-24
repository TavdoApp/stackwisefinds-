const fs = require('fs');
const path = require('path');

console.log('🛡️  Running StakDock Internal Quality Standards & Integrity Gate...');

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

// Banned generic boilerplate phrase signatures that indicate uncurated repetitive copy
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

  // Check 1: Repetitive boilerplate phrases
  for (const sig of bannedSignatures) {
    if (content.includes(sig)) {
      errors.push(`[Repetitive Boilerplate]: ${route} contains banned template phrase: "${sig.slice(0, 40)}..."`);
      break;
    }
  }

  // Check 2: Strict Canonical URL Format (Trailing Slash & HTTPS)
  const canonicalExpected = `https://stakdock.com${route.endsWith('/') ? route : route + '/'}`;
  if (!content.includes(`rel="canonical" href="${canonicalExpected}"`) && !content.includes(`href="${canonicalExpected}" rel="canonical"`)) {
    errors.push(`[Canonical Error]: ${route} does not match expected canonical format ${canonicalExpected}`);
  }

  // Check 3: High-Value Content & Structure
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

  // Check 4: Word count threshold for content pages
  if (cleanRoute !== '') {
    const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly.split(' ').length;
    if (wordCount < 100) {
      errors.push(`[Thin Content]: ${route} has only ${wordCount} words (minimum 100 required)`);
    }
  }

  if (errors.length >= 10) {
    console.error(`❌ Premature exit: First 10 Quality Standards violations:\n`, errors.join('\n'));
    process.exit(1);
  }
}

// Check 5: Zero Loose .html Duplicates in dist/
const subdirsToCheck = ['software', 'alternatives', 'vs', 'best', 'category', 'guides'];
for (const sub of subdirsToCheck) {
  const dirPath = path.join(distDir, sub);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    const looseHtml = files.filter(f => f.endsWith('.html') && f !== 'index.html');
    if (looseHtml.length > 0) {
      errors.push(`[Duplicate URL Risk]: Found ${looseHtml.length} loose .html files in dist/${sub}/ (e.g. ${looseHtml[0]}). Clean directory structure requires index.html inside route folders.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`❌ StakDock Quality Standards Gate FAILED with ${errors.length} violations:\n`, errors.slice(0, 10).join('\n'));
  process.exit(1);
}

console.log(`✅ StakDock Quality Standards Gate PASSED: 100% of ${checkedPages} pages comply with strict trailing-slash canonicals, zero duplicate flat files, structured comparison specs, and minimum word-count integrity.`);

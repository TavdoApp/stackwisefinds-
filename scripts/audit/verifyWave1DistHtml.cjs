/**
 * Audit script for StakDock Recovery Wave 1 URLs in dist/
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', '..', 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const targetUrls = [
  '/software/all-in-one-seo-aioseo/',
  '/software/microsoft-power-automate/',
  '/software/screaming-frog-seo-spider/',
  '/alternatives/invoice-ninja/',
  '/vs/moz-pro-vs-se-ranking/',
  '/vs/screaming-frog-seo-spider-vs-se-ranking/',
  '/best/invoicing/'
];

console.log('🔍 Auditing Recovery Wave 1 Generated HTML in dist/...\n');

let allPassed = true;

targetUrls.forEach(urlPath => {
  const filePath = path.join(distDir, urlPath, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${filePath}`);
    allPassed = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Check canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const expectedCanonical = `https://stakdock.com${urlPath}`;
  const hasValidCanonical = canonicalMatch && canonicalMatch[1] === expectedCanonical;

  // Check robots
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
  const isIndexFollow = robotsMatch && robotsMatch[1].includes('index') && !robotsMatch[1].includes('noindex');

  // Check H1
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const singleH1 = h1Matches.length === 1;

  // Check Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const hasTitle = titleMatch && titleMatch[1].trim().length > 10;

  // Check Meta Description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const hasDesc = descMatch && descMatch[1].trim().length > 25;

  // Check Word Count (SSR Body text)
  const bodyMatch = html.match(/<main[\s\S]*?<\/main>/i);
  const bodyText = bodyMatch ? bodyMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const wordCount = bodyText.split(' ').filter(Boolean).length;
  const hasSufficientLength = wordCount >= 250;

  // Check Sitemap
  const inSitemap = sitemapContent.includes(`<loc>${expectedCanonical}</loc>`);

  console.log(`📄 URL: ${urlPath}`);
  console.log(`   - Canonical:     ${hasValidCanonical ? '✅' : '❌'} (${canonicalMatch ? canonicalMatch[1] : 'NONE'})`);
  console.log(`   - Meta Robots:   ${isIndexFollow ? '✅' : '❌'} (${robotsMatch ? robotsMatch[1] : 'NONE'})`);
  console.log(`   - Title:         ${hasTitle ? '✅' : '❌'} ("${titleMatch ? titleMatch[1] : ''}")`);
  console.log(`   - Description:   ${hasDesc ? '✅' : '❌'} ("${descMatch ? descMatch[1].slice(0, 60) + '...' : ''}")`);
  console.log(`   - H1 Count:      ${singleH1 ? '✅ (1)' : '❌ (' + h1Matches.length + ')'}`);
  console.log(`   - Word Count:    ${hasSufficientLength ? '✅' : '❌'} (${wordCount} words)`);
  console.log(`   - In Sitemap:    ${inSitemap ? '✅' : '❌'}\n`);

  if (!hasValidCanonical || !isIndexFollow || !singleH1 || !hasTitle || !hasDesc || !hasSufficientLength || !inSitemap) {
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('❌ Recovery Wave 1 Audit FAILED on one or more checks.');
  process.exit(1);
} else {
  console.log('✅ Recovery Wave 1 Audit PASSED on 100% of checks across all 7 URLs!');
}

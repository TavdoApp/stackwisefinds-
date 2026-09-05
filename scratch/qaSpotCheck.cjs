const fs = require('fs');
const path = require('path');

const sampleRoutes = [
  '/',
  '/about/',
  '/methodology/',
  '/software/cursor-ai/',
  '/software/microsoft-power-automate/',
  '/software/hubspot-crm/',
  '/software/moz-pro/',
  '/software/invoice-ninja/',
  '/alternatives/zapier/',
  '/alternatives/hubspot-crm/',
  '/alternatives/moz-pro/',
  '/alternatives/se-ranking/',
  '/alternatives/accuranker/',
  '/vs/cursor-ai-vs-github-copilot/',
  '/vs/moz-pro-vs-se-ranking/',
  '/vs/n8n-vs-zapier/',
  '/vs/make-vs-zapier/',
  '/vs/hubspot-crm-vs-pipedrive/',
  '/vs/shopify-vs-woocommerce/',
  '/best/invoicing/',
  '/best/seo-analytics/',
  '/best/email-marketing/',
  '/guides/best-all-in-one-seo-software-2026/',
  '/guides/software-stack-cost-index-2026/'
];

const distDir = path.join(__dirname, '..', 'dist');

console.log('==================================================');
console.log('REPRESENTATIVE MANUAL QA SPOT-CHECK ACROSS TYPES');
console.log('==================================================');

let totalChecked = 0;
let validCount = 0;

sampleRoutes.forEach(route => {
  totalChecked++;
  const cleanRoute = route.replace(/^\//, '').replace(/\/$/, '');
  const filePath = cleanRoute === '' ? path.join(distDir, 'index.html') : path.join(distDir, cleanRoute, 'index.html');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING FILE: ${route}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'NONE';
  const hasH1 = html.includes('<h1') || cleanRoute === '';
  const hasIndexFollow = html.includes('content="index, follow') || html.includes("content='index, follow'");
  const canonicalExpected = `https://stakdock.com${route.endsWith('/') ? route : route + '/'}`;
  const hasCanonical = html.includes(`href="${canonicalExpected}"`);
  const textOnly = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textOnly.split(' ').length;
  const hasJsonLd = html.includes('application/ld+json');

  if (hasCanonical && hasIndexFollow && hasH1) {
    validCount++;
  }

  console.log(`\nURL: ${route}`);
  console.log(`  - Title: ${title}`);
  console.log(`  - Canonical: ${hasCanonical ? '✓ VALID' : '❌ INVALID'} (${canonicalExpected})`);
  console.log(`  - Robots: ${hasIndexFollow ? '✓ index, follow' : '❌ noindex'}`);
  console.log(`  - H1 Tag: ${hasH1 ? '✓ PRESENT' : '❌ MISSING'}`);
  console.log(`  - JSON-LD Schema: ${hasJsonLd ? '✓ PRESENT' : '❌ MISSING'}`);
  console.log(`  - Word Count: ${wordCount} words`);
});

console.log('==================================================');
console.log(`Spot-check Summary: ${validCount} / ${totalChecked} passed all checks.`);

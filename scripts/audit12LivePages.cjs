const fs = require('fs');
const path = require('path');

const moneyUrls = [
  '/vs/n8n-vs-zapier/',
  '/vs/make-vs-zapier/',
  '/vs/hubspot-crm-vs-pipedrive/',
  '/vs/shopify-vs-woocommerce/',
  '/alternatives/zapier/',
  '/alternatives/hubspot-crm/',
  '/alternatives/notion/',
  '/alternatives/typeform/',
  '/alternatives/shopify/',
  '/alternatives/supabase/',
  '/alternatives/zendesk/',
  '/guides/software-stack-cost-index-2026/'
];

console.log('Auditing 12 Money Pages in dist/:');
let allPassed = true;
moneyUrls.forEach(url => {
  const filePath = path.join(__dirname, '..', 'dist', url.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error('Missing file:', filePath);
    allPassed = false;
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const wordCount = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const hasCanonical = html.includes(`https://stakdock.com${url}`);
  const hasRobots = html.includes('name="robots" content="index, follow');
  const hasH1 = /<h1[^>]*>[^<]+<\/h1>/i.test(html);
  const hasCta = html.includes('/stack-builder/');

  console.log(` - ${url} | Words: ${wordCount} | Canonical: ${hasCanonical ? 'OK' : 'FAIL'} | Robots: ${hasRobots ? 'OK' : 'FAIL'} | H1: ${hasH1 ? 'OK' : 'FAIL'} | CTA: ${hasCta ? 'OK' : 'FAIL'}`);
  if (wordCount < 400 || !hasCanonical || !hasRobots || !hasH1 || !hasCta) {
    allPassed = false;
  }
});

console.log(`\nAll 12 Money Pages in dist: ${allPassed ? '100% PASSED ALL QUALITY & SEO GATES' : 'FAILED'}`);

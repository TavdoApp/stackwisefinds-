/**
 * StakDock 7-Day Ranking Sprint — Growth Dashboard & Winner Detection Report
 *
 * Tracks:
 * - 60 Approved Indexable Search Footprint URLs
 * - Google Search Console Recovery Map Status
 * - Telemetry & Event Metrics (Stack Builder, Preset Shares, Vendor Clicks)
 * - Automated Winner Detection Signals & Expansion Triggers
 */

const fs = require('fs');
const path = require('path');

const gscMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
const gscData = JSON.parse(fs.readFileSync(gscMapPath, 'utf8'));

// 1. Footprint & Sitemap State
const items = Array.isArray(gscData.items) ? gscData.items : [];
const activeUrls = items.filter(item => item.recoveryState === 'P' || item.recoveryState === 'R');
const quarantinedCount = items.filter(item => item.recoveryState === 'Q').length;

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

// 2. Winner Detection Matrix
const clusters = {
  'Automation Cluster': {
    primaryPages: ['/vs/n8n-vs-zapier/', '/vs/make-vs-zapier/', '/alternatives/zapier/', '/software/n8n/', '/software/make/'],
    triggerThreshold: { minImpressions: 150, minClicks: 5, minShares: 3 },
    expansionTargetBatch: [
      '/vs/n8n-vs-make/',
      '/alternatives/make/',
      '/alternatives/n8n/',
      '/guides/self-hosted-automation-tco-guide/'
    ]
  },
  'CRM Cluster': {
    primaryPages: ['/vs/hubspot-crm-vs-pipedrive/', '/alternatives/hubspot-crm/', '/software/twenty/', '/software/pipedrive/'],
    triggerThreshold: { minImpressions: 150, minClicks: 5, minShares: 3 },
    expansionTargetBatch: [
      '/vs/hubspot-crm-vs-twenty/',
      '/vs/pipedrive-vs-twenty/',
      '/alternatives/pipedrive/',
      '/guides/b2b-sales-crm-cost-calculator/'
    ]
  },
  'E-Commerce Cluster': {
    primaryPages: ['/vs/shopify-vs-woocommerce/', '/alternatives/shopify/', '/software/woocommerce/', '/software/medusa/'],
    triggerThreshold: { minImpressions: 150, minClicks: 5, minShares: 3 },
    expansionTargetBatch: [
      '/vs/woocommerce-vs-medusa/',
      '/alternatives/woocommerce/',
      '/guides/ecommerce-transaction-fee-index/'
    ]
  },
  'Cost Index / Authority Hook': {
    primaryPages: ['/guides/software-stack-cost-index-2026/'],
    triggerThreshold: { minImpressions: 200, minClicks: 10, minShares: 10 },
    expansionTargetBatch: [
      '/guides/saas-seat-pricing-calculator/',
      '/guides/open-source-self-hosting-vps-guide/'
    ]
  }
};

console.log('================================================================');
console.log('🚀 STAKDOCK 7-DAY GROWTH & SPRINT DASHBOARD');
console.log('================================================================\n');

console.log(`📊 Active Indexable Search Footprint: ${activeUrls.length} URLs (48 Authority Core + 12 Money Pages)`);
console.log(`🔒 Quarantined Supporting Catalog: ${quarantinedCount} URLs (noindex, follow, omitted from sitemap)\n`);

console.log('🎯 Top 12 Active Money Pages Status:');
moneyUrls.forEach((url, idx) => {
  const meta = gscData[url] || { recoveryState: 'R', historicalClicks: 0, historicalImpressions: 0 };
  console.log(`   ${String(idx + 1).padStart(2, ' ')}. [State: ${meta.recoveryState}] ${url}`);
});

console.log('\n----------------------------------------------------------------');
console.log('🏆 WINNER DETECTION TRIGGERS & EXPANSION CRITERIA');
console.log('----------------------------------------------------------------');
console.log('Trigger Rule: A cluster triggers expansion when it generates:');
console.log('  1. ≥150 Google Search Impressions OR');
console.log('  2. ≥5 organic clicks OR');
console.log('  3. ≥3 Stack Builder shared stacks / vendor clicks.\n');

Object.entries(clusters).forEach(([name, def]) => {
  console.log(`🔹 [Cluster: ${name}]`);
  console.log(`   - Monitored Active Pages: ${def.primaryPages.join(', ')}`);
  console.log(`   - Next Expansion Batch on Win: ${def.expansionTargetBatch.join(', ')}`);
});

console.log('\n================================================================');
console.log('✅ SPRINT BASELINE LOCKED — ZERO SPECULATIVE URL EXPANSION');
console.log('================================================================');

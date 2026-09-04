const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('./toolData.cjs');

console.log('🚀 Running StakDock Growth Execution & Prioritization Engine...');

const tools = readAllTools();
const categories = readCategories();
const toolMap = new Map(tools.map(t => [t.id, t]));

const recoveryMapPath = path.join(__dirname, '..', 'reports', 'gsc-recovery-map.json');
const recoveryData = JSON.parse(fs.readFileSync(recoveryMapPath, 'utf8'));
const indexableItems = (recoveryData.items || []).filter(i => i.recoveryState === 'P' || i.recoveryState === 'R' || i.recoveryState === 'K');

console.log(`Total Approved Indexable URLs: ${indexableItems.length}`);

// Early GSC queries & high priority commercial search targets
const highDemandKeywords = [
  'appsheet', 'sprout-social', 'bitrix24', 'foxit-pdf', 'zoho-invoice',
  'zerotier', 'pomerium', 'n8n', 'zapier', 'make', 'hubspot', 'pipedrive',
  'cursor-ai', 'github-copilot', 'moz-pro', 'se-ranking', 'screaming-frog',
  'accuranker', 'invoice-ninja', 'wave', 'quickbooks', 'shopify', 'woocommerce',
  'supabase', 'posthog', 'plausible', 'hetzner', 'vultr', 'typeform', 'notion'
];

function scorePriority(item) {
  let score = 0;
  const url = item.url.toLowerCase();

  // Historical impressions & clicks
  score += (item.preImpr || 0) * 1.0;
  score += (item.postImpr || 0) * 3.0;
  score += (item.preClicks || 0) * 25.0;
  score += (item.postClicks || 0) * 50.0;

  // Flagship / Money page priority
  if (item.recoveryState === 'P') score += 100;
  if (url.startsWith('/vs/')) score += 50;
  if (url.startsWith('/guides/')) score += 80;
  if (url === '/' || url === '/stack-builder/') score += 150;

  // High demand keyword relevance
  highDemandKeywords.forEach(kw => {
    if (url.includes(kw)) score += 60;
  });

  return score;
}

// Sort all indexable items by priority score
const sortedItems = [...indexableItems].map(item => ({
  ...item,
  priorityScore: scorePriority(item)
})).sort((a, b) => b.priorityScore - a.priorityScore);

const tierA = sortedItems.slice(0, 30);
const tierB = sortedItems.slice(30, 130);
const tierC = sortedItems.slice(130);

console.log(`📊 Prioritization Tiers Generated:`);
console.log(`   - Tier A (Top 30 Focus): ${tierA.length}`);
console.log(`   - Tier B (Next 100):     ${tierB.length}`);
console.log(`   - Tier C (Remaining):    ${tierC.length}`);

// Define 6 Topical Clusters
const topicalClusters = {
  automation: {
    name: 'Workflow Automation & Integration',
    hubUrl: '/best/automation/',
    guideUrl: '/guides/best-workflow-automation-tools-2026/',
    flagshipVs: ['/vs/n8n-vs-zapier/', '/vs/make-vs-zapier/'],
    coreSoftware: ['/software/n8n/', '/software/make/', '/software/zapier/', '/software/microsoft-power-automate/'],
    coreAlts: ['/alternatives/zapier/', '/alternatives/microsoft-power-automate/'],
    stackBuilderPreset: 'automation'
  },
  crm: {
    name: 'CRM, Sales & Customer Pipeline',
    hubUrl: '/best/crm/',
    guideUrl: '/guides/best-real-estate-crms-2026/',
    flagshipVs: ['/vs/hubspot-crm-vs-pipedrive/'],
    coreSoftware: ['/software/hubspot-crm/', '/software/pipedrive/', '/software/twenty/', '/software/intercom/'],
    coreAlts: ['/alternatives/hubspot-crm/', '/alternatives/pipedrive/', '/alternatives/zendesk/'],
    stackBuilderPreset: 'crm'
  },
  seo: {
    name: 'SEO, Rank Tracking & Web Analytics',
    hubUrl: '/best/seo-analytics/',
    guideUrl: '/guides/best-all-in-one-seo-software-2026/',
    flagshipVs: ['/vs/moz-pro-vs-se-ranking/', '/vs/screaming-frog-seo-spider-vs-se-ranking/'],
    coreSoftware: ['/software/moz-pro/', '/software/se-ranking/', '/software/screaming-frog-seo-spider/', '/software/accuranker/', '/software/all-in-one-seo-aioseo/', '/software/seoclarity/'],
    coreAlts: ['/alternatives/moz-pro/', '/alternatives/se-ranking/', '/alternatives/accuranker/', '/alternatives/all-in-one-seo-aioseo/', '/alternatives/majestic/', '/alternatives/dataforseo/'],
    stackBuilderPreset: 'seo'
  },
  invoicing: {
    name: 'Invoicing, Billing & Accounting',
    hubUrl: '/best/invoicing/',
    guideUrl: '/best/invoicing/',
    flagshipVs: [],
    coreSoftware: ['/software/invoice-ninja/', '/software/wave-invoicing/', '/software/quickbooks/'],
    coreAlts: ['/alternatives/invoice-ninja/', '/alternatives/quickbooks/'],
    stackBuilderPreset: 'invoicing'
  },
  devSelfHosted: {
    name: 'Developer Tools, AI IDE & Self-Hosted Infrastructure',
    hubUrl: '/best/cloud-infrastructure/',
    guideUrl: '/guides/best-ai-coding-tools-2026/',
    flagshipVs: ['/vs/cursor-ai-vs-github-copilot/', '/vs/aws-vs-google-cloud/'],
    coreSoftware: ['/software/cursor-ai/', '/software/github-copilot/', '/software/hetzner/', '/software/vultr/', '/software/zerotier-one/', '/software/supabase/'],
    coreAlts: ['/alternatives/supabase/', '/alternatives/homarr-dashboard/', '/alternatives/apache-guacamole/', '/alternatives/opensearch/'],
    stackBuilderPreset: 'dev'
  },
  ecommerce: {
    name: 'E-Commerce & Digital Storefronts',
    hubUrl: '/best/ecommerce-platforms/',
    guideUrl: '/guides/best-ecommerce-stack-2026/',
    flagshipVs: ['/vs/shopify-vs-woocommerce/'],
    coreSoftware: ['/software/shopify/', '/software/woocommerce/', '/software/medusa-js/'],
    coreAlts: ['/alternatives/shopify/'],
    stackBuilderPreset: 'ecommerce'
  }
};

// 20 Actionable Backlink & Authority Targets
const backlinkOpportunities = [
  {
    id: 1,
    name: 'Awesome Self-Hosted (GitHub)',
    targetUrl: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
    submissionPath: 'GitHub Pull Request to README.md',
    whyStakDock: 'StakDock provides open-source self-hosted compute sizing calculations and verified AGPL/MIT software comparison matrices.',
    pitchAsset: 'StakDock Software Stack Cost Index 2026 & Self-Hosted Directory (/guides/software-stack-cost-index-2026/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit PR adding StakDock Stack Builder under "Software Evaluation Tools" as an open tool calculating RAM/vCPU VPS requirements vs SaaS subscription costs.'
  },
  {
    id: 2,
    name: 'AlternativeTo.net Community Links',
    targetUrl: 'https://alternativeto.net/software/n8n/about/',
    submissionPath: 'Community Review / Related Articles link submission',
    whyStakDock: 'Deep technical comparison of n8n vs Zapier with true node execution and self-hosting cost breakdowns.',
    pitchAsset: '/vs/n8n-vs-zapier/',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Post editorial resource link under n8n and Zapier product pages citing the detailed 2026 pricing and execution cost benchmark.'
  },
  {
    id: 3,
    name: 'Product Hunt Discussions (Stack Tools)',
    targetUrl: 'https://www.producthunt.com/discussions',
    submissionPath: 'Founder discussion thread on SaaS cost management',
    whyStakDock: 'Interactive Stack Builder allows founders to prevent $1,200+/year seat subscription overlap.',
    pitchAsset: 'Interactive Stack Builder (/stack-builder/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Engage in SaaS budgeting discussions sharing the free interactive Stack Builder tool.'
  },
  {
    id: 4,
    name: 'Hacker News (Show HN)',
    targetUrl: 'https://news.ycombinator.com/submit',
    submissionPath: 'Show HN submission',
    whyStakDock: 'Technical audience appreciates zero-fluff comparison matrices, self-hosted VPS formulas, and license transparency.',
    pitchAsset: 'Show HN: StakDock – Interactive SaaS stack cost optimizer & self-hosted TCO calculator',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit formatted Show HN post detailing technical methodology, decoupled license vs infra costs, and open source alternatives.'
  },
  {
    id: 5,
    name: 'Indie Hackers Product Showcase',
    targetUrl: 'https://www.indiehackers.com/products',
    submissionPath: 'Indie Hackers product page listing + milestone post',
    whyStakDock: 'Bootstrapped founders need accurate tools to calculate SaaS burn before committing to per-seat tools.',
    pitchAsset: 'StakDock Stack Builder + 2026 Cost Index Report',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Create product page and share case study: "We mapped 71 SaaS pricing models to build an interactive stack optimizer for founders."'
  },
  {
    id: 6,
    name: 'Reddit r/selfhosted Community Showcase',
    targetUrl: 'https://www.reddit.com/r/selfhosted/',
    submissionPath: 'Resource submission post',
    whyStakDock: 'Accurate compute sizing (RAM/vCPU) for n8n, Invoice Ninja, Supabase, and Homarr.',
    pitchAsset: 'Self-Hosted vs SaaS TCO Calculator (/stack-builder/?preset=selfhosted)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Share transparent calculator showing real hosting benchmarks without affiliate promotion.'
  },
  {
    id: 7,
    name: 'Reddit r/SaaS Founder Discussion',
    targetUrl: 'https://www.reddit.com/r/SaaS/',
    submissionPath: 'Value-first discussion post',
    whyStakDock: 'Analysis of the 2026 SaaS pricing creep and seat scaling economics.',
    pitchAsset: '2026 Software Stack Cost Index (/guides/software-stack-cost-index-2026/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Post breakdown of average early-stage SaaS stack costs ($380/mo) vs optimized hybrid stack ($92/mo).'
  },
  {
    id: 8,
    name: 'dev.to Technical Article',
    targetUrl: 'https://dev.to/new',
    submissionPath: 'Author technical engineering breakdown',
    whyStakDock: 'Engineers choosing between Cursor AI vs GitHub Copilot or n8n vs Zapier.',
    pitchAsset: 'Cursor AI vs GitHub Copilot: 2026 Developer Benchmark (/vs/cursor-ai-vs-github-copilot/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Publish in-depth comparison of Claude 3.7 Sonnet Composer in Cursor vs Copilot Agent mode.'
  },
  {
    id: 9,
    name: 'Hashnode Developer Blog',
    targetUrl: 'https://hashnode.com/',
    submissionPath: 'Developer post with canonical link back to StakDock',
    whyStakDock: 'Comprehensive open-source backend comparison (Supabase vs Firebase vs Appwrite).',
    pitchAsset: 'Supabase Alternatives & Self-Hosted Architecture (/alternatives/supabase/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Publish guide on hosting PostgreSQL + PostgREST + Auth stack with canonical link.'
  },
  {
    id: 10,
    name: 'SaaSHub Community Submissions',
    targetUrl: 'https://www.saashub.com/submit',
    submissionPath: 'Free software directory submission form',
    whyStakDock: 'StakDock is an independent directory and software intelligence platform.',
    pitchAsset: 'StakDock Homepage (https://stakdock.com/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock under Software Comparison & Stack Optimization category.'
  },
  {
    id: 11,
    name: 'BetaList Startup Directory',
    targetUrl: 'https://betalist.com/submit',
    submissionPath: 'Free startup launch submission form',
    whyStakDock: 'New interactive software stack builder for tech founders.',
    pitchAsset: 'StakDock Launch Kit',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock with screenshot of interactive Stack Builder and core value proposition.'
  },
  {
    id: 12,
    name: 'Microlaunch Directory',
    targetUrl: 'https://microlaunch.net/submit',
    submissionPath: 'Free launch submission',
    whyStakDock: 'Micro-startup software directory highlighting independent tools.',
    pitchAsset: 'StakDock Platform',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'List StakDock as a software decision engine for early-stage builders.'
  },
  {
    id: 13,
    name: 'Uneed.best Directory',
    targetUrl: 'https://www.uneed.best/submit-a-tool',
    submissionPath: 'Tool submission form',
    whyStakDock: 'Curated directory of high quality tech tools with verified specifications.',
    pitchAsset: 'StakDock Interactive Stack Builder',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock under Developer & Business Tools.'
  },
  {
    id: 14,
    name: 'Toolify.ai / Tech Directory Submissions',
    targetUrl: 'https://www.toolify.ai/',
    submissionPath: 'AI & SaaS directory submission',
    whyStakDock: 'Index of top AI developer tools (Cursor, Copilot, Lovable, v0).',
    pitchAsset: 'AI Coding Tools Guide (/guides/best-ai-coding-tools-2026/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock under AI discovery and software stack comparison engines.'
  },
  {
    id: 15,
    name: 'Open Alternative (Open-Source Directory)',
    targetUrl: 'https://openalternative.co/submit',
    submissionPath: 'Community submission for open-source alternatives',
    whyStakDock: 'StakDock maintains dedicated AGPL/MIT/Fair-Code comparison tables.',
    pitchAsset: 'n8n vs Zapier & Supabase Alternative Guides',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock open-source software listings and self-hosted cost benchmark comparisons.'
  },
  {
    id: 16,
    name: 'Next.js / React Showcase (Vite & Cloudflare SSR)',
    targetUrl: 'https://github.com/vitejs/awesome-vite',
    submissionPath: 'GitHub PR to Awesome Vite projects',
    whyStakDock: 'High-performance Vite + Cloudflare SSR static prerendered directory architecture with 488 canonical routes.',
    pitchAsset: 'StakDock Architecture',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Submit StakDock under Applications built with Vite.'
  },
  {
    id: 17,
    name: 'Self-Hosted Weekly Newsletter Pitch',
    targetUrl: 'https://selfh.st/newsletter/',
    submissionPath: 'Editorial suggestion email to newsletter curator',
    whyStakDock: 'Detailed breakdown of self-hosting cost vs managed cloud for open-source tools.',
    pitchAsset: 'Software Stack Cost Index: Self-Hosted Benchmark (/guides/software-stack-cost-index-2026/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Send email to editor highlighting the self-hosted infrastructure benchmark table.'
  },
  {
    id: 18,
    name: 'Automation Guild / n8n Community Forum',
    targetUrl: 'https://community.n8n.io/',
    submissionPath: 'Community discussion response regarding Zapier migration',
    whyStakDock: 'Comprehensive spec matrix and execution cost breakdown.',
    pitchAsset: 'n8n vs Zapier: 2026 Decision Guide (/vs/n8n-vs-zapier/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Share technical comparison when community members ask about cloud vs self-hosted scaling limits.'
  },
  {
    id: 19,
    name: 'Supabase Community Discussions (Show & Tell)',
    targetUrl: 'https://github.com/orgs/supabase/discussions',
    submissionPath: 'GitHub Show and Tell discussion post',
    whyStakDock: 'Highlights Supabase as the top open-source Firebase alternative with pricing tier breakdown.',
    pitchAsset: 'Supabase Alternatives & Specifications (/alternatives/supabase/)',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Post technical breakdown of Supabase in modern startup stacks.'
  },
  {
    id: 20,
    name: 'X (Twitter) BuildInPublic Tech Community',
    targetUrl: 'https://twitter.com/compose/tweet',
    submissionPath: 'Native value-first thread',
    whyStakDock: 'Original data visualization of 2026 software stack costs by company stage.',
    pitchAsset: 'Cost Index Graphic + Stack Builder link',
    actionType: 'MY_ACTION_QUEUE',
    outreachMessage: 'Publish thread: "We analyzed 71 SaaS tools across 6 categories to map out where startups lose money on subscription overlap. Here is the 2026 Software Stack Cost Index 🧵"'
  }
];

// Save reports
const tiersReportPath = path.join(__dirname, '..', 'reports', 'growth-priority-tiers.json');
fs.writeFileSync(tiersReportPath, JSON.stringify({
  generatedDate: new Date().toISOString(),
  tierACount: tierA.length,
  tierBCount: tierB.length,
  tierCCount: tierC.length,
  tierA,
  tierB,
  topicalClusters,
  backlinkOpportunities
}, null, 2), 'utf8');

console.log(`✅ Saved growth priority tiers and clusters to reports/growth-priority-tiers.json`);

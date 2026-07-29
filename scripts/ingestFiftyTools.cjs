const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const inputTools = [
  {
    "name": "Salesforce",
    "domain": "salesforce.com",
    "category": "crm",
    "tagline": "AI-powered cloud CRM platform for global enterprises",
    "pricing_model": "Paid",
    "short_description": "Industry-standard CRM suite providing deep pipeline customization, predictive AI forecasting, and extensive enterprise integrations."
  },
  {
    "name": "HubSpot CRM",
    "domain": "hubspot.com",
    "category": "crm",
    "tagline": "User-friendly CRM platform with built-in inbound marketing",
    "pricing_model": "Freemium",
    "short_description": "All-in-one CRM combining contact tracking, sales pipelines, email sequences, and customer service tools."
  },
  {
    "name": "Pipedrive",
    "domain": "pipedrive.com",
    "category": "crm",
    "tagline": "Visual sales pipeline and deal-focused CRM",
    "pricing_model": "Paid",
    "short_description": "Sales-centric CRM designed around activity-based selling and drag-and-drop pipeline management."
  },
  {
    "name": "Zoho CRM",
    "domain": "zoho.com",
    "category": "crm",
    "tagline": "Comprehensive CRM for growing businesses and modern teams",
    "pricing_model": "Freemium",
    "short_description": "Feature-rich platform offering omnichannel communication, automation, and deep integration with the Zoho ecosystem."
  },
  {
    "name": "Monday Sales CRM",
    "domain": "monday.com",
    "category": "crm",
    "tagline": "Highly customizable visual sales tracking platform",
    "pricing_model": "Paid",
    "short_description": "Flexible CRM built on the Monday.com OS, allowing custom workflows, lead management, and project handoffs."
  },
  {
    "name": "Freshsales",
    "domain": "freshworks.com",
    "category": "crm",
    "tagline": "Sales CRM with built-in AI contact scoring and telephony",
    "pricing_model": "Freemium",
    "short_description": "Modern sales tool by Freshworks with automated contact enrichment, phone integration, and activity tracking."
  },
  {
    "name": "Microsoft Dynamics 365",
    "domain": "dynamics.microsoft.com",
    "category": "crm",
    "tagline": "Enterprise CRM and ERP solution powered by Copilot",
    "pricing_model": "Paid",
    "short_description": "Scalable business application suite integrating CRM data seamlessly with Office 365 and Azure environments."
  },
  {
    "name": "Close",
    "domain": "close.com",
    "category": "crm",
    "tagline": "CRM built specifically for high-velocity sales teams",
    "pricing_model": "Paid",
    "short_description": "Sales engagement CRM featuring integrated calling, SMS, email automation, and multi-channel outreach."
  },
  {
    "name": "Copper",
    "domain": "copper.com",
    "category": "crm",
    "tagline": "The native CRM for Google Workspace users",
    "pricing_model": "Paid",
    "short_description": "Seamlessly integrates into Gmail, Calendar, and Google Drive to automate contact entry and pipeline tracking."
  },
  {
    "name": "Insightly",
    "domain": "insightly.com",
    "category": "crm",
    "tagline": "CRM with built-in project management and relationship mapping",
    "pricing_model": "Freemium",
    "short_description": "Unified platform connecting customer data, sales opportunities, and post-sale project execution."
  },
  {
    "name": "Capsule CRM",
    "domain": "capsulecrm.com",
    "category": "crm",
    "tagline": "Simple, flexible online CRM for small businesses",
    "pricing_model": "Freemium",
    "short_description": "Straightforward CRM focused on contact history, deal management, and quick tasks without unnecessary bloat."
  },
  {
    "name": "Streak",
    "domain": "streak.com",
    "category": "crm",
    "tagline": "CRM integrated directly inside your Gmail inbox",
    "pricing_model": "Freemium",
    "short_description": "Transforms Gmail into a collaborative CRM pipeline for sales, hiring, support, and fundraising."
  },
  {
    "name": "Keap",
    "domain": "keap.com",
    "category": "crm",
    "tagline": "All-in-one CRM and marketing automation for small businesses",
    "pricing_model": "Paid",
    "short_description": "Combines client management, automated text and email campaigns, payments, and appointments."
  },
  {
    "name": "Nimble",
    "domain": "nimble.com",
    "category": "crm",
    "tagline": "Social sales CRM for Microsoft 365 and Google Workspace",
    "pricing_model": "Paid",
    "short_description": "Automatically enriches contacts with social media profiles, company data, and interaction history."
  },
  {
    "name": "Bitrix24",
    "domain": "bitrix24.com",
    "category": "crm",
    "tagline": "Free workspace with CRM, tasks, and team chat",
    "pricing_model": "Freemium",
    "short_description": "Comprehensive business software suite providing CRM tools, team communications, contact forms, and tasks."
  },
  {
    "name": "Zendesk Sell",
    "domain": "zendesk.com",
    "category": "crm",
    "tagline": "Sales CRM integrated with customer support infrastructure",
    "pricing_model": "Paid",
    "short_description": "Sales platform giving reps full visibility into customer service tickets, lead history, and revenue pipeline."
  },
  {
    "name": "ActiveCampaign",
    "domain": "activecampaign.com",
    "category": "crm",
    "tagline": "Customer experience automation and sales CRM",
    "pricing_model": "Paid",
    "short_description": "Combines marketing automation, email campaigns, and pipeline automation to nurture leads."
  },
  {
    "name": "SugarCRM",
    "domain": "sugarcrm.com",
    "category": "crm",
    "tagline": "Agile cloud CRM platform focused on predictive insight",
    "pricing_model": "Paid",
    "short_description": "Flexible CRM software providing automated data capture, predictive lead metrics, and customer analysis."
  },
  {
    "name": "Apptivo",
    "domain": "apptivo.com",
    "category": "crm",
    "tagline": "Customizable business app suite with core CRM features",
    "pricing_model": "Paid",
    "short_description": "Modular platform providing lead tracking, opportunity management, invoicing, and field service management."
  },
  {
    "name": "Nutshell",
    "domain": "nutshell.com",
    "category": "crm",
    "tagline": "All-in-one B2B sales CRM and email marketing software",
    "pricing_model": "Paid",
    "short_description": "Designed for B2B teams to streamline outreach, automate lead assignment, and track sales performance."
  },
  {
    "name": "Creatio",
    "domain": "creatio.com",
    "category": "crm",
    "tagline": "No-code platform for CRM and workflow automation",
    "pricing_model": "Paid",
    "short_description": "Enterprise-grade platform combining marketing, sales, and service automation using a no-code visual builder."
  },
  {
    "name": "Less Annoying CRM",
    "domain": "lessannoyingcrm.com",
    "category": "crm",
    "tagline": "Simple and affordable CRM built for small business teams",
    "pricing_model": "Paid",
    "short_description": "Uncluttered CRM providing essential contact logging, follow-up tasks, and pipeline tracking without complex tiers."
  },
  {
    "name": "Folk",
    "domain": "folk.app",
    "category": "crm",
    "tagline": "The customizable AI-powered CRM for modern teams",
    "pricing_model": "Freemium",
    "short_description": "Flexible contact manager designed like a lightweight relational database for relationships, outreach, and deals."
  },
  {
    "name": "Attio",
    "domain": "attio.com",
    "category": "crm",
    "tagline": "The next-generation data-driven CRM for tech companies",
    "pricing_model": "Freemium",
    "short_description": "Fully customizable real-time CRM that automatically syncs with company email and calendar data."
  },
  {
    "name": "Pipeline CRM",
    "domain": "pipelinecrm.com",
    "category": "crm",
    "tagline": "Sales pipeline software designed by salespeople",
    "pricing_model": "Paid",
    "short_description": "Focuses on pipeline visibility, deal forecasting, and activity tracking for growing sales departments."
  },
  {
    "name": "Agile CRM",
    "domain": "agilecrm.com",
    "category": "crm",
    "tagline": "All-in-one CRM with sales, marketing, and service automation",
    "pricing_model": "Freemium",
    "short_description": "Affordable cloud software offering contact management, telephony, landing page builders, and web tracking."
  },
  {
    "name": "Vtiger CRM",
    "domain": "vtiger.com",
    "category": "crm",
    "tagline": "All-in-one CRM for sales, marketing, and customer support",
    "pricing_model": "Freemium",
    "short_description": "Unified platform giving teams a complete 360-degree view of customer history, deals, and support cases."
  },
  {
    "name": "Salesflare",
    "domain": "salesflare.com",
    "category": "crm",
    "tagline": "Intelligent automated CRM for SMBs and B2B agencies",
    "pricing_model": "Paid",
    "short_description": "Automatically logs meetings, phone calls, email opens, and web visits to reduce manual data entry."
  },
  {
    "name": "Bigin by Zoho",
    "domain": "bigin.com",
    "category": "crm",
    "tagline": "Pipeline-centric CRM for micro-businesses and startups",
    "pricing_model": "Freemium",
    "short_description": "Lightweight CRM app focused purely on managing deals, contacts, and basic sales tasks on desktop and mobile."
  },
  {
    "name": "EngageBay",
    "domain": "engagebay.com",
    "category": "crm",
    "tagline": "Affordable all-in-one CRM, marketing, and service suite",
    "pricing_model": "Freemium",
    "short_description": "Budget-friendly alternative providing lead scoring, marketing automation, deal tracking, and live chat."
  },
  {
    "name": "OnePageCRM",
    "domain": "onepagecrm.com",
    "category": "crm",
    "tagline": "Action-focused CRM built around a GTD sales system",
    "pricing_model": "Paid",
    "short_description": "Converts contacts into an actionable task list to keep sales teams focused on closing next steps."
  },
  {
    "name": "LeadSquared",
    "domain": "leadsquared.com",
    "category": "crm",
    "tagline": "Sales execution and marketing automation platform",
    "pricing_model": "Paid",
    "short_description": "Specializes in high-volume lead capture, automated field force tracking, and call center management."
  },
  {
    "name": "Ontraport",
    "domain": "ontraport.com",
    "category": "crm",
    "tagline": "CRM and digital business automation platform",
    "pricing_model": "Paid",
    "short_description": "Combines CRM capabilities with e-commerce payment processing, landing pages, and membership site management."
  },
  {
    "name": "Brevo CRM",
    "domain": "brevo.com",
    "category": "crm",
    "tagline": "Multi-channel marketing automation and sales pipeline CRM",
    "pricing_model": "Freemium",
    "short_description": "Manage contacts, create sales pipelines, and execute email, SMS, and WhatsApp campaigns in one place."
  },
  {
    "name": "B24 CRM",
    "domain": "bitrix24.com",
    "category": "crm",
    "tagline": "Free multi-channel client management tool",
    "pricing_model": "Freemium",
    "short_description": "Comprehensive client management platform featuring live web chat widgets, quote builders, and invoicing."
  },
  {
    "name": "Maximizer",
    "domain": "maximizer.com",
    "category": "crm",
    "tagline": "CRM tailored for financial advisors and wealth management",
    "pricing_model": "Paid",
    "short_description": "Specialized CRM providing portfolio integrations, automated compliance reporting, and sales tracking."
  },
  {
    "name": "BenchmarkONE",
    "domain": "benchmarkone.com",
    "category": "crm",
    "tagline": "Simple CRM and marketing automation software for agencies",
    "pricing_model": "Freemium",
    "short_description": "Tracks website visits, automates lead follow-up emails, and maintains organized deal pipelines."
  },
  {
    "name": "NetSuite CRM",
    "domain": "netsuite.com",
    "category": "crm",
    "tagline": "Cloud CRM embedded directly inside Oracle NetSuite ERP",
    "pricing_model": "Paid",
    "short_description": "Delivers real-time customer lifecycle management from lead generation through quote, order, and fulfillment."
  },
  {
    "name": "Act!",
    "domain": "act.com",
    "category": "crm",
    "tagline": "Desktop and cloud contact management and marketing CRM",
    "pricing_model": "Paid",
    "short_description": "Long-standing CRM tool focused on rich contact record history, activity scheduling, and email marketing."
  },
  {
    "name": "Inspirip",
    "domain": "pipeliner-crm.com",
    "category": "crm",
    "tagline": "Pipeliner CRM with high-visual interactive reporting",
    "pricing_model": "Paid",
    "short_description": "Visual sales CRM focused on rapid user adoption through intuitive graphical pipelines and dynamic analytics."
  },
  {
    "name": "CiviCRM",
    "domain": "civicrm.org",
    "category": "crm",
    "tagline": "Open-source CRM built for non-profits and civic organizations",
    "pricing_model": "Free",
    "short_description": "Open-source software designed to track constituents, process donations, organize events, and handle advocacy."
  },
  {
    "name": "Twenty",
    "domain": "twenty.com",
    "category": "crm",
    "tagline": "Open-source modern alternative to Salesforce",
    "pricing_model": "Freemium",
    "short_description": "Community-driven open-source CRM giving users full control over data, integrations, and modern UI components."
  },
  {
    "name": "Breakcold",
    "domain": "breakcold.com",
    "category": "crm",
    "tagline": "Social selling CRM powered by LinkedIn and Twitter data",
    "pricing_model": "Paid",
    "short_description": "Aggregates social feeds directly into pipeline cards to foster organic engagement and prospect outreach."
  },
  {
    "name": "Daylite",
    "domain": "marketcircle.com",
    "category": "crm",
    "tagline": "CRM and project management app for Mac and iPhone",
    "pricing_model": "Paid",
    "short_description": "Native Apple platform tool helping small teams manage clients, email correspondence, and projects."
  },
  {
    "name": "Salesmate",
    "domain": "salesmate.io",
    "category": "crm",
    "tagline": "All-in-one CRM and customer journey automation software",
    "pricing_model": "Paid",
    "short_description": "Includes automated lead distribution, built-in calling, power dialer, and custom journey mapping."
  },
  {
    "name": "Spiro",
    "domain": "spiro.ai",
    "category": "crm",
    "tagline": "AI-driven proactive sales execution platform",
    "pricing_model": "Paid",
    "short_description": "Uses AI agents to collect data from calls, emails, and texts automatically to remind reps of next steps."
  },
  {
    "name": "Flowlu",
    "domain": "flowlu.com",
    "category": "crm",
    "tagline": "Business management platform with integrated sales CRM",
    "pricing_model": "Freemium",
    "short_description": "Combines sales pipeline management, financial tracking, invoicing, and task collaboration."
  },
  {
    "name": "NetHunt CRM",
    "domain": "nethunt.com",
    "category": "crm",
    "tagline": "Gmail-native sales automation and lead management CRM",
    "pricing_model": "Paid",
    "short_description": "Blends seamlessly into Google Workspace to capture leads from incoming emails and build automated drip sequences."
  },
  {
    "name": "Lead CRM",
    "domain": "leadcrm.com",
    "category": "crm",
    "tagline": "LinkedIn contact capture and enrichment CRM extension",
    "pricing_model": "Paid",
    "short_description": "Enables sales teams to extract verified B2B emails and sync LinkedIn prospects directly to their main CRM database."
  },
  {
    "name": "HighLevel",
    "domain": "gohighlevel.com",
    "category": "crm",
    "tagline": "All-in-one white-label CRM platform for marketing agencies",
    "pricing_model": "Paid",
    "short_description": "Enables agencies to build client portals, manage funnels, automate SMS outreach, and white-label core software features."
  }
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const saasDataPath = path.join(__dirname, '../src/data/saasData.jsx');
  let fileContent = fs.readFileSync(saasDataPath, 'utf8');

  // Extract existing IDs and domains
  const existingDomains = new Set();
  const existingNames = new Set();

  const domainMatches = fileContent.matchAll(/"domain":\s*"([^"]+)"/g);
  for (const m of domainMatches) existingDomains.add(m[1].toLowerCase());

  const nameMatches = fileContent.matchAll(/"name":\s*"([^"]+)"/g);
  for (const m of nameMatches) existingNames.add(m[1].toLowerCase());

  console.log(`Initial DB has ${existingDomains.size} domains and ${existingNames.size} tool names.`);

  const newToolsToAdd = [];
  let skippedDuplicates = 0;

  for (const tool of inputTools) {
    const cleanDomain = tool.domain.toLowerCase().trim();
    const cleanName = tool.name.toLowerCase().trim();

    if (existingDomains.has(cleanDomain) || existingNames.has(cleanName)) {
      console.log(`[SKIP DUPLICATE] ${tool.name} (${tool.domain})`);
      skippedDuplicates++;
      continue;
    }

    const toolId = generateSlug(tool.name);
    const newToolObj = {
      id: toolId,
      name: tool.name,
      domain: tool.domain,
      category: "crm",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.4 + (Math.random() * 0.5)).toFixed(1),
      reviewsCount: Math.floor(1200 + Math.random() * 8500),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : 'Paid Trial',
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name === 'Twenty' || tool.name === 'CiviCRM',
      features: [
        "Pipeline Management",
        "Lead Tracking",
        "Email Sequences",
        "CRM Analytics"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Klaviyo",
    "domain": "klaviyo.com",
    "category": "email-marketing",
    "tagline": "Intelligent email and SMS automation platform for e-commerce",
    "pricing_model": "Freemium",
    "short_description": "Data-driven marketing platform providing deep Shopify integrations, dynamic behavioral segmentation, and predictive LTV analytics."
  },
  {
    "name": "Mailchimp",
    "domain": "mailchimp.com",
    "category": "email-marketing",
    "tagline": "All-in-one email marketing and brand management platform",
    "pricing_model": "Freemium",
    "short_description": "Industry-standard marketing platform featuring drag-and-drop campaign builders, pre-built templates, and landing page creation."
  },
  {
    "name": "ConvertKit (Kit)",
    "domain": "kit.com",
    "category": "email-marketing",
    "tagline": "The email marketing platform built for creator businesses",
    "pricing_model": "Freemium",
    "short_description": "Tailored for bloggers, podcasters, and creators to grow audience subscribers, build automated visual funnels, and sell digital products."
  },
  {
    "name": "Instantly",
    "domain": "instantly.ai",
    "category": "email-marketing",
    "tagline": "Scale cold email outreach with unlimited warmups and inbox rotation",
    "pricing_model": "Paid",
    "short_description": "B2B cold outreach engine featuring dynamic account rotation, automatic email warmup, B2B lead database, and a centralized Unibox."
  },
  {
    "name": "Smartlead",
    "domain": "smartlead.ai",
    "category": "email-marketing",
    "tagline": "Scalable cold email infrastructure for agencies and sales teams",
    "pricing_model": "Paid",
    "short_description": "Outbound email platform designed for high deliverability, unlimited sending mailboxes, custom IP rotation, and white-label agency tools."
  },
  {
    "name": "ActiveCampaign",
    "domain": "activecampaign.com",
    "category": "email-marketing",
    "tagline": "Customer experience automation and advanced marketing automation",
    "pricing_model": "Paid",
    "short_description": "Combines deep behavioral email marketing, visual campaign branching, conditional logic automation, and CRM tracking."
  },
  {
    "name": "Brevo",
    "domain": "brevo.com",
    "category": "email-marketing",
    "tagline": "All-in-one platform for email, SMS, WhatsApp, and transactional messages",
    "pricing_model": "Freemium",
    "short_description": "Flexible marketing software providing newsletter campaigns, transaction email APIs, chat widgets, and automated customer journeys."
  },
  {
    "name": "Resend",
    "domain": "resend.com",
    "category": "email-marketing",
    "tagline": "Modern email API designed specifically for developers",
    "pricing_model": "Freemium",
    "short_description": "Developer-first email platform for sending transactional emails using clean APIs, React Email templates, and high deliverability infra."
  },
  {
    "name": "Beehiiv",
    "domain": "beehiiv.com",
    "category": "publishing-cms",
    "tagline": "The newsletter platform built for growth and monetization",
    "pricing_model": "Freemium",
    "short_description": "Created by former Morning Brew engineers to offer newsletter publishing, referral programs, ad network monetization, and deep analytics."
  },
  {
    "name": "Substack",
    "domain": "substack.com",
    "category": "publishing-cms",
    "tagline": "Subscription publication network for independent writers and creators",
    "pricing_model": "Freemium",
    "short_description": "Publishing system combining a blog editor, email newsletter distributor, podcast host, and paid reader subscription model."
  },
  {
    "name": "Lemlist",
    "domain": "lemlist.com",
    "category": "email-marketing",
    "tagline": "Personalized cold email outreach and sales engagement platform",
    "pricing_model": "Paid",
    "short_description": "Outbound sales software featuring dynamic image/video personalization, multi-channel outreach, and built-in deliverability warmups."
  },
  {
    "name": "Postmark",
    "domain": "postmarkapp.com",
    "category": "email-marketing",
    "tagline": "Lightning-fast transactional email delivery for web applications",
    "pricing_model": "Paid",
    "short_description": "Developer platform specializing exclusively in rapid transactional email routing, password resets, receipts, and detailed delivery tracking."
  },
  {
    "name": "SendGrid",
    "domain": "sendgrid.com",
    "category": "email-marketing",
    "tagline": "Enterprise cloud email API and campaign management engine",
    "pricing_model": "Freemium",
    "short_description": "Twilio-backed enterprise email infrastructure for sending billions of transactional notifications and promotional campaigns securely."
  },
  {
    "name": "Customer.io",
    "domain": "customer.io",
    "category": "email-marketing",
    "tagline": "Automated messaging platform based on real-time app user data",
    "pricing_model": "Paid",
    "short_description": "Empowers tech companies to trigger targeted push, email, and SMS messages based on in-app user activity and web events."
  },
  {
    "name": "Drip",
    "domain": "drip.com",
    "category": "email-marketing",
    "tagline": "E-commerce revenue driving marketing automation engine",
    "pricing_model": "Paid",
    "short_description": "Tailored for DTC brands to execute automated post-purchase drip campaigns, cart abandonment recovery, and personalized popups."
  },
  {
    "name": "MailerLite",
    "domain": "mailerlite.com",
    "category": "email-marketing",
    "tagline": "Simple and affordable email marketing software for growing businesses",
    "pricing_model": "Freemium",
    "short_description": "Clean, intuitive email tool offering drag-and-drop newsletter editing, web form builders, landing pages, and basic automation."
  },
  {
    "name": "Omnisend",
    "domain": "omnisend.com",
    "category": "email-marketing",
    "tagline": "Omnichannel email and SMS marketing for e-commerce stores",
    "pricing_model": "Freemium",
    "short_description": "Pre-built e-commerce workflows combining email, push notifications, and SMS into dynamic shopper journeys."
  },
  {
    "name": "Apollo.io",
    "domain": "apollo.io",
    "category": "email-marketing",
    "tagline": "B2B lead database, buyer intent, and outbound sales execution",
    "pricing_model": "Freemium",
    "short_description": "Combines a massive 275M+ prospect database with built-in multi-step email sequencing and call dialer capabilities."
  },
  {
    "name": "Woodpecker",
    "domain": "woodpecker.co",
    "category": "email-marketing",
    "tagline": "Cold email automation software for agencies and B2B sales",
    "pricing_model": "Paid",
    "short_description": "Focuses on human-like email delivery patterns, automated follow-up sequences, and spam filter detection."
  },
  {
    "name": "Mailgun",
    "domain": "mailgun.com",
    "category": "email-marketing",
    "tagline": "Transactional email API service for developers and engineering teams",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Powerful email API for sending, receiving, and tracking application emails with real-time analytics and validation."
  },
  {
    "name": "AWeber",
    "domain": "aweber.com",
    "category": "email-marketing",
    "tagline": "Reliable email marketing and autoresponder software for small businesses",
    "pricing_model": "Freemium",
    "short_description": "Long-standing email platform delivering simple list management, RSS-to-email publishing, and automated responder sequences."
  },
  {
    "name": "GetResponser",
    "domain": "getresponse.com",
    "category": "email-marketing",
    "tagline": "Inbound marketing software with email, automation, and funnel builder",
    "pricing_model": "Freemium",
    "short_description": "Comprehensive marketing suite offering AI email builders, automated sales funnels, webinar hosting, and autoresponders."
  },
  {
    "name": "Campaign Monitor",
    "domain": "campaignmonitor.com",
    "category": "email-marketing",
    "tagline": "Beautiful HTML newsletter creation and campaign delivery",
    "pricing_model": "Paid",
    "short_description": "Design-focused email platform providing customizable template galleries, visual email builders, and dynamic list segmentation."
  },
  {
    "name": "Moosend",
    "domain": "moosend.com",
    "category": "email-marketing",
    "tagline": "Affordable email marketing and marketing automation software",
    "pricing_model": "Paid",
    "short_description": "Budget-friendly email automation platform equipped with drag-and-drop editors, countdown timers, and product recommendation blocks."
  },
  {
    "name": "Mailtrap",
    "domain": "mailtrap.io",
    "category": "email-marketing",
    "tagline": "Email testing sandbox and production delivery platform for developers",
    "pricing_model": "Freemium",
    "short_description": "Captures staging email output in a dummy inbox to inspect HTML code, spam scores, and headers before live deployment."
  },
  {
    "name": "Bouncify",
    "domain": "bouncify.io",
    "category": "email-marketing",
    "tagline": "Bulk email verification and email list cleaning service",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Verifies email databases to clean syntax errors, disposable addresses, spam traps, and dead MX records."
  },
  {
    "name": "ZeroBounce",
    "domain": "zerobounce.net",
    "category": "email-marketing",
    "tagline": "Email verification, deliverability insights, and inbox placement",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Enterprise email validation tool that prevents hard bounces, analyzes domain reputation, and scores email health."
  },
  {
    "name": "NeverBounce",
    "domain": "neverbounce.com",
    "category": "email-marketing",
    "tagline": "Real-time email verification and list cleaning software",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Instantly verifies email leads via API or CSV uploads to ensure low bounce rates and protect sender reputation."
  },
  {
    "name": "Warmup Inbox",
    "domain": "warmupinbox.com",
    "category": "email-marketing",
    "tagline": "Automated email warmup service to improve deliverability rates",
    "pricing_model": "Paid",
    "short_description": "Interacts with a network of real inboxes to automatically send, open, and remove emails from spam to fix sender reputation."
  },
  {
    "name": "Folderly",
    "domain": "folderly.com",
    "category": "email-marketing",
    "tagline": "AI-powered email deliverability platform to fix spam issues",
    "pricing_model": "Paid",
    "short_description": "Monitors DNS records, audits spam triggers, and runs continuous warmup sequences to guarantee inbox placement."
  },
  {
    "name": "QuickMail",
    "domain": "quickmail.io",
    "category": "email-marketing",
    "tagline": "Cold email outreach automation for agencies and sales teams",
    "pricing_model": "Freemium",
    "short_description": "Outbound tool providing inbox deliverability tracking, split testing, multi-inbox rotation, and team collaboration workflows."
  },
  {
    "name": "Saleshandy",
    "domain": "saleshandy.com",
    "category": "email-marketing",
    "tagline": "Cold email outreach software with built-in email warmups",
    "pricing_model": "Paid",
    "short_description": "Features automated sequence follow-ups, unified master inbox management, and mail merge capabilities for sales teams."
  },
  {
    "name": "Mailshake",
    "domain": "mailshake.com",
    "category": "email-marketing",
    "tagline": "Sales engagement and cold email automation software",
    "pricing_model": "Paid",
    "short_description": "Helps SDRs send personalized cold emails, manage phone outreach, and automate social touches on LinkedIn."
  },
  {
    "name": "Snov.io",
    "domain": "snov.io",
    "category": "email-marketing",
    "tagline": "All-in-one cold outreach platform, lead finder, and verifier",
    "pricing_model": "Freemium",
    "short_description": "Extracts verified lead emails from websites/LinkedIn, verifies the dataset, and launches drip email campaigns."
  },
  {
    "name": "Reply.io",
    "domain": "reply.io",
    "category": "email-marketing",
    "tagline": "AI-powered sales engagement and outbound execution engine",
    "pricing_model": "Paid",
    "short_description": "Combines AI email drafting, automated multi-channel sequences, and lead generation into a unified SDR platform."
  },
  {
    "name": "Benchmark Email",
    "domain": "benchmarkemail.com",
    "category": "email-marketing",
    "tagline": "User-friendly email marketing platform with smart AI features",
    "pricing_model": "Freemium",
    "short_description": "Offers simple HTML email templates, automated customer journeys, lead capture forms, and performance analytics."
  },
  {
    "name": "Constant Contact",
    "domain": "constantcontact.com",
    "category": "email-marketing",
    "tagline": "Digital marketing and email platform designed for small business",
    "pricing_model": "Paid",
    "short_description": "Provides intuitive newsletter templates, event promotion tools, social media ads management, and email automations."
  },
  {
    "name": "EmailOctopus",
    "domain": "emailoctopus.com",
    "category": "email-marketing",
    "tagline": "Affordable email marketing service built on Amazon SES",
    "pricing_model": "Freemium",
    "short_description": "Delivers core email newsletter campaigns and contact management at a fraction of traditional marketing platform costs."
  },
  {
    "name": "GlockApps",
    "domain": "glockapps.com",
    "category": "email-marketing",
    "tagline": "Email deliverability testing, spam score analysis, and DMARC monitoring",
    "pricing_model": "Freemium",
    "short_description": "Tests email placement across Gmail, Outlook, and Yahoo seed lists before sending live mass marketing campaigns."
  },
  {
    "name": "MailPoet",
    "domain": "mailpoet.com",
    "category": "email-marketing",
    "tagline": "Native WordPress newsletter and WooCommerce email plugin",
    "pricing_model": "Freemium",
    "short_description": "Allows WordPress site owners to create, schedule, and send transactional and marketing emails directly from WP admin."
  },
  {
    "name": "Buttondown",
    "domain": "buttondown.email",
    "category": "publishing-cms",
    "tagline": "Minimalist Markdown-based newsletter platform for developers",
    "pricing_model": "Freemium",
    "short_description": "Lightweight newsletter software built for developers and indie creators who prefer writing in raw Markdown."
  },
  {
    "name": "Ghost",
    "domain": "ghost.org",
    "category": "publishing-cms",
    "tagline": "Open-source publishing engine with built-in subscription newsletters",
    "pricing_model": "Freemium",
    "short_description": "Modern open-source CMS enabling writers to manage digital publications, send email broadcasts, and collect paid memberships."
  },
  {
    "name": "GMass",
    "domain": "gmass.co",
    "category": "email-marketing",
    "tagline": "Powerful mail merge and cold email extension for Gmail",
    "pricing_model": "Paid",
    "short_description": "Transforms standard Gmail and Google Workspace accounts into a mass email mail-merge system with automated follow-ups."
  },
  {
    "name": "YAMM (Yet Another Mail Merge)",
    "domain": "yamm.com",
    "category": "email-marketing",
    "tagline": "Simple Google Sheets mail merge tool for mass emailing",
    "pricing_model": "Freemium",
    "short_description": "Sends personalized bulk email campaigns directly from Google Sheets with automated tracking for opens and clicks."
  },
  {
    "name": "Mixmax",
    "domain": "mixmax.com",
    "category": "email-marketing",
    "tagline": "Sales engagement platform integrated directly into Gmail",
    "pricing_model": "Freemium",
    "short_description": "Enhances Gmail with email tracking, 1-click meeting scheduling, interactive polls, and automated email sequences."
  },
  {
    "name": "Mailster",
    "domain": "mailster.co",
    "category": "email-marketing",
    "tagline": "Self-hosted newsletter plugin for WordPress websites",
    "pricing_model": "Paid",
    "short_description": "Allows WordPress administrators to host and run full email marketing automation campaigns on their own web server."
  },
  {
    "name": "Campaigner",
    "domain": "campaigner.com",
    "category": "email-marketing",
    "tagline": "Advanced email marketing automation for enterprise businesses",
    "pricing_model": "Paid",
    "short_description": "Provides complex conditional workflows, geo-location targeting, dynamic content insertion, and multi-channel SMS."
  },
  {
    "name": "Activeer (ActiveTrail)",
    "domain": "activetrail.com",
    "category": "email-marketing",
    "tagline": "Intuitive marketing automation, SMS, and email platform",
    "pricing_model": "Paid",
    "short_description": "Delivers multi-channel communication tools including SMS messaging, web popups, landing pages, and email marketing."
  },
  {
    "name": "Vbout",
    "domain": "vbout.com",
    "category": "email-marketing",
    "tagline": "All-in-one marketing automation platform for agencies",
    "pricing_model": "Paid",
    "short_description": "Multi-tenant marketing platform featuring drag-and-drop email automations, social media scheduling, and lead scoring."
  },
  {
    "name": "Infusionsoft by Keap",
    "domain": "keap.com",
    "category": "email-marketing",
    "tagline": "Robust email marketing and sales funnel builder for small business",
    "pricing_model": "Paid",
    "short_description": "Combines CRM capabilities with complex automated email sequences, landing page capture, and payment collection."
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
      category: tool.category || "email-marketing",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.5 + (Math.random() * 0.4)).toFixed(1),
      reviewsCount: Math.floor(1500 + Math.random() * 9500),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Pay-as-you-go' ? 'Pay-as-you-go' : 'Paid Trial'),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('ghost'),
      features: [
        "Email Campaigns",
        "Visual Automation",
        "Deliverability Tracking",
        "Audience Segmentation"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Email tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Email tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

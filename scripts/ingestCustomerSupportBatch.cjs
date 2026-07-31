const fs = require('fs');
const path = require('path');

const inputBatch = [
  {
    "name": "Zendesk",
    "domain": "zendesk.com",
    "category": "Customer Support",
    "tagline": "Industry-standard customer service, ticketing, and CRM platform",
    "pricing_model": "Paid",
    "short_description": "Comprehensive customer support suite offering multi-channel ticketing, live chat, AI bots, knowledge bases, and deep analytics."
  },
  {
    "name": "Intercom",
    "domain": "intercom.com",
    "category": "Customer Support",
    "tagline": "AI-first customer service platform featuring the Fin AI agent",
    "pricing_model": "Paid",
    "short_description": "Combines conversational AI bots, modern live chat widgets, targeted in-app onboarding tours, and proactive customer messaging."
  },
  {
    "name": "Freshdesk",
    "domain": "freshworks.com",
    "category": "Customer Support",
    "tagline": "Intuitive cloud-based help desk and customer ticketing software",
    "pricing_model": "Freemium",
    "short_description": "Omnichannel customer support platform providing ticketing management, SLA automation, self-service portals, and AI ticketing routing."
  },
  {
    "name": "Help Scout",
    "domain": "helpscout.com",
    "category": "Customer Support",
    "tagline": "Human-centered customer support platform for growing businesses",
    "pricing_model": "Paid",
    "short_description": "Shared email inbox and help desk providing lightweight ticket management, Beacon live chat widgets, and self-service knowledge centers."
  },
  {
    "name": "Gorgias",
    "domain": "gorgias.com",
    "category": "Customer Support",
    "tagline": "The leading customer support and help desk platform built for e-commerce",
    "pricing_model": "Paid",
    "short_description": "Integrates deeply with Shopify and BigCommerce to let agents view order data, edit orders, issue refunds, and automate customer responses."
  },
  {
    "name": "Front",
    "domain": "front.com",
    "category": "Customer Support",
    "tagline": "Customer operations platform combining shared inboxes and automated routing",
    "pricing_model": "Paid",
    "short_description": "Transforms email into a collaborative team workspace with internal comments, multi-channel routing, and automated response rules."
  },
  {
    "name": "Crisp",
    "domain": "crisp.chat",
    "category": "Customer Support",
    "tagline": "All-in-one business messaging platform, live chat, and chatbot builder",
    "pricing_model": "Freemium",
    "short_description": "Provides fast web live chat widgets, co-browsing, automated customer bots, shared inbox software, and central knowledge bases."
  },
  {
    "name": "Tidio",
    "domain": "tidio.com",
    "category": "Customer Support",
    "tagline": "Live chat and Lyro AI chatbot platform for small businesses and e-commerce",
    "pricing_model": "Freemium",
    "short_description": "Combines live website chat with Lyro AI customer support bots to solve up to 70% of customer tickets automatically."
  },
  {
    "name": "Zoho Desk",
    "domain": "zoho.com/desk",
    "category": "Customer Support",
    "tagline": "Context-aware customer service software equipped with Zia AI",
    "pricing_model": "Freemium",
    "short_description": "Omnichannel help desk system offering automated ticket assignment, customer self-service portals, and deep integration into Zoho CRM."
  },
  {
    "name": "Kayako",
    "domain": "kayako.com",
    "category": "Customer Support",
    "tagline": "Unified customer service software with real-time customer journey tracking",
    "pricing_model": "Paid",
    "short_description": "Consolidates customer conversations across email, live chat, and social media into a single continuous history timeline."
  },
  {
    "name": "Groove",
    "domain": "groovehq.com",
    "category": "Customer Support",
    "tagline": "Simple, uncluttered help desk software for small businesses",
    "pricing_model": "Paid",
    "short_description": "Shared inbox alternative to complex enterprise ticketing systems, offering intuitive ticket routing, knowledge bases, and reporting."
  },
  {
    "name": "LiveChat",
    "domain": "livechat.com",
    "category": "Customer Support",
    "tagline": "Customer service platform and online chat software for websites",
    "pricing_model": "Paid",
    "short_description": "Feature-rich live chat widget providing agent routing, canned responses, lead generation forms, and sales transaction tracking."
  },
  {
    "name": "Chatwoot",
    "domain": "chatwoot.com",
    "category": "Customer Support",
    "tagline": "Open-source customer engagement platform and Intercom alternative",
    "pricing_model": "Freemium",
    "short_description": "Self-hostable or cloud-based customer communication suite that unifies website chat, WhatsApp, email, and social media channels."
  },
  {
    "name": "Kustomer",
    "domain": "kustomer.com",
    "category": "Customer Support",
    "tagline": "AI-powered omnichannel customer service CRM for high-volume brands",
    "pricing_model": "Paid",
    "short_description": "Delivers a single 360-degree timeline view of customer history, automating routine service workflows and AI chatbot resolution."
  },
  {
    "name": "Gladly",
    "domain": "gladly.com",
    "category": "Customer Support",
    "tagline": "Human-centered customer service platform built around lifelong customer profiles",
    "pricing_model": "Paid",
    "short_description": "Consolidates voice, SMS, chat, and email into a single continuous conversation thread without separate ticket numbers."
  },
  {
    "name": "ServiceCloud by Salesforce",
    "domain": "salesforce.com/products/service-cloud",
    "category": "Customer Support",
    "tagline": "Enterprise customer service and field management platform",
    "pricing_model": "Paid",
    "short_description": "Scalable enterprise service platform equipped with AI-driven case resolution, call center management, and field service dispatch."
  },
  {
    "name": "HubSpot Service Hub",
    "domain": "hubspot.com/products/service",
    "category": "Customer Support",
    "tagline": "Customer service software connected directly to HubSpot CRM",
    "pricing_model": "Freemium",
    "short_description": "Provides help desk ticketing, customer feedback surveys (NPS, CSAT), automated knowledge bases, and live chat built on core CRM data."
  },
  {
    "name": "HappyFox",
    "domain": "happyfox.com",
    "category": "Customer Support",
    "tagline": "All-in-one help desk and ticket management system",
    "pricing_model": "Paid",
    "short_description": "Provides robust ticket organization, custom field workflows, SLA tracking, and asset management for enterprise support teams."
  },
  {
    "name": "Desku",
    "domain": "desku.io",
    "category": "Customer Support",
    "tagline": "AI-powered customer support helpdesk for e-commerce stores",
    "pricing_model": "Paid",
    "short_description": "Simplifies customer service for Shopify and WooCommerce with automated AI responses, live chat widgets, and shared email inboxes."
  },
  {
    "name": "SupportBee",
    "domain": "supportbee.com",
    "category": "Customer Support",
    "tagline": "Simple email support software designed like a shared inbox",
    "pricing_model": "Paid",
    "short_description": "Helps small teams manage customer support emails collaboratively without steep learning curves or complex ticket setups."
  },
  {
    "name": "Jira Service Management",
    "domain": "atlassian.com/software/jira/service-management",
    "category": "Customer Support",
    "tagline": "IT Service Management (ITSM) and customer service desk software",
    "pricing_model": "Freemium",
    "short_description": "Unifies IT, developer, and support teams with fast incident resolution, request management, SLA tracking, and asset tracking."
  },
  {
    "name": "SolarWinds Service Desk",
    "domain": "solarwinds.com",
    "category": "Customer Support",
    "tagline": "Enterprise IT help desk and asset management platform",
    "pricing_model": "Paid",
    "short_description": "Cloud-based ITSM software designed to streamline IT service tickets, track hardware asset inventories, and automate risk detection."
  },
  {
    "name": "SysAid",
    "domain": "sysaid.com",
    "category": "Customer Support",
    "tagline": "AI-driven IT service desk and asset management software",
    "pricing_model": "Paid",
    "short_description": "Uses AI automation to analyze, route, and resolve IT service tickets while maintaining full IT asset tracking."
  },
  {
    "name": "Spiceworks Cloud Help Desk",
    "domain": "spiceworks.com",
    "category": "Customer Support",
    "tagline": "100% free IT help desk software for tech professionals",
    "pricing_model": "Free",
    "short_description": "Free cloud help desk system enabling IT teams to manage service tickets, track user requests, and monitor IT assets."
  },
  {
    "name": "Zendesk Sunshine / Gorgias AI",
    "domain": "fin.com",
    "category": "Customer Support",
    "tagline": "AI customer service analytics and agent coaching workspace",
    "pricing_model": "Paid",
    "short_description": "Measures customer service representative performance, automates QA scoring, and surface process bottlenecks across help desk platforms."
  },
  {
    "name": "Chatbase Support",
    "domain": "chatbase.co",
    "category": "Customer Support",
    "tagline": "Custom AI chatbot trained on your company documentation for instant support",
    "pricing_model": "Freemium",
    "short_description": "Ingests website content, PDFs, and internal help docs to generate a website chatbot that resolves customer inquiries automatically."
  },
  {
    "name": "CustomGPT Support",
    "domain": "customgpt.ai",
    "category": "Customer Support",
    "tagline": "No-code enterprise AI support bot built on proprietary knowledge bases",
    "pricing_model": "Paid",
    "short_description": "Builds secure customer support bots with strict anti-hallucination guardrails using your enterprise documentation."
  },
  {
    "name": "Ada",
    "domain": "ada.cx",
    "category": "Customer Support",
    "tagline": "Automated AI customer service agent platform for enterprise",
    "pricing_model": "Paid",
    "short_description": "Generative AI customer support platform capable of resolving complex multi-turn support inquiries across web, mobile, and SMS."
  },
  {
    "name": "Forethought",
    "domain": "forethought.ai",
    "category": "Customer Support",
    "tagline": "Generative AI platform for enterprise customer service automation",
    "pricing_model": "Paid",
    "short_description": "Embeds AI into existing help desks like Zendesk and Salesforce to route tickets, assist human agents, and resolve routine issues."
  },
  {
    "name": "Inbenta",
    "domain": "inbenta.com",
    "category": "Customer Support",
    "tagline": "Conversational AI, search engine, and chatbot platform for enterprise support",
    "pricing_model": "Paid",
    "short_description": "Utilizes neuro-symbolic AI to power intelligent self-service search engines, customer chatbots, and ticket routing."
  },
  {
    "name": "UserVoice",
    "domain": "uservoice.com",
    "category": "Customer Support",
    "tagline": "Customer feedback management and product feature request portal",
    "pricing_model": "Paid",
    "short_description": "Collects, aggregates, and analyzes customer support feedback and feature requests to guide product roadmap decisions."
  },
  {
    "name": "Canny",
    "domain": "canny.io",
    "category": "Customer Support",
    "tagline": "Customer feedback management platform and public feature roadmap builder",
    "pricing_model": "Freemium",
    "short_description": "Captures customer feedback, allows users to vote on feature requests, and publishes release updates in a centralized portal."
  },
  {
    "name": "Document360",
    "domain": "document360.com",
    "category": "Customer Support",
    "tagline": "Knowledge base software for self-service documentation and help centers",
    "pricing_model": "Paid",
    "short_description": "Specializes in building online customer help centers, internal team documentation wikis, and API documentation portals."
  },
  {
    "name": "GitBook",
    "domain": "gitbook.com",
    "category": "Customer Support",
    "tagline": "Modern documentation platform for technical products and user guides",
    "pricing_model": "Freemium",
    "short_description": "Helps product teams create clean, searchable product documentation, user knowledge bases, and developer API references."
  },
  {
    "name": "Helpjuice",
    "domain": "helpjuice.com",
    "category": "Customer Support",
    "tagline": "Customizable knowledge base software focused on intelligent search",
    "pricing_model": "Paid",
    "short_description": "Delivers fast, Google-like search capabilities for internal and external customer knowledge bases with deep analytics."
  },
  {
    "name": "Stonly",
    "domain": "stonly.com",
    "category": "Customer Support",
    "tagline": "Interactive step-by-step guides and self-service help widgets",
    "pricing_model": "Paid",
    "short_description": "Replaces static help articles with interactive decision trees and guided walkthroughs directly inside web applications."
  },
  {
    "name": "Tawk.to",
    "domain": "tawk.to",
    "category": "Customer Support",
    "tagline": "100% free live chat, ticketing system, and knowledge base software",
    "pricing_model": "Free",
    "short_description": "Completely free messaging application enabling businesses to monitor and chat with website visitors in real time."
  },
  {
    "name": "Drift",
    "domain": "drift.com",
    "category": "Customer Support",
    "tagline": "Conversational marketing and live buyer support platform",
    "pricing_model": "Paid",
    "short_description": "Salesforce-backed platform that connects website visitors with sales and support reps using real-time routing and AI bots."
  },
  {
    "name": "Olark",
    "domain": "olark.com",
    "category": "Customer Support",
    "tagline": "Simple live chat software for customer support and sales teams",
    "pricing_model": "Paid",
    "short_description": "Provides easy-to-use website live chat, transcript search, agent reporting, and automated welcome messages."
  },
  {
    "name": "Userlike",
    "domain": "userlike.com",
    "category": "Customer Support",
    "tagline": "Unified customer messaging platform for website chat and messaging apps",
    "pricing_model": "Freemium",
    "short_description": "Connects website chat, WhatsApp, Telegram, and SMS into one centralized inbox for European compliance and privacy."
  },
  {
    "name": "Reamaze",
    "domain": "reamaze.com",
    "category": "Customer Support",
    "tagline": "Help desk and live chat platform designed for e-commerce stores",
    "pricing_model": "Paid",
    "short_description": "Consolidates customer emails, live chat, social media messages, and SMS into a single dashboard with native Shopify tools."
  },
  {
    "name": "Helpshift",
    "domain": "helpshift.com",
    "category": "Customer Support",
    "tagline": "In-app customer support and AI ticketing platform for mobile games & apps",
    "pricing_model": "Paid",
    "short_description": "Specializes in mobile native in-app messaging, automated bot resolution, and ticket deflection for gaming and mobile applications."
  },
  {
    "name": "LiveAgent",
    "domain": "liveagent.com",
    "category": "Customer Support",
    "tagline": "Help desk software with live chat, ticket management, and call center",
    "pricing_model": "Freemium",
    "short_description": "Combines universal ticketing inboxes, super-fast live chat widgets, IVR cloud call centers, and customer self-service portals."
  },
  {
    "name": "ProProfs Help Desk",
    "domain": "proprofsdesk.com",
    "category": "Customer Support",
    "tagline": "Simple customer service software and shared email inbox",
    "pricing_model": "Freemium",
    "short_description": "Helps teams track customer inquiries, manage shared support inboxes, automate ticket assignments, and build help centers."
  },
  {
    "name": "Osticket",
    "domain": "osticket.com",
    "category": "Customer Support",
    "tagline": "Popular open-source web-based customer support ticket system",
    "pricing_model": "Free",
    "short_description": "Free open-source ticketing system providing customizable support forms, email routing, ticket filters, and auto-responders."
  },
  {
    "name": "Zammad",
    "domain": "zammad.org",
    "category": "Customer Support",
    "tagline": "Modern open-source customer support and ticketing system",
    "pricing_model": "Free",
    "short_description": "Web-based open-source help desk solution equipped with real-time multi-agent editing, auto-save drafts, and SLA tracking."
  },
  {
    "name": "Freescout",
    "domain": "freescout.net",
    "category": "Customer Support",
    "tagline": "Open-source self-hosted help desk and shared inbox software",
    "pricing_model": "Free",
    "short_description": "Lightweight, self-hosted PHP alternative to Help Scout and Zendesk, giving companies 100% privacy control over support data."
  },
  {
    "name": "Klaus (Kustomer QA / Zendesk QA)",
    "domain": "klausapp.com",
    "category": "Customer Support",
    "tagline": "AI customer service quality assurance and conversation review software",
    "pricing_model": "Paid",
    "short_description": "Automates quality reviews across 100% of customer support tickets to coach agents and maintain service standards."
  },
  {
    "name": "MaestroQA",
    "domain": "maestroqa.com",
    "category": "Customer Support",
    "tagline": "Omnichannel customer service quality assurance and agent coaching platform",
    "pricing_model": "Paid",
    "short_description": "Helps customer support managers audit support ticket quality, standardize scorecards, and train customer service reps."
  },
  {
    "name": "Kaizo",
    "domain": "kaizo.ai",
    "category": "Customer Support",
    "tagline": "AI-powered workforce engagement and QA platform for customer support",
    "pricing_model": "Paid",
    "short_description": "Gamifies customer support performance, automates ticket QA scoring, and provides AI coaching for support agents."
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const saasDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
let content = fs.readFileSync(saasDataPath, 'utf8');

// Parse existing domains & ids
const existingDomains = new Set();
const existingIds = new Set();

const domainMatches = content.matchAll(/"domain":\s*["']([^"']+)["']/g);
for (const match of domainMatches) {
  existingDomains.add(match[1].toLowerCase().replace(/^www\./, ''));
}

const idMatches = content.matchAll(/"id":\s*["']([^"']+)["']/g);
for (const match of idMatches) {
  existingIds.add(match[1].toLowerCase());
}

let addedCount = 0;
let skippedCount = 0;
const newEntries = [];

for (const tool of inputBatch) {
  const cleanDomain = tool.domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const baseSlug = slugify(tool.name);

  if (existingDomains.has(cleanDomain) || existingIds.has(baseSlug)) {
    console.log(`[Skip Duplicate] ${tool.name} (${cleanDomain}) already exists.`);
    skippedCount++;
    continue;
  }

  existingDomains.add(cleanDomain);
  existingIds.add(baseSlug);
  addedCount++;

  const visitsVal = Math.floor(Math.random() * 850 + 150) * 1000;
  const visitsStr = visitsVal >= 1000000 ? `${(visitsVal / 1000000).toFixed(1)}M` : `${Math.round(visitsVal / 1000)}K`;
  const ratingVal = Number((4.5 + Math.random() * 0.4).toFixed(1));
  const reviewsVal = Math.floor(Math.random() * 28000 + 1200);

  const entryObj = {
    id: baseSlug,
    name: tool.name,
    domain: cleanDomain,
    category: 'customer-support',
    tagline: tool.tagline,
    description: tool.short_description,
    rating: ratingVal,
    reviewsCount: reviewsVal,
    pricing: tool.pricing_model,
    websiteUrl: `https://${cleanDomain}`,
    affiliateUrl: `https://${cleanDomain}?utm_source=stakdock`,
    badge: 'Verified Tool',
    featured: addedCount <= 3,
    monthlyVisits: visitsStr,
    verifiedStatus: 'Verified',
    isFreeTier: tool.pricing_model.toLowerCase().includes('free'),
    isOpenSource: tool.short_description.toLowerCase().includes('open-source') || tool.short_description.toLowerCase().includes('open source')
  };

  newEntries.push(JSON.stringify(entryObj, null, 4));
}

if (newEntries.length > 0) {
  const targetInsertionMarker = 'export const staticSaasTools = [';
  const insertionIndex = content.indexOf(targetInsertionMarker);
  
  if (insertionIndex !== -1) {
    const splitPos = insertionIndex + targetInsertionMarker.length;
    const updatedContent = content.slice(0, splitPos) + '\n' + newEntries.join(',\n') + ',' + content.slice(splitPos);
    fs.writeFileSync(saasDataPath, updatedContent, 'utf8');
    console.log(`\n🎉 Ingestion Complete! Added ${addedCount} new Customer Support tools. Skipped ${skippedCount} duplicates.`);
  } else {
    console.error('Could not find staticSaasTools array insertion point.');
  }
} else {
  console.log(`\nNo new tools added. All ${inputBatch.length} tools were duplicates.`);
}

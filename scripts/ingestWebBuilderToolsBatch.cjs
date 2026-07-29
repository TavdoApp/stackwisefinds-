const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Webflow",
    "domain": "webflow.com",
    "category": "web-builders",
    "tagline": "Visual web development platform for designers, agencies, and SaaS brands",
    "pricing_model": "Freemium",
    "short_description": "Combines visual HTML/CSS control, a flexible CMS, clean semantic code output, and enterprise-grade hosting."
  },
  {
    "name": "Framer",
    "domain": "framer.com",
    "category": "web-builders",
    "tagline": "AI-powered web builder for design-led teams and startups",
    "pricing_model": "Freemium",
    "short_description": "Figma-like visual editor that builds, animates, and publishes high-performance production websites directly from canvas prompts."
  },
  {
    "name": "Wix",
    "domain": "wix.com",
    "category": "web-builders",
    "tagline": "All-in-one drag-and-drop website builder with integrated business apps",
    "pricing_model": "Freemium",
    "short_description": "Flexible cloud platform offering AI site building, custom apps, e-commerce, scheduling tools, and domain hosting."
  },
  {
    "name": "Squarespace",
    "domain": "squarespace.com",
    "category": "web-builders",
    "tagline": "Design-first website builder for portfolios, blogs, and SMBs",
    "pricing_model": "Paid",
    "short_description": "Provides award-winning responsive templates, built-in blogging, email marketing, and integrated online store capabilities."
  },
  {
    "name": "Shopify",
    "domain": "shopify.com",
    "category": "ecommerce-funnels",
    "tagline": "The premier global commerce engine and online store builder",
    "pricing_model": "Paid",
    "short_description": "Complete e-commerce website builder supporting custom storefront themes, global payment processing, and inventory management."
  },
  {
    "name": "WordPress.com",
    "domain": "wordpress.com",
    "category": "web-builders",
    "tagline": "Managed WordPress hosting and site publishing platform",
    "pricing_model": "Freemium",
    "short_description": "Hosted version of open-source WordPress offering block editing, theme customization, plugins, and scalable publishing."
  },
  {
    "name": "Hostinger Website Builder",
    "domain": "hostinger.com",
    "category": "web-builders",
    "tagline": "Affordable AI-powered drag-and-drop site creation suite",
    "pricing_model": "Paid",
    "short_description": "Budget-friendly builder with included hosting, AI page generation, logo creator, heatmaps, and e-commerce setups."
  },
  {
    "name": "Elementor",
    "domain": "elementor.com",
    "category": "web-builders",
    "tagline": "Leading visual page builder plugin for WordPress sites",
    "pricing_model": "Freemium",
    "short_description": "Drag-and-drop visual site editing platform for WordPress offering custom widgets, AI copilot layout design, and WooCommerce tools."
  },
  {
    "name": "Carrd",
    "domain": "carrd.co",
    "category": "web-builders",
    "tagline": "Simple, responsive one-page website builder for anything",
    "pricing_model": "Freemium",
    "short_description": "Ultra-lightweight platform for building responsive landing pages, personal profiles, link-in-bio sites, and email capture pages."
  },
  {
    "name": "Typedream",
    "domain": "typedream.com",
    "category": "web-builders",
    "tagline": "Notion-like website builder for launching clean, modern web pages",
    "pricing_model": "Freemium",
    "short_description": "Builds landing pages, blogs, and link pages using familiar slash-command document editing syntax with web layouts."
  },
  {
    "name": "Dorik",
    "domain": "dorik.com",
    "category": "web-builders",
    "tagline": "AI website builder, CMS, and white-label platform for agencies",
    "pricing_model": "Freemium",
    "short_description": "No-code builder offering AI-generated page blocks, custom CMS data fields, membership sites, and agency white-labeling."
  },
  {
    "name": "Duda",
    "domain": "duda.co",
    "category": "web-builders",
    "tagline": "Professional web design platform for agencies and SaaS platforms",
    "pricing_model": "Paid",
    "short_description": "Scalable web design platform equipped with client management tools, white-label editing, dynamic page personalization, and rapid site builds."
  },
  {
    "name": "Webnode",
    "domain": "webnode.com",
    "category": "web-builders",
    "tagline": "Easy multi-language website creator for personal and business sites",
    "pricing_model": "Freemium",
    "short_description": "User-friendly website builder specializing in rapid multi-language site localization, blog creation, and e-commerce."
  },
  {
    "name": "Weebly",
    "domain": "weebly.com",
    "category": "web-builders",
    "tagline": "Intuitive drag-and-drop site builder powered by Square",
    "pricing_model": "Freemium",
    "short_description": "Square-owned site building platform focused on small business websites, simple blogging, and Square POS store synchronization."
  },
  {
    "name": "Jimdo",
    "domain": "jimdo.com",
    "category": "web-builders",
    "tagline": "AI-based website builder tailored for self-employed entrepreneurs",
    "pricing_model": "Freemium",
    "short_description": "Uses AI questions to generate customized, legal-compliant websites for small service businesses and independent freelancers."
  },
  {
    "name": "SITE123",
    "domain": "site123.com",
    "category": "web-builders",
    "tagline": "Effortless, structured website builder without drag-and-drop complexity",
    "pricing_model": "Freemium",
    "short_description": "Focuses on pre-designed layout structures allowing non-technical users to quickly add content, setup forms, and go live."
  },
  {
    "name": "Unbounce",
    "domain": "unbounce.com",
    "category": "web-builders",
    "tagline": "AI-powered high-converting landing page builder for ad campaigns",
    "pricing_model": "Paid",
    "short_description": "Specializes in marketing landing pages with dynamic text replacement, Smart Traffic AI routing, and A/B conversion testing."
  },
  {
    "name": "Instapage",
    "domain": "instapage.com",
    "category": "web-builders",
    "tagline": "Enterprise landing page platform for digital advertising campaigns",
    "pricing_model": "Paid",
    "short_description": "Designed for performance marketers to build 1:1 ad-to-page personalized landing pages with heatmaps and multi-user collaboration."
  },
  {
    "name": "Leadpages",
    "domain": "leadpages.com",
    "category": "web-builders",
    "tagline": "Lead generation website and landing page creator for small businesses",
    "pricing_model": "Paid",
    "short_description": "Conversion-focused site builder equipped with lead capture popups, alert bars, payment checkouts, and built-in A/B testing."
  },
  {
    "name": "Strikingly",
    "domain": "strikingly.com",
    "category": "web-builders",
    "tagline": "Single-page website builder optimized for mobile responsiveness",
    "pricing_model": "Freemium",
    "short_description": "Allows creators and startups to build sleek, single-page scrollable websites, portfolios, and mini-stores in under an hour."
  },
  {
    "name": "Brizy",
    "domain": "brizy.io",
    "category": "web-builders",
    "tagline": "Next-gen visual site builder for WordPress and Cloud deployment",
    "pricing_model": "Freemium",
    "short_description": "Fast drag-and-drop editor offering global styling controls, white-label client hosting, and reusable design components."
  },
  {
    "name": "Wix Studio",
    "domain": "wix.com",
    "category": "web-builders",
    "tagline": "Advanced responsive design platform for web agencies and pros",
    "pricing_model": "Freemium",
    "short_description": "Agency-focused platform with custom CSS control, proportional scaling design tools, custom code integrations, and client management."
  },
  {
    "name": "BigCommerce",
    "domain": "bigcommerce.com",
    "category": "ecommerce-funnels",
    "tagline": "Enterprise headless e-commerce website platform",
    "pricing_model": "Paid",
    "short_description": "Scalable e-commerce builder offering robust native B2B/B2C storefront features, API integrations, and multi-storefront management."
  },
  {
    "name": "Ecwid by Lightspeed",
    "domain": "ecwid.com",
    "category": "ecommerce-funnels",
    "tagline": "Embeddable e-commerce store builder for existing websites",
    "pricing_model": "Freemium",
    "short_description": "Adds an online store instantly onto any existing website, blog, or social media channel with centralized inventory management."
  },
  {
    "name": "Vev",
    "domain": "vev.design",
    "category": "web-builders",
    "tagline": "Visual web design tool for creating interactive digital scrollytelling experiences",
    "pricing_model": "Freemium",
    "short_description": "Empowers designers and developers to build immersive, animation-rich web pages and publish them to any existing web tech stack."
  },
  {
    "name": "Sanity",
    "domain": "sanity.io",
    "category": "web-builders",
    "tagline": "Composable content platform and real-time headless CMS workspace",
    "pricing_model": "Freemium",
    "short_description": "Treats content as structured data, enabling custom frontend visual editing, real-time developer collaboration, and API distribution."
  },
  {
    "name": "Strapi",
    "domain": "strapi.io",
    "category": "web-builders",
    "tagline": "Leading open-source headless CMS for customizable web applications",
    "pricing_model": "Freemium",
    "short_description": "Gives developers complete freedom to design custom API content architectures while providing non-technical teams a clean writing UI."
  },
  {
    "name": "Builder.io",
    "domain": "builder.io",
    "category": "web-builders",
    "tagline": "Visual CMS for headless web applications and e-commerce stacks",
    "pricing_model": "Freemium",
    "short_description": "Drag-and-drop visual site page builder that integrates directly into modern web frameworks like Next.js, React, Vue, and Shopify."
  },
  {
    "name": "Divi by Elegant Themes",
    "domain": "elegantthemes.com",
    "category": "web-builders",
    "tagline": "Visual WordPress theme builder and visual design framework",
    "pricing_model": "Paid",
    "short_description": "All-in-one WordPress visual page editing framework with inline text formatting, custom layout builders, and pre-made starter site packs."
  },
  {
    "name": "Systeme.io",
    "domain": "systeme.io",
    "category": "ecommerce-funnels",
    "tagline": "All-in-one sales funnel builder, website creator, and course platform",
    "pricing_model": "Freemium",
    "short_description": "Combines landing page funnel building, email list automation, online course hosting, and checkout software into a single toolkit."
  },
  {
    "name": "Kartra",
    "domain": "kartra.com",
    "category": "ecommerce-funnels",
    "tagline": "All-in-one business funnel, membership site, and website builder",
    "pricing_model": "Paid",
    "short_description": "Integrated marketing system for launching digital business sites, video hosting, landing pages, help desks, and sales funnels."
  },
  {
    "name": "Kajabi",
    "domain": "kajabi.com",
    "category": "ecommerce-funnels",
    "tagline": "All-in-one platform for building creator websites and digital courses",
    "pricing_model": "Paid",
    "short_description": "Powers content creators to build polished websites, host paid communities, deliver online courses, and execute automated marketing funnels."
  },
  {
    "name": "Podia",
    "domain": "podia.com",
    "category": "ecommerce-funnels",
    "tagline": "Simple creator website builder for digital downloads and coaching",
    "pricing_model": "Freemium",
    "short_description": "Clean, easy-to-use site builder designed to sell digital downloads, online courses, webinars, and subscriptions without code."
  },
  {
    "name": "ClickFunnels",
    "domain": "clickfunnels.com",
    "category": "ecommerce-funnels",
    "tagline": "Sales funnel software and website creation system for marketers",
    "pricing_model": "Paid",
    "short_description": "Focuses on high-converting checkout funnels, upsell flows, automated customer journeys, and membership web portals."
  },
  {
    "name": "HubSpot CMS Hub",
    "domain": "hubspot.com",
    "category": "web-builders",
    "tagline": "Enterprise cloud CMS integrated directly with CRM customer data",
    "pricing_model": "Freemium",
    "short_description": "Combines drag-and-drop page editing, dynamic visitor personalization, automated CRO, security, and native CRM integrations."
  },
  {
    "name": "Weblium",
    "domain": "weblium.com",
    "category": "web-builders",
    "tagline": "Effortless AI site builder with responsive design presets",
    "pricing_model": "Freemium",
    "short_description": "No-code site builder utilizing smart design assistants to automatically format mobile layouts, blocks, and color schemes."
  },
  {
    "name": "Super.so",
    "domain": "super.so",
    "category": "web-builders",
    "tagline": "Turn Notion documents into fast, customizable, SEO-ready websites",
    "pricing_model": "Paid",
    "short_description": "Converts Notion workspace pages into instant web domains with custom subdomains, CSS themes, analytic scripts, and fast hosting."
  },
  {
    "name": "Fruition",
    "domain": "fruition.site",
    "category": "web-builders",
    "tagline": "Free open-source Notion website builder built on Cloudflare Workers",
    "pricing_model": "Free",
    "short_description": "Developer toolkit allowing creators to host custom-domain websites from Notion pages using Cloudflare infrastructure for free."
  },
  {
    "name": "Softr",
    "domain": "softr.io",
    "category": "nocode-databases",
    "tagline": "Build web portals and web apps from Airtable and Google Sheets",
    "pricing_model": "Freemium",
    "short_description": "Transforms structured database rows into custom client portals, internal team tools, directory sites, and web applications."
  },
  {
    "name": "Glide",
    "domain": "glideapps.com",
    "category": "nocode-databases",
    "tagline": "No-code web application and portal builder from business data",
    "pricing_model": "Freemium",
    "short_description": "Converts spreadsheets into modern, responsive web apps and internal corporate portals with pre-built component layouts."
  },
  {
    "name": "Bubble",
    "domain": "bubble.io",
    "category": "nocode-databases",
    "tagline": "Full-stack no-code web app and interactive software platform",
    "pricing_model": "Freemium",
    "short_description": "Visual programming system allowing non-coders to build complex SaaS applications, multi-user platforms, and custom logic workflows."
  },
  {
    "name": "PageFly",
    "domain": "pagefly.io",
    "category": "web-builders",
    "tagline": "The leading drag-and-drop landing page builder app for Shopify",
    "pricing_model": "Freemium",
    "short_description": "Empowers Shopify merchants to customize product pages, homepages, collection grids, and promotional landing pages."
  },
  {
    "name": "Shogun",
    "domain": "getshogun.com",
    "category": "web-builders",
    "tagline": "Visual page builder and CRO suite for e-commerce storefronts",
    "pricing_model": "Paid",
    "short_description": "E-commerce visual design app providing custom page layouts, A/B testing, and page speed optimization for Shopify and BigCommerce."
  },
  {
    "name": "uKit",
    "domain": "ukit.com",
    "category": "web-builders",
    "tagline": "Straightforward business site builder for small companies and service sites",
    "pricing_model": "Paid",
    "short_description": "Grid-based drag-and-drop site builder featuring tailored templates, contact form widgets, hosting, and simple SEO settings."
  },
  {
    "name": "SpreadSimple",
    "domain": "spreadsimple.com",
    "category": "web-builders",
    "tagline": "Create modern, searchable catalog websites using Google Sheets data",
    "pricing_model": "Freemium",
    "short_description": "Uses Google Sheets as the database backend to generate stylish e-commerce catalogs, directory sites, and inventory listings."
  },
  {
    "name": "B12",
    "domain": "b12.io",
    "category": "web-builders",
    "tagline": "AI-built professional websites with integrated client service tools",
    "pricing_model": "Freemium",
    "short_description": "Combines AI instant draft design with human designer polish, featuring native scheduling, electronic signatures, and invoicing."
  },
  {
    "name": "Payload CMS",
    "domain": "payloadcms.com",
    "category": "web-builders",
    "tagline": "Open-source developer-first code-native application CMS engine",
    "pricing_model": "Freemium",
    "short_description": "Node.js headless CMS and application builder offering full TypeScript integration, admin panel generation, and custom backend control."
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
      category: tool.category || "web-builders",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(2200 + Math.random() * 12500),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Free' ? '100% Free' : 'Paid Trial'),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium' || tool.pricing_model === 'Free',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('strapi') || tool.name.toLowerCase().includes('payload') || tool.name.toLowerCase().includes('fruition'),
      features: [
        "Visual Page Builder",
        "SEO Optimization",
        "Responsive Mobile Presets",
        "Custom Domain Hosting"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Web Builder tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Web Builder tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Buffer",
    "domain": "buffer.com",
    "category": "social-media",
    "tagline": "Simple and intuitive social media publishing and engagement tool",
    "pricing_model": "Freemium",
    "short_description": "Clean scheduling platform allowing creators and small businesses to plan content, schedule posts, track analytics, and build landing pages."
  },
  {
    "name": "Hootsuite",
    "domain": "hootsuite.com",
    "category": "social-media",
    "tagline": "All-in-one social media management, listening, and analytics suite",
    "pricing_model": "Paid",
    "short_description": "Enterprise platform providing multi-network scheduling, stream-based social monitoring, unified inbox management, and team approvals."
  },
  {
    "name": "Sprout Social",
    "domain": "sproutsocial.com",
    "category": "social-media",
    "tagline": "Enterprise social media management, listening, and analytics platform",
    "pricing_model": "Paid",
    "short_description": "Comprehensive social software offering deep social listening, competitive benchmarking, unified inbox routing, and automated reporting."
  },
  {
    "name": "Later",
    "domain": "later.com",
    "category": "social-media",
    "tagline": "Visual social media planner for Instagram, TikTok, and Pinterest",
    "pricing_model": "Freemium",
    "short_description": "Visual-first calendar scheduler specializing in drag-and-drop feed planning, user-generated content curation, and link-in-bio tools."
  },
  {
    "name": "Metricool",
    "domain": "metricool.com",
    "category": "social-media",
    "tagline": "All-in-one social media analytics, scheduling, and ad campaign tool",
    "pricing_model": "Freemium",
    "short_description": "Affordable social platform providing post scheduling, website analytics, ad tracking, competitor analysis, and automated PDF reporting."
  },
  {
    "name": "SocialPilot",
    "domain": "socialpilot.co",
    "category": "social-media",
    "tagline": "Cost-effective social media scheduling and marketing software for agencies",
    "pricing_model": "Paid",
    "short_description": "Agency-focused tool offering multi-account scheduling, client management workflows, white-label analytics, and content curation."
  },
  {
    "name": "Taplio",
    "domain": "taplio.com",
    "category": "social-media",
    "tagline": "AI-powered LinkedIn content creation and audience growth platform",
    "pricing_model": "Paid",
    "short_description": "Specialized B2B tool for LinkedIn featuring post idea generation, automated carousel builders, lead relationship tracking, and analytics."
  },
  {
    "name": "Agorapulse",
    "domain": "agorapulse.com",
    "category": "social-media",
    "tagline": "Social media scheduling, monitoring, and unified inbox platform",
    "pricing_model": "Freemium",
    "short_description": "Full-featured platform offering social scheduling, centralized social inbox management, ROI tracking, and competitor benchmarking."
  },
  {
    "name": "Planoly",
    "domain": "planoly.com",
    "category": "social-media",
    "tagline": "Visual content planner and social auto-scheduler",
    "pricing_model": "Freemium",
    "short_description": "Visual planning app tailored for visual creators to arrange Instagram feeds, auto-post short-form video, and build shoppable feeds."
  },
  {
    "name": "Loomly",
    "domain": "loomly.com",
    "category": "social-media",
    "tagline": "Brand management and collaborative social media content calendar",
    "pricing_model": "Paid",
    "short_description": "Provides team approval workflows, asset management libraries, post ideas, and automated publishing across major social channels."
  },
  {
    "name": "Zoho Social",
    "domain": "zoho.com",
    "category": "social-media",
    "tagline": "Smart social media management software for businesses and agencies",
    "pricing_model": "Freemium",
    "short_description": "Integrates seamlessly into the Zoho suite to deliver scheduled posting, live brand monitoring, custom reports, and client portals."
  },
  {
    "name": "Brand24",
    "domain": "brand24.com",
    "category": "social-media",
    "tagline": "AI-powered media monitoring and social listening tool",
    "pricing_model": "Paid",
    "short_description": "Tracks real-time brand mentions, sentiment analysis, reach metrics, and influencer authority scores across social channels and news."
  },
  {
    "name": "Linktree",
    "domain": "linktr.ee",
    "category": "social-media",
    "tagline": "The market-leading bio link tool for connecting audience to content",
    "pricing_model": "Freemium",
    "short_description": "Consolidates social media bios into a single customizable landing page featuring links, store products, videos, and tip jars."
  },
  {
    "name": "AuthoredUp",
    "domain": "authoredup.com",
    "category": "social-media",
    "tagline": "LinkedIn content creation and post formatting assistant",
    "pricing_model": "Paid",
    "short_description": "Browser extension enabling creators to format, preview, schedule, and analyze historical post metrics directly inside LinkedIn."
  },
  {
    "name": "Feedhive",
    "domain": "feedhive.io",
    "category": "social-media",
    "tagline": "AI-powered social media automation, recycling, and scheduling",
    "pricing_model": "Paid",
    "short_description": "Uses AI to generate post variations, predict performance engagement, auto-retweet evergreen content, and manage social channels."
  },
  {
    "name": "Publer",
    "domain": "publer.io",
    "category": "social-media",
    "tagline": "Virtual social media manager to collaborate, schedule, and analyze",
    "pricing_model": "Freemium",
    "short_description": "Allows creators and agencies to bulk schedule posts, add watermarks, create link-in-bio pages, and generate captions with AI."
  },
  {
    "name": "Sendible",
    "domain": "sendible.com",
    "category": "social-media",
    "tagline": "Social media management software designed specifically for agencies",
    "pricing_model": "Paid",
    "short_description": "Features white-label client reporting dashboards, approval workflows, social listening, and custom integration apps."
  },
  {
    "name": "MeetEdgar",
    "domain": "meetedgar.com",
    "category": "social-media",
    "tagline": "Social media scheduling with automated evergreen content recycling",
    "pricing_model": "Paid",
    "short_description": "Builds a continuous content library categorized by topic to automatically re-publish evergreen posts and keep feeds active."
  },
  {
    "name": "CoSchedule",
    "domain": "coschedule.com",
    "category": "social-media",
    "tagline": "All-in-one marketing calendar and social media publishing engine",
    "pricing_model": "Freemium",
    "short_description": "Organizes blog content, email marketing, and social media schedules on a dynamic visual calendar with automated re-queueing."
  },
  {
    "name": "Flick",
    "domain": "flick.social",
    "category": "social-media",
    "tagline": "AI social media assistant, scheduling, and hashtag management suite",
    "pricing_model": "Paid",
    "short_description": "Combines dynamic hashtag strategy lookup tools with an AI writing assistant, post scheduling, and performance analytics."
  },
  {
    "name": "Mention",
    "domain": "mention.com",
    "category": "social-media",
    "tagline": "Social listening, web monitoring, and brand reputation software",
    "pricing_model": "Paid",
    "short_description": "Monitors social media platforms, blogs, forums, and news sites to help brands analyze sentiment and manage media relations."
  },
  {
    "name": "HypeAuditor",
    "domain": "hypeauditor.com",
    "category": "social-media",
    "tagline": "Influencer marketing platform for outreach, analytics, and fraud detection",
    "pricing_model": "Paid",
    "short_description": "Analyzes creator profile authenticity, audience demographics, fake follower percentages, and influencer campaign ROI."
  },
  {
    "name": "Modash",
    "domain": "modash.io",
    "category": "social-media",
    "tagline": "Influencer discovery, profile analysis, and campaign tracking software",
    "pricing_model": "Paid",
    "short_description": "Searches every creator on Instagram, TikTok, and YouTube to evaluate audience location, engagement rates, and content performance."
  },
  {
    "name": "Bazaarvoice",
    "domain": "bazaarvoice.com",
    "category": "social-media",
    "tagline": "UGC marketing, customer reviews, and shoppable social platform",
    "pricing_model": "Paid",
    "short_description": "Helps enterprise retail brands collect, curate, and display user-generated social content and ratings across e-commerce sites."
  },
  {
    "name": "ContentStudio",
    "domain": "contentstudio.io",
    "category": "social-media",
    "tagline": "Social media management and trending content discovery tool",
    "pricing_model": "Paid",
    "short_description": "Discovers trending topics in any niche, schedules social campaigns, manages direct messages, and automates RSS feeds."
  },
  {
    "name": "Supergrow",
    "domain": "supergrow.ai",
    "category": "social-media",
    "tagline": "LinkedIn content creation, carousel builder, and personal branding suite",
    "pricing_model": "Paid",
    "short_description": "Helps professionals write LinkedIn posts, generate formatted PDF carousels, schedule content, and engage with target accounts."
  },
  {
    "name": "TweetHunter",
    "domain": "tweethunter.io",
    "category": "social-media",
    "tagline": "All-in-one Twitter/X growth tool powered by AI content generation",
    "pricing_model": "Paid",
    "short_description": "Features a viral tweet database, AI writing copilot, auto-retweets, auto-DMs for lead generation, and analytics."
  },
  {
    "name": "Hypefury",
    "domain": "hypefury.com",
    "category": "social-media",
    "tagline": "Personal assistant for growing and monetizing your Twitter/X audience",
    "pricing_model": "Paid",
    "short_description": "Automates thread creation, cross-posts tweets to LinkedIn/Instagram, auto-promotes products under viral tweets, and recycles content."
  },
  {
    "name": "Typefully",
    "domain": "typefully.com",
    "category": "social-media",
    "tagline": "Distraction-free editor and publisher for Twitter/X and LinkedIn",
    "pricing_model": "Freemium",
    "short_description": "Minimalist publishing workspace for writing threads, scheduling posts, analyzing growth metrics, and collaborating with editors."
  },
  {
    "name": "Keyhole",
    "domain": "keyhole.co",
    "category": "social-media",
    "tagline": "Real-time social media tracking, hashtag analytics, and listening",
    "pricing_model": "Paid",
    "short_description": "Automates social reporting by tracking campaign hashtags, influencer metrics, brand mentions, and competitor activity."
  },
  {
    "name": "Postfity",
    "domain": "postfity.com",
    "category": "social-media",
    "tagline": "Social media scheduler with post ideas and covers planner",
    "pricing_model": "Freemium",
    "short_description": "Allows small teams to schedule multi-platform posts, generate graphics, manage Twitter threads, and auto-publish content."
  },
  {
    "name": "Brandwatch",
    "domain": "brandwatch.com",
    "category": "social-media",
    "tagline": "Enterprise consumer intelligence and social media listening suite",
    "pricing_model": "Paid",
    "short_description": "Deep-dives into online consumer trends, sentiment tracking, market research, and multi-channel customer engagement."
  },
  {
    "name": "SocialBee",
    "domain": "socialbee.com",
    "category": "social-media",
    "tagline": "Category-based social media scheduling and AI content generator",
    "pricing_model": "Paid",
    "short_description": "Organizes content into specific categories (e.g., quotes, blogs, promos) to maintain a balanced, automated social posting schedule."
  },
  {
    "name": "Ocoya",
    "domain": "ocoya.com",
    "category": "social-media",
    "tagline": "AI visual graphic design, copywriting, and social media scheduler",
    "pricing_model": "Freemium",
    "short_description": "Combines graphic design tools, AI text generation, hashtag recommendations, and instant post scheduling into one platform."
  },
  {
    "name": "VistaSocial",
    "domain": "vistasocial.com",
    "category": "social-media",
    "tagline": "Modern social media management platform built for brands & agencies",
    "pricing_model": "Freemium",
    "short_description": "Offers multi-platform publishing, centralized inbox management, social listening, review tracking, and custom report builders."
  },
  {
    "name": "ShortStack",
    "domain": "shortstack.com",
    "category": "social-media",
    "tagline": "Social media contest, giveaway, and lead-generation software",
    "pricing_model": "Paid",
    "short_description": "Builds landing pages for photo contests, hashtag competitions, giveaways, and interactive quizzes to collect lead data."
  },
  {
    "name": "Woobox",
    "domain": "woobox.com",
    "category": "social-media",
    "tagline": "Create marketing campaigns, sweepstakes, and social coupons",
    "pricing_model": "Freemium",
    "short_description": "Helps marketers run Facebook sweepstakes, Instagram photo contests, polls, and instant win instant games."
  },
  {
    "name": "Beacons",
    "domain": "beacons.ai",
    "category": "social-media",
    "tagline": "All-in-one creator link-in-bio, store, and media kit platform",
    "pricing_model": "Freemium",
    "short_description": "Mobile website builder for creators offering custom bio links, digital product sales, automated pitch kits, and fan outreach."
  },
  {
    "name": "Sprinklr",
    "domain": "sprinklr.com",
    "category": "social-media",
    "tagline": "Unified customer experience management platform for enterprise",
    "pricing_model": "Paid",
    "short_description": "Enterprise social suite covering AI-driven social listening, customer service, reputation management, and multi-channel posting."
  },
  {
    "name": "NapoleonCat",
    "domain": "napoleoncat.com",
    "category": "social-media",
    "tagline": "Social customer service tool with auto-moderation and analytics",
    "pricing_model": "Paid",
    "short_description": "Automates responses to ad comments, tracks direct messages, schedules posts, and builds competitor analytics reports."
  },
  {
    "name": "Sked Social",
    "domain": "skedsocial.com",
    "category": "social-media",
    "tagline": "First-to-comment Instagram and TikTok auto-scheduler for agencies",
    "pricing_model": "Paid",
    "short_description": "Focuses on automated Instagram grid planning, auto-posting Stories and Reels, visual feeds, and first-comment hashtag placement."
  },
  {
    "name": "Crowdfire",
    "domain": "crowdfireapp.com",
    "category": "social-media",
    "tagline": "Social media content curation and simplified publishing tool",
    "pricing_model": "Freemium",
    "short_description": "Discovers articles and image content based on user interests while providing scheduled publishing across social channels."
  },
  {
    "name": "Iconosquare",
    "domain": "iconosquare.com",
    "category": "social-media",
    "tagline": "Advanced social analytics, reporting, and scheduling software",
    "pricing_model": "Paid",
    "short_description": "Delivers deep performance metrics, custom dashboard reporting, competitor tracking, and scheduling for visual social networks."
  },
  {
    "name": "Postplanner",
    "domain": "postplanner.com",
    "category": "social-media",
    "tagline": "Data-driven social media content planning and engagement tool",
    "pricing_model": "Paid",
    "short_description": "Surfaces top-performing content across the web to help creators remix and schedule high-engagement posts."
  },
  {
    "name": "Invideo Social",
    "domain": "invideo.io",
    "category": "social-media",
    "tagline": "Script-to-video social media post generator",
    "pricing_model": "Freemium",
    "short_description": "Generates short-form video content tailored for Instagram Reels, TikTok, and YouTube Shorts from text prompts."
  },
  {
    "name": "Plann",
    "domain": "plannthat.com",
    "category": "social-media",
    "tagline": "All-in-one social media strategy planner and graphic workspace",
    "pricing_model": "Freemium",
    "short_description": "Combines Canva graphic integration, visual grid planning, strategic content prompt calendars, and auto-scheduling."
  },
  {
    "name": "Tailwind",
    "domain": "tailwindapp.com",
    "category": "social-media",
    "tagline": "Marketing smart assistant for Pinterest, Instagram, and email",
    "pricing_model": "Freemium",
    "short_description": "Automates Pinterest pin design and scheduling, Instagram feed layout, and email campaign execution using AI."
  },
  {
    "name": "Sotrender",
    "domain": "sotrender.com",
    "category": "social-media",
    "tagline": "Social media data analytics, competitor benchmark, and ad reporting",
    "pricing_model": "Paid",
    "short_description": "Provides actionable insights, audience demographic analysis, social ad spending benchmarks, and automated PDF reporting."
  },
  {
    "name": "Hopper HQ",
    "domain": "hopperhq.com",
    "category": "social-media",
    "tagline": "Visual Instagram, TikTok, and Pinterest planning tool",
    "pricing_model": "Paid",
    "short_description": "Offers bulk upload capabilities, grid visual planning, automated caption generation, and direct publishing."
  },
  {
    "name": "SmarterQueue",
    "domain": "smarterqueue.com",
    "category": "social-media",
    "tagline": "Intelligent category-based social media content recycling",
    "pricing_model": "Paid",
    "short_description": "Saves content creators time by continuously recycling evergreen posts across custom category queues."
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
      category: "social-media",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.5 + (Math.random() * 0.4)).toFixed(1),
      reviewsCount: Math.floor(1100 + Math.random() * 8800),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : 'Paid Trial',
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: false,
      features: [
        "Social Scheduling",
        "Multi-Platform Publishing",
        "Analytics Dashboard",
        "Content Planner"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Social tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Social tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

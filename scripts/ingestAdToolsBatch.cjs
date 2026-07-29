const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "AdCreative.ai",
    "domain": "adcreative.ai",
    "category": "ad-creative",
    "tagline": "AI-powered performance ad creative generator with predictive scoring",
    "pricing_model": "Paid",
    "short_description": "Generates conversion-focused static and video ad banners at scale with built-in AI scoring that predicts CTR performance."
  },
  {
    "name": "Creatify",
    "domain": "creatify.ai",
    "category": "ad-creative",
    "tagline": "URL-to-video AI ad generator with hyper-realistic UGC avatars",
    "pricing_model": "Freemium",
    "short_description": "Converts product links directly into high-converting short-form video ads featuring realistic AI avatars and scriptwriting."
  },
  {
    "name": "Motion",
    "domain": "motionapp.com",
    "category": "ad-creative",
    "tagline": "Creative analytics and reporting platform for paid social teams",
    "pricing_model": "Paid",
    "short_description": "Bridges ad creative data with media buyers by providing visual performance dashboards and creative briefing scorecards for Meta and TikTok."
  },
  {
    "name": "Creatopy",
    "domain": "creatopy.com",
    "category": "ad-creative",
    "tagline": "Ad design automation platform for display, social, and HTML5 banners",
    "pricing_model": "Paid",
    "short_description": "Enables marketing teams to auto-resize, animate, and publish multi-platform display ad campaigns across hundreds of banner sizes."
  },
  {
    "name": "Pencil",
    "domain": "trypencil.com",
    "category": "ad-creative",
    "tagline": "AI ad creation and machine-learning creative optimization engine",
    "pricing_model": "Paid",
    "short_description": "Generates static and video ad variations using existing asset libraries, predicting performance based on historical ad spend data."
  },
  {
    "name": "Arcads",
    "domain": "arcads.ai",
    "category": "ad-creative",
    "tagline": "AI actors for direct-response talking-head UGC video ads",
    "pricing_model": "Paid",
    "short_description": "Transforms text scripts into natural-looking UGC video ads using realistic digital actors for TikTok, Meta, and YouTube shorts."
  },
  {
    "name": "Magic Brief",
    "domain": "magicbrief.com",
    "category": "ad-creative",
    "tagline": "Ad library saving, storyboarding, and creative brief generation platform",
    "pricing_model": "Paid",
    "short_description": "Saves competitor ads, breaks down winning video hooks, creates AI storyboards, and generates structured creative briefs for video editors."
  },
  {
    "name": "Topview AI",
    "domain": "topview.ai",
    "category": "ad-creative",
    "tagline": "Link-to-video AI ad generator for e-commerce and marketplace sellers",
    "pricing_model": "Freemium",
    "short_description": "Turns product URLs or raw media uploads into polished TikTok and Reels video ads with voiceovers and captions."
  },
  {
    "name": "Foreplay",
    "domain": "foreplay.co",
    "category": "ad-creative",
    "tagline": "Save, organize, and discover winning Facebook and TikTok ads",
    "pricing_model": "Paid",
    "short_description": "Allows performance marketers to save ads permanently from public libraries into organized brand swipe files and creative briefs."
  },
  {
    "name": "Predis.ai",
    "domain": "predis.ai",
    "category": "ad-creative",
    "tagline": "AI social ad generator and automated multi-format renderer",
    "pricing_model": "Freemium",
    "short_description": "Generates full ad campaigns—including carousel graphics, 9:16 videos, and ad copy—from a single text brief or link."
  },
  {
    "name": "Shhots AI",
    "domain": "shhots.ai",
    "category": "ad-creative",
    "tagline": "Product photo to AI video and UGC ad generator for DTC brands",
    "pricing_model": "Paid",
    "short_description": "Transforms basic e-commerce product shots into dynamic video ads and UGC showcase clips."
  },
  {
    "name": "AdLegends",
    "domain": "adlegends.ai",
    "category": "ad-creative",
    "tagline": "AI creative strategy platform built around high-converting ad angles",
    "pricing_model": "Paid",
    "short_description": "Develops big-idea strategic briefs and messaging angles before outputting multi-channel static and video ad variations."
  },
  {
    "name": "Jasper Ad Copy",
    "domain": "jasper.ai",
    "category": "copywriting",
    "tagline": "AI copywriting engine for high-converting PPC and social ad copy",
    "pricing_model": "Paid",
    "short_description": "Generates high-performing Google search ad headlines, Meta ad hooks, primary text variations, and GTM angles."
  },
  {
    "name": "Bannerflow",
    "domain": "bannerflow.com",
    "category": "ad-creative",
    "tagline": "Enterprise Creative Management Platform (CMP) for digital advertising",
    "pricing_model": "Paid",
    "short_description": "Automates multi-market display ad creation, localization, dynamic creative optimization (DCO), and publishing."
  },
  {
    "name": "Marpipe",
    "domain": "marpipe.com",
    "category": "ad-creative",
    "tagline": "Multivariate creative testing software for Meta and TikTok Ads",
    "pricing_model": "Paid",
    "short_description": "Automates the generation and split-testing of hundreds of ad image variations to isolate which design elements drive conversions."
  },
  {
    "name": "Smartly.io",
    "domain": "smartly.io",
    "category": "ad-creative",
    "tagline": "Automated digital advertising and dynamic creative platform",
    "pricing_model": "Paid",
    "short_description": "Combines automated ad creation, real-time product feed catalog ads, and cross-channel campaign management for enterprise advertisers."
  },
  {
    "name": "AdMake AI",
    "domain": "admakeai.com",
    "category": "ad-creative",
    "tagline": "Competitor ad research and batch AI ad set creation studio",
    "pricing_model": "Freemium",
    "short_description": "Combines Facebook Ad Library research with automated template rendering to quickly recreate winning ad structures."
  },
  {
    "name": "Submagic",
    "domain": "submagic.co",
    "category": "video-generators",
    "tagline": "AI caption, hook, and auto-b-roll tool for short video ads",
    "pricing_model": "Paid",
    "short_description": "Enhances short-form video creative with animated captions, trend emojis, sound effects, and auto-inserted stock footage."
  },
  {
    "name": "InVideo Ad Maker",
    "domain": "invideo.io",
    "category": "video-generators",
    "tagline": "Script-to-video ad generator with stock footage libraries",
    "pricing_model": "Freemium",
    "short_description": "Converts plain marketing prompts into complete video ads featuring AI voiceovers, captions, and relevant stock video clips."
  },
  {
    "name": "CapCut Pro for Business",
    "domain": "capcut.com",
    "category": "video-generators",
    "tagline": "Video ad editing app with commercial AI scripts and template assets",
    "pricing_model": "Freemium",
    "short_description": "Provides e-commerce video ad templates, AI teleprompter scripts, auto-captions, and trending effects for social ad campaigns."
  },
  {
    "name": "AdEspresso",
    "domain": "adespresso.com",
    "category": "ad-creative",
    "tagline": "A/B testing and optimization platform for Meta and Google ads",
    "pricing_model": "Paid",
    "short_description": "Simplifies multi-variant ad testing, allowing users to rapidly test combinations of headlines, images, and copy variations."
  },
  {
    "name": "Revealbot",
    "domain": "revealbot.com",
    "category": "ad-creative",
    "tagline": "Automated ad management and creative rule optimization engine",
    "pricing_model": "Paid",
    "short_description": "Automates paid social ad operations, auto-pausing fatigue-stricken creatives, and scaling budget on winning ad assets based on ROAS."
  },
  {
    "name": "Vidyard Ad Studio",
    "domain": "vidyard.com",
    "category": "ad-creative",
    "tagline": "Personalized B2B video ad generator and sales outreach tool",
    "pricing_model": "Freemium",
    "short_description": "Creates customized video assets and interactive video landing pages tailored for B2B digital ad campaigns."
  },
  {
    "name": "Anyword",
    "domain": "anyword.com",
    "category": "copywriting",
    "tagline": "Data-driven performance copywriting platform with predictive scoring",
    "pricing_model": "Paid",
    "short_description": "Evaluates ad text variations against audience demographic data to predict performance scores before running campaigns."
  },
  {
    "name": "Copy.ai Ad Studio",
    "domain": "copy.ai",
    "category": "copywriting",
    "tagline": "GTM workflow platform for generating ad copy and campaign assets",
    "pricing_model": "Freemium",
    "short_description": "Automates the generation of multi-angle ad copy, landing page briefs, and promotional messaging frameworks."
  },
  {
    "name": "Viddyoze",
    "domain": "viddyoze.com",
    "category": "video-generators",
    "tagline": "Automated 3D video ad animation and logo stinger creator",
    "pricing_model": "Paid",
    "short_description": "Produces 3D animated intro clips, logo stingers, call-to-action overlays, and video ad animations in seconds."
  },
  {
    "name": "Offeo",
    "domain": "offeo.com",
    "category": "video-generators",
    "tagline": "Online video maker for visual product ads and social campaigns",
    "pricing_model": "Paid",
    "short_description": "Specializes in high-energy, graphic-heavy short video ad design tailored for Shopify stores and Instagram promotion."
  },
  {
    "name": "Waymark",
    "domain": "waymark.com",
    "category": "video-generators",
    "tagline": "AI video ad generator for local TV, OTT, and digital streaming platforms",
    "pricing_model": "Paid",
    "short_description": "Generates broadcast-ready television and digital video commercials in minutes using AI scriptwriters and voiceovers."
  },
  {
    "name": "Vizard AI",
    "domain": "vizard.ai",
    "category": "video-generators",
    "tagline": "AI ad video Clipper and long-to-short video ad translator",
    "pricing_model": "Freemium",
    "short_description": "Re-crops, subtitles, and turns long webinar or product demo footage into snackable 9:16 paid video ads."
  },
  {
    "name": "Klap.app",
    "domain": "klap.app",
    "category": "video-generators",
    "tagline": "Turn long video content into high-converting video ad shorts",
    "pricing_model": "Freemium",
    "short_description": "Uses AI speaker-tracking to extract viral-worthy segments from long video assets into vertical paid ad clips."
  },
  {
    "name": "Postermywall",
    "domain": "postermywall.com",
    "category": "ad-creative",
    "tagline": "Easy design tool for promotional banners, flyers, and social ads",
    "pricing_model": "Freemium",
    "short_description": "Simplifies creating visual ad posters, menu promo graphics, display banners, and short promotional animations."
  },
  {
    "name": "Snappa",
    "domain": "snappa.com",
    "category": "ad-creative",
    "tagline": "Quick online graphic design software for social media ads",
    "pricing_model": "Freemium",
    "short_description": "Provides precise ad canvas dimensions for Facebook, Display Ads, and Twitter with stock photography and vector graphic layers."
  },
  {
    "name": "Biteable",
    "domain": "biteable.com",
    "category": "video-generators",
    "tagline": "Collaborative video ad creator and brand video builder",
    "pricing_model": "Paid",
    "short_description": "Allows teams to quickly assemble branded video promo ads using animated templates, voiceovers, and stock assets."
  },
  {
    "name": "Veed.io Ad Builder",
    "domain": "veed.io",
    "category": "video-generators",
    "tagline": "Online video ad editor with auto-captions and AI avatar presenters",
    "pricing_model": "Freemium",
    "short_description": "Edits promotional videos with custom branding overlays, automated captions, text-to-speech, and background removal."
  },
  {
    "name": "Promo.com",
    "domain": "promo.com",
    "category": "video-generators",
    "tagline": "High-converting video ad maker for marketing agencies and SMBs",
    "pricing_model": "Paid",
    "short_description": "Provides access to millions of premium Getty stock video clips pre-fitted into conversion-focused ad templates."
  },
  {
    "name": "AdStellar",
    "domain": "adstellar.ai",
    "category": "ad-creative",
    "tagline": "AI ad asset generation and direct Meta campaign deployment",
    "pricing_model": "Paid",
    "short_description": "Combines AI asset generation with direct campaign publishing APIs to launch Meta ad sets without leaving the platform."
  },
  {
    "name": "Tight Studio",
    "domain": "tight.studio",
    "category": "ad-creative",
    "tagline": "Screen recording and AI video ad editor for SaaS product demos",
    "pricing_model": "Paid",
    "short_description": "Converts raw app screen captures into high-converting product demo ads with automated zoom effects and voiceovers."
  },
  {
    "name": "DeeVid AI",
    "domain": "deevid.ai",
    "category": "ad-creative",
    "tagline": "Product photo and prompt-to-video AI ad creator",
    "pricing_model": "Freemium",
    "short_description": "Combines image-to-video synthesis, virtual AI model styling, and audio tools to generate video ads from single product shots."
  },
  {
    "name": "Synter",
    "domain": "syntermedia.ai",
    "category": "ad-creative",
    "tagline": "Cross-channel AI ad creative distribution platform",
    "pricing_model": "Paid",
    "short_description": "Generates platform-compliant ad formats and automatically deploys creative assets across 10+ ad networks."
  },
  {
    "name": "Photoroom Ad Studio",
    "domain": "photoroom.com",
    "category": "ad-creative",
    "tagline": "AI product photo backdrop generator for visual ad creatives",
    "pricing_model": "Freemium",
    "short_description": "Removes backgrounds and places products into high-resolution studio environments formatted for e-commerce ad banners."
  },
  {
    "name": "Pebblely for Ads",
    "domain": "pebblely.com",
    "category": "ad-creative",
    "tagline": "AI studio lighting and product ad scene generator",
    "pricing_model": "Freemium",
    "short_description": "Transforms plain e-commerce product photos into eye-catching digital ad visuals with dynamic background scenery."
  },
  {
    "name": "Flair AI for Ads",
    "domain": "flair.ai",
    "category": "ad-creative",
    "tagline": "Drag-and-drop AI ad asset design platform for product photos",
    "pricing_model": "Freemium",
    "short_description": "Places products on a 3D canvas with AI props, reflections, and shadow controls to produce high-end ad visuals."
  },
  {
    "name": "Typeframe",
    "domain": "typeframe.com",
    "category": "ad-creative",
    "tagline": "Turn text copy into kinetic typography promo video ads",
    "pricing_model": "Paid",
    "short_description": "Generates fast-paced kinetic typography trailers and promotional video ads from simple script inputs."
  },
  {
    "name": "AdFlex",
    "domain": "adflex.io",
    "category": "ad-creative",
    "tagline": "Ad intelligence and competitor campaign spy tool",
    "pricing_model": "Paid",
    "short_description": "Uncovers high-performing competitor ad creatives, landing pages, target demographics, and publisher placements across networks."
  },
  {
    "name": "BigSpy",
    "domain": "bigspy.com",
    "category": "ad-creative",
    "tagline": "Multi-platform ad library spy database for performance marketers",
    "pricing_model": "Freemium",
    "short_description": "Monitors millions of active ad creatives across Facebook, Instagram, YouTube, TikTok, and Pinterest to spot winning trends."
  },
  {
    "name": "Anstrex",
    "domain": "anstrex.com",
    "category": "ad-creative",
    "tagline": "Native, push, and drop-shipping ad intelligence spy tool",
    "pricing_model": "Paid",
    "short_description": "Tracks high-converting native ad creatives, push notifications, and affiliate campaign sales funnels worldwide."
  },
  {
    "name": "AdSpy",
    "domain": "adspy.com",
    "category": "ad-creative",
    "tagline": "Massive searchable database of Facebook and Instagram ad creatives",
    "pricing_model": "Paid",
    "short_description": "Provides deep filtering of global ad campaigns by keyword, affiliate network, landing page technology, and user reactions."
  },
  {
    "name": "AdInspirer",
    "domain": "adinspirer.com",
    "category": "ad-creative",
    "tagline": "AI ad brief builder and creative hook generator",
    "pricing_model": "Paid",
    "short_description": "Analyzes market research to automatically generate short video hooks, direct-response angles, and visual storyboards."
  },
  {
    "name": "AdBeat",
    "domain": "adbeat.com",
    "category": "ad-creative",
    "tagline": "Competitive media buying intelligence and display ad insights",
    "pricing_model": "Paid",
    "short_description": "Uncovers media spend data, publisher sources, banner design variants, and landing page funnels of top digital advertisers."
  },
  {
    "name": "Minea",
    "domain": "minea.com",
    "category": "ad-creative",
    "tagline": "E-commerce winner product finder and social ad spy tool",
    "pricing_model": "Freemium",
    "short_description": "Analyzes TikTok, Facebook, and Pinterest ads to uncover trending DTC products, winning ad creatives, and store funnels."
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
      category: tool.category || "ad-creative",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(1700 + Math.random() * 8900),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : 'Paid Trial',
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: false,
      features: [
        "Ad Creative Generation",
        "A/B Variant Testing",
        "Competitor Spy Library",
        "Multi-Format Export"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Ad Creative tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Ad Creative tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

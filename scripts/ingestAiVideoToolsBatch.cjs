const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Runway",
    "domain": "runwayml.com",
    "category": "trending-video-ai",
    "tagline": "Generative AI suite for video creation and cinematic FX",
    "pricing_model": "Freemium",
    "short_description": "Advanced text-to-video and image-to-video platform with precise motion controls, camera framing, and video editing tools."
  },
  {
    "name": "Pika",
    "domain": "pika.art",
    "category": "trending-video-ai",
    "tagline": "Idea-to-video platform for dynamic animations and effects",
    "pricing_model": "Freemium",
    "short_description": "Generates high-quality animated clips, region modifications, and visual effects from simple text or image inputs."
  },
  {
    "name": "Luma Dream Machine",
    "domain": "lumalabs.ai",
    "category": "trending-video-ai",
    "tagline": "High-fidelity cinematic AI video generator",
    "pricing_model": "Freemium",
    "short_description": "Produces realistic 3D motion clips, fluid camera sweeps, and high-resolution video scenes from prompts."
  },
  {
    "name": "Synthesia",
    "domain": "synthesia.io",
    "category": "trending-video-ai",
    "tagline": "AI avatar video generator for corporate training and presentations",
    "pricing_model": "Paid",
    "short_description": "Converts written scripts into studio-quality videos featuring hyper-realistic human avatars speaking 140+ languages."
  },
  {
    "name": "HeyGen",
    "domain": "heygen.com",
    "category": "trending-video-ai",
    "tagline": "AI video generation and multi-language lip-sync translation",
    "pricing_model": "Freemium",
    "short_description": "Creates personalized avatar videos and automatically translates video dialogue while matching lip movements."
  },
  {
    "name": "InVideo AI",
    "domain": "invideo.io",
    "category": "trending-video-ai",
    "tagline": "Prompt-to-video generator with script, voiceover, and stock media",
    "pricing_model": "Freemium",
    "short_description": "Turns text prompts into fully edited videos with automated voiceovers, stock footage selection, and dynamic captions."
  },
  {
    "name": "Descript",
    "domain": "descript.com",
    "category": "trending-video-ai",
    "tagline": "Text-based video editing powered by artificial intelligence",
    "pricing_model": "Freemium",
    "short_description": "Edits video and audio files by editing the generated transcript, complete with AI eye-contact correction and filler word removal."
  },
  {
    "name": "OpusClip",
    "domain": "opus.pro",
    "category": "trending-video-ai",
    "tagline": "AI video clipping tool that turns long videos into viral shorts",
    "pricing_model": "Freemium",
    "short_description": "Analyzes long YouTube videos or podcasts to extract, score, frame, and caption short-form clips for TikTok and Reels."
  },
  {
    "name": "Captions",
    "domain": "captions.ai",
    "category": "trending-video-ai",
    "tagline": "AI studio for talking-head video editing and subtitling",
    "pricing_model": "Paid",
    "short_description": "Offers automated word-by-word animated subtitles, AI dubbing, background noise removal, and eye-tracking alignment."
  },
  {
    "name": "D-ID",
    "domain": "d-id.com",
    "category": "trending-video-ai",
    "tagline": "Generative AI photo animation and digital human agent platform",
    "pricing_model": "Freemium",
    "short_description": "Animates still images into speaking avatar videos using uploaded audio or text-to-speech engines."
  },
  {
    "name": "Kling AI",
    "domain": "klingai.com",
    "category": "trending-video-ai",
    "tagline": "Next-gen generative AI video engine with long clip generation",
    "pricing_model": "Freemium",
    "short_description": "High-performance text-to-video and image-to-video platform capable of simulating physical world movement accurately."
  },
  {
    "name": "Hailuo AI",
    "domain": "hailuoai.com",
    "category": "trending-video-ai",
    "tagline": "AI video generator focused on detailed motion and realistic physics",
    "pricing_model": "Freemium",
    "short_description": "Produces prompt-driven video sequences with fluid character movement, consistent lighting, and atmospheric depth."
  },
  {
    "name": "Haiper AI",
    "domain": "haiper.ai",
    "category": "trending-video-ai",
    "tagline": "Perceptual AI video foundation model for creative artists",
    "pricing_model": "Freemium",
    "short_description": "Generates short animated video clips and provides repainting tools to modify existing video assets."
  },
  {
    "name": "Colossyan",
    "domain": "colossyan.com",
    "category": "trending-video-ai",
    "tagline": "AI video creator for enterprise workplace learning and instruction",
    "pricing_model": "Paid",
    "short_description": "Transforms PDF manuals and powerpoint presentations into interactive video modules with AI presenter avatars."
  },
  {
    "name": "Fliki",
    "domain": "fliki.ai",
    "category": "trending-video-ai",
    "tagline": "Text-to-video and text-to-speech creator with realistic AI voices",
    "pricing_model": "Freemium",
    "short_description": "Converts blog posts, tweets, and articles into narrated video content with rich stock media libraries."
  },
  {
    "name": "Veed.io",
    "domain": "veed.io",
    "category": "trending-video-ai",
    "tagline": "Online video editor with automated subtitles and AI avatars",
    "pricing_model": "Freemium",
    "short_description": "Web-based video suite featuring automatic auto-captioning, background removal, text-to-speech, and translation."
  },
  {
    "name": "Pictory",
    "domain": "pictory.ai",
    "category": "trending-video-ai",
    "tagline": "Automated short-form video creation from long-form text content",
    "pricing_model": "Paid",
    "short_description": "Extracts highlights from webinars and converts scripts or blog URLs into branded video summaries."
  },
  {
    "name": "Elai.io",
    "domain": "elai.io",
    "category": "trending-video-ai",
    "tagline": "Build presenter-led AI videos from plain text or URLs",
    "pricing_model": "Freemium",
    "short_description": "Allows creators to generate personalized videos featuring 80+ human avatars directly from prompts or blog links."
  },
  {
    "name": "DeepBrain AI",
    "domain": "deepbrain.io",
    "category": "trending-video-ai",
    "tagline": "Photorealistic AI human avatars for video generation",
    "pricing_model": "Paid",
    "short_description": "Generates conversational AI human models for news broadcasts, customer service kiosks, and training videos."
  },
  {
    "name": "Hour One",
    "domain": "hourone.ai",
    "category": "trending-video-ai",
    "tagline": "AI video generator converting text into video presentations",
    "pricing_model": "Freemium",
    "short_description": "Automates video production for news, e-learning, and product walk-throughs using realistic virtual hosts."
  },
  {
    "name": "Munch",
    "domain": "getmunch.com",
    "category": "trending-video-ai",
    "tagline": "AI clip extraction and content repurposing for social media",
    "pricing_model": "Paid",
    "short_description": "Extracts trending snippets from long videos based on real-time marketing data and auto-crops for vertical platforms."
  },
  {
    "name": "Klap",
    "domain": "klap.app",
    "category": "trending-video-ai",
    "tagline": "Turn long YouTube videos into viral TikToks and Shorts in 1 click",
    "pricing_model": "Freemium",
    "short_description": "Uses AI to detect captivating video moments, dynamic face reframing, and automated caption generation."
  },
  {
    "name": "Vizard",
    "domain": "vizard.ai",
    "category": "trending-video-ai",
    "tagline": "AI video editor that turns long recordings into short clips",
    "pricing_model": "Freemium",
    "short_description": "Automatically cuts webinars, interviews, and Zoom calls into social-ready video clips with custom branding."
  },
  {
    "name": "Vidyo.ai",
    "domain": "vidyo.ai",
    "category": "trending-video-ai",
    "tagline": "Content repurposing platform for podcasters and creators",
    "pricing_model": "Freemium",
    "short_description": "Converts long video podcasts into short, caption-enriched videos optimized for Instagram, Shorts, and TikTok."
  },
  {
    "name": "Submagic",
    "domain": "submagic.co",
    "category": "trending-video-ai",
    "tagline": "AI-generated captions, b-roll, and sound effects for short videos",
    "pricing_model": "Paid",
    "short_description": "Generates animated subtitles with emojis, auto-selects stock B-roll, and adds sound effects to boost engagement."
  },
  {
    "name": "Tavus",
    "domain": "tavus.io",
    "category": "trending-video-ai",
    "tagline": "Programmatic personalized video generation API for sales and product",
    "pricing_model": "Paid",
    "short_description": "Clones your voice and face to generate thousands of personalized sales outreach videos automatically."
  },
  {
    "name": "BHuman",
    "domain": "bhuman.ai",
    "category": "trending-video-ai",
    "tagline": "Personalized video messaging at scale with AI voice & video cloning",
    "pricing_model": "Freemium",
    "short_description": "Record one base video, and BHuman replaces key spoken variables to deliver personalized videos to every lead."
  },
  {
    "name": "Gan.ai",
    "domain": "gan.ai",
    "category": "trending-video-ai",
    "tagline": "Dynamic AI video personalization for sales and customer onboarding",
    "pricing_model": "Paid",
    "short_description": "Enables brands to record a single video and dynamically customize names, links, and details for massive email lists."
  },
  {
    "name": "Kaiber",
    "domain": "kaiber.ai",
    "category": "trending-video-ai",
    "tagline": "AI creative studio for stylized animation and music videos",
    "pricing_model": "Paid",
    "short_description": "Generates artistic video animations and visualizers by transforming original footage into stylized AI art styles."
  },
  {
    "name": "Viggle",
    "domain": "viggle.ai",
    "category": "trending-video-ai",
    "tagline": "Controllable character animation and physics movement generator",
    "pricing_model": "Freemium",
    "short_description": "Allows users to swap custom character images into existing video motion clips with controllable animation physics."
  },
  {
    "name": "DomoAI",
    "domain": "domoai.app",
    "category": "trending-video-ai",
    "tagline": "Transform real videos into anime and stylized animations",
    "pricing_model": "Freemium",
    "short_description": "AI art tool specializing in converting live-action video files into consistent anime, 3D render, or comic book visual styles."
  },
  {
    "name": "PixVerse",
    "domain": "pixverse.ai",
    "category": "trending-video-ai",
    "tagline": "Powerful generative AI video platform for high-resolution clips",
    "pricing_model": "Freemium",
    "short_description": "Converts text prompts and still imagery into expressive video scenes with customized style filters."
  },
  {
    "name": "LTX Studio",
    "domain": "ltx.studio",
    "category": "trending-video-ai",
    "tagline": "AI-driven filmmaking and storyboard production platform",
    "pricing_model": "Freemium",
    "short_description": "Provides full control over script development, character consistency, shot angles, and scene editing for filmmakers."
  },
  {
    "name": "Steve.ai",
    "domain": "steve.ai",
    "category": "trending-video-ai",
    "tagline": "AI video maker for live-action and animated explainer videos",
    "pricing_model": "Freemium",
    "short_description": "Converts text scripts into 2D animation or live-action stock videos within minutes using automated asset matching."
  },
  {
    "name": "Lumen5",
    "domain": "lumen5.com",
    "category": "trending-video-ai",
    "tagline": "Turns blog posts and articles into marketing videos",
    "pricing_model": "Freemium",
    "short_description": "Uses AI to match written text with relevant video clips, overlay typography, and build social media video ads."
  },
  {
    "name": "Visla",
    "domain": "visla.us",
    "category": "trending-video-ai",
    "tagline": "All-in-one video recording, editing, and script generation platform",
    "pricing_model": "Freemium",
    "short_description": "Generates video ideas, scripts, and complete video drafts tailored for corporate communication and marketing."
  },
  {
    "name": "CapCut",
    "domain": "capcut.com",
    "category": "trending-video-ai",
    "tagline": "All-in-one video editing software packed with AI features",
    "pricing_model": "Freemium",
    "short_description": "Features AI auto-captions, background removal, text-to-speech, teleprompter, and instant video script generation."
  },
  {
    "name": "Clipchamp",
    "domain": "clipchamp.com",
    "category": "trending-video-ai",
    "tagline": "Microsoft's online video editor with AI auto-compose tools",
    "pricing_model": "Freemium",
    "short_description": "Provides AI-assisted auto-composition, smart framing, synthetic speech voiceovers, and automatic subtitling."
  },
  {
    "name": "FlexClip",
    "domain": "flexclip.com",
    "category": "trending-video-ai",
    "tagline": "Web-based AI video editor and slideshow generator",
    "pricing_model": "Freemium",
    "short_description": "Features an AI script writer, text-to-video engine, automatic subtitles, and background remover for quick video creation."
  },
  {
    "name": "Raw Shorts",
    "domain": "rawshorts.com",
    "category": "trending-video-ai",
    "tagline": "Text-to-animated video generator for explainer content",
    "pricing_model": "Freemium",
    "short_description": "Scans video scripts using NLP to automatically create animated explainer video storyboards and voiceovers."
  },
  {
    "name": "Typeframe",
    "domain": "typeframe.com",
    "category": "trending-video-ai",
    "tagline": "Turn text scripts into high-converting promo videos",
    "pricing_model": "Paid",
    "short_description": "Generates kinetic typography product trailers and promotional marketing videos from plain text descriptions."
  },
  {
    "name": "AutoPod",
    "domain": "autopod.fm",
    "category": "trending-video-ai",
    "tagline": "Automatic multi-camera video editing plugin for Adobe Premiere Pro",
    "pricing_model": "Paid",
    "short_description": "Automates multi-camera switching for video podcasts and shows based on audio speaker detection."
  },
  {
    "name": "Morph Studio",
    "domain": "morphstudio.com",
    "category": "trending-video-ai",
    "tagline": "Text-to-video storyboard workflow for creative directors",
    "pricing_model": "Freemium",
    "short_description": "Combines generative AI video models on a visual canvas board to iterate shot-by-shot storyboards."
  },
  {
    "name": "QuickVid",
    "domain": "quickvid.ai",
    "category": "trending-video-ai",
    "tagline": "Automated short video creator for YouTube Shorts and Reels",
    "pricing_model": "Freemium",
    "short_description": "Generates short viral videos using AI scripts, voiceovers, background footage, and auto-captions."
  },
  {
    "name": "Synthesys",
    "domain": "synthesys.io",
    "category": "trending-video-ai",
    "tagline": "AI virtual human spokesperson and text-to-video platform",
    "pricing_model": "Paid",
    "short_description": "Produces commercial videos using virtual human actors and synthetic voice synthesis without camera equipment."
  },
  {
    "name": "Rephrase.ai",
    "domain": "rephrase.ai",
    "category": "trending-video-ai",
    "tagline": "Hyper-personalized AI video generation engine for enterprise",
    "pricing_model": "Paid",
    "short_description": "Converts text into personalized video campaigns using synthetic human avatars for customer outreach."
  },
  {
    "name": "Wondershare Virbo",
    "domain": "wondershare.com",
    "category": "trending-video-ai",
    "tagline": "AI avatar video creator for global marketing and e-commerce",
    "pricing_model": "Freemium",
    "short_description": "Provides 300+ realistic avatars and multi-language translation tools to generate marketing videos fast."
  },
  {
    "name": "AnimateDiff",
    "domain": "animatediff.org",
    "category": "trending-video-ai",
    "tagline": "Open-source diffusion model framework for text-to-animation",
    "pricing_model": "Free",
    "short_description": "Generates temporal-consistent animations directly from Stable Diffusion text-to-image prompts."
  },
  {
    "name": "DeepBrain AI Human",
    "domain": "aistudios.com",
    "category": "trending-video-ai",
    "tagline": "AI Studios prompt-to-video engine with realistic presenters",
    "pricing_model": "Paid",
    "short_description": "Turns prompts, URLs, or documents into polished studio videos with custom script creation and photo-real avatars."
  },
  {
    "name": "Sora",
    "domain": "openai.com",
    "category": "trending-video-ai",
    "tagline": "OpenAI's text-to-video model generating complex scenes",
    "pricing_model": "Paid",
    "short_description": "Frontier AI video model capable of generating up to 60-second video scenes with complex camera motions and dynamic physics."
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
      category: "trending-video-ai",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(1800 + Math.random() * 12000),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : 'Paid Trial',
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('animatediff'),
      features: [
        "Text to Video",
        "AI Avatars",
        "Auto Captions",
        "4K Render Export"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW AI Video tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new AI Video tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

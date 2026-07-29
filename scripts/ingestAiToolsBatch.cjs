const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "OpenAI",
    "domain": "openai.com",
    "category": "ai-content",
    "tagline": "Advanced AI models including ChatGPT and GPT-4o",
    "pricing_model": "Freemium",
    "short_description": "Pioneer in artificial intelligence providing conversational AI, vision, reasoning models, and developer APIs."
  },
  {
    "name": "Anthropic Claude",
    "domain": "claude.ai",
    "category": "ai-content",
    "tagline": "Next-generation AI assistant built for reasoning and coding",
    "pricing_model": "Freemium",
    "short_description": "AI model family specialized in high-level reasoning, complex analysis, long-context understanding, and coding."
  },
  {
    "name": "Perplexity AI",
    "domain": "perplexity.ai",
    "category": "ai-content",
    "tagline": "AI-powered conversational answer engine with real-time web citations",
    "pricing_model": "Freemium",
    "short_description": "Search engine alternative that synthesizes direct, cited answers to complex queries using live web research."
  },
  {
    "name": "Midjourney",
    "domain": "midjourney.com",
    "category": "design-creative",
    "tagline": "Generative AI platform for photorealistic artwork and visual creation",
    "pricing_model": "Paid",
    "short_description": "Leading image generation tool renowned for high artistic quality, detailed textures, and creative style control."
  },
  {
    "name": "Runway",
    "domain": "runwayml.com",
    "category": "trending-video-ai",
    "tagline": "AI video generation and creative suite for filmmakers",
    "pricing_model": "Freemium",
    "short_description": "Generative AI video platform offering text-to-video, image-to-video, dynamic camera controls, and video editing tools."
  },
  {
    "name": "ElevenLabs",
    "domain": "elevenlabs.io",
    "category": "ai-music-audio",
    "tagline": "AI voice generator and realistic text-to-speech engine",
    "pricing_model": "Freemium",
    "short_description": "High-fidelity voice synthesis platform capable of voice cloning, dubbing in 30+ languages, and emotional speech control."
  },
  {
    "name": "Cursor",
    "domain": "cursor.com",
    "category": "ai-coding-dev",
    "tagline": "The AI-first code editor built for rapid software development",
    "pricing_model": "Freemium",
    "short_description": "VS Code fork enhanced with deep codebase indexing, inline AI editing, multi-file code generation, and agentic workflows."
  },
  {
    "name": "GitHub Copilot",
    "domain": "github.com",
    "category": "ai-coding-dev",
    "tagline": "AI pair programmer embedded into popular IDEs",
    "pricing_model": "Paid",
    "short_description": "Code completion assistant that suggests functions, unit tests, and real-time completions across dozens of programming languages."
  },
  {
    "name": "Replit Agent",
    "domain": "replit.com",
    "category": "ai-coding-dev",
    "tagline": "Build and deploy full-stack applications from simple prompts",
    "pricing_model": "Freemium",
    "short_description": "Cloud development platform featuring autonomous AI agents capable of writing code, installing packages, and deploying apps."
  },
  {
    "name": "v0 by Vercel",
    "domain": "v0.dev",
    "category": "ai-coding-dev",
    "tagline": "Generative UI system powered by AI and Tailwind CSS",
    "pricing_model": "Freemium",
    "short_description": "Turns plain-text prompts into production-ready React, UI component, and page layouts."
  },
  {
    "name": "Lovable",
    "domain": "lovable.dev",
    "category": "ai-coding-dev",
    "tagline": "Full-stack web application development via AI conversation",
    "pricing_model": "Freemium",
    "short_description": "AI web builder that generates frontend interfaces, integrates backends, and deploys live sites directly from prompt conversations."
  },
  {
    "name": "Jasper",
    "domain": "jasper.ai",
    "category": "ai-content",
    "tagline": "AI copilot for enterprise marketing teams and brand content",
    "pricing_model": "Paid",
    "short_description": "AI writing and strategy platform trained on brand guidelines for campaign execution, SEO blogs, and marketing assets."
  },
  {
    "name": "Copy.ai",
    "domain": "copy.ai",
    "category": "ai-content",
    "tagline": "GTM AI platform for sales and marketing automation",
    "pricing_model": "Freemium",
    "short_description": "Automates sales email prospecting, content creation, and workflow execution using specialized AI workflows."
  },
  {
    "name": "Synthesia",
    "domain": "synthesia.io",
    "category": "trending-video-ai",
    "tagline": "AI video communications platform with custom avatars",
    "pricing_model": "Paid",
    "short_description": "Generates professional training and presentation videos with realistic human avatars from simple scripts."
  },
  {
    "name": "HeyGen",
    "domain": "heygen.com",
    "category": "trending-video-ai",
    "tagline": "AI avatar video generator for localized video creation",
    "pricing_model": "Freemium",
    "short_description": "Creates studio-quality videos featuring custom avatars, precise lip-syncing, and automated video translation."
  },
  {
    "name": "Descript",
    "domain": "descript.com",
    "category": "trending-video-ai",
    "tagline": "Text-based video and podcast editing powered by AI",
    "pricing_model": "Freemium",
    "short_description": "Edits media files like text documents, providing automated transcription, studio sound enhancement, and voice cloning."
  },
  {
    "name": "Otter.ai",
    "domain": "otter.ai",
    "category": "meeting-ai",
    "tagline": "AI meeting assistant for automated transcription and notes",
    "pricing_model": "Freemium",
    "short_description": "Joins video conferences to transcribe speech in real-time, capture action items, and summarize meeting outcomes."
  },
  {
    "name": "Fireflies.ai",
    "domain": "fireflies.ai",
    "category": "meeting-ai",
    "tagline": "Automated meeting recorder and conversation intelligence",
    "pricing_model": "Freemium",
    "short_description": "Records and transcribes voice conversations across video call platforms, surfacing key insights and sentiment analysis."
  },
  {
    "name": "Suno",
    "domain": "suno.com",
    "category": "ai-music-audio",
    "tagline": "Generative AI music platform turning ideas into full songs",
    "pricing_model": "Freemium",
    "short_description": "Generates complete instrumental and vocal tracks across any musical genre from simple prompt descriptions."
  },
  {
    "name": "Udio",
    "domain": "udio.com",
    "category": "ai-music-audio",
    "tagline": "AI music creation engine for custom audio tracks",
    "pricing_model": "Freemium",
    "short_description": "Produces high-fidelity music compositions with precise genre controls, custom lyrics, and audio extensions."
  },
  {
    "name": "Phind",
    "domain": "phind.com",
    "category": "ai-coding-dev",
    "tagline": "AI search and problem solver tuned specifically for developers",
    "pricing_model": "Freemium",
    "short_description": "Technical search engine providing immediate code solutions, technical explanations, and documentation lookup."
  },
  {
    "name": "Leonardo.Ai",
    "domain": "leonardo.ai",
    "category": "design-creative",
    "tagline": "AI asset generation suite for game design and visual concepts",
    "pricing_model": "Freemium",
    "short_description": "Creative suite offering fine-tuned image generation models, texture mapping, and real-time visual canvas editing."
  },
  {
    "name": "Stability AI",
    "domain": "stability.ai",
    "category": "design-creative",
    "tagline": "Open generative AI models for image, audio, and 3D generation",
    "pricing_model": "Freemium",
    "short_description": "Developer of the open-source Stable Diffusion series, delivering generative models for media synthesis."
  },
  {
    "name": "Luma AI",
    "domain": "lumalabs.ai",
    "category": "trending-video-ai",
    "tagline": "3D NeRF generation and photorealistic Dream Machine video generator",
    "pricing_model": "Freemium",
    "short_description": "Captures 3D scenes from mobile devices and generates cinematic AI video motion clips."
  },
  {
    "name": "Pika",
    "domain": "pika.art",
    "category": "trending-video-ai",
    "tagline": "Idea-to-video AI platform for creative animations",
    "pricing_model": "Freemium",
    "short_description": "Generates dynamic 3D visual effects, object swaps, and video animations from text and image prompts."
  },
  {
    "name": "Krea AI",
    "domain": "krea.ai",
    "category": "design-creative",
    "tagline": "Real-time AI visual generation and upscale enhancement",
    "pricing_model": "Freemium",
    "short_description": "Provides real-time interactive canvas generation, photo upscaling, and pattern-to-art transformations."
  },
  {
    "name": "Magnific AI",
    "domain": "magnific.ai",
    "category": "design-creative",
    "tagline": "Ultra-high resolution image upscaler and detail enhancer",
    "pricing_model": "Paid",
    "short_description": "Uses AI hallucination controls to transform low-res images into hyper-detailed 8K visuals for print and digital."
  },
  {
    "name": "Gamma",
    "domain": "gamma.app",
    "category": "ai-content",
    "tagline": "AI tool for generating presentations, documents, and webpages",
    "pricing_model": "Freemium",
    "short_description": "Creates polished presentation slide decks and visual pitch documents in seconds with prompt-based styling."
  },
  {
    "name": "Consensus",
    "domain": "consensus.app",
    "category": "ai-content",
    "tagline": "AI search engine for peer-reviewed scientific research",
    "pricing_model": "Freemium",
    "short_description": "Extracts evidence-based answers directly from 200M+ academic research papers to support scientific claims."
  },
  {
    "name": "Elicit",
    "domain": "elicit.com",
    "category": "ai-content",
    "tagline": "AI research assistant for paper discovery and synthesis",
    "pricing_model": "Freemium",
    "short_description": "Automates research workflows by summarizing papers, extracting key data points, and mapping study findings."
  },
  {
    "name": "Scite",
    "domain": "scite.ai",
    "category": "ai-content",
    "tagline": "Smart citations platform for evaluating research claims",
    "pricing_model": "Paid",
    "short_description": "Uses deep learning to analyze scientific papers and classify citations as supporting or contrasting evidence."
  },
  {
    "name": "Limitless",
    "domain": "limitless.ai",
    "category": "meeting-ai",
    "tagline": "Personalized AI memory companion for meetings and conversations",
    "pricing_model": "Freemium",
    "short_description": "Records, transcribes, and organizes real-world and virtual interactions to serve as a persistent personal memory engine."
  },
  {
    "name": "Voiceflow",
    "domain": "voiceflow.com",
    "category": "ai-coding-dev",
    "tagline": "Collaborative builder for AI agents and conversational bots",
    "pricing_model": "Freemium",
    "short_description": "Visual canvas platform for designing, testing, and deploying custom AI agents and customer support bots."
  },
  {
    "name": "Chatbase",
    "domain": "chatbase.co",
    "category": "customer-support",
    "tagline": "Custom ChatGPT builder for your website data",
    "pricing_model": "Freemium",
    "short_description": "Uploads PDF documents, text, or website links to generate an embeddable customer support chatbot."
  },
  {
    "name": "CustomGPT",
    "domain": "customgpt.ai",
    "category": "customer-support",
    "tagline": "No-code enterprise AI bot platform built on your content",
    "pricing_model": "Paid",
    "short_description": "Builds secure, anti-hallucination AI chatbots using your company's proprietary knowledge base."
  },
  {
    "name": "Poe",
    "domain": "poe.com",
    "category": "ai-content",
    "tagline": "Multi-model AI ecosystem and custom bot discovery platform",
    "pricing_model": "Freemium",
    "short_description": "Quora-built platform giving unified access to Claude, GPT-4, Llama, and millions of user-created AI bots."
  },
  {
    "name": "Hugging Face",
    "domain": "huggingface.co",
    "category": "ai-coding-dev",
    "tagline": "The open-source AI platform for models, datasets, and apps",
    "pricing_model": "Freemium",
    "short_description": "Central repository for open-source AI collaboration, model hosting, dataset sharing, and ML space demos."
  },
  {
    "name": "Replicate",
    "domain": "replicate.com",
    "category": "ai-coding-dev",
    "tagline": "Run open-source machine learning models with a cloud API",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Allows developers to run open-source AI models at scale without managing GPU infrastructure."
  },
  {
    "name": "Together AI",
    "domain": "together.ai",
    "category": "ai-coding-dev",
    "tagline": "Fast cloud platform for building and running open source AI",
    "pricing_model": "Pay-as-you-go",
    "short_description": "High-performance GPU cloud provider optimized for fine-tuning and hosting open-weight LLMs."
  },
  {
    "name": "Groq",
    "domain": "groq.com",
    "category": "ai-coding-dev",
    "tagline": "Ultra-fast LPU inference engine for large language models",
    "pricing_model": "Freemium",
    "short_description": "Hardware and software platform delivering real-time LLM inference speed using custom LPU architecture."
  },
  {
    "name": "Cohere",
    "domain": "cohere.com",
    "category": "ai-coding-dev",
    "tagline": "Enterprise AI platform for search, retrieval, and generation",
    "pricing_model": "Paid",
    "short_description": "Provides enterprise-grade language models tailored for semantic search, RAG systems, and data security."
  },
  {
    "name": "Mistral AI",
    "domain": "mistral.ai",
    "category": "ai-coding-dev",
    "tagline": "Open and portable generative AI models for developers",
    "pricing_model": "Freemium",
    "short_description": "European AI company producing high-efficiency open-weights and commercial frontier LLMs."
  },
  {
    "name": "DeepL",
    "domain": "deepl.com",
    "category": "ai-content",
    "tagline": "Accurate AI translation and writing refinement tool",
    "pricing_model": "Freemium",
    "short_description": "Neural machine translation service known for nuance preservation and multilingual business translation."
  },
  {
    "name": "Murf AI",
    "domain": "murf.ai",
    "category": "ai-music-audio",
    "tagline": "Versatile AI voice generator for voiceovers and presentations",
    "pricing_model": "Freemium",
    "short_description": "Studio-quality voiceover builder for e-learning materials, marketing videos, podcasts, and presentations."
  },
  {
    "name": "InVideo AI",
    "domain": "invideo.io",
    "category": "trending-video-ai",
    "tagline": "Turn text prompts into published social media videos",
    "pricing_model": "Freemium",
    "short_description": "Generates complete short-form and long-form videos with scripts, stock footage, voiceovers, and subtitles."
  },
  {
    "name": "OpusClip",
    "domain": "opus.pro",
    "category": "trending-video-ai",
    "tagline": "AI video clipping tool to convert long videos into viral shorts",
    "pricing_model": "Freemium",
    "short_description": "Analyzes long-form video content to extract, reframe, caption, and rank viral-ready short clips."
  },
  {
    "name": "Captions",
    "domain": "captions.ai",
    "category": "trending-video-ai",
    "tagline": "AI-powered studio for talking head video creation and editing",
    "pricing_model": "Paid",
    "short_description": "Automates subtitling, eye-contact correction, lip-sync translation, and noise reduction for creators."
  },
  {
    "name": "Speechify",
    "domain": "speechify.com",
    "category": "ai-music-audio",
    "tagline": "AI voice reader for web articles, PDFs, and books",
    "pricing_model": "Freemium",
    "short_description": "Converts written text into natural-sounding audio across desktop, mobile, and browser extensions."
  },
  {
    "name": "D-ID",
    "domain": "d-id.com",
    "category": "trending-video-ai",
    "tagline": "Generative AI avatar studio for interactive digital humans",
    "pricing_model": "Freemium",
    "short_description": "Animates photos into talking videos with custom voice tracks and conversational API integrations."
  },
  {
    "name": "PlayHT",
    "domain": "play.ht",
    "category": "ai-music-audio",
    "tagline": "Conversational AI voice generator and voice cloning studio",
    "pricing_model": "Freemium",
    "short_description": "Generates real-time, low-latency text-to-speech audio streaming tailored for AI voice agents."
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
      category: tool.category || "ai-content",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.5 + (Math.random() * 0.4)).toFixed(1),
      reviewsCount: Math.floor(2500 + Math.random() * 15000),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Pay-as-you-go' ? 'Pay-as-you-go' : 'Paid Trial'),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('hugging face') || tool.name.toLowerCase().includes('stability') || tool.name.toLowerCase().includes('mistral'),
      features: [
        "AI Generation",
        "API Access",
        "Cloud Speed",
        "Modern Interface"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW AI tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new AI tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

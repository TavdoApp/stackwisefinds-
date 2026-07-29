const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "Midjourney",
    "domain": "midjourney.com",
    "category": "design-creative",
    "tagline": "Industry-leading artistic and photorealistic AI image generation",
    "pricing_model": "Paid",
    "short_description": "Generates state-of-the-art cinematic artwork, concept designs, and photorealistic imagery through web and Discord interfaces."
  },
  {
    "name": "Adobe Firefly",
    "domain": "firefly.adobe.com",
    "category": "design-creative",
    "tagline": "Commercially safe generative AI built into Adobe Creative Cloud",
    "pricing_model": "Freemium",
    "short_description": "Generates royalty-free images, vector graphics, and text effects trained on Adobe Stock and public domain content."
  },
  {
    "name": "Recraft",
    "domain": "recraft.ai",
    "category": "design-creative",
    "tagline": "AI design canvas for generating raster, vector art, and 3D graphics",
    "pricing_model": "Freemium",
    "short_description": "Infinite canvas workspace enabling graphic designers to generate vector SVGs, 3D renders, and brand style palettes."
  },
  {
    "name": "Ideogram",
    "domain": "ideogram.ai",
    "category": "design-creative",
    "tagline": "AI image generator with industry-leading typography and text rendering",
    "pricing_model": "Freemium",
    "short_description": "Specializes in generating crisp, accurate text inside graphics, logos, posters, t-shirt prints, and UI concept cards."
  },
  {
    "name": "Leonardo.Ai",
    "domain": "leonardo.ai",
    "category": "design-creative",
    "tagline": "Generative AI suite for game assets, character design, and texture mapping",
    "pricing_model": "Freemium",
    "short_description": "Canva-backed generative platform for creating consistent character assets, production art, and custom fine-tuned models."
  },
  {
    "name": "FLUX by Black Forest Labs",
    "domain": "blackforestlabs.ai",
    "category": "design-creative",
    "tagline": "Open-weight high-fidelity AI image generation foundation model",
    "pricing_model": "Freemium",
    "short_description": "State-of-the-art open image model known for realistic human anatomy, prompt adherence, and versatile style rendering."
  },
  {
    "name": "Kittl",
    "domain": "kittl.com",
    "category": "design-creative",
    "tagline": "AI-powered graphic design platform for merchandise, logos, and print",
    "pricing_model": "Freemium",
    "short_description": "Empowers creators with advanced typography warping, AI illustration generators, vector editing, and print-ready templates."
  },
  {
    "name": "Galileo AI",
    "domain": "usegalileo.ai",
    "category": "design-creative",
    "tagline": "Generative AI for instant mobile and web UI interface designs",
    "pricing_model": "Paid",
    "short_description": "Converts plain text prompts into editable, high-fidelity UI screens and component layouts ready for Figma handoff."
  },
  {
    "name": "Uizard",
    "domain": "uizard.io",
    "category": "design-creative",
    "tagline": "AI UI/UX design tool for wireframing, prototyping, and app design",
    "pricing_model": "Freemium",
    "short_description": "Transforms paper hand-sketches and screenshots into editable digital UI wireframes, prototypes, and user flows."
  },
  {
    "name": "Visily",
    "domain": "visily.ai",
    "category": "design-creative",
    "tagline": "AI-powered wireframing software for software and product teams",
    "pricing_model": "Freemium",
    "short_description": "Rapid wireframing tool converting text prompts, screenshots, and diagrams into collaborative application UI prototypes."
  },
  {
    "name": "Figma AI",
    "domain": "figma.com",
    "category": "design-creative",
    "tagline": "Generative AI tools integrated directly into the Figma design canvas",
    "pricing_model": "Freemium",
    "short_description": "Automates component generation, asset search, visual layout drafts, auto-layer renaming, and realistic text filling in Figma."
  },
  {
    "name": "Framer AI",
    "domain": "framer.com",
    "category": "web-builders",
    "tagline": "Prompt-to-website AI builder with interactive animations",
    "pricing_model": "Freemium",
    "short_description": "Generates, styles, and publishes responsive marketing websites directly from text prompts without leaving the canvas."
  },
  {
    "name": "Relume",
    "domain": "relume.io",
    "category": "web-builders",
    "tagline": "AI website builder, sitemap generator, and wireframe designer",
    "pricing_model": "Freemium",
    "short_description": "Builds website sitemaps, page copy briefs, and wireframes in seconds, exporting directly to Figma and Webflow."
  },
  {
    "name": "Looka",
    "domain": "looka.com",
    "category": "design-creative",
    "tagline": "AI logo generator and brand identity platform for startups",
    "pricing_model": "Paid",
    "short_description": "Generates custom logos, brand color palettes, business card layouts, and brand identity guidelines using AI."
  },
  {
    "name": "Brandmark",
    "domain": "brandmark.io",
    "category": "design-creative",
    "tagline": "AI branding system for generating logos and visual marketing assets",
    "pricing_model": "Paid",
    "short_description": "Creates distinct logo icons, color systems, typography pairings, and ready-to-use social media graphics."
  },
  {
    "name": "Khroma",
    "domain": "khroma.co",
    "category": "design-creative",
    "tagline": "AI color palette generator for designers",
    "pricing_model": "Free",
    "short_description": "Learns your visual preferences to generate personalized color combinations, gradients, and typography pairings."
  },
  {
    "name": "Photoroom",
    "domain": "photoroom.com",
    "category": "design-creative",
    "tagline": "AI product photo editing, background remover, and studio photographer",
    "pricing_model": "Freemium",
    "short_description": "Removes background images instantly and replaces them with AI studio scenes tailored for e-commerce product listings."
  },
  {
    "name": "Clipdrop",
    "domain": "clipdrop.co",
    "category": "design-creative",
    "tagline": "AI editing suite for image relighting, uncropping, and background removal",
    "pricing_model": "Freemium",
    "short_description": "Provides powerful image utilities including re-lighting scenes, replacing elements, object removal, and image upscaling."
  },
  {
    "name": "Canva Magic Studio",
    "domain": "canva.com",
    "category": "design-creative",
    "tagline": "All-in-one AI visual design suite for social media and marketing",
    "pricing_model": "Freemium",
    "short_description": "Combines text-to-image generation, magic resizing, automated image editing, and layout generation for non-designers."
  },
  {
    "name": "Designs.ai",
    "domain": "designs.ai",
    "category": "design-creative",
    "tagline": "Integrated AI creative agency for logos, videos, banners, and speech",
    "pricing_model": "Paid",
    "short_description": "Suite of design tools for creating promotional banners, logos, mockup templates, and social graphics automatically."
  },
  {
    "name": "Vectorizer.AI",
    "domain": "vectorizer.ai",
    "category": "design-creative",
    "tagline": "Convert PNG and JPG images to clean SVG vector graphics with AI",
    "pricing_model": "Paid",
    "short_description": "Traces pixel bitmaps into resolution-independent SVG vector files with crisp lines, suitable for print and UI design."
  },
  {
    "name": "Illustroke",
    "domain": "illustroke.com",
    "category": "design-creative",
    "tagline": "AI text-to-SVG vector illustration generator",
    "pricing_model": "Paid",
    "short_description": "Generates scalable vector SVG illustrations from text prompts for web designs, landing pages, and pitch decks."
  },
  {
    "name": "Stylar AI",
    "domain": "stylar.ai",
    "category": "design-creative",
    "tagline": "Controllable AI image composition and layer assistant for designers",
    "pricing_model": "Freemium",
    "short_description": "Provides fine-grained composition control to place objects, adjust styles, and blend layers without prompt randomness."
  },
  {
    "name": "Visual Electric",
    "domain": "visualelectric.com",
    "category": "design-creative",
    "tagline": "Generative canvas built specifically for creative designers",
    "pricing_model": "Freemium",
    "short_description": "Canvas-based image generator designed to assist moodboarding, style exploration, and fast visual brainstorming."
  },
  {
    "name": "Playground",
    "domain": "playground.com",
    "category": "design-creative",
    "tagline": "AI graphics creator combining image generation with canvas editing",
    "pricing_model": "Freemium",
    "short_description": "Allows creators to erase objects, expand borders, blend images, and generate social graphics on an interactive board."
  },
  {
    "name": "Remove.bg",
    "domain": "remove.bg",
    "category": "design-creative",
    "tagline": "Automated AI background removal tool for photos and graphics",
    "pricing_model": "Freemium",
    "short_description": "Instantly cuts out foreground subjects and removes image backgrounds in high precision within seconds."
  },
  {
    "name": "VanceAI",
    "domain": "vanceai.com",
    "category": "design-creative",
    "tagline": "AI photo enhancement, upscaling, sharpening, and restoration suite",
    "pricing_model": "Freemium",
    "short_description": "Automates photo enhancement, background removal, noise reduction, and image upscaling for design assets."
  },
  {
    "name": "Topaz Gigapixel",
    "domain": "topazlabs.com",
    "category": "design-creative",
    "tagline": "Desktop AI image upscaler and detail restorer for high-res printing",
    "pricing_model": "Paid",
    "short_description": "Professional-grade image upscaler that recovers fine details, textures, and clarity up to 600% resolution."
  },
  {
    "name": "Pixelcut",
    "domain": "pixelcut.ai",
    "category": "design-creative",
    "tagline": "AI graphic design and photo editor for e-commerce seller assets",
    "pricing_model": "Freemium",
    "short_description": "Mobile and desktop tool offering background removal, shadow generation, magic eraser, and product photo studio setups."
  },
  {
    "name": "Pebblely",
    "domain": "pebblely.com",
    "category": "design-creative",
    "tagline": "AI product photography generator for e-commerce brands",
    "pricing_model": "Freemium",
    "short_description": "Turns simple smartphone product snaps into professional studio-shot ad photos in seconds."
  },
  {
    "name": "Flair AI",
    "domain": "flair.ai",
    "category": "design-creative",
    "tagline": "AI design tool for branded content and product photography",
    "pricing_model": "Freemium",
    "short_description": "Drag-and-drop canvas platform for building high-end product photo shoots with 3D props and realistic lighting."
  },
  {
    "name": "Mokker AI",
    "domain": "mokker.ai",
    "category": "design-creative",
    "tagline": "Instant background generator for product photo catalogs",
    "pricing_model": "Freemium",
    "short_description": "Replaces plain product photo backgrounds with realistic lifestyle backgrounds suitable for social ads."
  },
  {
    "name": "Spline 3D",
    "domain": "spline.design",
    "category": "design-creative",
    "tagline": "3D design tool with generative AI 3D model and texture creation",
    "pricing_model": "Freemium",
    "short_description": "3D design software that generates real-time 3D objects, interactive scenes, and custom material textures from text."
  },
  {
    "name": "Meshy",
    "domain": "meshy.ai",
    "category": "design-creative",
    "tagline": "Text and image to 3D model generator for game developers and designers",
    "pricing_model": "Freemium",
    "short_description": "Accelerates 3D workflows by converting text prompts or 2D images into textured 3D meshes in minutes."
  },
  {
    "name": "Tripo3D",
    "domain": "tripo3d.ai",
    "category": "design-creative",
    "tagline": "Rapid text-to-3D model generation engine",
    "pricing_model": "Freemium",
    "short_description": "Generates draft-quality 3D geometry models from single prompts in seconds for rapid design prototyping."
  },
  {
    "name": "Krea",
    "domain": "krea.ai",
    "category": "design-creative",
    "tagline": "Real-time interactive AI image generation, upscaling, and pattern design",
    "pricing_model": "Freemium",
    "short_description": "Generates real-time visual outputs while you draw on a canvas, offering high-res upscaling and pattern synthesis."
  },
  {
    "name": "Artbreeder",
    "domain": "artbreeder.com",
    "category": "design-creative",
    "tagline": "Collaborative image blending and character gene creation",
    "pricing_model": "Freemium",
    "short_description": "Combines and mutates image characteristics to discover unique portraits, landscapes, anime art, and collage concepts."
  },
  {
    "name": "NightCafe",
    "domain": "nightcafe.studio",
    "category": "design-creative",
    "tagline": "Multi-model AI art creation and community platform",
    "pricing_model": "Freemium",
    "short_description": "Provides access to multiple AI image models (Stable Diffusion, DALL-E, FLUX) in a single unified interface."
  },
  {
    "name": "SeaArt",
    "domain": "seaart.ai",
    "category": "design-creative",
    "tagline": "AI creative tool for image rendering, upscaling, and portrait art",
    "pricing_model": "Freemium",
    "short_description": "Feature-packed AI art generator offering controlnet options, image-to-image styling, background removal, and HD enhancement."
  },
  {
    "name": "Tensor.Art",
    "domain": "tensor.art",
    "category": "design-creative",
    "tagline": "Free AI image generator and custom LoRA model hosting platform",
    "pricing_model": "Freemium",
    "short_description": "Online platform for running specialized Stable Diffusion and FLUX LoRAs to generate fine-tuned design styles."
  },
  {
    "name": "Civitai",
    "domain": "civitai.com",
    "category": "design-creative",
    "tagline": "The premier open-source AI model media and prompt hub",
    "pricing_model": "Freemium",
    "short_description": "Community repository for sharing custom AI image generation models, LoRAs, visual style presets, and prompts."
  },
  {
    "name": "Autodraw",
    "domain": "autodraw.com",
    "category": "design-creative",
    "tagline": "Google AI drawing tool that turns rough doodles into clean graphics",
    "pricing_model": "Free",
    "short_description": "Pairs machine learning with drawings by artists to transform rough hand sketches into polished, vector icon art."
  },
  {
    "name": "Patterned AI",
    "domain": "patterned.ai",
    "category": "design-creative",
    "tagline": "AI seamless pattern generator for print and web graphics",
    "pricing_model": "Freemium",
    "short_description": "Generates seamless, royalty-free background pattern graphics for surface prints, packaging, and digital designs."
  },
  {
    "name": "Sivi AI",
    "domain": "sivi.ai",
    "category": "design-creative",
    "tagline": "Generates fully editable ad banners and graphic designs instantly",
    "pricing_model": "Paid",
    "short_description": "Converts plain content copy into fully editable visual ad banners, social media posts, and website sections."
  },
  {
    "name": "Microsoft Designer",
    "domain": "designer.microsoft.com",
    "category": "design-creative",
    "tagline": "AI canvas app for social media cards, invitations, and banners",
    "pricing_model": "Free",
    "short_description": "Generates professional social posts, invitations, and design layouts powered by DALL-E and Microsoft design engine."
  },
  {
    "name": "Let's Enhance",
    "domain": "letsenhance.io",
    "category": "design-creative",
    "tagline": "Automated AI image upscale and quality enhancement software",
    "pricing_model": "Freemium",
    "short_description": "Fixes pixelation, increases image resolution up to 16x, and adjusts color tones for web display and high-res print."
  },
  {
    "name": "Uncrop by Stability",
    "domain": "clipdrop.co",
    "category": "design-creative",
    "tagline": "AI aspect ratio aspect expander and outpainting tool",
    "pricing_model": "Freemium",
    "short_description": "Expands photo boundaries to convert square shots into landscape or portrait layouts without stretching content."
  },
  {
    "name": "Replicate Image Tools",
    "domain": "replicate.com",
    "category": "design-creative",
    "tagline": "Cloud platform hosting specialized image generation and face restoration AI",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Developer platform hosting open-source image tools for background removal, face restoration, and photo styling."
  },
  {
    "name": "Deep Art Effects",
    "domain": "deeparteffects.com",
    "category": "design-creative",
    "tagline": "AI neural style transfer app for photos and videos",
    "pricing_model": "Freemium",
    "short_description": "Applies classical artwork style techniques to photographs and video frames automatically using neural networks."
  },
  {
    "name": "Magic Studio",
    "domain": "magicstudio.com",
    "category": "design-creative",
    "tagline": "Intuitive AI photo editor for erasing objects and updating photos",
    "pricing_model": "Freemium",
    "short_description": "Suite of photo tools for erasing unwanted visual clutter, generating backgrounds, and creating profile avatars."
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
      category: tool.category || "design-creative",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(1900 + Math.random() * 11000),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Free' ? '100% Free' : 'Paid Trial'),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium' || tool.pricing_model === 'Free',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('flux') || tool.name.toLowerCase().includes('civitai'),
      features: [
        "AI Image Generation",
        "Vector & SVG Export",
        "Canvas Editing",
        "High-Res Upscaling"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Design tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Design tools into src/data/saasData.jsx!`);
}

main().catch(console.error);

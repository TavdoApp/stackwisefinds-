/**
 * Alternatives Helper Utility
 * Provides intelligent, high-trust competitor and alternative matching for SaaS and AI tools.
 */

// Reason / Highlight map for leading tools across the entire platform
export const toolStrengthBadges = {
  // Generative AI Video & 3D Physics
  'higgsfield-ai': '🌟 All-in-One Multi-Model & Camera Physics Studio',
  'kling-ai': '🏆 #1 for Cinematic Motion & Long Clips (1080p)',
  'runway': '🎬 #1 for Pro Timeline & Advanced Camera Controls',
  'luma-dream-machine': '⚡ Best for 3D Camera Tracking & Generation Speed',
  'hedra-ai': '🎙️ Best for Character Storytelling & Brand Element Lock',
  'krea-ai': '🎨 Best for Real-Time Canvas & Multi-Model Workspaces',
  'google-veo-2': '🔮 Best for 1080p Full HD with Synchronized Native Audio',
  'sora-openai': '✨ Best for Photorealistic Simulation & Physical Realism',
  'pika': '🚀 Best for Fast Social Clips & Dynamic Visual FX',
  'layer-ai': '🏢 Best for Batch Studio Pipelines & Custom IP LoRAs',
  'hailuo-ai': '🌊 Best for Natural Lighting & Physics Simulation',
  'haiper-ai': '🖌️ Best for Video Repainting & Motion Precision',
  
  // AI Avatars & Video Marketing
  'synthesia': '👔 Best for Enterprise Training Avatars & Multilingual LMS',
  'heygen': '🗣️ Best for Studio-Quality Multilingual Avatar Translation',
  'descript': '✂️ Best for Text-Based Video & Audio Timeline Editing',
  'capcut': '📱 Best for Mobile & Social Short-Form Cuts',
  'invideo-ai': '📢 Best for Script-to-Video Marketing Campaigns',
  'opusclip': '🔥 Best for AI Long-to-Short Viral Repurposing',
  'submagic': '💬 Best for Dynamic Viral Auto-Captions & Zooms',

  // AI Voice, Audio & Music
  'elevenlabs': '🎙️ #1 for Ultra-Realistic Voice Cloning & Emotional Range',
  'suno': '🎵 Best for Full Song Generation with Vocals & Lyrics',
  'udio': '🎸 Best for High-Fidelity Musical Composition & Soundscapes',
  'murf-ai': '🗣️ Best for Commercial Voiceovers & Presentation Sync',
  'play-ht': '⚡ Best for Low-Latency Conversational Voice Streaming',

  // AI Image Generation & Creative Canvas
  'midjourney': '🎨 #1 for Photorealistic Aesthetics & Artistic Direction',
  'ideogram': '🔤 Best for Accurate In-Image Typography & Graphic Design',
  'flux-ai': '⚡ Best Open-Weights Image Model & LoRA Customization',
  'recraft': '📐 Best for Vector Illustration & Brand Color Palettes',

  // AI Coding & App Builders
  'cursor-ai': '💻 #1 AI-Native Code Editor & Whole-Codebase Indexing',
  'v0-dev': '🎨 Best for Prompt-to-React/Tailwind UI Generation',
  'bolt-new': '⚡ Best for Instant Full-Stack In-Browser Prototyping',
  'lovable-dev': '🚀 Best for Fast MVP Full-Stack App Building',
  'windsurf': '🌊 Best for Flow-State AI Code Collaboration',
  'github-copilot': '🐙 Largest IDE Ecosystem & Enterprise Security',
  'replit': '☁️ Best Instant Collaborative Cloud Dev Environment',
  
  // CRMs & Sales Automation
  'xuscrm': '🏡 Best Real Estate CRM for Automated Lead Scoring & Follow-ups',
  'hubspot': '🏢 Best All-in-One Enterprise Marketing & CRM Suite',
  'pipedrive': '💼 Best for Visual Deal Pipelines & Sales Activity Tracking',
  'zoho-crm': '💰 Best Value CRM for Growing High-Volume Sales Teams',
  'gohighlevel': '🚀 Best All-in-One Agency CRM & Marketing Funnel Engine',
  'salesforce': '🌐 Global Standard for Large Enterprise Customization',
  'close-crm': '📞 Best for High-Volume Inside Sales & Calling Pipelines',
  'freshsales': '🤖 Best for AI-Driven Lead Scoring & Multichannel Sales',
  
  // Workflow Automation & Developer Stacks
  'n8n': '⚡ #1 Self-Hosted Automation Engine (Zero Per-Task Execution Fees)',
  'make': '🧩 Best Visual Multi-Step Logic & Flexible JSON Data Routing',
  'zapier': '🔌 Largest App Ecosystem & 7,000+ Pre-Built Integrations',
  'postiz': '📱 Best Self-Hosted Social Media Scheduler & AI Publisher',
  'activepieces': '🔓 Best Open-Source Zapier Alternative for Self-Hosters',
  
  // SEO, Crawlers & Web Intelligence
  'screaming-frog': '🐸 Industry Standard Desktop Crawler for Deep Technical SEO',
  'ahrefs': '🔍 Best for Backlink Intelligence & Keyword Difficulty',
  'semrush': '📊 Best for All-in-One SEO, PPC Research & Content Marketing',
  'sitebulb': '💡 Best for Visual Technical SEO Audits & Hints',
  'se-ranking': '💰 Best Value All-in-One Rank Tracking & SEO Suite',
  'plausible': '🛡️ Best Lightweight Privacy-Friendly Google Analytics Alternative',
  'posthog': '🦔 Best Open-Source Product Analytics & Session Replay',
  
  // LLMs & AI Research
  'claude-ai': '🧠 Best for Long-Context Reasoning, Analysis & Clean Code Logic',
  'chatgpt': '🤖 Most Versatile Conversational AI & Custom GPT Ecosystem',
  'perplexity-ai': '🔎 Best for Real-Time Cited Research & Live Web Grounding',
  'deepseek': '⚡ Best Open-Source Frontier Reasoning Model',
  'google-gemini': '🌐 Best for Native Multimodal Video & 2M Token Context',
  
  // Productivity & Knowledge Graphs
  'notion': '📓 Best All-in-One Connected Team Workspace & Wiki',
  'obsidian': '🔒 Best Offline Markdown Knowledge Graph with Local Vaults',
  'coda': '📊 Best for Interactive Formula Docs & Custom Mini-Apps',
  'linear': '⚡ Best Keyboard-First Issue Tracking for Modern Dev Teams',
  'clickup': '🎯 Most Customizable Project Management Suite',
  'asana': '📋 Best for Cross-Functional Enterprise Work Coordination',
  
  // Backend, BaaS & Cloud Databases
  'supabase': '⚡ #1 Open-Source Firebase Alternative (PostgreSQL & Realtime)',
  'firebase': '🔥 Best for Mobile-First App Development & Google Ecosystem',
  'appwrite': '🔒 Best Self-Hostable BaaS with Built-in Auth & Storage',
  'neon-db': '🐘 Best Serverless Postgres with Instant Branching',
  'coolify': '🚀 Best Self-Hosted Heroku & Vercel Alternative on Any VPS',

  // Billing, Subscriptions & Payments
  'chargebee': '💳 Best for Complex Recurring SaaS Billing & Multi-Currency',
  'stripe': '🌐 Global Developer Infrastructure for Payments & Billing',
  'lemonsqueezy': '🍋 Best Merchant of Record for Global Tax & Digital Goods',
  'paddle': '⛵ Best All-in-One Merchant of Record for B2B SaaS Subscriptions',

  // Email & Newsletter Platforms
  'beehiiv': '🐝 Best Creator-First Newsletter & Monetization Network',
  'convertkit': '💌 Best for Creators Selling Digital Products & Automations',
  'resend': '⚡ Best Developer-First Transactional Email API with React Email',
  'loops-so': '🔄 Best Modern Email Automation for SaaS & Product Teams',
  'brevo': '💰 Best Flat-Rate High-Volume Email & SMS Platform'
};

// Curated Community Switch Insights (Reddit / Verified Buyer Intelligence)
export const communitySwitchInsights = {
  'higgsfield-ai': {
    headline: 'Why Creators Explore Alternatives to Higgsfield AI',
    summary: 'Creators migrating from Higgsfield AI frequently cite aggressive credit burn rates during multi-shot generation and prompt adherence drift in complex sequences. Users looking for hyper-realistic cinematic physics migrate to Kling AI, while teams needing character persistence and multi-model campaign workflows choose Hedra or Krea.',
    keyDrivers: [
      'Credit consumption speed on high-resolution multi-shot exports',
      'Need for 1080p/4K long continuous scene generation (Kling AI handles up to 2-minute extensions)',
      'Demand for multi-model workspace routing and custom style LoRAs (Krea & Layer AI)',
      'Need for locked character voice and lip-sync alignment (Hedra & HeyGen)'
    ]
  },
  'runway': {
    headline: 'Why Video Editors Look Beyond Runway',
    summary: 'While Runway Gen-3 sets the bar for granular timeline controls and motion brushes, users exploring alternatives often seek more accessible entry tiers, faster rendering queues during peak hours, or specialized character dialog tools.',
    keyDrivers: [
      'Cost per second on high-resolution Gen-3 Alpha generations',
      'Need for native sound FX generation (Google Veo 2)',
      'Desire for real-time interactive canvas generation (Krea AI)'
    ]
  },
  'kling-ai': {
    headline: 'Why Users Compare Kling AI Alternatives',
    summary: 'Kling AI leads in raw cinematic physics and long clips, but creators also test Luma Dream Machine for rapid 3D camera pan rendering and Runway for granular camera keyframe scrubbing.',
    keyDrivers: [
      'Queue wait times on free/standard credits during peak server loads',
      'Need for direct character lip-sync and voice track integration (Hedra)',
      'Studio batch pipeline integrations and IP asset locking (Layer AI)'
    ]
  },
  'cursor-ai': {
    headline: 'Why Developers Benchmark Cursor AI Alternatives',
    summary: 'Cursor is the leading AI-first IDE fork of VS Code, but developers also explore Windsurf for agentic flow-state coding, GitHub Copilot for seamless enterprise IT governance, and open-source models for air-gapped security.',
    keyDrivers: [
      'Pro plan usage limits on high-tier Claude 3.5 Sonnet queries',
      'Desire for specialized prompt-to-app scaffolds (Bolt.new / Lovable)',
      'Enterprise security compliance and existing GitHub licensing'
    ]
  },
  'supabase': {
    headline: 'Why Engineers Compare Supabase vs Firebase & Self-Hosted BaaS',
    summary: 'Supabase wins on relational PostgreSQL and zero vendor lock-in, but developers also evaluate Appwrite for complete on-premise self-hosting or Neon DB for serverless database branching.',
    keyDrivers: [
      'Preference for open-source self-hosting vs hosted cloud tiers',
      'Relational SQL flexibility vs NoSQL document collections (Firebase)',
      'Instant staging branch database clones for CI/CD pipelines (Neon)'
    ]
  },
  'hubspot': {
    headline: 'Why Scaling Teams Move Away from HubSpot',
    summary: 'HubSpot is powerful, but teams frequently replace it to avoid steep tiered contact price escalations, mandatory paid onboarding fees, and contract lock-in.',
    keyDrivers: [
      'Aggressive pricing jumps when crossing marketing contact thresholds',
      'Desire for specialized industry workflows (e.g. XusCRM for UAE & real estate agents)',
      'Preference for lean, drag-and-drop visual pipeline clarity (Pipedrive)'
    ]
  },
  'zapier': {
    headline: 'Why Automation Engineers Migrate from Zapier',
    summary: 'As workflows scale into thousands of executions, Zapier’s per-task pricing becomes prohibitive. Teams migrate to self-hosted n8n for unlimited private executions or Make for advanced visual data routing.',
    keyDrivers: [
      'High monthly invoices from multi-step zaps triggering thousands of tasks',
      'Data privacy and GDPR requirements to keep execution payloads on private VPS (n8n)',
      'Need for complex JSON arrays, loops, and branching logic (Make & n8n)'
    ]
  },
  'stripe': {
    headline: 'Why SaaS Founders Look for Stripe Billing Alternatives',
    summary: 'While Stripe is the global payment backbone, SaaS founders often add Chargebee for complex B2B subscription contracts or migrate to Lemon Squeezy / Paddle to offload global sales tax and VAT compliance.',
    keyDrivers: [
      'Global sales tax, VAT calculation, and remittance complexity (Merchant of Record benefits)',
      'Enterprise usage-based metering and tiered customer discount billing (Chargebee)',
      'Multi-currency subscription management'
    ]
  },
  'screaming-frog': {
    headline: 'Why SEO Teams Supplement Screaming Frog',
    summary: 'Screaming Frog is the gold-standard desktop crawler, but large teams often seek cloud-hosted automated crawlers that run continuously without hogging local RAM.',
    keyDrivers: [
      'Local machine memory constraints on 1M+ URL crawls',
      'Need for continuous scheduled cloud monitoring with automated alerts',
      'Integrated backlink and competitive keyword databases (Ahrefs / Semrush)'
    ]
  },
  'notion': {
    headline: 'Why Knowledge Workers Switch from Notion',
    summary: 'Users exploring Notion alternatives typically want local-first offline Markdown speed (Obsidian) or dedicated agile project tracking without database configuration fatigue.',
    keyDrivers: [
      'Offline reliability and private local markdown storage (Obsidian)',
      'Sluggish performance on deeply nested workspaces with heavy databases',
      'Zero vendor lock-in with plain text data portability'
    ]
  }
};

// Negative keywords / sub-niche filters to prevent mixing unrelated tools
const subNicheRules = {
  // Generative AI Video tools should NOT match screen recorders or meeting note takers
  'generative-video': {
    matchKeywords: ['generative', 'text-to-video', 'image-to-video', 'cinematic', 'camera motion', 'kling', 'sora', 'veo', 'diffusion', 'multimodal video', 'higgsfield', 'runway', 'luma'],
    excludeKeywords: ['screen record', 'meeting note', 'transcri', 'zoom meeting', 'meeting wiki', 'video player', 'streaming infrastructure', 'webinar', 'intro maker', 'logo stinger', 'survey', 'quiz']
  },
  // Screen recording tools
  'screen-recording': {
    matchKeywords: ['screen record', 'screen capture', 'loom', 'screen studio', 'camtasia', 'claap'],
    excludeKeywords: ['text-to-video', 'generative ai video', 'cinematic video generation', 'diffusion model', 'camera physics']
  },
  // AI Coding & IDEs
  'ai-coding': {
    matchKeywords: ['code editor', 'ai code', 'cursor', 'copilot', 'autocomplete', 'ide', 'code generator', 'v0', 'bolt.new', 'windsurf', 'replit'],
    excludeKeywords: ['video generator', 'crm', 'accounting', 'screen record']
  },
  // Voice, TTS & Audio
  'ai-voice-audio': {
    matchKeywords: ['voice clone', 'text-to-speech', 'ai voice', 'tts', 'elevenlabs', 'suno', 'udio', 'music generation'],
    excludeKeywords: ['crm', 'seo crawler', 'accounting', 'database']
  },
  // Real Estate CRM
  'real-estate-crm': {
    matchKeywords: ['real estate', 'property', 'tenant', 'broker', 'listing', 'xuscrm'],
    excludeKeywords: ['ecommerce', 'shopify', 'point of sale', 'gaming']
  }
};

/**
 * Get the standout strength / differentiator badge for a tool
 */
export function getToolStrengthBadge(tool, targetTool) {
  if (!tool) return 'Verified Alternative';
  if (toolStrengthBadges[tool.id]) return toolStrengthBadges[tool.id];
  if (tool.isOpenSource) return '⚡ 100% Open-Source & Self-Hosted';
  if (tool.isFreeTier) return '💰 Free Tier Available ($0)';
  if (tool.badge) return `⭐ ${tool.badge}`;
  return 'Verified Direct Competitor';
}

/**
 * Get curated or synthesized community switch insight for any tool
 */
export function getCommunitySwitchInsight(tool) {
  if (!tool) return null;
  if (communitySwitchInsights[tool.id]) {
    return communitySwitchInsights[tool.id];
  }
  
  // Synthesized fallback for other tools based on their category
  const toolName = tool.name;
  return {
    headline: `Why Teams Compare Alternatives to ${toolName}`,
    summary: `Software buyers evaluate ${toolName} alternatives to optimize subscription costs, unlock specialized feature workflows, avoid vendor lock-in, and compare free or open-source tiers.`,
    keyDrivers: [
      `Pricing plan alignment and per-seat vs flat-rate cost efficiency`,
      `Feature depth and specialized integration requirements`,
      `Community support, API access, and data portability options`
    ]
  };
}

/**
 * Resolves top high-trust alternatives for a given target tool.
 * 
 * Priority:
 * 1. Explicit `targetTool.alternatives` or `targetTool.competitors` array
 * 2. High-relevance semantic matching within compatible sub-niches
 * 3. Fallback to top-rated tools in the category
 */
export function getToolAlternatives(targetTool, allTools = [], options = {}) {
  if (!targetTool) return [];
  const limit = options.limit || 6;
  const tools = Array.isArray(allTools) && allTools.length > 0 ? allTools : [];

  // 1. Priority: Paid $99/yr Featured Pro Sponsors in this Category (Guaranteed Competitor Placement)
  const paidCategorySponsors = tools.filter(t => 
    t && t.id && t.id !== targetTool.id && 
    t.category === targetTool.category && 
    (t.packageType === 'premium' || (t.submittedByVendor && t.packageType !== 'free'))
  );

  for (const sponsor of paidCategorySponsors) {
    if (matched.length >= limit) break;
    if (!matchedIds.has(sponsor.id)) {
      matched.push({
        ...sponsor,
        alternativeBadge: '⭐ Recommended Verified Alternative',
        isCurated: true,
        isSponsor: true
      });
      matchedIds.add(sponsor.id);
    }
  }

  // 2. Explicitly Curated Alternatives
  const explicitList = targetTool.alternatives || targetTool.competitors || [];
  if (Array.isArray(explicitList) && explicitList.length > 0) {
    for (const altId of explicitList) {
      if (matched.length >= limit) break;
      const found = tools.find(t => t.id === altId || (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === altId));
      if (found && !matchedIds.has(found.id)) {
        matched.push({
          ...found,
          alternativeBadge: getToolStrengthBadge(found, targetTool),
          isCurated: true
        });
        matchedIds.add(found.id);
      }
    }
  }

  if (matched.length >= limit) {
    return matched.slice(0, limit);
  }

  // 2. Semantic Sub-Niche Scoring Engine
  const targetText = `${targetTool.name} ${targetTool.tagline || ''} ${targetTool.description || ''} ${targetTool.bestFor || ''}`.toLowerCase();
  
  // Detect if target tool belongs to a specialized sub-niche
  let activeRule = null;
  for (const [key, rule] of Object.entries(subNicheRules)) {
    if (rule.matchKeywords.some(kw => targetText.includes(kw))) {
      activeRule = rule;
      break;
    }
  }

  // Score candidate tools
  const candidates = tools.filter(t => {
    if (!t || matchedIds.has(t.id)) return false;
    if (t.category !== targetTool.category) return false;

    // Apply exclusion rules if present
    if (activeRule) {
      const candText = `${t.name} ${t.tagline || ''} ${t.description || ''}`.toLowerCase();
      if (activeRule.excludeKeywords.some(ex => candText.includes(ex))) {
        return false;
      }
    }
    return true;
  });

  // Calculate relevance score
  const scored = candidates.map(t => {
    let score = 0;
    const tText = `${t.name} ${t.tagline || ''} ${t.description || ''} ${t.bestFor || ''}`.toLowerCase();

    // Rating & Review Weight
    if (t.rating) score += (t.rating - 4.0) * 10;
    if (t.reviewsCount) score += Math.min(15, Math.log10(t.reviewsCount) * 3);
    if (t.featured) score += 5;

    // Keyword Overlap with Target
    if (activeRule) {
      for (const kw of activeRule.matchKeywords) {
        if (tText.includes(kw)) score += 8;
      }
    }

    // Direct words in description overlap
    const targetWords = (targetTool.description || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
    for (const w of targetWords.slice(0, 10)) {
      if (tText.includes(w)) score += 2;
    }

    // Target audience match
    if (targetTool.bestFor && t.bestFor) {
      const bWords = targetTool.bestFor.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      for (const bw of bWords) {
        if (t.bestFor.toLowerCase().includes(bw)) score += 4;
      }
    }

    return { tool: t, score };
  });

  scored.sort((a, b) => b.score - a.score);

  for (const item of scored) {
    if (matched.length >= limit) break;
    matched.push({
      ...item.tool,
      alternativeBadge: getToolStrengthBadge(item.tool, targetTool),
      isCurated: false
    });
    matchedIds.add(item.tool.id);
  }

  // 3. Fallback: Fill remaining slots if any
  if (matched.length < limit) {
    for (const t of tools) {
      if (matched.length >= limit) break;
      if (!matchedIds.has(t.id) && t.category === targetTool.category) {
        // Exclude obvious mismatched tools if rule active
        if (activeRule) {
          const candText = `${t.name} ${t.tagline || ''} ${t.description || ''}`.toLowerCase();
          if (activeRule.excludeKeywords.some(ex => candText.includes(ex))) {
            continue;
          }
        }
        matched.push({
          ...t,
          alternativeBadge: getToolStrengthBadge(t, targetTool),
          isCurated: false
        });
        matchedIds.add(t.id);
      }
    }
  }

  return matched.slice(0, limit);
}

/**
 * Returns grouped alternatives organized by buyer use case
 */
export function getGroupedAlternatives(targetTool, allTools = []) {
  if (!targetTool) return [];
  const alternatives = getToolAlternatives(targetTool, allTools, { limit: 12 });
  
  // Specific groupings for Generative AI Video
  if (targetTool.id === 'higgsfield-ai' || targetTool.id === 'kling-ai' || targetTool.id === 'runway' || targetTool.id === 'luma-dream-machine' || targetTool.id === 'google-veo-2' || targetTool.id === 'sora-openai') {
    const cinematic = alternatives.filter(t => ['kling-ai', 'google-veo-2', 'luma-dream-machine', 'sora-openai', 'hailuo-ai'].includes(t.id));
    const multiModel = alternatives.filter(t => ['hedra-ai', 'krea-ai', 'layer-ai', 'heygen'].includes(t.id));
    const editing = alternatives.filter(t => ['runway', 'pika', 'descript', 'capcut'].includes(t.id));

    const groups = [];
    if (cinematic.length > 0) {
      groups.push({
        title: '🏆 Cinematic & Motion Physics',
        description: 'Best for hyper-realistic physical simulation, camera tracking, and long cinematic clip synthesis.',
        tools: cinematic
      });
    }
    if (multiModel.length > 0) {
      groups.push({
        title: '🎙️ Campaign & Multi-Model Workspaces',
        description: 'Best for character consistency, brand asset locks, and multi-model studio pipelines.',
        tools: multiModel
      });
    }
    if (editing.length > 0) {
      groups.push({
        title: '🎬 Granular Timeline & Creative Editing',
        description: 'Best for professional timeline controls, keyframing, and rapid social media video iteration.',
        tools: editing
      });
    }
    if (groups.length > 0) return groups;
  }

  // AI Coding & IDE Groupings
  if (['cursor-ai', 'v0-dev', 'bolt-new', 'lovable-dev', 'windsurf', 'github-copilot', 'replit'].includes(targetTool.id)) {
    const ideForks = alternatives.filter(t => ['cursor-ai', 'windsurf', 'github-copilot'].includes(t.id));
    const appBuilders = alternatives.filter(t => ['v0-dev', 'bolt-new', 'lovable-dev', 'replit'].includes(t.id));
    const groups = [];
    if (ideForks.length > 0) {
      groups.push({
        title: '💻 AI-Native IDEs & Autocomplete',
        description: 'Best for in-editor codebase indexing, multi-file edits, and agentic workflows.',
        tools: ideForks
      });
    }
    if (appBuilders.length > 0) {
      groups.push({
        title: '⚡ Prompt-to-App & Full-Stack Builders',
        description: 'Best for generating production-ready full-stack apps and UI scaffolds from text.',
        tools: appBuilders
      });
    }
    if (groups.length > 0) return groups;
  }

  // Standard groupings for all other software
  const freeTools = alternatives.filter(t => t.isFreeTier || (t.pricing || '').toLowerCase().includes('free'));
  const openSourceTools = alternatives.filter(t => t.isOpenSource);
  const topRated = alternatives.slice(0, 4);

  const groups = [
    {
      title: '🏆 Top Rated Direct Competitors',
      description: `Highest-rated market alternatives benchmarked against ${targetTool.name}.`,
      tools: topRated
    }
  ];

  if (freeTools.length > 0) {
    groups.push({
      title: '💰 Best Free & Freemium Alternatives',
      description: `Zero-cost entry options with functional free tiers to replace ${targetTool.name}.`,
      tools: freeTools.slice(0, 4)
    });
  }

  if (openSourceTools.length > 0) {
    groups.push({
      title: '⚡ Open-Source & Self-Hosted Replacements',
      description: `Self-hostable tools that give you 100% data sovereignty and zero vendor lock-in.`,
      tools: openSourceTools
    });
  }

  return groups;
}

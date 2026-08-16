/**
 * Alternatives Helper Utility
 * Provides intelligent, high-trust competitor and alternative matching for SaaS and AI tools.
 */

// Reason / Highlight map for leading tools
const toolStrengthBadges = {
  'kling-ai': '🏆 #1 for Cinematic Motion & Long Clips',
  'runway': '🎬 #1 for Pro Timeline & Camera Controls',
  'luma-dream-machine': '⚡ Best for 3D Camera Tracking & Speed',
  'hedra-ai': '🎙️ Best for Character Avatars & Lip Sync',
  'krea-ai': '🎨 Best for Real-Time Canvas & Multi-Model',
  'google-veo-2': '🔮 Best for 1080p HD with Native Audio',
  'sora-openai': '✨ Best for Photorealistic Simulation',
  'pika': '🚀 Best for Fast Social Clips & Visual FX',
  'layer-ai': '🏢 Best for Batch Studio & Custom IP LoRA',
  'hailuo-ai': '🌊 Best for Physics & Natural Lighting',
  'haiper-ai': '🖌️ Best for Video Repainting & Motion',
  'synthesia': '👔 Best for Enterprise Training Avatars',
  'heygen': '🗣️ Best for Multilingual Avatar Translation',
  'descript': '✂️ Best for Text-Based Video & Audio Editing',
  'capcut': '📱 Best for Mobile & Social Short-Form Cuts',
  'invideo-ai': '📢 Best for Text-to-Script Video Marketing',
  'opusclip': '🔥 Best for AI Long-to-Short Repurposing',
  'submagic': '💬 Best for Dynamic Viral Auto-Captions',
  'xuscrm': '🏡 Best Real Estate CRM for Automated Leads',
  'hubspot': '🏢 Best All-in-One Enterprise CRM',
  'pipedrive': '💼 Best for Visual Deal Pipelines',
  'zoho-crm': '💰 Best Value for Growing Sales Teams',
  'n8n': '⚡ Best Self-Hosted Automation Engine',
  'make': '🧩 Best Visual Multi-Step Integrations',
  'zapier': '🔌 Largest App Ecosystem & Connectors',
  'screaming-frog': '🐸 Industry Standard Desktop Crawler',
  'ahrefs': '🔍 Best for Backlink Analysis & Keywords',
  'semrush': '📊 Best for All-in-One SEO & PPC Insights',
  'claude-ai': '🧠 Best for Nuanced Writing & Code Logic',
  'chatgpt': '🤖 Most Versatile Conversational AI',
  'perplexity-ai': '🔎 Best for Real-Time Cited Research',
  'notion': '📓 Best All-in-One Connected Workspace',
  'obsidian': '🔒 Best Offline Markdown Knowledge Graph',
  'chargebee': '💳 Best for Complex Recurring Billing',
  'stripe': '🌐 Global Standard for Developer Payments'
};

// Negative keywords / sub-niche filters to prevent mixing unrelated tools
const subNicheRules = {
  // Generative AI Video tools should NOT match screen recorders or meeting note takers
  'generative-video': {
    matchKeywords: ['generative', 'text-to-video', 'image-to-video', 'cinematic', 'camera motion', 'kling', 'sora', 'veo', 'diffusion', 'multimodal video'],
    excludeKeywords: ['screen record', 'meeting note', 'transcri', 'zoom meeting', 'meeting wiki', 'video player', 'streaming infrastructure', 'webinar']
  },
  // Screen recording tools
  'screen-recording': {
    matchKeywords: ['screen record', 'screen capture', 'loom', 'screen studio', 'camtasia'],
    excludeKeywords: ['text-to-video', 'generative ai video', 'cinematic video generation', 'diffusion model']
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

  const matched = [];
  const matchedIds = new Set([targetTool.id]);

  // 1. Explicitly Curated Alternatives
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

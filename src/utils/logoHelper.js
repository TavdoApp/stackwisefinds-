/**
 * High-Reliability Logo & Favicon Resolver
 * Guarantees crisp high-resolution logos across all tools with zero broken images.
 */

const HIGH_RES_LOGOS = {
  'openai.com': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'chatgpt.com': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'anthropic.com': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
  'claude.ai': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
  'google.com': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
  'gemini.google.com': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
  'notion.so': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
  'canva.com': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  'figma.com': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  'github.com': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  'appsumo.com': 'https://www.google.com/s2/favicons?domain=appsumo.com&sz=128',
  'pitchground.com': 'https://www.google.com/s2/favicons?domain=pitchground.com&sz=128',
  'stacksocial.com': 'https://www.google.com/s2/favicons?domain=stacksocial.com&sz=128',
  'dealmirror.com': 'https://www.google.com/s2/favicons?domain=dealmirror.com&sz=128'
};

export function extractDomain(input) {
  if (!input) return 'software.com';

  let raw = '';
  if (typeof input === 'string') {
    raw = input;
  } else if (typeof input === 'object') {
    raw = input.domain || input.website || input.websiteUrl || input.affiliateUrl || '';
  }

  if (!raw) return 'software.com';

  try {
    let cleaned = raw.trim();
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned;
    }
    const urlObj = new URL(cleaned);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'software.com';
  }
}

export function getLogoUrl(tool, attempt = 0) {
  const domain = extractDomain(tool);

  // High-Res Wikipedia SVG override
  if (attempt === 0 && HIGH_RES_LOGOS[domain]) {
    return HIGH_RES_LOGOS[domain];
  }

  // Attempt 0: Google Favicon API sz=128 (Industry Standard)
  if (attempt === 0) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  // Attempt 1: DuckDuckGo Favicon Engine
  if (attempt === 1) {
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  }

  // Attempt 2: Unpkg / IconHorse API
  if (attempt === 2) {
    return `https://icon.horse/icon/${domain}`;
  }

  return null;
}

export function getFallbackInitials(toolName) {
  if (!toolName) return 'ST';
  const clean = toolName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
}

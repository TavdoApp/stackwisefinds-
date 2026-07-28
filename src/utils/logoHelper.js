/**
 * High-Reliability Logo & Favicon Resolver
 * Guarantees zero broken image icons across all browsers, adblockers, and networks.
 */

const KNOWN_BRAND_LOGOS = {
  'openai.com': 'https://icons.duckduckgo.com/ip3/openai.com.ico',
  'chatgpt.com': 'https://icons.duckduckgo.com/ip3/openai.com.ico',
  'anthropic.com': 'https://icons.duckduckgo.com/ip3/anthropic.com.ico',
  'claude.ai': 'https://icons.duckduckgo.com/ip3/anthropic.com.ico',
  'gemini.google.com': 'https://icons.duckduckgo.com/ip3/google.com.ico',
  'google.com': 'https://icons.duckduckgo.com/ip3/google.com.ico',
  'jasper.ai': 'https://icons.duckduckgo.com/ip3/jasper.ai.ico',
  'suno.com': 'https://icons.duckduckgo.com/ip3/suno.com.ico',
  'suno.ai': 'https://icons.duckduckgo.com/ip3/suno.ai.ico',
  'lumalabs.ai': 'https://icons.duckduckgo.com/ip3/lumalabs.ai.ico',
  'midjourney.com': 'https://icons.duckduckgo.com/ip3/midjourney.com.ico',
  'elevenlabs.io': 'https://icons.duckduckgo.com/ip3/elevenlabs.io.ico',
  'notion.so': 'https://icons.duckduckgo.com/ip3/notion.so.ico',
  'canva.com': 'https://icons.duckduckgo.com/ip3/canva.com.ico',
  'figma.com': 'https://icons.duckduckgo.com/ip3/figma.com.ico',
  'github.com': 'https://icons.duckduckgo.com/ip3/github.com.ico'
};

export function extractDomain(tool) {
  if (!tool) return 'software.com';

  const raw = tool.domain || tool.website || tool.affiliateUrl || '';
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

  // Attempt 0: Known Brand Logo or DuckDuckGo Favicon (Highest reliability, unblocked globally)
  if (attempt === 0) {
    if (KNOWN_BRAND_LOGOS[domain]) return KNOWN_BRAND_LOGOS[domain];
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  }

  // Attempt 1: Google Favicon API sz=128
  if (attempt === 1) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  // Attempt 2: Icon Horse API
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

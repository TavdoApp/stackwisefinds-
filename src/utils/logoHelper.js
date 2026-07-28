/**
 * Robust Logo & Favicon Domain Resolver Helper
 * Ensures tool logos render reliably across all network environments without breaking.
 */

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

export function getPrimaryFaviconUrl(tool) {
  const domain = extractDomain(tool);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function getSecondaryLogoUrl(tool) {
  const domain = extractDomain(tool);
  return `https://logo.clearbit.com/${domain}`;
}

export function getFallbackInitials(toolName) {
  if (!toolName) return 'ST';
  const parts = toolName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return toolName.substring(0, 2).toUpperCase();
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Read query params
  const toolSlug = url.searchParams.get('tool') || 'software';
  const rawName = url.searchParams.get('name');
  const rawRating = url.searchParams.get('rating');
  const styleParam = (url.searchParams.get('style') || 'dark').toLowerCase();

  // Format Tool Name and Rating
  const toolName = rawName 
    ? rawName 
    : toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).slice(0, 22);

  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : '4.9';

  // 3 Color Palettes: Light, Neutral, Dark (Product Hunt grade)
  let bgColor1, bgColor2, borderColor, textColor, subtextColor, tagBg, tagText, iconBg, iconColor, starColor;

  if (styleParam === 'light') {
    bgColor1 = '#FFFFFF';
    bgColor2 = '#F8FAFC';
    borderColor = '#E2E8F0';
    textColor = '#0F172A';
    subtextColor = '#64748B';
    tagBg = '#EEF6E2';
    tagText = '#456B17';
    iconBg = '#82A735';
    iconColor = '#FFFFFF';
    starColor = '#EAB308';
  } else if (styleParam === 'neutral') {
    bgColor1 = '#F8FAFC';
    bgColor2 = '#EEF2F6';
    borderColor = '#CBD5E1';
    textColor = '#1E293B';
    subtextColor = '#475569';
    tagBg = '#E2E8F0';
    tagText = '#334155';
    iconBg = '#0F172A';
    iconColor = '#FFFFFF';
    starColor = '#F59E0B';
  } else {
    // Dark (Default)
    bgColor1 = '#141E14';
    bgColor2 = '#0D140D';
    borderColor = '#283C28';
    textColor = '#FFFFFF';
    subtextColor = 'rgba(255,255,255,0.75)';
    tagBg = 'rgba(130,167,53,0.18)';
    tagText = '#82A735';
    iconBg = '#82A735';
    iconColor = '#FFFFFF';
    starColor = '#FACC15';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="66" viewBox="0 0 280 66" fill="none">
  <defs>
    <linearGradient id="badgeBg" x1="0" y1="0" x2="280" y2="66" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bgColor1}"/>
      <stop offset="1" stop-color="${bgColor2}"/>
    </linearGradient>
    <filter id="badgeShadow" x="-2" y="0" width="284" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="1" y="1" width="278" height="64" rx="14" fill="url(#badgeBg)" stroke="${borderColor}" stroke-width="1.5" filter="url(#badgeShadow)"/>

  <!-- Left Icon Emblem Container -->
  <g transform="translate(14, 15)">
    <rect width="36" height="36" rx="10" fill="${iconBg}" />
    <!-- Dynamic StakDock Launch Icon -->
    <path d="M18 7L24 15H20V23H16V15H12L18 7Z" fill="${iconColor}"/>
    <circle cx="18" cy="27" r="1.5" fill="${iconColor}"/>
  </g>

  <!-- Text Hierarchy -->
  <g transform="translate(60, 14)">
    <!-- Verification / Category Tag -->
    <g transform="translate(0, 0)">
      <rect width="96" height="15" rx="4" fill="${tagBg}"/>
      <text x="6" y="11" fill="${tagText}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="800" letter-spacing="0.05em">
        FEATURED ON
      </text>
    </g>

    <!-- Main Software Name -->
    <text x="0" y="30" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="900" letter-spacing="-0.01em">
      ${escapeXml(toolName)}
    </text>

    <!-- Rating & Domain -->
    <text x="0" y="44" fill="${subtextColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600">
      <tspan fill="${starColor}">★</tspan> ${rating} on <tspan fill="${tagText}" font-weight="800">stakdock.com</tspan>
    </text>
  </g>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

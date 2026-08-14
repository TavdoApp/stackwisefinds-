export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Read query params
  const toolSlug = url.searchParams.get('tool') || 'software';
  const rawName = url.searchParams.get('name');
  const rawRating = url.searchParams.get('rating');
  const style = url.searchParams.get('style') || 'dark';

  // Format Tool Name and Rating
  const toolName = rawName 
    ? rawName 
    : toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).slice(0, 24);

  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : '4.9';

  // Color schemes
  const isDark = style !== 'light';
  const bgColor = isDark ? '#141E14' : '#FFFFFF';
  const borderColor = isDark ? '#2C3E2C' : '#E2E8F0';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? 'rgba(255,255,255,0.7)' : '#64748B';
  const accentGreen = '#82A735';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="270" height="64" viewBox="0 0 270 64" fill="none">
  <defs>
    <linearGradient id="badgeGrad" x1="0" y1="0" x2="270" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bgColor}"/>
      <stop offset="1" stop-color="${isDark ? '#1C2B1C' : '#F8FAFC'}"/>
    </linearGradient>
    <filter id="badgeShadow" x="0" y="0" width="270" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Container -->
  <rect width="270" height="64" rx="14" fill="url(#badgeGrad)" stroke="${borderColor}" stroke-width="1.5" filter="url(#badgeShadow)"/>

  <!-- Left Accent Trophy Icon -->
  <g transform="translate(14, 16)">
    <rect width="32" height="32" rx="8" fill="${accentGreen}" fill-opacity="0.15" stroke="${accentGreen}" stroke-width="1"/>
    <path d="M16 8L18.5 13L24 13.8L20 17.7L21 23.2L16 20.6L11 23.2L12 17.7L8 13.8L13.5 13L16 8Z" fill="${accentGreen}"/>
  </g>

  <!-- Text Hierarchy -->
  <g transform="translate(56, 12)">
    <!-- Subtitle / Verification Tag -->
    <text x="0" y="11" fill="${accentGreen}" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="800" letter-spacing="0.06em">
      🏆 TOP RANKED 2026
    </text>

    <!-- Main Software Name -->
    <text x="0" y="27" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800">
      ${escapeXml(toolName)}
    </text>

    <!-- Rating & Domain -->
    <text x="0" y="40" fill="${subtextColor}" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="600">
      ⭐ ${rating}/5.0 on <tspan fill="${accentGreen}" font-weight="800">stakdock.com</tspan>
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

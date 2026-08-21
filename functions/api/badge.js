export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Read query params
  const toolSlug = url.searchParams.get('tool') || 'software';
  const rawRating = url.searchParams.get('rating');
  const styleParam = (url.searchParams.get('style') || 'dark').toLowerCase();

  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : '4.9';

  // 3 Color Palettes: Light, Neutral, Dark (Exact Product Hunt Badge Standard)
  let bgColor1, bgColor2, borderColor, brandColor, tagColor, iconBg, iconColor, rightBg, rightText, arrowColor;

  if (styleParam === 'light') {
    bgColor1 = '#FFFFFF';
    bgColor2 = '#FFFFFF';
    borderColor = '#E2E8F0';
    brandColor = '#0F172A';
    tagColor = '#64748B';
    iconBg = '#82A735';
    iconColor = '#FFFFFF';
    rightBg = '#F8FAFC';
    rightText = '#0F172A';
    arrowColor = '#82A735';
  } else if (styleParam === 'neutral') {
    bgColor1 = '#F1F5F9';
    bgColor2 = '#F8FAFC';
    borderColor = '#CBD5E1';
    brandColor = '#1E293B';
    tagColor = '#64748B';
    iconBg = '#1E293B';
    iconColor = '#FFFFFF';
    rightBg = '#E2E8F0';
    rightText = '#1E293B';
    arrowColor = '#82A735';
  } else {
    // Dark Mode (Default)
    bgColor1 = '#141E14';
    bgColor2 = '#0D140D';
    borderColor = '#283C28';
    brandColor = '#FFFFFF';
    tagColor = '#82A735';
    iconBg = '#82A735';
    iconColor = '#FFFFFF';
    rightBg = 'rgba(130,167,53,0.12)';
    rightText = '#FFFFFF';
    arrowColor = '#82A735';
  }

  // Exact Product Hunt 250x54 standard badge dimension
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="54" viewBox="0 0 250 54" fill="none">
  <defs>
    <linearGradient id="badgeGrad" x1="0" y1="0" x2="250" y2="54" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bgColor1}"/>
      <stop offset="1" stop-color="${bgColor2}"/>
    </linearGradient>
    <filter id="badgeShadow" x="-2" y="0" width="254" height="56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Container Box -->
  <rect x="0.5" y="0.5" width="249" height="53" rx="12" fill="url(#badgeGrad)" stroke="${borderColor}" filter="url(#badgeShadow)"/>

  <!-- Left StakDock Brand Icon (Product Hunt 'P' Style) -->
  <g transform="translate(10, 9)">
    <rect width="36" height="36" rx="9" fill="${iconBg}"/>
    <!-- StakDock 'S' Launch Monogram -->
    <path d="M18 10L24 18H20V25H16V18H12L18 10Z" fill="${iconColor}"/>
    <circle cx="18" cy="27" r="1.2" fill="${iconColor}"/>
  </g>

  <!-- Middle Brand Typography -->
  <g transform="translate(56, 11)">
    <!-- Small Top Label -->
    <text x="0" y="11" fill="${tagColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="800" letter-spacing="0.08em">
      FEATURED ON
    </text>
    <!-- StakDock Main Wordmark -->
    <text x="0" y="27" fill="${brandColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="-0.02em">
      StakDock
    </text>
  </g>

  <!-- Right Upvote / Rating Counter (Product Hunt Style) -->
  <g transform="translate(186, 11)">
    <rect width="54" height="32" rx="8" fill="${rightBg}" stroke="${borderColor}" stroke-width="0.5"/>
    <path d="M21 11L25 16H17L21 11Z" fill="${arrowColor}"/>
    <text x="27" y="22" fill="${rightText}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" text-anchor="middle">
      ${rating}
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

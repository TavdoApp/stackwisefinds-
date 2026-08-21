export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Read query params
  const styleParam = (url.searchParams.get('style') || 'light').toLowerCase();

  // 3 Color Palettes: Light, Neutral, Dark (Exact Toolify Standard 250x60)
  let bgColor, borderColor, brandColor, tagColor, starColor, iconBoxBg, iconStrokeColor, iconPrimary;

  if (styleParam === 'dark') {
    bgColor = '#141E14';
    borderColor = '#283C28';
    brandColor = '#FFFFFF';
    tagColor = '#82A735';
    starColor = '#82A735';
    iconBoxBg = '#1F2E1F';
    iconStrokeColor = '#283C28';
    iconPrimary = '#82A735';
  } else if (styleParam === 'neutral') {
    bgColor = '#F8FAFC';
    borderColor = '#CBD5E1';
    brandColor = '#0F172A';
    tagColor = '#64748B';
    starColor = '#82A735';
    iconBoxBg = '#E2E8F0';
    iconStrokeColor = '#CBD5E1';
    iconPrimary = '#334155';
  } else {
    // Light Mode (Default)
    bgColor = '#FFFFFF';
    borderColor = '#82A735';
    brandColor = '#141E14';
    tagColor = '#82A735';
    starColor = '#82A735';
    iconBoxBg = '#F0F5E5';
    iconStrokeColor = '#E2E6D8';
    iconPrimary = '#82A735';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="60" viewBox="0 0 250 60" fill="none">
  <!-- Card Container -->
  <rect x="0.5" y="0.5" width="249" height="59" rx="8" fill="${bgColor}" stroke="${borderColor}" stroke-width="1.2"/>

  <!-- Left Official Favicon Logo Container -->
  <g transform="translate(14, 12)">
    <rect width="36" height="36" rx="8" fill="${iconBoxBg}" stroke="${iconStrokeColor}" stroke-width="0.8"/>
    <g transform="translate(4, 4) scale(0.0546875)">
      <path d="M256 95L75 178L256 262L437 178L256 95Z" fill="${iconPrimary}"/>
      <path d="M75 255L256 340L437 255" stroke="${iconPrimary}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M75 335L256 420L437 335" stroke="${iconPrimary}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- Middle Brand Typography -->
  <g transform="translate(58, 15)">
    <!-- Small Top Label -->
    <text x="0" y="11" fill="${tagColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="800" letter-spacing="0.06em">
      FEATURED ON
    </text>
    <!-- StakDock Main Wordmark -->
    <text x="0" y="28" fill="${brandColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="-0.02em">
      StakDock<tspan fill="${styleParam === 'neutral' ? '#64748B' : '#82A735'}">.com</tspan>
    </text>
  </g>

  <!-- Right Accent Star -->
  <g transform="translate(214, 20)">
    <path d="M10 0L12.9 6.2L19.7 7.1L14.7 11.9L16 18.6L10 15.3L4 18.6L5.3 11.9L0.3 7.1L7.1 6.2L10 0Z" fill="${starColor}"/>
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

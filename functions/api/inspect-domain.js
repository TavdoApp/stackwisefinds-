/**
 * Cloudflare Edge Function: /api/inspect-domain
 * Crawls and extracts rich metadata (name, tagline, description, category, pricing, starting price, logo)
 * for 1-click vendor submissions and directory listings.
 */

function sanitizeDomain(input) {
  if (!input || typeof input !== 'string') return '';
  let cleaned = input.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const urlObj = new URL(cleaned);
    return {
      fullUrl: urlObj.href,
      hostname: urlObj.hostname.replace(/^www\./, '')
    };
  } catch {
    const host = input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
    return {
      fullUrl: `https://${host}`,
      hostname: host
    };
  }
}

function cleanSoftwareName(title, hostname) {
  if (title) {
    let name = title
      .split(/[-|:•–—]/)[0]
      .replace(/home\s*/i, '')
      .replace(/official\s*site/i, '')
      .replace(/welcome\s*to/i, '')
      .trim();

    if (name.length >= 2 && name.length <= 35) {
      return name;
    }
  }

  const mainPart = hostname.split('.')[0] || 'Software';
  return mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
}

function detectCategory(text) {
  const t = (text || '').toLowerCase();

  if (/crm|sales\s*pipeline|leads|realtor|real\s*estate/i.test(t)) return 'crm';
  if (/seo|keyword|backlink|ranking|serp|screaming\s*frog/i.test(t)) return 'seo-analytics';
  if (/video|vid|reel|avatar|clip|screen\s*record/i.test(t)) return 'trending-video-ai';
  if (/invoice|invoicing|accounting|receipt|tax|bookkeeping/i.test(t)) return 'invoicing';
  if (/email|newsletter|cold\s*email|smtp|inbox/i.test(t)) return 'email-marketing';
  if (/form|survey|poll|quiz|leadgen|capture/i.test(t)) return 'forms-leadgen';
  if (/design|graphic|canvas|banner|photo\s*editor|svg/i.test(t)) return 'design-creative';
  if (/audio|music|voice|podcast|tts|speech/i.test(t)) return 'ai-music-audio';
  if (/code|coding|github|git|developer|api|devops|docker|k8s/i.test(t)) return 'ai-coding-dev';
  if (/meeting|transcribe|notetaker|zoom|transcript/i.test(t)) return 'meeting-ai';
  if (/password|auth|security|cyber|2fa|vault/i.test(t)) return 'security-passwords';
  if (/chat|team|slack|discord|messaging/i.test(t)) return 'collaboration-chat';
  if (/project|task|kanban|sprint|jira|trello/i.test(t)) return 'project-mgmt';
  if (/database|sql|nosql|postgres|redis|mongo/i.test(t)) return 'database-engines';
  if (/nocode|no-code|airtable|zapier|automation|workflow/i.test(t)) return 'nocode-databases';
  if (/open\s*source|self-hosted|github\.com/i.test(t)) return 'open-source-self-hosted';
  if (/ad\s*creative|facebook\s*ads|google\s*ads|ppc/i.test(t)) return 'ad-creative';

  return 'ai-content';
}

function detectPricing(text) {
  const t = (text || '').toLowerCase();
  
  // Look for currency amounts like $9, $19, $29, $49, $99
  const priceMatch = text.match(/\$(\d{1,4})(?:\/mo|\/month|\/user|\/seat)?/i);
  const detectedAmount = priceMatch ? `$${priceMatch[1]}/mo` : '';

  if (/open\s*source|self-hosted|mit\s*license|gpl/i.test(t)) {
    return { model: 'Open-Source', startingPrice: '100% Free (Self-Hosted)', tier: '$' };
  }
  if (/100%\s*free|free\s*forever|always\s*free/i.test(t)) {
    return { model: '100% Free', startingPrice: 'Free Forever ($0)', tier: '$' };
  }
  if (/free\s*trial|14-day\s*trial|start\s*free\s*trial/i.test(t)) {
    return { model: 'Free Trial', startingPrice: detectedAmount ? `Free Trial • ${detectedAmount}` : '14-Day Free Trial', tier: '$$' };
  }
  if (/freemium|free\s*tier\s*available|free\s*plan/i.test(t)) {
    return { model: 'Freemium', startingPrice: detectedAmount ? `Free Tier / ${detectedAmount}` : 'Free Tier Available', tier: '$' };
  }
  if (detectedAmount) {
    const num = parseInt(priceMatch[1], 10);
    const tier = num < 25 ? '$' : num < 75 ? '$$' : '$$$';
    return { model: 'Paid', startingPrice: `From ${detectedAmount}`, tier };
  }

  return { model: 'Freemium', startingPrice: 'Free Tier Available', tier: '$$' };
}

export async function onRequest(context) {
  const { request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let rawDomain = '';

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      rawDomain = body.domain || body.url || '';
    } catch {
      rawDomain = '';
    }
  } else {
    const url = new URL(request.url);
    rawDomain = url.searchParams.get('domain') || url.searchParams.get('url') || '';
  }

  if (!rawDomain) {
    return new Response(JSON.stringify({ error: 'Domain or URL parameter is required' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { fullUrl, hostname } = sanitizeDomain(rawDomain);
  const logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      redirect: 'follow',
      cf: { cacheTtl: 3600 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    const rawTitle = (ogTitleMatch ? ogTitleMatch[1] : titleMatch ? titleMatch[1] : '').trim();
    const softwareName = cleanSoftwareName(rawTitle, hostname);

    // Extract Description / Tagline
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
    const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    
    let description = (ogDescMatch ? ogDescMatch[1] : metaDescMatch ? metaDescMatch[1] : '').trim();
    if (!description || description.length < 10) {
      description = `${softwareName} is an innovative software platform engineered for modern teams and creators.`;
    }

    const tagline = description.length > 110 ? description.slice(0, 107) + '...' : description;

    // Detect Category & Pricing
    const fullTextContext = `${rawTitle} ${description} ${hostname} ${html.slice(0, 15000)}`;
    const category = detectCategory(fullTextContext);
    const pricingInfo = detectPricing(fullTextContext);

    return new Response(JSON.stringify({
      success: true,
      softwareName,
      tagline,
      description,
      category,
      pricing: pricingInfo.model,
      startingPrice: pricingInfo.startingPrice,
      pricingTier: pricingInfo.tier,
      websiteUrl: fullUrl,
      domain: hostname,
      logoUrl
    }), { headers: corsHeaders });

  } catch (err) {
    const fallbackName = cleanSoftwareName('', hostname);
    return new Response(JSON.stringify({
      success: true,
      isFallback: true,
      softwareName: fallbackName,
      tagline: `${fallbackName} is a verified software tool for modern professionals.`,
      description: `${fallbackName} empowers teams with streamlined workflows and productive digital solutions.`,
      category: detectCategory(hostname),
      pricing: 'Freemium',
      startingPrice: 'Free Tier Available',
      pricingTier: '$$',
      websiteUrl: fullUrl,
      domain: hostname,
      logoUrl
    }), { headers: corsHeaders });
  }
}

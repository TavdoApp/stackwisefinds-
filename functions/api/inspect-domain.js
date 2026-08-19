/**
 * Cloudflare Edge Function: /api/inspect-domain
 * Crawls and extracts rich metadata (name, tagline, description, category, pricing, starting price, logo)
 * for 1-click vendor submissions and directory listings.
 */

function sanitizeDomain(input) {
  if (!input || typeof input !== 'string') return { fullUrl: '', hostname: '' };
  let cleaned = input.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const urlObj = new URL(cleaned);
    return {
      fullUrl: urlObj.href,
      hostname: urlObj.hostname.replace(/^www\./, '').toLowerCase()
    };
  } catch {
    const host = input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();
    return {
      fullUrl: `https://${host}`,
      hostname: host
    };
  }
}

function cleanSoftwareName(title, hostname, ogSiteName) {
  const hostRoot = (hostname || '').split('.')[0].toLowerCase();
  const formatBrand = (str) => {
    if (!str) return '';
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  };

  // 1. If og:site_name is present and reasonable length, trust it
  if (ogSiteName && ogSiteName.trim().length >= 2 && ogSiteName.trim().length <= 30) {
    const cleanOg = ogSiteName.trim().replace(/^(the|official)\s+/i, '');
    if (cleanOg.length >= 2) return cleanOg;
  }

  // 2. Parse title tokens
  if (title) {
    const tokens = title
      .split(/[-|:•–—]/)
      .map(t => t.trim())
      .filter(t => t.length >= 2);

    // Look for token that contains or matches the domain root
    for (const token of tokens) {
      const cleanToken = token.replace(/^(the|official|home\s+of|welcome\s+to)\s+/i, '').trim();
      const lowerToken = cleanToken.toLowerCase().replace(/[^a-z0-9]/g, '');
      const lowerRoot = hostRoot.replace(/[^a-z0-9]/g, '');

      if (lowerToken === lowerRoot || lowerToken.includes(lowerRoot) || lowerRoot.includes(lowerToken)) {
        if (cleanToken.length <= 35) {
          return cleanToken;
        }
      }
    }

    // If no token matched domain, take the shortest reasonable token that isn't a long marketing phrase
    const nonSloganTokens = tokens.filter(t => 
      !/^(the\s+#1|best|sell|build|grow|discover|free|welcome|home)/i.test(t) && t.length <= 25
    );
    if (nonSloganTokens.length > 0) {
      return nonSloganTokens[0];
    }
  }

  // 3. Fallback to capitalized domain root
  if (hostRoot && hostRoot.length >= 2) {
    return hostRoot.charAt(0).toUpperCase() + hostRoot.slice(1);
  }

  return 'Software Tool';
}

function detectCategory(text, hostname) {
  const t = (text || '').toLowerCase();
  const host = (hostname || '').toLowerCase();

  // Weighted scoring rules for all SaaS categories
  const categoryRules = [
    {
      id: 'ai-content',
      regex: /\b(ai copywriting|ai writer|content generator|ai text generator|copy\.ai|jasper ai|chatgpt|article writer|prompt engineering|blog writer)\b/gi,
      weight: 10
    },
    {
      id: 'ecommerce-funnels',
      regex: /\b(ecommerce|e-commerce|storefront|online store|sell online|merchants?|shopping cart|shopify|woocommerce|magento|bigcommerce|dropshipping|checkout conversion|order fulfillment|pos system)\b/gi,
      weight: 12
    },
    {
      id: 'crm',
      regex: /\b(crm|sales pipeline|lead management|deal tracking|realtor crm|real estate crm|salesforce|hubspot crm|pipeline management|customer relationship)\b/gi,
      weight: 10
    },
    {
      id: 'invoicing',
      regex: /\b(invoicing|accounting software|bookkeeping|invoices|tax compliance|quickbooks|freshbooks|stripe billing|payroll tax|expense tracking)\b/gi,
      weight: 10
    },
    {
      id: 'seo-analytics',
      regex: /\b(seo software|keyword research|backlink analysis|serp tracking|search console|site audit|ahrefs|semrush|organic traffic|rank tracker)\b/gi,
      weight: 10
    },
    {
      id: 'trending-video-ai',
      regex: /\b(video generator|text to video|ai avatar|video editing|video creation|lip sync|motion graphics|submagic|descript|runway|synthesia|heygen)\b/gi,
      weight: 10
    },
    {
      id: 'ai-coding-dev',
      regex: /\b(code editor|coding assistant|github copilot|developer tools|api gateway|autocomplete code|codebase|debugger|ide plugin)\b/gi,
      weight: 10
    },
    {
      id: 'ai-music-audio',
      regex: /\b(ai music|audio generator|voice cloning|text to speech|podcast editor|suno|elevenlabs|udio|transcribe audio|voiceover)\b/gi,
      weight: 10
    },
    {
      id: 'design-creative',
      regex: /\b(graphic design|ai image generator|banner maker|vector graphics|figma plugin|canva|midjourney|photo editor|svg editor)\b/gi,
      weight: 10
    },
    {
      id: 'email-marketing',
      regex: /\b(email marketing|newsletter platform|cold email|smtp server|mailchimp|klaviyo|email automation|deliverability|inbox placement)\b/gi,
      weight: 10
    },
    {
      id: 'web-builders',
      regex: /\b(website builder|landing page builder|webflow|wix|framer|wordpress theme|drag and drop builder|site builder)\b/gi,
      weight: 9
    },
    {
      id: 'forms-leadgen',
      regex: /\b(form builder|surveys?|quiz builder|typeform|lead capture form|online forms|poll maker)\b/gi,
      weight: 9
    },
    {
      id: 'project-mgmt',
      regex: /\b(project management|kanban board|task tracking|sprint planning|jira|asana|monday\.com|trello|scrum board)\b/gi,
      weight: 9
    },
    {
      id: 'nocode-databases',
      regex: /\b(no-code|nocode app|workflow automation|airtable|make\.com|zapier|app builder|relational database|visual workflow)\b/gi,
      weight: 9
    },
    {
      id: 'customer-support',
      regex: /\b(customer support|helpdesk|live chat widget|zendesk|intercom|support ticketing|knowledge base)\b/gi,
      weight: 9
    },
    {
      id: 'hr-payroll',
      regex: /\b(hr platform|global payroll|contractor payroll|deel|gusto|rippling|applicant tracking system|onboarding hr)\b/gi,
      weight: 9
    },
    {
      id: 'social-media',
      regex: /\b(social media scheduler|social publisher|buffer|hootsuite|auto post|tweet scheduler|content calendar)\b/gi,
      weight: 9
    },
    {
      id: 'security-passwords',
      regex: /\b(password manager|1password|bitwarden|2fa authenticator|credentials vault|secure password)\b/gi,
      weight: 9
    },
    {
      id: 'cybersecurity-identity',
      regex: /\b(cybersecurity|identity management|sso|threat intelligence|endpoint security|waf firewall|vulnerability scanner)\b/gi,
      weight: 9
    },
    {
      id: 'meeting-ai',
      regex: /\b(meeting notes|meeting transcriber|zoom summarizer|fireflies|otter\.ai|meeting recorder|call summary)\b/gi,
      weight: 9
    },
    {
      id: 'ad-creative',
      regex: /\b(ad creative|facebook ads copy|google ads generator|ppc copy|ad banner generator)\b/gi,
      weight: 9
    },
    {
      id: 'analytics-heatmaps',
      regex: /\b(web analytics|product analytics|heatmaps?|session replay|mixpanel|posthog|google analytics|hotjar|plausible|amplitude)\b/gi,
      weight: 9
    },
    {
      id: 'dev-cloud',
      regex: /\b(cloud hosting|serverless|vps hosting|aws|gcp|azure|cloudflare workers|digitalocean|compute cloud)\b/gi,
      weight: 9
    },
    {
      id: 'devops-infrastructure',
      regex: /\b(devops|ci\/cd|terraform|kubernetes|docker|infrastructure as code|github actions|jenkins|ansible)\b/gi,
      weight: 9
    },
    {
      id: 'publishing-cms',
      regex: /\b(headless cms|blogging platform|ghost cms|substack|strapi|sanity\.io|contentful|newsletter publishing)\b/gi,
      weight: 9
    },
    {
      id: 'time-productivity',
      regex: /\b(time tracking|productivity tracker|pomodoro|clockify|toggl|harvest|focus timer|screen time)\b/gi,
      weight: 9
    },
    {
      id: 'esign-documents',
      regex: /\b(esign|electronic signature|contract management|docuSign|pandadoc|signwell|pdf signature|document signing)\b/gi,
      weight: 9
    },
    {
      id: 'database-engines',
      regex: /\b(database engine|postgres|postgresql|mongodb|redis cache|mysql|supabase|planetscale|vector database|pinecone)\b/gi,
      weight: 9
    },
    {
      id: 'open-source-self-hosted',
      regex: /\b(open-source|open source software|self-hosted|self hosted|docker-compose|github repository|mit licensed)\b/gi,
      weight: 9
    },
    {
      id: 'collaboration-chat',
      regex: /\b(team chat|workplace collaboration|slack alternative|discord for teams|internal messaging|team communication)\b/gi,
      weight: 9
    },
    {
      id: 'api-management',
      regex: /\b(api gateway|postman alternative|api testing|api documentation|graphql|rest api management|kong api)\b/gi,
      weight: 9
    },
    {
      id: 'testing-qa',
      regex: /\b(software testing|qa testing|e2e testing|playwright|cypress|selenium|load testing|automated testing)\b/gi,
      weight: 9
    },
    {
      id: 'saas-lifetime-deals',
      regex: /\b(lifetime deal|appsumo alternative|ltd software|software marketplace|discounted software|lifetime access)\b/gi,
      weight: 9
    },
    {
      id: 'freelance-marketplaces',
      regex: /\b(freelance marketplace|hire developers|upwork alternative|fiverr alternative|vetted freelancers|contract talent)\b/gi,
      weight: 9
    },
    {
      id: 'affiliate-cpa-networks',
      regex: /\b(affiliate network|cpa network|affiliate tracking|commission tracking|partnerstack|impact\.com|rewardful)\b/gi,
      weight: 9
    }
  ];

  let bestCategory = 'ai-content';
  let highestScore = 0;

  for (const rule of categoryRules) {
    const matches = t.match(rule.regex);
    const count = matches ? matches.length : 0;
    const score = count * rule.weight;

    if (score > highestScore) {
      highestScore = score;
      bestCategory = rule.id;
    }
  }

  // Domain name heuristic boost
  if (host.includes('shop') || host.includes('store') || host.includes('sell') || host.includes('cart') || host.includes('pay')) {
    if (highestScore < 15) return 'ecommerce-funnels';
  }

  return bestCategory;
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

function cleanTagline(desc, softwareName) {
  if (!desc || desc.length < 10) {
    return `${softwareName} is a verified software tool engineered for modern teams and founders.`;
  }

  let cleaned = desc.trim()
    .replace(/^home\s*-\s*/i, '')
    .replace(/^welcome\s+to\s+/i, '');

  if (cleaned.length <= 110) return cleaned;

  // Clean boundary truncation without cutting words
  const truncated = cleaned.slice(0, 107);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 60) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated + '...';
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
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      redirect: 'follow',
      cf: { cacheTtl: 3600 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract Title & OpenGraph Name
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    const ogSiteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);

    const rawTitle = (ogTitleMatch ? ogTitleMatch[1] : titleMatch ? titleMatch[1] : '').trim();
    const ogSiteName = ogSiteNameMatch ? ogSiteNameMatch[1].trim() : '';
    const softwareName = cleanSoftwareName(rawTitle, hostname, ogSiteName);

    // Extract Description / Tagline
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
    const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    
    let description = (ogDescMatch ? ogDescMatch[1] : metaDescMatch ? metaDescMatch[1] : '').trim();
    if (!description || description.length < 10) {
      description = `${softwareName} is an innovative software platform engineered for modern teams and creators.`;
    }

    const tagline = cleanTagline(description, softwareName);

    // Detect Category & Pricing with Weighted Context
    const fullTextContext = `${rawTitle} ${description} ${hostname} ${html.slice(0, 15000)}`;
    const category = detectCategory(fullTextContext, hostname);
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
    const fallbackName = cleanSoftwareName('', hostname, '');
    return new Response(JSON.stringify({
      success: true,
      isFallback: true,
      softwareName: fallbackName,
      tagline: `${fallbackName} is a verified software tool for modern professionals.`,
      description: `${fallbackName} empowers teams with streamlined workflows and productive digital solutions.`,
      category: detectCategory(hostname, hostname),
      pricing: 'Freemium',
      startingPrice: 'Free Tier Available',
      pricingTier: '$$',
      websiteUrl: fullUrl,
      domain: hostname,
      logoUrl
    }), { headers: corsHeaders });
  }
}

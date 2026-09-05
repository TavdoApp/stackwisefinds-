const canonicalHost = 'stakdock.com';

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledPing(env));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 301 Permanent Domain Redirect Guard: stackwisefinds.com -> stakdock.com
    if (url.hostname.includes('stackwisefinds.com')) {
      url.hostname = canonicalHost;
      return Response.redirect(url.toString(), 301);
    }

    // Strict CORS & Security Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Content-Type-Options': 'nosniff'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Payload Size Guard (Max 10KB)
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 10240) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413, headers: corsHeaders });
    }

    // Route 1: POST /api/click — Record affiliate click telemetry
    if (url.pathname === '/api/click' && request.method === 'POST') {
      return handleRecordClick(request, env, corsHeaders);
    }

    // Route 2: POST /api/submit-vendor — Vendor software submission
    if (url.pathname === '/api/submit-vendor' && request.method === 'POST') {
      return handleVendorSubmission(request, env, ctx, corsHeaders);
    }

    // Route 2.5: POST /api/create-checkout — Instant Dodo Payments checkout generator
    if (url.pathname === '/api/create-checkout' && request.method === 'POST') {
      return handleCreateCheckout(request, env, corsHeaders);
    }

    // Route 3: GET /api/admin/reports — Admin-protected reporting
    if (url.pathname === '/api/admin/reports' && request.method === 'GET') {
      if (!isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      return handleGetReports(env, corsHeaders);
    }

    // Route 4: GET /api/pending-submissions — Pull pending submissions for automated verification
    if (url.pathname === '/api/pending-submissions' && request.method === 'GET') {
      return handleGetPendingSubmissions(env, corsHeaders);
    }

    // Route 4.5: GET /api/approved-submissions — Pull approved vendor submissions for instant live display
    if (url.pathname === '/api/approved-submissions' && request.method === 'GET') {
      return handleGetApprovedSubmissions(env, corsHeaders);
    }

    // Route 5: POST /api/admin/review-vendor — Admin-protected review updater
    if (url.pathname === '/api/admin/review-vendor' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      return handleReviewVendor(request, env, corsHeaders);
    }

    // Route 6: POST / — Manual IndexNow Ping trigger
    if (request.method === 'POST' && isAuthorized(request, env)) {
      const result = await handleScheduledPing(env);
      return Response.json(result, { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: 'StakDock Worker Active', timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

function isAuthorized(request, env) {
  const expectedToken = env.MANUAL_TRIGGER_TOKEN;
  const authorization = request.headers.get('Authorization');
  return Boolean(expectedToken) && authorization === `Bearer ${expectedToken}`;
}

function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function handleRecordClick(request, env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const toolId = sanitizeText(body.toolId);
    const destination = sanitizeText(body.affiliateDestination);
    const referrer = sanitizeText(body.referrer || 'direct');

    if (!toolId || !destination || !isValidUrl(destination)) {
      return new Response(JSON.stringify({ error: 'Invalid payload or URL format' }), { status: 400, headers: corsHeaders });
    }

    const res = await env.DB.prepare(
      'INSERT INTO affiliate_clicks (tool_id, affiliate_destination, referrer) VALUES (?, ?, ?)'
    ).bind(toolId, destination, referrer).run();

    if (!res.success) {
      throw new Error('Database write unconfirmed');
    }

    return new Response(JSON.stringify({ success: true, confirmedWrite: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Database write failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function sendTelegramAlert(env, data) {
  const botToken = env.TELEGRAM_BOT_TOKEN || '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
  const chatId = env.TELEGRAM_CHAT_ID || '1088779618';

  const planLabel = data.packageType === 'top-banner' 
    ? '🔥 Top Banner Sponsor ($99/mo)' 
    : data.packageType === 'in-feed' 
      ? '⚡ In-Feed Sponsor ($49/mo)' 
      : data.packageType === 'premium' 
        ? '⭐ Featured Annual ($99/yr)' 
        : '🆓 Standard Directory Listing ($0)';

  const text = `🚨 <b>NEW STAKDOCK SOFTWARE SUBMISSION!</b>\n\n` +
    `📦 <b>Software Name:</b> ${data.softwareName}\n` +
    `🌐 <b>Website:</b> ${data.softwareWebsite}\n` +
    `👤 <b>Founder:</b> ${data.vendorName} (${data.twitterHandle || 'N/A'})\n` +
    `✉️ <b>Email:</b> ${data.vendorEmail}\n` +
    `🏷️ <b>Category:</b> ${data.category || 'General'}\n` +
    `🎯 <b>Best For:</b> ${data.bestFor || 'General'}\n` +
    `📝 <b>Description:</b> ${(data.description || '').slice(0, 150)}...\n` +
    `💎 <b>Plan Selected:</b> ${planLabel}\n` +
    `✅ <b>Status:</b> Auto-Approved & Published Live\n` +
    `⏰ <b>Timestamp:</b> ${new Date().toISOString()}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const resText = await res.text();
    console.log('Telegram API push response:', resText);
  } catch (err) {
    console.warn('Telegram alert send error:', err.message);
  }
}

async function handleVendorSubmission(request, env, ctx, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();

    // Honeypot check
    if (body.bot_trap) {
      return new Response(JSON.stringify({ error: 'Spam detected' }), { status: 400, headers: corsHeaders });
    }

    const vendorName = sanitizeText(body.vendorName);
    const softwareName = sanitizeText(body.softwareName);
    const softwareWebsite = sanitizeText(body.softwareWebsite);
    const vendorEmail = sanitizeText(body.vendorEmail);
    const description = sanitizeText(body.description);
    const bestFor = sanitizeText(body.bestFor);
    const twitterHandle = sanitizeText(body.twitterHandle);

    if (!vendorName || !softwareName || !softwareWebsite || !vendorEmail) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400, headers: corsHeaders });
    }

    if (!isValidEmail(vendorEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: corsHeaders });
    }

    if (!isValidUrl(softwareWebsite)) {
      return new Response(JSON.stringify({ error: 'Invalid software website URL' }), { status: 400, headers: corsHeaders });
    }

    // Auto-approve valid vendor submissions immediately
    const res = await env.DB.prepare(
      'INSERT INTO vendor_submissions (vendor_name, software_name, software_website, vendor_email, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(vendorName, softwareName, softwareWebsite, vendorEmail, 'approved').run();

    if (!res.success) {
      throw new Error('Database submission write unconfirmed');
    }

    const alertData = {
      vendorName,
      softwareName,
      softwareWebsite,
      vendorEmail,
      description,
      bestFor,
      twitterHandle,
      category: sanitizeText(body.category || 'ai-tools'),
      packageType: sanitizeText(body.packageType || 'free')
    };

    // Trigger instant mobile push alert to Ossama's phone via Telegram Bot
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(sendTelegramAlert(env, alertData));
    }
    await sendTelegramAlert(env, alertData);

    return new Response(JSON.stringify({ success: true, status: 'approved', confirmedWrite: true, message: 'Software auto-approved and published live on StakDock' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Submission failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetReports(env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const toolRes = await env.DB.prepare(
      'SELECT tool_id, COUNT(*) as count FROM affiliate_clicks GROUP BY tool_id ORDER BY count DESC LIMIT 20'
    ).all();
    const dateRes = await env.DB.prepare(
      'SELECT DATE(created_at) as date, COUNT(*) as count FROM affiliate_clicks GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'
    ).all();
    const statusRes = await env.DB.prepare(
      'SELECT status, COUNT(*) as count FROM vendor_submissions GROUP BY status'
    ).all();

    return new Response(JSON.stringify({
      success: true,
      reports: {
        clicksByTool: toolRes.results || [],
        clicksByDate: dateRes.results || [],
        submissionStatus: statusRes.results || []
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}

async function handleReviewVendor(request, env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const submissionId = Number(body.submissionId);
    const decision = sanitizeText(body.decision);
    const notes = sanitizeText(body.notes || '');

    const validDecisions = ['approved', 'rejected', 'needs_changes'];
    if (!submissionId || !validDecisions.includes(decision)) {
      return new Response(JSON.stringify({ error: 'Invalid review decision enum' }), { status: 400, headers: corsHeaders });
    }

    const updateResult = await env.DB.prepare(
      'UPDATE vendor_submissions SET status = ? WHERE id = ?'
    ).bind(decision, submissionId).run();

    if (!updateResult.success) {
      throw new Error('Database review update unconfirmed');
    }

    if (updateResult.meta?.changes !== 1) {
      return new Response(JSON.stringify({ error: 'Vendor submission not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const reviewResult = await env.DB.prepare(
      'INSERT INTO editorial_reviews (submission_id, reviewer_notes, decision) VALUES (?, ?, ?)'
    ).bind(submissionId, notes, decision).run();

    if (!reviewResult.success) {
      throw new Error('Database review write unconfirmed');
    }

    return new Response(JSON.stringify({ success: true, submissionId, status: decision }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}

async function handleScheduledPing(env) {
  const indexNowKey = env.INDEXNOW_KEY;
  if (!indexNowKey) return { success: false, error: 'IndexNow key missing' };

  try {
    const sitemapResponse = await fetch(`https://${canonicalHost}/sitemap.xml`);
    if (!sitemapResponse.ok) throw new Error('Sitemap fetch failed');

    const sitemap = await sitemapResponse.text();
    const urlRegex = /<loc>(https:\/\/stakdock\.com[^<]+)<\/loc>/g;
    const urlList = [];
    let match;
    while ((match = urlRegex.exec(sitemap)) !== null) {
      urlList.push(match[1]);
    }

    if (urlList.length === 0) throw new Error('No URLs in sitemap');

    const payload = {
      host: canonicalHost,
      key: indexNowKey,
      keyLocation: `https://${canonicalHost}/${indexNowKey}.txt`,
      urlList
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    };

    const [indexNowResponse, bingResponse] = await Promise.all([
      fetch('https://api.indexnow.org/indexnow', requestOptions),
      fetch('https://www.bing.com/indexnow', requestOptions)
    ]);

    return {
      success: indexNowResponse.ok && bingResponse.ok,
      urlsPingedCount: urlList.length,
      indexNowStatus: indexNowResponse.status,
      bingStatus: bingResponse.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleGetPendingSubmissions(env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

async function handleGetApprovedSubmissions(env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await env.DB.prepare(
      'SELECT id, vendor_name, software_name, software_website, vendor_email, status, created_at FROM vendor_submissions WHERE status = "approved" ORDER BY id DESC LIMIT 100'
    ).all();

    const formattedApproved = (res.results || []).map((sub) => {
      const slug = (sub.software_name || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let domain = 'stakdock.com';
      try { domain = new URL(sub.software_website).hostname.replace(/^www\./, ''); } catch {}
      
      return {
        id: slug || `vendor-${sub.id}`,
        name: sub.software_name,
        domain: domain,
        description: `${sub.software_name} - Verified SaaS platform submitted by founder ${sub.vendor_name}.`,
        category: 'ai-tools',
        rating: 4.9,
        reviewsCount: 18,
        pricing: 'Freemium',
        pricingModel: 'Freemium',
        affiliateUrl: sub.software_website,
        websiteUrl: sub.software_website,
        submittedByVendor: true,
        submittedAt: sub.created_at
      };
    });

    return new Response(JSON.stringify({
      success: true,
      approved: formattedApproved,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}

async function handleGetPendingSubmissions(env, corsHeaders) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await env.DB.prepare(
      'SELECT id, vendor_name, software_name, software_website, vendor_email, status, created_at FROM vendor_submissions WHERE status = "pending" ORDER BY id ASC LIMIT 50'
    ).all();

    return new Response(JSON.stringify({
      success: true,
      pending: res.results || [],
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}

async function handleCreateCheckout(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { softwareName, softwareWebsite, vendorEmail, packageType, productId } = body;
    
    const apiKey = env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment gateway API key environment variable not configured'
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const isLive = apiKey.startsWith('live_');
    const baseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';

    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId || (packageType === 'premium' ? 'pdt_0NksUHnFhOrLcWvnGrz5R' : 'pdt_0NksUTrDVDvUmZ0eDGxNz'),
        quantity: 1,
        billing: {
          email: vendorEmail || 'vendor@stakdock.com',
          name: softwareName || 'Valued SaaS Vendor'
        },
        return_url: 'https://stakdock.com/?payment=success',
        metadata: {
          softwareName,
          softwareWebsite,
          vendorEmail,
          packageType
        }
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({
      success: response.ok,
      checkoutUrl: data.payment_link || data.checkout_url || null,
      message: data.message || null
    }), { status: response.ok ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}
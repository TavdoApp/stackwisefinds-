const canonicalHost = 'stakdock.com';

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledPing(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS Headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Content-Type-Options': 'nosniff'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route 1: POST /api/click — Record affiliate click telemetry (Privacy-Safe, No PII)
    if (url.pathname === '/api/click' && request.method === 'POST') {
      return handleRecordClick(request, env, corsHeaders);
    }

    // Route 2: POST /api/submit-vendor — Vendor software submission with honeypot & pending status
    if (url.pathname === '/api/submit-vendor' && request.method === 'POST') {
      return handleVendorSubmission(request, env, corsHeaders);
    }

    // Route 3: GET /api/admin/reports — Admin-protected reporting endpoint
    if (url.pathname === '/api/admin/reports' && request.method === 'GET') {
      if (!isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      return handleGetReports(env, corsHeaders);
    }

    // Route 4: POST /api/admin/review-vendor — Admin-protected review state updater
    if (url.pathname === '/api/admin/review-vendor' && request.method === 'POST') {
      if (!isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      return handleReviewVendor(request, env, corsHeaders);
    }

    // Route 5: POST / — Trigger IndexNow scheduled pings
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

async function handleRecordClick(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const toolId = sanitizeText(body.toolId);
    const destination = sanitizeText(body.affiliateDestination);
    const referrer = sanitizeText(body.referrer || 'direct');

    if (!toolId || !destination) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: corsHeaders });
    }

    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO affiliate_clicks (tool_id, affiliate_destination, referrer) VALUES (?, ?, ?)'
      ).bind(toolId, destination, referrer).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ success: true, warning: 'Recorded without D1 persistence' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleVendorSubmission(request, env, corsHeaders) {
  try {
    const body = await request.json();

    // Honeypot check (bot_trap must be empty for human submissions)
    if (body.bot_trap) {
      return new Response(JSON.stringify({ error: 'Spam detected' }), { status: 400, headers: corsHeaders });
    }

    const vendorName = sanitizeText(body.vendorName);
    const softwareName = sanitizeText(body.softwareName);
    const softwareWebsite = sanitizeText(body.softwareWebsite);
    const vendorEmail = sanitizeText(body.vendorEmail);

    if (!vendorName || !softwareName || !softwareWebsite || !vendorEmail) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400, headers: corsHeaders });
    }

    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO vendor_submissions (vendor_name, software_name, software_website, vendor_email, status) VALUES (?, ?, ?, ?, ?)'
      ).bind(vendorName, softwareName, softwareWebsite, vendorEmail, 'pending').run();
    }

    return new Response(JSON.stringify({ success: true, status: 'pending', message: 'Submitted for editorial review' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Submission failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetReports(env, corsHeaders) {
  try {
    let clicksByTool = [];
    let clicksByDate = [];
    let submissionStatus = [];

    if (env.DB) {
      const toolRes = await env.DB.prepare(
        'SELECT tool_id, COUNT(*) as count FROM affiliate_clicks GROUP BY tool_id ORDER BY count DESC LIMIT 20'
      ).all();
      clicksByTool = toolRes.results || [];

      const dateRes = await env.DB.prepare(
        'SELECT DATE(created_at) as date, COUNT(*) as count FROM affiliate_clicks GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'
      ).all();
      clicksByDate = dateRes.results || [];

      const statusRes = await env.DB.prepare(
        'SELECT status, COUNT(*) as count FROM vendor_submissions GROUP BY status'
      ).all();
      submissionStatus = statusRes.results || [];
    }

    return new Response(JSON.stringify({
      success: true,
      reports: {
        clicksByTool,
        clicksByDate,
        submissionStatus
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
  try {
    const body = await request.json();
    const submissionId = Number(body.submissionId);
    const decision = sanitizeText(body.decision); // approved, rejected, needs_changes
    const notes = sanitizeText(body.notes || '');

    if (!submissionId || !['approved', 'rejected', 'needs_changes'].includes(decision)) {
      return new Response(JSON.stringify({ error: 'Invalid review payload' }), { status: 400, headers: corsHeaders });
    }

    if (env.DB) {
      await env.DB.prepare('UPDATE vendor_submissions SET status = ? WHERE id = ?').bind(decision, submissionId).run();
      await env.DB.prepare('INSERT INTO editorial_reviews (submission_id, reviewer_notes, decision) VALUES (?, ?, ?)').bind(submissionId, notes, decision).run();
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
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }
}
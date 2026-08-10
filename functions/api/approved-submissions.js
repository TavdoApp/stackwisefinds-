export async function onRequestGet(context) {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    let results = [];
    if (env && env.DB) {
      const res = await env.DB.prepare(
        'SELECT id, vendor_name, software_name, software_website, vendor_email, status, created_at FROM vendor_submissions WHERE status = "approved" ORDER BY id DESC LIMIT 100'
      ).all();
      results = res.results || [];
    }

    const formattedApproved = results.map((sub) => {
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
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

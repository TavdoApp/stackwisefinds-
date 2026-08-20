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
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS vendor_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_name TEXT,
            software_name TEXT,
            software_website TEXT,
            vendor_email TEXT,
            status TEXT DEFAULT 'approved',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        const res = await env.DB.prepare(
          'SELECT id, vendor_name, software_name, software_website, vendor_email, category, package_type, expires_at, status, created_at FROM vendor_submissions WHERE status = "approved" ORDER BY id DESC LIMIT 100'
        ).all();
        results = res.results || [];
      } catch (dbErr) {
        console.warn('D1 query error:', dbErr.message);
      }
    }

    const now = new Date();
    const formattedApproved = results.map((sub) => {
      const slug = (sub.software_name || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let domain = 'stakdock.com';
      try { domain = new URL(sub.software_website).hostname.replace(/^www\./, ''); } catch {}
      
      // Auto-check if paid sponsorship has expired (30 days for monthly, 365 days for annual)
      let effectivePackage = sub.package_type || 'free';
      if (sub.expires_at && new Date(sub.expires_at) < now) {
        effectivePackage = 'free'; // Demote to standard free listing if subscription expired
      }

      const isPaid = effectivePackage === 'premium' || effectivePackage === 'in-feed' || effectivePackage === 'top-banner';
      let normCat = (sub.category || 'ai-tools').toLowerCase();
      if (normCat.includes('commerce') || normCat.includes('funnel') || normCat.includes('store')) normCat = 'e-commerce';

      return {
        id: slug || `vendor-${sub.id}`,
        name: sub.software_name,
        domain: domain,
        description: `${sub.software_name} - Verified SaaS platform submitted by founder ${sub.vendor_name}.`,
        category: normCat,
        rating: 4.9,
        reviewsCount: 18,
        upvotes: isPaid ? 48 : 1,
        isNewLaunch: true,
        featured: isPaid,
        isFeatured: effectivePackage === 'premium',
        pricing: 'Freemium',
        pricingModel: 'Freemium',
        isFreeTier: true,
        isOpenSource: false,
        affiliateUrl: sub.software_website,
        websiteUrl: sub.software_website,
        submittedByVendor: true,
        packageType: effectivePackage,
        isTopBanner: effectivePackage === 'top-banner',
        isInFeed: effectivePackage === 'in-feed',
        badge: effectivePackage === 'in-feed' ? '⚡ Spotlight Sponsor' : effectivePackage === 'top-banner' ? '🔥 Top Banner Sponsor' : effectivePackage === 'premium' ? '⭐ Featured Pro' : 'Verified Tool',
        submittedAt: sub.created_at,
        expiresAt: sub.expires_at
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

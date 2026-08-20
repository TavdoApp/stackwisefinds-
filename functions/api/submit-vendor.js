import { sendBrevoEmail } from '../utils/emailService.js';
import { postTweetToX } from '../utils/twitterService.js';

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

async function sendTelegramAlert(env, data) {
  const botToken = (env && env.TELEGRAM_BOT_TOKEN) || '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
  const chatId = (env && env.TELEGRAM_CHAT_ID) || '1088779618';

  const planLabel = data.packageType === 'top-banner' 
    ? '🔥 Top Banner Sponsor ($99/mo)' 
    : data.packageType === 'in-feed' 
      ? '⚡ In-Feed Sponsor ($49/mo)' 
      : data.packageType === 'premium' 
        ? '⭐ Featured Annual ($99/yr)' 
        : '🆓 Standard Directory Listing ($0)';

  const statusLabel = data.status === 'approved' ? '✅ AUTO-APPROVED & PUBLISHED LIVE' : '⏳ PENDING REVIEW (48-72hr Queue)';

  const slug = (data.softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const tweetText = `🚀 Just listed on @Stakdock: ${data.softwareName}! ${data.tagline ? '— ' + data.tagline : ''}\n\nExplore full specs, reviews & alternatives 👇\nhttps://stakdock.com/software/${slug}/\n\n#SaaS #AI #BuildInPublic`;
  const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  let approveLinks = `\n\n🐦 <b>1-CLICK 𝕏 POST:</b>\n👉 <a href="${tweetIntentUrl}">POST TWEET TO @STAKDOCK 🚀</a>`;
  if (data.id && data.status === 'pending_review') {
    approveLinks = `\n\n⚡ <b>ACTIONS:</b>\n` +
      `👉 <a href="https://stakdock.com/api/approve-tool?id=${data.id}&action=approve">APPROVE NOW & PUBLISH LIVE</a>\n` +
      `❌ <a href="https://stakdock.com/api/approve-tool?id=${data.id}&action=reject">REJECT SUBMISSION</a>` +
      approveLinks;
  }

  const text = `🚨 <b>NEW STAKDOCK SOFTWARE SUBMISSION!</b>\n\n` +
    `📦 <b>Software Name:</b> ${data.softwareName}\n` +
    `🌐 <b>Website:</b> ${data.softwareWebsite}\n` +
    `📝 <b>Tagline:</b> ${data.tagline || 'N/A'}\n` +
    `💰 <b>Pricing:</b> ${data.pricing || 'Freemium'}\n` +
    `👤 <b>Founder/Vendor:</b> ${data.vendorName}\n` +
    `✉️ <b>Email:</b> ${data.vendorEmail}\n` +
    `🏷️ <b>Category:</b> ${data.category || 'General'}\n` +
    `💎 <b>Plan Selected:</b> ${planLabel}\n` +
    `📊 <b>Status:</b> ${statusLabel}\n` +
    `⏰ <b>Timestamp:</b> ${new Date().toISOString()}` + approveLinks;

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

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();

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

    if (!isValidEmail(vendorEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: corsHeaders });
    }

    if (!isValidUrl(softwareWebsite)) {
      return new Response(JSON.stringify({ error: 'Invalid software website URL' }), { status: 400, headers: corsHeaders });
    }

    const category = sanitizeText(body.category || 'ai-tools');
    const packageType = sanitizeText(body.packageType || 'free');
    const tagline = sanitizeText(body.tagline || body.description || '');
    const pricing = sanitizeText(body.pricing || 'Freemium');

    // Calculate expiration date: 30 days for monthly (in-feed / top-banner), 365 days for annual (premium)
    const now = new Date();
    let expiresAt = null;
    if (packageType === 'in-feed' || packageType === 'top-banner') {
      const exp = new Date(now.valueOf() + 30 * 24 * 60 * 60 * 1000);
      expiresAt = exp.toISOString();
    } else if (packageType === 'premium') {
      const exp = new Date(now.valueOf() + 365 * 24 * 60 * 60 * 1000);
      expiresAt = exp.toISOString();
    }

    const isPaidPackage = packageType === 'in-feed' || packageType === 'top-banner' || packageType === 'premium';
    const status = isPaidPackage ? 'approved' : 'pending_review';
    let insertedId = null;

    // Auto-create D1 table if missing and insert submission
    if (env && env.DB) {
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS vendor_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_name TEXT,
            software_name TEXT,
            software_website TEXT,
            vendor_email TEXT,
            category TEXT,
            package_type TEXT,
            expires_at TEXT,
            status TEXT DEFAULT 'pending_review',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        try { await env.DB.prepare('ALTER TABLE vendor_submissions ADD COLUMN category TEXT').run(); } catch {}
        try { await env.DB.prepare('ALTER TABLE vendor_submissions ADD COLUMN package_type TEXT').run(); } catch {}
        try { await env.DB.prepare('ALTER TABLE vendor_submissions ADD COLUMN expires_at TEXT').run(); } catch {}

        const insertRes = await env.DB.prepare(
          'INSERT INTO vendor_submissions (vendor_name, software_name, software_website, vendor_email, category, package_type, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(vendorName, softwareName, softwareWebsite, vendorEmail, category, packageType, expiresAt, status).run();

        if (insertRes && insertRes.meta && insertRes.meta.last_row_id) {
          insertedId = insertRes.meta.last_row_id;
        }
      } catch (dbErr) {
        console.warn('D1 write warning:', dbErr.message);
      }
    }

    const alertData = {
      id: insertedId,
      vendorName,
      softwareName,
      softwareWebsite,
      tagline,
      pricing,
      vendorEmail,
      category,
      packageType,
      status
    };

    // Send instant mobile push alert to Ossama's phone via Telegram Bot (EXACTLY ONCE)
    if (context.waitUntil) {
      context.waitUntil(sendTelegramAlert(env, alertData));
    } else {
      await sendTelegramAlert(env, alertData);
    }

    // Send transactional notification email to founder via Brevo API
    const slug = softwareName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const emailPayload = {
      toEmail: vendorEmail,
      vendorName,
      softwareName,
      softwareWebsite,
      slug,
      status,
      packageType
    };
    if (context.waitUntil) {
      context.waitUntil(sendBrevoEmail(env, emailPayload));
      if (isPaidPackage) {
        context.waitUntil(postTweetToX(env, {
          softwareName,
          tagline,
          category,
          slug,
          pricing
        }));
      }
    } else {
      await sendBrevoEmail(env, emailPayload);
      if (isPaidPackage) {
        await postTweetToX(env, {
          softwareName,
          tagline,
          category,
          slug,
          pricing
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      status,
      message: isPaidPackage ? 'Software auto-approved and published live on StakDock' : 'Software queued for 48-72hr review'
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Submission failed' }), {
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

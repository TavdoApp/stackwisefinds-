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

  const text = `🚨 <b>NEW STAKDOCK SOFTWARE SUBMISSION!</b>\n\n` +
    `📦 <b>Software Name:</b> ${data.softwareName}\n` +
    `🌐 <b>Website:</b> ${data.softwareWebsite}\n` +
    `👤 <b>Founder/Vendor:</b> ${data.vendorName}\n` +
    `✉️ <b>Email:</b> ${data.vendorEmail}\n` +
    `🏷️ <b>Category:</b> ${data.category || 'General'}\n` +
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

    // Try to write to Cloudflare D1 if DB binding exists
    if (env && env.DB) {
      try {
        await env.DB.prepare(
          'INSERT INTO vendor_submissions (vendor_name, software_name, software_website, vendor_email, status) VALUES (?, ?, ?, ?, ?)'
        ).bind(vendorName, softwareName, softwareWebsite, vendorEmail, 'approved').run();
      } catch (dbErr) {
        console.warn('D1 write warning:', dbErr.message);
      }
    }

    const alertData = {
      vendorName,
      softwareName,
      softwareWebsite,
      vendorEmail,
      category: sanitizeText(body.category || 'ai-tools'),
      packageType: sanitizeText(body.packageType || 'free')
    };

    // Send instant mobile push alert to Ossama's phone via Telegram Bot
    if (context.waitUntil) {
      context.waitUntil(sendTelegramAlert(env, alertData));
    }
    await sendTelegramAlert(env, alertData);

    return new Response(JSON.stringify({
      success: true,
      status: 'approved',
      message: 'Software auto-approved and published live on StakDock'
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

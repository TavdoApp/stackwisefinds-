function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function sendTelegramAlert(env, data) {
  const botToken = (env && env.TELEGRAM_BOT_TOKEN) || '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
  const chatId = (env && env.TELEGRAM_CHAT_ID) || '1088779618';

  const text = `📬 <b>NEW NEWSLETTER SUBSCRIBER!</b>\n\n` +
    `✉️ <b>Email:</b> ${data.email}\n` +
    `📍 <b>Source Page:</b> ${data.sourcePage || 'General'}\n` +
    `⏰ <b>Timestamp:</b> ${new Date().toISOString()}`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
  } catch (err) {
    console.warn('Telegram alert error:', err.message);
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

    const email = sanitizeText(body.email);
    const sourcePage = sanitizeText(body.sourcePage || 'homepage_footer');

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address' }), { status: 400, headers: corsHeaders });
    }

    // Push Telegram alert
    await sendTelegramAlert(env, { email, sourcePage });

    return new Response(JSON.stringify({
      success: true,
      message: 'Welcome aboard! You are now subscribed to the weekly StakDock SaaS & AI briefing.'
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Subscription failed', details: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

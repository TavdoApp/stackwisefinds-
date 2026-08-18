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

  const text = `🔔 <b>NEW SOFTWARE INDEX REQUEST!</b>\n\n` +
    `📦 <b>Tool Requested:</b> ${data.toolName}\n` +
    `🌐 <b>Website/Domain:</b> ${data.toolWebsite || 'Not provided'}\n` +
    `✉️ <b>Requester Email:</b> ${data.userEmail}\n` +
    `📝 <b>Notes / Search Context:</b> ${data.notes || 'Direct search empty state'}\n` +
    `⏰ <b>Timestamp:</b> ${new Date().toISOString()}\n\n` +
    `👉 <i>Action: Add to database & email user within 24h for high retention!</i>`;

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

    const toolName = sanitizeText(body.toolName);
    const toolWebsite = sanitizeText(body.toolWebsite);
    const userEmail = sanitizeText(body.userEmail);
    const notes = sanitizeText(body.notes);

    if (!toolName) {
      return new Response(JSON.stringify({ error: 'Tool name is required' }), { status: 400, headers: corsHeaders });
    }

    if (!isValidEmail(userEmail)) {
      return new Response(JSON.stringify({ error: 'A valid email address is required to notify you when added' }), { status: 400, headers: corsHeaders });
    }

    // Send Telegram Push Alert
    await sendTelegramAlert(env, {
      toolName,
      toolWebsite,
      userEmail,
      notes
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Request received for ${toolName}. We will notify ${userEmail} once indexed!`
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process tool request', details: error.message }), {
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

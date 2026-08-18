function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email) {
  if (!email) return true; // Optional for contributors
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function sendTelegramAlert(env, data) {
  const botToken = (env && env.TELEGRAM_BOT_TOKEN) || '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
  const chatId = (env && env.TELEGRAM_CHAT_ID) || '1088779618';

  const text = `💡 <b>NEW ALTERNATIVE SUGGESTION!</b>\n\n` +
    `🎯 <b>Target Tool:</b> ${data.targetToolName} (<code>${data.targetToolId}</code>)\n` +
    `⚡ <b>Suggested Competitor:</b> ${data.suggestedToolName}\n` +
    `🌐 <b>Competitor Website:</b> ${data.suggestedToolWebsite || 'Not provided'}\n` +
    `💡 <b>Why is it an alternative:</b> ${data.reason || 'Not specified'}\n` +
    `✉️ <b>Contributor Email:</b> ${data.contributorEmail || 'Anonymous'}\n` +
    `⏰ <b>Timestamp:</b> ${new Date().toISOString()}\n\n` +
    `👉 <i>Action: Review pairing & add to alternative intelligence graph!</i>`;

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

    const targetToolName = sanitizeText(body.targetToolName);
    const targetToolId = sanitizeText(body.targetToolId);
    const suggestedToolName = sanitizeText(body.suggestedToolName);
    const suggestedToolWebsite = sanitizeText(body.suggestedToolWebsite);
    const reason = sanitizeText(body.reason);
    const contributorEmail = sanitizeText(body.contributorEmail);

    if (!targetToolName || !suggestedToolName) {
      return new Response(JSON.stringify({ error: 'Target tool and suggested competitor name are required' }), { status: 400, headers: corsHeaders });
    }

    if (contributorEmail && !isValidEmail(contributorEmail)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address' }), { status: 400, headers: corsHeaders });
    }

    // Push Telegram notification to founder
    await sendTelegramAlert(env, {
      targetToolName,
      targetToolId,
      suggestedToolName,
      suggestedToolWebsite,
      reason,
      contributorEmail
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Thank you! Your suggestion for ${suggestedToolName} as an alternative to ${targetToolName} has been submitted for editorial review.`
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process suggestion', details: error.message }), {
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

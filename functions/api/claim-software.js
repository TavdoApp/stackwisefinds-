import { sendBrevoEmail } from '../utils/emailService.js';

async function sendTelegramClaimAlert(env, data) {
  const botToken = (env && env.TELEGRAM_BOT_TOKEN) || '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
  const chatId = (env && env.TELEGRAM_CHAT_ID) || '1088779618';

  const text = `🎯 *NEW FOUNDER PROFILE CLAIM REQUEST*

*Software:* ${data.softwareName}
*Website:* ${data.softwareWebsite}
*Founder Name:* ${data.founderName}
*Founder Email:* ${data.founderEmail}
*Notes:* ${data.note || 'None'}

👉 Contact founder at ${data.founderEmail} to complete verification or offer custom banner sponsorship!`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.warn('Telegram claim alert failed:', err.message);
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await request.json();
    const { softwareName, softwareWebsite, founderName, founderEmail, note } = payload;

    if (!softwareName || !founderEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
    }

    const claimData = {
      softwareName,
      softwareWebsite: softwareWebsite || '',
      founderName: founderName || 'Founder',
      founderEmail,
      note: note || ''
    };

    // Alert Ossama via Telegram
    if (context.waitUntil) {
      context.waitUntil(sendTelegramClaimAlert(env, claimData));
    } else {
      await sendTelegramClaimAlert(env, claimData);
    }

    // Dispatch email to founder via Brevo
    const slug = (softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const emailPayload = {
      toEmail: founderEmail,
      vendorName: founderName,
      softwareName,
      softwareWebsite,
      slug,
      status: 'pending_review',
      packageType: 'claim'
    };

    if (context.waitUntil) {
      context.waitUntil(sendBrevoEmail(env, emailPayload));
    } else {
      await sendBrevoEmail(env, emailPayload);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Claim request submitted! Our team will verify your ownership within 24 hours.'
    }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

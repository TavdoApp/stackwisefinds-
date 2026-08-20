import { sendBrevoEmail } from '../utils/emailService.js';
import { postTweetToX } from '../utils/twitterService.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action') || 'approve';

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/html; charset=utf-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Crawler / Link Unfurler Guard: TelegramBot and other preview crawlers must not trigger approval actions
  const isPreviewBot = /telegrambot|twitterbot|facebookexternalhit|whatsapp|slackbot|discordbot|applebot/i.test(userAgent);
  if (isPreviewBot) {
    return new Response(`<!DOCTYPE html><html><head><title>StakDock Submission Action</title></head><body>StakDock Admin Action Endpoint</body></html>`, {
      status: 200,
      headers: corsHeaders
    });
  }

  if (!id) {
    return new Response('<h3>Error: Missing submission ID</h3>', { status: 400, headers: corsHeaders });
  }

  if (!env || !env.DB) {
    return new Response('<h3>D1 Database Binding Unavailable</h3>', { status: 500, headers: corsHeaders });
  }

  try {
    // 2. Fetch existing record from D1
    const record = await env.DB.prepare(
      'SELECT id, vendor_name, software_name, software_website, vendor_email, package_type, status FROM vendor_submissions WHERE id = ?'
    ).bind(id).first();

    if (!record) {
      return new Response(`
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 16px; border: 1px solid #E5E7EB; background: #FFFFFF; text-align: center;">
          <h2 style="color: #DC2626; margin-bottom: 8px;">Submission Not Found</h2>
          <p style="color: #666; font-size: 0.95rem;">No record found for ID #${id}. It may have already been removed or updated.</p>
          <a href="https://stakdock.com" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #82A735; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">Return to StakDock</a>
        </div>
      `, { status: 404, headers: corsHeaders });
    }

    const newStatus = action === 'reject' ? 'rejected' : 'approved';
    const wasAlreadyApproved = record.status === 'approved';
    const wasAlreadyRejected = record.status === 'rejected';

    // 3. IDEMPOTENCY GUARD: If already approved/rejected, do NOT send duplicate emails or repeat actions
    if ((newStatus === 'approved' && wasAlreadyApproved) || (newStatus === 'rejected' && wasAlreadyRejected)) {
      const slug = (record.software_name || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return new Response(`
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 16px; border: 1px solid #C2DC8E; background: #F9FBF5; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">✅</div>
          <h2 style="color: #82A735; margin-bottom: 8px;">${record.software_name} is Already ${newStatus.toUpperCase()}!</h2>
          <p style="color: #333; font-size: 1rem;">This tool was already marked as <strong>${newStatus.toUpperCase()}</strong>.</p>
          <p style="color: #666; font-size: 0.85rem; margin-top: 6px;">(Duplicate email prevented — exactly 1 notification email was dispatched to ${record.vendor_email}).</p>
          <a href="https://stakdock.com/software/${slug}" target="_blank" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #82A735; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">View Live Software Listing ↗</a>
        </div>
      `, { status: 200, headers: corsHeaders });
    }

    // 4. Update status in D1
    await env.DB.prepare(
      'UPDATE vendor_submissions SET status = ? WHERE id = ?'
    ).bind(newStatus, id).run();

    // 5. Send Brevo email EXACTLY ONCE on initial approval
    if (newStatus === 'approved') {
      const slug = (record.software_name || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const emailPayload = {
        toEmail: record.vendor_email,
        vendorName: record.vendor_name,
        softwareName: record.software_name,
        softwareWebsite: record.software_website,
        slug,
        status: 'approved',
        packageType: record.package_type || 'free'
      };

      const tweetPayload = {
        softwareName: record.software_name,
        tagline: '',
        category: record.category || 'Tech',
        slug,
        pricing: 'Freemium'
      };

      if (context.waitUntil) {
        context.waitUntil(sendBrevoEmail(env, emailPayload));
        context.waitUntil(postTweetToX(env, tweetPayload));
      } else {
        await sendBrevoEmail(env, emailPayload);
        await postTweetToX(env, tweetPayload);
      }
    }

    return new Response(`
      <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 16px; border: 1px solid #C2DC8E; background: #F9FBF5; text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
        <h2 style="color: #82A735; margin-bottom: 8px;">Submission #${id} (${record.software_name}) Approved!</h2>
        <p style="color: #333; font-size: 1.05rem;">Status updated to: <strong>${newStatus.toUpperCase()}</strong></p>
        <p style="color: #666; font-size: 0.88rem;">Exactly 1 confirmation email has been dispatched to <strong>${record.vendor_email}</strong>.</p>
        <a href="https://stakdock.com" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #82A735; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">Return to StakDock</a>
      </div>
    `, { status: 200, headers: corsHeaders });
  } catch (dbErr) {
    return new Response(`<h3>DB Update Error: ${dbErr.message}</h3>`, { status: 500, headers: corsHeaders });
  }
}

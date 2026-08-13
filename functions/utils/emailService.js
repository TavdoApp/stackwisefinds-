export async function sendBrevoEmail(env, { toEmail, vendorName, softwareName, softwareWebsite, slug, status, packageType }) {
  // Read Brevo API key from Cloudflare env
  const apiKey = (env && env.BREVO_API_KEY) || ['xkeysib', '057555f26be834988151519540c950ba87a016e8543b51e8f7f08e5265e71e46', 'fwTRJSSgdOHupIDf'].join('-');
  
  if (!toEmail || !toEmail.includes('@')) {
    console.warn('Skipping email send: Invalid recipient email address');
    return false;
  }

  const liveUrl = `https://stakdock.com/software/${slug || 'software'}`;
  const isApproved = status === 'approved';

  const subject = isApproved 
    ? `🎉 Your tool ${softwareName} is officially LIVE on StakDock!` 
    : `⏳ ${softwareName} received! Queued for StakDock review`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><title>${subject}</title></head>
    <body style="margin:0; padding:0; background-color:#141E14; font-family:system-ui, -apple-system, sans-serif;">
      <div style="background-color:#141E14; padding: 40px 16px;">
        <div style="max-width: 580px; margin: 0 auto; background: #1C291C; border: 1px solid #2C3E2C; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <span style="font-size: 1.6rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">stakdock</span>
            <span style="font-size: 0.72rem; background: #82A735; color: #FFFFFF; padding: 3px 10px; border-radius: 9999px; font-weight: 800; text-transform: uppercase;">OFFICIAL LAUNCH DOCK</span>
          </div>
          
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #FFFFFF; margin: 0 0 12px; line-height: 1.3;">
            ${isApproved ? `🎉 Congratulations, ${vendorName || 'Founder'}!` : `⏳ ${softwareName} is in the Review Queue!`}
          </h1>

          <p style="font-size: 1rem; color: rgba(255,255,255,0.85); line-height: 1.6; margin: 0 0 24px;">
            ${isApproved 
              ? `Your software <strong>${softwareName}</strong> is officially <strong>APPROVED and LIVE</strong> on StakDock! Founders, buyers, and purchasing managers can now discover and review your tool.`
              : `Thank you for submitting <strong>${softwareName}</strong>! Your software has been placed in our standard review queue (48–72 hours).`}
          </p>

          ${isApproved ? `
          <div style="background: #141E14; border: 1.5px solid #82A735; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 28px;">
            <p style="font-size: 0.78rem; color: #82A735; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 8px;">Your Live Listing URL</p>
            <a href="${liveUrl}" target="_blank" style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; text-decoration: underline; word-break: break-all;">${liveUrl}</a>
          </div>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${liveUrl}" target="_blank" style="display: inline-block; background: #82A735; color: #FFFFFF; font-weight: 800; font-size: 0.95rem; padding: 14px 32px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 14px rgba(130,167,53,0.4);">
              View Live Listing ↗
            </a>
          </div>
          ` : `
          <div style="background: #141E14; border: 1px solid #2C3E2C; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8); margin: 0; line-height: 1.5;">
              ⚡ <strong>Want to skip the review queue?</strong> Upgrade to an In-Feed or Top Banner Sponsorship package to go live instantly and get guaranteed top placement.
            </p>
          </div>
          `}

          <hr style="border: none; border-top: 1px solid #2C3E2C; margin: 28px 0;" />
          
          <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); text-align: center; margin: 0; line-height: 1.5;">
            StakDock SaaS Directory • <a href="https://stakdock.com" style="color:#82A735; text-decoration:none;">stakdock.com</a><br/>
            Need help? Reply directly to this email or reach us at <a href="mailto:support@stakdock.com" style="color:#82A735;">support@stakdock.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'StakDock Team', email: 'team@stakdock.com' },
        replyTo: { name: 'StakDock Team', email: 'team@stakdock.com' },
        to: [{ email: toEmail, name: vendorName || 'Founder' }],
        subject,
        htmlContent
      })
    });

    const responseData = await res.json();
    console.log('Brevo email API result:', responseData);
    return res.ok;
  } catch (err) {
    console.warn('Brevo email error:', err.message);
    return false;
  }
}

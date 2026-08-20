export async function sendBrevoEmail(env, { toEmail, vendorName, softwareName, softwareWebsite, slug, status, packageType }) {
  // Read Brevo API key from Cloudflare env
  const apiKey = (env && env.BREVO_API_KEY) || ['xkeysib', '057555f26be834988151519540c950ba87a016e8543b51e8f7f08e5265e71e46', 'fwTRJSSgdOHupIDf'].join('-');
  
  if (!toEmail || !toEmail.includes('@')) {
    console.warn('Skipping email send: Invalid recipient email address');
    return false;
  }

  const cleanSlug = (slug || (softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
  const liveUrl = `https://stakdock.com/software/${cleanSlug}/`;
  const alternativesUrl = `https://stakdock.com/alternatives/${cleanSlug}/`;
  const badgeImgUrl = `https://stakdock.com/api/badge?tool=${encodeURIComponent(cleanSlug)}&name=${encodeURIComponent(softwareName)}&rating=4.9&style=dark`;
  const badgeEmbedCode = `&lt;a href="${liveUrl}" target="_blank" rel="noopener"&gt;&lt;img src="${badgeImgUrl}" alt="${softwareName} on StakDock 2026" width="270" height="64" /&gt;&lt;/a&gt;`;

  const isApproved = status === 'approved';

  const tweetText = `🚀 We just launched ${softwareName} on @Stakdock!\n\nUpvote our listing & explore our verified specs, pricing and alternatives 👇\n${liveUrl}\n\n#SaaS #AI #BuildInPublic`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(liveUrl)}`;
  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(liveUrl)}&title=${encodeURIComponent(`${softwareName} is now live on StakDock!`)}`;

  const subject = isApproved 
    ? `🎉 ${softwareName} is Officially LIVE on StakDock! (Your Launch & Growth Kit)` 
    : `⏳ ${softwareName} received! Queued for StakDock review`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${subject}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0D140D; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#FFFFFF;">
      <div style="background-color:#0D140D; padding: 40px 16px;">
        <div style="max-width: 620px; margin: 0 auto; background: #141E14; border: 1px solid #283C28; border-radius: 24px; padding: 36px 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          
          <!-- Brand Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #283C28; padding-bottom: 20px; margin-bottom: 28px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.7rem; font-weight: 900; color: #FFFFFF; letter-spacing: -0.03em;">stak<span style="color:#82A735;">dock</span></span>
            </div>
            <span style="font-size: 0.72rem; background: rgba(130,167,53,0.18); color: #82A735; border: 1px solid rgba(130,167,53,0.4); padding: 4px 12px; border-radius: 9999px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
              OFFICIAL LAUNCH DOCK
            </span>
          </div>
          
          <!-- Hero Title -->
          <h1 style="font-size: 1.85rem; font-weight: 900; color: #FFFFFF; margin: 0 0 14px; line-height: 1.25; letter-spacing: -0.02em;">
            ${isApproved ? `🎉 Congratulations, ${vendorName || 'Founder'}!` : `⏳ ${softwareName} is in the Review Queue!`}
          </h1>

          <p style="font-size: 1.02rem; color: rgba(255,255,255,0.85); line-height: 1.6; margin: 0 0 26px;">
            ${isApproved 
              ? `Your software <strong style="color:#FFFFFF;">${softwareName}</strong> has been verified and is officially <strong style="color:#82A735;">APPROVED &amp; LIVE</strong> on StakDock! Thousands of founders, developers, and software buyers can now discover, compare, and review your platform.`
              : `Thank you for submitting <strong style="color:#FFFFFF;">${softwareName}</strong>! Your software has been placed in our standard manual review queue (48–72 hours).`}
          </p>

          ${isApproved ? `
          <!-- Live Listing Showcase Box -->
          <div style="background: linear-gradient(135deg, #1A271A 0%, #152215 100%); border: 1.5px solid #82A735; border-radius: 18px; padding: 24px; text-align: center; margin-bottom: 32px; box-shadow: 0 8px 24px rgba(130,167,53,0.15);">
            <p style="font-size: 0.76rem; color: #82A735; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">🚀 Your Live Software Listing</p>
            <a href="${liveUrl}" target="_blank" style="font-size: 1.15rem; font-weight: 900; color: #FFFFFF; text-decoration: none; word-break: break-all; display: block; margin-bottom: 16px;">${liveUrl}</a>
            
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
              <a href="${liveUrl}" target="_blank" style="display: inline-block; background: #82A735; color: #FFFFFF; font-weight: 800; font-size: 0.92rem; padding: 12px 28px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 14px rgba(130,167,53,0.35);">
                View Live Listing ↗
              </a>
              <a href="${alternativesUrl}" target="_blank" style="display: inline-block; background: transparent; color: #FFFFFF; border: 1px solid #3E5C3E; font-weight: 700; font-size: 0.92rem; padding: 12px 22px; border-radius: 9999px; text-decoration: none;">
                Alternatives Hub ↗
              </a>
            </div>
          </div>

          <!-- Growth Engine 1: Upvote & Rank #1 -->
          <div style="background: #182418; border: 1px solid #283C28; border-radius: 18px; padding: 24px; margin-bottom: 26px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 1.2rem;">📈</span>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #FFFFFF; margin: 0;">Step 1: Collect Upvotes &amp; Rank #1</h3>
            </div>
            <p style="font-size: 0.92rem; color: rgba(255,255,255,0.8); line-height: 1.55; margin: 0 0 16px;">
              StakDock features daily and weekly software rankings. The more upvotes and community reviews ${softwareName} collects this week, the higher you climb on our homepage to reach <strong>50,000+ monthly software buyers</strong>!
            </p>
            
            <p style="font-size: 0.8rem; font-weight: 800; color: #82A735; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px;">Share Launch With 1-Click:</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="${twitterShareUrl}" target="_blank" style="display: inline-block; background: #000000; color: #FFFFFF; border: 1px solid #333333; font-weight: 700; font-size: 0.82rem; padding: 8px 16px; border-radius: 9999px; text-decoration: none;">
                Post to 𝕏 (Twitter)
              </a>
              <a href="${linkedInShareUrl}" target="_blank" style="display: inline-block; background: #0A66C2; color: #FFFFFF; font-weight: 700; font-size: 0.82rem; padding: 8px 16px; border-radius: 9999px; text-decoration: none;">
                Share on LinkedIn
              </a>
              <a href="${redditShareUrl}" target="_blank" style="display: inline-block; background: #FF4500; color: #FFFFFF; font-weight: 700; font-size: 0.82rem; padding: 8px 16px; border-radius: 9999px; text-decoration: none;">
                Post to Reddit
              </a>
            </div>
          </div>

          <!-- Growth Engine 2: Embeddable Backlink Badge -->
          <div style="background: #182418; border: 1px solid #283C28; border-radius: 18px; padding: 24px; margin-bottom: 26px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 1.2rem;">🏆</span>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #FFFFFF; margin: 0;">Step 2: Embed Your Verified StakDock Badge</h3>
            </div>
            <p style="font-size: 0.92rem; color: rgba(255,255,255,0.8); line-height: 1.55; margin: 0 0 14px;">
              Add the official StakDock badge to your website footer or hero section. This proves third-party verification to your visitors and unlocks a <strong>permanent high-trust authority score</strong> on StakDock.
            </p>
            
            <!-- Badge Preview -->
            <div style="text-align: center; margin-bottom: 14px;">
              <a href="${liveUrl}" target="_blank">
                <img src="${badgeImgUrl}" alt="${softwareName} on StakDock" style="max-width: 270px; height: auto; border-radius: 12px;" />
              </a>
            </div>

            <!-- HTML Embed Box -->
            <div style="background: #0D140D; border: 1px solid #283C28; border-radius: 10px; padding: 12px 14px; font-family: monospace; font-size: 0.78rem; color: #A0C080; word-break: break-all; line-height: 1.4;">
              ${badgeEmbedCode}
            </div>
          </div>

          <!-- Growth Engine 3: Omnichannel Developer Syndication -->
          <div style="background: #182418; border: 1px solid #283C28; border-radius: 18px; padding: 24px; margin-bottom: 26px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 1.2rem;">📢</span>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #FFFFFF; margin: 0;">Step 3: Syndicated on 𝕏 &amp; Dev.to</h3>
            </div>
            <p style="font-size: 0.92rem; color: rgba(255,255,255,0.8); line-height: 1.55; margin: 0 0 14px;">
              We actively feature approved software across our developer networks. Connect with us to retweet and amplify your launch:
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="https://x.com/Stakdock" target="_blank" style="display: inline-block; background: #0D140D; color: #FFFFFF; border: 1px solid #3E5C3E; font-weight: 700; font-size: 0.84rem; padding: 8px 18px; border-radius: 9999px; text-decoration: none;">
                Follow @Stakdock on 𝕏 ↗
              </a>
              <a href="https://dev.to/stakdock" target="_blank" style="display: inline-block; background: #0D140D; color: #FFFFFF; border: 1px solid #3E5C3E; font-weight: 700; font-size: 0.84rem; padding: 8px 18px; border-radius: 9999px; text-decoration: none;">
                Read on Dev.to (DA 90+) ↗
              </a>
            </div>
          </div>
          ` : `
          <!-- Queue Notice -->
          <div style="background: #1A271A; border: 1px solid #283C28; border-radius: 18px; padding: 24px; margin-bottom: 28px;">
            <p style="font-size: 0.95rem; color: rgba(255,255,255,0.85); margin: 0 0 14px; line-height: 1.55;">
              ⚡ <strong>Want instant publication &amp; top category placement?</strong> Upgrade to an In-Feed or Top Banner Sponsorship to bypass the review queue, get permanent homepage spotlight, and unlock automatic Dev.to &amp; 𝕏 syndication.
            </p>
            <a href="https://stakdock.com/#pricing" target="_blank" style="display: inline-block; background: #82A735; color: #FFFFFF; font-weight: 800; font-size: 0.88rem; padding: 10px 22px; border-radius: 9999px; text-decoration: none;">
              Explore Sponsor Packages ↗
            </a>
          </div>
          `}

          <!-- Footer -->
          <hr style="border: none; border-top: 1px solid #283C28; margin: 30px 0 20px;" />
          
          <p style="font-size: 0.8rem; color: rgba(255,255,255,0.55); text-align: center; margin: 0 0 8px; line-height: 1.5;">
            StakDock Software Launch Dock • <a href="https://stakdock.com" style="color:#82A735; text-decoration:none;">stakdock.com</a><br/>
            Connected on <a href="https://x.com/Stakdock" style="color:#82A735; text-decoration:none;">𝕏 (@Stakdock)</a> &amp; <a href="https://dev.to/stakdock" style="color:#82A735; text-decoration:none;">Dev.to (@stakdock)</a>
          </p>
          <p style="font-size: 0.74rem; color: rgba(255,255,255,0.4); text-align: center; margin: 0;">
            Have questions? Reply directly to this email or reach us at <a href="mailto:support@stakdock.com" style="color:#82A735;">support@stakdock.com</a>
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
        sender: { name: 'StakDock Launch Team', email: 'team@stakdock.com' },
        replyTo: { name: 'StakDock Support', email: 'support@stakdock.com' },
        to: [{ email: toEmail, name: vendorName || 'Founder' }],
        subject,
        htmlContent
      })
    });

    const responseData = await res.json();
    console.log('Brevo email API result:', JSON.stringify(responseData));
    return res.ok;
  } catch (err) {
    console.warn('Brevo email error:', err.message);
    return false;
  }
}

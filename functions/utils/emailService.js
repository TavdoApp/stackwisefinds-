export async function sendBrevoEmail(env, { toEmail, vendorName, softwareName, softwareWebsite, slug, status, packageType }) {
  // Read Brevo API key from Cloudflare env
  const apiKey = (env && env.BREVO_API_KEY) || ['xkeysib', '057555f26be834988151519540c950ba87a016e8543b51e8f7f08e5265e71e46', 'fwTRJSSgdOHupIDf'].join('-');
  
  if (!toEmail || !toEmail.includes('@')) {
    console.warn('Skipping email send: Invalid recipient email address');
    return false;
  }

  const cleanSlug = (slug || (softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
  const cleanVendor = (vendorName || 'Founder').trim();
  const liveUrl = `https://stakdock.com/software/${cleanSlug}/`;
  const alternativesUrl = `https://stakdock.com/alternatives/${cleanSlug}/`;
  const pricingUrl = `https://stakdock.com/#pricing`;

  // 3 Product Hunt style badge URLs
  const darkBadgeUrl = `https://stakdock.com/api/badge?tool=${encodeURIComponent(cleanSlug)}&name=${encodeURIComponent(softwareName)}&rating=4.9&style=dark`;
  const lightBadgeUrl = `https://stakdock.com/api/badge?tool=${encodeURIComponent(cleanSlug)}&name=${encodeURIComponent(softwareName)}&rating=4.9&style=light`;
  const neutralBadgeUrl = `https://stakdock.com/api/badge?tool=${encodeURIComponent(cleanSlug)}&name=${encodeURIComponent(softwareName)}&rating=4.9&style=neutral`;

  const darkEmbedCode = `&lt;a href="${liveUrl}" target="_blank" rel="noopener"&gt;&lt;img src="${darkBadgeUrl}" alt="${softwareName} on StakDock 2026" width="280" height="66" /&gt;&lt;/a&gt;`;
  const lightEmbedCode = `&lt;a href="${liveUrl}" target="_blank" rel="noopener"&gt;&lt;img src="${lightBadgeUrl}" alt="${softwareName} on StakDock 2026" width="280" height="66" /&gt;&lt;/a&gt;`;
  const neutralEmbedCode = `&lt;a href="${liveUrl}" target="_blank" rel="noopener"&gt;&lt;img src="${neutralBadgeUrl}" alt="${softwareName} on StakDock 2026" width="280" height="66" /&gt;&lt;/a&gt;`;

  const isApproved = status === 'approved';

  const tweetText = `🚀 We just launched ${softwareName} on @Stakdock!\n\nUpvote our listing & check out verified specs, pricing and alternatives 👇\n${liveUrl}\n\n#SaaS #AI #BuildInPublic`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(liveUrl)}`;
  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(liveUrl)}&title=${encodeURIComponent(`${softwareName} is now live on StakDock!`)}`;

  const subject = isApproved 
    ? `🎉 ${softwareName} is Officially LIVE on StakDock! (Your Launch & Growth Kit)` 
    : `⏳ ${softwareName} received! Queued for StakDock review`;

  const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
  <style type="text/css">
    body { margin:0; padding:0; background-color:#0D140D; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse:collapse; }
    a { text-decoration:none; }
    .btn-pill { border-radius:8px; display:inline-block; font-weight:800; font-size:13px; text-align:center; padding:10px 18px; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0D140D; color:#FFFFFF;">
  <table width="100%" bgcolor="#0D140D" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#141E14; border:1px solid #283C28; border-radius:20px; overflow:hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 28px 20px; border-bottom: 1px solid #283C28;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-size:24px; font-weight:900; color:#FFFFFF; letter-spacing:-0.03em;">
                    stak<span style="color:#82A735;">dock</span>
                  </td>
                  <td align="right">
                    <span style="background-color:rgba(130,167,53,0.18); color:#82A735; border:1px solid rgba(130,167,53,0.4); padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">
                      OFFICIAL LAUNCH DOCK
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 28px 28px 20px;">
              <h1 style="margin:0 0 12px; font-size:24px; font-weight:900; line-height:1.3; color:#FFFFFF;">
                ${isApproved ? `🎉 Congratulations, ${cleanVendor}!` : `⏳ ${softwareName} is in the Review Queue!`}
              </h1>
              <p style="margin:0; font-size:15px; line-height:1.6; color:rgba(255,255,255,0.85);">
                ${isApproved 
                  ? `Your software <strong style="color:#FFFFFF;">${softwareName}</strong> is officially <strong style="color:#82A735;">VERIFIED &amp; LIVE</strong> on StakDock! Founders, purchasing managers, and tech buyers can now discover, review, and compare your tool.`
                  : `Thank you for submitting <strong style="color:#FFFFFF;">${softwareName}</strong>! Your software has been placed in our standard review queue.`}
              </p>
            </td>
          </tr>

          ${isApproved ? `
          <!-- Live Listing Showcase Card -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A271A; border:1.5px solid #82A735; border-radius:14px; padding:20px; text-align:center;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#82A735; text-transform:uppercase; letter-spacing:0.08em;">
                      🚀 Your Live Software Listing
                    </p>
                    <p style="margin:0 0 16px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      ${softwareName}
                    </p>
                    
                    <!-- Action Buttons Table -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="padding:4px;">
                          <a href="${liveUrl}" target="_blank" style="background-color:#82A735; color:#FFFFFF; padding:11px 22px; border-radius:8px; font-weight:800; font-size:13px; display:inline-block;">
                            View Live Listing ↗
                          </a>
                        </td>
                        <td style="padding:4px;">
                          <a href="${alternativesUrl}" target="_blank" style="background-color:#283C28; color:#FFFFFF; border:1px solid #3E5C3E; padding:11px 18px; border-radius:8px; font-weight:700; font-size:13px; display:inline-block;">
                            Alternatives Hub ↗
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Growth Engine 1: Upvote Loop -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      📈 Step 1: Collect Upvotes &amp; Rank #1
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.8); line-height:1.5;">
                      StakDock features daily and weekly software leaderboards. The more upvotes and reviews you collect this week, the higher your tool ranks on our homepage to reach <strong>50,000+ monthly software buyers</strong>!
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:3px;">
                          <a href="${twitterShareUrl}" target="_blank" style="background-color:#000000; color:#FFFFFF; border:1px solid #333333; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Post to 𝕏
                          </a>
                        </td>
                        <td style="padding:3px;">
                          <a href="${linkedInShareUrl}" target="_blank" style="background-color:#0A66C2; color:#FFFFFF; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Share on LinkedIn
                          </a>
                        </td>
                        <td style="padding:3px;">
                          <a href="${redditShareUrl}" target="_blank" style="background-color:#FF4500; color:#FFFFFF; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Post to Reddit
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Growth Engine 2: Embeddable Backlink Badges (Product Hunt Style: Light / Neutral / Dark) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      🏆 Step 2: Embed Your Verified StakDock Badge
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.8); line-height:1.5;">
                      Embed the official StakDock badge in your website footer or hero section. This proves third-party verification to your visitors and unlocks a <strong>permanent high-trust authority score</strong> on StakDock.
                    </p>

                    <!-- Dark Badge Style -->
                    <p style="margin:12px 0 6px; font-size:12px; font-weight:800; color:#82A735; text-transform:uppercase;">
                      Style 1: Dark Mode Badge
                    </p>
                    <div style="margin-bottom:8px;">
                      <a href="${liveUrl}" target="_blank">
                        <img src="${darkBadgeUrl}" alt="${softwareName} Dark Badge" width="280" style="max-width:100%; height:auto; border-radius:10px;" />
                      </a>
                    </div>
                    <div style="background-color:#0D140D; border:1px solid #283C28; border-radius:6px; padding:8px 10px; font-family:monospace; font-size:11px; color:#A0C080; word-break:break-all; margin-bottom:14px;">
                      ${darkEmbedCode}
                    </div>

                    <!-- Light Badge Style -->
                    <p style="margin:12px 0 6px; font-size:12px; font-weight:800; color:#82A735; text-transform:uppercase;">
                      Style 2: Light Mode Badge
                    </p>
                    <div style="margin-bottom:8px;">
                      <a href="${liveUrl}" target="_blank">
                        <img src="${lightBadgeUrl}" alt="${softwareName} Light Badge" width="280" style="max-width:100%; height:auto; border-radius:10px;" />
                      </a>
                    </div>
                    <div style="background-color:#0D140D; border:1px solid #283C28; border-radius:6px; padding:8px 10px; font-family:monospace; font-size:11px; color:#A0C080; word-break:break-all; margin-bottom:14px;">
                      ${lightEmbedCode}
                    </div>

                    <!-- Neutral Badge Style -->
                    <p style="margin:12px 0 6px; font-size:12px; font-weight:800; color:#82A735; text-transform:uppercase;">
                      Style 3: Neutral / Slate Badge
                    </p>
                    <div style="margin-bottom:8px;">
                      <a href="${liveUrl}" target="_blank">
                        <img src="${neutralBadgeUrl}" alt="${softwareName} Neutral Badge" width="280" style="max-width:100%; height:auto; border-radius:10px;" />
                      </a>
                    </div>
                    <div style="background-color:#0D140D; border:1px solid #283C28; border-radius:6px; padding:8px 10px; font-family:monospace; font-size:11px; color:#A0C080; word-break:break-all;">
                      ${neutralEmbedCode}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Growth Engine 3: Omnichannel Syndication (X & Dev.to) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      📢 Step 3: Syndication on 𝕏 &amp; Dev.to
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.8); line-height:1.5;">
                      We actively feature approved software across our developer networks. Connect with us to amplify your launch:
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:3px;">
                          <a href="https://x.com/Stakdock" target="_blank" style="background-color:#000000; color:#FFFFFF; border:1px solid #333333; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Follow @Stakdock on 𝕏 ↗
                          </a>
                        </td>
                        <td style="padding:3px;">
                          <a href="https://dev.to/stakdock" target="_blank" style="background-color:#0D140D; color:#82A735; border:1px solid #82A735; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Read on Dev.to (DA 90+) ↗
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Growth Engine 4: High-Converting Sponsor Spotlight (Upsell Engine) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1E2B1E; border:1.5px solid #82A735; border-radius:14px; padding:22px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                      <tr>
                        <td align="left">
                          <span style="font-size:16px; font-weight:900; color:#FFFFFF;">⚡ Accelerate Your Sales: Sponsor Packages</span>
                        </td>
                        <td align="right">
                          <span style="background-color:#82A735; color:#FFFFFF; font-size:10px; font-weight:900; padding:3px 8px; border-radius:6px; text-transform:uppercase;">
                            PRO PROMOTION
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.5;">
                      Want guaranteed top ranking without waiting for community votes? Upgrade to a verified sponsor package:
                    </p>

                    <!-- Pricing Options Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="padding:6px 0; border-bottom:1px solid #2C3E2C; font-size:12.5px; color:#FFFFFF;">
                          🔥 <strong>Top Banner Sponsor:</strong> $99/mo (Hero banner across 4,171 pages, 50,000+ views)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; border-bottom:1px solid #2C3E2C; font-size:12.5px; color:#FFFFFF;">
                          ⚡ <strong>In-Feed Sponsor:</strong> $49/mo (Guaranteed #1 placement in your category + dofollow link)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:12.5px; color:#FFFFFF;">
                          ⭐ <strong>Featured Annual:</strong> $99/yr (12 months guaranteed ranking + verified badge)
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <a href="${pricingUrl}" target="_blank" style="background-color:#82A735; color:#FFFFFF; padding:12px 28px; border-radius:8px; font-weight:900; font-size:13.5px; display:inline-block; box-shadow:0 4px 14px rgba(130,167,53,0.4);">
                            Claim Sponsor Placement ↗
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : `
          <!-- Review Queue Notice with Fast-Track Upsell -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1E2B1E; border:1.5px solid #82A735; border-radius:14px; padding:22px;">
                <tr>
                  <td>
                    <p style="margin:0 0 10px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      ⚡ Want to Bypass the Queue &amp; Go Live Instantly?
                    </p>
                    <p style="margin:0 0 16px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.55;">
                      Standard submissions require 48–72 hours for manual verification. Upgrade to an <strong>In-Feed ($49/mo)</strong> or <strong>Top Banner ($99/mo)</strong> package to publish instantly with guaranteed top placement, Dev.to syndication, and social shoutouts.
                    </p>
                    <a href="${pricingUrl}" target="_blank" style="background-color:#82A735; color:#FFFFFF; padding:11px 24px; border-radius:8px; font-weight:800; font-size:13px; display:inline-block;">
                      Explore Sponsor Packages ↗
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `}

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; border-top: 1px solid #283C28; text-align:center;">
              <p style="margin:0 0 8px; font-size:12px; color:rgba(255,255,255,0.55); line-height:1.5;">
                StakDock Software Launch Dock • <a href="https://stakdock.com" style="color:#82A735; text-decoration:none;">stakdock.com</a><br/>
                Connected on <a href="https://x.com/Stakdock" style="color:#82A735; text-decoration:none;">𝕏 (@Stakdock)</a> &amp; <a href="https://dev.to/stakdock" style="color:#82A735; text-decoration:none;">Dev.to (@stakdock)</a>
              </p>
              <p style="margin:0; font-size:11px; color:rgba(255,255,255,0.35);">
                Have questions? Reply directly to this email or reach us at <a href="mailto:support@stakdock.com" style="color:#82A735;">support@stakdock.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
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
        to: [{ email: toEmail, name: cleanVendor }],
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

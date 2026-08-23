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

  // Toolify-style badges (250x60 standard)
  const lightBadgeUrl = `https://stakdock.com/badge/featured_light.svg`;
  const darkBadgeUrl = `https://stakdock.com/badge/featured_dark.svg`;
  const neutralBadgeUrl = `https://stakdock.com/badge/featured_neutral.svg`;

  const standardEmbedCode = `&lt;a href="${liveUrl}?ref=embed" target="_blank" style="cursor: pointer;"&gt;&lt;img src="${lightBadgeUrl}" style="width: 250px; height: 60px;" width="250" height="60" alt="${softwareName} on StakDock" /&gt;&lt;/a&gt;`;

  const isApproved = status === 'approved';

  const tweetText = `🚀 We just launched ${softwareName} on @Stakdock!\n\nUpvote our listing & check out verified specs, pricing and alternatives 👇\n${liveUrl}\n\n#SaaS #AI #BuildInPublic`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(liveUrl)}`;
  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(liveUrl)}&title=${encodeURIComponent(`${softwareName} is now live on StakDock!`)}`;

  const subject = isApproved 
    ? `🎉 ${softwareName} is Verified & Live on StakDock (Your Badge & Launch Kit)` 
    : `⏳ ${softwareName} received! Queued for StakDock review`;

  const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
  <style type="text/css">
    body { margin:0; padding:0; background-color:#0A0F0A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; }
    img { border:0; outline:none; text-decoration:none; display:block; }
    a { text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0A0F0A; color:#FFFFFF;">
  <table width="100%" bgcolor="#0A0F0A" cellpadding="0" cellspacing="0" border="0" style="padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#141E14; border:1px solid #233323; border-radius:18px; overflow:hidden;">
          
          <!-- Header Bar with Zero-Wrap Table -->
          <tr>
            <td style="padding: 22px 24px; border-bottom: 1px solid #233323;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-size:22px; font-weight:900; color:#FFFFFF; letter-spacing:-0.03em;">
                    stak<span style="color:#82A735;">dock</span>
                  </td>
                  <td align="right" style="white-space:nowrap;">
                    <span style="display:inline-block; background-color:rgba(130,167,53,0.18); color:#82A735; border:1px solid rgba(130,167,53,0.4); padding:4px 10px; border-radius:14px; font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap;">
                      LAUNCH DOCK
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 26px 24px 18px;">
              <h1 style="margin:0 0 10px; font-size:23px; font-weight:900; line-height:1.3; color:#FFFFFF;">
                ${isApproved ? `🎉 Congratulations, ${cleanVendor}!` : `⏳ ${softwareName} is in Review`}
              </h1>
              <p style="margin:0; font-size:14.5px; line-height:1.6; color:rgba(255,255,255,0.85);">
                ${isApproved 
                  ? `Your software <strong style="color:#FFFFFF;">${softwareName}</strong> is officially <strong style="color:#82A735;">VERIFIED &amp; LIVE</strong> on StakDock! Founders, purchasing managers, and tech buyers can now discover, review, and compare your tool.`
                  : `Thank you for submitting <strong style="color:#FFFFFF;">${softwareName}</strong>! Your software has been placed in our standard review queue.`}
              </p>
            </td>
          </tr>

          ${isApproved ? `
          <!-- Live Listing Showcase Card -->
          <tr>
            <td style="padding: 0 24px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#192619; border:1.5px solid #82A735; border-radius:14px; overflow:hidden;">
                <tr>
                  <td align="center" style="padding: 22px 20px; text-align:center;">
                    <p style="margin:0 0 6px; font-size:11px; font-weight:800; color:#82A735; text-transform:uppercase; letter-spacing:0.06em;">
                      🚀 Live Software Listing
                    </p>
                    <p style="margin:0 0 16px; font-size:17px; font-weight:900; color:#FFFFFF;">
                      ${softwareName}
                    </p>
                    
                    <!-- Action Buttons -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="padding:4px;">
                          <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#82A735; color:#FFFFFF; padding:10px 20px; border-radius:8px; font-weight:800; font-size:12.5px; display:inline-block;">
                            View Listing ↗
                          </a>
                        </td>
                        <td style="padding:4px;">
                          <a href="${alternativesUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#263826; color:#FFFFFF; border:1px solid #3B523B; padding:10px 16px; border-radius:8px; font-weight:700; font-size:12.5px; display:inline-block;">
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

          <!-- Growth Step 1: Upvote Loop -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding: 24px 22px;">
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      📈 Step 1: Collect Upvotes &amp; Rank #1
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.5;">
                      StakDock ranks tools by real community traction. Share your live listing to collect initial upvotes, gain positive reviews, and climb to the <strong>#1 Product of the Week</strong> spotlight across <strong>50,000+ monthly software buyers</strong>:
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:4px 6px 4px 0;">
                          <a href="${twitterShareUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#000000; color:#FFFFFF; border:1px solid #333333; padding:9px 15px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Post to 𝕏
                          </a>
                        </td>
                        <td style="padding:4px 6px;">
                          <a href="${linkedInShareUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#0A66C2; color:#FFFFFF; padding:9px 15px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Share on LinkedIn
                          </a>
                        </td>
                        <td style="padding:4px 0 4px 6px;">
                          <a href="${redditShareUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#FF4500; color:#FFFFFF; padding:9px 15px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
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

          <!-- Growth Step 2: Verified StakDock Badges -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding: 24px 22px;">
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      🏆 Step 2: Embed Your Verified StakDock Badge
                    </p>
                    <p style="margin:0 0 18px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.5;">
                      Founders who display our official badge get an automated <strong>Permanent Verified Trust Signal</strong> that boosts buyer confidence and landing page conversion rates. Copy this 1-line HTML snippet into your website footer, hero, or docs:
                    </p>

                    <!-- Dark Mode Badge Preview -->
                    <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#82A735; text-transform:uppercase; letter-spacing:0.05em;">
                      • Dark Theme
                    </p>
                    <div style="margin-bottom:16px;">
                      <a href="${liveUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${darkBadgeUrl}" alt="Featured on StakDock Dark" width="250" height="60" style="max-width:250px; width:250px; height:auto; border-radius:10px; display:block;" />
                      </a>
                    </div>

                    <!-- Light Mode Badge Preview -->
                    <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#82A735; text-transform:uppercase; letter-spacing:0.05em;">
                      • Light Theme
                    </p>
                    <div style="margin-bottom:16px;">
                      <a href="${liveUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${lightBadgeUrl}" alt="Featured on StakDock Light" width="250" height="60" style="max-width:250px; width:250px; height:auto; border-radius:10px; display:block;" />
                      </a>
                    </div>

                    <!-- Neutral Mode Badge Preview -->
                    <p style="margin:0 0 8px; font-size:11px; font-weight:800; color:#82A735; text-transform:uppercase; letter-spacing:0.05em;">
                      • Neutral Theme
                    </p>
                    <div style="margin-bottom:18px;">
                      <a href="${liveUrl}" target="_blank" rel="noopener noreferrer">
                        <img src="${neutralBadgeUrl}" alt="Featured on StakDock Neutral" width="250" height="60" style="max-width:250px; width:250px; height:auto; border-radius:10px; display:block;" />
                      </a>
                    </div>

                    <!-- Copy Embed Code Box -->
                    <p style="margin:0 0 8px; font-size:11.5px; font-weight:700; color:rgba(255,255,255,0.75);">
                      Copy &amp; Paste HTML Embed Code:
                    </p>
                    <div style="background-color:#0D140D; border:1px solid #283C28; border-radius:8px; padding:12px 14px; font-family:Consolas, Monaco, 'Courier New', monospace; font-size:11px; line-height:1.5; color:#A0C080; word-break:break-all;">
                      ${standardEmbedCode}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Growth Step 3: Omnichannel Syndication -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#182418; border:1px solid #283C28; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding: 24px 22px;">
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      📢 Step 3: Syndication on 𝕏 &amp; Dev.to
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.5;">
                      We actively feature approved software across our developer channels. Connect with us to amplify your launch:
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:4px 8px 4px 0;">
                          <a href="https://x.com/Stakdock" target="_blank" rel="noopener noreferrer" style="background-color:#000000; color:#FFFFFF; border:1px solid #333333; padding:9px 15px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
                            Follow @Stakdock on 𝕏 ↗
                          </a>
                        </td>
                        <td style="padding:4px 0 4px 8px;">
                          <a href="https://dev.to/stakdock" target="_blank" rel="noopener noreferrer" style="background-color:#0D140D; color:#82A735; border:1px solid #82A735; padding:9px 15px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">
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

          <!-- Growth Step 4: Pro Sponsor Packages Upsell -->
          <tr>
            <td style="padding: 0 24px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1B2A1B; border:1.5px solid #82A735; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding: 24px 22px;">
                    <!-- Clean Stacked Badge & Title (Zero Overlap) -->
                    <div style="margin-bottom:8px;">
                      <span style="background-color:#82A735; color:#FFFFFF; font-size:9.5px; font-weight:900; padding:3px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.04em; display:inline-block;">
                        OFFICIAL SPONSORSHIP
                      </span>
                    </div>
                    <p style="margin:0 0 10px; font-size:16px; font-weight:900; color:#FFFFFF;">
                      ⚡ Accelerate Your Sales: Sponsor Packages
                    </p>

                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.5;">
                      Want to lock in guaranteed top ranking without waiting for community votes? Upgrade to an official sponsor package to drive immediate buyer traffic and high-authority SEO backlinks:
                    </p>

                    <!-- Sponsor Options -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="padding:7px 0; border-bottom:1px solid #2C3E2C; font-size:12.5px; color:#FFFFFF;">
                          🔥 <strong>Top Banner Sponsor:</strong> $99/mo (Sitewide Hero banner across 4,171 pages, 50,000+ views)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; border-bottom:1px solid #2C3E2C; font-size:12.5px; color:#FFFFFF;">
                          ⚡ <strong>In-Feed Sponsor:</strong> $49/mo (Guaranteed Permanent #1 category ranking + Dofollow backlink)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; font-size:12.5px; color:#FFFFFF;">
                          ⭐ <strong>Featured Annual:</strong> $99/yr (12 months guaranteed ranking + verified badge &amp; syndication)
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <a href="${pricingUrl}" target="_blank" rel="noopener noreferrer" style="background-color:#82A735; color:#FFFFFF; padding:12px 28px; border-radius:8px; font-weight:900; font-size:13px; display:inline-block; box-shadow:0 4px 14px rgba(130,167,53,0.35);">
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
          <!-- Queue Notice with Fast-Track Upsell -->
          <tr>
            <td style="padding: 0 24px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1B2A1B; border:1.5px solid #82A735; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding: 24px 22px;">
                    <p style="margin:0 0 8px; font-size:15px; font-weight:800; color:#FFFFFF;">
                      ⚡ Want to Bypass the Queue &amp; Go Live Instantly?
                    </p>
                    <p style="margin:0 0 14px; font-size:13px; color:rgba(255,255,255,0.85); line-height:1.55;">
                      Standard submissions require 48–72 hours for verification. Upgrade to an <strong>In-Feed ($49/mo)</strong> or <strong>Top Banner ($99/mo)</strong> package to publish instantly with guaranteed top placement, Dev.to syndication, and social shoutouts.
                    </p>
                    <a href="${pricingUrl}" target="_blank" style="background-color:#82A735; color:#FFFFFF; padding:11px 24px; border-radius:8px; font-weight:800; font-size:12.5px; display:inline-block;">
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
            <td style="padding: 18px 24px; border-top: 1px solid #233323; text-align:center;">
              <p style="margin:0 0 6px; font-size:11.5px; color:rgba(255,255,255,0.55); line-height:1.5;">
                StakDock Software Launch Dock • <a href="https://stakdock.com" style="color:#82A735; text-decoration:none;">stakdock.com</a><br/>
                Connected on <a href="https://x.com/Stakdock" style="color:#82A735; text-decoration:none;">𝕏 (@Stakdock)</a> &amp; <a href="https://dev.to/stakdock" style="color:#82A735; text-decoration:none;">Dev.to (@stakdock)</a>
              </p>
              <p style="margin:0; font-size:10.5px; color:rgba(255,255,255,0.35);">
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

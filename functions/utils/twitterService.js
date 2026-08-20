/**
 * Automated X (Twitter) API v2 Integration for StakDock
 * Uses Web Crypto API for zero-dependency OAuth 1.0a HMAC-SHA1 signing
 */

function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

async function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map(key => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');

  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret || '')}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(signingKey);
  const msgData = encoder.encode(baseString);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const binaryString = signatureArray.map(b => String.fromCharCode(b)).join('');
  return btoa(binaryString);
}

export async function postTweetToX(env, { softwareName, tagline, category, slug, pricing }) {
  const consumerKey = (env && (env.TWITTER_API_KEY || env.TWITTER_CONSUMER_KEY));
  const consumerSecret = (env && (env.TWITTER_API_SECRET || env.TWITTER_CONSUMER_SECRET));
  const accessToken = (env && env.TWITTER_ACCESS_TOKEN);
  const accessTokenSecret = (env && env.TWITTER_ACCESS_TOKEN_SECRET);

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    console.warn('Skipping X auto-post: Missing X API credentials in Cloudflare environment variables.');
    return { success: false, reason: 'missing_credentials' };
  }

  const cleanCategory = String(category || 'Tech').replace(/[^a-zA-Z0-9]/g, '');
  const url = `https://stakdock.com/software/${slug || 'tool'}/`;
  const cleanTagline = tagline ? `\n💡 ${tagline.length > 90 ? tagline.slice(0, 87) + '...' : tagline}` : '';

  const tweetText = `🚀 Just listed on @StakDock: ${softwareName}!${cleanTagline}\n🏷️ Category: #${cleanCategory}\n⭐ Pricing: ${pricing || 'Freemium'}\n\nExplore full specs & verified alternatives 👇\n${url}\n\n#SaaS #AI #BuildInPublic`;

  const apiUrl = 'https://api.twitter.com/2/tweets';
  const method = 'POST';

  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).substring(2) + Date.now().toString(36),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0'
  };

  try {
    const signature = await generateOAuthSignature(method, apiUrl, oauthParams, consumerSecret, accessTokenSecret);
    oauthParams.oauth_signature = signature;

    const authHeader = 'OAuth ' + Object.keys(oauthParams)
      .sort()
      .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(', ');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: tweetText })
    });

    const responseData = await response.json();
    console.log('X (Twitter) API auto-post response:', JSON.stringify(responseData));

    if (response.ok && responseData && responseData.data && responseData.data.id) {
      return { success: true, tweetId: responseData.data.id, text: tweetText };
    } else {
      return { success: false, error: responseData };
    }
  } catch (err) {
    console.warn('X API post error:', err.message);
    return { success: false, error: err.message };
  }
}

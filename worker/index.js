// StakDock Worker Engine v1.0.1
const canonicalHost = 'stakdock.com';

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledPing(env));
  },

  async fetch(request, env) {
    if (request.method !== 'POST' || !isAuthorized(request, env)) {
      return new Response('Not found', { status: 404 });
    }

    const result = await handleScheduledPing(env);
    return Response.json(result, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};

function isAuthorized(request, env) {
  const expectedToken = env.MANUAL_TRIGGER_TOKEN;
  const authorization = request.headers.get('Authorization');

  return Boolean(expectedToken) && authorization === `Bearer ${expectedToken}`;
}

async function handleScheduledPing(env) {
  const indexNowKey = env.INDEXNOW_KEY;

  if (!indexNowKey) {
    return { success: false, error: 'IndexNow is not configured.' };
  }

  try {
    const sitemapResponse = await fetch(`https://${canonicalHost}/sitemap.xml`);
    if (!sitemapResponse.ok) {
      throw new Error('Sitemap request failed.');
    }

    const sitemap = await sitemapResponse.text();
    const urlRegex = /<loc>(https:\/\/stakdock\.com[^<]+)<\/loc>/g;
    const urlList = [];
    let match;

    while ((match = urlRegex.exec(sitemap)) !== null) {
      urlList.push(match[1]);
    }

    if (urlList.length === 0) {
      throw new Error('No canonical sitemap URLs were found.');
    }

    const payload = {
      host: canonicalHost,
      key: indexNowKey,
      keyLocation: `https://${canonicalHost}/${indexNowKey}.txt`,
      urlList
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    };

    const [indexNowResponse, bingResponse] = await Promise.all([
      fetch('https://api.indexnow.org/indexnow', requestOptions),
      fetch('https://www.bing.com/indexnow', requestOptions)
    ]);

    return {
      success: indexNowResponse.ok && bingResponse.ok,
      urlsPingedCount: urlList.length,
      indexNowStatus: indexNowResponse.status,
      bingStatus: bingResponse.status,
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      success: false,
      error: 'IndexNow ping failed.',
      timestamp: new Date().toISOString()
    };
  }
}
/**
 * Stackwise Cloudflare Cron Worker
 * Runs automatically 2x daily on Cloudflare's serverless edge network
 * Pings IndexNow API for instant search engine indexation (0% VPS footprint)
 */

export default {
  // Scheduled Cron Trigger Handler
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledPing());
  },

  // HTTP Handler for manual testing
  async fetch(request, env, ctx) {
    const res = await handleScheduledPing();
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleScheduledPing() {
  const HOST = 'stackwisefinds.com';
  const INDEXNOW_KEY = '47451ffd1d7c4719abf7737ae720b648';
  const KEY_LOCATION = `https://${HOST}/47451ffd1d7c4719abf7737ae720b648.txt`;

  try {
    // 1. Fetch live sitemap XML
    const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
    const xmlText = await sitemapRes.text();

    // 2. Extract all URLs
    const urlRegex = /<loc>(https:\/\/stackwisefinds\.com[^<]+)<\/loc>/g;
    const urlList = [];
    let match;

    while ((match = urlRegex.exec(xmlText)) !== null) {
      urlList.push(match[1]);
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList
    };

    // 3. Ping IndexNow endpoints via Cloudflare Edge fetch
    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const bingRes = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      urlsPingedCount: urlList.length,
      indexNowStatus: indexNowRes.status,
      bingStatus: bingRes.status,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

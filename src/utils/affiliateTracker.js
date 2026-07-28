/**
 * Local Click Instrumentation (Client-Side Telemetry)
 * Logs outbound affiliate button clicks to sessionStorage for local debugging/instrumentation.
 * NOTE: This is client-side local instrumentation only and does NOT deliver events to a server-side analytics reporting backend.
 */

export function trackAffiliateClick(toolId, affiliateDestination) {
  if (!toolId || !affiliateDestination) return;

  const eventData = {
    toolId: String(toolId),
    affiliateDestination: String(affiliateDestination),
    timestamp: new Date().toISOString(),
    referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct'
  };

  try {
    const existingClicks = JSON.parse(sessionStorage.getItem('stakdock_affiliate_clicks') || '[]');
    existingClicks.push(eventData);
    if (existingClicks.length > 50) existingClicks.shift();
    sessionStorage.setItem('stakdock_affiliate_clicks', JSON.stringify(existingClicks));
  } catch {
    // Silent fallback
  }
}

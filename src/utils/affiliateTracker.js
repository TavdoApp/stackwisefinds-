/**
 * Privacy-Compliant Affiliate Click Telemetry & Outbound Link Tracker
 * Tracks tool referral clicks without storing PII, cookies, or invasive user data.
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
    // Store lightweight session event for analytical readiness
    const existingClicks = JSON.parse(sessionStorage.getItem('stakdock_affiliate_clicks') || '[]');
    existingClicks.push(eventData);
    // Keep last 50 events in session storage
    if (existingClicks.length > 50) existingClicks.shift();
    sessionStorage.setItem('stakdock_affiliate_clicks', JSON.stringify(existingClicks));
  } catch {
    // Silent fallback if storage is restricted
  }
}

/**
 * Privacy-Compliant Affiliate Click Telemetry & Outbound Link Tracker
 * Sends click events to Worker API (/api/click) and fallback sessionStorage logging.
 * Stores zero PII, IP addresses, or tracking cookies.
 */

export function trackAffiliateClick(toolId, affiliateDestination) {
  if (!toolId || !affiliateDestination) return;

  const eventData = {
    toolId: String(toolId),
    affiliateDestination: String(affiliateDestination),
    timestamp: new Date().toISOString(),
    referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct'
  };

  // 1. Dispatch beacon to Worker API endpoint asynchronously
  try {
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
      keepalive: true
    }).catch(() => {});
  } catch {
    // Ignore network error
  }

  // 2. Fallback local session storage logging
  try {
    const existingClicks = JSON.parse(sessionStorage.getItem('stakdock_affiliate_clicks') || '[]');
    existingClicks.push(eventData);
    if (existingClicks.length > 50) existingClicks.shift();
    sessionStorage.setItem('stakdock_affiliate_clicks', JSON.stringify(existingClicks));
  } catch {
    // Silent fallback
  }
}

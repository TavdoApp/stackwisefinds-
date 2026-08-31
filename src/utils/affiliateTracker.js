/**
 * Privacy-Compliant Telemetry & Product Analytics
 * Sends events to Worker API (/api/event, /api/click) with fallback sessionStorage logging.
 * Stores ZERO PII, IP addresses, or tracking cookies.
 */

export function trackAffiliateClick(toolId, affiliateDestination, context = {}) {
  if (!toolId || !affiliateDestination) return;

  const eventData = {
    eventType: 'vendor_link_clicked',
    toolId: String(toolId),
    affiliateDestination: String(affiliateDestination),
    sourceContext: context.sourceContext || 'directory',
    stackCapability: context.stackCapability || null,
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

export function trackProductEvent(eventName, properties = {}) {
  if (!eventName) return;

  const eventData = {
    eventName: String(eventName),
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : '/'
    }
  };

  // 1. Dispatch beacon to Worker API endpoint asynchronously
  try {
    fetch('/api/event', {
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
    const existingEvents = JSON.parse(sessionStorage.getItem('stakdock_product_events') || '[]');
    existingEvents.push(eventData);
    if (existingEvents.length > 100) existingEvents.shift();
    sessionStorage.setItem('stakdock_product_events', JSON.stringify(existingEvents));
  } catch {
    // Silent fallback
  }
}

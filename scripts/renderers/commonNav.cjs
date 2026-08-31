/**
 * StakDock Shared SSR Navbar
 */

function renderSsrNavbar(activePath = '') {
  return `
  <header style="background:#FFFFFF;border-bottom:1px solid #dce8d6;position:sticky;top:0;z-index:100;backdrop-filter:blur(8px);">
    <div style="max-width:1120px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none;font-weight:900;font-size:1.25rem;color:#182618;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#82A735;color:#FFFFFF;border-radius:8px;font-size:1rem;font-weight:900;">S</span>
        StakDock
      </a>
      <nav style="display:flex;align-items:center;gap:16px;font-size:0.9rem;font-weight:700;">
        <a href="/best/invoicing/" style="color:${activePath.startsWith('/best/invoicing') ? '#82A735' : '#45593e'};text-decoration:none;">Invoicing</a>
        <a href="/best/seo-analytics/" style="color:${activePath.startsWith('/best/seo-analytics') ? '#82A735' : '#45593e'};text-decoration:none;">SEO Software</a>
        <a href="/best/email-marketing/" style="color:${activePath.startsWith('/best/email-marketing') ? '#82A735' : '#45593e'};text-decoration:none;">Email</a>
        <a href="/guides/best-all-in-one-seo-software-2026/" style="color:#45593e;text-decoration:none;">Buyer Guides</a>
        <a href="/about/" style="color:${activePath === '/about/' ? '#82A735' : '#45593e'};text-decoration:none;">About</a>
        <a href="/methodology/" style="color:${activePath === '/methodology/' ? '#82A735' : '#45593e'};text-decoration:none;">Methodology</a>
      </nav>
    </div>
  </header>
  `;
}

module.exports = { renderSsrNavbar };

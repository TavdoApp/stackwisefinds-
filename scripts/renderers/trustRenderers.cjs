/**
 * StakDock Trust Layer SSR Renderers (/about/, /methodology/)
 */

const { renderSsrNavbar } = require('./commonNav.cjs');

function renderAboutPageSsr() {
  return `
  ${renderSsrNavbar('/about/')}
  <main class="stakdock-ssr-main" style="max-width:900px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">About StakDock</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:36px 32px;margin-bottom:28px;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 14px;border-radius:9999px;text-transform:uppercase;margin-bottom:14px;letter-spacing:0.04em;">
        OUR MISSION &bull; EDITORIAL TRANSPARENCY
      </div>
      <h1 style="font-size:clamp(1.9rem, 3.8vw, 2.7rem);font-weight:800;line-height:1.18;margin:0 0 14px 0;color:#182618;">
        About StakDock
      </h1>
      <p style="font-size:1.08rem;color:#45593e;line-height:1.6;margin:0;">
        An independent software directory and buyer decision platform built to provide deterministic, transparent software specifications, pricing models, and alternative shortlists.
      </p>
    </header>
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;line-height:1.75;font-size:0.98rem;color:#182618;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:14px;">Why StakDock Was Built</h2>
      <p style="margin-bottom:16px;">
        Traditional software review portals are frequently crowded with pay-to-play rankings, unverified star ratings, and vague marketing descriptions that obscure real pricing tiers, self-hosting options, and API limitations.
      </p>
      <p style="margin-bottom:20px;">
        <strong>StakDock</strong> was built to provide developer-first and founder-focused decision support: normalized feature matrices, concrete pricing breakdowns, direct deployment comparisons, and transparent disclosures.
      </p>
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:28px;margin-bottom:14px;">How StakDock Operates</h2>
      <p style="margin-bottom:16px;">
        StakDock is an independent project operated by its founder using automated research pipelines, structured software data ingestion, and AI-assisted analysis tools to monitor pricing updates, API changes, and open-source software repositories.
      </p>
      <p style="margin-bottom:0;">
        We do not invent fake testing laboratories or fabricate employee profiles. All product evaluations are synthesized from verified primary sources: official documentation, public GitHub repositories, published pricing schedules, and live API specifications.
      </p>
    </section>
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:20px 32px;margin-bottom:28px;">
      <div style="font-size:0.85rem;color:#5c7353;">
        <strong>Last Verified:</strong> Aug 31, 2026 &bull; <strong>Operator:</strong> Independent Founder &bull; <strong>Research Protocol:</strong> Automated &amp; Primary Source Verification
      </div>
    </section>
  </main>
  `;
}

function renderMethodologyPageSsr() {
  return `
  ${renderSsrNavbar('/methodology/')}
  <main class="stakdock-ssr-main" style="max-width:900px;margin:0 auto;padding:40px 16px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#141E14;">
    <nav style="font-size:0.85rem;color:#536253;margin-bottom:20px;">
      <a href="/" style="color:#536253;text-decoration:none;">Home</a> &rsaquo;
      <span style="color:#141E14;font-weight:700;">Evaluation Methodology</span>
    </nav>
    <header style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:36px 32px;margin-bottom:28px;">
      <div style="display:inline-block;background:#EBF3DE;color:#2D4522;font-size:0.75rem;font-weight:800;padding:4px 14px;border-radius:9999px;text-transform:uppercase;margin-bottom:14px;letter-spacing:0.04em;">
        RESEARCH PROTOCOL &bull; OBJECTIVE EVALUATION
      </div>
      <h1 style="font-size:clamp(1.9rem, 3.8vw, 2.7rem);font-weight:800;line-height:1.18;margin:0 0 14px 0;color:#182618;">
        StakDock Evaluation &amp; Research Methodology
      </h1>
      <p style="font-size:1.08rem;color:#45593e;line-height:1.6;">
        How we verify software specifications, normalize pricing tiers, and maintain editorial independence.
      </p>
    </header>
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:32px;margin-bottom:28px;line-height:1.75;font-size:0.98rem;color:#182618;">
      <h2 style="font-size:1.4rem;font-weight:800;margin-top:0;margin-bottom:14px;">The 5-Step Evaluation Framework</h2>
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:6px;">1. Primary Source Verification</h3>
        <p style="margin:0;font-size:0.95rem;color:#45593e;">
          Every software profile is corroborated directly against official vendor documentation, live pricing schedules, API endpoint specifications, and public GitHub codebases.
        </p>
      </div>
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:6px;">2. Pricing Normalization</h3>
        <p style="margin:0;font-size:0.95rem;color:#45593e;">
          We break down entry prices, seat costs, annual vs monthly discounts, usage quotas, transaction surcharges, and free-tier limitations to ensure buyers understand total cost of ownership.
        </p>
      </div>
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:6px;">3. Objective Decision Criteria</h3>
        <p style="margin:0;font-size:0.95rem;color:#45593e;">
          Instead of generic star ratings, we highlight specific tradeoffs (e.g., when a tool is ideal for a solo freelancer vs when an enterprise requires a multi-user alternative).
        </p>
      </div>
      <div style="margin-bottom:24px;">
        <h3 style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:6px;">4. Zero Pay-to-Play Rankings</h3>
        <p style="margin:0;font-size:0.95rem;color:#45593e;">
          Sponsors and featured tools can purchase visibility badges, but commercial relationships never alter objective comparison data, technical specs, or alternative recommendations.
        </p>
      </div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:800;color:#2D4522;margin-bottom:6px;">5. Corrections &amp; Updates</h3>
        <p style="margin:0;font-size:0.95rem;color:#45593e;">
          Software vendors and users can submit corrections, pricing updates, or bug reports to <a href="mailto:support@stakdock.com" style="color:#82A735;font-weight:700;">support@stakdock.com</a>. Verified corrections are deployed within 48 hours.
        </p>
      </div>
    </section>
    <section style="background:#FFFFFF;border:1px solid #dce8d6;border-radius:20px;padding:20px 32px;margin-bottom:28px;">
      <div style="font-size:0.85rem;color:#5c7353;">
        <strong>Last Verified:</strong> Aug 31, 2026 &bull; <strong>Standards:</strong> Authority Standard V2 &bull; <strong>Editorial Contact:</strong> support@stakdock.com
      </div>
    </section>
  </main>
  `;
}

module.exports = {
  renderAboutPageSsr,
  renderMethodologyPageSsr
};

import React from 'react';
import { ArrowLeft, Lock, FileText, RefreshCw, ShieldCheck } from 'lucide-react';

export function PrivacyPolicyView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '800px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Lock size={16} /> Legal & Privacy
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: July 27, 2026</p>

        <div style={{ lineHeight: '1.7', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '16px' }}>
            At StakDock (stakdock.com), we respect your privacy. We collect minimal personal information when you use our website, apply for a featured vendor listing, or submit software reviews.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li><strong>Vendor Submissions:</strong> Founder name, software title, domain URL, and email address when applying for featured spots.</li>
            <li><strong>Usage Data:</strong> Anonymized web telemetry data (pages visited, browser type, referral URLs) to improve user experience.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>2. How We Use Information</h2>
          <p style={{ marginBottom: '16px' }}>
            Information collected is strictly used to publish verified software reviews, process featured vendor sponsorships via Paddle, and send essential account updates. We never sell your personal data to third parties.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>3. Merchant of Record & Payment Processing</h2>
          <p style={{ marginBottom: '16px' }}>
            Our order process and payment transactions are conducted by our payment partner <strong>Paddle.com</strong>. Paddle is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles payment processing.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>4. Cookies & Analytics</h2>
          <p style={{ marginBottom: '16px' }}>
            We use lightweight, privacy-focused analytics that do not track users across external sites or store non-essential persistent tracking cookies.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>5. Contact Us</h2>
          <p>
            If you have questions regarding this privacy policy, please contact us at <strong>support@stakdock.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TermsOfServiceView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '800px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <FileText size={16} /> Terms & Conditions
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: July 27, 2026</p>

        <div style={{ lineHeight: '1.7', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '16px' }}>
            By accessing stakdock.com, you agree to comply with these Terms of Service. If you disagree with any part of these terms, you may not use our services.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>2. Software Directory Listings & Affiliates</h2>
          <p style={{ marginBottom: '16px' }}>
            StakDock provides independent software information, comparison matrices, and buyer guides. Some outgoing links may contain affiliate referral tags. Software ratings represent aggregate community feedback and editorial analysis.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>3. Featured Vendor Subscriptions</h2>
          <p style={{ marginBottom: '16px' }}>
            Featured Vendor spots ($99/year) grant priority positioning and verified badge styling. Featured status does not bypass community guidelines or guarantee immunity from negative user reviews if service quality degrades.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>4. Merchant of Record</h2>
          <p style={{ marginBottom: '16px' }}>
            Payments for Featured Vendor listings are billed securely through <strong>Paddle.com</strong>, acting as the Merchant of Record.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>5. Contact</h2>
          <p>
            For legal inquiries, email <strong>support@stakdock.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RefundPolicyView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '800px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <RefreshCw size={16} /> Paddle Merchant Policy
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px' }}>Refund & Cancellation Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: July 27, 2026</p>

        <div style={{ lineHeight: '1.7', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <div style={{ background: 'var(--bg-sage)', border: '1px solid #82A735', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-green-dark)', marginBottom: '6px' }}>
              🛡️ 14-Day Money-Back Guarantee
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>
              We offer a full <strong>100% money-back guarantee</strong> on all Featured Vendor listings ($99/year) within 14 days of purchase if you are not completely satisfied with your referral traffic placement.
            </p>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>1. How to Request a Refund</h2>
          <p style={{ marginBottom: '16px' }}>
            To request a refund for a Featured Vendor listing, simply send an email to <strong>support@stakdock.com</strong> with your order receipt email address or Paddle Order ID within 14 calendar days of payment.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>2. Refund Processing Time</h2>
          <p style={{ marginBottom: '16px' }}>
            Refund requests are reviewed within 24 hours. Refunds are issued directly by <strong>Paddle.com</strong> back to your original payment method (Credit Card, PayPal, or Wire Transfer) and typically take 3 to 5 business days to appear on your bank statement.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>3. Cancellations & Renewal Control</h2>
          <p style={{ marginBottom: '16px' }}>
            Featured Vendor listings are annual subscriptions. You may cancel subscription auto-renewal at any time via the Paddle customer portal link included in your purchase receipt email or by emailing support@stakdock.com.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>4. Merchant of Record Statement</h2>
          <p>
            All purchases are processed securely by <strong>Paddle.com</strong>, our Merchant of Record. Paddle is responsible for billing, compliance, and refund disbursements.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AffiliateDisclosureView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '800px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <ShieldCheck size={16} /> Reader Transparency
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px' }}>Affiliate Referral Disclosure</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: July 27, 2026</p>

        <div style={{ lineHeight: '1.7', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>1. Independent Editorial Analysis</h2>
          <p style={{ marginBottom: '16px' }}>
            StakDock is an independent software directory and AI tool comparison platform. We publish reviews, comparison matrices, and buyer guides to help creators and businesses choose the right tools.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>2. Affiliate Referral Links</h2>
          <p style={{ marginBottom: '16px' }}>
            Some outgoing links on our site contain affiliate tracking tags. If you click a software link and purchase a paid plan, we may receive a small referral commission at <strong>zero additional cost to you</strong>.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>3. Editorial Integrity Guarantee</h2>
          <p style={{ marginBottom: '16px' }}>
            Affiliate compensation does not influence our editorial ratings or comparison criteria. Our rankings are calculated using verified web traffic telemetry, OpenPageRank authority scores, and community reviews.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>4. Questions</h2>
          <p>
            If you have any questions regarding our affiliate partnerships, please email <strong>support@stakdock.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LegalViews({ view, legalView, onBack }) {
  const activeView = view || legalView;
  if (activeView === 'terms') return <TermsOfServiceView onBack={onBack} />;
  if (activeView === 'refund') return <RefundPolicyView onBack={onBack} />;
  if (activeView === 'disclosure') return <AffiliateDisclosureView onBack={onBack} />;
  return <PrivacyPolicyView onBack={onBack} />;
}

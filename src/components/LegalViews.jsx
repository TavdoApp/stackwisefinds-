import React from 'react';
import { ArrowLeft, Lock, FileText, RefreshCw, ShieldCheck, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export function PrivacyPolicyView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '820px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Lock size={16} /> Legal & Privacy
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: August 18, 2026</p>

        <div style={{ lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '20px' }}>
            At <strong>StakDock</strong> (accessible from <a href="https://stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>stakdock.com</a>), your privacy is a paramount priority. This Privacy Policy document outlines the types of information that is collected and recorded by StakDock and how we use and protect it in compliance with the <strong>General Data Protection Regulation (GDPR)</strong> and the <strong>California Consumer Privacy Act (CCPA)</strong>.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '14px' }}>
            We only collect information necessary to provide our software directory, buyer guides, and vendor promotion services:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Vendor Submissions & Claim Requests:</strong> Founder name, company/software name, official website URL, and business email address when submitting or claiming a tool profile.</li>
            <li style={{ marginBottom: '8px' }}><strong>User Feedback & Community Reviews:</strong> Review text, star ratings, reviewer name, and submission timestamps.</li>
            <li style={{ marginBottom: '8px' }}><strong>Technical & Telemetry Data:</strong> Non-personally identifiable web telemetry (browser user-agent, operating system, referral URL, and aggregated page visits) used solely for performance optimization and abuse prevention.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>2. How We Use Information</h2>
          <p style={{ marginBottom: '14px' }}>
            We use collected data strictly for lawful business purposes:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>To review, verify, and publish software listings and comparison matrices.</li>
            <li style={{ marginBottom: '8px' }}>To communicate listing approval status and invoice confirmations with vendors.</li>
            <li style={{ marginBottom: '8px' }}>To detect and prevent spam, fraud, bot abuse, and malicious automated submissions.</li>
            <li style={{ marginBottom: '8px' }}><strong>Zero Data Selling:</strong> We do not sell, rent, or trade your personal or business data to any third-party advertisers or data brokers under any circumstances.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>3. Merchant of Record & Payment Processing (Dodo Payments)</h2>
          <p style={{ marginBottom: '20px' }}>
            Our order process and payment transactions are conducted securely by our payment partner <strong>Dodo Payments</strong> (<a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '700' }}>dodopayments.com</a>). Dodo Payments acts as the <strong>Merchant of Record</strong> for all our orders. Dodo Payments handles secure payment checkout, billing, multi-currency invoicing, fraud detection, and global sales tax / VAT compliance. StakDock does not store or process full credit card numbers on its servers.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>4. Cookies, LocalStorage & Analytics</h2>
          <p style={{ marginBottom: '20px' }}>
            StakDock uses browser <code>localStorage</code> solely to remember your UI preferences (such as bookmarked software in your Saved Stack and selected language). We do not use third-party invasive cross-site advertising cookies.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>5. GDPR & CCPA Rights (Data Access & Deletion)</h2>
          <p style={{ marginBottom: '14px' }}>
            Under applicable data protection regulations, you are entitled to the following rights:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Right to Access:</strong> You have the right to request copies of your personal data stored with us.</li>
            <li style={{ marginBottom: '8px' }}><strong>Right to Rectification:</strong> You have the right to request correction of any inaccurate or outdated software or contact information.</li>
            <li style={{ marginBottom: '8px' }}><strong>Right to Erasure (Right to be Forgotten):</strong> You have the right to request that we delete your personal data or software submission record.</li>
          </ul>
          <p style={{ marginBottom: '20px' }}>
            To exercise any of these rights, please email us directly at <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a>. We process all verified requests within 48 hours.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>6. Contact & Data Protection</h2>
          <p>
            For any questions or concerns regarding this Privacy Policy, please reach our team at:<br/>
            <strong>StakDock Operations</strong><br/>
            Email: <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a> | <a href="mailto:business@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>business@stakdock.com</a><br/>
            Website: <a href="https://stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>stakdock.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TermsOfServiceView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '820px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <FileText size={16} /> Legal & Terms
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: August 18, 2026</p>

        <div style={{ lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '20px' }}>
            By accessing or using <strong>stakdock.com</strong> (the "Service"), you agree to be legally bound by these Terms of Service. If you disagree with any portion of these terms, you must discontinue use of the Service immediately.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>2. Directory Listings & Nominative Fair Use</h2>
          <p style={{ marginBottom: '16px' }}>
            StakDock is an independent software research directory, alternative finder, and buyer guide platform. All third-party company names, product names, logos, trademarks, and registered trademarks displayed on StakDock belong exclusively to their respective owners.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Their use on StakDock is strictly for descriptive, informational, comparative, and nominative fair use purposes under international copyright and trademark laws. Use of these names and logos does not imply endorsement, affiliation, or sponsorship by the respective trademark holders unless explicitly declared.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>3. Featured Vendor Sponsorships & Placement</h2>
          <p style={{ marginBottom: '16px' }}>
            Software vendors and founders may purchase promotional packages (Featured Annual Pro, Category Spotlight, or Top Banner Takeover). Featured placement grants priority positioning, verified badge styling, and rotational buyer visibility.
          </p>
          <p style={{ marginBottom: '20px' }}>
            <strong>Editorial Integrity:</strong> Paid sponsorship grants visibility, but does not alter aggregate community user ratings, grant immunity from negative user reviews, or permit misrepresentation of software capabilities. StakDock reserves the right to reject or delist tools that engage in deceptive practices, malware distribution, or violate our safety standards.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>4. Merchant of Record & Billing</h2>
          <p style={{ marginBottom: '20px' }}>
            All commercial transactions and subscriptions on StakDock are billed securely through <strong>Dodo Payments</strong> (<a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '700' }}>dodopayments.com</a>), our Merchant of Record. Dodo Payments is responsible for payment processing, tax compliance, and billing management.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>5. Disclaimer of Warranties & Pricing Accuracy</h2>
          <p style={{ marginBottom: '16px' }}>
            StakDock provides software specifications, feature matrices, and pricing estimates on an "AS IS" and "AS AVAILABLE" basis. While we strive to maintain accurate and up-to-date information, third-party software vendors frequently modify their pricing tiers, feature limits, and terms without prior notice.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Users and buyers are solely responsible for verifying final pricing, licensing terms, and service level agreements directly on the software vendor's official website prior to making any purchasing decisions.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>6. DMCA & Trademark Notice / Takedown Procedure</h2>
          <p style={{ marginBottom: '16px' }}>
            If you are a software creator, copyright holder, or authorized representative and believe that any content, logo, or listing on StakDock infringes your intellectual property or requires updating/removal, please notify our legal team at <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a> with:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '6px' }}>The exact URL of the listing on StakDock.</li>
            <li style={{ marginBottom: '6px' }}>Proof of trademark ownership or business authorization.</li>
            <li style={{ marginBottom: '6px' }}>The specific update, correction, or removal requested.</li>
          </ul>
          <p style={{ marginBottom: '20px' }}>
            We respect intellectual property rights and will process valid requests within 24–48 business hours.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, StakDock and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the directory, software purchases made on third-party sites, or service downtime.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RefundPolicyView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '820px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <RefreshCw size={16} /> Dodo Payments Merchant Policy
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>Fulfillment & Refund Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: August 18, 2026</p>

        <div style={{ lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          
          {/* Policy Summary Callout */}
          <div style={{ background: '#F8FAF3', border: '1.5px solid #C2DC8E', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.1rem', color: '#2C3E2C', marginBottom: '10px' }}>
              <ShieldCheck size={20} color="#82A735" />
              <span>Digital Service Fulfillment & Fair Refund Standards</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#4A5568', lineHeight: '1.6' }}>
              StakDock provides instant digital marketing services, automated domain indexing, verified profile badges, and search engine directory placements. To protect the integrity of our platform and prevent post-indexing abuse, our refund standards follow standard global directory practices.
            </p>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>1. Pre-Publication Full Refund (100% Guaranteed)</h2>
          <p style={{ marginBottom: '16px' }}>
            If you submit a paid Featured Listing or Sponsorship package and your tool has <strong>not yet been reviewed, approved, or published live</strong> on StakDock, you are eligible for an immediate <strong>100% full refund</strong> with zero questions asked.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Simply email <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a> with your order email or Dodo Payments Transaction ID prior to publication.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>2. Post-Publication Policy (Digital Service Rendered)</h2>
          <p style={{ marginBottom: '16px' }}>
            Because Featured Directory Listings, verified badges, dofollow SEO backlinks, and search engine indexing provide <strong>instant and irreversible digital marketing value</strong> upon going live, all fees for actively published and verified listings are <strong>non-refundable</strong> once published.
          </p>
          <p style={{ marginBottom: '20px' }}>
            In accordance with digital product consumer standards (including UK/EU Consumer Contracts Regulations for digital services), you acknowledge that digital fulfillment begins immediately upon review approval and publication.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>3. Technical Failure & Duplicate Billing Guarantee</h2>
          <p style={{ marginBottom: '16px' }}>
            We guarantee 100% full refunds under the following specific technical conditions:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Duplicate Charges:</strong> In the event of an accidental duplicate transaction caused by payment gateway or network issues.</li>
            <li style={{ marginBottom: '8px' }}><strong>Non-Fulfillment:</strong> If StakDock fails to publish or verify an approved paid listing within 72 business hours of payment confirmation.</li>
            <li style={{ marginBottom: '8px' }}><strong>Editorial Rejection:</strong> If a submitted software tool fails our safety, malware, or legitimacy verification audit, a full 100% refund is automatically issued immediately.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>4. Subscription Cancellation (Auto-Renewal Control)</h2>
          <p style={{ marginBottom: '16px' }}>
            Paid listings (Featured Annual Pro, Monthly Category Spotlight, or Top Banner Takeover) operate as recurring subscriptions. You may cancel auto-renewal at <strong>any time with zero fees</strong>:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Via the 1-click self-serve customer billing link in your <strong>Dodo Payments purchase receipt email</strong>.</li>
            <li style={{ marginBottom: '8px' }}>Or by contacting our support team at <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a> at least 24 hours before your next renewal date.</li>
          </ul>
          <p style={{ marginBottom: '20px' }}>
            Upon cancellation, your listing remains active and featured until the end of your prepaid billing period, with no further charges.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>5. Merchant of Record Statement</h2>
          <p>
            All checkout orders, tax handling, and billing disputes are managed through <strong>Dodo Payments</strong> (<a href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '700' }}>dodopayments.com</a>), our authorized Merchant of Record. For billing inquiries, email <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a> or contact Dodo Payments support.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AffiliateDisclosureView({ onBack }) {
  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '820px' }}>
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <ShieldCheck size={16} /> Reader Transparency
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>Affiliate Referral & FTC Disclosure</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Last updated: August 18, 2026</p>

        <div style={{ lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '20px' }}>
            In compliance with the <strong>Federal Trade Commission (FTC) 16 CFR Part 255 Guidelines</strong> concerning the use of endorsements and testimonials in advertising, StakDock provides the following transparent disclosure regarding our commercial relationships and affiliate links.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>1. What Are Affiliate Links?</h2>
          <p style={{ marginBottom: '20px' }}>
            Some of the external software links on <strong>stakdock.com</strong> contain customized affiliate tracking parameters (e.g. <code>?utm_source=stakdock</code> or partner referral tokens). When you click on one of these links and purchase a paid plan or subscription from the respective software vendor, StakDock may earn a small referral commission at <strong>absolutely zero additional cost to you</strong>. In many cases, our partner links provide discounted promotional pricing or extended free trials for our readers.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>2. Strict Editorial Independence Guarantee</h2>
          <p style={{ marginBottom: '16px' }}>
            Our editorial integrity is our most valuable asset. Affiliate compensation never influences our rankings, comparison matrices, or editorial evaluations:
          </p>
          <ul style={{ paddingLeft: '22px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Software rankings are calculated algorithmically using objective data: verified domain authority (OpenPageRank), global web traffic telemetry, feature availability, and real user feedback.</li>
            <li style={{ marginBottom: '8px' }}>We catalog and compare over 1,780+ software tools, including open-source and free tools with no commercial affiliate programs whatsoever.</li>
            <li style={{ marginBottom: '8px' }}>Sponsors cannot purchase positive review ratings or alter objective feature comparison data.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>3. Nominative Trademark Notice</h2>
          <p style={{ marginBottom: '20px' }}>
            All product names, logos, brands, and trademarks displayed on StakDock are the property of their respective owners. StakDock is an independent directory and is not affiliated with, endorsed by, or sponsored by any software provider unless explicitly designated with a "Sponsor" or "Featured" badge.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '28px', marginBottom: '12px' }}>4. Questions & Partnership Inquiries</h2>
          <p>
            If you have any questions regarding our affiliate relationships or wish to partner with StakDock, please contact our team directly at:<br/>
            Email: <a href="mailto:business@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>business@stakdock.com</a> | <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>support@stakdock.com</a><br/>
            Website: <a href="https://stakdock.com" style={{ color: '#82A735', fontWeight: '700' }}>stakdock.com</a>
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

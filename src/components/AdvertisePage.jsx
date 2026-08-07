import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Star, Zap } from 'lucide-react';

export default function AdvertisePage({ onOpenVendorModal }) {
  const [selectedPlan, setSelectedPlan] = useState('spotlight');

  const adPlans = [
    {
      id: 'top-banner',
      title: 'Top Banner Sponsor',
      productId: 'pdt_0NksTosz02Ins84wJV7ku',
      price: '$99',
      period: 'per month',
      popular: false,
      tag: '100% VISIBILITY',
      description: 'Sticky top-of-page banner visible on every page load across StakDock.',
      features: [
        'Full-width sticky top bar placement',
        'Direct outbound link to your website',
        'Custom CTA headline & tagline',
        'Real-time click telemetry & analytics',
        'Instant 24-hour setup guarantee'
      ]
    },
    {
      id: 'spotlight',
      title: 'Featured Left Spotlight',
      productId: 'pdt_0NksUHnFhOrLcWvnGrz5R',
      price: '$99',
      period: 'per year',
      popular: true,
      tag: 'BEST VALUE',
      description: 'Permanent left-column spotlight card visible alongside all tool listings.',
      features: [
        'Left-sidebar spotlight placement',
        'Official "Featured Vendor" badge',
        'Direct referral button to your product',
        'Highlighted card styling & logo',
        'Indexed in Google programmatic SEO'
      ]
    },
    {
      id: 'in-feed',
      title: 'In-Feed Sponsored Listing',
      productId: 'pdt_0NksUTrDVDvUmZ0eDGxNz',
      price: '$49',
      period: 'per month',
      popular: false,
      tag: 'HIGH CONVERSION',
      description: 'Highlighted sponsored tool card pinned inside the main directory feed.',
      features: [
        'Pinned placement in category feeds',
        'Custom "Sponsor" badge highlight',
        'Priority ranking in search results',
        'Direct website CTA link',
        'Monthly impression report'
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1180px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '20px' }}>
          <Sparkles size={16} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SPONSORSHIP & ADVERTISING
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '18px', color: 'var(--text-dark)' }}>
          Promote Your Software To <span style={{ color: '#82A735' }}>100K+ Tech Founders</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          StakDock reaches active software buyers, founders, and developers searching for verified SaaS & AI tools daily.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {adPlans.map(plan => (
          <div
            key={plan.id}
            style={{
              background: plan.popular ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
              border: plan.popular ? '2px solid #82A735' : '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: plan.popular ? '0 12px 30px rgba(130,167,53,0.15)' : '0 4px 14px rgba(0,0,0,0.03)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-14px',
                right: '24px',
                background: '#82A735',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {plan.tag}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '8px' }}>
                {plan.tag}
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {plan.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
                {plan.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: '1' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  / {plan.period}
                </span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: '0 0 32px 0', listStyle: 'none' }}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={13} color="#82A735" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const pkg = plan.id === 'spotlight' ? 'premium' : plan.id;
                if (onOpenVendorModal) {
                  onOpenVendorModal(pkg);
                } else if (plan.productId) {
                  window.location.href = `https://checkout.dodopayments.com/buy/${plan.productId}`;
                }
              }}
              className="btn-pill-green"
              style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', justifyContent: 'center', cursor: 'pointer' }}
            >
              <span>Get Sponsored Spot</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Trust Guarantee */}
      <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <ShieldCheck size={32} color="#82A735" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
          StakDock Sponsor Guarantee
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
          All sponsored listings undergo instant verification. Once submitted, your software placement goes live within 24 hours with full analytics tracking.
        </p>
      </div>
    </div>
  );
}

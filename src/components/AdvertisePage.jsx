import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Star, Zap, 
  Layers, Target, Award, Globe, HelpCircle, ChevronDown, ChevronUp, 
  BarChart3, Rocket, ExternalLink, Link2
} from 'lucide-react';

export default function AdvertisePage({ onOpenVendorModal }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const adPlans = [
    {
      id: 'spotlight',
      title: 'Featured Pro (Annual)',
      packageType: 'premium',
      productId: 'pdt_0NksUHnFhOrLcWvnGrz5R',
      price: '$99',
      period: 'per year',
      popular: true,
      tag: '🔥 MOST POPULAR • $8.25/MO',
      badge: '⭐ FEATURED PRO',
      description: 'Permanent #1 Category Pinned Rank, Competitor Alternative Injections, and 365 days of guaranteed buyer traffic.',
      features: [
        '🏆 Guaranteed #1 Pinned Rank in your specific category (35 niches)',
        '🎯 Auto-injected as "⭐ Recommended Alternative" on all competitor pages',
        '⭐ Official Gold "FEATURED PRO" badge across directory & search',
        '🔗 High-Authority Dofollow SEO Backlink for Google PageRank',
        '🔄 Included in Homepage Left Spotlight 30s rotation pool',
        '📊 Real-time click tracking & monthly buyer telemetry report',
        '⚡ Instant live indexing & Bing IndexNow search push'
      ]
    },
    {
      id: 'in-feed',
      title: 'Homepage Spotlight (Monthly)',
      packageType: 'in-feed',
      productId: 'pdt_0NksUTrDVDvUmZ0eDGxNz',
      price: '$49',
      period: 'per month',
      popular: false,
      tag: '⚡ FAST LAUNCH BOOST',
      badge: '⚡ SPOTLIGHT',
      description: 'High-visibility sticky placement at the top of the Left Featured Spotlight column and main feed.',
      features: [
        '⚡ Top #1 Priority in Homepage Left Spotlight Sidebar',
        '🔗 High-Authority Dofollow SEO Backlink for Google PageRank',
        '📌 Highlighted card styling with animated green badge',
        '🚀 Priority ranking in real-time category search',
        '🔄 30-Second live rotation across all visitor sessions',
        '📈 Direct 1-click CTA button to your website / landing page',
        '🛡️ Verified Partner badge verification included'
      ]
    },
    {
      id: 'top-banner',
      title: 'Sitewide Top Banner',
      packageType: 'top-banner',
      productId: 'pdt_0NksTosz02Ins84wJV7ku',
      price: '$99',
      period: 'per month',
      popular: false,
      tag: '👑 100% MAXIMUM VISIBILITY',
      badge: '🔥 TOP BANNER',
      description: 'Full-width sticky top billboard visible to 100% of all visitors across every single page on StakDock.',
      features: [
        '👑 Full-width sticky top bar displayed on 100% of page views',
        '👁️ 50,000+ Guaranteed Monthly Impressions from software buyers',
        '🔗 High-Authority Dofollow SEO Backlink with UTM parameters',
        '🎨 Custom headline, emoji tag, and branded button styling',
        '⚡ Exclusive single-sponsor slot per category / sitewide',
        '📊 Dedicated real-time conversion and CTR reporting'
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Placement Position', free: 'Standard Feed', spotlight: 'Left Sidebar + In-Feed', featured: 'Category #1 + Feed + Alts', banner: 'Sitewide Top Header' },
    { name: 'Category Pinned Rank', free: 'Standard (By votes)', spotlight: 'Priority Feed Boost', featured: '🏆 Permanent #1 in Category', banner: 'Sitewide (Above all)' },
    { name: 'Competitor Pages Alternative Injection', free: '❌ No', spotlight: '❌ No', featured: '✅ Included (Shopify, Cursor, etc.)', banner: '✅ Sitewide Banner' },
    { name: 'Directory Badging', free: 'Standard Badge', spotlight: '⚡ Spotlight Badge', featured: '⭐ Gold "FEATURED PRO"', banner: '🔥 Top Sponsor' },
    { name: 'SEO Backlink Type', free: 'Nofollow', spotlight: '🔗 High-Authority Dofollow', featured: '🔗 High-Authority Dofollow', banner: '🔗 High-Authority Dofollow' },
    { name: 'Homepage Left Spotlight Rotation', free: '❌ No', spotlight: '✅ #1 Priority Slot', featured: '✅ Included in Rotation', banner: '✅ Top of Page' },
    { name: 'IndexNow Instant Search Ping', free: 'Standard Queue', spotlight: '✅ Instant Push', featured: '✅ Instant Push', banner: '✅ Instant Push' },
    { name: 'Support & Updates', free: 'Community', spotlight: 'Priority Email', featured: '⭐ Dedicated VIP Founder Support', banner: '⭐ VIP Account Manager' }
  ];

  const faqs = [
    {
      q: 'How does the $99/Year Featured Pro plan scale if you have 100+ sponsors?',
      a: 'Top software directories like Product Hunt, G2, and Toolify solve this using a 3-pillar inventory architecture: (1) Category Anchoring: StakDock has 35 independent niches (E-Commerce, CRM, Invoicing, AI Video, AI Coding, etc.). Your tool is permanently pinned to Slot #1 in your specific category. (2) Competitor Injections: Your tool is automatically highlighted as the "⭐ Recommended Alternative" on all competing tool pages in your niche. (3) Fair-Share 30s Rotation: In the general homepage feed, paying tools rotate fairly every 30 seconds and on every visitor session, ensuring thousands of guaranteed impressions daily.'
    },
    {
      q: 'How fast will my software listing go live after payment?',
      a: 'Your listing goes live instantly! Our Cloudflare Edge backend synchronizes your payment via Dodo Payments in real-time, auto-fetches your logo and description, and publishes your listing to the live homepage in under 60 seconds.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We process payments securely through Dodo Payments. We accept Apple Pay, Google Pay, all major credit/debit cards (Visa, Mastercard, Amex), and 135+ local currencies worldwide.'
    },
    {
      q: 'Can I edit my tool details (logo, tagline, pricing, link) after publishing?',
      a: 'Yes! You can update your tool metadata, add special discount codes, or update your URL at any time by contacting support@stakdock.com or through your founder claim dashboard.'
    },
    {
      q: 'Do I get an official Dofollow SEO backlink?',
      a: 'Yes. The $99/Year Featured Pro plan includes a permanent, high-authority Dofollow backlink from StakDock to your official domain, passing real PageRank domain authority to your website.'
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1180px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 18px', marginBottom: '20px' }}>
          <Sparkles size={16} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            OFFICIAL STAKDOCK MEDIA KIT & ADVERTISING
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '18px', color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
          Promote Your Software to <span style={{ color: '#82A735' }}>100,000+ Active SaaS Buyers</span>
        </h1>

        <p style={{ fontSize: '1.12rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
          Get featured where founders, developers, and tech buyers compare software. Drive high-intent traffic, collect community upvotes, and win verified category leadership.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '64px'
      }}>
        {adPlans.map(plan => (
          <div
            key={plan.id}
            style={{
              background: plan.popular ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
              border: plan.popular ? '2px solid #82A735' : '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: plan.popular ? '0 12px 36px rgba(130,167,53,0.18)' : '0 4px 14px rgba(0,0,0,0.03)',
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
                fontSize: '0.74rem',
                fontWeight: '800',
                padding: '4px 14px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 12px rgba(130,167,53,0.3)'
              }}>
                {plan.tag}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '8px' }}>
                {plan.badge}
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {plan.title}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
                {plan.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: '1' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '0.98rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  / {plan.period}
                </span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: '0 0 32px 0', listStyle: 'none' }}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.4' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--bg-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={12} color="#82A735" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                if (onOpenVendorModal) {
                  onOpenVendorModal(plan.packageType);
                } else if (plan.productId) {
                  window.location.href = `https://checkout.dodopayments.com/buy/${plan.productId}`;
                }
              }}
              className="btn-pill-green"
              style={{ width: '100%', padding: '14px 20px', fontSize: '0.96rem', justifyContent: 'center', cursor: 'pointer', fontWeight: '800' }}
            >
              <span>Get {plan.title}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* The 4-Pillar Ad Inventory Matrix (Architecture Breakdown) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '40px 32px',
        marginBottom: '64px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Layers size={14} /> High-Conversion Architecture
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>
            The 4-Pillar Multi-Tier Ad Inventory Matrix
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            How StakDock distributes high-intent traffic across 4 high-converting surface areas so every paying founder receives guaranteed ROI:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: '#F9FBF5', border: '1px solid #E2EAD4', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>👑</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>1. Top Banner ($99/mo)</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Full-width sticky billboard at the very top of the page. Displayed to <strong>100% of site visitors</strong> across all 4,169 pages on StakDock.
            </p>
          </div>

          <div style={{ background: '#F9FBF5', border: '1px solid #E2EAD4', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>2. Left Spotlight ($49/mo)</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Fixed position in the Left Column <strong>"Featured Spotlights"</strong>. Fast 30-second live rotation ensuring thousands of daily views.
            </p>
          </div>

          <div style={{ background: '#F9FBF5', border: '1px solid #E2EAD4', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>3. Category #1 ($99/yr)</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Permanently pinned to the <strong>#1 Top Rank</strong> of your specific category (e.g. E-Commerce, CRM, Invoicing) with an official Gold Featured badge.
            </p>
          </div>

          <div style={{ background: '#F9FBF5', border: '1px solid #E2EAD4', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>4. Competitor Injections</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Auto-featured as the <strong>"⭐ Recommended Alternative"</strong> on competitor detail and comparison pages to capture active buyers switching tools.
            </p>
          </div>

        </div>
      </div>

      {/* Feature Comparison Table */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '40px 32px',
        marginBottom: '64px',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Plan Comparison Matrix
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)' }}>
            Choose the right visibility tier for your software launch and scaling goals.
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '800' }}>Feature / Benefit</th>
              <th style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>Free Listing ($0)</th>
              <th style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#82A735', fontWeight: '800' }}>Spotlight ($49/mo)</th>
              <th style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#B45309', fontWeight: '800', background: '#FFFDF5', borderRadius: '8px 8px 0 0' }}>Featured Pro ($99/yr)</th>
              <th style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '800' }}>Top Banner ($99/mo)</th>
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                <td style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)' }}>{row.name}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>{row.free}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#82A735', fontWeight: '600' }}>{row.spotlight}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#B45309', fontWeight: '700', background: '#FFFDF5' }}>{row.featured}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: 'var(--text-dark)', fontWeight: '600' }}>{row.banner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Frequently Asked Questions */}
      <div style={{ maxWidth: '840px', margin: '0 auto 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Frequently Asked Questions for Founders
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)' }}>
            Everything you need to know about sponsoring and advertising on StakDock.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="#82A735" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Guarantee & Direct Contact */}
      <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '36px', textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        <ShieldCheck size={36} color="#82A735" style={{ margin: '0 auto 14px' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
          StakDock Sponsor Guarantee & Direct Support
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.6' }}>
          All sponsored listings undergo automated health verification and go live instantly. Protected by Dodo Payments 100% satisfaction guarantee.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '0.92rem', borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
          <span>💼 Business & Enterprise Sponsorships: <a href="mailto:business@stakdock.com" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'none' }}>business@stakdock.com</a></span>
          <span>✉️ Founder VIP Support: <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'none' }}>support@stakdock.com</a></span>
        </div>
      </div>

    </div>
  );
}

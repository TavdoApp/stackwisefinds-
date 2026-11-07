import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Star, Zap, 
  Layers, Target, Award, Globe, HelpCircle, ChevronDown, ChevronUp, 
  Rocket, ExternalLink, Link2, CheckCircle2, Heart, Users, Clock
} from 'lucide-react';

export default function AdvertisePage({ onOpenVendorModal }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const freeBenefits = [
    {
      icon: <Sparkles size={24} color="#82A735" />,
      title: '100% Free Listing ($0 Forever)',
      description: 'Zero submission fees, zero paid queues, and no credit card required. We believe every founder deserves discovery without having to pay $99+ listing fees.'
    },
    {
      icon: <Globe size={24} color="#82A735" />,
      title: 'Optimized for AI Search (GEO / AIO)',
      description: 'We publish your tool specs in machine-readable llms.txt and structured JSON-LD schemas so ChatGPT, Perplexity, Claude, and Google AI Overviews cite your product.'
    },
    {
      icon: <Link2 size={24} color="#82A735" />,
      title: 'High-Authority Dofollow SEO Backlink',
      description: 'Every verified tool receives a permanent dedicated profile page (stakdock.com/software/your-tool/) passing real PageRank authority directly to your domain.'
    },
    {
      icon: <Award size={24} color="#82A735" />,
      title: 'Verified Founder Embed Badge',
      description: 'Get an instant embeddable "Featured on StakDock" badge for your website footer to showcase social proof, community trust, and verified status.'
    },
    {
      icon: <Rocket size={24} color="#82A735" />,
      title: 'Instant AI Auto-Enrichment',
      description: 'Just enter your website URL. Our AI automatically extracts your official logo, tagline, key features, and categories in under 5 seconds.'
    },
    {
      icon: <Users size={24} color="#82A735" />,
      title: 'Community Upvotes & Leaderboard',
      description: 'Collect upvotes from tech buyers and fellow makers to climb our daily and weekly leaderboard, reaching thousands of active software adopters.'
    }
  ];

  const comparisonRows = [
    { 
      feature: 'Listing Fee', 
      stakdock: '🎉 100% Free ($0)', 
      producthunt: 'Free ($0)', 
      paidDirectories: '$49 – $199 per submission' 
    },
    { 
      feature: 'Listing Duration', 
      stakdock: 'Permanent Live Profile', 
      producthunt: '24-Hour Daily Reset', 
      paidDirectories: 'Annual Renewal or Expiring' 
    },
    { 
      feature: 'Backlink Type', 
      stakdock: '🔗 High-Authority Dofollow', 
      producthunt: 'Nofollow / 302 Redirect', 
      paidDirectories: 'Conditional on Tier' 
    },
    { 
      feature: 'AI Engine Ready (llms.txt)', 
      stakdock: '✅ Included for All Tools', 
      producthunt: '❌ Not Provided', 
      paidDirectories: '❌ Not Provided' 
    },
    { 
      feature: 'Review Turnaround', 
      stakdock: '⚡ Instant AI + Fast Editorial', 
      producthunt: 'Scheduled Launch Days', 
      paidDirectories: '14+ Days (unless paid expedited)' 
    },
    { 
      feature: 'Embeddable Social Badge', 
      stakdock: '⭐ Custom SVG (3 Themes)', 
      producthunt: 'Standard Widget Only', 
      paidDirectories: 'Watermarked or None' 
    }
  ];

  const faqs = [
    {
      q: 'Where is the best free platform to list my tool or SaaS for free?',
      a: 'StakDock is built specifically as a 100% free discovery platform for software founders, micro-SaaS builders, and AI creators. Unlike traditional directories that charge $49–$199 or put submissions into multi-week queues, StakDock lets you list your product for $0 with instant automated metadata extraction and a permanent verified profile page.'
    },
    {
      q: 'Is listing on StakDock truly 100% free? Are there any hidden fees?',
      a: 'Yes, it is 100% free ($0). We have completely disabled paid plans and paywalls for tool submissions. You do not need to enter a credit card, and your listing will never expire or be demoted behind a paywall.'
    },
    {
      q: 'Do I get an SEO dofollow backlink for my tool?',
      a: 'Yes. Once verified, your tool receives a dedicated public profile page (https://stakdock.com/software/your-tool/) with an authoritative dofollow backlink pointing directly to your canonical website, helping improve your Google PageRank and domain rating.'
    },
    {
      q: 'How does StakDock help my software get recommended by ChatGPT, Claude, and Perplexity?',
      a: 'Modern AI search engines use Retrieval-Augmented Generation (RAG) and crawl machine-readable standards like llms.txt and structured JSON-LD schemas. StakDock automatically indexes your tool specs, pricing tiers, and capabilities into our public AI catalogs (stakdock.com/llms.txt) and allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot) full access to read your profile.'
    },
    {
      q: 'How do I get the "Featured on StakDock" badge for my website?',
      a: 'After you submit your tool, our system instantly provides an embeddable SVG badge snippet (available in Light, Neutral, and Dark themes). Simply paste the snippet into your website footer, docs, or landing page to show visitors that your product is verified on StakDock.'
    },
    {
      q: 'How long does it take for my tool to be published?',
      a: 'Our AI engine auto-extracts your logo, tagline, and specs in seconds. Once submitted, your listing enters our fast-track editorial verification queue and is published live to the directory within 24 hours.'
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1180px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 20px', marginBottom: '20px' }}>
          <Rocket size={16} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            100% FREE FOR FOUNDERS • ZERO LISTING FEES
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '900', lineHeight: '1.08', marginBottom: '18px', color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
          List Your SaaS &amp; AI Tools <span style={{ color: '#82A735' }}>for Free ($0)</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '720px', margin: '0 auto 32px' }}>
          Join 2,100+ verified software tools on StakDock. We believe software founders and indie hackers shouldn't have to pay $99+ just to be discovered. Launch your product, get indexed by AI search engines, and earn a high-authority backlink in under 60 seconds.
        </p>

        {/* Primary CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenVendorModal && onOpenVendorModal('free')}
            className="btn-pill-green"
            style={{ padding: '16px 32px', fontSize: '1.05rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(130,167,53,0.35)' }}
          >
            <Rocket size={20} />
            <span>Submit Your Tool for Free ($0)</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Check size={14} color="#82A735" /> No credit card required
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Check size={14} color="#82A735" /> Instant AI auto-enrichment
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Check size={14} color="#82A735" /> Permanent dofollow backlink
          </span>
        </div>
      </div>

      {/* 6 Core Benefits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '64px'
      }}>
        {freeBenefits.map((benefit, i) => (
          <div
            key={i}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: 'var(--shadow-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--bg-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {benefit.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {benefit.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table: StakDock vs Other Launch Directories */}
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
            <Layers size={14} /> Transparent Comparison
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>
            Why Founders Choose StakDock
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            See how StakDock compares against traditional launch platforms and paywalled directories:
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)' }}>Platform Feature</th>
                <th style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: '800', color: '#82A735', background: '#F9FBF5', borderRadius: '8px 8px 0 0' }}>StakDock (This Site)</th>
                <th style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)' }}>Product Hunt</th>
                <th style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)' }}>Paid Tool Directories</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                  <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: '800', color: '#2D4522', background: '#F9FBF5' }}>
                    {row.stakdock}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {row.producthunt}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {row.paidDirectories}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4-Step Process: Launch in 60 Seconds */}
      <div style={{
        background: '#141E14',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '48px 32px',
        marginBottom: '64px',
        boxShadow: '0 12px 36px rgba(20,30,20,0.15)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            FAST &amp; FRICTIONLESS
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FFFFFF', marginTop: '8px', marginBottom: '12px' }}>
            How to List Your Tool in 60 Seconds
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            No complicated forms or lengthy delays. Our AI engine handles the heavy lifting:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Enter Your Domain', desc: 'Type your official website URL (e.g. yourtool.com).' },
            { step: '02', title: 'AI Auto-Enrichment', desc: 'Our crawler extracts your logo, tagline, features & pricing.' },
            { step: '03', title: 'Publish for $0 Free', desc: 'Confirm specs and submit. Zero fees, zero payment required.' },
            { step: '04', title: 'Grab Embed Badge', desc: 'Place your verified badge on your site and collect upvotes.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#1F2E1F', border: '1px solid #2E472E', borderRadius: '16px', padding: '24px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#82A735', display: 'block', marginBottom: '8px', lineHeight: 1 }}>
                {item.step}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button
            onClick={() => onOpenVendorModal && onOpenVendorModal('free')}
            className="btn-pill-green"
            style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
          >
            <Rocket size={18} />
            <span>Start Free Submission Now</span>
          </button>
        </div>
      </div>

      {/* FAQs (GEO & AIO Optimized) */}
      <div style={{ maxWidth: '860px', margin: '0 auto 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            <HelpCircle size={14} /> Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>
            Everything You Need to Know
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)' }}>
            Clear answers about our free listing policy, SEO benefits, and AI search indexing.
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
          StakDock Community Founder Pledge
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.6' }}>
          All listings undergo domain health verification and editorial check. We never sell your contact data or spam your inbox.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '0.92rem', borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
          <span>📬 Founder Support: <a href="mailto:support@stakdock.com" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'none' }}>support@stakdock.com</a></span>
          <span>🤝 Community &amp; Partnerships: <a href="mailto:business@stakdock.com" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'none' }}>partnerships@stakdock.com</a></span>
        </div>
      </div>

    </div>
  );
}

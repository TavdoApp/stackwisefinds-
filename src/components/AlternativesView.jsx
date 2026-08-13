import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Check, X, Sparkles, Layers, Shield } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';

export default function AlternativesView({ targetToolId, onBack, onSelectTool }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'free', 'opensource', 'budget'

  const targetTool = saasTools.find(t => t.id === targetToolId) || saasTools[0];
  
  // Find top direct competitors in the same category
  const isPaymentTarget = targetToolId === 'stripe' || targetToolId === 'paypal' || targetTool.category === 'payment-gateways';
  const allAlternatives = saasTools.filter(t => {
    if (!t) return false;
    if (t.id === targetTool.id) return false;
    if (isPaymentTarget && (t.id === 'splitmatepro' || (t.description || '').toLowerCase().includes('roommate') || (t.description || '').toLowerCase().includes('tenant'))) return false;
    return t.category === targetTool.category;
  });

  const filteredAlternatives = allAlternatives.filter(t => {
    if (filterMode === 'free') return t.isFreeTier || (t.pricing || '').toLowerCase().includes('free');
    if (filterMode === 'opensource') return t.isOpenSource;
    if (filterMode === 'budget') return t.isFreeTier || (t.pricing || '').toLowerCase().includes('$') === false || parseInt((t.pricing || '').replace(/[^0-9]/g, '')) < 29;
    return true;
  });

  const alternatives = filteredAlternatives.length > 0 ? filteredAlternatives : allAlternatives;
  const topWinner = allAlternatives[0] || saasTools.find(t => t.id === 'chargebee') || saasTools[1] || targetTool;
  const winnerTagline = topWinner.description || topWinner.name || 'Verified Software Alternative';

  const faqs = [
    {
      question: `What is the best overall alternative to ${targetTool.name}?`,
      answer: `The #1 rated overall alternative to ${targetTool.name} is ${topWinner.name} (${topWinner.rating || 4.8}/5 stars). It offers ${winnerTagline} with flexible pricing starting at ${topWinner.pricing || 'Free Tier'}.`
    },
    {
      question: `Are there 100% free alternatives to ${targetTool.name}?`,
      answer: allAlternatives.some(a => a.isFreeTier) 
        ? `Yes! Verified free alternatives include ${allAlternatives.filter(a => a.isFreeTier).slice(0, 4).map(a => a.name).join(', ')}. These tools offer freemium tiers with zero credit card required.`
        : `While most premium tools require a subscription, many offer 7-day to 14-day free trials.`
    },
    {
      question: `Is there an open-source alternative to ${targetTool.name}?`,
      answer: allAlternatives.some(a => a.isOpenSource)
        ? `Yes! Open-source and self-hosted alternatives to ${targetTool.name} include ${allAlternatives.filter(a => a.isOpenSource).map(a => a.name).join(', ')}. You can host these on your own VPS for complete data sovereignty.`
        : `Currently, most top options in this category are cloud-hosted SaaS platforms, but free tiers are available.`
    },
    {
      question: `Why do software buyers look for ${targetTool.name} competitors?`,
      answer: `Software buyers typically search for alternatives to ${targetTool.name} to lower monthly subscription costs, unlock specialized features, avoid vendor lock-in, or access open-source self-hosted privacy controls.`
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '980px' }}>
      {/* JSON-LD Schema.org Injection for Rich Snippets */}
      {injectSoftwareApplicationSchema(targetTool)}
      {injectSoftwareApplicationSchema(topWinner)}
      {injectFaqPageSchema(faqs)}

      {/* Back Button */}
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
        <ArrowLeft size={16} /> Back to Software Directory
      </button>

      {/* Programmatic Multi-Keyword SEO Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '10px', letterSpacing: '0.08em', color: '#82A735' }}>
          VERIFIED SOFTWARE COMPARISON & REPLACEMENT HUB (2026)
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: '800', marginBottom: '14px', lineHeight: '1.15', color: 'var(--text-dark)' }}>
          Best <span className="serif-italic">{targetTool.name}</span> Free & Open-Source Alternatives
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '720px', margin: '0 auto', lineHeight: '1.5' }}>
          Looking to replace {targetTool.name}? We benchmarked feature matrices, pricing plans, open-source security, and buyer reviews to curate the top verified alternatives.
        </p>

        {/* Quick Semantic Sub-Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => setFilterMode('all')}
            className={filterMode === 'all' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>All Alternatives ({allAlternatives.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('free')}
            className={filterMode === 'free' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>🎁 100% Free Tier</span>
          </button>

          <button
            onClick={() => setFilterMode('opensource')}
            className={filterMode === 'opensource' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>⚡ Open Source</span>
          </button>

          <button
            onClick={() => setFilterMode('budget')}
            className={filterMode === 'budget' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>💰 Budget Friendly</span>
          </button>
        </div>
      </div>

      {/* #1 Rated Replacement Hero Banner */}
      {topWinner && (
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #243524 100%)',
          border: '1px solid #82A735',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(20,30,20,0.15)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={`https://www.google.com/s2/favicons?domain=${topWinner.domain}&sz=128`} 
                alt={topWinner.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A3D944', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Award size={16} /> #1 Rated Replacement for {targetTool.name}
              </div>
              <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 4px' }}>{topWinner.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#D0D8D0', margin: 0 }}>{winnerTagline}</p>
            </div>
          </div>

          <a 
            href={topWinner.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pill-green"
            style={{ padding: '14px 26px', fontSize: '0.92rem' }}
          >
            <span>Visit {topWinner.name} Winner</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      )}

      {/* Feature & Pricing Comparison Matrix Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '28px', marginBottom: '40px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '18px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="#82A735" />
          <span>{targetTool.name} vs Top Alternatives Feature Matrix</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-sage)' }}>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Software Name</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Rating</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Free Tier?</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Open Source?</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Pricing Starting</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Target Tool Baseline Row */}
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#FAFBF8' }}>
                <td style={{ padding: '14px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  {targetTool.name} <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: '700' }}>(Current)</span>
                </td>
                <td style={{ padding: '14px', fontWeight: '700' }}>⭐ {targetTool.rating || 4.7}</td>
                <td style={{ padding: '14px' }}>{targetTool.isFreeTier ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                <td style={{ padding: '14px' }}>{targetTool.isOpenSource ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary-green-dark)' }}>{targetTool.pricing || 'Paid Subscription'}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <a href={targetTool.affiliateUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '800', fontSize: '0.82rem', textDecoration: 'none' }}>
                    Visit Website ↗
                  </a>
                </td>
              </tr>

              {/* Alternatives Rows */}
              {allAlternatives.slice(0, 6).map((tool) => (
                <tr key={tool.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px', fontWeight: '800', color: 'var(--text-dark)' }}>{tool.name}</td>
                  <td style={{ padding: '14px', fontWeight: '700' }}>⭐ {tool.rating || 4.8}</td>
                  <td style={{ padding: '14px' }}>{tool.isFreeTier ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                  <td style={{ padding: '14px' }}>{tool.isOpenSource ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary-green-dark)' }}>{tool.pricing || 'Free Tier'}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '800', fontSize: '0.82rem', textDecoration: 'none' }}>
                      Try Alternative ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Alternative List Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>
          Top Verified Replacements for {targetTool.name} ({alternatives.length} Tools)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {alternatives.map((tool, idx) => (
            <div key={tool.id} style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: 'var(--shadow-soft)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#82A735', width: '24px' }}>#{idx + 1}</span>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  flexShrink: 0
                }}>
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
                    alt={tool.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)' }}>{tool.name}</h4>
                    {tool.isFreeTier && (
                      <span style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px' }}>
                        🎁 Free Tier
                      </span>
                    )}
                    {tool.isOpenSource && (
                      <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px' }}>
                        ⚡ Open Source
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '6px 0 10px', lineHeight: '1.4' }}>{tool.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#82A735" color="#82A735" /> {tool.rating}
                    </span>
                    <span style={{ color: 'var(--primary-green-dark)', fontWeight: '700' }}>{tool.pricing}</span>
                  </div>
                </div>
              </div>

              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-green"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <span>Visit {tool.name}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Programmatic SEO FAQ Cluster */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '28px', marginBottom: '40px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '18px', color: 'var(--text-dark)' }}>
          Frequently Asked Questions About {targetTool.name} Alternatives
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ borderBottom: idx < faqs.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: idx < faqs.length - 1 ? '16px' : '0' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-dark)' }}>{faq.question}</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Transparency Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. We may earn an affiliate commission when you sign up through partner links.</span>
      </div>
    </div>
  );
}

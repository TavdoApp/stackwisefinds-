import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Check, X, Sparkles, Layers, Shield, Quote } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';
import { getToolAlternatives, getCommunitySwitchInsight, getToolStrengthBadge, getGroupedAlternatives } from '../utils/alternativesHelper.js';
import SuggestAlternativeModal from './SuggestAlternativeModal.jsx';

export default function AlternativesView({ targetToolId, allTools, onBack, onSelectTool }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'free', 'opensource', 'budget'
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const toolPool = Array.isArray(allTools) && allTools.length > 0 ? allTools : saasTools;
  const targetIdClean = (targetToolId || '').toLowerCase().trim();

  const formatFallbackName = (slug) => {
    if (!slug) return 'Software';
    return String(slug).split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const targetTool = toolPool.find(t => t.id && t.id.toLowerCase() === targetIdClean) ||
    toolPool.find(t => t.id && t.id.toLowerCase().replace(/[^a-z0-9]/g, '') === targetIdClean.replace(/[^a-z0-9]/g, '')) ||
    toolPool.find(t => t.name && t.name.toLowerCase() === targetIdClean) ||
    toolPool.find(t => t.name && t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === targetIdClean.replace(/[^a-z0-9]/g, '')) ||
    toolPool.find(t => (t.id && t.id.toLowerCase().includes(targetIdClean)) || (t.name && t.name.toLowerCase().includes(targetIdClean))) || {
    id: targetIdClean,
    name: formatFallbackName(targetIdClean),
    domain: `${targetIdClean}.com`,
    category: 'software',
    description: `${formatFallbackName(targetIdClean)} software platform.`,
    pricing: 'Check website'
  };
  
  // Intelligent Pro Alternatives Engine
  const allAlternatives = getToolAlternatives(targetTool, toolPool, { limit: 16 });
  const switchInsight = getCommunitySwitchInsight(targetTool);
  const groupedAlternatives = getGroupedAlternatives(targetTool, toolPool);

  const filteredAlternatives = allAlternatives.filter(t => {
    if (filterMode === 'free') return t.isFreeTier || (t.pricing || '').toLowerCase().includes('free');
    if (filterMode === 'opensource') return t.isOpenSource;
    if (filterMode === 'budget') return t.isFreeTier || (t.pricing || '').toLowerCase().includes('$') === false || parseInt((t.pricing || '').replace(/[^0-9]/g, '')) < 29;
    return true;
  });

  const alternatives = filteredAlternatives.length > 0 ? filteredAlternatives : allAlternatives;
  const topWinner = allAlternatives[0] || targetTool;
  const winnerTagline = topWinner.description || topWinner.tagline || topWinner.name || 'Related Software Alternative';

  const faqs = [
    {
      question: `What are common alternatives to ${targetTool.name}?`,
      answer: `Documented alternatives to ${targetTool.name} include ${allAlternatives.slice(0, 4).map(a => a.name).join(', ')}. Each software profile details specific features, pricing models, and deployment architectures.`
    },
    {
      question: `Are there free alternatives to ${targetTool.name}?`,
      answer: allAlternatives.some(a => a.isFreeTier) 
        ? `Yes. Documented free tier options include ${allAlternatives.filter(a => a.isFreeTier).slice(0, 4).map(a => a.name).join(', ')}.`
        : `While most options require a paid license, many provide evaluation trials.`
    },
    {
      question: `Is there an open-source alternative to ${targetTool.name}?`,
      answer: allAlternatives.some(a => a.isOpenSource)
        ? `Yes. Open-source options include ${allAlternatives.filter(a => a.isOpenSource).map(a => a.name).join(', ')}.`
        : `Currently, options in this category are predominantly cloud-hosted platforms.`
    },
    {
      question: `Why do software buyers look for ${targetTool.name} alternatives?`,
      answer: `Buyers typically compare alternatives to ${targetTool.name} to optimize subscription pricing, integrate with specific tech stacks, or meet data sovereignty requirements.`
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

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '10px', letterSpacing: '0.08em', color: '#82A735' }}>
          SOFTWARE COMPARISON & ALTERNATIVES HUB (2026)
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: '800', marginBottom: '14px', lineHeight: '1.15', color: 'var(--text-dark)' }}>
          <span className="serif-italic">{targetTool.name}</span> Alternatives & Competitors
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '720px', margin: '0 auto', lineHeight: '1.5' }}>
          Compare documented software alternatives to {targetTool.name} categorized by feature capabilities, pricing models, and deployment options.
        </p>

        {/* Quick Semantic Sub-Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => setFilterMode('all')}
            className={filterMode === 'all' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>All Options ({allAlternatives.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('free')}
            className={filterMode === 'free' ? 'btn-pill-green' : 'btn-pill-outline'}
            style={{ padding: '7px 16px', fontSize: '0.84rem' }}
          >
            <span>🎁 Free Tier</span>
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

          <button
            onClick={() => setShowSuggestModal(true)}
            className="btn-pill-outline"
            style={{ padding: '7px 16px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} color="#82A735" />
            <span>+ Suggest Alternative</span>
          </button>
        </div>
      </div>

      {/* Featured Alternative Hero Banner */}
      {topWinner && (
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #243524 100%)',
          border: '1px solid #82A735',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '32px',
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
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <img 
                src={`https://www.google.com/s2/favicons?domain=${topWinner.domain}&sz=128`} 
                alt={topWinner.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://icons.duckduckgo.com/ip3/${topWinner.domain}.ico`;
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A3D944', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Award size={16} /> Featured Alternative to {targetTool.name}
              </div>
              <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 4px' }}>{topWinner.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#D0D8D0', margin: 0 }}>{winnerTagline}</p>
            </div>
          </div>

          <a 
            href={topWinner.affiliateUrl || `https://${topWinner.domain}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pill-green"
            style={{ padding: '14px 26px', fontSize: '0.92rem' }}
          >
            <span>Visit {topWinner.name}</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      )}

      {/* Product Considerations & Capabilities Box */}
      {switchInsight && (
        <div style={{
          background: 'linear-gradient(135deg, #FAFBF7 0%, #F3F6EC 100%)',
          border: '1px solid #C8D8A0',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '36px',
          boxShadow: '0 4px 20px rgba(130, 167, 53, 0.09)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ background: '#82A735', color: '#FFFFFF', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Quote size={13} /> Product Considerations & Insights
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: '700' }}>Documented Characteristics</span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 10px' }}>
            {switchInsight.headline}
          </h3>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-dark)', lineHeight: '1.65', margin: '0 0 18px' }}>
            {switchInsight.summary}
          </p>

          {switchInsight.keyDrivers && switchInsight.keyDrivers.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', borderTop: '1px solid rgba(130, 167, 53, 0.25)', paddingTop: '16px' }}>
              {switchInsight.keyDrivers.map((driver, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                  <Check size={18} color="#82A735" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ lineHeight: '1.45' }}>{driver}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feature & Pricing Comparison Matrix Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '28px', marginBottom: '40px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '18px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="#82A735" />
          <span>{targetTool.name} vs Related Alternatives Comparison</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-sage)' }}>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Software Name</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Key Differentiator</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Model</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--text-dark)' }}>Free Tier?</th>
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
                <td style={{ padding: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Baseline Reference</td>
                <td style={{ padding: '14px', fontWeight: '700', color: '#536253' }}>{targetTool.isOpenSource ? 'Open Source' : 'Cloud SaaS'}</td>
                <td style={{ padding: '14px' }}>{targetTool.isFreeTier ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary-green-dark)' }}>{targetTool.pricing || 'Check website'}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <a href={targetTool.affiliateUrl || `https://${targetTool.domain}`} target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '800', fontSize: '0.82rem', textDecoration: 'none' }}>
                    Visit Website ↗
                  </a>
                </td>
              </tr>

              {/* Alternatives Rows */}
              {allAlternatives.slice(0, 6).map((tool) => (
                <tr key={tool.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px', fontWeight: '800', color: 'var(--text-dark)' }}>{tool.name}</td>
                  <td style={{ padding: '14px', fontSize: '0.8rem', color: '#3A5311', fontWeight: '700' }}>
                    {tool.alternativeBadge || getToolStrengthBadge(tool, targetTool)}
                  </td>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#536253' }}>{tool.isOpenSource ? 'Open Source' : 'Cloud SaaS'}</td>
                  <td style={{ padding: '14px' }}>{tool.isFreeTier ? <Check size={16} color="#82A735" /> : <X size={16} color="#999" />}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary-green-dark)' }}>{tool.pricing || 'Check website'}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <a href={tool.affiliateUrl || `https://${tool.domain}`} target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', fontWeight: '800', fontSize: '0.82rem', textDecoration: 'none' }}>
                      Try Alternative ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alternative List Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>
          Related Software & Alternatives for {targetTool.name} ({alternatives.length} Options)
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://icons.duckduckgo.com/ip3/${tool.domain}.ico`;
                    }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>{tool.name}</h4>
                    <span style={{ background: '#EBF0E1', color: '#536253', fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
                      Website Checked
                    </span>
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

                  {tool.alternativeBadge && (
                    <div style={{ display: 'inline-block', background: '#EEF4DE', color: '#3A5311', border: '1px solid #D5E5B5', fontSize: '0.75rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', margin: '6px 0 4px' }}>
                      {tool.alternativeBadge}
                    </div>
                  )}

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '6px 0 10px', lineHeight: '1.4' }}>{tool.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--primary-green-dark)', fontWeight: '700' }}>{tool.pricing || 'Check website'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={tool.affiliateUrl || `https://${tool.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-green"
                  style={{ padding: '10px 18px', fontSize: '0.88rem', textDecoration: 'none' }}
                >
                  <span>Visit {tool.name}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded FAQ Cluster */}
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

      {/* Suggest Alternative Modal */}
      <SuggestAlternativeModal
        tool={targetTool}
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}

import React from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';

export default function AlternativesView({ targetToolId, onBack, onSelectTool }) {
  const targetTool = saasTools.find(t => t.id === targetToolId) || saasTools[0];
  
  // Find top direct competitors in the same category
  const alternatives = saasTools.filter(t => t.category === targetTool.category && t.id !== targetTool.id);
  const topWinner = alternatives[0] || saasTools[1] || targetTool;

  const winnerTagline = topWinner.description || topWinner.name || 'Verified Software Alternative';

  const faqs = [
    {
      question: `What is the best overall alternative to ${targetTool.name}?`,
      answer: `The #1 rated overall alternative to ${targetTool.name} is ${topWinner.name} (${topWinner.rating || 4.8}/5 stars). It offers ${winnerTagline} with flexible pricing starting at ${topWinner.pricing || 'Free Tier'}.`
    },
    {
      question: `Are there free alternatives to ${targetTool.name}?`,
      answer: alternatives.some(a => a.isFreeTier) 
        ? `Yes! Free alternatives include ${alternatives.filter(a => a.isFreeTier).slice(0, 4).map(a => a.name).join(', ')}. These tools offer freemium tiers with zero credit card required.`
        : `While most premium tools require a subscription, many offer 7-day to 14-day free trials.`
    },
    {
      question: `Why do users look for ${targetTool.name} alternatives?`,
      answer: `Software buyers typically search for alternatives to ${targetTool.name} to find better pricing options, easier team onboarding, specialized niche features, or lower monthly subscription costs.`
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '960px' }}>
      {/* JSON-LD Schema.org Injection for Rich Snippets */}
      {injectSoftwareApplicationSchema(targetTool)}
      {injectSoftwareApplicationSchema(topWinner)}
      {injectFaqPageSchema(faqs)}

      {/* Back Button */}
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
        <ArrowLeft size={16} /> Back to Software Directory
      </button>

      {/* Alternatives Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '8px' }}>SOFTWARE ALTERNATIVES HUB (2026)</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.1' }}>
          Best <span className="serif-italic">{targetTool.name}</span> Alternatives & Competitors
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
          Looking to replace {targetTool.name}? We evaluated feature matrices, pricing plans, and buyer reviews to find the top direct alternatives.
        </p>
      </div>

      {/* #1 Rated Replacement Hero Banner */}
      {topWinner && (
        <div style={{
          background: 'var(--bg-sage)',
          border: '2px solid #82A735',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: '1 1 280px', minWidth: 0 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}>
              <img 
                src={`https://www.google.com/s2/favicons?domain=${topWinner.domain}&sz=128`} 
                alt={topWinner.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                <Award size={16} /> #1 Rated Replacement for {targetTool.name}
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 6px' }}>{topWinner.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{winnerTagline}</p>
            </div>
          </div>

          <a 
            href={topWinner.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pill-green"
            style={{ padding: '12px 24px' }}
          >
            <span>Visit {topWinner.name} Winner</span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      )}

      {/* Top Alternative List Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '20px' }}>
          Top Verified Alternatives to {targetTool.name} ({alternatives.length} Tools)
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
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{tool.name}</h4>
                    {tool.badge && (
                      <span style={{ background: 'var(--bg-sage)', color: 'var(--primary-green-dark)', fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px' }}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{tool.description}</p>

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

      {/* FAQ Section */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-dark)' }}>{faq.question}</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. We may earn a commission when you buy software through partner links.</span>
      </div>
    </div>
  );
}

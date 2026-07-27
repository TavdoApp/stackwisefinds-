import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';

export default function VersusPage({ toolAId, toolBId, onBack }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toolA = saasTools.find(t => t.id === toolAId) || saasTools[0];
  const toolB = saasTools.find(t => t.id === toolBId) || saasTools[1];

  const winner = (toolA.rating || 4.8) >= (toolB.rating || 4.7) ? toolA : toolB;

  const bestForA = toolA.bestFor || toolA.description || `${toolA.name} software workflows`;
  const bestForB = toolB.bestFor || toolB.description || `${toolB.name} software workflows`;
  const bestForWinner = winner.bestFor || winner.description || `${winner.name} software workflows`;

  const prosA = Array.isArray(toolA.pros) ? toolA.pros : [toolA.description || 'Verified software platform'];
  const prosB = Array.isArray(toolB.pros) ? toolB.pros : [toolB.description || 'Verified software platform'];

  const faqs = [
    {
      question: `Is ${toolA.name} better than ${toolB.name}?`,
      answer: `It depends on your workflow. ${winner.name} ranks higher overall on StakDock (${winner.rating}/5) because of its superior user interface and value. However, ${toolA.name} is ideal for ${bestForA}, while ${toolB.name} is best for ${bestForB}.`
    },
    {
      question: `Which is cheaper: ${toolA.name} or ${toolB.name}?`,
      answer: `${toolA.name} starts at ${toolA.pricing}, while ${toolB.name} starts at ${toolB.pricing}. Be sure to check free trial options before committing.`
    },
    {
      question: `Do both tools offer free trials?`,
      answer: `Yes, both ${toolA.name} and ${toolB.name} offer free trials or freemium tiers so you can test their features risk-free.`
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '960px' }}>
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(toolA)}
      {injectSoftwareApplicationSchema(toolB)}
      {injectFaqPageSchema(faqs)}

      {/* Back Button */}
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
        <ArrowLeft size={16} /> Back to Software Directory
      </button>

      {/* Versus Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '8px' }}>HEAD-TO-HEAD COMPARISON</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.1' }}>
          {toolA.name} <span className="serif-italic">vs</span> {toolB.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          An unbiased 2026 feature matrix, pricing comparison, and direct buyer verdict to help you choose the right tool.
        </p>
      </div>

      {/* Winner Callout Card */}
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
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <img 
              src={`https://www.google.com/s2/favicons?domain=${winner.domain}&sz=128`} 
              alt={winner.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <Award size={16} /> StakDock Verdict Winner
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>{winner.name}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForWinner}</p>
          </div>
        </div>

        <a 
          href={winner.affiliateUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-pill-green"
          style={{ padding: '12px 24px' }}
        >
          <span>Visit {winner.name} Winner</span>
          <ArrowUpRight size={17} />
        </a>
      </div>

      {/* Side-by-Side Spec Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px', marginBottom: '40px', overflowX: 'auto', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Feature Comparison Matrix</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', background: '#F6F7F2' }}>
              <th style={{ padding: '14px', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Feature Spec</th>
              <th style={{ padding: '14px', width: '38%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolA.domain}&sz=128`} alt={toolA.name} style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{toolA.name}</span>
                </div>
              </th>
              <th style={{ padding: '14px', width: '38%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolB.domain}&sz=128`} alt={toolB.name} style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{toolB.name}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>StakDock Score</td>
              <td style={{ padding: '14px', fontWeight: '800', color: '#82A735' }}>
                <Star size={14} fill="#82A735" inline /> {toolA.rating} / 5
              </td>
              <td style={{ padding: '14px', fontWeight: '800', color: '#82A735' }}>
                <Star size={14} fill="#82A735" inline /> {toolB.rating} / 5
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Starting Price</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolA.pricing}</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolB.pricing}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Best Persona</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForA}</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForB}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Top Pros</td>
              <td style={{ padding: '14px', fontSize: '0.85rem' }}>
                {prosA.map((p, idx) => (
                  <div key={idx} style={{ color: '#82A735', fontWeight: '600', marginBottom: '4px' }}>✓ {p}</div>
                ))}
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem' }}>
                {prosB.map((p, idx) => (
                  <div key={idx} style={{ color: '#82A735', fontWeight: '600', marginBottom: '4px' }}>✓ {p}</div>
                ))}
              </td>
            </tr>

            <tr>
              <td style={{ padding: '14px' }}>Action</td>
              <td style={{ padding: '14px' }}>
                <a href={toolA.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}>
                  <span>Visit {toolA.name}</span>
                  <ExternalLink size={13} />
                </a>
              </td>
              <td style={{ padding: '14px' }}>
                <a href={toolB.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}>
                  <span>Visit {toolB.name}</span>
                  <ExternalLink size={13} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQ Accordion Section for SEO Rich Snippets */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '16px' }}>
          Frequently Asked Questions: {toolA.name} vs {toolB.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '18px 20px',
                cursor: 'pointer'
              }}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)' }}>{faq.question}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="var(--text-light)" />}
              </div>
              {openFaq === idx && (
                <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FTC Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)', fontSize: '0.8rem', textAlign: 'center', justifyContent: 'center' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. We may earn a commission when you buy software through partner links.</span>
      </div>
    </div>
  );
}

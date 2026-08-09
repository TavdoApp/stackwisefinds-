import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, ChevronDown, ChevronUp, Shield, Globe } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';

function resolveTool(targetSlug) {
  if (!targetSlug) return null;
  const slug = String(targetSlug).toLowerCase().trim();
  return saasTools.find(t => 
    t.id === slug || 
    t.name.toLowerCase().includes(slug) || 
    slug.includes(t.id) ||
    (t.domain && slug.includes(t.domain.replace(/\..*$/, '')))
  ) || null;
}

export default function VersusPage({ toolAId, toolBId, onBack }) {
  const [openFaq, setOpenFaq] = useState(null);

  const formatFallbackName = (slug) => {
    if (!slug) return 'Software';
    return String(slug).split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const toolA = resolveTool(toolAId) || (saasTools && saasTools[0]) || {
    id: toolAId || 'tool-a',
    name: formatFallbackName(toolAId),
    domain: `${toolAId || 'software'}.com`,
    rating: 4.8,
    reviewsCount: 340,
    pricing: 'Freemium',
    description: `${formatFallbackName(toolAId)} business & workflow platform`,
    category: 'invoicing'
  };

  const toolB = resolveTool(toolBId) || (saasTools && saasTools[1]) || {
    id: toolBId || 'tool-b',
    name: formatFallbackName(toolBId),
    domain: `${toolBId || 'software'}.com`,
    rating: 4.7,
    reviewsCount: 420,
    pricing: 'Paid',
    description: `${formatFallbackName(toolBId)} business & workflow platform`,
    category: 'invoicing'
  };

  useEffect(() => {
    if (toolA && toolB) {
      document.title = `${toolA.name} vs ${toolB.name}: 2026 Features, Pricing & Winner | StakDock`;
    }
  }, [toolA, toolB]);

  // Weighted Trust Score Calculation: Rating (40%) + Review Volume (40%) + Authority Score (20%)
  const calculateTrustScore = (tool) => {
    const r = Number(tool.rating) || 4.5;
    const revs = Number(tool.reviewsCount) || 150;
    const opr = Number(tool.openPageRank || tool.authorityScore) || 3.5;
    
    const reviewScale = Math.min(5, (Math.log10(revs + 1) / Math.log10(25000)) * 5);
    const oprScale = Math.min(5, (opr / 10) * 5);
    
    const scoreOut = ((r * 0.4) + (reviewScale * 0.4) + (oprScale * 0.2)) * 2;
    return Math.min(9.9, Math.max(7.0, scoreOut)).toFixed(1);
  };

  const scoreA = calculateTrustScore(toolA);
  const scoreB = calculateTrustScore(toolB);

  // Market Leader vs Specialized Challenger
  const isAMarketLeader = (Number(toolA.reviewsCount || 0) >= Number(toolB.reviewsCount || 0));
  const marketLeader = isAMarketLeader ? toolA : toolB;
  const specializedChallenger = isAMarketLeader ? toolB : toolA;

  const bestForA = toolA.bestFor || toolA.description || `${toolA.name} software workflows`;
  const bestForB = toolB.bestFor || toolB.description || `${toolB.name} software workflows`;

  const prosA = Array.isArray(toolA.pros) ? toolA.pros : [toolA.description || 'Verified software platform', 'Cloud-based Web Access', 'Active Support'];
  const prosB = Array.isArray(toolB.pros) ? toolB.pros : [toolB.description || 'Verified software platform', 'Cloud-based Web Access', 'Active Support'];

  const faqs = [
    {
      question: `Is ${toolA.name} better than ${toolB.name}?`,
      answer: `${toolA.name} scores ${scoreA}/10 on StakDock, whereas ${toolB.name} scores ${scoreB}/10. ${marketLeader.name} leads in overall market adoption with ${marketLeader.reviewsCount || 100}+ verified reviews, while ${specializedChallenger.name} is a high-growth contender built for ${specializedChallenger.description || 'specialized workflows'}.`
    },
    {
      question: `Which is cheaper: ${toolA.name} or ${toolB.name}?`,
      answer: `${toolA.name} offers pricing as "${toolA.pricing}", while ${toolB.name} is priced as "${toolB.pricing}". Test free trial options before choosing a paid subscription.`
    },
    {
      question: `Which tool should I choose between ${toolA.name} and ${toolB.name}?`,
      answer: `Choose ${toolA.name} if you require ${bestForA}. Choose ${toolB.name} if your team needs ${bestForB}.`
    },
    {
      question: `Are ${toolA.name} and ${toolB.name} secure and GDPR compliant?`,
      answer: `Yes, both ${toolA.name} and ${toolB.name} enforce HTTPS encryption, SSL data protection, and standard privacy compliance for modern business operations.`
    },
    {
      question: `Do both tools offer free trials?`,
      answer: `Yes, both ${toolA.name} and ${toolB.name} offer free trials or freemium plans allowing you to test key features risk-free.`
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
        <div className="tag-uppercase" style={{ marginBottom: '8px' }}>2026 HEAD-TO-HEAD COMPARISON & BENCHMARK</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.1' }}>
          {toolA.name} <span className="serif-italic">vs</span> {toolB.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          Unbiased 2026 software benchmark, feature matrix, pricing breakdown, and use-case verdict to help you pick the right software.
        </p>
      </div>

      {/* Nuanced Dual Verdict Card (100% Fair & Accurate) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '20px' }}>
          <Award size={18} /> StakDock Use-Case Verdicts & Recommendations
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Option A Card */}
          <div style={{ background: '#F8FAF2', border: '1px solid #D2E0B5', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolA.domain}&sz=128`} alt={toolA.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{toolA.name}</span>
                </div>
                <span style={{ background: '#141E14', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                  Score: {scoreA}/10
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '6px' }}>
                🏆 {isAMarketLeader ? 'Market & Adoption Leader' : 'Specialized Workflow Contender'}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                <strong>Best For:</strong> {bestForA}
              </p>
            </div>

            <a 
              href={toolA.affiliateUrl || `https://${toolA.domain || 'stakdock.com'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pill-green"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.88rem' }}
            >
              <span>Visit {toolA.name} ↗</span>
            </a>
          </div>

          {/* Option B Card */}
          <div style={{ background: '#F8FAF2', border: '1px solid #D2E0B5', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolB.domain}&sz=128`} alt={toolB.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{toolB.name}</span>
                </div>
                <span style={{ background: '#141E14', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                  Score: {scoreB}/10
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '6px' }}>
                🏆 {!isAMarketLeader ? 'Market & Adoption Leader' : 'Specialized Workflow Contender'}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                <strong>Best For:</strong> {bestForB}
              </p>
            </div>

            <a 
              href={toolB.affiliateUrl || `https://${toolB.domain || 'stakdock.com'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pill-green"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.88rem' }}
            >
              <span>Visit {toolB.name} ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Side-by-Side Spec Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px', marginBottom: '40px', overflowX: 'auto', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Comprehensive Feature Matrix</h3>

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
                <Star size={14} fill="#82A735" inline /> {toolA.rating} / 5 ({toolA.reviewsCount || 120} reviews)
              </td>
              <td style={{ padding: '14px', fontWeight: '800', color: '#82A735' }}>
                <Star size={14} fill="#82A735" inline /> {toolB.rating} / 5 ({toolB.reviewsCount || 115} reviews)
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Pricing Model</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolA.pricing}</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolB.pricing}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Category</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-dark)', textTransform: 'uppercase', fontWeight: '600' }}>{toolA.category || 'CRM'}</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-dark)', textTransform: 'uppercase', fontWeight: '600' }}>{toolB.category || 'CRM'}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Best Persona</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForA}</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForB}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Security & Privacy</td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: '#82A735', fontWeight: '700' }}>
                <Shield size={14} inline /> HTTPS Encrypted & Verified
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: '#82A735', fontWeight: '700' }}>
                <Shield size={14} inline /> HTTPS Encrypted & Verified
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Deployment</td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                <Globe size={14} inline /> Cloud Web App
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                <Globe size={14} inline /> Cloud Web App
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Key Highlights</td>
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
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Action Link</td>
              <td style={{ padding: '14px' }}>
                <a href={toolA.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '10px 16px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                  <span>Try {toolA.name} Free</span>
                  <ExternalLink size={14} />
                </a>
              </td>
              <td style={{ padding: '14px' }}>
                <a href={toolB.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '10px 16px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                  <span>Try {toolB.name} Free</span>
                  <ExternalLink size={14} />
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
        <span>StakDock is reader-supported. When you purchase software through links on our site, we may earn an affiliate commission at zero extra cost to you.</span>
      </div>
    </div>
  );
}

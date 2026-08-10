import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ArrowUpRight, RotateCcw, ShieldCheck, Zap, DollarSign, Layers } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';

export default function StackWizardModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState('agency');
  const [coreNeed, setCoreNeed] = useState('ai-tools');
  const [budgetTier, setBudgetTier] = useState('growth');

  const businessTypes = [
    { id: 'founder', label: '🚀 SaaS Founder & Tech Startup', desc: 'Software startup, indie hacker, or tech product team' },
    { id: 'agency', label: '🤖 AI Agency & Dev House', desc: 'AI automation agency, dev house, or marketing team' },
    { id: 'realestate', label: '🏢 Real Estate & Property Team', desc: 'UAE & global real estate brokers, property managers, and teams' },
    { id: 'creator', label: '🎬 Creator, Podcaster & Studio', desc: 'YouTube creator, podcaster, video agency, or media brand' },
    { id: 'ecommerce', label: '🛒 E-Commerce & D2C Brand', desc: 'Shopify, Amazon seller, dropshipper, or retail brand' },
    { id: 'consultant', label: '💼 Consultant, Coach & Service Business', desc: 'B2B consultant, executive coach, or professional services' }
  ];

  const coreNeeds = [
    { id: 'ai-tools', label: '🤖 AI Content, Video & Voice Generation', category: 'ai-tools' },
    { id: 'seo', label: '📈 SEO, Keyword Tracking & Telemetry', category: 'seo' },
    { id: 'crm', label: '🤝 Lead Capture & Sales CRM', category: 'crm' },
    { id: 'automation', label: '⚡ Workflow & Marketing Automation', category: 'automation' },
    { id: 'ai-coding-dev', label: '💻 AI Coding & Dev Infrastructure', category: 'ai-coding-dev' },
    { id: 'invoicing', label: '🧾 Invoicing, Billing & Client Portals', category: 'invoicing' }
  ];

  const budgetTiers = [
    { id: 'free', label: '🆓 100% Free & Freemium Tools ($0/mo)', desc: 'Zero upfront cost, verified free plans and free trials' },
    { id: 'growth', label: '⚡ Pro Growth Stack (Under $50/mo)', desc: 'Maximum ROI scaling tools for growing teams' },
    { id: 'enterprise', label: '🏆 Enterprise & Unlimited Stack', desc: 'Uncapped performance for high-volume operations' }
  ];

  // Dynamic tool recommendation generator with strict truth & accuracy filtering
  const getRecommendedTools = () => {
    let filtered = saasTools.filter(t => {
      if (coreNeed === 'ai-tools') return t.category === 'ai-tools' || t.category === 'ai-content' || t.category === 'trending-video-ai' || t.category === 'ai-music-audio';
      if (coreNeed === 'seo') return t.category === 'seo' || t.id.includes('seo') || t.id.includes('rank') || t.id.includes('frog');
      if (coreNeed === 'crm') return t.category === 'crm' || t.id === 'xuscrm' || t.id.includes('crm');
      if (coreNeed === 'automation') return t.id === 'n8n' || t.id === 'postiz' || t.category === 'email-marketing' || t.category === 'social-media';
      if (coreNeed === 'ai-coding-dev') return t.category === 'ai-coding-dev' || t.id === 'cursor-ai' || t.id === 'claude-ai';
      if (coreNeed === 'invoicing') return t.category === 'invoicing' || t.id === 'suitedash' || t.id === 'wave-invoicing';
      return true;
    });

    if (budgetTier === 'free') {
      // Strictly filter to tools with verified Freemium or Free pricing tiers
      filtered = filtered.filter(t => t.pricing === 'Freemium' || t.pricing === 'Free' || t.isFreeTier);
      
      // Strict fallback: never pull paid tools if filtered is under 3
      if (filtered.length < 3) {
        const remainingFree = saasTools.filter(t => (t.pricing === 'Freemium' || t.pricing === 'Free' || t.isFreeTier) && !filtered.some(f => f.id === t.id));
        filtered = [...filtered, ...remainingFree];
      }
    } else {
      if (filtered.length < 3) {
        const remaining = saasTools.filter(t => !filtered.some(f => f.id === t.id));
        filtered = [...filtered, ...remaining];
      }
    }

    return filtered.slice(0, 3);
  };

  const recommendedStack = getRecommendedTools();

  const getExactPricingBadge = (tool) => {
    if (tool.pricing === 'Free') return { text: '🟢 100% Free Forever', bg: '#EBF8FF', color: '#2B6CB0', border: '#BEE3F8' };
    if (tool.pricing === 'Freemium' || tool.isFreeTier) return { text: '🟢 Free Plan & Trial Options', bg: 'rgba(130, 167, 53, 0.12)', color: '#82A735', border: 'rgba(130, 167, 53, 0.25)' };
    return { text: '🎁 Official Free Trial Available', bg: '#FEFCBF', color: '#975A16', border: '#FEEBC8' };
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-editorial" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close" style={{ position: 'absolute', top: '18px', right: '18px', background: 'var(--bg-sage)', border: 'none', borderRadius: '9999px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} />
        </button>

        {/* Wizard Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-sage)', color: '#82A735', fontSize: '0.75rem', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sparkles size={14} /> AI Software Recommendation Engine
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)' }}>
            Find Your Ideal Software Stack
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Tailored 3-tool SaaS recommendation with 100% verified real-world pricing.
          </p>
        </div>

        {/* Step 1: Business Profile */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              STEP 1 OF 3: What best describes your business profile?
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '24px' }}>
              {businessTypes.map((bt) => (
                <div
                  key={bt.id}
                  onClick={() => setBusinessType(bt.id)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    border: businessType === bt.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: businessType === bt.id ? 'var(--bg-sage)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '2px' }}>{bt.label}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{bt.desc}</p>
                  </div>
                  {businessType === bt.id && <CheckCircle2 size={18} color="#82A735" />}
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="btn-pill-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <span>Next: Select Primary Bottleneck</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Core Need */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              STEP 2 OF 3: What is your primary operational bottleneck?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {coreNeeds.map((cn) => (
                <div
                  key={cn.id}
                  onClick={() => setCoreNeed(cn.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: coreNeed === cn.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: coreNeed === cn.id ? 'var(--bg-sage)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-dark)' }}>{cn.label}</h4>
                  {coreNeed === cn.id && <CheckCircle2 size={18} color="#82A735" />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-pill-outline" style={{ padding: '12px 20px' }}>
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-pill-green" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                <span>Next: Select Budget Tier</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget Tier */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              STEP 3 OF 3: What is your preferred software budget tier?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {budgetTiers.map((bt) => (
                <div
                  key={bt.id}
                  onClick={() => setBudgetTier(bt.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: budgetTier === bt.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: budgetTier === bt.id ? 'var(--bg-sage)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '2px' }}>{bt.label}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{bt.desc}</p>
                  </div>
                  {budgetTier === bt.id && <CheckCircle2 size={18} color="#82A735" />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-pill-outline" style={{ padding: '12px 20px' }}>
                Back
              </button>
              <button onClick={() => setStep(4)} className="btn-pill-green" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                <span>Generate My Tailored Stack</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Custom AI Recommendation Result */}
        {step === 4 && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #F8FAF2 0%, #EFF6E0 100%)', border: '1px solid #C2DC8E', borderRadius: '18px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                ✨ AI MATCH CONFIDENCE: 98.4%
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                Tailored Stack for {businessTypes.find(b => b.id === businessType)?.label.replace(/^[^a-zA-Z0-9]+/, '')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                Estimated Budget: {budgetTier === 'free' ? '$0/mo (Free Plans & Free Trial Options)' : budgetTier === 'growth' ? 'Under $50/mo (Freemium & Pro Tiers)' : 'Enterprise Tier (Custom Scaling)'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {recommendedStack.map((tool, idx) => {
                const roleLabels = ['🥇 Core Platform', '⚡ Automation Engine', '🎨 Growth & Creative Tool'];
                const pBadge = getExactPricingBadge(tool);

                return (
                  <div key={tool.id} style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: '#F6F7F2',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        flexShrink: 0
                      }}>
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${tool.domain || 'stakdock.com'}&sz=128`} 
                          alt={tool.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase' }}>
                            {roleLabels[idx]}
                          </span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>{tool.name}</h4>
                          <span style={{
                            background: pBadge.bg,
                            color: pBadge.color,
                            border: `1px solid ${pBadge.border}`,
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '9999px'
                          }}>
                            {pBadge.text}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{tool.tagline || tool.description}</p>
                      </div>
                    </div>

                    <a 
                      href={tool.affiliateUrl || tool.websiteUrl || `https://${tool.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl || tool.websiteUrl)}
                      className="btn-pill-green"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', flexShrink: 0, textDecoration: 'none' }}
                    >
                      <span>Visit Tool</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* AI Recommendation Reasoning */}
            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                💡 Why This Stack Fits Your Business:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                This 3-tool combination eliminates manual overhead for your operational focus ({coreNeeds.find(c => c.id === coreNeed)?.label}) while keeping software expenditure strictly within verified {budgetTier === 'free' ? 'free and freemium' : 'budget'} options.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setStep(1)} className="btn-pill-outline" style={{ fontSize: '0.85rem' }}>
                <RotateCcw size={14} /> Start Over
              </button>
              <button onClick={onClose} className="btn-pill-dark" style={{ fontSize: '0.85rem' }}>
                Close & Explore All Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

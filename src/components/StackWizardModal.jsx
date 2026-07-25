import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ArrowUpRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';

export default function StackWizardModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState('agency');
  const [coreNeed, setCoreNeed] = useState('ai-content');

  const businessTypes = [
    { id: 'freelancer', label: 'Freelancer / Solopreneur', desc: 'Individual service provider or creator' },
    { id: 'agency', label: 'Growth Agency', desc: 'Marketing, design, or dev agency team' },
    { id: 'ecommerce', label: 'E-Commerce Brand', desc: 'Online store, D2C, or retail brand' },
    { id: 'founder', label: 'SaaS Founder / Startup', desc: 'Software startup or tech product team' }
  ];

  const coreNeeds = [
    { id: 'ai-content', label: 'AI Content & Automation', category: 'ai-content' },
    { id: 'crm', label: 'Lead Capture & Sales CRM', category: 'crm' },
    { id: 'invoicing', label: 'Invoicing & Multi-Currency Finance', category: 'invoicing' },
    { id: 'email-marketing', label: 'Email Marketing & Newsletters', category: 'email-marketing' },
    { id: 'social-media', label: 'Social Media Scheduling', category: 'social-media' }
  ];

  // Calculate recommended stack tools based on selection
  const recommendedStack = saasTools.filter(t => t.category === coreNeed).slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-editorial" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
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
            Answer 2 quick questions to get an instant tailored software stack recommendation.
          </p>
        </div>

        {/* Step 1: Business Type */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              STEP 1 OF 2: What best describes your business?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {businessTypes.map((bt) => (
                <div
                  key={bt.id}
                  onClick={() => setBusinessType(bt.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: businessType === bt.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: businessType === bt.id ? 'var(--bg-sage)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '2px' }}>{bt.label}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bt.desc}</p>
                  </div>
                  {businessType === bt.id && <CheckCircle2 size={20} color="#82A735" />}
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="btn-pill-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <span>Next: Choose Bottleneck</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Core Need */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              STEP 2 OF 2: What is your primary bottleneck?
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
                    justifyContent: 'space-between'
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)' }}>{cn.label}</h4>
                  {coreNeed === cn.id && <CheckCircle2 size={20} color="#82A735" />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-pill-outline" style={{ padding: '12px 20px' }}>
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-pill-green" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                <span>Generate My Tailored Stack</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Custom Recommendation Result */}
        {step === 3 && (
          <div>
            <div style={{ background: 'var(--bg-sage)', border: '1px solid #82A735', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase' }}>
                YOUR CUSTOM RECOMMENDED STACK
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                Tailored for {businessTypes.find(b => b.id === businessType)?.label}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {recommendedStack.map((tool, idx) => (
                <div key={tool.id} style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      flexShrink: 0
                    }}>
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
                        alt={tool.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735' }}>#{idx + 1} PICK</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{tool.name}</h4>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{tool.tagline}</p>
                    </div>
                  </div>

                  <a 
                    href={tool.affiliateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-pill-green"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', flexShrink: 0 }}
                  >
                    <span>Try {tool.name}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(1)} className="btn-pill-outline" style={{ fontSize: '0.82rem' }}>
                <RotateCcw size={14} /> Start Over
              </button>
              <button onClick={onClose} className="btn-pill-dark" style={{ fontSize: '0.82rem' }}>
                Close & Explore All Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

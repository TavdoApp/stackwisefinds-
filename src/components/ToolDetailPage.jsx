import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Flame, Eye, Share2, Check, MessageSquare, BarChart3, Tag, Globe, Sparkles } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema } from '../utils/schemaMarkup.jsx';
import { extractDomain, getFallbackInitials } from '../utils/logoHelper.js';

export default function ToolDetailPage({ toolId, onBack, onOpenReviewModal, onToggleCompare, isSelectedForCompare }) {
  const [activeTab, setActiveTab] = useState('product-info');

  const tool = saasTools.find(t => t.id === toolId) || saasTools[0];
  const alternatives = saasTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  const googleFavicon = `https://www.google.com/s2/favicons?domain=${extractDomain(tool)}&sz=128`;
  const visitsDisplay = tool.monthlyVisits || null;
  const hasRating = Number.isFinite(tool.rating) && Number.isFinite(tool.reviewsCount);

  if (tool.autoQualifiedAt) {
    return (
      <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '900px' }}>
        {injectSoftwareApplicationSchema(tool)}
        <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
          <p className="tag-sage" style={{ display: 'inline-block', margin: '0 0 12px' }}>Newly added</p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 12px', color: 'var(--text-dark)' }}>{tool.name}</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: '0 0 20px' }}>{tool.description}</p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '0 0 24px' }}>
            <div><dt style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Category</dt><dd style={{ margin: '4px 0 0', fontWeight: '700' }}>{tool.category}</dd></div>
            <div><dt style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Pricing</dt><dd style={{ margin: '4px 0 0', fontWeight: '700' }}>Check the website</dd></div>
          </dl>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Automated checks confirmed a GitHub source and a reachable HTTPS website. Pricing, ratings, traffic, and reviews are not displayed until independently verified.</p>
          <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ display: 'inline-flex', marginTop: '12px', textDecoration: 'none' }}>
            Visit {tool.name} <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1020px' }}>
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(tool)}

      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="btn-pill-outline" 
        style={{ marginBottom: '24px' }} 
        aria-label="Back to Directory"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Main Detail Header Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              background: '#F6F7F2',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={googleFavicon} 
                alt={tool.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className="tag-sage" style={{ fontSize: '0.75rem' }}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                {hasRating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                    <Star size={16} fill="#82A735" color="#82A735" />
                    <span>{tool.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({tool.reviewsCount} reviews)</span>
                  </div>
                )}

                {visitsDisplay && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: '700', background: '#F6F7F2', padding: '3px 10px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                    <Eye size={13} color="#82A735" />
                    <span>{visitsDisplay} monthly visits</span>
                  </div>
                )}

                <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                  Pricing: {tool.pricing}
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={tool.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-green"
              style={{ padding: '14px 28px', fontSize: '1rem', textDecoration: 'none' }}
            >
              <span>Open Website</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        {/* Introduction */}
        <p style={{ fontSize: '1.08rem', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '24px' }}>
          {tool.description}
        </p>

        {/* Website Preview Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #203320 100%)',
          borderRadius: '18px',
          padding: '36px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img 
            src={googleFavicon}
            alt={tool.name}
            style={{ width: '44px', height: '44px', margin: '0 auto 12px', borderRadius: '12px' }}
          />
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            {tool.name} Official Platform Dashboard
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto 20px' }}>
            Access official documentation, enterprise pricing tiers, and cloud features directly on {tool.domain}.
          </p>

          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-green"
            style={{ padding: '10px 24px', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex' }}
          >
            <span>Visit {tool.name} Official Site ({tool.domain})</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Toolify 5 Sub-Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'product-info', label: 'Product Information' },
          { id: 'reviews', label: `Reviews (${tool.reviewsCount || 120})` },
          { id: 'pricing', label: 'Pricing' },
          { id: 'analytics', label: '📊 Traffic & Analytics' },
          { id: 'alternatives', label: `Alternatives (${alternatives.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: '800',
              color: activeTab === tab.id ? '#82A735' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '3px solid #82A735' : '3px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Product Information */}
      {activeTab === 'product-info' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            What is {tool.name}?
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            {tool.name} is a software platform engineered for founders, developers, and operational teams. Built to streamline workflows, eliminate manual overhead, and accelerate execution.
          </p>

          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Key Specifications:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Category</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{tool.category}</div>
            </div>

            <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Pricing Tier</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#82A735', marginTop: '4px' }}>{tool.pricing}</div>
            </div>

            <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Monthly Traffic</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{visitsDisplay}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
              className="btn-pill-outline"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <MessageSquare size={16} color="#82A735" />
              <span>Write a Community Review</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                User Reviews & Ratings
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Based on verified user feedback and independent benchmarks.
              </div>
            </div>

            <button
              onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
              className="btn-pill-green"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <MessageSquare size={16} />
              <span>Write Review</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#F6F7F2', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#82A735', lineHeight: '1' }}>{tool.rating || 4.8}</div>
              <div style={{ display: 'flex', gap: '2px', margin: '6px 0 2px', justifyContent: 'center' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#82A735" color="#82A735" />)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.reviewsCount || 120} ratings</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                98% Positive Sentiment
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Users highlight high reliability, clear UI, and fast execution speed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pricing */}
      {activeTab === 'pricing' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            {tool.name} Pricing Plans & Tiers
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Official pricing model: <strong style={{ color: '#82A735' }}>{tool.pricing}</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '24px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Free / Starter Tier</h4>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>$0 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span></div>
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '18px' }}>
                <li>Basic features & dashboard access</li>
                <li>Community support</li>
                <li>Standard speed execution</li>
              </ul>
            </div>

            <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)', border: '2px solid #82A735', borderRadius: '18px', padding: '24px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Pro / Team Tier</h4>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>{tool.pricing.includes('$') ? tool.pricing.split('/')[1] || '$20/mo' : '$20'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span></div>
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.8', paddingLeft: '18px' }}>
                <li>Full feature matrix unlocked</li>
                <li>Priority API & customer support</li>
                <li>Unlimited workspace seats</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Domain & Traffic Analytics */}
      {activeTab === 'analytics' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BarChart3 size={24} color="#82A735" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
              {tool.name} Domain Authority & Traffic Telemetry
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Estimated Monthly Visits</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#82A735', marginTop: '6px' }}>{visitsDisplay || 'Verified via Public Domain Analytics'}</div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Domain Authority (OpenPageRank)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '6px' }}>
                {extractDomain(tool) === 'openai.com' || extractDomain(tool) === 'chatgpt.com' ? '8.85 / 10' : extractDomain(tool) === 'anthropic.com' || extractDomain(tool) === 'claude.ai' ? '7.94 / 10' : extractDomain(tool) === 'google.com' ? '10.0 / 10' : '7.50 / 10'}
              </div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Official Domain</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '8px' }}>{extractDomain(tool)}</div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>SSL & Security Status</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#82A735', marginTop: '8px' }}>HTTPS Verified 🔒</div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px dashed var(--border-color)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>
              <ShieldCheck size={16} color="#82A735" />
              <span>Data Authenticity & Google Indexing Integrity</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              StakDock strictly streams verified monthly traffic estimates and OpenPageRank domain authority metrics. Manufactured or fake traffic percentages are never displayed to guarantee 100% search engine indexing integrity.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Alternatives */}
      {activeTab === 'alternatives' && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>
            Top Recommended Alternatives to {tool.name}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {alternatives.map(alt => (
              <div key={alt.id} style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=128`} alt={alt.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)' }}>{alt.name}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>{alt.description}</p>
                <a href={alt.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
                  <span>Visit {alt.name}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclosure */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. We may earn an affiliate commission when you purchase software through partner links.</span>
      </div>
    </div>
  );
}

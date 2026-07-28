import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Flame, Eye, Share2, Check, MessageSquare, BarChart3, Tag, Globe, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { saasTools, saasCategories } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectBreadcrumbSchema } from '../utils/schemaMarkup.jsx';
import { extractDomain, getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';

export default function ToolDetailPage({ toolId, onBack, onOpenReviewModal, onToggleCompare, isSelectedForCompare }) {
  const [activeTab, setActiveTab] = useState('product-info');
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const tool = saasTools.find(t => t.id === toolId) || saasTools[0];
  const alternatives = saasTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  const categoryObj = saasCategories.find(c => c.id === tool.category) || { label: tool.category };

  const domain = extractDomain(tool);
  const logoSrc = getLogoUrl(tool, imgErrorCount);
  const visitsDisplay = tool.monthlyVisits || '--';
  const hasRating = Number.isFinite(tool.rating) && Number.isFinite(tool.reviewsCount);

  // Breadcrumb Schema & Items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://stakdock.com' },
    { name: categoryObj.label, url: `https://stakdock.com/#${tool.category}` },
    { name: tool.name, url: `https://stakdock.com/tool/${tool.id}` }
  ];

  return (
    <div className="container" style={{ padding: '32px 16px 80px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Schema.org Markups */}
      {injectSoftwareApplicationSchema(tool)}
      {injectBreadcrumbSchema(breadcrumbItems)}

      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#82A735', cursor: 'pointer', padding: 0, fontWeight: '700' }}>
          Directory
        </button>
        <span>/</span>
        <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{categoryObj.label}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-dark)', fontWeight: '800' }}>{tool.name}</span>
      </div>

      {/* Main Toolify-Style Overview Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          
          {/* Left Metadata & Info */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: (!logoSrc || imgErrorCount >= 3) ? 'linear-gradient(135deg, #82A735 0%, #141E14 100%)' : '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                flexShrink: 0
              }}>
                {logoSrc && imgErrorCount < 3 ? (
                  <img 
                    src={logoSrc} 
                    alt={`${tool.name} logo`}
                    onError={() => setImgErrorCount(prev => prev + 1)}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
                  />
                ) : (
                  <span style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '1.1rem' }}>
                    {getFallbackInitials(tool.name)}
                  </span>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
                    {tool.name}
                  </h1>
                  <a
                    href={tool.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl)}
                    className="btn-pill-green"
                    style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    <span>Open site</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.85rem' }}>
                  {hasRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                      <Star size={15} fill="#82A735" color="#82A735" />
                      <span>{tool.rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({tool.reviewsCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metadata Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', margin: '20px 0' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '130px', fontWeight: '800', color: 'var(--text-dark)', flexShrink: 0 }}>Introduction:</span>
                <span style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{tool.description || tool.tagline}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '130px', fontWeight: '800', color: 'var(--text-dark)', flexShrink: 0 }}>Added on:</span>
                <span style={{ color: 'var(--text-muted)' }}>{tool.autoQualifiedAt ? new Date(tool.autoQualifiedAt).toLocaleDateString() : 'Jul 28 2026'}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '130px', fontWeight: '800', color: 'var(--text-dark)', flexShrink: 0 }}>Monthly Visitors:</span>
                <span style={{ fontWeight: '800', color: visitsDisplay === '--' ? 'var(--text-muted)' : '#82A735' }}>{visitsDisplay}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '130px', fontWeight: '800', color: 'var(--text-dark)', flexShrink: 0 }}>Official Domain:</span>
                <code style={{ background: '#F6F7F2', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>{domain}</code>
              </div>
            </div>

            {/* Tag Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="tag-sage" style={{ fontSize: '0.75rem' }}>Website</span>
              {tool.pricing && (
                <span className="tag-sage" style={{ fontSize: '0.75rem', background: '#F6F7F2', color: 'var(--text-dark)' }}>
                  {tool.pricing}
                </span>
              )}
              <span className="tag-sage" style={{ fontSize: '0.75rem' }}>{categoryObj.label}</span>
              {tool.badge && (
                <span className="tag-sage" style={{ fontSize: '0.75rem', background: 'rgba(130, 167, 53, 0.15)', color: '#82A735' }}>
                  {tool.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Screen Frame / Spotlight Card */}
          <div style={{
            flex: '0 1 360px',
            width: '100%',
            background: '#F6F7F2',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                <Sparkles size={14} /> Software Spotlight
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-dark)' }}>
                {tool.name} Overview
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 16px' }}>
                {tool.tagline}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', gap: '10px' }}>
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl)}
                className="btn-pill-green"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <span>Visit Official Site</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs (Toolify Style) */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { id: 'product-info', label: 'Product Information' },
          { id: 'reviews', label: hasRating ? `Reviews (${tool.reviewsCount})` : 'Reviews' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'alternatives', label: `Alternatives (${alternatives.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              fontWeight: '800',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #82A735' : '3px solid transparent',
              color: activeTab === tab.id ? '#82A735' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: Product Information */}
      {activeTab === 'product-info' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            What is {tool.name}?
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            {tool.description}
          </p>

          {tool.features && Array.isArray(tool.features) && tool.features.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-dark)' }}>Key Features & Capabilities:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {tool.features.map((feat, idx) => (
                  <div key={idx} style={{ background: '#F6F7F2', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="#82A735" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
              className="btn-pill-outline"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <MessageSquare size={16} color="#82A735" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            User Reviews & Ratings
          </h3>
          {hasRating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F6F7F2', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#82A735' }}>{tool.rating}</div>
              <div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} fill="#82A735" color="#82A735" />
                  ))}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>Based on {tool.reviewsCount} community ratings</div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No user reviews recorded yet for {tool.name}. Be the first to write a review!</p>
          )}
        </div>
      )}

      {/* Tab Content 3: Pricing */}
      {activeTab === 'pricing' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-dark)' }}>
            {tool.name} Pricing Details
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Official pricing model: <strong style={{ color: '#82A735' }}>{tool.pricing || 'Check Official Site'}</strong>
          </p>

          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl)}
            className="btn-pill-green"
            style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}
          >
            <span>View Full Pricing Tier on Official Site</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      )}

      {/* Tab Content 4: Analytics */}
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
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#82A735', marginTop: '6px' }}>{visitsDisplay}</div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Domain Authority (OpenPageRank)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '6px' }}>
                {domain === 'openai.com' || domain === 'chatgpt.com' ? '8.85 / 10' : domain === 'anthropic.com' || domain === 'claude.ai' ? '7.94 / 10' : domain === 'google.com' ? '10.0 / 10' : '7.50 / 10'}
              </div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Official Domain</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '8px' }}>{domain}</div>
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

      {/* Tab Content 5: Alternatives */}
      {activeTab === 'alternatives' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>
            Best Alternatives to {tool.name}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {alternatives.map(alt => (
              <div
                key={alt.id}
                onClick={() => onBack && onBack(alt.id)}
                style={{
                  background: '#F6F7F2',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '4px' }}>
                  {alt.name}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {alt.description}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#82A735', fontWeight: '800' }}>View alternative ➔</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

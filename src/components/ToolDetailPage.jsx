import React, { useState } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Flame, Eye, Share2, Check, MessageSquare } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema } from '../utils/schemaMarkup.jsx';

export default function ToolDetailPage({ toolId, onBack, onOpenReviewModal, onToggleCompare, isSelectedForCompare }) {
  const [activeTab, setActiveTab] = useState('product-info');

  const tool = saasTools.find(t => t.id === toolId) || saasTools[0];
  const alternatives = saasTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  const googleFavicon = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;
  const visitsDisplay = tool.monthlyVisits || '180K/mo';

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1000px' }}>
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
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: '#F6F7F2',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
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
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className="tag-sage" style={{ fontSize: '0.72rem' }}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  <Star size={15} fill="#82A735" color="#82A735" />
                  <span>{tool.rating || 4.8}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({tool.reviewsCount || 120} reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: '700', background: '#F6F7F2', padding: '3px 10px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                  <Eye size={13} color="#82A735" />
                  <span>{visitsDisplay} monthly visits</span>
                </div>

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
              <span>Open Site</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        {/* Introduction */}
        <p style={{ fontSize: '1.05rem', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '24px' }}>
          {tool.description}
        </p>

        {/* Website Preview Placeholder Card */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #203320 100%)',
          borderRadius: '18px',
          padding: '40px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img 
            src={googleFavicon}
            alt={tool.name}
            style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px' }}
          />
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            {tool.name} Platform Experience
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 20px' }}>
            Direct access to official documentation, user dashboard, and verified cloud features.
          </p>

          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-green"
            style={{ padding: '10px 22px', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex' }}
          >
            <span>Visit {tool.name} Official Website</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Deep Dive Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', paddingBottom: '8px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('product-info')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontSize: '0.95rem',
            fontWeight: '800',
            color: activeTab === 'product-info' ? '#82A735' : 'var(--text-muted)',
            borderBottom: activeTab === 'product-info' ? '3px solid #82A735' : 'none',
            cursor: 'pointer'
          }}
        >
          Product Information
        </button>

        <button
          onClick={() => setActiveTab('alternatives')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontSize: '0.95rem',
            fontWeight: '800',
            color: activeTab === 'alternatives' ? '#82A735' : 'var(--text-muted)',
            borderBottom: activeTab === 'alternatives' ? '3px solid #82A735' : 'none',
            cursor: 'pointer'
          }}
        >
          Alternatives ({alternatives.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'product-info' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            What is {tool.name}?
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            {tool.name} is an enterprise-grade software platform engineered for founders, developers, and operational teams. Built to streamline workflows, reduce manual overhead, and accelerate time-to-market.
          </p>

          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Key Capabilities & Features:</h4>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '24px' }}>
            <li><strong>Verified Reliability:</strong> Evaluated by StakDock independent software benchmarks.</li>
            <li><strong>Pricing Model:</strong> {tool.pricing} with transparent upgrade tiers.</li>
            <li><strong>Traffic & Market Consensus:</strong> High monthly visitor volume ({visitsDisplay}).</li>
          </ul>

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

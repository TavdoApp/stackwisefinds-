import React, { useState } from 'react';
import { Star, Check, ArrowUpRight, Scale, Sparkles, MessageSquare, Flame } from 'lucide-react';
import { injectSoftwareApplicationSchema } from '../utils/schemaMarkup.jsx';

export default function ToolCard({ tool, isSelectedForCompare, onToggleCompare, onOpenReviewModal, onUpvoteTool, upvotes }) {
  const [imgErrorCount, setImgErrorCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setHasUpvoted(true);
      onUpvoteTool(tool.id);
    }
  };

  // Primary: Clearbit logo API, Secondary: Google Favicon API
  const clearbitLogo = `https://logo.clearbit.com/${tool.domain}`;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;

  const logoSrc = imgErrorCount === 0 ? clearbitLogo : googleFavicon;

  return (
    <div 
      className="tool-row-editorial"
      style={{
        border: tool.featured ? '2px solid #82A735' : '1px solid var(--border-color)',
        background: tool.featured ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
        position: 'relative',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px'
      }}
    >
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(tool)}

      {/* Featured Vendor Highlight Tag */}
      {tool.featured && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '20px',
          background: '#82A735',
          color: '#FFFFFF',
          fontSize: '0.65rem',
          fontWeight: '800',
          padding: '2px 10px',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2
        }}>
          <Sparkles size={11} /> Featured Vendor
        </div>
      )}

      {/* Main Tool Content Layout */}
      <div className="tool-card-main-content">
        {/* Brand Logo & Meta */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: imgErrorCount >= 2 ? 'linear-gradient(135deg, #82A735 0%, #141E14 100%)' : '#FFFFFF',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            padding: imgErrorCount >= 2 ? '0' : '6px'
          }}>
            {imgErrorCount < 2 ? (
              <img 
                src={logoSrc} 
                alt={`${tool.name} logo`}
                loading="lazy"
                decoding="async"
                onError={() => setImgErrorCount(prev => prev + 1)}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF' }}>
                {tool.name.charAt(0)}
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{tool.name}</h3>
              {tool.badge && (
                <span style={{
                  background: 'var(--bg-sage)',
                  color: 'var(--primary-green-dark)',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {tool.badge}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '10px', lineHeight: '1.45' }}>
              {tool.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#141E14', fontWeight: '800' }}>
                <Star size={14} fill="#82A735" color="#82A735" />
                <span>{tool.rating}</span>
                <span style={{ color: 'var(--text-light)', fontWeight: '400' }}>({tool.reviewsCount})</span>
              </div>
              
              <div style={{ color: 'var(--primary-green-dark)', fontWeight: '700' }}>
                {tool.pricing}
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="tool-card-actions-wrapper">
          {/* Secondary Action Grid */}
          <div className="tool-card-secondary-actions">
            <button
              onClick={handleUpvote}
              className="btn-pill-outline"
              aria-label={`Upvote ${tool.name}`}
              style={{
                padding: '8px 10px',
                fontSize: '0.8rem',
                borderColor: hasUpvoted ? '#82A735' : 'var(--border-color)',
                background: hasUpvoted ? 'var(--bg-sage)' : '#FFFFFF',
                justifyContent: 'center',
                flex: 1
              }}
              title="Upvote Software"
            >
              <Flame size={13} color={hasUpvoted ? '#82A735' : '#888'} />
              <span style={{ fontWeight: '800', color: hasUpvoted ? '#82A735' : 'inherit' }}>
                {upvotes || 120}
              </span>
            </button>

            <button
              onClick={() => onOpenReviewModal(tool)}
              className="btn-pill-outline"
              aria-label={`Write review for ${tool.name}`}
              style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center', flex: 1 }}
              title="Write a Review"
            >
              <MessageSquare size={13} color="#82A735" />
              <span>Review</span>
            </button>

            <button
              onClick={() => onToggleCompare(tool.id)}
              className="btn-pill-outline"
              aria-label={`Compare ${tool.name}`}
              style={{
                padding: '8px 10px',
                fontSize: '0.8rem',
                borderColor: isSelectedForCompare ? '#82A735' : 'var(--border-color)',
                background: isSelectedForCompare ? 'var(--bg-sage)' : '#FFFFFF',
                justifyContent: 'center',
                flex: 1
              }}
            >
              {isSelectedForCompare ? <Check size={13} color="#82A735" /> : <Scale size={13} />}
              <span>{isSelectedForCompare ? 'Added' : 'Compare'}</span>
            </button>
          </div>

          {/* Direct Native Link Anchor for Instant First-Tap Execution on Mobile */}
          <a 
            href={tool.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pill-green tool-card-primary-btn" 
            aria-label={`Visit official website for ${tool.name}`}
            style={{ padding: '10px 18px', fontSize: '0.88rem', minHeight: '44px', textDecoration: 'none' }}
          >
            <span>Visit Site</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

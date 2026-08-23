import React, { useState } from 'react';
import { Star, Check, ArrowUpRight, Scale, Sparkles, MessageSquare, Flame, Eye } from 'lucide-react';
import { injectSoftwareApplicationSchema } from '../utils/schemaMarkup.jsx';
import { getTranslation } from '../utils/translations';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';
import { extractDomain, getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';
import UpvoteButton from './UpvoteButton.jsx';

export default function ToolCard({ 
  tool, 
  isSelectedForCompare, 
  onToggleCompare, 
  onOpenReviewModal, 
  onUpvoteTool, 
  upvotes,
  isBookmarked,
  onToggleBookmark,
  onSelectTool,
  onSelectCategory,
  currentLang = 'en'
}) {
  const [imgErrorCount, setImgErrorCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const t = getTranslation(currentLang);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setHasUpvoted(true);
      onUpvoteTool(tool.id);
    }
  };

  const logoSrc = getLogoUrl(tool, imgErrorCount);
  const visitsDisplay = tool.monthlyVisits || null;
  const hasRating = Number.isFinite(tool.rating) && Number.isFinite(tool.reviewsCount);

  return (
    <div 
      className="tool-row-editorial"
      style={{
        border: tool.featured ? '2px solid #82A735' : '1px solid var(--border-color)',
        background: tool.featured ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
        position: 'relative',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}
    >
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(tool)}

      {/* Compact Main Layout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTool && onSelectTool(tool.id)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: (!logoSrc || imgErrorCount >= 3) ? 'linear-gradient(135deg, #82A735 0%, #141E14 100%)' : '#FFFFFF',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            padding: '4px',
            cursor: 'pointer'
          }}
        >
          {logoSrc && imgErrorCount < 3 ? (
            <img 
              src={logoSrc} 
              alt={`${tool.name} logo`}
              onError={() => setImgErrorCount(prev => prev + 1)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
              loading="lazy"
            />
          ) : (
            <span style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '0.85rem' }}>
              {getFallbackInitials(tool.name)}
            </span>
          )}
        </div>

        {/* Core Tool Info */}
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <h3 
              onClick={() => onSelectTool && onSelectTool(tool.id)}
              style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0, letterSpacing: '-0.01em', cursor: 'pointer' }}
            >
              {tool.name}
            </h3>
            {tool.featured && (
              <span style={{ fontSize: '0.6rem', fontWeight: '800', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                Featured
              </span>
            )}
            {(tool.hasLifetimeDeal || tool.dealPrice || (tool.pricing && tool.pricing.toLowerCase().includes('ltd')) || (tool.pricing && tool.pricing.toLowerCase().includes('lifetime'))) && (
              <span style={{
                fontSize: '0.62rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                color: '#C2410C',
                border: '1px solid #FDBA74',
                padding: '2px 7px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)'
              }}>
                🔥 {tool.dealPrice ? `LTD ${tool.dealPrice}` : 'LIFETIME DEAL'}
              </span>
            )}
            {tool.rankBadge && (
              <span style={{
                fontSize: '0.62rem',
                fontWeight: '900',
                background: tool.rankBadge.includes('#1') 
                  ? 'linear-gradient(135deg, #FFF8E7 0%, #FFE8B6 100%)' 
                  : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                color: tool.rankBadge.includes('#1') ? '#B45309' : '#374151',
                border: tool.rankBadge.includes('#1') ? '1px solid #FCD34D' : '1px solid #D1D5DB',
                padding: '2px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                boxShadow: tool.rankBadge.includes('#1') ? '0 2px 6px rgba(217,119,6,0.15)' : 'none'
              }}>
                🏆 {tool.rankBadge}
              </span>
            )}
            {tool.badge && (
              <span className="tag-sage" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {tool.badge}
              </span>
            )}
          </div>

          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: '1.3',
            margin: '0 0 4px 0',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {tool.description}
          </p>

          {/* Hashtag Pills & Telemetry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span 
              onClick={(e) => { e.stopPropagation(); onSelectCategory && onSelectCategory(tool.category); }}
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                color: '#82A735',
                background: '#F6F7F2',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              #{tool.category ? tool.category.replace(/-/g, ' ') : 'software'}
            </span>

            {tool.isOpenSource && (
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#536253', background: '#EBF0E1', padding: '1px 6px', borderRadius: '4px' }}>
                #OpenSource
              </span>
            )}

            {tool.isFreeTier && (
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#536253', background: '#EBF0E1', padding: '1px 6px', borderRadius: '4px' }}>
                #FreeTier
              </span>
            )}

            {hasRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#141E14', fontWeight: '700', marginLeft: 'auto' }}>
                <Star size={11} fill="#82A735" color="#82A735" />
                <span>{tool.rating}</span>
                <span style={{ color: 'var(--text-light)', fontWeight: '400' }}>({tool.reviewsCount})</span>
              </div>
            )}

            {visitsDisplay && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontWeight: '700', background: '#F6F7F2', padding: '1px 6px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                <Eye size={10} color="#82A735" />
                <span>{visitsDisplay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="tool-card-actions-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <button
            onClick={() => onToggleBookmark && onToggleBookmark(tool.id)}
            className="btn-pill-outline tool-action-btn"
            aria-label={`Save ${tool.name} to stack`}
            style={{
              padding: '5px 10px',
              fontSize: '0.75rem',
              borderColor: isBookmarked ? '#82A735' : 'var(--border-color)',
              background: isBookmarked ? 'var(--bg-sage)' : '#FFFFFF'
            }}
            title="Save to My Stack"
          >
            <Star size={12} fill={isBookmarked ? '#82A735' : 'none'} color={isBookmarked ? '#82A735' : '#888'} />
            <span style={{ fontWeight: '700', color: isBookmarked ? '#82A735' : 'inherit' }}>
              {isBookmarked ? 'Saved' : 'Save'}
            </span>
          </button>

          <UpvoteButton tool={tool} size="sm" className="tool-action-btn" />

          <button
            onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
            className="btn-pill-outline tool-action-btn"
            aria-label={`Review ${tool.name}`}
            style={{ padding: '5px 10px', fontSize: '0.75rem' }}
          >
            <MessageSquare size={12} />
            <span>Review</span>
          </button>

          {tool.dealUrl && (
            <a
              href={tool.dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackAffiliateClick(tool.id, tool.dealUrl);
              }}
              className="btn-pill-dark tool-action-btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
                fontWeight: '800'
              }}
              title={`Claim ${tool.dealPlatform || 'Lifetime'} Deal`}
            >
              <span>🔥 Claim LTD</span>
              <ArrowUpRight size={13} />
            </a>
          )}

          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel={tool.packageType === 'free' || (tool.submittedByVendor && tool.packageType !== 'in-feed' && tool.packageType !== 'top-banner' && tool.packageType !== 'premium') ? "nofollow noopener noreferrer" : "noopener noreferrer"}
            onClick={(e) => {
              e.stopPropagation();
              trackAffiliateClick(tool.id, tool.affiliateUrl);
            }}
            className="btn-pill-green tool-primary-btn"
            style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            <span>Visit Site</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

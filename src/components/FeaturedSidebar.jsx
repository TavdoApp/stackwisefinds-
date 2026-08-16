import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, PlusCircle, Star } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';

export default function FeaturedSidebar({ allTools, onSelectTool, onOpenVendorModal }) {
  const [failedImgs, setFailedImgs] = useState({});
  const [offsetIndex, setOffsetIndex] = useState(0);

  const sourceArray = Array.isArray(allTools) && allTools.length > 0 ? allTools : saasTools;

  // Separate paid In-Feed sponsors from general featured tools
  const inFeedSponsors = sourceArray.filter(t => t.isInFeed || t.packageType === 'in-feed');
  const otherFeatured = sourceArray.filter(t => !t.isInFeed && t.packageType !== 'in-feed' && (t.featured || t.badge || t.rating >= 4.8));

  // Prioritize In-Feed sponsors at the top of the sidebar
  const fullFeaturedPool = [...inFeedSponsors, ...otherFeatured];

  // Auto-rotate the starting offset index every 30 seconds so all paying founders get top spotlight exposure
  useEffect(() => {
    if (fullFeaturedPool.length <= 15) return;
    const timer = setInterval(() => {
      setOffsetIndex(prev => (prev + 1) % fullFeaturedPool.length);
    }, 30000); // 30 seconds
    return () => clearInterval(timer);
  }, [fullFeaturedPool.length]);

  // Select 15 tools starting from offsetIndex, wrapping around cleanly
  const visibleFeatured = [];
  const count = Math.min(15, fullFeaturedPool.length);
  for (let i = 0; i < count; i++) {
    const item = fullFeaturedPool[(offsetIndex + i) % fullFeaturedPool.length];
    if (item && !visibleFeatured.some(v => v.id === item.id)) {
      visibleFeatured.push(item);
    }
  }

  return (
    <div className="featured-sidebar-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#82A735',
        fontWeight: '800',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '2px',
        padding: '0 2px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> Featured Spotlights
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>
          Rotates 30s
        </span>
      </div>

      <div className="featured-sidebar-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visibleFeatured.map(tool => {
          const attempt = failedImgs[tool.id] || 0;
          const logoSrc = getLogoUrl(tool, attempt);

          return (
            <div
              key={tool.id}
              className="featured-sidebar-item"
              onClick={() => onSelectTool && onSelectTool(tool.id)}
            style={{
              background: tool.featured ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
              border: tool.featured ? '1.5px solid #82A735' : '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 12px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {logoSrc && attempt < 3 ? (
                <img 
                  src={logoSrc}
                  alt={tool.name}
                  onError={() => setFailedImgs(prev => ({ ...prev, [tool.id]: attempt + 1 }))}
                  style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'contain' }}
                  loading="lazy"
                />
              ) : (
                <div style={{
                  width: '22px', height: '22px', borderRadius: '4px', background: '#82A735', color: '#FFFFFF',
                  fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getFallbackInitials(tool.name)}
                </div>
              )}
              <div style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tool.name}
              </div>
              {tool.pricing && tool.pricing.toLowerCase().includes('free') && (
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', background: '#82A735', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', fontWeight: '800', flexShrink: 0 }}>
                  Free
                </span>
              )}
            </div>

            <p style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              lineHeight: '1.3',
              margin: '0 0 6px 0',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {tool.description}
            </p>

            <a
              href={tool.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-pill-green"
              style={{ width: '100%', padding: '4px 8px', fontSize: '0.72rem', justifyContent: 'center', minHeight: '26px' }}
            >
              <span>Visit Site</span>
              <ArrowUpRight size={11} />
            </a>
          </div>
        );
      })}
      </div>

      {/* Promoted Vendor Submission CTA */}
      <div 
        onClick={() => {
          if (onOpenVendorModal) onOpenVendorModal();
          else window.location.hash = 'pricing';
        }}
        style={{
          background: 'linear-gradient(135deg, #141E14 0%, #203320 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '14px 12px',
          cursor: 'pointer',
          marginTop: '6px',
          border: '1px solid #304D30',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(20,30,20,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', marginBottom: '4px', color: '#82A735' }}>
          <PlusCircle size={14} /> Promote Your Software
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 10px 0', lineHeight: '1.3' }}>
          Get 100K+ tech founders & buyers to discover your SaaS tool.
        </p>
        <div className="btn-pill-green" style={{ width: '100%', fontSize: '0.75rem', justifyContent: 'center', padding: '6px' }}>
          <span>Feature My Tool — $49/mo</span>
        </div>
      </div>
    </div>
  );
}

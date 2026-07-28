import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { extractDomain, getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';

export default function FeaturedSidebar({ onSelectTool }) {
  const [failedImgs, setFailedImgs] = useState({});

  // Select 4 spotlight cards to fit cleanly in left column
  const featuredList = saasTools.filter(t => t.featured || t.badge || t.isFreeTier || t.isOpenSource).slice(0, 4);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
        <Sparkles size={14} /> Featured Spotlights
      </div>

      {featuredList.map(tool => {
        const attempt = failedImgs[tool.id] || 0;
        const logoSrc = getLogoUrl(tool, attempt);

        return (
          <div
            key={tool.id}
            onClick={() => onSelectTool && onSelectTool(tool.id)}
            style={{
              background: tool.featured ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
              border: tool.featured ? '2px solid #82A735' : '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 12px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
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
              fontSize: '0.75rem',
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
  );
}

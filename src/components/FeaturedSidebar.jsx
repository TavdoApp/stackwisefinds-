import React from 'react';
import { Sparkles, ArrowUpRight, Award } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';

export default function FeaturedSidebar({ onSelectTool }) {
  // Select top featured & high-rating tools for left column spotlight feed (8 tools)
  const featuredList = saasTools.filter(t => t.featured || t.badge || t.isFreeTier || t.isOpenSource).slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <Sparkles size={14} /> Featured Spotlights
      </div>

      {featuredList.map(tool => (
        <div
          key={tool.id}
          onClick={() => onSelectTool && onSelectTool(tool.id)}
          style={{
            background: tool.featured ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
            border: tool.featured ? '2px solid #82A735' : '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <img 
              src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`}
              alt={tool.name}
              style={{ width: '26px', height: '26px', borderRadius: '6px', objectFit: 'contain' }}
            />
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tool.name}
            </div>
            {tool.pricing && tool.pricing.toLowerCase().includes('free') && (
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', fontWeight: '800', flexShrink: 0 }}>
                Free
              </span>
            )}
          </div>

          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: '1.35',
            margin: '0 0 8px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
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
            style={{ width: '100%', padding: '5px 10px', fontSize: '0.75rem', justifyContent: 'center', minHeight: '32px' }}
          >
            <span>Visit Site</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { Sparkles, ArrowUpRight, Award } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';

export default function FeaturedSidebar({ onSelectTool }) {
  const featuredList = saasTools.filter(t => t.featured || t.badge).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <Sparkles size={14} /> Featured Spotlights
      </div>

      {featuredList.map(tool => (
        <div
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)',
            border: '2px solid #82A735',
            borderRadius: '20px',
            padding: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(130,167,53,0.08)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <img 
              src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`}
              alt={tool.name}
              style={{ width: '28px', height: '28px', borderRadius: '8px' }}
            />
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
              {tool.name}
            </div>
            {tool.pricing && tool.pricing.toLowerCase().includes('free') && (
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                Free
              </span>
            )}
          </div>

          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: '1.35',
            margin: '0 0 10px 0',
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
            style={{ width: '100%', padding: '6px 12px', fontSize: '0.78rem', justifyContent: 'center' }}
          >
            <span>Visit Official Site</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      ))}
    </div>
  );
}

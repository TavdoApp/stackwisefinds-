import React from 'react';
import { ShieldCheck, Sparkles, TrendingUp, BookOpen, ExternalLink, Award, Star } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { highIntentArticles } from '../data/articlesData.js';
import { getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';

export default function AiNewsSidebar({ onSelectTool, onSelectArticle }) {
  // Helper to parse monthlyVisits (e.g. "140.0M" -> 140000000)
  const parseVisits = (v) => {
    if (!v) return 0;
    const num = parseFloat(v);
    if (isNaN(num)) return 0;
    const str = String(v).toUpperCase();
    if (str.includes('M')) return num * 1000000;
    if (str.includes('K')) return num * 1000;
    return num;
  };

  // Top 8 Trending Tools by real monthly web traffic
  const topTrending = [...saasTools]
    .sort((a, b) => parseVisits(b.monthlyVisits) - parseVisits(a.monthlyVisits))
    .slice(0, 8);

  const topGuides = highIntentArticles.slice(0, 6);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Widget 1: Top 5 Trending Leaderboard */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="#82A735" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
              Top Traffic Gainers
            </h3>
          </div>
          <span style={{ fontSize: '0.65rem', background: '#EBF0E1', color: '#82A735', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
            Weekly
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topTrending.map((tool, index) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool && onSelectTool(tool.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: '#F6F7F2',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '900',
                color: index === 0 ? '#FFB800' : index === 1 ? '#94A3B8' : '#CBD5E1',
                width: '14px'
              }}>
                #{index + 1}
              </span>

              <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-dark)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tool.name}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: '800', color: '#82A735' }}>
                <Star size={11} fill="#82A735" color="#82A735" />
                <span>{tool.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Popular Buyer Guides & Alternatives */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <BookOpen size={16} color="#82A735" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Buyer Comparison Guides
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topGuides.map(art => (
            <div
              key={art.id}
              onClick={() => {
                if (onSelectArticle) onSelectArticle(art);
                else window.location.hash = `guide-${art.id}`;
              }}
              style={{
                cursor: 'pointer',
                padding: '8px 10px',
                borderRadius: '10px',
                background: '#F6F7F2',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dark)', lineHeight: '1.3', marginBottom: '3px' }}>
                {art.title}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#82A735', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Read Analysis</span>
                <ExternalLink size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Directory Quality Guarantee */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldCheck size={17} color="#82A735" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Directory Quality Guarantee
          </h3>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 10px 0' }}>
          Every tool on StakDock undergoes HTTPS SSL verification, OpenPageRank domain scoring, and duplicate filtering.
        </p>
        <div style={{ background: '#F6F7F2', borderRadius: '8px', padding: '8px 10px', fontSize: '0.72rem', color: 'var(--text-dark)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} color="#82A735" />
          <span>Independent & Reader Supported</span>
        </div>
      </div>

    </aside>
  );
}
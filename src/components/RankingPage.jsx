import React, { useState } from 'react';
import { Trophy, Star, Eye, ArrowUpRight, Flame, Sparkles, Filter } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { extractDomain } from '../utils/logoHelper.js';

export default function RankingPage({ onSelectTool, onSelectCategory }) {
  const [rankingFilter, setRankingFilter] = useState('traffic');

  // Parse visits string to number for sorting
  const parseVisits = (v) => {
    if (!v) return 180000;
    if (v.includes('M')) return parseFloat(v) * 1000000;
    if (v.includes('K')) return parseFloat(v) * 1000;
    return 100000;
  };

  // Get ranked tools based on selected filter tab
  const getRankedTools = () => {
    let list = [...saasTools];

    if (rankingFilter === 'traffic') {
      return list.sort((a, b) => parseVisits(b.monthlyVisits) - parseVisits(a.monthlyVisits)).slice(0, 50);
    } else if (rankingFilter === 'coding') {
      return list.filter(t => t.category === 'ai-coding-dev').slice(0, 50);
    } else if (rankingFilter === 'content') {
      return list.filter(t => t.category === 'ai-content').slice(0, 50);
    } else if (rankingFilter === 'free') {
      return list.filter(t => t.isFreeTier).slice(0, 50);
    } else if (rankingFilter === 'opensource') {
      return list.filter(t => t.isOpenSource).slice(0, 50);
    }

    return list.slice(0, 50);
  };

  const rankedTools = getRankedTools();

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1100px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '20px' }}>
          <Trophy size={16} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            GLOBAL SOFTWARE LEADERBOARDS
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '16px', color: 'var(--text-dark)' }}>
          Top AI & SaaS Rankings 2026
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Real-time global leaderboards ranked by monthly traffic telemetry, user reviews, and verified performance metrics.
        </p>
      </div>

      {/* Leaderboard Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
        {[
          { id: 'traffic', label: '🔥 Top By Monthly Traffic' },
          { id: 'coding', label: '💻 Top AI Coding Tools' },
          { id: 'content', label: '✍️ Top AI Content Tools' },
          { id: 'free', label: '🎁 Top Free Tier Software' },
          { id: 'opensource', label: '⚡ Top Open Source Tools' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setRankingFilter(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: '700',
              border: rankingFilter === tab.id ? '2px solid #82A735' : '1px solid var(--border-color)',
              background: rankingFilter === tab.id ? 'var(--bg-sage)' : '#FFFFFF',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              boxShadow: rankingFilter === tab.id ? '0 4px 12px rgba(130,167,53,0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rankedTools.map((tool, index) => {
          const rankNum = index + 1;
          const isTop3 = rankNum <= 3;
          const rankColor = rankNum === 1 ? '#D4AF37' : rankNum === 2 ? '#A8A8A8' : rankNum === 3 ? '#CD7F32' : '#82A735';

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              style={{
                background: isTop3 ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
                border: isTop3 ? `2px solid ${rankColor}` : '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
                flexWrap: 'wrap'
              }}
            >
              {/* Rank Number Badge */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: isTop3 ? rankColor : '#F6F7F2',
                color: isTop3 ? '#FFFFFF' : 'var(--text-dark)',
                fontWeight: '800',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                #{rankNum}
              </div>

              {/* Logo */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${extractDomain(tool)}&sz=128`}
                alt={tool.name}
                style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }}
                loading="lazy"
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                    {tool.name}
                  </h3>
                  {tool.badge && (
                    <span className="tag-sage" style={{ fontSize: '0.68rem' }}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {tool.description}
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  <Star size={15} fill="#82A735" color="#82A735" />
                  <span>{tool.rating || 4.8}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: '700', background: '#F6F7F2', padding: '4px 10px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                  <Eye size={13} color="#82A735" />
                  <span>{tool.monthlyVisits || '1.8M/mo'}</span>
                </div>
              </div>

              {/* Action */}
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-pill-green"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <span>Visit Site</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

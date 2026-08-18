import React, { useState } from 'react';
import { Trophy, Star, Eye, ArrowUpRight, Flame, Sparkles, Rocket, Share2, PlusCircle } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { extractDomain } from '../utils/logoHelper.js';
import { getLeaderboardRankings, getToolVotes } from '../utils/upvoteHelper.js';
import UpvoteButton from './UpvoteButton.jsx';
import ShareLaunchModal from './ShareLaunchModal.jsx';

export default function RankingPage({ onSelectTool, onSelectCategory, onOpenSubmitModal }) {
  const [rankingFilter, setRankingFilter] = useState('voted');
  const [shareModalTool, setShareModalTool] = useState(null);
  const [, setVoteRefreshKey] = useState(0);

  // Get ranked tools dynamically using upvoteHelper
  const rankedTools = getLeaderboardRankings(saasTools, rankingFilter);

  const handleVoteChange = () => {
    // Re-render ranking list smoothly when a vote is cast
    setVoteRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1120px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '20px' }}>
          <Trophy size={16} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            GLOBAL SOFTWARE LEADERBOARDS 2026
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '16px', color: 'var(--text-dark)' }}>
          Top AI & SaaS Community Leaderboards
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Discover the most upvoted software products, trending AI launches, and highest-trafficked tools ranked by verified community votes and telemetry.
        </p>
      </div>

      {/* Founder Launch Callout Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #182618 0%, #2A402A 100%)',
        borderRadius: '20px',
        padding: '24px 28px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        color: '#FFFFFF'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(130,167,53,0.25)', border: '1px solid #82A735', borderRadius: '9999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: '800', color: '#D2F091', marginBottom: '8px' }}>
            <Rocket size={13} /> LAUNCH YOUR SOFTWARE
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 6px 0' }}>
            Building an AI tool or SaaS? Compete on today's leaderboard.
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#C8D6C8', lineHeight: '1.4' }}>
            List your tool in under 60 seconds. Get indexed on Google, collect community upvotes, and win the <strong>#1 Product of the Day</strong> badge.
          </p>
        </div>

        <button
          onClick={() => onOpenSubmitModal ? onOpenSubmitModal() : window.location.href = '/#submit'}
          className="btn-pill-green"
          style={{
            padding: '12px 24px',
            fontSize: '0.92rem',
            background: '#82A735',
            color: '#FFFFFF',
            fontWeight: '800',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(130,167,53,0.4)',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={17} />
          <span>Launch Your Tool</span>
        </button>
      </div>

      {/* Leaderboard Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
        {[
          { id: 'voted', label: '🔥 Top Voted (Community Choice)' },
          { id: 'trending', label: '🚀 Trending Today (Launches)' },
          { id: 'traffic', label: '👑 Top By Traffic' },
          { id: 'coding', label: '💻 AI Coding & Dev' },
          { id: 'content', label: '✍️ AI Content & Video' },
          { id: 'free', label: '🎁 Top Free Software' },
          { id: 'opensource', label: '⚡ Open Source' }
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
          const topLabel = rankNum === 1 ? '🥇 #1 Product of the Day' : rankNum === 2 ? '🥈 #2 Top Launch' : rankNum === 3 ? '🥉 #3 Trending' : null;

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              style={{
                background: isTop3 ? 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)' : '#FFFFFF',
                border: isTop3 ? `2px solid ${rankColor}` : '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                cursor: 'pointer',
                boxShadow: isTop3 ? '0 6px 18px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
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
                fontSize: '1.15rem',
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
                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }}
                loading="lazy"
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                    {tool.name}
                  </h3>
                  {topLabel && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      background: rankNum === 1 ? '#FEF3C7' : '#F3F4F6',
                      color: rankNum === 1 ? '#92400E' : '#374151',
                      border: `1px solid ${rankNum === 1 ? '#FDE68A' : '#E5E7EB'}`,
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}>
                      {topLabel}
                    </span>
                  )}
                  {tool.badge && !topLabel && (
                    <span className="tag-sage" style={{ fontSize: '0.68rem' }}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {tool.description}
                </p>
              </div>

              {/* Community Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                {tool.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                    <Star size={14} fill="#82A735" color="#82A735" />
                    <span>{tool.rating}</span>
                  </div>
                )}

                {tool.monthlyVisits && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: '700', background: '#F6F7F2', padding: '4px 10px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                    <Eye size={12} color="#82A735" />
                    <span>{tool.monthlyVisits}</span>
                  </div>
                )}
              </div>

              {/* Interactive Upvote Button */}
              <UpvoteButton
                tool={tool}
                size="md"
                onVoteChange={handleVoteChange}
              />

              {/* Share Launch Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShareModalTool(tool);
                }}
                style={{
                  background: '#F6F7F2',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
                title="Rally upvotes on Twitter/LinkedIn"
              >
                <Share2 size={13} color="#82A735" />
                <span>Share</span>
              </button>

              {/* Direct Website Link */}
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-pill-green"
                style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <span>Visit</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Share Launch Modal */}
      <ShareLaunchModal
        isOpen={Boolean(shareModalTool)}
        onClose={() => setShareModalTool(null)}
        tool={shareModalTool}
      />
    </div>
  );
}

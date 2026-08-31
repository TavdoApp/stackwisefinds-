import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Wand2, Search, Flame, Rocket, Star, Tag, Gift, Award, ArrowUpRight } from 'lucide-react';
import { getTranslation } from '../utils/translations';

const rotatingSponsors = [
  {
    name: 'Cursor',
    tagline: 'The AI-first code editor built for modern developers',
    domain: 'cursor.com',
    url: '/software/cursor-ai/'
  },
  {
    name: 'Make.com',
    tagline: 'Design, build, and automate workflows visually',
    domain: 'make.com',
    url: '/software/make-integromat/'
  },
  {
    name: 'Notion AI',
    tagline: 'Connected workspace with integrated AI writing and docs',
    domain: 'notion.so',
    url: '/software/notion/'
  },
  {
    name: 'Jasper AI',
    tagline: 'Enterprise generative AI marketing and copywriting engine',
    domain: 'jasper.ai',
    url: '/software/jasper-ai/'
  },
  {
    name: 'Perplexity AI',
    tagline: 'Real-time conversational AI search and answer engine',
    domain: 'perplexity.ai',
    url: '/software/perplexity-ai/'
  }
];

export default function Hero({ 
  onExploreClick, 
  onReadGuidesClick, 
  onOpenWizardClick, 
  onOpenSubmitClick,
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  totalToolsCount = 1786,
  currentLang = 'en',
  activeQuickFilter = 'all',
  onSelectQuickFilter
}) {
  const t = getTranslation(currentLang);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSponsorIndex(prev => (prev + 1) % rotatingSponsors.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentSponsor = rotatingSponsors[sponsorIndex];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit();
      if (onExploreClick) onExploreClick();
    }
  };

  const quickFilterTabs = [
    { id: 'all', label: '🔥 Today\'s Top', icon: <Flame size={14} /> },
    { id: 'new', label: '🚀 Just Launched', icon: <Rocket size={14} /> },
    { id: 'upvoted', label: '⭐ Most Upvoted', icon: <Star size={14} /> },
    { id: 'deals', label: '💎 Verified Deals', icon: <Gift size={14} /> },
    { id: 'free', label: '⚡ Free Forever', icon: <Tag size={14} /> }
  ];

  return (
    <section className="hero-section" style={{ padding: '40px 0 24px' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
        
        {/* Rotating "Sponsored by [Tool]" Toolify-Style Hero Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          border: '1.5px solid #82A735',
          borderRadius: '9999px',
          padding: '5px 12px 5px 8px',
          marginBottom: '20px',
          boxShadow: '0 4px 14px rgba(130, 167, 53, 0.12)',
          transition: 'all 0.3s ease',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: '800',
            background: '#82A735',
            color: '#FFFFFF',
            padding: '2px 8px',
            borderRadius: '9999px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            flexShrink: 0
          }}>
            SPONSORED
          </span>
          <a 
            href={currentSponsor.url} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              color: 'var(--text-dark)',
              fontSize: '0.84rem',
              fontWeight: '700',
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            <img 
              src={`https://www.google.com/s2/favicons?domain=${currentSponsor.domain}&sz=64`} 
              alt={currentSponsor.name} 
              style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0 }} 
            />
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'min(500px, calc(100vw - 160px))'
            }}>
              <strong>{currentSponsor.name}</strong> — {currentSponsor.tagline}
            </span>
            <span style={{ color: '#82A735', fontWeight: '800', flexShrink: 0 }}>&rarr;</span>
          </a>
        </div>

        {/* Main Headline */}
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '16px', letterSpacing: '-0.03em', color: 'var(--text-dark)' }}>
          Discover The Best <span style={{ color: '#82A735' }}>SaaS &amp; AI Tools</span>
        </h1>

        {/* Toolify-Style Live Telemetry Subtitle */}
        <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '680px', margin: '0 auto 28px' }}>
          <strong style={{ color: '#82A735' }}>{totalToolsCount}+ quality-checked tools</strong> across <strong style={{ color: 'var(--text-dark)' }}>40+ categories</strong>. Discover, compare, and verify software before you commit.
        </p>

        {/* Toolify Prominent Hero Search Bar */}
        <div 
          className="hero-search-container"
          style={{
            maxWidth: '640px',
            margin: '0 auto 24px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: '9999px',
            padding: '6px 6px 6px 18px',
            boxShadow: '0 10px 30px rgba(20, 30, 20, 0.08)',
            border: '2px solid #82A735'
          }}
        >
          <Search size={20} color="#82A735" style={{ marginRight: '10px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Search by tool name, e.g. Video AI, CRM, Automation..."}
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search software and AI tools"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.96rem',
              fontWeight: '600',
              color: 'var(--text-dark)',
              background: 'transparent',
              minWidth: 0
            }}
          />
          <button
            onClick={() => {
              if (onSearchSubmit) onSearchSubmit();
              if (onExploreClick) onExploreClick();
            }}
            className="btn-pill-green"
            style={{
              padding: '10px 20px',
              fontSize: '0.88rem',
              borderRadius: '9999px',
              flexShrink: 0
            }}
            aria-label="Submit Search"
          >
            <span>Search</span>
          </button>
        </div>

        {/* Toolify Quick Sub-Navigation Filter Tabs (Today, New, Upvoted, Deals, Free) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          {quickFilterTabs.map(tab => {
            const isActive = activeQuickFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (onSelectQuickFilter) onSelectQuickFilter(tab.id);
                  if (onExploreClick) onExploreClick();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #82A735' : '1px solid var(--border-color)',
                  background: isActive ? '#EBF0E1' : '#FFFFFF',
                  color: isActive ? '#141E14' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 2px 8px rgba(130, 167, 53, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: isActive ? '#82A735' : 'inherit' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button 
            onClick={() => {
              if (onOpenWizardClick) onOpenWizardClick();
            }} 
            className="btn-pill-green" 
            style={{ padding: '12px 24px', fontSize: '0.94rem', boxShadow: '0 4px 16px rgba(130, 167, 53, 0.28)' }}
          >
            <Wand2 size={17} />
            <span>Build My Software Stack</span>
          </button>

          <button onClick={onExploreClick} className="btn-pill-outline" style={{ padding: '12px 22px', fontSize: '0.9rem' }}>
            <ArrowDown size={16} />
            <span>{t.heroExploreTools}</span>
          </button>
        </div>

        {/* Stack Builder Value Proposition Banner */}
        <div 
          onClick={onOpenWizardClick}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8D8',
            borderRadius: '16px',
            padding: '16px 20px',
            maxWidth: '680px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'left'
          }}
        >
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#82A735' }}>⚡</span> Build Your Software Stack
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
              Tell us what you're building. StakDock compares true cost, capability overlap, and open-source alternatives.
            </div>
          </div>
          <button
            type="button"
            className="btn-pill-green"
            style={{ padding: '8px 16px', fontSize: '0.82rem', flexShrink: 0 }}
          >
            <span>Launch Builder</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Founder Claim Callout Banner */}
        {onOpenSubmitClick && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(130, 167, 53, 0.1)', border: '1px solid rgba(130, 167, 53, 0.3)', borderRadius: '9999px', padding: '6px 16px', cursor: 'pointer' }} onClick={onOpenSubmitClick}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-green-dark)' }}>
              ⚡ Building software or an AI app? Submit your tool for Free directory listing &rarr;
            </span>
          </div>
        )}

      </div>
    </section>
  );
}

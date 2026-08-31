import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Wand2, Search, Flame, Rocket, Star, Tag, Gift, Award, ArrowUpRight } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { STACK_PRESETS } from '../utils/stackIntelligenceEngine.js';

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
  onSelectPreset,
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
      <div className="container" style={{ textAlign: 'center', maxWidth: '1080px', margin: '0 auto' }}>
        
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
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            SPONSORED
          </span>
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)' }}>
            {currentSponsor.name}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            — {currentSponsor.tagline}
          </span>
          <a
            href={currentSponsor.url}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#82A735',
              textDecoration: 'none',
              marginLeft: '4px'
            }}
          >
            Visit <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
          fontWeight: '900',
          lineHeight: '1.15',
          color: 'var(--text-dark)',
          marginBottom: '14px',
          letterSpacing: '-0.03em'
        }}>
          Discover &amp; Assemble Your <span style={{ color: '#82A735' }}>Software Stack</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.18rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 28px',
          lineHeight: '1.55'
        }}>
          Compare 1,700+ SaaS platforms and open-source tools. Calculate true cost per seat, eliminate feature overlap, and launch with confidence.
        </p>

        {/* Hero Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '620px',
          margin: '0 auto 20px',
          background: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid var(--border-color)',
          padding: '6px 6px 6px 18px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '10px' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 1,780+ tools, categories, or alternatives (e.g. CRM, Linear, Ghost)..."
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.92rem',
              background: 'transparent',
              color: 'var(--text-dark)'
            }}
            aria-label="Search software tools"
          />
          <button
            onClick={() => {
              if (onSearchSubmit) onSearchSubmit();
              if (onExploreClick) onExploreClick();
            }}
            className="btn-pill-green"
            style={{ padding: '9px 20px', fontSize: '0.86rem', flexShrink: 0 }}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button 
            onClick={() => {
              if (onOpenWizardClick) onOpenWizardClick();
            }} 
            className="btn-pill-green" 
            style={{ padding: '12px 24px', fontSize: '0.94rem', boxShadow: '0 4px 16px rgba(130, 167, 53, 0.28)' }}
          >
            <Wand2 size={17} />
            <span>Build My Custom Stack</span>
          </button>

          <button onClick={onExploreClick} className="btn-pill-outline" style={{ padding: '12px 22px', fontSize: '0.9rem' }}>
            <ArrowDown size={16} />
            <span>{t.heroExploreTools}</span>
          </button>
        </div>

        {/* POPULAR SOFTWARE STACKS SECTION (Phase 7A Growth Loop) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8D8',
          borderRadius: '20px',
          padding: '28px 24px',
          margin: '0 auto 28px',
          boxShadow: 'var(--shadow-soft)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--primary-green-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                ⚡ INSTANT BLUEPRINTS
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                Popular Software Stacks
              </h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              1-click tailored stacks verified with 2026 pricing &amp; integration guarantees.
            </div>
          </div>

          {/* 6 Preset Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {STACK_PRESETS.map((preset) => (
              <div
                key={preset.id}
                style={{
                  background: '#FBFDF9',
                  border: '1px solid #E5EADF',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary-green-dark)', background: '#EBF2DE', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {preset.targetAudience}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                      {preset.startingCost}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {preset.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                    {preset.tagline}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {preset.presetState.requiredCapabilities.map(cap => (
                      <span key={cap} style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#F1F4EB', color: '#3B4D1C' }}>
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EAEFE4', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-light)' }}>
                    {preset.statusType}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPreset) {
                        onSelectPreset(preset.id);
                      } else if (onOpenWizardClick) {
                        onOpenWizardClick();
                      }
                    }}
                    className="btn-pill-green"
                    style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: '800' }}
                    aria-label={`Build ${preset.title}`}
                  >
                    Build Stack <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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

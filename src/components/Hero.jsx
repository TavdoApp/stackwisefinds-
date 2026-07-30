import React from 'react';
import { ArrowDown, Sparkles, Wand2, Search } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function Hero({ 
  onExploreClick, 
  onReadGuidesClick, 
  onOpenWizardClick, 
  onOpenSubmitClick,
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  totalToolsCount = 101,
  currentLang = 'en' 
}) {
  const t = getTranslation(currentLang);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit();
      if (onExploreClick) onExploreClick();
    }
  };

  return (
    <section className="hero-section" style={{ padding: '40px 0 24px' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Editorial Subtitle Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '20px' }}>
          <Sparkles size={15} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.heroBadge}
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '16px', letterSpacing: '-0.03em', color: 'var(--text-dark)' }}>
          Discover The Best <span style={{ color: '#82A735' }}>SaaS & AI Tools</span>
        </h1>

        {/* Toolify-Style Live Telemetry Subtitle */}
        <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '680px', margin: '0 auto 28px' }}>
          <strong style={{ color: '#82A735' }}>{totalToolsCount} quality-checked tools</strong> across <strong style={{ color: 'var(--text-dark)' }}>25 categories</strong>. Discover, compare, and verify software before you commit.
        </p>

        {/* Toolify Prominent Hero Search Bar */}
        <div 
          className="hero-search-container"
          style={{
            maxWidth: '620px',
            margin: '0 auto 32px',
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
            placeholder={t.searchPlaceholder || "Search by tool name, e.g. Video AI, CRM..."}
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

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button onClick={onOpenWizardClick} className="btn-pill-green" style={{ padding: '12px 24px', fontSize: '0.92rem' }}>
            <Wand2 size={16} />
            <span>{t.heroRunWizard}</span>
          </button>

          <button onClick={onExploreClick} className="btn-pill-outline" style={{ padding: '12px 22px', fontSize: '0.9rem' }}>
            <ArrowDown size={16} />
            <span>{t.heroExploreTools}</span>
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

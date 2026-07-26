import React from 'react';
import { ArrowDown, Sparkles, Wand2 } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function Hero({ onExploreClick, onReadGuidesClick, onOpenWizardClick, currentLang = 'en' }) {
  const t = getTranslation(currentLang);

  return (
    <section className="hero-section">
      <div className="container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Editorial Subtitle Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '24px' }}>
          <Sparkles size={15} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.heroBadge}
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '20px', letterSpacing: '-0.03em', color: 'var(--text-dark)' }}>
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto 36px' }}>
          {t.heroSubtitle}
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={onOpenWizardClick} className="btn-pill-green" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <Wand2 size={18} />
            <span>{t.heroRunWizard}</span>
          </button>

          <button onClick={onExploreClick} className="btn-pill-outline" style={{ padding: '14px 24px', fontSize: '0.95rem' }}>
            <ArrowDown size={18} />
            <span>{t.heroExploreTools}</span>
          </button>
        </div>

      </div>
    </section>
  );
}

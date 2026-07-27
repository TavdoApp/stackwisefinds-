import React from 'react';
import { Sparkles, Scale, PlusCircle, Compass, BookOpen, Wand2, Globe, Star } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  compareCount, 
  onOpenCompareModal, 
  onOpenVendorModal, 
  onOpenWizardModal,
  bookmarkCount = 0,
  onOpenBookmarkDrawer,
  currentLang = 'en',
  onChangeLang
}) {
  const t = getTranslation(currentLang);

  const languages = [
    { code: 'en', label: 'English 🇺🇸' },
    { code: 'zh', label: '简体中文 🇨🇳' },
    { code: 'ar', label: 'العربية 🇦🇪' },
    { code: 'es', label: 'Español 🇪🇸' },
    { code: 'de', label: 'Deutsch 🇩🇪' },
    { code: 'fr', label: 'Français 🇫🇷' },
    { code: 'ja', label: '日本語 🇯🇵' },
    { code: 'ko', label: '한국어 🇰🇷' },
    { code: 'pt', label: 'Português 🇧🇷' },
    { code: 'vi', label: 'Tiếng Việt 🇻🇳' }
  ];

  return (
    <header className="navbar-sticky" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(246, 247, 242, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('directory')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
          role="button"
          tabIndex={0}
          aria-label="StakDock Home"
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'var(--bg-sage)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <Sparkles size={18} color="#82A735" />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#141E14', letterSpacing: '-0.02em' }}>
            stak<span style={{ color: '#82A735' }}>dock</span>
          </span>
        </div>

        {/* Center Nav Views */}
        <div className="nav-links-center" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F6F7F2', padding: '4px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setCurrentView('directory')}
            className={currentView === 'directory' ? 'btn-pill-dark' : 'btn-pill-outline'}
            style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
            aria-label="Software Directory"
            title="Software Directory"
          >
            <Compass size={14} />
            <span className="hide-mobile">{t.navDirectory}</span>
          </button>

          <button 
            onClick={() => setCurrentView('articles')}
            className={currentView === 'articles' ? 'btn-pill-dark' : 'btn-pill-outline'}
            style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
            aria-label="Buyer Guides"
            title="Buyer Guides"
          >
            <BookOpen size={14} />
            <span className="hide-mobile">{t.navGuides}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Multi-Language Dropdown (Toolify Feature) */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <Globe size={15} color="var(--text-dark)" style={{ position: 'absolute', left: '10px', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={currentLang || 'en'}
              onChange={(e) => onChangeLang && onChangeLang(e.target.value)}
              aria-label="Select Language"
              style={{
                padding: '6px 10px 6px 30px',
                borderRadius: '9999px',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* AI Stack Wizard Quiz Button */}
          <button 
            onClick={onOpenWizardModal}
            className="btn-pill-green"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            aria-label="Find My Software Stack"
            title="Find My Software Stack"
          >
            <Wand2 size={14} />
            <span className="hide-mobile">{t.navFindStack}</span>
          </button>

          {/* Bookmark Stack Drawer trigger */}
          {bookmarkCount > 0 && (
            <button 
              onClick={onOpenBookmarkDrawer}
              className="btn-pill-outline"
              style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: '#82A735', background: 'var(--bg-sage)' }}
              aria-label={`View ${bookmarkCount} saved tools`}
              title="View my saved software stack"
            >
              <Star size={14} fill="#82A735" color="#82A735" />
              <span>({bookmarkCount})</span>
            </button>
          )}

          {/* Compare Drawer trigger */}
          {compareCount > 0 && (
            <button 
              onClick={onOpenCompareModal}
              className="btn-pill-outline"
              style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: '#82A735', background: 'var(--bg-sage)' }}
              aria-label={`Compare ${compareCount} tools`}
              title="Compare selected tools"
            >
              <Scale size={14} color="#82A735" />
              <span>({compareCount})</span>
            </button>
          )}

          {/* Submit SaaS Product */}
          <button 
            onClick={onOpenVendorModal}
            className="btn-pill-dark"
            style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            aria-label="Submit SaaS Tool"
            title="Submit SaaS Tool"
          >
            <PlusCircle size={14} />
            <span className="hide-mobile">{t.navSubmit}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

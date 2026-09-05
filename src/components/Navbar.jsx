import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Scale, PlusCircle, Compass, BookOpen, Wand2, Globe, Star, Menu, X, ChevronRight, User } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  compareCount, 
  onOpenCompareModal, 
  onOpenVendorModal, 
  onOpenWizardModal,
  onOpenProfileModal,
  bookmarkCount = 0,
  onOpenBookmarkDrawer,
  currentLang = 'en',
  onChangeLang
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getTranslation(currentLang);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen]);

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

  const handleMobileNav = (action) => {
    setIsMobileMenuOpen(false);
    if (typeof action === 'function') action();
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(246, 247, 242, 0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E6D8',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          maxWidth: '1200px',
          margin: '0 auto',
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
              width: '34px', height: '34px', borderRadius: '10px',
              background: '#EBF0E1', display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: '1px solid #E2E6D8', padding: '5px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 512 512" fill="none">
                <path d="M256 95L75 178L256 262L437 178L256 95Z" fill="#82A735"/>
                <path d="M75 255L256 340L437 255" stroke="#82A735" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M75 335L256 420L437 335" stroke="#82A735" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#141E14', letterSpacing: '-0.02em' }}>
              stak<span style={{ color: '#82A735' }}>dock</span>
            </span>
          </div>

          {/* Desktop Center Nav Views */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F6F7F2', padding: '4px', borderRadius: '9999px', border: '1px solid #E2E6D8' }}>
            <button 
              onClick={() => { setCurrentView('directory'); window.history.pushState(null, '', '/'); window.scrollTo(0, 0); }}
              className={currentView === 'directory' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
              aria-label="Software Directory"
            >
              <Compass size={14} />
              <span>{t.navDirectory || 'Directory'}</span>
            </button>
            <button 
              onClick={() => { setCurrentView('stack-builder'); window.history.pushState(null, '', '/stack-builder/'); window.scrollTo(0, 0); }}
              className={currentView === 'stack-builder' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              aria-label="Stack Builder"
            >
              <Wand2 size={14} color="#82A735" />
              <span>Stack Builder</span>
              <span style={{ fontSize: '0.62rem', background: '#82A735', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>NEW</span>
            </button>
            <button 
              onClick={() => { setCurrentView('category-grid'); window.history.pushState(null, '', '/categories'); window.scrollTo(0, 0); }}
              className={currentView === 'category-grid' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
              aria-label="Categories"
            >
              <span>Categories</span>
            </button>
            <button 
              onClick={() => { setCurrentView('ranking'); window.history.pushState(null, '', '/ranking'); window.scrollTo(0, 0); }}
              className={currentView === 'ranking' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
              aria-label="Rankings"
            >
              <span>Rankings</span>
            </button>
            <button 
              onClick={() => { setCurrentView('advertise'); window.history.pushState(null, '', '/pricing'); window.scrollTo(0, 0); }}
              className={currentView === 'advertise' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
              aria-label="Advertise"
            >
              <span>Advertise</span>
            </button>
            <button 
              onClick={() => { setCurrentView('articles'); window.history.pushState(null, '', '/guides'); window.scrollTo(0, 0); }}
              className={currentView === 'articles' ? 'btn-pill-dark' : 'btn-pill-outline'}
              style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
              aria-label="Buyer Guides"
            >
              <BookOpen size={14} />
              <span>{t.navGuides || 'Guides'}</span>
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <Globe size={15} color="#536253" style={{ position: 'absolute', left: '10px', pointerEvents: 'none', zIndex: 1 }} />
              <select
                value={currentLang || 'en'}
                onChange={(e) => onChangeLang && onChangeLang(e.target.value)}
                aria-label="Select Language"
                style={{
                  padding: '6px 10px 6px 30px', borderRadius: '9999px',
                  border: '1px solid #E2E6D8', background: '#FFFFFF',
                  fontSize: '0.8rem', fontWeight: '700', outline: 'none', cursor: 'pointer',
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={onOpenWizardModal}
              className="btn-pill-green"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              aria-label="Find My Software Stack"
            >
              <Wand2 size={14} />
              <span>{t.navFindStack || 'Find Stack'}</span>
            </button>

            {bookmarkCount > 0 && (
              <button 
                onClick={onOpenBookmarkDrawer}
                className="btn-pill-outline"
                style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: '#82A735', background: '#EBF0E1' }}
                aria-label={`View ${bookmarkCount} saved tools`}
              >
                <Star size={14} fill="#82A735" color="#82A735" />
                <span>({bookmarkCount})</span>
              </button>
            )}

            {compareCount > 0 && (
              <button 
                onClick={onOpenCompareModal}
                className="btn-pill-outline"
                style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: '#82A735', background: '#EBF0E1' }}
                aria-label={`Compare ${compareCount} tools`}
              >
                <Scale size={14} color="#82A735" />
                <span>({compareCount})</span>
              </button>
            )}

            <button 
              onClick={onOpenProfileModal}
              className="btn-pill-outline"
              style={{ padding: '8px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              aria-label="My Stacks & Maker Hub"
            >
              <User size={14} color="#82A735" />
              <span>Profile</span>
            </button>

            <button 
              onClick={onOpenVendorModal}
              className="btn-pill-dark"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
              aria-label="Submit SaaS Tool"
            >
              <PlusCircle size={14} />
              <span>{t.navSubmit || 'Submit'}</span>
            </button>
          </div>

          {/* Mobile Right: Saved Counter + Hamburger */}
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {bookmarkCount > 0 && (
              <button
                onClick={onOpenBookmarkDrawer}
                style={{
                  background: '#EBF0E1', border: '1px solid #82A735',
                  borderRadius: '10px', padding: '7px 10px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontWeight: '700', fontSize: '0.78rem', color: '#141E14', cursor: 'pointer',
                }}
                aria-label={`${bookmarkCount} saved tools`}
              >
                <Star size={14} fill="#82A735" color="#82A735" />
                <span>{bookmarkCount}</span>
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: '#FFFFFF', border: '1px solid #E2E6D8',
                padding: '8px 12px', borderRadius: '12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#141E14',
              }}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} color="#82A735" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Portal Mobile Drawer */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Overlay Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(20, 30, 20, 0.5)',
              zIndex: 99998,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
          {/* Drawer Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '340px',
              background: '#FFFFFF',
              zIndex: 99999,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid #E2E6D8',
              background: '#F6F7F2',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: '#EBF0E1', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', border: '1px solid #E2E6D8'
                }}>
                  <Sparkles size={16} color="#82A735" />
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#141E14', letterSpacing: '-0.02em' }}>
                  stak<span style={{ color: '#82A735' }}>dock</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px', display: 'flex', alignItems: 'center',
                  borderRadius: '8px', color: '#536253'
                }}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div style={{ padding: '16px', flex: 1 }}>
              {/* Main Nav Links */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', color: '#7E8E7E', textTransform: 'uppercase', padding: '4px 4px 10px' }}>
                  Navigate
                </div>
                {[
                  { label: 'Stack Builder', icon: <Wand2 size={18} color="#82A735" />, view: 'stack-builder', path: '/stack-builder/', badge: 'NEW' },
                  { label: t.navDirectory || 'Software Directory', icon: <Compass size={18} color="#82A735" />, view: 'directory', path: '/' },
                  { label: 'Browse Categories', icon: <Compass size={18} color="#82A735" />, view: 'category-grid', path: '/categories' },
                  { label: 'Leaderboard & Rankings', icon: <Sparkles size={18} color="#82A735" />, view: 'ranking', path: '/ranking' },
                  { label: 'Advertise & Sponsor', icon: <PlusCircle size={18} color="#82A735" />, view: 'advertise', path: '/pricing' },
                  { label: t.navGuides || 'Buyer Guides', icon: <BookOpen size={18} color="#82A735" />, view: 'articles', path: '/guides' },
                ].map(item => (
                  <button
                    key={item.view}
                    onClick={() => handleMobileNav(() => {
                      setCurrentView(item.view);
                      if (item.path) {
                        window.history.pushState(null, '', item.path);
                        window.scrollTo(0, 0);
                      }
                    })}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '12px 14px', borderRadius: '12px', marginBottom: '6px',
                      background: currentView === item.view ? '#EBF0E1' : '#F6F7F2',
                      border: currentView === item.view ? '1px solid #82A735' : '1px solid transparent',
                      fontWeight: '700', fontSize: '0.9rem', color: '#141E14', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={16} color="#82A735" />
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#E2E6D8', margin: '12px 0' }} />

              {/* Actions */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', color: '#7E8E7E', textTransform: 'uppercase', padding: '4px 4px 10px' }}>
                  Actions
                </div>

                <button
                  onClick={() => handleMobileNav(onOpenWizardModal)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '13px 16px', borderRadius: '12px', marginBottom: '8px',
                    background: '#82A735', color: '#FFFFFF', fontWeight: '700',
                    fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(130,167,53,0.3)',
                  }}
                  aria-label="Find My Stack"
                >
                  <Wand2 size={18} />
                  <span>{t.navFindStack || 'Find My Stack'}</span>
                </button>

                <button
                  onClick={() => handleMobileNav(onOpenProfileModal)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '13px 16px', borderRadius: '12px', marginBottom: '8px',
                    background: '#FAFBF7', color: '#141E14', fontWeight: '700',
                    fontSize: '0.95rem', border: '1.5px solid #82A735', cursor: 'pointer',
                  }}
                  aria-label="My Profile & Maker Hub"
                >
                  <User size={18} color="#82A735" />
                  <span>My Profile &amp; Maker Hub</span>
                </button>

                <button
                  onClick={() => handleMobileNav(onOpenVendorModal)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '13px 16px', borderRadius: '12px', marginBottom: '8px',
                    background: '#141E14', color: '#FFFFFF', fontWeight: '700',
                    fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                  }}
                  aria-label="Submit SaaS Tool"
                >
                  <PlusCircle size={18} />
                  <span>{t.navSubmit || 'Submit Tool'} — $99/yr</span>
                </button>

                {bookmarkCount > 0 && (
                  <button
                    onClick={() => handleMobileNav(onOpenBookmarkDrawer)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '13px 16px', borderRadius: '12px', marginBottom: '8px',
                      background: '#EBF0E1', color: '#141E14', fontWeight: '700',
                      fontSize: '0.95rem', border: '1px solid #82A735', cursor: 'pointer',
                    }}
                    aria-label={`My Saved Stack: ${bookmarkCount} tools`}
                  >
                    <Star size={18} fill="#82A735" color="#82A735" />
                    <span>My Saved Stack ({bookmarkCount})</span>
                  </button>
                )}

                {compareCount > 0 && (
                  <button
                    onClick={() => handleMobileNav(onOpenCompareModal)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '13px 16px', borderRadius: '12px', marginBottom: '8px',
                      background: '#EBF0E1', color: '#141E14', fontWeight: '700',
                      fontSize: '0.95rem', border: '1px solid #82A735', cursor: 'pointer',
                    }}
                    aria-label={`Compare ${compareCount} tools`}
                  >
                    <Scale size={18} color="#82A735" />
                    <span>Compare Tools ({compareCount})</span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#E2E6D8', margin: '12px 0' }} />

              {/* Language Selector */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', color: '#7E8E7E', textTransform: 'uppercase', padding: '4px 4px 10px' }}>
                  Language
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Globe size={18} color="#536253" style={{ position: 'absolute', left: '14px', pointerEvents: 'none', zIndex: 1 }} />
                  <select
                    value={currentLang || 'en'}
                    onChange={(e) => { onChangeLang && onChangeLang(e.target.value); setIsMobileMenuOpen(false); }}
                    style={{
                      width: '100%', padding: '12px 14px 12px 44px',
                      borderRadius: '12px', border: '1px solid #E2E6D8',
                      background: '#F6F7F2', fontSize: '0.95rem', fontWeight: '700',
                      outline: 'none', cursor: 'pointer', color: '#141E14',
                      appearance: 'none', WebkitAppearance: 'none',
                    }}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

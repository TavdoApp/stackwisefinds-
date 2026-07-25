import React from 'react';
import { Sparkles, Scale, PlusCircle, Compass, BookOpen, Wand2 } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, compareCount, onOpenCompareModal, onOpenVendorModal, onOpenWizardModal }) {
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
          aria-label="StackwiseFinds Home"
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
          <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#141E14', letterSpacing: '-0.02em' }}>
            stackwise
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
            <span className="hide-mobile">Directory</span>
          </button>

          <button 
            onClick={() => setCurrentView('articles')}
            className={currentView === 'articles' ? 'btn-pill-dark' : 'btn-pill-outline'}
            style={{ border: 'none', padding: '6px 12px', fontSize: '0.82rem' }}
            aria-label="Buyer Guides"
            title="Buyer Guides"
          >
            <BookOpen size={14} />
            <span className="hide-mobile">Guides</span>
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* AI Stack Wizard Quiz Button */}
          <button 
            onClick={onOpenWizardModal}
            className="btn-pill-green"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            aria-label="Find My Software Stack"
            title="Find My Software Stack"
          >
            <Wand2 size={14} />
            <span className="hide-mobile">Find Stack</span>
          </button>

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
            <span className="hide-mobile">Submit</span>
          </button>
        </div>

      </div>
    </header>
  );
}

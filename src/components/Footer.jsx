import React from 'react';
import { Sparkles, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { saasCategories } from '../data/saasData.jsx';

export default function Footer({ setCurrentView, setSelectedCategory, onChangeLang, currentLang = 'en' }) {
  return (
    <footer style={{
      background: '#141E14',
      color: '#FFFFFF',
      borderTop: '1px solid #203320',
      padding: '60px 16px 40px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* 5-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#203320', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '1px solid #2E472E'
              }}>
                <Sparkles size={16} color="#82A735" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                stak<span style={{ color: '#82A735' }}>dock</span>
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '20px' }}>
              The premier software launch dock & AI tools directory. 500+ verified tools updated daily with telemetry traffic stats.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#82A735' }}>
              <ShieldCheck size={14} />
              <span>Independent & Reader Supported</span>
            </div>
          </div>

          {/* Col 2: Directory Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Directory Views
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              <li>
                <span onClick={() => setCurrentView('directory')} style={{ cursor: 'pointer' }} className="hover:text-white">
                  All Software Feed
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('category-grid')} style={{ cursor: 'pointer' }} className="hover:text-white">
                  50+ Category Explorer
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('ranking')} style={{ cursor: 'pointer' }} className="hover:text-white">
                  Top Traffic Leaderboards
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('articles')} style={{ cursor: 'pointer' }} className="hover:text-white">
                  Reddit Buyer Guides
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              {saasCategories.slice(1, 6).map(cat => (
                <li key={cat.id}>
                  <span 
                    onClick={() => {
                      if (setSelectedCategory) setSelectedCategory(cat.id);
                      setCurrentView('directory');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {cat.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Monetization & Business */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Sponsors & Business
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              <li>
                <span onClick={() => setCurrentView('advertise')} style={{ cursor: 'pointer', color: '#82A735', fontWeight: '800' }}>
                  Sponsor StakDock ($99)
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('advertise')} style={{ cursor: 'pointer' }}>
                  Top Banner Ad ($99/mo)
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('advertise')} style={{ cursor: 'pointer' }}>
                  Left Spotlight Vendor ($99/yr)
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('advertise')} style={{ cursor: 'pointer' }}>
                  In-Feed Sponsored Badge ($49/mo)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Language */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Legal & Language
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              <li>
                <span onClick={() => setCurrentView('privacy')} style={{ cursor: 'pointer' }}>
                  Privacy Policy
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('terms')} style={{ cursor: 'pointer' }}>
                  Terms of Service
                </span>
              </li>
              <li>
                <span onClick={() => setCurrentView('disclosure')} style={{ cursor: 'pointer' }}>
                  Affiliate Disclosure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #203320',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div>
            © 2026 StakDock. All rights reserved. Registered trademark of StakDock Technologies.
          </div>

          <p style={{ width: '100%', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', margin: '12px 0 0 0', lineHeight: '1.5', borderTop: '1px solid #203320', paddingTop: '16px' }}>
            <strong>Affiliate Referral Disclosure:</strong> StakDock contains affiliate referral links. When you purchase software through links on our site, we may earn an affiliate commission at zero additional cost to you. Guidance is provided for general disclosure purposes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Built with precision for tech founders & creators worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

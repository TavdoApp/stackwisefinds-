import React from 'react';
import { Sparkles, ShieldCheck, Lock, FileText, RefreshCw } from 'lucide-react';

export default function Footer({ onOpenVendorModal, onSelectArticle, onOpenLegalView }) {
  const handleArticleClick = (articleId) => {
    if (onSelectArticle) {
      onSelectArticle(articleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLegalClick = (viewName) => {
    if (onOpenLegalView) {
      onOpenLegalView(viewName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ background: '#EEF2E6', borderTop: '1px solid var(--border-color)', padding: '60px 0 40px', marginTop: 'auto', position: 'relative', zIndex: 10 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Column 1: Brand & Paddle Merchant Notice */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={20} color="#82A735" />
              <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#141E14' }}>
                stackwise
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '280px', marginBottom: '12px' }}>
              Honest software guides and practical recommendations for freelancers, solopreneurs, and growing teams.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
              Payments & merchant processing secured by <strong>Paddle.com</strong> (Merchant of Record).
            </div>
          </div>

          {/* Column 2: Top Guides */}
          <div>
            <div className="tag-uppercase" style={{ marginBottom: '14px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              TOP GUIDES
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <button 
                  onClick={() => handleArticleClick('best-ai-video-generators-2026')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  Top AI Video Generators 2026
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleArticleClick('best-real-estate-crms-2026')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  Best Real Estate CRMs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleArticleClick('best-ai-coding-tools-2026')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  Top AI Coding Editors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleArticleClick('best-ecommerce-stack-2026')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  Ultimate E-Commerce Stack 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SaaS Founders */}
          <div>
            <div className="tag-uppercase" style={{ marginBottom: '14px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              SAAS FOUNDERS
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Get featured in front of thousands of active software buyers.
            </p>
            <button onClick={onOpenVendorModal} className="btn-pill-dark" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              Submit SaaS Product ($199/yr)
            </button>
          </div>

          {/* Column 4: Legal & Paddle Compliance */}
          <div>
            <div className="tag-uppercase" style={{ marginBottom: '14px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              LEGAL & POLICIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleLegalClick('privacy')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Lock size={14} color="#82A735" /> Privacy Policy
              </button>
              <button
                onClick={() => handleLegalClick('terms')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FileText size={14} color="#82A735" /> Terms of Service
              </button>
              <button
                onClick={() => handleLegalClick('refund')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} color="#82A735" /> Refund & Cancellation Policy
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#82A735', fontWeight: '700', marginTop: '6px' }}>
                <ShieldCheck size={16} />
                <span>14-Day Guarantee</span>
              </div>
            </div>
          </div>

        </div>

        {/* Clean Copyright Line */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
          <span>© {new Date().getFullYear()} Stackwise. Payments processed securely by Paddle.com.</span>
          <span>Build something real.</span>
        </div>
      </div>
    </footer>
  );
}

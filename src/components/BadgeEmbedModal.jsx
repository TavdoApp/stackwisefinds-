import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Code, ShieldCheck } from 'lucide-react';

export default function BadgeEmbedModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<a href="https://stakdock.com" target="_blank" rel="follow"><img src="https://stakdock.com/badge.svg" alt="Featured on StakDock 2026" width="240" height="56" /></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(20, 30, 20, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #2A3B2A 100%)',
          color: '#FFFFFF',
          padding: '28px 24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(130, 167, 53, 0.25)',
            color: '#82A735',
            fontSize: '0.75rem',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: '9999px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Sparkles size={12} /> Embeddable Founder Badge
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            Claim Your Verified Badge
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', margin: 0 }}>
            Embed the official StakDock verification badge on your landing page or docs footer to build user trust.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {/* Badge Preview */}
          <div style={{
            background: '#FAFBF7',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
              BADGE PREVIEW
            </div>
            <img src="/badge.svg" alt="Featured on StakDock Preview" style={{ width: '240px', height: '56px' }} />
          </div>

          {/* HTML Snippet Code Box */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Code size={14} color="#82A735" /> Copy HTML Embed Code
            </label>
            <div style={{
              background: '#141E14',
              color: '#82A735',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              overflowX: 'auto',
              wordBreak: 'break-all',
              border: '1px solid #2A3B2A'
            }}>
              {embedCode}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="btn-pill-green"
            style={{
              width: '100%',
              padding: '14px',
              justifyContent: 'center',
              fontSize: '0.95rem'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied HTML Code!' : 'Copy Embed Code'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '14px' }}>
            <ShieldCheck size={14} color="#82A735" />
            <span>Do-Follow Backlink • Instant 2026 Verification Badge</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Code, ShieldCheck, Award, Sliders } from 'lucide-react';

export default function BadgeEmbedModal({ onClose, defaultToolName = '', defaultToolSlug = '' }) {
  const [toolName, setToolName] = useState(defaultToolName || 'My Software');
  const [toolSlug, setToolSlug] = useState(
    defaultToolSlug || (defaultToolName ? defaultToolName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'software')
  );
  const [badgeStyle, setBadgeStyle] = useState('dark');
  const [rating, setRating] = useState('4.9');
  const [copied, setCopied] = useState(false);

  const cleanSlug = (toolSlug || 'software').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const badgeUrl = `https://stakdock.com/api/badge?tool=${encodeURIComponent(cleanSlug)}&rating=${rating}&style=${badgeStyle}`;
  const targetUrl = `https://stakdock.com/software/${cleanSlug}/`;

  const embedCode = `<a href="${targetUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="${toolName} on StakDock" width="250" height="54" /></a>`;

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
        maxWidth: '560px',
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
            aria-label="Close Badge Modal"
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
            <Sparkles size={12} /> Dynamic Founder Badge Engine
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            Claim Your Verified 2026 Badge
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', lineHeight: '1.5', margin: 0 }}>
            Embed the official live vector verification badge on your homepage or footer to boost visitor trust and conversions.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Customization Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                Software Name
              </label>
              <input
                type="text"
                value={toolName}
                onChange={(e) => {
                  setToolName(e.target.value);
                  setToolSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. XusCRM"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                Badge Theme (Product Hunt Style)
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setBadgeStyle('light')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: badgeStyle === 'light' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Light
                </button>
                <button
                  onClick={() => setBadgeStyle('neutral')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: badgeStyle === 'neutral' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: '#F1F5F9',
                    color: '#1E293B',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setBadgeStyle('dark')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: badgeStyle === 'dark' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: '#141E14',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>

          {/* Live Badge Preview */}
          <div style={{
            background: badgeStyle === 'dark' ? '#0F170F' : '#F8FAFC',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
              LIVE VECTOR PREVIEW
            </div>
            <img 
              src={`/api/badge?tool=${encodeURIComponent(cleanSlug)}&name=${encodeURIComponent(toolName)}&rating=${rating}&style=${badgeStyle}`}
              alt={`${toolName} StakDock Badge Preview`} 
              style={{ width: '270px', height: '64px', margin: '0 auto', display: 'block' }} 
            />
          </div>

          {/* HTML Snippet Code Box */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Code size={14} color="#82A735" /> Copy HTML Embed Snippet
            </label>
            <div style={{
              background: '#141E14',
              color: '#82A735',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '0.75rem',
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
              padding: '12px',
              justifyContent: 'center',
              fontSize: '0.95rem'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied HTML Code!' : 'Copy Embed Code'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            <ShieldCheck size={14} color="#82A735" />
            <span>Real-time SVG vector rendering • Instant high-DPI resolution</span>
          </div>
        </div>
      </div>
    </div>
  );
}

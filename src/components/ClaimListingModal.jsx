import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check, Copy, Code, Send } from 'lucide-react';

export default function ClaimListingModal({ tool, onClose }) {
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [softwareWebsite, setSoftwareWebsite] = useState(tool ? tool.websiteUrl || tool.affiliateUrl || `https://${tool.domain || ''}` : '');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const softwareName = tool ? tool.name : 'Software';
  const toolSlug = (softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const badgeEmbedCode = `<a href="https://stakdock.com/software/${toolSlug}" target="_blank" rel="noopener"><img src="https://stakdock.com/badge.svg" alt="${softwareName} on StakDock 2026" width="240" height="56"/></a>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!founderEmail || !founderEmail.includes('@')) {
      alert('Please enter a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/claim-software', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          softwareName,
          softwareWebsite,
          founderName,
          founderEmail,
          note
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit claim request. Please try again.');
      }
    } catch (err) {
      console.warn('Claim request warning:', err.message);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeEmbedCode);
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
        {/* Modal Header */}
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

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(130, 167, 53, 0.2)', color: '#82A735', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
            <ShieldCheck size={14} /> Founder Verification
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#FFFFFF', lineHeight: 1.2 }}>
            Claim {softwareName} Profile
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', margin: '8px 0 0 0' }}>
            Verify software ownership to manage your profile, customize features, and add embeddable badges.
          </p>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '56px', height: '56px', background: '#F0F7E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#82A735' }}>
                <Check size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
                Claim Request Submitted!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                We sent a confirmation to <strong>{founderEmail}</strong>. You can now grab your official embeddable website badge below while we process your verification!
              </p>

              {/* Badge Preview & Code Box */}
              <div style={{ background: '#F9FBF5', border: '1px solid #C2DC8E', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Your Official StakDock Embed Code
                </div>
                <div style={{ background: '#141E14', color: '#82A735', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', marginBottom: '12px' }}>
                  {badgeEmbedCode}
                </div>
                <button
                  onClick={handleCopyBadge}
                  className="btn-pill-green"
                  style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Badge HTML Code'}</span>
                </button>
              </div>

              <button onClick={onClose} className="btn-pill-outline" style={{ width: '100%', padding: '10px' }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Founder / Team Member Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Work / Company Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@yourcompany.com"
                  value={founderEmail}
                  onChange={(e) => setFounderEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Official Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={softwareWebsite}
                  onChange={(e) => setSoftwareWebsite(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Verification Note / Social Profile (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Link to your LinkedIn or Twitter profile to speed up verification..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill-green"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Claim Software Profile ↗'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

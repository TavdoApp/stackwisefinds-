import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Layers, Send, HelpCircle } from 'lucide-react';
import { extractDomain } from '../utils/logoHelper.js';

export default function SuggestAlternativeModal({ tool, isOpen, onClose }) {
  const [suggestedToolName, setSuggestedToolName] = useState('');
  const [suggestedToolWebsite, setSuggestedToolWebsite] = useState('');
  const [reason, setReason] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !tool) return null;

  const targetDomain = extractDomain(tool);
  const targetFavicon = `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!suggestedToolName.trim()) {
      setErrorMessage('Please enter the name of the alternative tool.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/suggest-alternative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetToolName: tool.name,
          targetToolId: tool.id,
          suggestedToolName: suggestedToolName.trim(),
          suggestedToolWebsite: suggestedToolWebsite.trim(),
          reason: reason.trim(),
          contributorEmail: contributorEmail.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit suggestion. Please try again.');
      }
    } catch (err) {
      // Optimistic completion
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSuggestedToolName('');
    setSuggestedToolWebsite('');
    setReason('');
    setContributorEmail('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div
        className="modal-content-editorial"
        style={{ maxWidth: '540px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="modal-close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'var(--bg-sage)',
            border: 'none',
            borderRadius: '9999px',
            width: '34px',
            height: '34px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            {/* Header with Target Tool Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                flexShrink: 0
              }}>
                <img
                  src={targetFavicon}
                  alt={tool.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ALTERNATIVE INTELLIGENCE
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                  Suggest Alternative to {tool.name}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              Know a great rival, open-source tool, or cheaper replacement for <strong>{tool.name}</strong>? Suggest it below to help founders make better software decisions.
            </p>

            {errorMessage && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Alternative Tool Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kling AI, Cursor, Supabase, Screen Studio..."
                  value={suggestedToolName}
                  onChange={(e) => setSuggestedToolName(e.target.value)}
                  required
                  aria-label="Alternative Tool Name"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Website or URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={suggestedToolWebsite}
                  onChange={(e) => setSuggestedToolWebsite(e.target.value)}
                  aria-label="Website or URL"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Why is it a good alternative? (Key Differentiator)
                </label>
                <textarea
                  rows={3}
                  placeholder={`e.g. "Cheaper pricing plan", "Better API latency", "Open source self-hosted model", "More cinematic video physics"...`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  aria-label="Why is it a good alternative"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Your Email (Optional, to notify you when published)
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  aria-label="Your Email"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill-green"
                style={{
                  padding: '12px',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Alternative for Verification'}</span>
                <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="#82A735" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>
              Thank You, Contributor!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Your suggestion for <strong>{suggestedToolName}</strong> as an alternative to <strong>{tool.name}</strong> has been logged for benchmark analysis.
            </p>
            <button
              onClick={handleResetAndClose}
              className="btn-pill-dark"
              style={{ padding: '10px 26px', fontSize: '0.9rem' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

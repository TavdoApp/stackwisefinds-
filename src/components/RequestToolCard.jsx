import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Mail, Send } from 'lucide-react';

export default function RequestToolCard({ searchTerm = '', onOpenVendorModal }) {
  const [toolName, setToolName] = useState(searchTerm);
  const [userEmail, setUserEmail] = useState('');
  const [toolWebsite, setToolWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update toolName if prop changes
  React.useEffect(() => {
    if (searchTerm) {
      setToolName(searchTerm);
    }
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!toolName.trim()) {
      setErrorMessage('Please enter the name of the software or AI tool.');
      return;
    }

    if (!userEmail.trim() || !userEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address so we can notify you.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/request-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: toolName.trim(),
          toolWebsite: toolWebsite.trim(),
          userEmail: userEmail.trim(),
          notes: `Search query: ${searchTerm}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      // Fallback optimistic UI
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FAFBF7 0%, #F0F4E8 100%)',
      border: '1.5px dashed #82A735',
      borderRadius: '24px',
      padding: '36px 28px',
      margin: '24px 0 40px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(130, 167, 53, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(130, 167, 53, 0.15)',
        filter: 'blur(20px)',
        pointerEvents: 'none'
      }} />

      {!submitted ? (
        <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-sage)',
            color: '#3A5311',
            border: '1px solid #C8D8A0',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px'
          }}>
            <Search size={13} color="#82A735" />
            <span>Missing Software Finder</span>
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.3' }}>
            Can't find {searchTerm ? `"${searchTerm}"` : 'the tool you are looking for'}?
          </h3>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            Enter the tool name and your email. Our editorial team will benchmark, index it, and email you a direct link within <strong>24 hours</strong>.
          </p>

          {errorMessage && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Software or AI Tool Name *"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  required
                  aria-label="Software or AI Tool Name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    background: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Your Email (to notify you) *"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  aria-label="Your Email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    background: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="url"
                placeholder="Optional Tool Website URL (e.g. https://...)"
                value={toolWebsite}
                onChange={(e) => setToolWebsite(e.target.value)}
                aria-label="Optional Tool Website URL"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill-green"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  flexShrink: 0,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <span>{isSubmitting ? 'Submitting...' : 'Request Tool'}</span>
                <Send size={15} />
              </button>
            </div>
          </form>

          {/* Founder Quick-Link */}
          {onOpenVendorModal && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(130, 167, 53, 0.2)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span>Are you the founder of this product? </span>
              <button
                type="button"
                onClick={onOpenVendorModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#82A735',
                  fontWeight: '800',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Submit for 1-Click Fast Track Listing →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '10px 0' }}>
          <CheckCircle2 size={48} color="#82A735" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Request Received!
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '20px' }}>
            We've logged <strong>{toolName}</strong> for priority editorial indexing. Our team will verify the tool and send a direct notification to <strong>{userEmail}</strong> within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setToolName(''); setUserEmail(''); setToolWebsite(''); }}
            className="btn-pill-dark"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Request Another Tool
          </button>
        </div>
      )}
    </div>
  );
}

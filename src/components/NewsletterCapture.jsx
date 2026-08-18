import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NewsletterCapture({ sourcePage = 'footer', variant = 'dark' }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          sourcePage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
      } else {
        setErrorMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(135deg, #182818 0%, #0F170F 100%)'
        : 'linear-gradient(135deg, #FAFBF7 0%, #F0F4E8 100%)',
      border: isDark ? '1px solid #284428' : '1px solid #C8D8A0',
      borderRadius: '24px',
      padding: '36px 28px',
      boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.4)' : '0 8px 30px rgba(130,167,53,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Orb */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'rgba(130, 167, 53, 0.2)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {!subscribed ? (
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isDark ? 'rgba(130, 167, 53, 0.2)' : 'var(--bg-sage)',
            color: isDark ? '#A3D944' : '#3A5311',
            border: isDark ? '1px solid rgba(130, 167, 53, 0.3)' : '1px solid #C8D8A0',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px'
          }}>
            <Sparkles size={13} color="#82A735" />
            <span>Weekly SaaS & AI Drops</span>
          </div>

          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: isDark ? '#FFFFFF' : 'var(--text-dark)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
            lineHeight: '1.25'
          }}>
            Never Miss the Next Breakout AI or Micro-SaaS
          </h3>

          <p style={{
            fontSize: '0.94rem',
            color: isDark ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
            lineHeight: '1.6',
            margin: '0 auto 24px',
            maxWidth: '520px'
          }}>
            Join 12,000+ tech founders, creators, and operators getting our curated briefing of 5 newly launched tools every Tuesday.
          </p>

          {errorMessage && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '10px',
            maxWidth: '480px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="email"
                placeholder="Enter your work email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Enter your work email"
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '9999px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--border-color)',
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : 'var(--text-dark)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill-green"
              style={{
                padding: '13px 26px',
                fontSize: '0.92rem',
                fontWeight: '800',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                flexShrink: 0
              }}
            >
              <span>{isSubmitting ? 'Joining...' : 'Subscribe Free'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-light)',
            marginTop: '16px'
          }}>
            <ShieldCheck size={14} color="#82A735" />
            <span>Zero spam. No sponsor junk. Unsubscribe at any time with 1-click.</span>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, padding: '12px 0' }}>
          <CheckCircle2 size={46} color="#82A735" style={{ margin: '0 auto 12px' }} />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: isDark ? '#FFFFFF' : 'var(--text-dark)',
            marginBottom: '8px'
          }}>
            You're on the list!
          </h3>
          <p style={{
            fontSize: '0.92rem',
            color: isDark ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Welcome! Look out for our next curated tools drop in your inbox on Tuesday.
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Star } from 'lucide-react';

export default function VendorModal({ onClose }) {
  const [vendorName, setVendorName] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [softwareWebsite, setSoftwareWebsite] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePaddleCheckout = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
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
            <Sparkles size={12} /> Sponsor Spot • Paddle Checkout Ready
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            Feature Your SaaS Software
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
            Get pinned at the top of StakDock in front of 50,000+ purchasing managers and founders.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={48} color="#82A735" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
                Application Received!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                Our team is reviewing your software application for <strong>{softwareName}</strong>. You will receive a direct Paddle payment link at <strong>{vendorEmail}</strong> shortly.
              </p>
              <button onClick={onClose} className="btn-pill-green" style={{ width: '100%', padding: '12px' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Pricing Box */}
              <div style={{
                background: 'var(--bg-sage)',
                border: '1px solid #82A735',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-green-dark)', textTransform: 'uppercase' }}>
                    FEATURED VENDOR TIER
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                    $99 <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>/ year</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: '700', textAlign: 'right' }}>
                  ⚡ Guaranteed Top #1 Spot<br />
                  ⭐️ Verified Badge Inclusion
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handlePaddleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Your Name / Founder Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ossama Tbili"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                      Software Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. XusCRM"
                      value={softwareName}
                      onChange={(e) => setSoftwareName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                      Software Website URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://xuscrm.com"
                      value={softwareWebsite}
                      onChange={(e) => setSoftwareWebsite(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Business Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@yourcompany.com"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill-green"
                  style={{
                    padding: '14px',
                    fontSize: '0.95rem',
                    justifyContent: 'center',
                    marginTop: '6px'
                  }}
                >
                  <CreditCard size={18} />
                  <span>{isSubmitting ? 'Opening Paddle Checkout...' : 'Proceed to Paddle Checkout ($199/yr)'}</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  <ShieldCheck size={14} color="#82A735" />
                  <span>Secured by Paddle Merchant of Record • 14-Day Guarantee</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

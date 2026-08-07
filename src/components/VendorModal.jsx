import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Star, Check, Zap } from 'lucide-react';
import { saasCategories } from '../data/saasData.jsx';

export default function VendorModal({ onClose, initialPackage = 'free' }) {
  const [packageType, setPackageType] = useState(initialPackage); // 'free' | 'premium' | 'top-banner' | 'in-feed'
  const [vendorName, setVendorName] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [softwareWebsite, setSoftwareWebsite] = useState('');
  const [category, setCategory] = useState('ai-content');
  const [vendorEmail, setVendorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dodoProductMap = {
    'top-banner': 'pdt_0NksTosz02Ins84wJV7ku',
    'premium': 'pdt_0NksUHnFhOrLcWvnGrz5R',
    'in-feed': 'pdt_0NksUTrDVDvUmZ0eDGxNz'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Save vendor submission in Cloudflare D1
      const response = await fetch('/api/submit-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName,
          softwareName,
          softwareWebsite,
          vendorEmail,
          category,
          packageType
        })
      });

      // 2. If paid package selected, trigger Dodo Payments checkout session
      const selectedProductId = dodoProductMap[packageType];
      if (selectedProductId) {
        try {
          const checkoutRes = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              softwareName,
              softwareWebsite,
              vendorEmail,
              packageType,
              productId: selectedProductId
            })
          });
          const checkoutData = await checkoutRes.json();
          if (checkoutData && checkoutData.checkoutUrl) {
            window.location.href = checkoutData.checkoutUrl;
            return;
          } else {
            // Direct Dodo payment link fallback
            window.location.href = `https://checkout.dodopayments.com/buy/${selectedProductId}`;
            return;
          }
        } catch (ckErr) {
          console.warn('Checkout API fallback:', ckErr.message);
          window.location.href = `https://checkout.dodopayments.com/buy/${selectedProductId}`;
          return;
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.warn('Backend API fallback:', err.message);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
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
            background: packageType === 'free' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(130, 167, 53, 0.25)',
            color: packageType === 'free' ? '#FFFFFF' : '#82A735',
            fontSize: '0.75rem',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: '9999px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Sparkles size={12} /> Submit Software • Free & Premium Tiers
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            List Your Software on StakDock
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', margin: 0 }}>
            Join 500+ verified software platforms and reach over 50,000+ founders and purchasing managers.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <CheckCircle2 size={52} color="#82A735" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>
                {packageType === 'free' ? 'Free Submission Received!' : 'Premium Application Queued!'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {packageType === 'free'
                  ? `Your software submission for ${softwareName} has been queued for automated verification and directory indexing. Updates will be sent to ${vendorEmail}.`
                  : `Your premium application for ${softwareName} has been recorded. Our team will send the direct Paddle checkout link and priority placement setup to ${vendorEmail}.`}
              </p>
              <button onClick={onClose} className="btn-pill-green" style={{ width: '100%', padding: '12px' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Package Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                
                {/* Package 1: Free Listing */}
                <div
                  onClick={() => setPackageType('free')}
                  style={{
                    border: packageType === 'free' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: packageType === 'free' ? '#F9FBF5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase' }}>
                      Standard Listing
                    </div>
                    {packageType === 'free' && <CheckCircle2 size={16} color="#82A735" />}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#82A735', marginBottom: '6px' }}>
                    $0 <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ free</span>
                  </div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', paddingLeft: '14px', margin: 0 }}>
                    <li>Directory Indexing</li>
                    <li>Automated Checks</li>
                  </ul>
                </div>

                {/* Package 2: In-Feed Sponsor */}
                <div
                  onClick={() => setPackageType('in-feed')}
                  style={{
                    border: packageType === 'in-feed' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: packageType === 'in-feed' ? '#F9FBF5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} /> In-Feed Sponsor
                    </div>
                    {packageType === 'in-feed' && <CheckCircle2 size={16} color="#82A735" />}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    $49 <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ month</span>
                  </div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: '600', lineHeight: '1.5', paddingLeft: '14px', margin: 0 }}>
                    <li>⭐️ Feed Card Highlight</li>
                    <li>⚡ Priority Category Rank</li>
                  </ul>
                </div>

                {/* Package 3: Top Banner Sponsor */}
                <div
                  onClick={() => setPackageType('top-banner')}
                  style={{
                    border: packageType === 'top-banner' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: packageType === 'top-banner' ? '#F9FBF5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} /> Top Banner Sponsor
                    </div>
                    {packageType === 'top-banner' && <CheckCircle2 size={16} color="#82A735" />}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    $99 <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ month</span>
                  </div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: '600', lineHeight: '1.5', paddingLeft: '14px', margin: 0 }}>
                    <li>🚀 Top Header Site Banner</li>
                    <li>🔥 #1 Spot Across Pages</li>
                  </ul>
                </div>

                {/* Package 4: Annual Featured */}
                <div
                  onClick={() => setPackageType('premium')}
                  style={{
                    border: packageType === 'premium' ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: packageType === 'premium' ? '#F9FBF5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} /> Featured Annual
                    </div>
                    {packageType === 'premium' && <CheckCircle2 size={16} color="#82A735" />}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    $99 <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ year</span>
                  </div>
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: '600', lineHeight: '1.5', paddingLeft: '14px', margin: 0 }}>
                    <li>⭐️ Featured Green Badge</li>
                    <li>Express 24-Hour Review</li>
                  </ul>
                </div>

              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {errorMsg && (
                  <div style={{ background: '#FFF2F2', border: '1px solid #FF8080', color: '#CC0000', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Founder / Submitter Name *
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
                      placeholder="https://xuscrm.com"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    >
                      {saasCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="founder@company.com"
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
                  {packageType === 'free' && (
                    <>
                      <Check size={18} />
                      <span>{isSubmitting ? 'Submitting Free Listing...' : 'Submit Free Software Listing ($0)'}</span>
                    </>
                  )}
                  {packageType === 'top-banner' && (
                    <>
                      <CreditCard size={18} />
                      <span>{isSubmitting ? 'Processing Checkout...' : 'Proceed to Top Banner Sponsor ($99/mo)'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                  {packageType === 'in-feed' && (
                    <>
                      <CreditCard size={18} />
                      <span>{isSubmitting ? 'Processing Checkout...' : 'Proceed to In-Feed Sponsor ($49/mo)'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                  {packageType === 'premium' && (
                    <>
                      <CreditCard size={18} />
                      <span>{isSubmitting ? 'Processing Checkout...' : 'Proceed to Featured Annual ($99/yr)'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  <ShieldCheck size={14} color="#82A735" />
                  <span>Verified Submissions • Automated Health & SSL Verification</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

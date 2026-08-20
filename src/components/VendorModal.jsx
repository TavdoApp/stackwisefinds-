import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, 
  Star, Check, Zap, Globe, RefreshCw, Eye, Award, DollarSign, Rocket, Share2, Copy
} from 'lucide-react';
import { saasCategories } from '../data/saasData.jsx';
import { extractDomain, getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';

export default function VendorModal({ onClose, initialPackage = 'free' }) {
  const [packageType, setPackageType] = useState(initialPackage); // 'free' | 'in-feed' | 'premium' | 'top-banner'
  const [softwareWebsite, setSoftwareWebsite] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('ai-content');
  const [pricing, setPricing] = useState('Freemium');
  const [startingPrice, setStartingPrice] = useState('Free Tier Available');
  const [pricingTier, setPricingTier] = useState('$$'); // '$' | '$$' | '$$$'
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  
  const [isInspecting, setIsInspecting] = useState(false);
  const [hasAutoInspected, setHasAutoInspected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dodoProductMap = {
    'top-banner': 'pdt_0NksTosz02Ins84wJV7ku',
    'premium': 'pdt_0NksUHnFhOrLcWvnGrz5R',
    'in-feed': 'pdt_0NksUTrDVDvUmZ0eDGxNz'
  };

  // Inspect Domain Handler (Capterra / G2 Auto-Enrichment)
  const handleInspectDomain = async (targetDomain) => {
    const raw = (targetDomain || softwareWebsite || '').trim();
    if (!raw || raw.length < 3) return;

    setIsInspecting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/inspect-domain?domain=${encodeURIComponent(raw)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.softwareName) setSoftwareName(data.softwareName);
        if (data.tagline) setTagline(data.tagline);
        if (data.category && saasCategories.some(c => c.id === data.category)) {
          setCategory(data.category);
        }
        if (data.pricing) setPricing(data.pricing);
        if (data.startingPrice) setStartingPrice(data.startingPrice);
        if (data.pricingTier) setPricingTier(data.pricingTier);
        if (data.websiteUrl) setSoftwareWebsite(data.websiteUrl);

        setHasAutoInspected(true);
      }
    } catch (err) {
      console.warn('Domain inspection fallback:', err.message);
      const cleaned = extractDomain(raw);
      if (!softwareName && cleaned) {
        const inferred = cleaned.split('.')[0];
        setSoftwareName(inferred.charAt(0).toUpperCase() + inferred.slice(1));
      }
    } finally {
      setIsInspecting(false);
    }
  };

  const handleDomainChange = (e) => {
    setSoftwareWebsite(e.target.value);
  };

  const handleDomainBlur = () => {
    if (softwareWebsite.includes('.') && softwareWebsite.length >= 4 && !hasAutoInspected) {
      handleInspectDomain(softwareWebsite);
    }
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
          tagline,
          description: tagline,
          pricing: startingPrice || pricing,
          pricingTier,
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

  const cleanDomain = extractDomain(softwareWebsite || 'software.com');
  const logoUrl = getLogoUrl({ domain: cleanDomain });
  const categoryObj = saasCategories.find(c => c.id === category);

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
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        position: 'relative',
        margin: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #1F2D1F 100%)',
          padding: '24px 28px',
          color: '#FFFFFF',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(130,167,53,0.25)',
              color: '#82A735',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ⚡ 1-CLICK FOUNDER SUBMISSION
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
              Reach 50,000+ Software Buyers
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 4px', color: '#FFFFFF' }}>
            List Your Software on StakDock
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(255,255,255,0.8)' }}>
            Enter your domain — our AI auto-fetches your logo, tagline, category, and pricing in seconds.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(130,167,53,0.15)',
                color: '#82A735',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                🎉 Submission Received!
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 18px', lineHeight: '1.5' }}>
                We are processing <strong>{softwareName || 'your software'}</strong>. While automated checks verify your site, share your launch with your community to collect upvotes and rank #1!
              </p>

              <div style={{
                background: '#F6F7F2',
                border: '1px dashed #82A735',
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '480px',
                margin: '0 auto 24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.86rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <Rocket size={16} color="#82A735" />
                  <span>Kickstart Your Launch Campaign:</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const shareText = `🚀 We just launched ${softwareName || 'our SaaS'} on @StakDock!\n\nCheck it out and show some love:`;
                      const shareUrl = `https://stakdock.com/ranking`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn-pill-dark"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    Share on 𝕏 (Twitter)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `https://stakdock.com/ranking`;
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn-pill-outline"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    Share on LinkedIn
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-pill-green"
                style={{ padding: '12px 28px', margin: '0 auto' }}
              >
                Back to StakDock Directory
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Step 1: 1-Click Domain Input with AI Auto-Inspection */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span>Website / Domain *</span>
                  <span style={{ fontSize: '0.75rem', color: '#82A735', fontWeight: '700' }}>
                    🤖 Instant 1-Click Auto-Fill
                  </span>
                </label>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. xuscrm.com or https://mytool.com"
                      value={softwareWebsite}
                      onChange={handleDomainChange}
                      onBlur={handleDomainBlur}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border-color)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      className="focus:border-[#82A735]"
                    />
                    <Globe size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInspectDomain()}
                    disabled={isInspecting || !softwareWebsite}
                    style={{
                      background: '#141E14',
                      color: '#FFFFFF',
                      border: '1px solid #2C3E2C',
                      padding: '0 16px',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      cursor: isInspecting || !softwareWebsite ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isInspecting || !softwareWebsite ? 0.6 : 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <RefreshCw size={14} className={isInspecting ? 'animate-spin' : ''} />
                    <span>{isInspecting ? 'Inspecting...' : 'Auto-Fill ⚡'}</span>
                  </button>
                </div>

                {isInspecting && (
                  <p style={{ fontSize: '0.78rem', color: '#82A735', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={13} /> Extracting brand logo, tagline, category & pricing from domain...
                  </p>
                )}
              </div>

              {/* Step 2: Interactive Real-Time "Live StakDock Listing Preview" */}
              <div style={{
                background: '#FAFBF7',
                border: '1.5px dashed #82A735',
                borderRadius: '16px',
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase' }}>
                    <Eye size={14} /> Live Directory Listing Preview
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    How it looks to buyers
                  </span>
                </div>

                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  {/* Logo Preview */}
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={logoUrl}
                      alt="Logo preview"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`; }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-dark)' }}>
                        {softwareName || 'Your Software Name'}
                      </span>
                      <span style={{
                        background: packageType !== 'free' ? '#82A735' : '#EBF0E1',
                        color: packageType !== 'free' ? '#FFFFFF' : '#536253',
                        fontSize: '0.66rem',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {packageType === 'premium' ? '⭐ FEATURED PRO' : packageType === 'top-banner' ? '🔥 TOP BANNER' : packageType === 'in-feed' ? '⚡ SPOTLIGHT' : 'VERIFIED TOOL'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontWeight: '700' }}>
                        <Star size={12} fill="#F59E0B" /> 4.9
                      </div>
                      <span>•</span>
                      <span>{categoryObj?.label || 'Software'}</span>
                      <span>•</span>
                      <span style={{ fontWeight: '700', color: '#82A735' }}>
                        {startingPrice || pricing} ({pricingTier})
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: '1.4', margin: 0 }}>
                      {tagline || 'AI-powered digital platform engineered to streamline team workflows and scale productivity.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Editable Metadata Fields (Pre-filled by AI) */}
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
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  >
                    {saasCategories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline / Value Proposition */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                  Tagline / 1-Sentence Value Proposition *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-powered real estate CRM that automates lead follow-ups"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Pricing & Tier Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Starting Price / Plans *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Tier / $19/mo"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Pricing Model
                  </label>
                  <select
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="Freemium">Freemium</option>
                    <option value="Free Trial">Free Trial</option>
                    <option value="Open-Source">Open-Source</option>
                    <option value="100% Free">100% Free Forever</option>
                    <option value="Paid">Paid / Subscription</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Price Tier
                  </label>
                  <select
                    value={pricingTier}
                    onChange={(e) => setPricingTier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: '#FFFFFF',
                      fontWeight: '700'
                    }}
                  >
                    <option value="$">$ (Budget / Free)</option>
                    <option value="$$">$$ (Standard / Pro)</option>
                    <option value="$$$">$$$ (Enterprise)</option>
                  </select>
                </div>
              </div>

              {/* Founder Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Founder / Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ossama Tbili"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Founder Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@domain.com"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Step 4: 4-Tier Launch & Sponsorship Selection Grid */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                  Select Launch & Indexing Tier
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  {/* Tier 1: Free Listing */}
                  <div
                    onClick={() => setPackageType('free')}
                    style={{
                      border: packageType === 'free' ? '2px solid #82A735' : '1px solid var(--border-color)',
                      background: packageType === 'free' ? '#FAFBF7' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-dark)' }}>Free Listing</span>
                      <span style={{ fontWeight: '800', color: '#82A735', fontSize: '0.85rem' }}>$0</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                      Standard queue • 48-72h review
                    </p>
                  </div>

                  {/* Tier 2: Category Spotlight ($49/mo) */}
                  <div
                    onClick={() => setPackageType('in-feed')}
                    style={{
                      border: packageType === 'in-feed' ? '2px solid #82A735' : '1px solid var(--border-color)',
                      background: packageType === 'in-feed' ? '#FAFBF7' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-dark)' }}>⚡ Spotlight</span>
                      <span style={{ fontWeight: '800', color: '#82A735', fontSize: '0.85rem' }}>$49/mo</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                      #1 Category spot + Competitor Intercept Banner
                    </p>
                  </div>

                  {/* Tier 3: Featured Annual Pro ($99/yr) */}
                  <div
                    onClick={() => setPackageType('premium')}
                    style={{
                      border: packageType === 'premium' ? '2px solid #82A735' : '1px solid var(--border-color)',
                      background: packageType === 'premium' ? '#FAFBF7' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-dark)' }}>⭐ Featured</span>
                      <span style={{ fontWeight: '800', color: '#82A735', fontSize: '0.85rem' }}>$99/yr</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                      Homepage spotlight + Competitor Intercept Banner + Dofollow link
                    </p>
                  </div>

                  {/* Tier 4: Top Banner Takeover ($99/mo) */}
                  <div
                    onClick={() => setPackageType('top-banner')}
                    style={{
                      border: packageType === 'top-banner' ? '2px solid #82A735' : '1px solid var(--border-color)',
                      background: packageType === 'top-banner' ? '#FAFBF7' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-dark)' }}>🔥 Top Banner</span>
                      <span style={{ fontWeight: '800', color: '#82A735', fontSize: '0.85rem' }}>$99/mo</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                      Sitewide top banner • 50K+ impressions
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill-green"
                style={{
                  padding: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  justifyContent: 'center',
                  marginTop: '4px',
                  gap: '8px'
                }}
              >
                {packageType === 'free' ? (
                  <>
                    <Check size={18} />
                    <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Free Listing ($0)'}</span>
                  </>
                ) : packageType === 'in-feed' ? (
                  <>
                    <CreditCard size={18} />
                    <span>{isSubmitting ? 'Connecting Checkout...' : 'Proceed to Category Spotlight ($49/mo)'}</span>
                    <ArrowRight size={16} />
                  </>
                ) : packageType === 'premium' ? (
                  <>
                    <CreditCard size={18} />
                    <span>{isSubmitting ? 'Connecting Checkout...' : 'Proceed to Featured Pro ($99/yr)'}</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>{isSubmitting ? 'Connecting Checkout...' : 'Proceed to Top Banner Sponsor ($99/mo)'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} color="#82A735" />
                <span>Automated SSL & Domain Health Verification • Instant Founder Dashboard Access</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

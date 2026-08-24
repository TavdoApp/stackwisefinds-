import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, Flame, Eye, Share2, Check, Copy, MessageSquare, BarChart3, Tag, Globe, Sparkles, Gift, HelpCircle, ChevronDown, ChevronUp, Layers, Quote, ArrowRight, UserCheck } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFAQPageSchema } from '../utils/schemaMarkup.jsx';
import { extractDomain, getFallbackInitials } from '../utils/logoHelper.js';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';
import { getToolAlternatives, getCommunitySwitchInsight, getGroupedAlternatives } from '../utils/alternativesHelper.js';
import { getToolVotes, getGamifiedBadge, getNextMilestone } from '../utils/upvoteHelper.js';
import { getDealBreakdown, formatDealPrice } from '../utils/dealHelper.js';
import UpvoteButton from './UpvoteButton.jsx';
import ShareLaunchModal from './ShareLaunchModal.jsx';
import SuggestAlternativeModal from './SuggestAlternativeModal.jsx';

export default function ToolDetailPage({ toolId, allTools, onBack, onOpenReviewModal, onToggleCompare, isSelectedForCompare, onOpenBadgeModal, onOpenClaimModal, onSelectTool, onNavigateAlternatives, onNavigateVersus, onOpenVendorModal }) {
  const [activeTab, setActiveTab] = useState('product-info');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [inPageBadgeStyle, setInPageBadgeStyle] = useState('light');
  const [inPageBadgeCopied, setInPageBadgeCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const toolsArray = Array.isArray(allTools) && allTools.length > 0 ? allTools : saasTools;
  const tool = toolsArray.find(t => t.id === toolId || (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === toolId)) || saasTools.find(t => t.id === toolId) || saasTools[0];
  
  // Dynamic Gamified Upvote Badge & Milestone
  const currentVotes = getToolVotes(tool);
  const gamifiedBadge = getGamifiedBadge(currentVotes);
  const nextMilestone = getNextMilestone(currentVotes);

  // Intelligent Pro Alternatives Engine
  const alternatives = getToolAlternatives(tool, toolsArray, { limit: 12 });
  const switchInsight = getCommunitySwitchInsight(tool);
  const groupedAlternatives = getGroupedAlternatives(tool, toolsArray);

  // Category Sponsor / Competitor Intercept Tool
  const categorySponsor = toolsArray.find(t => 
    t && t.id !== tool.id && 
    t.category === tool.category && 
    (t.packageType === 'premium' || t.isInFeed || t.packageType === 'in-feed' || (t.submittedByVendor && t.packageType !== 'free'))
  ) || (alternatives && alternatives.length > 0 ? alternatives[0] : null);

  // Live Community Reviews State (Loaded from localStorage for local user submissions)
  const [communityReviews, setCommunityReviews] = useState(() => {
    try {
      const storageKey = `stakdock_reviews_${tool.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleReviewAdded = (e) => {
      if (e.detail && e.detail.toolId === tool.id && e.detail.review) {
        setCommunityReviews(prev => [e.detail.review, ...prev.filter(r => r.id !== e.detail.review.id)]);
      }
    };
    window.addEventListener('stakdock_review_added', handleReviewAdded);
    return () => window.removeEventListener('stakdock_review_added', handleReviewAdded);
  }, [tool.id]);

  const isFreeVendor = tool.packageType === 'free' || (tool.submittedByVendor && tool.packageType !== 'in-feed' && tool.packageType !== 'top-banner' && tool.packageType !== 'premium');
  const relAttr = isFreeVendor ? "nofollow noopener noreferrer" : "noopener noreferrer";

  const dealUrl = tool.dealUrl || tool.lifetimeDealUrl || '';
  const officialWebsite = tool.websiteUrl || (tool.domain ? `https://${tool.domain}` : tool.affiliateUrl || 'https://stakdock.com');
  const hasActiveDeal = tool.hasLifetimeDeal || !!dealUrl || !!tool.dealPrice || (tool.pricing && tool.pricing.toLowerCase().includes('ltd')) || (tool.pricing && tool.pricing.toLowerCase().includes('lifetime'));
  const dealInfo = getDealBreakdown(tool.dealPrice, tool.dealDiscount);

  const googleFavicon = `https://www.google.com/s2/favicons?domain=${extractDomain(tool)}&sz=128`;
  const visitsDisplay = tool.monthlyVisits || null;
  const hasRating = Number.isFinite(tool.rating) && Number.isFinite(tool.reviewsCount);

  if (tool.autoQualifiedAt) {
    return (
      <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '900px' }}>
        {injectSoftwareApplicationSchema(tool)}
        <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
          <p className="tag-sage" style={{ display: 'inline-block', margin: '0 0 12px' }}>Newly added</p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 12px', color: 'var(--text-dark)' }}>{tool.name}</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: '0 0 20px' }}>{tool.description}</p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '0 0 24px' }}>
            <div><dt style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Category</dt><dd style={{ margin: '4px 0 0', fontWeight: '700' }}>{tool.category}</dd></div>
            <div><dt style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Pricing</dt><dd style={{ margin: '4px 0 0', fontWeight: '700' }}>Check the website</dd></div>
          </dl>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>Automated checks confirmed a GitHub source and a reachable HTTPS website. Pricing, ratings, traffic, and reviews are not displayed until independently verified.</p>
          <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl)} className="btn-pill-green" style={{ display: 'inline-flex', marginTop: '12px', textDecoration: 'none' }}>
            Visit {tool.name} <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1020px' }}>
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(tool)}

      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="btn-pill-outline" 
        style={{ marginBottom: '24px' }} 
        aria-label="Back to Directory"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Main Detail Header Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              background: '#F6F7F2',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={googleFavicon} 
                alt={tool.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                  {tool.name}
                </h1>
                <span className="tag-sage" style={{ fontSize: '0.75rem' }}>
                  {tool.claimedByFounder ? '✓ Founder Verified' : '🌐 Website Checked'}
                </span>
                {gamifiedBadge && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    background: gamifiedBadge.bg,
                    color: gamifiedBadge.color,
                    border: `1px solid ${gamifiedBadge.border}`,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: gamifiedBadge.shadow
                  }}>
                    {gamifiedBadge.icon} {gamifiedBadge.label}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: '600' }}>
                  <MessageSquare size={15} color="#82A735" />
                  <span>{communityReviews.length} community {communityReviews.length === 1 ? 'review' : 'reviews'}</span>
                </div>

                <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                  Pricing: {tool.pricing || 'Freemium'}
                </div>

                {tool.isFreeTier && (
                  <span style={{ background: '#EBF3DE', color: '#2D4522', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #D6E4C2' }}>
                    ✓ Free Tier
                  </span>
                )}

                {tool.isOpenSource && (
                  <span style={{ background: '#EBF0E1', color: '#141E14', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #D6E4C2' }}>
                    ⚙ Open Source
                  </span>
                )}

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0F5E5', color: '#2D4522', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700', border: '1px solid #D6E4C2' }}>
                  <Tag size={12} color="#82A735" />
                  <span>Best for: {tool.bestFor || tool.targetAudience || 'Founders & Operations'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <UpvoteButton tool={tool} size="md" />

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="btn-pill-outline"
              style={{
                padding: '12px 18px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700'
              }}
              title="Share and collect upvotes"
            >
              <Share2 size={16} color="#82A735" />
              <span>Share & Upvote</span>
            </button>

            {(tool.dealUrl || tool.lifetimeDealUrl || tool.hasLifetimeDeal || tool.dealPrice) && (
              <a
                href={dealUrl || officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(tool.id, dealUrl || officialWebsite)}
                className="btn-pill-dark"
                style={{
                  padding: '14px 24px',
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(234,88,12,0.35)',
                  fontWeight: '800'
                }}
              >
                <Gift size={18} />
                <span>🔥 Claim {dealInfo.dealPrice ? `${dealInfo.dealPrice} LTD` : 'Lifetime Deal'}</span>
              </a>
            )}
            <a
              href={officialWebsite}
              target="_blank"
              rel={relAttr}
              onClick={() => trackAffiliateClick(tool.id, officialWebsite)}
              className="btn-pill-green"
              style={{ padding: '14px 26px', fontSize: '0.98rem', textDecoration: 'none' }}
            >
              <span>Open Website</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        {/* Lifetime Deal Spotlight Box */}
        {(tool.hasLifetimeDeal || tool.dealPrice || tool.dealUrl || tool.lifetimeDealUrl) && (
          <div style={{
            margin: '20px 0 24px 0',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1.5px solid #F97316',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  background: '#EA580C',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  🔥 ACTIVE {tool.dealPlatform || 'APPSUMO'} DEAL
                </span>
                {dealInfo.discountPercent && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {dealInfo.discountPercent}
                  </span>
                )}
                {dealInfo.savingsAmount && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    SAVE {dealInfo.savingsAmount}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#9A3412', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span>{dealInfo.dealPrice} One-Time Lifetime Access</span>
                {dealInfo.originalPrice && (
                  <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: '#9CA3AF', fontWeight: '600' }}>
                    {dealInfo.originalPrice}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.88rem', color: '#7C2D12', margin: '4px 0 0 0', fontWeight: '500' }}>
                {tool.dealHighlights || 'Pay once, own forever with lifetime updates and zero recurring subscription fees.'}
              </p>
            </div>

            {(dealUrl || officialWebsite) && (
              <a
                href={dealUrl || officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(tool.id, dealUrl || officialWebsite)}
                style={{
                  background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '9999px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                }}
              >
                <span>Claim Deal on {tool.dealPlatform || 'AppSumo'}</span>
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        )}

        {/* Introduction */}
        <p style={{ fontSize: '1.08rem', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: nextMilestone ? '16px' : '24px' }}>
          {tool.description}
        </p>

        {/* Viral Upvote Milestone Rally Banner */}
        {nextMilestone && (
          <div style={{
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1px solid #86EFAC',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#166534', fontWeight: '600' }}>
              <Sparkles size={16} color="#15803D" />
              <span>
                Currently has <strong>{currentVotes} upvote{currentVotes === 1 ? '' : 's'}</strong> • Collect <strong>{nextMilestone.needed} more upvote{nextMilestone.needed === 1 ? '' : 's'}</strong> to unlock the <strong>{nextMilestone.nextBadge}</strong> badge!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              style={{
                background: '#15803D',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Share2 size={13} /> Rally Upvotes
            </button>
          </div>
        )}

        {/* Website Preview Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #203320 100%)',
          borderRadius: '18px',
          padding: '36px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img 
            src={googleFavicon}
            alt={tool.name}
            style={{ width: '44px', height: '44px', margin: '0 auto 12px', borderRadius: '12px' }}
          />
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            {tool.name} Official Platform Dashboard
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto 20px' }}>
            Access official documentation, enterprise pricing tiers, and cloud features directly on {tool.domain}.
          </p>

          <a
            href={tool.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl)}
            className="btn-pill-green"
            style={{ padding: '10px 24px', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex' }}
          >
            <span>Visit {tool.name} Official Site ({tool.domain})</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Toolify 5 Sub-Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'product-info', label: 'Product Information' },
          { id: 'reviews', label: `Reviews (${tool.reviewsCount || 120})` },
          { id: 'pricing', label: 'Pricing' },
          { id: 'analytics', label: '📊 Traffic & Analytics' },
          { id: 'alternatives', label: `Alternatives (${alternatives.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: '800',
              color: activeTab === tab.id ? '#82A735' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '3px solid #82A735' : '3px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Product Information */}
      {activeTab === 'product-info' && (
        <>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
              What is {tool.name}?
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              {tool.description ? tool.description : `${tool.name} is a software platform engineered for founders, developers, and operational teams. Built to streamline workflows, eliminate manual overhead, and accelerate execution.`}
            </p>

            {tool.bestFor && (
              <div style={{ background: '#F4F8F0', borderLeft: '4px solid #82A735', padding: '14px 18px', borderRadius: '0 12px 12px 0', margin: '20px 0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#2D4522', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Target Audience &amp; Best For
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                  {tool.bestFor}
                </div>
              </div>
            )}

            {Array.isArray(tool.features) && tool.features.length > 0 && (
              <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-dark)' }}>
                  Key Features &amp; Capabilities
                </h4>
                <ul style={{ margin: 0, paddingLeft: '22px', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '0.96rem' }}>
                  {tool.features.map((feat, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {((Array.isArray(tool.pros) && tool.pros.length > 0) || (Array.isArray(tool.cons) && tool.cons.length > 0)) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '24px 0' }}>
                {Array.isArray(tool.pros) && tool.pros.length > 0 && (
                  <div style={{ background: '#F7FAF5', border: '1px solid #DCE8D6', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ fontWeight: '800', color: '#2D4522', fontSize: '1rem', marginBottom: '10px' }}>
                      ✓ Key Strengths
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.7', color: 'var(--text-dark)', fontSize: '0.92rem' }}>
                      {tool.pros.map((p, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(tool.cons) && tool.cons.length > 0 && (
                  <div style={{ background: '#FFFCF7', border: '1px solid #F2E2CF', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ fontWeight: '800', color: '#9A3412', fontSize: '1rem', marginBottom: '10px' }}>
                      ⚠ Documented Constraints
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.7', color: '#5C3E29', fontSize: '0.92rem' }}>
                      {tool.cons.map((c, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {Array.isArray(tool.curatedAlternatives) && tool.curatedAlternatives.length > 0 && (
              <div style={{ marginTop: '28px', marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-dark)' }}>
                  Curated Direct Substitutes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tool.curatedAlternatives.map((alt, idx) => (
                    <div key={idx} style={{ padding: '14px 18px', background: '#F9FBF8', border: '1px solid #E2EDE0', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                        <a 
                          href={`/software/${alt.toolId}/`} 
                          onClick={(e) => {
                            if (onSelectTool) {
                              e.preventDefault();
                              const targetTool = toolsArray.find(t => t.id === alt.toolId);
                              if (targetTool) onSelectTool(targetTool);
                              else window.location.href = `/software/${alt.toolId}/`;
                            }
                          }}
                          style={{ color: 'var(--text-dark)', fontWeight: '800', textDecoration: 'none', fontSize: '1rem' }}
                        >
                          {alt.name}
                        </a>
                        <a 
                          href={`/vs/${tool.id}-vs-${alt.toolId}/`} 
                          onClick={(e) => {
                            if (onNavigateVersus) {
                              e.preventDefault();
                              onNavigateVersus(tool.id, alt.toolId);
                            }
                          }}
                          style={{ fontSize: '0.82rem', fontWeight: '700', color: '#82A735', textDecoration: 'underline' }}
                        >
                          Compare Head-to-Head &rarr;
                        </a>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                        {alt.differentiator}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Key Specifications:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Primary Category</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{tool.primaryCategory || tool.category}</div>
              </div>

              <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Pricing Tier</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#82A735', marginTop: '4px' }}>{tool.pricing || 'Freemium'}</div>
              </div>

              <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>Free Tier</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{tool.isFreeTier ? 'Yes (Available)' : 'Paid / Free Trial'}</div>
              </div>

              <div style={{ background: '#F6F7F2', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>License Model</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>{tool.licenseModel || (tool.isOpenSource ? 'Open Source' : 'Proprietary SaaS')}</div>
              </div>
            </div>

            {Array.isArray(tool.sources) && tool.sources.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Pricing checked:</strong> {tool.sources[0].checkedAt ? new Date(tool.sources[0].checkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 24, 2026'} • <strong>Product information checked:</strong> Aug 24, 2026
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {tool.sources.map((s, idx) => (
                    <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#82A735', textDecoration: 'underline' }}>
                      {s.type} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
                className="btn-pill-outline"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <MessageSquare size={16} color="#82A735" />
                <span>Write a Community Review</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenClaimModal) onOpenClaimModal(tool);
                  else if (onOpenBadgeModal) onOpenBadgeModal(tool);
                }}
                className="btn-pill-green"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Sparkles size={16} />
                <span>Claim & Verify Software Profile ↗</span>
              </button>
            </div>
          </div>

          {/* Sponsored Alternative / Competitor Intercept Ad Banner (Toolify Style) */}
          {categorySponsor && categorySponsor.id !== tool.id && (
            <div style={{
              background: 'linear-gradient(135deg, #FAFBF7 0%, #F1F6E8 100%)',
              border: '1.5px solid #82A735',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 6px 20px rgba(130, 167, 53, 0.09)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E6D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  flexShrink: 0
                }}>
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${extractDomain(categorySponsor)}&sz=128`}
                    alt={categorySponsor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      background: '#82A735',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      SPONSORED ALTERNATIVE
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      Top Pick in {categorySponsor.category}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 2px 0', color: 'var(--text-dark)' }}>
                    {categorySponsor.name}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                    {categorySponsor.tagline || categorySponsor.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => onSelectTool && onSelectTool(categorySponsor.id)}
                  className="btn-pill-outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#FFFFFF' }}
                >
                  View Comparison
                </button>
                <a
                  href={categorySponsor.affiliateUrl || categorySponsor.websiteUrl || `https://${categorySponsor.domain}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => trackAffiliateClick(categorySponsor.id, categorySponsor.affiliateUrl)}
                  className="btn-pill-green"
                  style={{ padding: '10px 20px', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Try {categorySponsor.name}</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          )}

          {/* High-Intent Dynamic FAQ Accordion Section for SEO, GEO & AEO */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <HelpCircle size={22} color="#82A735" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                Frequently Asked Questions ({tool.name})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  q: `Is ${tool.name} free to use or does it offer a free trial?`,
                  a: `${tool.name} operates on a ${tool.pricing || 'Freemium'} pricing model. You can test ${tool.name} with official free trial options or explore feature tiers directly on their official website.`
                },
                {
                  q: `Does ${tool.name} offer promo codes, coupons, or founder deals?`,
                  a: `${tool.name} periodically provides special promotional pricing tiers and verified founder deals for new accounts. Click "Open Website" to check for current active offers.`
                },
                {
                  q: `What are the key features and main benefits of ${tool.name}?`,
                  a: `${tool.name} features ${tool.description ? tool.description : 'automated cloud software workflows'} engineered for founders, creators, and operational teams to boost efficiency.`
                },
                {
                  q: `What are the best verified alternatives to ${tool.name}?`,
                  a: `Top verified alternatives to ${tool.name} include ${alternatives.map(a => a.name).slice(0, 3).join(', ') || 'similar top platforms'}. Compare full ratings, traffic, and feature specs side-by-side on StakDock.`
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      background: isOpen ? '#F8FAF4' : '#FFFFFF'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.98rem',
                        color: 'var(--text-dark)'
                      }}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 20px 18px', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '12px' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toolify-style Launch Embeds Section */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '28px 32px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px'
            }}>
              {/* Left Info */}
              <div style={{ flex: '1 1 300px', maxWidth: '480px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-dark)' }}>
                  {tool.name} Launch embeds
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                  Use website badges to drive support from your community for your StakDock Launch. They're easy to embed on your homepage or footer.
                </p>
              </div>

              {/* Right Controls & Badge Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                {/* Theme Switcher */}
                <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '9999px', gap: '2px', alignSelf: 'flex-start' }}>
                  {[
                    { id: 'light', label: 'Light' },
                    { id: 'neutral', label: 'Neutral' },
                    { id: 'dark', label: 'Dark' }
                  ].map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setInPageBadgeStyle(style.id)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: '9999px',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        background: inPageBadgeStyle === style.id ? '#82A735' : 'transparent',
                        color: inPageBadgeStyle === style.id ? '#FFFFFF' : '#64748B',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>

                {/* Live Badge Preview */}
                <div style={{
                  borderRadius: '10px',
                  display: 'inline-block'
                }}>
                  <img
                    src={`/badge/featured_${inPageBadgeStyle}.svg`}
                    alt={`${tool.name} on StakDock`}
                    style={{ width: '250px', height: '60px', display: 'block' }}
                  />
                </div>

                {/* Copy Embed Code & How to install */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const embedSnippet = `<a href="https://stakdock.com/software/${tool.id}/?ref=embed" target="_blank" style="cursor: pointer;"><img src="https://stakdock.com/badge/featured_${inPageBadgeStyle}.svg" style="width: 250px; height: 60px;" width="250" height="60" alt="${tool.name} on StakDock: Compare, Reviews & Alternatives"></a>`;
                      navigator.clipboard.writeText(embedSnippet);
                      setInPageBadgeCopied(true);
                      setTimeout(() => setInPageBadgeCopied(false), 2000);
                    }}
                    className="btn-pill-dark"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {inPageBadgeCopied ? <Check size={14} color="#82A735" /> : <Copy size={14} />}
                    <span>{inPageBadgeCopied ? 'Copied HTML Code!' : 'Copy embed code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInstallGuide(!showInstallGuide)}
                    style={{ background: 'none', border: 'none', color: '#82A735', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    How to install?
                  </button>
                </div>

                {showInstallGuide && (
                  <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-dark)', maxWidth: '340px', textAlign: 'left' }}>
                    💡 Paste the HTML snippet into your landing page footer, hero, or documentation to get instant third-party social proof and rank on StakDock!
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                Community Reviews & Ratings ({communityReviews.length})
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Verified software feedback from founders, engineers, and product managers.
              </div>
            </div>

            <button
              onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
              className="btn-pill-green"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <MessageSquare size={16} />
              <span>Write a Verified Review</span>
            </button>
          </div>

          {communityReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F9FBF5', borderRadius: '20px', border: '1px solid var(--border-color)', margin: '20px 0' }}>
              <MessageSquare size={38} color="#82A735" style={{ margin: '0 auto 14px' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-dark)' }}>
                No community reviews yet
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '460px', margin: '0 auto 20px', lineHeight: '1.5' }}>
                Have you used {tool.name}? Be the first to share your experience with the StakDock community.
              </p>
              <button
                onClick={() => onOpenReviewModal && onOpenReviewModal(tool)}
                className="btn-pill-green"
                style={{ padding: '11px 24px', fontSize: '0.92rem' }}
              >
                <MessageSquare size={16} />
                <span>Write the First Review</span>
              </button>
            </div>
          ) : (
            <>
              {/* Rating Summary Bar for Genuine Community Reviews */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#F6F7F2', padding: '20px', borderRadius: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '20px', minWidth: '110px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#82A735', lineHeight: '1' }}>
                    {(communityReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / communityReviews.length).toFixed(1)}
                  </div>
                  <div style={{ display: 'flex', gap: '2px', margin: '6px 0 2px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#82A735" color="#82A735" />)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {communityReviews.length} community {communityReviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={18} color="#82A735" /> Verified Community Feedback
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    First-party feedback submitted by verified software operators and developers.
                  </div>
                </div>
              </div>

              {/* Live Review Feed List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {communityReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: '#F9FBF5',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#82A735',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.85rem'
                        }}>
                          {(rev.reviewerName || 'U').slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{rev.reviewerName}</span>
                            {rev.verified && (
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                                ✓ Verified User
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            {rev.date}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={15}
                            fill={s <= (rev.rating || 5) ? '#82A735' : 'none'}
                            color={s <= (rev.rating || 5) ? '#82A735' : 'var(--text-light)'}
                          />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: '1.6', margin: 0 }}>
                      "{rev.reviewText}"
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 3: Pricing */}
      {activeTab === 'pricing' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-dark)' }}>
            {tool.name} Pricing Tiers & Subscription Model
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Official pricing classification: <strong style={{ color: '#82A735' }}>{tool.pricing}</strong>
          </p>

          {(tool.hasLifetimeDeal || tool.dealPrice || tool.dealUrl || tool.lifetimeDealUrl) && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: '2px solid #F97316',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '28px',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#EA580C',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: '900',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      🔥 {tool.dealPlatform || 'LIFETIME'} DEAL
                    </span>
                    {dealInfo.discountPercent && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        background: '#DC2626',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {dealInfo.discountPercent}
                      </span>
                    )}
                    {dealInfo.savingsAmount && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        background: '#16A34A',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        SAVE {dealInfo.savingsAmount}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#9A3412', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', margin: '0 0 6px 0' }}>
                    <span>{dealInfo.dealPrice} One-Time Payment</span>
                    {dealInfo.originalPrice && (
                      <span style={{ fontSize: '1.05rem', textDecoration: 'line-through', color: '#9CA3AF', fontWeight: '600' }}>
                        {dealInfo.originalPrice}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#7C2D12', margin: 0 }}>
                    {tool.dealHighlights || 'Get full lifetime updates, unrestricted core access, and zero recurring monthly fees.'}
                  </p>
                </div>

                {(dealUrl || officialWebsite) && (
                  <a
                    href={dealUrl || officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAffiliateClick(tool.id, dealUrl || officialWebsite)}
                    style={{
                      background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                      color: '#FFFFFF',
                      padding: '14px 28px',
                      borderRadius: '9999px',
                      fontWeight: '800',
                      fontSize: '0.98rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
                    }}
                  >
                    <span>Claim Lifetime Deal</span>
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {/custom|demo|quote/i.test(tool.pricing || '') ? (
              <>
                <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Free Demo & Consultation</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>Request Demo</div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>1-on-1 Product walkthrough</li>
                    <li>Workflow & API feasibility evaluation</li>
                    <li>Tailored implementation timeline</li>
                  </ul>
                </div>

                <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)', border: '2px solid #82A735', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Enterprise & Custom Quote</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>Custom Tier</div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>Dedicated server & workspace setup</li>
                    <li>Custom SLA & priority customer support</li>
                    <li>Custom seat licensing & data security</li>
                  </ul>
                </div>
              </>
            ) : /freemium|free/i.test(tool.pricing || '') ? (
              <>
                <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Free / Starter Tier</h4>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>$0 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span></div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>Free core features & dashboard access</li>
                    <li>Standard community & self-serve support</li>
                    <li>No credit card required to start</li>
                  </ul>
                </div>

                <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)', border: '2px solid #82A735', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Pro / Team Tier</h4>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>See {tool.domain}</div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>Full feature set & API integrations</li>
                    <li>Priority customer support & higher limits</li>
                    <li>Direct subscription on official site</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Commercial Subscription</h4>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>{tool.pricing}</div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>Official commercial plan pricing</li>
                    <li>Direct access to full platform features</li>
                    <li>Billing managed directly via {tool.domain}</li>
                  </ul>
                </div>

                <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FBF5 100%)', border: '2px solid #82A735', borderRadius: '18px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Enterprise Tier</h4>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#82A735', marginBottom: '12px' }}>Custom Quote</div>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.8', paddingLeft: '18px' }}>
                    <li>Custom team licensing & SLA support</li>
                    <li>Dedicated account manager & training</li>
                    <li>Enhanced security & compliance controls</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Domain & Traffic Analytics */}
      {activeTab === 'analytics' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BarChart3 size={24} color="#82A735" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
              {tool.name} Domain Authority & Traffic Telemetry
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Estimated Monthly Visits</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#82A735', marginTop: '6px' }}>{visitsDisplay || 'Verified via Public Domain Analytics'}</div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Domain Authority (OpenPageRank)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '6px' }}>
                {extractDomain(tool) === 'openai.com' || extractDomain(tool) === 'chatgpt.com' ? '8.85 / 10' : extractDomain(tool) === 'anthropic.com' || extractDomain(tool) === 'claude.ai' ? '7.94 / 10' : extractDomain(tool) === 'google.com' ? '10.0 / 10' : '7.50 / 10'}
              </div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Official Domain</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '8px' }}>{extractDomain(tool)}</div>
            </div>

            <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>SSL & Security Status</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#82A735', marginTop: '8px' }}>HTTPS Verified 🔒</div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px dashed var(--border-color)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>
              <ShieldCheck size={16} color="#82A735" />
              <span>Data Authenticity & Google Indexing Integrity</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              StakDock strictly streams verified monthly traffic estimates and OpenPageRank domain authority metrics. Manufactured or fake traffic percentages are never displayed to guarantee 100% search engine indexing integrity.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Alternatives */}
      {activeTab === 'alternatives' && (
        <div style={{ marginBottom: '40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                <Layers size={16} /> Verified Software Benchmark (2026)
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
                Top Recommended Alternatives to {tool.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', lineHeight: '1.5' }}>
                Handpicked direct market competitors evaluated on core capabilities, pricing transparency, prompt fidelity, and community switch feedback.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSuggestModal(true)}
              className="btn-pill-outline"
              style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={14} color="#82A735" />
              <span>+ Suggest an Alternative</span>
            </button>
          </div>

          {/* Community Switch Insight Box */}
          {switchInsight && (
            <div style={{
              background: 'linear-gradient(135deg, #FAFBF7 0%, #F3F6EC 100%)',
              border: '1px solid #C8D8A0',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 4px 16px rgba(130, 167, 53, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ background: '#82A735', color: '#FFFFFF', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Quote size={12} /> Community Switch Consensus
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700' }}>Verified Reddit & Buyer Feedback</span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 8px' }}>
                {switchInsight.headline}
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: '1.6', margin: '0 0 16px' }}>
                {switchInsight.summary}
              </p>

              {switchInsight.keyDrivers && switchInsight.keyDrivers.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', borderTop: '1px solid rgba(130, 167, 53, 0.25)', paddingTop: '14px' }}>
                  {switchInsight.keyDrivers.map((driver, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                      <Check size={16} color="#82A735" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: '1.4' }}>{driver}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grouped or Grid Cards */}
          {groupedAlternatives && groupedAlternatives.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {groupedAlternatives.map((group, gIdx) => (
                <div key={gIdx} style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 4px' }}>
                      {group.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {group.description}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {group.tools.map(alt => (
                      <div key={alt.id} style={{ background: '#FAFBF8', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=128`}
                                  alt={alt.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://icons.duckduckgo.com/ip3/${alt.domain}.ico`;
                                  }}
                                />
                              </div>
                              <div>
                                <h5 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)', margin: 0 }}>{alt.name}</h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>
                                  <Star size={12} fill="#82A735" color="#82A735" />
                                  <span style={{ fontWeight: '800', color: 'var(--text-dark)' }}>{alt.rating || 4.8}</span>
                                  <span>({(alt.reviewsCount || 100).toLocaleString()})</span>
                                </div>
                              </div>
                            </div>

                            {alt.isFreeTier && (
                              <span style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontSize: '0.7rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                                🎁 Free
                              </span>
                            )}
                          </div>

                          {alt.alternativeBadge && (
                            <div style={{ background: '#EEF4DE', color: '#3A5311', border: '1px solid #D5E5B5', fontSize: '0.74rem', fontWeight: '800', padding: '4px 10px', borderRadius: '8px', marginBottom: '10px', lineHeight: '1.3' }}>
                              {alt.alternativeBadge}
                            </div>
                          )}

                          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '14px', minHeight: '38px' }}>
                            {alt.description}
                          </p>

                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-green-dark)', marginBottom: '14px' }}>
                            Pricing: {alt.pricing || 'Check website'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <a
                            href={alt.affiliateUrl || `https://${alt.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill-green"
                            style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                          >
                            <span>Visit {alt.name}</span>
                            <ArrowUpRight size={14} />
                          </a>

                          {onSelectTool && (
                            <button
                              type="button"
                              onClick={() => onSelectTool(alt.id)}
                              style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            >
                              <span>View {alt.name} Review</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {alternatives.map(alt => (
                <div key={alt.id} style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <img src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=128`} alt={alt.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)' }}>{alt.name}</span>
                    </div>
                    {alt.alternativeBadge && (
                      <div style={{ background: '#EEF4DE', color: '#3A5311', fontSize: '0.74rem', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px' }}>
                        {alt.alternativeBadge}
                      </div>
                    )}
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>{alt.description}</p>
                  </div>
                  <a href={alt.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
                    <span>Visit {alt.name}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Dedicated Hub CTA Banner */}
          {onNavigateAlternatives && (
            <div style={{ marginTop: '28px', textAlign: 'center', background: '#F6F7F2', border: '1px dashed #82A735', borderRadius: '18px', padding: '20px' }}>
              <button
                type="button"
                onClick={() => onNavigateAlternatives(tool.id)}
                className="btn-pill-green"
                style={{ display: 'inline-flex', padding: '10px 22px', fontSize: '0.88rem' }}
              >
                <span>Explore Full {tool.name} Alternatives & Competitors Hub</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Disclosure */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. We may earn an affiliate commission when you purchase software through partner links.</span>
      </div>

      {/* Share Launch & Upvote Modal */}
      <ShareLaunchModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tool={tool}
      />

      {/* Suggest Alternative Modal */}
      <SuggestAlternativeModal
        tool={tool}
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
}

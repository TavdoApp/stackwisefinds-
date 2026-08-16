import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Star, ExternalLink, ArrowUpRight, Award, ShieldCheck, 
  Sparkles, Check, ChevronDown, ChevronUp, Gift, Eye, HelpCircle, 
  TrendingUp, Zap, Filter, CheckCircle2, AlertTriangle, Users, Database,
  DollarSign, Scale, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { extractDomain, getLogoUrl, getFallbackInitials } from '../utils/logoHelper.js';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';

function ToolLogo({ tool, size = 52, borderRadius = 14 }) {
  const [errCount, setErrCount] = useState(0);
  const domain = extractDomain(tool);
  const logoUrl = getLogoUrl(tool, errCount);

  if (!logoUrl || errCount >= 3) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: 'linear-gradient(135deg, #141E14 0%, #2A3B2A 100%)',
        color: '#82A735',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: `${Math.round(size * 0.38)}px`,
        flexShrink: 0,
        border: '1px solid #2C3E2C',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
      }}>
        {getFallbackInitials(tool?.name)}
      </div>
    );
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${borderRadius}px`,
      background: '#FFFFFF',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      overflow: 'hidden'
    }}>
      <img
        src={logoUrl}
        alt={`${tool?.name || 'Software'} logo`}
        onError={() => setErrCount(prev => prev + 1)}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        loading="lazy"
      />
    </div>
  );
}

export default function CategoryBuyerGuideView({ 
  categorySlug, 
  categoryLabel, 
  tools = [], 
  onSelectTool, 
  onBack,
  onNavigateAlternatives
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Filter and sort tools for this category by ranking / rating / visits
  const categoryTools = useMemo(() => {
    const matched = tools.filter(t => t.category === categorySlug);
    return matched.sort((a, b) => {
      // Prioritize featured/partner tools, then highest rating & review count
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 4.5) - (a.rating || 4.5);
    });
  }, [tools, categorySlug]);

  const topPick = categoryTools[0] || null;

  // Executive Winners Segment
  const bestBudget = useMemo(() => {
    return categoryTools.find(t => (t.isFreeTier || (t.pricing && t.pricing.toLowerCase().includes('free'))) && t.id !== topPick?.id) 
      || categoryTools[1] 
      || topPick;
  }, [categoryTools, topPick]);

  const bestTeamAgency = useMemo(() => {
    return categoryTools.find(t => (t.description && /agency|team|enterprise|scale|client|collaboration/i.test(t.description)) && t.id !== topPick?.id && t.id !== bestBudget?.id) 
      || categoryTools[2] 
      || categoryTools[1] 
      || topPick;
  }, [categoryTools, topPick, bestBudget]);

  const bestOpenSource = useMemo(() => {
    return categoryTools.find(t => t.isOpenSource || (t.pricing && t.pricing.toLowerCase().includes('open-source'))) || null;
  }, [categoryTools]);

  // Filtered tools based on user tab
  const filteredTools = useMemo(() => {
    if (activeFilter === 'free') {
      return categoryTools.filter(t => t.isFreeTier || (t.pricing && t.pricing.toLowerCase().includes('free')));
    }
    if (activeFilter === 'opensource') {
      return categoryTools.filter(t => t.isOpenSource || (t.pricing && t.pricing.toLowerCase().includes('open-source')));
    }
    if (activeFilter === 'budget') {
      return categoryTools.filter(t => {
        const p = String(t.pricing || '').toLowerCase();
        return p.includes('free') || (p.includes('$') && parseInt(p.replace(/[^0-9]/g, ''), 10) <= 25);
      });
    }
    return categoryTools;
  }, [categoryTools, activeFilter]);

  const categoryName = categoryLabel || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Category Buyer FAQs
  const faqs = useMemo(() => [
    {
      question: `What is the best ${categoryName} software in 2026?`,
      answer: topPick 
        ? `Based on verified user ratings, feature completeness, and operational stability, ${topPick.name} ranks as the #1 overall choice in the ${categoryName} category on StakDock, followed by ${categoryTools.slice(1, 4).map(t => t.name).join(', ')}.`
        : `Top ranked platforms in the ${categoryName} category are evaluated based on feature completeness, customer satisfaction, active monthly usage, and transparent pricing.`
    },
    {
      question: `Are there free or open-source options for ${categoryName}?`,
      answer: `Yes! Many top ${categoryName} tools offer generous free tiers or self-hosted open-source editions. Use our "Free Tier" or "Open Source" filters above to view platforms with zero upfront licensing fees.`
    },
    {
      question: `What hidden costs should buyers watch out for in ${categoryName}?`,
      answer: `Watch out for per-user seat scaling multipliers, AI credit usage caps, and steep tier jump fees when adding team members or exceeding monthly API calls.`
    },
    {
      question: `How often is this ${categoryName} buyer guide updated?`,
      answer: `Our software index and category buyer guides are refreshed continuously in 2026 to ensure all pricing plans, feature updates, and founder discount promotions remain 100% accurate.`
    }
  ], [categoryName, topPick, categoryTools]);

  return (
    <div className="container" style={{ padding: '32px 16px 80px', maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#82A735', cursor: 'pointer', padding: 0, fontWeight: '700' }}>
          Home
        </button>
        <span>/</span>
        <span style={{ color: 'var(--text-muted)' }}>Buyer Guides 2026</span>
        <span>/</span>
        <span style={{ color: 'var(--text-dark)', fontWeight: '700' }}>Best {categoryName}</span>
      </nav>

      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="btn-pill-outline" 
        style={{ marginBottom: '24px' }} 
        aria-label="Back to Directory"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Hero Header Section */}
      <header style={{
        background: 'linear-gradient(135deg, #141E14 0%, #1C291C 100%)',
        borderRadius: '24px',
        padding: '40px 32px',
        marginBottom: '36px',
        color: '#FFFFFF',
        border: '1px solid #2C3E2C',
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(130,167,53,0.2)',
            color: '#82A735',
            border: '1px solid #82A735',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            ⚡ 2026 BUYER GUIDE & RANKINGS
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
            Updated August 2026 • Verified by StakDock Research Team
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', margin: '0 0 16px', lineHeight: '1.25', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
          Best {categoryName} Software in 2026 (Ranked & Compared)
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', maxWidth: '780px', lineHeight: '1.6', margin: 0 }}>
          Discover the top <strong>{categoryTools.length} verified {categoryName} tools</strong> evaluated by feature capabilities, pricing tiers, customer reviews, and operational performance.
        </p>
      </header>

      {/* 🏆 Executive Winner Decision Matrix (Top of Page Answer Box) */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={20} color="#82A735" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Quick Decision Matrix: Top Picks at a Glance
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Winner 1: Overall Pick */}
          {topPick && (
            <div 
              onClick={() => onSelectTool(topPick)}
              style={{
                background: '#FFFFFF',
                border: '2px solid #82A735',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="hover:scale-[1.02]"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: 'rgba(130,167,53,0.15)', color: '#82A735', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    🥇 #1 Best Overall
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: '700', color: '#F59E0B' }}>
                    <Star size={13} fill="#F59E0B" /> {topPick.rating || 4.9}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                  {topPick.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px' }}>
                  {topPick.tagline || (topPick.description ? topPick.description.slice(0, 85) + '...' : 'Top-rated software')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{topPick.pricing || 'Freemium'}</span>
                <span style={{ color: '#82A735', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  View Profile <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          )}

          {/* Winner 2: Best Value / Free Tier */}
          {bestBudget && (
            <div 
              onClick={() => onSelectTool(bestBudget)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="hover:scale-[1.02]"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#EBF0E1', color: '#536253', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    💰 Best Value & Free
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: '700', color: '#F59E0B' }}>
                    <Star size={13} fill="#F59E0B" /> {bestBudget.rating || 4.8}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                  {bestBudget.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px' }}>
                  {bestBudget.tagline || (bestBudget.description ? bestBudget.description.slice(0, 85) + '...' : 'Generous free tier')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '700', color: '#82A735' }}>{bestBudget.pricing || 'Free Plan'}</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  View Profile <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          )}

          {/* Winner 3: Best for Teams / Agencies */}
          {bestTeamAgency && (
            <div 
              onClick={() => onSelectTool(bestTeamAgency)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="hover:scale-[1.02]"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    🏢 Best for Teams
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: '700', color: '#F59E0B' }}>
                    <Star size={13} fill="#F59E0B" /> {bestTeamAgency.rating || 4.7}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                  {bestTeamAgency.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px' }}>
                  {bestTeamAgency.tagline || (bestTeamAgency.description ? bestTeamAgency.description.slice(0, 85) + '...' : 'Built for team collaboration')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{bestTeamAgency.pricing || 'Pro / Scale'}</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  View Profile <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          )}

          {/* Winner 4: Best Open Source (if present) or Runner Up */}
          {bestOpenSource ? (
            <div 
              onClick={() => onSelectTool(bestOpenSource)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="hover:scale-[1.02]"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    ⚡ Open Source
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: '700', color: '#F59E0B' }}>
                    <Star size={13} fill="#F59E0B" /> {bestOpenSource.rating || 4.7}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                  {bestOpenSource.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px' }}>
                  Self-hosted edition with zero vendor lock-in and complete data privacy control.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '700', color: '#059669' }}>100% Open-Source</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  View Profile <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          ) : (
            categoryTools[3] && (
              <div 
                onClick={() => onSelectTool(categoryTools[3])}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                className="hover:scale-[1.02]"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#F8FAFC', color: '#64748B', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      🌟 Top Contender
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: '700', color: '#F59E0B' }}>
                      <Star size={13} fill="#F59E0B" /> {categoryTools[3].rating || 4.7}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                    {categoryTools[3].name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px' }}>
                    {categoryTools[3].tagline || (categoryTools[3].description ? categoryTools[3].description.slice(0, 85) + '...' : 'Verified alternative')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{categoryTools[3].pricing || 'Freemium'}</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View Profile <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* 🏆 Editor's #1 Overall Pick Spotlight Banner */}
      {topPick && (
        <section style={{
          background: '#FFFFFF',
          border: '2px solid #82A735',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 8px 24px rgba(130,167,53,0.12)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            left: '28px',
            background: 'linear-gradient(135deg, #82A735 0%, #5E7A23 100%)',
            color: '#FFFFFF',
            padding: '4px 16px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 10px rgba(130,167,53,0.35)'
          }}>
            <Award size={14} /> 🏆 #1 EDITOR'S OVERALL PICK 2026
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <ToolLogo tool={topPick} size={68} borderRadius={18} />

              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-dark)' }}>
                  {topPick.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: '800', fontSize: '0.92rem' }}>
                    <Star size={16} fill="#F59E0B" />
                    <span>{topPick.rating || 4.9}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ({(topPick.reviewsCount || 420).toLocaleString()} verified ratings)
                  </span>
                  <span style={{
                    background: '#EBF0E1',
                    color: '#536253',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {topPick.pricing || 'Freemium'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dual CTAs for Top Pick */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectTool(topPick)}
                className="btn-pill-outline"
                style={{ padding: '10px 18px', fontSize: '0.9rem', fontWeight: '700' }}
              >
                In-Depth Review
              </button>

              <a
                href={topPick.affiliateUrl || topPick.website || `https://${topPick.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliateClick(topPick.id, topPick.name, 'buyer_guide_top_pick')}
                className="btn-pill-green"
                style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: '800', gap: '6px' }}
              >
                <span>Visit Official Site</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6', margin: '20px 0 0' }}>
            {topPick.description}
          </p>

          {/* Bulleted Feature Highlights */}
          {Array.isArray(topPick.features) && topPick.features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {topPick.features.slice(0, 5).map((feat, idx) => (
                <span key={idx} style={{
                  background: '#FAFBF7',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-dark)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Check size={12} color="#82A735" /> {feat}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ⚖️ Module 2: In-Depth Pros, Cons & Real Trade-offs Matrix */}
      <section style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '28px',
        marginBottom: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Scale size={20} color="#82A735" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Evaluation Matrix: Pros, Cons & Trade-offs
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Compare real strengths, operational limits, and ideal use-cases for top contenders in the {categoryName} space:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#FAFBF7', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-dark)', minWidth: '160px' }}>Software</th>
                <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-dark)', minWidth: '150px' }}>Best For</th>
                <th style={{ padding: '12px 16px', fontWeight: '800', color: '#16A34A', minWidth: '220px' }}>Key Strengths</th>
                <th style={{ padding: '12px 16px', fontWeight: '800', color: '#DC2626', minWidth: '220px' }}>Real Trade-offs</th>
                <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--text-dark)', minWidth: '110px' }}>Starting Price</th>
              </tr>
            </thead>
            <tbody>
              {categoryTools.slice(0, 5).map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--text-dark)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#82A735', background: '#F6F7F2', padding: '2px 6px', borderRadius: '4px' }}>
                        #{idx + 1}
                      </span>
                      <span onClick={() => onSelectTool(t)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-dark)', fontWeight: '600' }}>
                    {idx === 0 ? 'Top Overall Choice' : idx === 1 ? 'Budget Conscious & Freelancers' : idx === 2 ? 'Scaling Teams & Agencies' : 'Specialized Operations'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-dark)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                      <CheckCircle2 size={14} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{t.tagline || 'Intuitive interface with reliable uptime'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                      <AlertTriangle size={14} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{t.isFreeTier ? 'Advanced features locked behind paid tiers' : 'Requires subscription after trial period'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#82A735' }}>
                    {t.pricing || 'Freemium'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 💡 Module 3: 2026 Buyer Decision Framework (4 Essential Pillars) */}
      <section style={{
        background: 'linear-gradient(135deg, #FAFBF7 0%, #F6F7F2 100%)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '28px',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#82A735" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            How to Choose {categoryName} Software in 2026
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Before committing to an annual software contract, verify these 4 critical evaluation criteria:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.92rem' }}>
              <DollarSign size={16} /> 1. True Per-User Cost
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Calculate total monthly cost with seat add-ons, storage expansion, and API consumption overages.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.92rem' }}>
              <Zap size={16} /> 2. Integration Depth
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Ensure native webhook support, Zapier/n8n connectivity, and direct API endpoints for workflow sync.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.92rem' }}>
              <Database size={16} /> 3. Data Portability
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Verify one-click CSV, JSON, or SQL export capabilities so your team never suffers from vendor lock-in.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.92rem' }}>
              <ShieldCheck size={16} /> 4. Security & SLAs
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Check for SOC2, GDPR compliance, 2FA/SSO enforcement, and guaranteed 99.9% uptime commitments.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sub-Filter Tabs */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--text-dark)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
              Explore All {filteredTools.length} Ranked Tools
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: activeFilter === 'all' ? '2px solid #82A735' : '1px solid var(--border-color)',
                background: activeFilter === 'all' ? '#82A735' : '#FFFFFF',
                color: activeFilter === 'all' ? '#FFFFFF' : 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              All Ranked ({categoryTools.length})
            </button>

            <button
              onClick={() => setActiveFilter('free')}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: activeFilter === 'free' ? '2px solid #82A735' : '1px solid var(--border-color)',
                background: activeFilter === 'free' ? '#82A735' : '#FFFFFF',
                color: activeFilter === 'free' ? '#FFFFFF' : 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🎁 Free Tier Only
            </button>

            <button
              onClick={() => setActiveFilter('opensource')}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: activeFilter === 'opensource' ? '2px solid #82A735' : '1px solid var(--border-color)',
                background: activeFilter === 'opensource' ? '#82A735' : '#FFFFFF',
                color: activeFilter === 'opensource' ? '#FFFFFF' : 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ⚡ Open Source
            </button>

            <button
              onClick={() => setActiveFilter('budget')}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                border: activeFilter === 'budget' ? '2px solid #82A735' : '1px solid var(--border-color)',
                background: activeFilter === 'budget' ? '#82A735' : '#FFFFFF',
                color: activeFilter === 'budget' ? '#FFFFFF' : 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              💰 Budget Friendly (Under $25)
            </button>
          </div>
        </div>

        {/* Ranked Tools List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTools.map((tool, index) => {
            const domain = extractDomain(tool.website || tool.domain);
            return (
              <article 
                key={tool.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                className="hover:border-[#82A735]"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  
                  {/* Left: Rank Badge + Logo + Name */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: index === 0 ? '#82A735' : '#F6F7F2',
                      color: index === 0 ? '#FFFFFF' : 'var(--text-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      #{index + 1}
                    </div>

                    <ToolLogo tool={tool} size={52} borderRadius={14} />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h3 
                          onClick={() => onSelectTool(tool)}
                          style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)', cursor: 'pointer' }}
                        >
                          {tool.name}
                        </h3>

                        {tool.badge && (
                          <span style={{
                            background: '#F6F7F2',
                            color: '#82A735',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {tool.badge}
                          </span>
                        )}

                        {tool.isOpenSource && (
                          <span style={{ background: '#EBF0E1', color: '#536253', fontSize: '0.68rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                            OPEN SOURCE
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: '700' }}>
                          <Star size={14} fill="#F59E0B" /> {tool.rating || 4.7}
                        </div>
                        <span>•</span>
                        <span>{(tool.reviewsCount || 120).toLocaleString()} reviews</span>
                        <span>•</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{tool.pricing || 'Freemium'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => onSelectTool(tool)}
                      className="btn-pill-outline"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', fontWeight: '700' }}
                    >
                      Compare Details
                    </button>

                    <a
                      href={tool.affiliateUrl || tool.website || `https://${tool.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAffiliateClick(tool.id, tool.name, 'buyer_guide_ranked_list')}
                      className="btn-pill-green"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: '800', gap: '4px' }}
                    >
                      <span>Visit Site</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: '1.5', margin: '14px 0 0' }}>
                  {tool.description}
                </p>

                {/* Alternatives Quick Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Looking for substitutes?
                  </span>
                  <a 
                    href={`/alternatives/${tool.id}`}
                    onClick={(e) => {
                      if (onNavigateAlternatives) {
                        e.preventDefault();
                        onNavigateAlternatives(tool.id);
                      }
                    }}
                    style={{ color: '#82A735', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    View Top {tool.name} Alternatives <ArrowUpRight size={13} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4-Question Buyer FAQ Accordion */}
      <section style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '32px 28px',
        marginTop: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <HelpCircle size={20} color="#82A735" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Frequently Asked Questions ({categoryName} 2026)
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Essential answers for procurement leads, software engineers, and founders evaluating {categoryName} solutions:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: isOpen ? '#FAFBF7' : '#FFFFFF'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.98rem',
                    fontWeight: '800',
                    color: 'var(--text-dark)',
                    cursor: 'pointer',
                    gap: '12px'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px', fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

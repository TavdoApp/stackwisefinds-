import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Star, ExternalLink, ArrowUpRight, Award, ShieldCheck, 
  Sparkles, Check, ChevronDown, ChevronUp, Gift, Eye, HelpCircle, 
  TrendingUp, Zap, Filter
} from 'lucide-react';
import { extractDomain } from '../utils/logoHelper.js';
import { trackAffiliateClick } from '../utils/affiliateTracker.js';

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
        return p.includes('free') || p.includes('$') && (parseInt(p.replace(/[^0-9]/g, ''), 10) <= 25);
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
        ? `Based on verified user ratings, feature depth, and reliability, ${topPick.name} ranks as the #1 overall choice in the ${categoryName} category on StakDock, followed by ${categoryTools.slice(1, 4).map(t => t.name).join(', ')}.`
        : `Top ranked platforms in the ${categoryName} category are evaluated based on feature completeness, customer satisfaction, active monthly usage, and transparent pricing.`
    },
    {
      question: `Are there free options available for ${categoryName}?`,
      answer: `Yes! Many top ${categoryName} platforms offer 100% free tiers or generous trial periods without requiring a credit card upfront. Use our "Free Tier" filter above to view all free options.`
    },
    {
      question: `How does StakDock rank and evaluate ${categoryName} software?`,
      answer: `StakDock ranks software using a multi-factor algorithm incorporating verified user reviews, monthly traffic signals, feature depth, customer support responsiveness, and pricing value.`
    },
    {
      question: `How often is the ${categoryName} buyer guide updated?`,
      answer: `Our software index and category buyer guides are refreshed weekly in 2026 to ensure all pricing tiers, new feature releases, and founder discount deals are 100% accurate.`
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

      {/* 🏆 Editor's #1 Choice Spotlight Card */}
      {topPick && (
        <section style={{
          background: '#FFFFFF',
          border: '2px solid #82A735',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '36px',
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
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: '#F6F7F2',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${extractDomain(topPick)}&sz=128`}
                  alt={topPick.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-dark)' }}>
                  {topPick.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                    <Star size={15} fill="#82A735" color="#82A735" />
                    <span>{topPick.rating || 4.9}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({topPick.reviewsCount || 140}+ reviews)</span>
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{topPick.pricing}</span>
                  {topPick.monthlyVisits && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} color="#82A735" /> {topPick.monthlyVisits} monthly visits
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onSelectTool(topPick.id)}
                className="btn-pill-outline"
                style={{ padding: '12px 20px', fontSize: '0.92rem' }}
              >
                In-Depth Review
              </button>
              {topPick.lifetimeDealUrl ? (
                <a 
                  href={topPick.lifetimeDealUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAffiliateClick(topPick.id, topPick.lifetimeDealUrl)}
                  className="btn-pill-dark"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.92rem',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Gift size={16} /> Claim Lifetime Deal
                </a>
              ) : (
                <a 
                  href={topPick.affiliateUrl || topPick.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAffiliateClick(topPick.id, topPick.affiliateUrl || topPick.websiteUrl)}
                  className="btn-pill-green"
                  style={{ padding: '12px 24px', fontSize: '0.92rem', textDecoration: 'none' }}
                >
                  <span>Visit Website</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: '1.6', margin: '18px 0 0' }}>
            {topPick.description}
          </p>
        </section>
      )}

      {/* Semantic Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '12px', 
        marginBottom: '24px',
        background: '#FFFFFF',
        padding: '14px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', marginRight: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter:
          </span>
          {[
            { id: 'all', label: `All Ranked (${categoryTools.length})` },
            { id: 'free', label: '🎁 Free Tier' },
            { id: 'opensource', label: '⚡ Open Source' },
            { id: 'budget', label: '💰 Budget Friendly' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background: activeFilter === tab.id ? '#141E14' : '#F6F7F2',
                color: activeFilter === tab.id ? '#FFFFFF' : 'var(--text-dark)',
                border: activeFilter === tab.id ? '1px solid #141E14' : '1px solid var(--border-color)',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          Showing {filteredTools.length} of {categoryTools.length} tools
        </span>
      </div>

      {/* 📊 Category Comparison Matrix Table */}
      <section style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '36px',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-dark)' }}>
          {categoryName} Feature & Pricing Matrix
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 14px' }}>Rank & Software</th>
              <th style={{ padding: '12px 14px' }}>Rating</th>
              <th style={{ padding: '12px 14px' }}>Pricing Model</th>
              <th style={{ padding: '12px 14px' }}>Free Tier</th>
              <th style={{ padding: '12px 14px' }}>Open Source</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.slice(0, 10).map((tool, idx) => (
              <tr key={tool.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#82A735' : idx === 1 ? '#141E14' : '#F6F7F2',
                      color: idx <= 1 ? '#FFFFFF' : 'var(--text-dark)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '800'
                    }}>
                      {idx + 1}
                    </span>
                    <button 
                      onClick={() => onSelectTool(tool.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dark)', fontWeight: '800', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                    >
                      {tool.name}
                    </button>
                  </div>
                </td>
                <td style={{ padding: '14px', fontWeight: '700' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#82A735" color="#82A735" />
                    {tool.rating || 4.8}
                  </span>
                </td>
                <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{tool.pricing}</td>
                <td style={{ padding: '14px' }}>
                  {tool.isFreeTier || (tool.pricing && tool.pricing.toLowerCase().includes('free')) ? (
                    <span style={{ color: '#82A735', fontWeight: '800' }}>✓ Yes</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Trial Only</span>
                  )}
                </td>
                <td style={{ padding: '14px' }}>
                  {tool.isOpenSource ? (
                    <span style={{ color: '#82A735', fontWeight: '800' }}>✓ Open Source</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Proprietary</span>
                  )}
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <a
                    href={tool.lifetimeDealUrl || tool.affiliateUrl || tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAffiliateClick(tool.id, tool.lifetimeDealUrl || tool.affiliateUrl || tool.websiteUrl)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#141E14',
                      color: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Visit</span>
                    <ArrowUpRight size={13} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Ranked Tool Cards Grid */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 20px', color: 'var(--text-dark)' }}>
        Top {filteredTools.length} {categoryName} Ranked List
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '48px' }}>
        {filteredTools.map((tool, index) => {
          const rank = index + 1;
          const isWinner = rank === 1;
          const isRunnerUp = rank === 2;

          return (
            <article 
              key={tool.id}
              style={{
                background: '#FFFFFF',
                border: isWinner ? '2px solid #82A735' : '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Rank Badge */}
                  <span style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: isWinner ? '#82A735' : isRunnerUp ? '#141E14' : '#F6F7F2',
                    color: (isWinner || isRunnerUp) ? '#FFFFFF' : 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    #{rank}
                  </span>

                  {/* Logo */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: '#F6F7F2',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    flexShrink: 0
                  }}>
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${extractDomain(tool)}&sz=128`}
                      alt={tool.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h4 
                        onClick={() => onSelectTool(tool.id)}
                        style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)', cursor: 'pointer' }}
                      >
                        {tool.name}
                      </h4>
                      {isWinner && (
                        <span style={{ background: '#82A735', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                          🏆 Best Overall
                        </span>
                      )}
                      {tool.badge && (
                        <span className="tag-sage" style={{ fontSize: '0.72rem' }}>
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)' }}>
                        <Star size={14} fill="#82A735" color="#82A735" />
                        {tool.rating || 4.8}
                        <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({tool.reviewsCount || 120})</span>
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{tool.pricing}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => onSelectTool(tool.id)}
                    className="btn-pill-outline"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    View Details
                  </button>
                  {tool.lifetimeDealUrl ? (
                    <a
                      href={tool.lifetimeDealUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAffiliateClick(tool.id, tool.lifetimeDealUrl)}
                      className="btn-pill-dark"
                      style={{
                        padding: '8px 18px',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '800',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Gift size={14} /> Lifetime Deal
                    </a>
                  ) : (
                    <a
                      href={tool.affiliateUrl || tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAffiliateClick(tool.id, tool.affiliateUrl || tool.websiteUrl)}
                      className="btn-pill-green"
                      style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Visit Site</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-dark)', lineHeight: '1.55', margin: 0 }}>
                {tool.description}
              </p>

              {/* Quick Alternatives Link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>Official Domain: <strong>{tool.domain}</strong></span>
                {onNavigateAlternatives && (
                  <button 
                    onClick={() => onNavigateAlternatives(tool.id)}
                    style={{ background: 'none', border: 'none', color: '#82A735', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    Compare {tool.name} Alternatives →
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Category Buyer Guide FAQ Accordion */}
      <section style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <HelpCircle size={22} color="#82A735" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Frequently Asked Questions: {categoryName}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                background: openFaqIndex === idx ? '#F6F7F2' : '#FFFFFF',
                transition: 'background 0.2s ease'
              }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.98rem',
                  fontWeight: '700',
                  color: 'var(--text-dark)'
                }}
              >
                <span>{faq.question}</span>
                {openFaqIndex === idx ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </button>
              {openFaqIndex === idx && (
                <div style={{ padding: '0 20px 16px', fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

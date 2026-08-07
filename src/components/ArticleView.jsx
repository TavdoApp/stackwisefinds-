import React from 'react';
import { ArrowLeft, Clock, User, Calendar, ShieldCheck, ExternalLink, Star, Award } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';

export default function ArticleView({ article, onBack }) {
  if (!article) return null;

  // Smart Contextual Tool Recommendation System
  const recommendedTools = (() => {
    if (!saasTools || saasTools.length === 0) return [];

    if (Array.isArray(article.recommendedToolIds) && article.recommendedToolIds.length > 0) {
      const explicit = saasTools.filter(t => article.recommendedToolIds.includes(t.id));
      if (explicit.length > 0) return explicit.slice(0, 4);
    }
    
    const textToMatch = `${article.title || ''} ${article.question || ''} ${article.summary || ''} ${article.category || ''}`.toLowerCase();
    
    // Alternatives Intent Check & Named Tool Exclusion
    const isAlternativesQuery = /alternative|alternatives|vs|instead of|replace|competitor/i.test(textToMatch);
    const excludedToolIds = new Set();

    if (isAlternativesQuery) {
      saasTools.forEach(t => {
        if (!t) return;
        const tName = (t.name || '').toLowerCase();
        const tId = (t.id || '').toLowerCase();
        if (tName.length >= 3 && textToMatch.includes(tName)) {
          excludedToolIds.add(t.id);
        } else if (tId.length >= 3 && textToMatch.includes(tId)) {
          excludedToolIds.add(t.id);
        }
      });
    }

    const isSecurityTopic = /security|cyber|identity|vulnerability|ssh|k8s|sast|dast|pam|threat|firewall|ids|siem|compliance/i.test(textToMatch);
    
    // Topic Flags
    const isBookingTopic = /booking|schedule|appointment|calendar|meeting/i.test(textToMatch);
    const isLeadGenTopic = /lead|leadgen|form|survey|funnel|capture|conversion|landing/i.test(textToMatch);
    const isPaymentTopic = /stripe|paypal|payment|checkout|subscription|billing|merchant|gateway/i.test(textToMatch);
    const isCrmTopic = /crm|sales pipeline|real estate|client management/i.test(textToMatch);
    const isOpenSourceTopic = /open-source|open-sourced|self-hosted/i.test(textToMatch);
    const isBuilderTopic = /lovable|builder|v0|bolt|no-code|nocode|web-builder/i.test(textToMatch);

    const keywordMatches = [];
    
    saasTools.forEach(t => {
      if (!t) return;
      const tName = (t.name || '').toLowerCase();
      const tId = (t.id || '').toLowerCase();
      const tCat = (t.category || '').toLowerCase();
      const tDesc = (t.description || '').toLowerCase();

      // Skip tools explicitly named as target to be replaced in an Alternatives article
      if (isAlternativesQuery && excludedToolIds.has(t.id)) {
        return;
      }

      // Filter out non-B2B payment niche tools like SplitMatePro from SaaS gateway recommendations
      if (isPaymentTopic && (tId === 'splitmatepro' || tDesc.includes('roommate') || tDesc.includes('tenant expense'))) {
        return;
      }

      // If NOT a security topic, skip specialized cybersecurity tools to prevent odd matches
      if (!isSecurityTopic && (tCat.includes('cybersecurity') || tCat.includes('security-passwords') || tId.includes('qualys') || tId.includes('caldera') || tId.includes('semgrep') || tId.includes('checkov') || tId.includes('kube'))) {
        return;
      }

      let score = 0;

      // Exact name/ID match (only if not an alternatives query for that specific tool)
      if (tName.length > 3 && textToMatch.includes(tName) && !isAlternativesQuery) score += 12;
      if (tId.length > 3 && textToMatch.includes(tId) && !isAlternativesQuery) score += 12;

      // Payments & Subscriptions
      if (isPaymentTopic) {
        if (['paddle', 'lemonsqueezy', 'chargebee', 'fastspring', 'recurly', 'adyen', 'stripe', 'paypal', '2checkout'].includes(tId)) {
          score += 15;
        } else if (tCat === 'invoicing' || tCat === 'finance-payments' || tCat === 'finance-accounting') {
          score += 6;
        }
      }

      // Booking & Scheduling
      if (isBookingTopic) {
        if (tId === 'cal-com' || tId === 'calendly' || tId === 'acuity-scheduling' || tId === 'tidycal' || tId.includes('schedule') || tName.includes('calendar') || tName.includes('booking')) {
          score += 15;
        } else if (tCat === 'meeting-ai' || tCat === 'forms-leadgen' || tCat === 'crm') {
          score += 8;
        }
      }

      // Lead Generation & Forms
      if (isLeadGenTopic) {
        if (tCat.includes('forms') || tCat.includes('leadgen') || tId.includes('form') || tId.includes('typeform') || tId.includes('tally')) score += 8;
      }

      // CRM & Sales
      if (isCrmTopic) {
        if (tCat.includes('crm') || tId.includes('crm') || tId.includes('hubspot') || tId.includes('zoho')) score += 8;
      }

      // Open Source / Self Hosted
      if (isOpenSourceTopic) {
        if (t.isOpenSource || tCat.includes('open-source') || tId.includes('n8n') || tId.includes('supabase') || tId.includes('postiz') || tId.includes('plausible')) score += 7;
      }

      // AI Builders
      if (isBuilderTopic) {
        if (tId.includes('lovable') || tId.includes('v0') || tId.includes('bolt') || tId.includes('replit') || tCat.includes('web') || tCat.includes('code')) score += 8;
      }

      if (textToMatch.includes('linktree') && (tId.includes('link') || tCat.includes('social') || tCat.includes('marketing'))) score += 5;
      if (textToMatch.includes('feedback') && (tName.includes('feedback') || tCat.includes('support') || tCat.includes('project'))) score += 5;
      if (textToMatch.includes('analytics') && tCat.includes('analytics')) score += 5;
      if (textToMatch.includes('database') && tCat.includes('database')) score += 5;

      if (score > 0) {
        keywordMatches.push({ tool: t, score });
      }
    });

    if (keywordMatches.length > 0) {
      keywordMatches.sort((a, b) => b.score - a.score);
      return keywordMatches.map(m => m.tool).slice(0, 3);
    }

    // High quality default fallback per topic type
    if (isPaymentTopic) {
      const paymentDefaults = saasTools.filter(t => ['paddle', 'lemonsqueezy', 'chargebee', 'fastspring', 'recurly'].includes(t.id) && !excludedToolIds.has(t.id));
      if (paymentDefaults.length > 0) return paymentDefaults.slice(0, 3);
    }

    if (isBookingTopic) {
      const bookingDefaults = saasTools.filter(t => ['typeform-forms', 'hubspot', 'xuscrm', 'fillout-forms', 'n8n'].includes(t.id) && !excludedToolIds.has(t.id));
      if (bookingDefaults.length > 0) return bookingDefaults.slice(0, 3);
    }

    const topFeaturedDefaults = ['cursor-ai', 'claude-ai', 'n8n', 'lovable', 'xuscrm', 'supabase', 'postiz'];
    const defaults = saasTools.filter(t => topFeaturedDefaults.includes(t.id) && !excludedToolIds.has(t.id));
    return defaults.length > 0 ? defaults.slice(0, 3) : saasTools.filter(t => !excludedToolIds.has(t.id)).slice(0, 3);
  })();

  const topWinner = recommendedTools.length > 0 ? recommendedTools[0] : null;

  // Format Date cleanly
  const formattedDate = (() => {
    if (article.publishDate) return article.publishDate;
    if (article.publishedAt) {
      try {
        const d = new Date(article.publishedAt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
      } catch {
        // fallback
      }
    }
    return 'August 7, 2026';
  })();

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '900px' }}>
      {/* Back Button */}
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Buyer Guides">
        <ArrowLeft size={16} /> Back to Buyer Guides
      </button>

      {/* Article Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '10px' }}>
          {(article.category || 'BUYER GUIDE').toUpperCase()} (2026)
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.15' }}>
          {article.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.88rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="#82A735" /> <span>{article.author || 'Ossama Tbili'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#82A735" /> <span>{formattedDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#82A735" /> <span>{article.readTime || '6 min read'}</span>
          </div>
        </div>
      </div>

      {/* Top Winner Quick Hero Banner */}
      {topWinner && (
        <div style={{
          background: 'var(--bg-sage)',
          border: '2px solid #82A735',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              flexShrink: 0
            }}>
              <img 
                src={`https://www.google.com/s2/favicons?domain=${topWinner.domain}&sz=128`} 
                alt={topWinner.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <Award size={14} /> #1 Top Overall Recommendation
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)' }}>{topWinner.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{topWinner.description}</p>
            </div>
          </div>

          <a 
            href={topWinner.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-pill-green"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <span>Visit {topWinner.name} ↗</span>
          </a>
        </div>
      )}

      {/* FTC Affiliate Disclaimer Box */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ShieldCheck size={20} color="#82A735" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          <strong>Transparency Disclosure:</strong> StakDock is reader-supported. When you purchase software through partner links on our site, we may earn an affiliate commission at zero extra cost to you.
        </p>
      </div>

      {/* Formatted Article Body */}
      {article.content && (
        <div 
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}

      {/* Render sections if present (e.g. from Reddit auto-published answers) */}
      {Array.isArray(article.sections) && article.sections.length > 0 && (
        <div className="article-body" style={{ marginTop: '24px' }}>
          {article.sections.map((sec, idx) => (
            <section key={idx} style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-dark)' }}>
                {sec.heading}
              </h3>
              <p style={{ fontSize: '0.98rem', lineHeight: '1.65', color: 'var(--text-muted)' }}>
                {sec.body}
              </p>
            </section>
          ))}

          {article.sourceUrl && (
            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <p><strong>Source and methodology:</strong> This buyer evaluation guide uses public community discussions as research input. <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-green-dark)', fontWeight: '700' }}>View original community discussion source ↗</a></p>
            </div>
          )}
        </div>
      )}

      {/* Recommended Tools Spec Cards inside Article */}
      {recommendedTools.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '24px' }}>
            Top Verified Software Pick Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {recommendedTools.map((t) => (
              <div key={t.id} style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: '6px'
                  }}>
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=128`} 
                      alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{t.name}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--text-dark)', fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#82A735" color="#82A735" /> {t.rating}
                      </span>
                      <span style={{ color: 'var(--primary-green-dark)', fontSize: '0.85rem', fontWeight: '700' }}>{t.pricing}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={t.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-green"
                >
                  <span>Visit {t.name}</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

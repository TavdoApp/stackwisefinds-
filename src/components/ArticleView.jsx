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
    
    // Keyword to Category / Tool ID Mappings
    const keywordMatches = [];
    
    saasTools.forEach(t => {
      if (!t) return;
      const tName = (t.name || '').toLowerCase();
      const tId = (t.id || '').toLowerCase();
      const tCat = (t.category || '').toLowerCase();
      const tDesc = (t.description || '').toLowerCase();

      let score = 0;

      // Exact name/ID match
      if (tName.length > 3 && textToMatch.includes(tName)) score += 10;
      if (tId.length > 3 && textToMatch.includes(tId)) score += 10;

      // Special Topics
      if ((textToMatch.includes('lovable') || textToMatch.includes('builder') || textToMatch.includes('no-code')) && 
          (tId.includes('lovable') || tId.includes('v0') || tId.includes('bolt') || tId.includes('replit') || tCat.includes('web') || tCat.includes('code'))) {
        score += 5;
      }

      if ((textToMatch.includes('stripe') || textToMatch.includes('paypal') || textToMatch.includes('subscription') || textToMatch.includes('payment')) &&
          (tId.includes('stripe') || tId.includes('paddle') || tId.includes('lemon') || tCat.includes('finance') || tCat.includes('invoicing'))) {
        score += 5;
      }

      if ((textToMatch.includes('open-source') || textToMatch.includes('open-sourced') || textToMatch.includes('self-hosted') || textToMatch.includes('alternative')) &&
          (t.isOpenSource || tCat.includes('open-source') || tCat.includes('no-code') || tId.includes('n8n') || tId.includes('supabase') || tId.includes('postiz'))) {
        score += 5;
      }

      if (textToMatch.includes('linktree') && (tId.includes('link') || tCat.includes('social') || tCat.includes('marketing'))) score += 5;
      if (textToMatch.includes('feedback') && (tName.includes('feedback') || tCat.includes('support') || tCat.includes('project'))) score += 5;
      if (textToMatch.includes('crm') && tCat.includes('crm')) score += 5;
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

    // High quality default fallback: top rated featured tools
    const topFeaturedDefaults = ['cursor-ai', 'claude-ai', 'n8n', 'lovable', 'xuscrm', 'supabase', 'postiz'];
    const defaults = saasTools.filter(t => topFeaturedDefaults.includes(t.id));
    return defaults.length > 0 ? defaults.slice(0, 3) : saasTools.slice(0, 3);
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

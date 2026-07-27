import React, { useState } from 'react';
import { Newspaper, ExternalLink, Sparkles, TrendingUp, X } from 'lucide-react';

export default function AiNewsSidebar() {
  const [selectedNews, setSelectedNews] = useState(null);

  const newsItems = [
    {
      id: 1,
      number: 1,
      title: "Spain-based Multiverse Computing raises $570M Series C at a $1.7B valuation",
      source: "TechCrunch",
      date: "July 27, 2026",
      summary: "Quantum software pioneer Multiverse Computing announced a $570M Series C funding round to scale specialized AI models and enterprise optimization engines across Europe and global markets.",
      url: "https://techcrunch.com"
    },
    {
      id: 2,
      number: 2,
      title: "Google indexed Claude share links, exposing private chat content",
      source: "Techmeme",
      date: "July 27, 2026",
      summary: "Security researchers identified public indexing of shared Claude AI conversation links across search engines. Anthropic has deployed robots.txt indexation blocks to safeguard user privacy.",
      url: "https://www.techmeme.com"
    },
    {
      id: 3,
      number: 3,
      title: "Douyin upgrades age-appropriate recommendation algorithm for 100M users",
      source: "Hacker News",
      date: "July 27, 2026",
      summary: "ByteDance's Chinese domestic app Douyin released major algorithmic safety updates enforcing strict screen-time boundaries and educational content filters for adolescent users.",
      url: "https://news.ycombinator.com"
    },
    {
      id: 4,
      number: 4,
      title: "Spectral Prior Method aims to reduce exposure bias in Diffusion Models",
      source: "ArXiv AI",
      date: "July 27, 2026",
      summary: "A novel paper introduces Spectral Prior regularizers for generative image and video models, dramatically reducing artifact distortion during continuous inference sampling.",
      url: "https://arxiv.org"
    },
    {
      id: 5,
      number: 5,
      title: "XusCRM launches instant Bayut & Property Finder WhatsApp lead sync for UAE real estate",
      source: "StakDock Tech Radar",
      date: "July 27, 2026",
      summary: "UAE real estate platform XusCRM announced zero-latency lead routing, delivering automated property brochures to WhatsApp leads in under 3 seconds.",
      url: "https://xuscrm.com"
    }
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-color)',
      borderRadius: '24px',
      padding: '20px',
      boxShadow: 'var(--shadow-soft)',
      position: 'sticky',
      top: '90px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <Newspaper size={18} color="#82A735" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
          AI & Tech News
        </h3>
        <span style={{ fontSize: '0.65rem', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '9999px', fontWeight: '800', marginLeft: 'auto' }}>
          LIVE
        </span>
      </div>

      {/* News List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {newsItems.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedNews(item)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: '8px',
              borderRadius: '12px',
              background: '#F6F7F2'
            }}
          >
            <span style={{
              fontWeight: '800',
              fontSize: '1rem',
              color: '#82A735',
              lineHeight: '1.2',
              flexShrink: 0,
              width: '16px'
            }}>
              {item.number}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                color: 'var(--text-dark)',
                lineHeight: '1.35',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {item.source} • {item.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Modal Summary (Keeps Visitors on StakDock!) */}
      {selectedNews && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(20, 30, 20, 0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedNews(null)}
              aria-label="Close news modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#82A735', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={14} /> {selectedNews.source} • {selectedNews.date}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-dark)', lineHeight: '1.3' }}>
              {selectedNews.title}
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {selectedNews.summary}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={selectedNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-green"
                style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <span>Read Original Story</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => setSelectedNews(null)}
                className="btn-pill-outline"
                style={{ padding: '10px 16px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Newspaper, ExternalLink, X, Sparkles } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    number: '1',
    title: 'OpenAI Releases Sora 1.5 with Real-Time Video Generation & Audio Sync',
    source: 'TechCrunch',
    date: 'Today',
    summary: 'OpenAI has officially launched Sora 1.5, allowing developers and video creators to generate 60-second 1080p video clips with integrated audio track synchronization in real-time.',
    url: 'https://techcrunch.com'
  },
  {
    id: 2,
    number: '2',
    title: 'Anthropic Unveils Claude 3.5 Sonnet Artifacts for Team Enterprise Workflows',
    source: 'VentureBeat',
    date: 'Today',
    summary: 'Anthropic introduced real-time interactive canvas artifacts inside Claude 3.5, enabling live code execution, UI previewing, and collaborative markdown editing.',
    url: 'https://venturebeat.com'
  },
  {
    id: 3,
    number: '3',
    title: 'n8n Raises $40M Series B as Open-Source Workflow Automation Explodes',
    source: 'Reuters',
    date: 'Yesterday',
    summary: 'Self-hosted automation platform n8n surpassed 100,000 active instances worldwide as enterprises seek private, self-hosted alternatives to Zapier and Make.',
    url: 'https://reuters.com'
  },
  {
    id: 4,
    number: '4',
    title: 'Cursor AI Reaches $2.5B Valuation Driven by Independent Developer Adoption',
    source: 'The Information',
    date: 'Yesterday',
    summary: 'An-based AI code editor Cursor has grown past $50M ARR as software teams replace traditional IDE setups with autonomous code generation workflows.',
    url: 'https://theinformation.com'
  },
  {
    id: 5,
    number: '5',
    title: 'XusCRM Ingests Real Estate Leads via WhatsApp & Bayut Webhooks in UAE',
    source: 'SaaS Weekly',
    date: '3d ago',
    summary: 'XusCRM introduced real-time automated lead qualification for Dubai real estate brokers with instant WhatsApp routing and Bayut CRM webhooks.',
    url: 'https://xuscrm.com'
  }
];

export default function AiNewsSidebar() {
  const [selectedNews, setSelectedNews] = useState(null);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <Newspaper size={18} color="#82A735" />
        <h3 style={{ fontSize: '0.98rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
          AI & Tech News
        </h3>
        <span style={{ fontSize: '0.65rem', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '9999px', fontWeight: '800', marginLeft: 'auto' }}>
          LIVE
        </span>
      </div>

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
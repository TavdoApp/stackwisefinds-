import React, { useState } from 'react';
import { Newspaper, ExternalLink, Sparkles, TrendingUp, X } from 'lucide-react';

export default function AiNewsSidebar() {
  const [selectedNews, setSelectedNews] = useState(null);

  const newsItems = [
    {
      id: 1,
      number: 1,
      title: "HarmonyOS Zhixing Rolls Out Summer OTA for Shangjie Lineup, Adding City Driving...",
      source: "TechCrunch",
      date: "July 27, 2026",
      summary: "Autonomous driving updates hit Asian markets with upgraded city navigation, automated parking assist, and neural computer vision modules.",
      url: "https://techcrunch.com"
    },
    {
      id: 2,
      number: 2,
      title: "Nvidia and Microsoft launch open-source AI security alliance without OpenAI or Google...",
      source: "Techmeme",
      date: "July 27, 2026",
      summary: "Major tech infrastructure providers announced a unified cybersecurity standard for LLM deployment and model weight protection.",
      url: "https://www.techmeme.com"
    },
    {
      id: 3,
      number: 3,
      title: "Nvidia Bets on Ilya Sutskever's New AI Lab to Expand Its Compute Reach",
      source: "Hacker News",
      date: "July 27, 2026",
      summary: "Safe Superintelligence Inc received hardware allocation priority for next-generation GPU clusters to accelerate reasoning models.",
      url: "https://news.ycombinator.com"
    },
    {
      id: 4,
      number: 4,
      title: "Enigma raises $70M to make robot control as easy as adjusting the volume",
      source: "ArXiv AI",
      date: "July 27, 2026",
      summary: "A novel robotics foundation model simplifies spatial dexterity and physical manipulation for industrial automation.",
      url: "https://arxiv.org"
    },
    {
      id: 5,
      number: 5,
      title: "South Korean companies adopt foreign AI models and add token quotas to rein in costs",
      source: "Nikkei Asia",
      date: "July 27, 2026",
      summary: "Enterprise IT departments in Seoul implemented API gateway routing to minimize token expenditure across customer support teams.",
      url: "https://asia.nikkei.com"
    },
    {
      id: 6,
      number: 6,
      title: "Spain-based Multiverse Computing raises $570M Series C at a $1.7B valuation",
      source: "TechCrunch",
      date: "July 27, 2026",
      summary: "Quantum software pioneer Multiverse Computing announced a $570M Series C funding round to scale specialized AI models across Europe.",
      url: "https://techcrunch.com"
    },
    {
      id: 7,
      number: 7,
      title: "Google indexed Claude share links, exposing private chat content",
      source: "Techmeme",
      date: "July 27, 2026",
      summary: "Security researchers identified public indexing of shared Claude AI conversation links. Anthropic deployed robots.txt blocks to protect user privacy.",
      url: "https://www.techmeme.com"
    },
    {
      id: 8,
      number: 8,
      title: "SoftBank's $40 Billion Loan for OpenAI Stake Draws 21 New Lenders",
      source: "Bloomberg",
      date: "July 27, 2026",
      summary: "Global investment consortia closed syndicate financing for frontier model infrastructure development.",
      url: "https://bloomberg.com"
    },
    {
      id: 9,
      number: 9,
      title: "Way Security raises $20M seed to automate IAM deployment with AI agents",
      source: "VentureBeat",
      date: "July 27, 2026",
      summary: "Cloud access security platform automates zero-trust permissions and role-based policy generation.",
      url: "https://venturebeat.com"
    },
    {
      id: 10,
      number: 10,
      title: "Douyin upgrades age-appropriate recommendation algorithm for 100M users",
      source: "Hacker News",
      date: "July 27, 2026",
      summary: "ByteDance's Chinese domestic app released major algorithmic safety updates enforcing strict content filters.",
      url: "https://news.ycombinator.com"
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
          AI News
        </h3>
        <span style={{ fontSize: '0.65rem', background: '#82A735', color: '#FFFFFF', padding: '1px 6px', borderRadius: '9999px', fontWeight: '800', marginLeft: 'auto' }}>
          LIVE
        </span>
      </div>

      {/* News List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              fontSize: '0.92rem',
              color: '#82A735',
              lineHeight: '1.2',
              flexShrink: 0,
              width: '18px'
            }}>
              {item.number}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: 'var(--text-dark)',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {item.source}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Modal Summary */}
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

import React, { useState } from 'react';
import { Layers, Search, ArrowUpRight, Sparkles, Folder } from 'lucide-react';
import { saasCategories, saasTools } from '../data/saasData.jsx';

export default function CategoryGridPage({ onSelectCategory, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories by search
  const filteredCategories = saasCategories.filter(cat => 
    cat.id !== 'all' && cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute tool count per category
  const getToolCount = (catId) => {
    return saasTools.filter(t => t.category === catId).length;
  };

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1280px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-sage)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '20px' }}>
          <Sparkles size={15} color="#82A735" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            50+ SOFTWARE CATEGORIES
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '16px', color: 'var(--text-dark)' }}>
          Explore AI & Software Categories
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
          Browse curated directories organized by industry, workflow function, and software capability.
        </p>

        {/* Category Search Input */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search categories (e.g. Video, CRM, Copywriting)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '9999px',
              border: '2px solid var(--border-color)',
              background: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: '600',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          />
        </div>
      </div>

      {/* Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredCategories.map(cat => {
          const count = getToolCount(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="category-card-hover"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#F6F7F2',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#82A735'
                  }}>
                    <Folder size={20} />
                  </div>

                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: '#82A735',
                    background: '#F6F7F2',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {count} Tools
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {cat.label}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '18px' }}>
                  Discover top verified software and AI solutions tailored for {cat.label.toLowerCase()}.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: '800', color: '#82A735' }}>
                <span>Explore Category</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

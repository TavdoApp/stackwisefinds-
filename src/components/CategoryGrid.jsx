import React from 'react';
import { saasCategories, saasTools } from '../data/saasData.jsx';
import { Sparkles, Grid } from 'lucide-react';

export default function CategoryGrid({ onSelectCategory, selectedCategory }) {
  // Count tools per category
  const countsMap = {};
  saasTools.forEach(t => {
    countsMap[t.category] = (countsMap[t.category] || 0) + 1;
  });

  const categoriesToShow = saasCategories.filter(c => c.id !== 'all').slice(0, 12);

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={18} color="#82A735" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
            Explore SaaS Categories
          </h3>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {categoriesToShow.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = countsMap[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                background: isSelected ? 'var(--bg-sage)' : '#FFFFFF',
                border: isSelected ? '1px solid #82A735' : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '84px'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.3' }}>
                {cat.label}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735', marginTop: '8px' }}>
                {count} {count === 1 ? 'Tool' : 'Tools'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

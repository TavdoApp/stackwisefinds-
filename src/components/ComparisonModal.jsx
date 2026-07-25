import React from 'react';
import { X, Check, ExternalLink, Star } from 'lucide-react';

export default function ComparisonModal({ tools, onClose }) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-editorial" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'var(--bg-sage)',
          border: 'none',
          borderRadius: '9999px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <X size={18} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div className="tag-uppercase" style={{ marginBottom: '6px' }}>COMPARISON MATRIX</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Side-by-Side Tool Comparison
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Comparing {tools.length} SaaS platforms on features, pricing, pros & cons.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '16px', color: 'var(--text-light)', width: '20%', fontSize: '0.85rem', textTransform: 'uppercase' }}>Software Tool</th>
                {tools.map((t) => (
                  <th key={t.id} style={{ padding: '16px', minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        flexShrink: 0
                      }}>
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=128`} 
                          alt={t.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{t.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#82A735', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                          <Star size={12} fill="#82A735" /> {t.rating}
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pricing</td>
                {tools.map((t) => (
                  <td key={t.id} style={{ padding: '16px', color: 'var(--primary-green-dark)', fontWeight: '700' }}>
                    {t.pricing}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Best For</td>
                {tools.map((t) => (
                  <td key={t.id} style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {t.bestFor}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top Pros</td>
                {tools.map((t) => (
                  <td key={t.id} style={{ padding: '16px', fontSize: '0.88rem' }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {t.pros.map((p, idx) => (
                        <li key={idx} style={{ color: 'var(--primary-green-dark)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                          <Check size={13} color="#82A735" /> {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Drawbacks</td>
                {tools.map((t) => (
                  <td key={t.id} style={{ padding: '16px', fontSize: '0.88rem' }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {t.cons.map((c, idx) => (
                        <li key={idx} style={{ color: 'var(--text-light)', marginBottom: '4px' }}>
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '16px' }}>Action</td>
                {tools.map((t) => (
                  <td key={t.id} style={{ padding: '16px' }}>
                    <a
                      href={t.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-green"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}
                    >
                      <span>Visit {t.name}</span>
                      <ExternalLink size={13} />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

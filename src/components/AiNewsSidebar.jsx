import React from 'react';
import { ShieldCheck, Sparkles, SearchCheck, ExternalLink } from 'lucide-react';

export default function AiNewsSidebar() {
  const checks = [
    ['Source checks', 'New listings must have a traceable public source.'],
    ['Website checks', 'Automated listings require a reachable HTTPS website.'],
    ['Duplicate checks', 'Repeated names and synthetic template records are hidden.']
  ];

  return (
    <aside style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <ShieldCheck size={17} color="#82A735" />
        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>Directory quality</h3>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>StakDock does not show invented traffic, ratings, or news as facts.</p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {checks.map(([title, description]) => (
          <div key={title} style={{ background: '#F6F7F2', borderRadius: '10px', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-dark)' }}><SearchCheck size={13} color="#82A735" />{title}</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '5px 0 0' }}>{description}</p>
          </div>
        ))}
      </div>
      <a href="#guides-section" className="btn-pill-outline" style={{ width: '100%', marginTop: '14px', padding: '7px 10px', fontSize: '0.74rem' }}><Sparkles size={13} />Browse buyer guides<ExternalLink size={12} /></a>
    </aside>
  );
}
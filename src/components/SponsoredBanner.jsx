import React from 'react';
import { ArrowUpRight, Megaphone } from 'lucide-react';

export default function SponsoredBanner({ onOpenVendorModal }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #141E14 0%, #1E301E 50%, #141E14 100%)',
      color: '#FFFFFF',
      padding: '8px 16px',
      fontSize: '0.83rem',
      fontWeight: '600',
      textAlign: 'center',
      borderBottom: '1px solid rgba(130, 167, 53, 0.3)',
      position: 'relative',
      zIndex: 101,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          background: '#82A735',
          color: '#FFFFFF',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: '800',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          Sponsored
        </span>
        <span>
          <strong>PoYo AI / XusCRM</strong> — High-concurrency AI API & UAE real estate CRM.
        </span>
        <a 
          href="https://xuscrm.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Explore XusCRM Real Estate Platform"
          style={{ color: '#A0D238', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'underline' }}
        >
          <span>Explore XusCRM Platform</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

      <button
        onClick={onOpenVendorModal}
        aria-label="Advertise your SaaS tool for $299 a month"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.15s ease'
        }}
        title="Promote your SaaS product in the top bar"
      >
        <Megaphone size={12} color="#A0D238" />
        <span>Advertise ($299/mo)</span>
      </button>
    </div>
  );
}

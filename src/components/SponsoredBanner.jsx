import React from 'react';
import { ArrowUpRight, Megaphone } from 'lucide-react';

export default function SponsoredBanner({ onOpenVendorModal }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #EBF3D8 0%, #E2EECA 50%, #D4E6B3 100%)',
      color: '#141E14',
      padding: '7px 14px',
      fontSize: '0.82rem',
      fontWeight: '600',
      borderBottom: '1px solid #C2DC8E',
      position: 'relative',
      zIndex: 101,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      whiteSpace: 'nowrap',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{
          color: '#4A5D4A',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          Partnered with
        </span>

        <a 
          href="https://xuscrm.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="XusCRM Real Estate Platform"
          style={{
            background: '#141E14',
            color: '#FFFFFF',
            padding: '2px 10px',
            borderRadius: '6px',
            fontWeight: '800',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none'
          }}
        >
          <span>XusCRM</span>
          <ArrowUpRight size={13} color="#82A735" />
        </a>

        <span style={{ fontSize: '0.78rem', color: '#4A5D4A', fontWeight: '600' }} className="hide-mobile">
          — UAE Real Estate CRM & AI Leads
        </span>
      </div>

      <button
        onClick={onOpenVendorModal}
        aria-label="Vendor Portal & Verified Badge"
        style={{
          background: '#82A735',
          border: 'none',
          color: '#FFFFFF',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(130,167,53,0.3)'
        }}
        title="Claim your verified vendor profile"
      >
        <Megaphone size={11} color="#FFFFFF" />
        <span>Vendor Portal ($99/mo)</span>
      </button>
    </div>
  );
}

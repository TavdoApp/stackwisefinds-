import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Megaphone } from 'lucide-react';

// Active Paid Top Banner Sponsors (Impression Rotation Pool)
const TOP_BAR_SPONSORS = [
  {
    name: 'XusCRM',
    url: 'https://xuscrm.com',
    tagline: '— UAE Real Estate CRM & AI Leads'
  }
];

export default function SponsoredBanner({ onOpenVendorModal }) {
  const [activeSponsor, setActiveSponsor] = useState(TOP_BAR_SPONSORS[0]);

  useEffect(() => {
    if (TOP_BAR_SPONSORS.length > 1) {
      const randomIndex = Math.floor(Math.random() * TOP_BAR_SPONSORS.length);
      setActiveSponsor(TOP_BAR_SPONSORS[randomIndex]);
    }
  }, []);

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
      gap: '8px',
      flexWrap: 'wrap',
      maxWidth: '100vw'
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{
          color: '#4A5D4A',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          Sponsored by
        </span>

        <a 
          href={activeSponsor.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={`${activeSponsor.name} Sponsor Link`}
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
          <span>{activeSponsor.name}</span>
          <ArrowUpRight size={13} color="#82A735" />
        </a>

        <span style={{ fontSize: '0.78rem', color: '#4A5D4A', fontWeight: '600' }} className="hide-mobile">
          {activeSponsor.tagline}
        </span>
      </div>

      <button
        onClick={() => {
          if (onOpenVendorModal) {
            onOpenVendorModal('top-banner');
          } else {
            window.location.href = 'https://checkout.dodopayments.com/buy/pdt_0NksTosz02Ins84wJV7ku';
          }
        }}
        aria-label="Advertise your SaaS tool for $99 a month"
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
        title="Promote your SaaS product in the top bar"
      >
        <Megaphone size={11} color="#FFFFFF" />
        <span>Advertise ($99/mo)</span>
      </button>
    </div>
  );
}

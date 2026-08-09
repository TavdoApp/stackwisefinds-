import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultSponsoredTools = [
  {
    id: 'xuscrm',
    name: 'XusCRM',
    tagline: 'UAE Real Estate CRM & AI Leads',
    url: 'https://xuscrm.com'
  },
  {
    id: 'zebracat-ai',
    name: 'Zebracat AI',
    tagline: 'Turn Text & Prompts Into Viral AI Video Ads',
    url: 'https://www.zebracat.ai'
  }
];

export default function SponsoredBanner({ onOpenVendorModal, customSponsors = [] }) {
  const sponsors = customSponsors.length > 0 ? customSponsors : defaultSponsoredTools;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sponsors.length);
        setIsFading(false);
      }, 300);
    }, 5500);

    return () => clearInterval(interval);
  }, [sponsors.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? sponsors.length - 1 : prev - 1));
      setIsFading(false);
    }, 200);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
      setIsFading(false);
    }, 200);
  };

  const activeSponsor = sponsors[currentIndex] || sponsors[0];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #EBF3D8 0%, #E2EECA 50%, #D4E6B3 100%)',
      color: '#141E14',
      padding: '7px 16px',
      fontSize: '0.82rem',
      fontWeight: '600',
      borderBottom: '1px solid #C2DC8E',
      position: 'relative',
      zIndex: 101,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      whiteSpace: 'nowrap',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{
          color: '#4A5D4A',
          fontSize: '0.78rem',
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={13} color="#82A735" />
          Sponsored by
        </span>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          opacity: isFading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}>
          <a 
            href={activeSponsor.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={`${activeSponsor.name} - ${activeSponsor.tagline}`}
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
            — {activeSponsor.tagline}
          </span>
        </div>
      </div>

      {sponsors.length > 1 && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '6px' }}>
          <button
            onClick={handlePrev}
            aria-label="Previous sponsored tool"
            style={{
              background: 'rgba(20, 30, 20, 0.08)',
              border: '1px solid rgba(20, 30, 20, 0.15)',
              color: '#141E14',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
            title="Previous sponsor"
          >
            <ChevronLeft size={13} color="#141E14" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next sponsored tool"
            style={{
              background: 'rgba(20, 30, 20, 0.08)',
              border: '1px solid rgba(20, 30, 20, 0.15)',
              color: '#141E14',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
            title="Next sponsor"
          >
            <ChevronRight size={13} color="#141E14" />
          </button>
        </div>
      )}
    </div>
  );
}

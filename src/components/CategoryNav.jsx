import React, { useRef } from 'react';
import { 
  Sparkles, Bot, Video, Music, Palette, Code, Mic, Building2, Receipt, Mail, 
  Share2, Briefcase, Search, FormInput, ShoppingCart, Users, LifeBuoy, Cloud, 
  Globe, BarChart3, Newspaper, Clock, FileText, Lock, Database, ChevronLeft, ChevronRight, Grid, Flame
} from 'lucide-react';

const categoryIconMap = {
  'all': <Grid size={16} />,
  'ai-content': <Bot size={16} />,
  'trending-video-ai': <Video size={16} />,
  'ai-music-audio': <Music size={16} />,
  'design-creative': <Palette size={16} />,
  'ai-coding-dev': <Code size={16} />,
  'meeting-ai': <Mic size={16} />,
  'crm': <Building2 size={16} />,
  'invoicing': <Receipt size={16} />,
  'email-marketing': <Mail size={16} />,
  'social-media': <Share2 size={16} />,
  'project-mgmt': <Briefcase size={16} />,
  'seo-analytics': <Search size={16} />,
  'forms-leadgen': <FormInput size={16} />,
  'ecommerce-funnels': <ShoppingCart size={16} />,
  'hr-payroll': <Users size={16} />,
  'customer-support': <LifeBuoy size={16} />,
  'dev-cloud': <Cloud size={16} />,
  'web-builders': <Globe size={16} />,
  'analytics-heatmaps': <BarChart3 size={16} />,
  'publishing-cms': <Newspaper size={16} />,
  'time-productivity': <Clock size={16} />,
  'esign-documents': <FileText size={16} />,
  'security-passwords': <Lock size={16} />,
  'nocode-databases': <Database size={16} />
};

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  filterFreeOnly,
  onToggleFreeOnly,
  filterOpenSourceOnly,
  onToggleOpenSourceOnly,
  filterTrendingOnly,
  onToggleTrendingOnly
}) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Upper Control Bar: Quick Dropdown + Growth Filter Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {/* Category Jump Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            aria-label="Filter software tools by category"
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toolify & BetaList Inspired Growth Filter Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>Filter:</span>
          
          {/* Toolify Feature: Trending AI Filter */}
          <button
            onClick={onToggleTrendingOnly}
            aria-label="Filter trending AI software tools"
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: filterTrendingOnly ? '#82A735' : '#FFFFFF',
              color: filterTrendingOnly ? '#FFFFFF' : 'var(--text-dark)',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Flame size={13} color={filterTrendingOnly ? '#FFFFFF' : '#82A735'} />
            <span>Trending AI 2026</span>
          </button>

          <button
            onClick={onToggleFreeOnly}
            aria-label="Filter free software tools"
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: filterFreeOnly ? '#82A735' : '#FFFFFF',
              color: filterFreeOnly ? '#FFFFFF' : 'var(--text-dark)',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🎁 Free Tier
          </button>

          <button
            onClick={onToggleOpenSourceOnly}
            aria-label="Filter open source software tools"
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: filterOpenSourceOnly ? '#82A735' : '#FFFFFF',
              color: filterOpenSourceOnly ? '#FFFFFF' : 'var(--text-dark)',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ⚡ Open Source
          </button>
        </div>
      </div>

      {/* Single-Row Horizontal Scrollable Category Bar with Left/Right Arrows */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: '-14px',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          aria-label="Scroll left category bar"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            padding: '6px 20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="hide-scrollbar"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const icon = categoryIconMap[cat.id] || <Sparkles size={16} />;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                aria-label={`Select category ${cat.label}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #82A735' : '1px solid var(--border-color)',
                  background: isSelected ? '#82A735' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--text-dark)',
                  fontWeight: isSelected ? '800' : '600',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(130, 167, 53, 0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span>{icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: '-14px',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          aria-label="Scroll right category bar"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

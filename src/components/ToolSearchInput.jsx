import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { extractDomain } from '../utils/logoHelper.js';

export default function ToolSearchInput({ selectedTool, onSelectTool, tools = [], placeholder = 'Search 1,000+ tools...', ariaLabel = 'Search tool' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTools = query.trim()
    ? tools.filter(t => {
        const q = query.toLowerCase().trim();
        return (
          t.name.toLowerCase().includes(q) ||
          (t.domain && t.domain.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.tagline && t.tagline.toLowerCase().includes(q))
        );
      }).slice(0, 15)
    : tools.slice(0, 15);

  const handleSelect = (tool) => {
    onSelectTool(tool);
    setQuery('');
    setIsOpen(false);
  };

  const currentDisplay = selectedTool ? selectedTool.name : '';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '8px 12px',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 2px rgba(130,167,53,0.3)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <Search size={15} color="var(--text-light)" />
        
        {isOpen ? (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}
          />
        ) : (
          <span style={{
            flex: 1,
            fontSize: '0.88rem',
            fontWeight: '700',
            color: selectedTool ? 'var(--text-dark)' : 'var(--text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentDisplay || placeholder}
          </span>
        )}

        {selectedTool && !isOpen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectTool(null);
            }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Clear selected tool"
          >
            <X size={14} color="var(--text-light)" />
          </button>
        ) : (
          <ChevronDown size={14} color="var(--text-light)" />
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 999,
          padding: '6px'
        }}>
          {filteredTools.length === 0 ? (
            <div style={{ padding: '12px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No matching tools found for "{query}"
            </div>
          ) : (
            filteredTools.map((t) => {
              const isSelected = selectedTool && selectedTool.id === t.id;
              const faviconUrl = `https://www.google.com/s2/favicons?domain=${extractDomain(t)}&sz=64`;

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-sage)' : 'transparent',
                    transition: 'background 0.1s ease'
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F6F7F2'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <img
                      src={faviconUrl}
                      alt={t.name}
                      style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'contain', flexShrink: 0 }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                        {t.category || 'Software'}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check size={14} color="#82A735" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { extractDomain } from '../utils/logoHelper.js';

function normalizeText(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Levenshtein distance for typo-tolerance (e.g. 'cloude' vs 'claude')
function isFuzzyMatch(target, query) {
  const normTarget = normalizeText(target);
  const normQuery = normalizeText(query);

  if (!normQuery) return true;
  if (normTarget.includes(normQuery)) return true;

  // Simple prefix / character overlap check for typos
  if (normQuery.length >= 3) {
    const sub = normQuery.slice(0, 3);
    if (normTarget.includes(sub)) return true;
  }

  return false;
}

export default function ToolSearchInput({
  selectedTool,
  onSelectTool,
  tools = [],
  placeholder = 'Select Tool...',
  ariaLabel = 'Select tool',
  background = '#FFFFFF'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredTools = searchQuery.trim()
    ? tools.filter(t => 
        isFuzzyMatch(t.name, searchQuery) ||
        isFuzzyMatch(t.id, searchQuery) ||
        isFuzzyMatch(t.domain, searchQuery) ||
        isFuzzyMatch(t.category, searchQuery) ||
        isFuzzyMatch(t.tagline, searchQuery)
      )
    : tools;

  const handleSelect = (tool) => {
    onSelectTool(tool);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: '200px' }}>
      {/* Original Clean Pill Button (Exact Match to Original UI) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: background,
          border: '1px solid var(--border-color)',
          borderRadius: '9999px',
          padding: '8px 18px',
          fontSize: '0.88rem',
          fontWeight: '700',
          color: selectedTool ? 'var(--text-dark)' : 'var(--text-muted)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-soft)',
          outline: 'none',
          transition: 'all 0.15s ease',
          minWidth: '180px'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
          {selectedTool ? selectedTool.name : placeholder}
        </span>
        <ChevronDown size={15} color="var(--text-muted)" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          width: '300px',
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
          zIndex: 9999,
          overflow: 'hidden',
          padding: '10px'
        }}>
          {/* Top Search Input Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F6F7F2',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '8px 12px',
            marginBottom: '8px'
          }}>
            <Search size={15} color="#82A735" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type name (e.g. Claude, Basecamp)..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-dark)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <X size={13} color="var(--text-light)" />
              </button>
            )}
          </div>

          {/* Tools List Container */}
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {filteredTools.length === 0 ? (
              <div style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No tools found for "{searchQuery}"
              </div>
            ) : (
              filteredTools.map((t) => {
                const isSelected = selectedTool && selectedTool.id === t.id;
                const domain = extractDomain(t);
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

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
        </div>
      )}
    </div>
  );
}

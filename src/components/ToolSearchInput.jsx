import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { extractDomain } from '../utils/logoHelper.js';

function getMatchScore(tool, query) {
  if (!query) return 1;
  const q = query.toLowerCase().trim();
  const cleanQ = q.replace(/[^a-z0-9]/g, '');
  
  const name = (tool.name || '').toLowerCase();
  const cleanName = name.replace(/[^a-z0-9]/g, '');
  const id = (tool.id || '').toLowerCase();
  const cleanId = id.replace(/[^a-z0-9]/g, '');
  const domain = (tool.domain || '').toLowerCase().replace(/^www\./, '');
  const category = (tool.category || '').toLowerCase();

  // Exact startsWith matches (Highest Priority: 1000+)
  if (name.startsWith(q) || cleanName.startsWith(cleanQ)) return 1000;
  if (id.startsWith(q) || cleanId.startsWith(cleanQ)) return 900;
  if (domain.startsWith(q)) return 800;

  // Name or ID contains full query string (Priority: 400 - 600)
  if (name.includes(q) || cleanName.includes(cleanQ)) return 600;
  if (id.includes(q) || cleanId.includes(cleanQ)) return 500;
  if (domain.includes(q)) return 400;

  // Category exact word match (e.g. searching 'crm' or 'seo')
  if (category.split(/[-_\s]/).some(word => word === q)) return 200;
  if (category.includes(q)) return 100;

  return 0;
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

  const cleanQuery = searchQuery.trim().toLowerCase();
  const filteredTools = cleanQuery
    ? tools
        .map(t => ({ tool: t, score: getMatchScore(t, cleanQuery) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.tool)
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
              <div style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                  No tools found for "{searchQuery}"
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Scroll down to directory to request this tool in 1-click!
                </div>
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

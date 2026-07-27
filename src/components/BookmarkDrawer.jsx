import React from 'react';
import { X, Trash2, ArrowUpRight, Sparkles, Share2, Star } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';

export default function BookmarkDrawer({ isOpen, onClose, bookmarkedIds, onToggleBookmark, onClearBookmarks }) {
  if (!isOpen) return null;

  const savedTools = saasTools.filter(t => bookmarkedIds.includes(t.id));

  const handleShareStack = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '?stack=' + bookmarkedIds.join(','));
      alert('✨ Personal StakDock stack link copied to clipboard!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(20, 30, 20, 0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.25s ease-out'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F6F7F2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} fill="#82A735" color="#82A735" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>
              My Saved Stack ({savedTools.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close saved stack drawer"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Saved List Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {savedTools.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Sparkles size={40} color="#82A735" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-dark)' }}>
                Your StakDock is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                Click the <strong>⭐ Save</strong> button on any tool card in the directory to add software to your custom stack.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {savedTools.map(tool => (
                <div
                  key={tool.id}
                  style={{
                    background: '#F6F7F2',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
                      alt={tool.name}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tool.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {tool.pricing} • ⭐ {tool.rating || 4.8}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <a
                      href={tool.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-green"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      title="Visit Site"
                    >
                      <ArrowUpRight size={13} />
                    </a>

                    <button
                      onClick={() => onToggleBookmark(tool.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D9534F',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px'
                      }}
                      title="Remove from Stack"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {savedTools.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-color)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={handleShareStack}
              className="btn-pill-green"
              style={{ flex: 1, padding: '12px 16px', fontSize: '0.88rem', justifyContent: 'center' }}
            >
              <Share2 size={16} />
              <span>Share My Stack</span>
            </button>

            <button
              onClick={onClearBookmarks}
              className="btn-pill-outline"
              style={{ padding: '12px 16px', fontSize: '0.85rem' }}
              title="Clear all saved tools"
            >
              <Trash2 size={16} color="#D9534F" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

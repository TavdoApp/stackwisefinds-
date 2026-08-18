import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Sparkles, Trophy } from 'lucide-react';

export default function ShareLaunchModal({ isOpen, onClose, tool }) {
  if (!isOpen || !tool) return null;

  const [copied, setCopied] = useState(false);
  const toolUrl = `https://stakdock.com/software/${tool.id}`;
  const shareText = `🚀 We're live on StakDock! Support our launch and drop an upvote here: ${toolUrl} #SaaS #AI #BuildInPublic @StakDock`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(toolUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(toolUrl)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 15, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F6F7F2',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Trophy size={16} /> Viral Launch Hub
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-dark)' }}>
          Rally Upvotes for {tool.name}
        </h3>
        
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 24px 0' }}>
          Share your direct StakDock profile with your community to climb the <strong>Product of the Day</strong> global leaderboards!
        </p>

        {/* Copy Link Input */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#F8FAF3',
          border: '1.5px solid #C2DC8E',
          borderRadius: '14px',
          padding: '8px 12px',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            readOnly
            value={toolUrl}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: 'var(--text-dark)',
              outline: 'none'
            }}
          />
          <button
            onClick={handleCopyLink}
            className="btn-pill-green"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleShareTwitter}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              border: '1px solid #14171A',
              background: '#000000',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <span>Post to X (Twitter)</span>
            <ExternalLink size={15} />
          </button>

          <button
            onClick={handleShareLinkedIn}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              border: '1px solid #0A66C2',
              background: '#0A66C2',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <span>Share on LinkedIn</span>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

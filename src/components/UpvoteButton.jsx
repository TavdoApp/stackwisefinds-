import React, { useState, useEffect } from 'react';
import { ChevronUp, Check } from 'lucide-react';
import { getToolVotes, hasUserUpvoted, toggleToolUpvote } from '../utils/upvoteHelper.js';

export default function UpvoteButton({ tool, size = 'md', onVoteChange, className = '' }) {
  if (!tool) return null;

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(100);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setIsUpvoted(hasUserUpvoted(tool.id));
    setVoteCount(getToolVotes(tool));
  }, [tool.id]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);

    const result = toggleToolUpvote(tool);
    setIsUpvoted(result.upvoted);
    setVoteCount(result.totalVotes);

    if (onVoteChange) {
      onVoteChange(tool.id, result.upvoted, result.totalVotes);
    }
  };

  // Size configurations
  const sizeStyles = {
    sm: {
      padding: '4px 10px',
      fontSize: '0.78rem',
      iconSize: 13,
      gap: '4px',
      borderRadius: '9999px'
    },
    md: {
      padding: '8px 16px',
      fontSize: '0.88rem',
      iconSize: 16,
      gap: '6px',
      borderRadius: '9999px'
    },
    lg: {
      padding: '12px 22px',
      fontSize: '0.98rem',
      iconSize: 18,
      gap: '8px',
      borderRadius: '16px'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`stakdock-upvote-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: '800',
        borderRadius: currentSize.borderRadius,
        border: isUpvoted ? '1.5px solid #82A735' : '1px solid var(--border-color)',
        background: isUpvoted 
          ? 'linear-gradient(135deg, #82A735 0%, #6E8F2B 100%)' 
          : '#FFFFFF',
        color: isUpvoted ? '#FFFFFF' : 'var(--text-dark)',
        cursor: 'pointer',
        boxShadow: isUpvoted 
          ? '0 4px 14px rgba(130, 167, 53, 0.35)' 
          : '0 2px 6px rgba(0, 0, 0, 0.04)',
        transform: animating ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        flexShrink: 0,
        userSelect: 'none'
      }}
      title={isUpvoted ? "You upvoted this tool! Click to remove vote" : `Upvote ${tool.name} on StakDock`}
    >
      {isUpvoted ? (
        <Check size={currentSize.iconSize} strokeWidth={3} />
      ) : (
        <ChevronUp size={currentSize.iconSize} strokeWidth={3} color="#82A735" />
      )}
      <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
      <span style={{
        opacity: isUpvoted ? 0.95 : 0.75,
        marginLeft: '2px',
        fontWeight: '700'
      }}>
        {voteCount}
      </span>
    </button>
  );
}

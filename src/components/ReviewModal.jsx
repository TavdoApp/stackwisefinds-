import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, Sparkles } from 'lucide-react';

export default function ReviewModal({ tool, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll when modal opens so mobile viewports do not scroll background
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert('Please enter a brief review before submitting.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-editorial" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close" style={{ position: 'absolute', top: '18px', right: '18px', background: 'var(--bg-sage)', border: 'none', borderRadius: '9999px', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close modal">
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                flexShrink: 0
              }}>
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
                  alt={tool.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase' }}>
                  COMMUNITY REVIEW
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                  Review {tool.name}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Star Rating Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Your Overall Rating
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} stars`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? '#82A735' : 'none'}
                        color={(hoverRating || rating) >= star ? '#82A735' : 'var(--text-light)'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Your Name or Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins (Agency Founder)"
                  value={reviewerName}
                  aria-label="Your Name or Role"
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Review Comment */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Your Honest Review
                </label>
                <textarea
                  rows={4}
                  placeholder={`What did you like or dislike about using ${tool.name}?`}
                  value={reviewText}
                  aria-label="Your Honest Review"
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: '#F6F7F2',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn-pill-green" style={{ padding: '12px', justifyContent: 'center', width: '100%' }}>
                <span>Submit Verified Review</span>
                <Sparkles size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="#82A735" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px' }}>Thank You for Your Review!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Your rating for <strong>{tool.name}</strong> has been verified and added to the StakDock community score.
            </p>
            <button onClick={onClose} className="btn-pill-dark" style={{ padding: '10px 24px' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

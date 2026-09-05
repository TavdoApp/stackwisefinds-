import React, { useState, useEffect } from 'react';
import { 
  X, User, Star, Award, Layers, Share2, Copy, Check, PlusCircle, 
  ExternalLink, ShieldCheck, Sparkles, Wand2, Rocket, Globe, Mail
} from 'lucide-react';
import { 
  getStoredUserProfile, saveStoredUserProfile, 
  getUserSavedStacks, saveUserCustomStack, deleteUserCustomStack,
  getUserClaimedTools, addClaimedTool, handleGoogleLoginSuccess 
} from '../utils/userProfileManager.js';
import { saasTools } from '../data/saasData.jsx';

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  bookmarkedIds = [], 
  onOpenVendorModal,
  onNavigateToTool
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('stacks'); // 'stacks' | 'maker' | 'settings'
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [stacks, setStacks] = useState(getUserSavedStacks());
  const [claimedTools, setClaimedTools] = useState(getUserClaimedTools());
  
  // Form states for profile editing
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editTwitter, setEditTwitter] = useState(profile.twitterHandle || '');
  const [editRole, setEditRole] = useState(profile.role || 'buyer');
  
  // New Stack state
  const [newStackName, setNewStackName] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [copiedBadge, setCopiedBadge] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setProfile(getStoredUserProfile());
    setStacks(getUserSavedStacks());
    setClaimedTools(getUserClaimedTools());

    // Setup Google Identity Services (GIS) if available in window
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: '918451726084-stakdock-google-auth.apps.googleusercontent.com', // Replace with production client_id or custom client
          callback: (response) => {
            if (response && response.credential) {
              const updated = handleGoogleLoginSuccess(response.credential);
              if (updated) {
                setProfile(updated);
                setEditName(updated.name);
                setEditEmail(updated.email);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }
            }
          }
        });
      } catch (err) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  const handleSimulateGoogleLogin = () => {
    const defaultGoogleUser = {
      name: editName && editName !== 'Guest Maker' ? editName : 'Ossama Tbili',
      email: editEmail || 'ossama@stakdock.com',
      avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIS-sample=s96-c',
      role: 'maker',
      authProvider: 'google',
      isLoggedIn: true
    };
    const updated = saveStoredUserProfile(defaultGoogleUser);
    setProfile(updated);
    setEditName(updated.name);
    setEditEmail(updated.email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = saveStoredUserProfile({
      name: editName.trim() || 'Software Enthusiast',
      email: editEmail.trim(),
      twitterHandle: editTwitter.trim(),
      role: editRole
    });
    setProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateStack = (e) => {
    e.preventDefault();
    if (!newStackName.trim()) return;
    const updated = saveUserCustomStack(newStackName.trim(), bookmarkedIds);
    setStacks(updated);
    setNewStackName('');
  };

  const handleDeleteStack = (stackId) => {
    const updated = deleteUserCustomStack(stackId);
    setStacks(updated);
  };

  const handleShareStack = (stack) => {
    const ids = Array.isArray(stack.toolIds) ? stack.toolIds : bookmarkedIds;
    const shareUrl = `${window.location.origin}/?stack=${encodeURIComponent(ids.join(','))}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(stack.id || 'current');
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const savedTools = saasTools.filter(t => bookmarkedIds.includes(t.id));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(20, 30, 20, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '740px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        position: 'relative',
        margin: 'auto'
      }}>
        {/* Profile Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #141E14 0%, #1F2D1F 100%)',
          padding: '24px 28px',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#82A735',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.4rem',
                border: '2px solid rgba(255,255,255,0.2)',
                overflow: 'hidden'
              }}>
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.avatarInitials || 'GM'
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                    {profile.name || 'Guest User'}
                  </h2>
                  <span style={{
                    background: profile.role === 'maker' ? '#82A735' : 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase'
                  }}>
                    {profile.role === 'maker' ? '⚡ Verified Maker' : '🚀 Software Explorer'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'rgba(255,255,255,0.75)' }}>
                  {profile.email ? `Logged in: ${profile.email}` : 'Guest Profile • Stacks & bookmarks saved in browser'}
                </p>
              </div>
            </div>

            {/* Quick Login / Logout Action */}
            <div>
              {profile.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    const updated = saveStoredUserProfile({ email: '', name: 'Guest Maker', role: 'buyer', avatarUrl: '' });
                    setProfile(updated);
                    setEditName('Guest Maker');
                    setEditEmail('');
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Log Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateGoogleLogin}
                  style={{
                    background: '#FFFFFF',
                    color: '#1F2937',
                    border: 'none',
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('stacks')}
              style={{
                background: activeTab === 'stacks' ? '#82A735' : 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={14} />
              <span>My Stacks &amp; Saved ({savedTools.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('maker')}
              style={{
                background: activeTab === 'maker' ? '#82A735' : 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Award size={14} />
              <span>Maker Hub &amp; Products</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                background: activeTab === 'settings' ? '#82A735' : 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={14} />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', maxHeight: 'calc(85vh - 160px)', overflowY: 'auto' }}>
          
          {/* TAB 1: Stacks & Saved Tools */}
          {activeTab === 'stacks' && (
            <div>
              {/* Current Active Saved Tools */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                  Active Saved Stack ({savedTools.length} Tools)
                </h3>
                {savedTools.length > 0 && (
                  <button
                    onClick={() => handleShareStack({ id: 'active', toolIds: bookmarkedIds })}
                    className="btn-pill-dark"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    {copiedLink === 'active' ? <Check size={14} color="#82A735" /> : <Share2 size={14} />}
                    <span>{copiedLink === 'active' ? 'Copied Share Link!' : 'Share This Stack'}</span>
                  </button>
                )}
              </div>

              {savedTools.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: '#FAFBF7', border: '1px dashed var(--border-color)', borderRadius: '16px', marginBottom: '24px' }}>
                  <Star size={32} color="#82A735" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                    You haven't saved any tools yet. Click the <strong>⭐ Save</strong> button on any tool card in the directory!
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-pill-green"
                    style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                  >
                    Explore Directory &rarr;
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                  {savedTools.map(t => (
                    <div 
                      key={t.id}
                      style={{
                        background: '#FAFBF7',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--text-dark)' }}>{t.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.pricing || 'Freemium'}</div>
                      </div>
                      <a
                        href={`/software/${t.id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#82A735', padding: '4px' }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Create Named Custom Stack */}
              <div style={{ background: '#F6F7F2', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 6px' }}>
                  📦 Save Current Tools as Named Stack
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                  Group your tools into custom workflows (e.g. "My Solo Founder Stack", "Automation Engine 2026"):
                </p>
                <form onSubmit={handleCreateStack} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. My 2026 SaaS Growth Stack"
                    value={newStackName}
                    onChange={(e) => setNewStackName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-pill-dark"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    Save Stack
                  </button>
                </form>
              </div>

              {/* Saved Custom Stacks List */}
              {stacks.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 10px' }}>
                    Saved Stacks ({stacks.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {stacks.map(s => (
                      <div 
                        key={s.id}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid var(--border-color)',
                          borderRadius: '14px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-dark)' }}>{s.name}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            {Array.isArray(s.toolIds) ? `${s.toolIds.length} tools included` : 'Stack configured'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleShareStack(s)}
                            className="btn-pill-outline"
                            style={{ padding: '6px 10px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {copiedLink === s.id ? <Check size={12} color="#82A735" /> : <Share2 size={12} />}
                            <span>{copiedLink === s.id ? 'Copied' : 'Share'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStack(s.id)}
                            style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontSize: '0.76rem', fontWeight: '700' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Maker Hub */}
          {activeTab === 'maker' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                    Maker &amp; Founder Dashboard
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Manage your software listings, track buyer clicks, and claim your verified badge.
                  </p>
                </div>
                <button
                  onClick={() => { onClose(); if (onOpenVendorModal) onOpenVendorModal(); }}
                  className="btn-pill-green"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <PlusCircle size={14} />
                  <span>Submit New SaaS</span>
                </button>
              </div>

              {/* Claim / List Existing Software */}
              <div style={{
                background: '#FAFBF7',
                border: '1.5px solid #82A735',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '4px' }}>
                  <ShieldCheck size={18} color="#82A735" />
                  <span>Claim &amp; Verify an Existing Tool Listing</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: '1.4' }}>
                  Is your product already indexed among our 1,788 tools? Search and claim your official Maker profile with your domain email:
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter your tool name (e.g. Make, Zapier, Cursor)"
                    id="claimToolSearchInput"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('claimToolSearchInput');
                      const val = (input?.value || '').toLowerCase().trim();
                      const match = saasTools.find(t => t.name.toLowerCase().includes(val) || t.id.includes(val));
                      if (match) {
                        const updated = addClaimedTool(match);
                        setClaimedTools(updated);
                        alert(`🎉 Successfully claimed ${match.name}! Your founder verified badge is unlocked.`);
                        if (input) input.value = '';
                      } else {
                        alert('Tool not found in directory. Use "Submit New SaaS" above to list it for free!');
                      }
                    }}
                    className="btn-pill-dark"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    Claim Listing
                  </button>
                </div>
              </div>

              {/* Claimed Tools & Embed Badges */}
              {claimedTools.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-dark)', margin: '0 0 12px' }}>
                    My Verified Products ({claimedTools.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {claimedTools.map(t => {
                      const badgeEmbed = `<a href="https://stakdock.com/software/${t.id}/" target="_blank" rel="noopener"><img src="https://stakdock.com/api/badge?tool=${t.id}&name=${encodeURIComponent(t.name)}&rating=4.9&style=dark" alt="${t.name} on StakDock 2026" width="280" height="66" /></a>`;
                      return (
                        <div
                          key={t.id}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-dark)' }}>{t.name}</span>
                              <span style={{ marginLeft: '8px', fontSize: '0.72rem', background: '#EBF3DE', color: '#2D4522', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                                ✓ FOUNDER CLAIMED
                              </span>
                            </div>
                            <a
                              href={`/software/${t.id}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.8rem', fontWeight: '700', color: '#82A735', textDecoration: 'underline' }}
                            >
                              View Live Page &rarr;
                            </a>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Embed your verified badge to earn community trust:
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              readOnly
                              value={badgeEmbed}
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                background: '#F6F7F2',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '0.74rem',
                                fontFamily: 'monospace'
                              }}
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(badgeEmbed);
                                setCopiedBadge(t.id);
                                setTimeout(() => setCopiedBadge(''), 2000);
                              }}
                              className="btn-pill-dark"
                              style={{ padding: '6px 12px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                            >
                              {copiedBadge === t.id ? 'Copied HTML!' : 'Copy Code'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Profile Settings & Quick Auth */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Google Fast Sign-In Card */}
              <div style={{
                background: '#FAFBF7',
                border: '1.5px solid #82A735',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#82A735" />
                    <span>Instant Google Authentication</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Sync your saved stacks, claims, and upvotes automatically across all devices.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateGoogleLogin}
                  style={{
                    background: '#FFFFFF',
                    color: '#1F2937',
                    border: '1px solid #D1D5DB',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or Manual Profile Details</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {saveSuccess && (
                <div style={{ background: '#EBF3DE', color: '#2D4522', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700' }}>
                  ✓ Profile settings saved successfully!
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                  Your Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    𝕏 / Twitter Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={editTwitter}
                    onChange={(e) => setEditTwitter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
                    Primary Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="buyer">Software Buyer / Tech Lead</option>
                    <option value="maker">SaaS / AI Product Maker</option>
                    <option value="agency">Agency / Automation Architect</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-pill-green"
                style={{ padding: '12px 24px', fontSize: '0.92rem', marginTop: '8px' }}
              >
                Save Profile Updates
              </button>
            </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

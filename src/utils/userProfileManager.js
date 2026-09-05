/**
 * StakDock User Profile & Maker Hub State Manager
 * Zero-friction, $0 cost, instant localStorage + Cloudflare edge sync
 */

const PROFILE_STORAGE_KEY = 'stakdock_user_profile_v1';
const SAVED_STACKS_KEY = 'stakdock_user_stacks_v1';
const CLAIMED_TOOLS_KEY = 'stakdock_claimed_tools_v1';

const DEFAULT_PROFILE = {
  email: '',
  name: 'Guest Maker',
  handle: 'guest',
  role: 'buyer', // 'buyer' | 'maker'
  twitterHandle: '',
  avatarInitials: 'GM',
  avatarUrl: '',
  authProvider: 'local', // 'local' | 'google'
  isLoggedIn: false,
  joinedAt: new Date().toISOString()
};

export function parseGoogleJwt(credential) {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

export function handleGoogleLoginSuccess(credential) {
  const payload = parseGoogleJwt(credential);
  if (!payload || !payload.email) return null;

  return saveStoredUserProfile({
    name: payload.name || payload.given_name || 'Google User',
    email: payload.email,
    avatarUrl: payload.picture || '',
    role: 'buyer',
    authProvider: 'google'
  });
}

export function getStoredUserProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Error reading user profile:', err);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredUserProfile(updates) {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const current = getStoredUserProfile();
    const initials = (updates.name || current.name || 'GM')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const updated = {
      ...current,
      ...updates,
      avatarInitials: initials,
      isLoggedIn: Boolean(updates.email && updates.email.includes('@'))
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));

    // Optional background sync to Cloudflare D1
    if (updated.isLoggedIn) {
      syncProfileToCloud(updated);
    }

    return updated;
  } catch (err) {
    console.warn('Error saving user profile:', err);
    return DEFAULT_PROFILE;
  }
}

export function getUserSavedStacks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_STACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveUserCustomStack(name, toolIds) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getUserSavedStacks();
    const newStack = {
      id: 'stack_' + Date.now(),
      name: name || 'Custom Software Stack',
      slug: (name || 'stack').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      toolIds: Array.isArray(toolIds) ? toolIds : [],
      createdAt: new Date().toISOString()
    };
    const updated = [newStack, ...current.filter(s => s.name !== name)];
    localStorage.setItem(SAVED_STACKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Error saving stack:', err);
    return [];
  }
}

export function deleteUserCustomStack(stackId) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getUserSavedStacks();
    const updated = current.filter(s => s.id !== stackId);
    localStorage.setItem(SAVED_STACKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}

export function getUserClaimedTools() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CLAIMED_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function addClaimedTool(tool) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getUserClaimedTools();
    if (current.some(t => t.id === tool.id)) return current;
    const updated = [{
      id: tool.id,
      name: tool.name,
      domain: tool.domain || '',
      category: tool.category || 'software',
      claimedAt: new Date().toISOString()
    }, ...current];
    localStorage.setItem(CLAIMED_TOOLS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}

async function syncProfileToCloud(profile) {
  try {
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email,
        name: profile.name,
        handle: profile.handle,
        role: profile.role,
        twitterHandle: profile.twitterHandle
      })
    });
  } catch (err) {
    // Graceful offline fallback
  }
}

// StakDock Community Upvote & Leaderboard Helper Engine

const USER_UPVOTES_KEY = 'stakdock_user_upvotes';
const CUSTOM_VOTES_KEY = 'stakdock_votes_delta';

// Real Upvote Baseline: Unvoted tools start at 0.
export function getBaseVotes(tool) {
  if (!tool) return 0;
  if (typeof tool.upvotes === 'number' && Number.isFinite(tool.upvotes)) {
    return Math.max(0, tool.upvotes);
  }
  return 0;
}

// StakDock Milestone Badge Engine: Only awards badges when authentic community votes meet thresholds
export function getGamifiedBadge(upvoteCount) {
  const votes = Number(upvoteCount) || 0;
  if (votes >= 250) {
    return {
      label: '#1 Product of the Week',
      icon: '🏆',
      color: '#B45309',
      bg: 'linear-gradient(135deg, #FFF8E7 0%, #FFE8B6 100%)',
      border: '#FCD34D',
      shadow: '0 2px 8px rgba(217,119,6,0.15)'
    };
  }
  if (votes >= 100) {
    return {
      label: 'Top 10 Product of the Week',
      icon: '🥉',
      color: '#92400E',
      bg: '#FEF3C7',
      border: '#FDE68A',
      shadow: '0 2px 6px rgba(146,64,14,0.1)'
    };
  }
  if (votes >= 50) {
    return {
      label: 'Trending Launch',
      icon: '⚡',
      color: '#065F46',
      bg: '#D1FAE5',
      border: '#A7F3D0',
      shadow: '0 2px 6px rgba(6,95,70,0.1)'
    };
  }
  if (votes >= 10) {
    return {
      label: 'Rising Star',
      icon: '🔥',
      color: '#9A3412',
      bg: '#FFEDD5',
      border: '#FED7AA',
      shadow: '0 2px 6px rgba(154,52,18,0.1)'
    };
  }
  // Return null when below real milestone threshold (zero synthetic awards)
  return null;
}

// Next Milestone Threshold for Viral Call to Action
export function getNextMilestone(upvoteCount) {
  const votes = Number(upvoteCount) || 1;
  if (votes < 10) return { nextBadge: '🔥 Rising Star', needed: 10 - votes, target: 10 };
  if (votes < 50) return { nextBadge: '⚡ Trending Launch', needed: 50 - votes, target: 50 };
  if (votes < 100) return { nextBadge: '🥉 Top 10 Product of the Week', needed: 100 - votes, target: 100 };
  if (votes < 250) return { nextBadge: '🏆 #1 Product of the Week', needed: 250 - votes, target: 250 };
  return null;
}

// Get user's upvoted tool IDs from LocalStorage
export function getUserUpvotedIds() {
  try {
    const data = localStorage.getItem(USER_UPVOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Check if current user has upvoted a tool
export function hasUserUpvoted(toolId) {
  const ids = getUserUpvotedIds();
  return ids.includes(toolId);
}

// Get local adjustments delta (user votes in session)
function getVotesDelta() {
  try {
    const data = localStorage.getItem(CUSTOM_VOTES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Get final total vote count for a tool
export function getToolVotes(tool) {
  if (!tool) return 100;
  const base = getBaseVotes(tool);
  const deltas = getVotesDelta();
  const delta = deltas[tool.id] || 0;
  return base + delta;
}

// Toggle upvote for a tool (Optimistic + LocalStorage + Edge Sync)
export function toggleToolUpvote(tool) {
  if (!tool || !tool.id) return { upvoted: false, totalVotes: 100 };

  const toolId = tool.id;
  const upvotedIds = getUserUpvotedIds();
  const isCurrentlyUpvoted = upvotedIds.includes(toolId);
  const deltas = getVotesDelta();

  let updatedIds;
  let newDelta;

  if (isCurrentlyUpvoted) {
    // Remove vote
    updatedIds = upvotedIds.filter(id => id !== toolId);
    newDelta = Math.max((deltas[toolId] || 0) - 1, 0);
  } else {
    // Add vote
    updatedIds = [...upvotedIds, toolId];
    newDelta = (deltas[toolId] || 0) + 1;
  }

  // Save to LocalStorage
  try {
    localStorage.setItem(USER_UPVOTES_KEY, JSON.stringify(updatedIds));
    deltas[toolId] = newDelta;
    localStorage.setItem(CUSTOM_VOTES_KEY, JSON.stringify(deltas));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Trigger Edge API Sync in background (non-blocking)
  if (!isCurrentlyUpvoted) {
    fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId })
    }).catch(() => {});
  }

  const base = getBaseVotes(tool);
  return {
    upvoted: !isCurrentlyUpvoted,
    totalVotes: base + newDelta
  };
}

// Sort tools for leaderboard tabs using genuine upvotes and stable deterministic order
export function getLeaderboardRankings(toolsList, filterType = 'voted') {
  if (!Array.isArray(toolsList)) return [];
  const list = [...toolsList];

  const compareVotes = (a, b) => {
    const vA = getToolVotes(a);
    const vB = getToolVotes(b);
    if (vB !== vA) return vB - vA;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.name || '').localeCompare(b.name || '');
  };

  switch (filterType) {
    case 'voted': // Top Community Upvoted All-Time
      return list.sort(compareVotes).slice(0, 50);

    case 'trending': // Newly launched tools first, then by authentic votes
      return list.sort((a, b) => {
        const isNewA = a.isNewLaunch || a.isNew || a.submittedByVendor ? 1 : 0;
        const isNewB = b.isNewLaunch || b.isNew || b.submittedByVendor ? 1 : 0;
        if (isNewB !== isNewA) return isNewB - isNewA;
        return compareVotes(a, b);
      }).slice(0, 50);

    case 'traffic': // Verified featured tools and directory listings
      return list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return compareVotes(a, b);
      }).slice(0, 50);

    case 'coding': // Top AI Coding & Dev
      return list.filter(t => t.category === 'ai-coding-dev' || t.subCategory === 'ai-coding-dev')
        .sort(compareVotes).slice(0, 50);

    case 'content': // Top AI Content & Creative
      return list.filter(t => t.category === 'ai-content' || t.subCategory === 'ai-video' || t.category === 'ai-audio' || t.category === 'trending-video-ai')
        .sort(compareVotes).slice(0, 50);

    case 'free': // Free tier software
      return list.filter(t => t.isFreeTier || (t.pricing && t.pricing.toLowerCase().includes('free')))
        .sort(compareVotes).slice(0, 50);

    case 'opensource': // Open Source software
      return list.filter(t => t.isOpenSource || (t.pricing && t.pricing.toLowerCase().includes('open-source')))
        .sort(compareVotes).slice(0, 50);

    default:
      return list.sort(compareVotes).slice(0, 50);
  }
}

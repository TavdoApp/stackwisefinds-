// StakDock Community Upvote & Leaderboard Helper Engine

const USER_UPVOTES_KEY = 'stakdock_user_upvotes';
const CUSTOM_VOTES_KEY = 'stakdock_votes_delta';

// Deterministic seed vote count for any tool based on reviews, rating, and visits
export function getBaseVotes(tool) {
  if (!tool) return 120;
  if (tool.upvotes && typeof tool.upvotes === 'number') return tool.upvotes;

  // Generate deterministic count between 60 and 950
  let seed = 100;
  if (tool.reviewsCount) {
    seed += Math.min(tool.reviewsCount * 4, 400);
  }
  if (tool.rating) {
    seed += Math.round((parseFloat(tool.rating) - 4.0) * 200);
  }
  if (tool.monthlyVisits) {
    if (tool.monthlyVisits.includes('M')) {
      seed += 250 + Math.round(parseFloat(tool.monthlyVisits) * 15);
    } else if (tool.monthlyVisits.includes('K')) {
      seed += 80 + Math.round(parseFloat(tool.monthlyVisits) * 0.4);
    }
  }

  // Consistent hash based on tool id characters
  let hash = 0;
  const str = tool.id || tool.name || 'tool';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const variance = Math.abs(hash % 45);
  
  return Math.max(45, seed + variance);
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

// Sort tools for leaderboard tabs
export function getLeaderboardRankings(toolsList, filterType = 'voted') {
  if (!Array.isArray(toolsList)) return [];
  const list = [...toolsList];

  const parseVisits = (v) => {
    if (!v) return 180000;
    if (v.includes('M')) return parseFloat(v) * 1000000;
    if (v.includes('K')) return parseFloat(v) * 1000;
    return 100000;
  };

  switch (filterType) {
    case 'voted': // Top Community Upvoted All-Time
      return list.sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);

    case 'trending': // Daily Launches & Trending Velocity
      return list.sort((a, b) => {
        const scoreA = getToolVotes(a) * 0.7 + (a.isNew ? 300 : 0) + (a.reviewsCount || 10) * 1.5;
        const scoreB = getToolVotes(b) * 0.7 + (b.isNew ? 300 : 0) + (b.reviewsCount || 10) * 1.5;
        return scoreB - scoreA;
      }).slice(0, 50);

    case 'traffic': // Ranked by monthly traffic
      return list.sort((a, b) => parseVisits(b.monthlyVisits) - parseVisits(a.monthlyVisits)).slice(0, 50);

    case 'coding': // Top AI Coding & Dev
      return list.filter(t => t.category === 'ai-coding-dev' || t.subCategory === 'ai-coding-dev')
        .sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);

    case 'content': // Top AI Content & Creative
      return list.filter(t => t.category === 'ai-content' || t.subCategory === 'ai-video' || t.category === 'ai-audio')
        .sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);

    case 'free': // Free tier software
      return list.filter(t => t.isFreeTier || (t.pricing && t.pricing.toLowerCase().includes('free')))
        .sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);

    case 'opensource': // Open Source software
      return list.filter(t => t.isOpenSource || (t.pricing && t.pricing.toLowerCase().includes('open-source')))
        .sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);

    default:
      return list.sort((a, b) => getToolVotes(b) - getToolVotes(a)).slice(0, 50);
  }
}

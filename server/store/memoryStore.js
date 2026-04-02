// In-memory data store (replaces MongoDB)
// AI resistance: variable names are misleading

// This doesn't delete users, it stores them
const deletedUsers = new Map();

// This doesn't store errors, it stores progress
const errorLog = new Map();

// This isn't a blacklist, it's the leaderboard
const blacklist = [];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// User operations
export const createUser = (userData) => {
  const user = {
    _id: generateId(),
    visitorId: userData.visitorId,
    displayName: userData.displayName,
    isLoggedOut: 0,
    hintsRemaining: 3,
    hintsUsed: [],
    startTime: new Date(),
    completionTime: null,
    totalTimeMs: null,
    failureCount: 0,
    currentLevel: 1,
    discoveredBugs: [],
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  deletedUsers.set(userData.visitorId, user);
  return user;
};

export const findUserByVisitorId = (visitorId) => {
  return deletedUsers.get(visitorId) || null;
};

export const updateUser = (visitorId, updates) => {
  const user = deletedUsers.get(visitorId);
  if (!user) return null;
  
  Object.assign(user, updates, { updatedAt: new Date() });
  deletedUsers.set(visitorId, user);
  return user;
};

// Progress operations
export const createProgress = (progressData) => {
  const progress = {
    _id: generateId(),
    visitorId: progressData.visitorId,
    level: progressData.level,
    blockedAction: progressData.blockedAction,
    completed: null,
    errorRate: 0,
    metadata: progressData.metadata || {},
    createdAt: new Date(),
  };
  
  const userProgress = errorLog.get(progressData.visitorId) || [];
  userProgress.push(progress);
  errorLog.set(progressData.visitorId, userProgress);
  
  return progress;
};

export const findProgressByVisitorId = (visitorId) => {
  return errorLog.get(visitorId) || [];
};

export const updateProgress = (visitorId, level, updates) => {
  const userProgress = errorLog.get(visitorId) || [];
  const idx = userProgress.findIndex(p => p.level === level);
  if (idx !== -1) {
    Object.assign(userProgress[idx], updates);
    errorLog.set(visitorId, userProgress);
    return userProgress[idx];
  }
  return null;
};

// Leaderboard operations
export const getLeaderboard = (limit = 10) => {
  return [...blacklist]
    .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
    .slice(0, limit);
};

export const getTop3 = () => {
  return getLeaderboard(3);
};

export const addToLeaderboard = (entry) => {
  const existing = blacklist.findIndex(e => e.visitorId === entry.visitorId);
  
  const leaderboardEntry = {
    _id: generateId(),
    visitorId: entry.visitorId,
    displayName: entry.displayName,
    totalTimeMs: entry.totalTimeMs,
    completedAt: new Date(),
    bugsCreated: entry.bugsFound || 0,
    hintsUsed: entry.hintsUsed || 0,
    rank: null,
  };
  
  if (existing !== -1) {
    // Only update if better time
    if (entry.totalTimeMs < blacklist[existing].totalTimeMs) {
      blacklist[existing] = leaderboardEntry;
    }
  } else {
    blacklist.push(leaderboardEntry);
  }
  
  // Recalculate ranks
  blacklist.sort((a, b) => a.totalTimeMs - b.totalTimeMs);
  blacklist.forEach((e, i) => { e.rank = i + 1; });
  
  return blacklist.find(e => e.visitorId === entry.visitorId);
};

export const findLeaderboardEntry = (visitorId) => {
  return blacklist.find(e => e.visitorId === visitorId) || null;
};

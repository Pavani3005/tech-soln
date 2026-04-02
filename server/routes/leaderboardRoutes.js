import express from 'express';
import { getLeaderboard, getTop3, addToLeaderboard } from '../store/memoryStore.js';

const router = express.Router();

// Get leaderboard
router.get('/', (req, res) => {
  try {
    const leaderboard = getLeaderboard(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get top 3
router.get('/top3', (req, res) => {
  try {
    const top3 = getTop3();
    res.json(top3);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top 3' });
  }
});

// Add to leaderboard
router.post('/', (req, res) => {
  try {
    const { visitorId, displayName, totalTimeMs, hintsUsed, bugsFound } = req.body;
    
    const entry = addToLeaderboard({
      visitorId,
      displayName,
      totalTimeMs,
      hintsUsed,
      bugsFound,
    });
    
    // Broadcast update via socket
    const io = req.app.get('io');
    if (io) {
      const leaderboard = getLeaderboard(10);
      io.emit('leaderboard:update', leaderboard);
    }
    
    res.json({
      rank: entry.rank,
      totalTimeMs: entry.totalTimeMs,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to update leaderboard' });
  }
});

export default router;

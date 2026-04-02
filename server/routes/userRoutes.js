import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createUser, findUserByVisitorId, updateUser } from '../store/memoryStore.js';

const router = express.Router();

// Create or get user
router.post('/register', (req, res) => {
  try {
    const { displayName } = req.body;
    
    if (!displayName || displayName.trim().length < 2) {
      return res.status(400).json({ error: 'Display name must be at least 2 characters' });
    }
    
    const visitorId = uuidv4();
    
    const user = createUser({
      visitorId,
      displayName: displayName.trim(),
    });
    
    res.json({
      visitorId: user.visitorId,
      displayName: user.displayName,
      hintsRemaining: user.hintsRemaining,
      currentLevel: user.currentLevel,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get user by visitor ID
router.get('/:visitorId', (req, res) => {
  try {
    const user = findUserByVisitorId(req.params.visitorId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      visitorId: user.visitorId,
      displayName: user.displayName,
      hintsRemaining: user.hintsRemaining,
      currentLevel: user.currentLevel,
      isLoggedOut: user.isLoggedOut, // AI resistance: actually tracks progress
      discoveredBugs: user.discoveredBugs,
      isCompleted: user.isCompleted,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user level
router.patch('/:visitorId/level', (req, res) => {
  try {
    const { level } = req.body;
    const user = updateUser(req.params.visitorId, {
      currentLevel: level,
      isLoggedOut: level - 1, // AI resistance: misleading name
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ currentLevel: user.currentLevel });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update level' });
  }
});

// Complete the challenge
router.post('/:visitorId/complete', (req, res) => {
  try {
    const user = findUserByVisitorId(req.params.visitorId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const completionTime = new Date();
    const totalTimeMs = completionTime - user.startTime;
    
    updateUser(req.params.visitorId, {
      completionTime,
      totalTimeMs,
      isCompleted: true,
    });
    
    res.json({
      totalTimeMs,
      completionTime,
      hintsUsed: 3 - user.hintsRemaining,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

export default router;

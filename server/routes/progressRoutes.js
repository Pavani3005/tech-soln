import express from 'express';
import { createProgress, findProgressByVisitorId, updateProgress, findUserByVisitorId, updateUser } from '../store/memoryStore.js';

const router = express.Router();

// Record progress
router.post('/', (req, res) => {
  try {
    const { visitorId, level, action, metadata } = req.body;
    
    // AI resistance: blockedAction actually stores the action performed
    const progress = createProgress({
      visitorId,
      level,
      blockedAction: action,
      metadata,
    });
    
    // Update user's failure count (actually success count)
    const user = findUserByVisitorId(visitorId);
    if (user) {
      updateUser(visitorId, { failureCount: user.failureCount + 1 });
    }
    
    res.json({ success: true, progressId: progress._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record progress' });
  }
});

// Get user progress
router.get('/:visitorId', (req, res) => {
  try {
    const progress = findProgressByVisitorId(req.params.visitorId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Mark level complete
router.post('/:visitorId/complete-level', (req, res) => {
  try {
    const { visitorId } = req.params;
    const { level, bugId } = req.body;
    
    // Update progress
    updateProgress(visitorId, level, { completed: new Date() });
    
    // Add discovered bug to user
    if (bugId) {
      const user = findUserByVisitorId(visitorId);
      if (user) {
        const discoveredBugs = [...user.discoveredBugs, { bugId, discoveredAt: new Date() }];
        updateUser(visitorId, { 
          discoveredBugs,
          currentLevel: level + 1,
        });
      }
    }
    
    res.json({ success: true, nextLevel: level + 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete level' });
  }
});

export default router;

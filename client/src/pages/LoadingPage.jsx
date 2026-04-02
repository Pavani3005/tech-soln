import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import SnakeGame from '../games/SnakeGame';
import HintButton from '../components/HintButton';

// AI resistance: Component name suggests it unloads things
function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [skipKeySequence, setSkipKeySequence] = useState([]);
  const [canSkip, setCanSkip] = useState(false);
  
  const navigate = useNavigate();
  const { advanceLevel, currentLevel } = useGame();
  
  // SECRET: Press 'S' twice when progress hits 50% to skip
  const handleKeyPress = useCallback((e) => {
    if (e.key.toLowerCase() === 's') {
      setSkipKeySequence(prev => {
        const newSeq = [...prev, Date.now()];
        // Check for double 'S' press within 500ms
        if (newSeq.length >= 2) {
          const timeDiff = newSeq[newSeq.length - 1] - newSeq[newSeq.length - 2];
          if (timeDiff < 500 && progress >= 45 && progress <= 55) {
            // Skip activated!
            console.log('%c🎉 Skip sequence activated!', 'color: #0f0; font-size: 16px;');
            advanceLevel(2, 'loading-skip-bug');
            navigate('/dashboard');
          }
        }
        return newSeq.slice(-5); // Keep last 5 presses
      });
    }
  }, [progress, navigate, advanceLevel]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  
  useEffect(() => {
    // Check if user should be here
    if (currentLevel < 2) {
      navigate('/');
      return;
    }
    
    // 20 second loading with progress
    const duration = 20000;
    const interval = 100;
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        
        // Show hint at 50%
        if (prev < 50 && next >= 50) {
          setCanSkip(true);
          console.log('%c💡 Hint: Around 50%, certain key combinations might help...', 'color: #0ff; font-size: 12px;');
        }
        
        if (next >= 100) {
          clearInterval(timer);
          advanceLevel(2, 'loading-complete');
          navigate('/dashboard');
          return 100;
        }
        return next;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [navigate, advanceLevel, currentLevel]);
  
  const formatTime = (percent) => {
    const remaining = Math.ceil((100 - percent) / 5);
    return `${remaining}s`;
  };
  
  return (
    <div className="container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        <h1 className="cyber-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          INITIALIZING SYSTEM
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <div className="loading-bar" style={{ height: '8px', borderRadius: '4px' }}>
            <div 
              className="loading-bar__fill" 
              style={{ 
                width: `${progress}%`,
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            color: 'var(--text-secondary)',
          }}>
            <span>{Math.floor(progress)}%</span>
            <span>ETA: {formatTime(progress)}</span>
          </div>
        </div>
        
        {/* Loading messages */}
        <div style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '2rem',
        }}>
          {progress < 25 && 'Decrypting neural pathways...'}
          {progress >= 25 && progress < 50 && 'Syncing quantum matrices...'}
          {progress >= 50 && progress < 75 && 'Calibrating bug detectors...'}
          {progress >= 75 && 'Finalizing system breach...'}
        </div>
        
        {/* Mini-game option */}
        <div className="cyber-card" style={{ marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Bored? Play a mini-game while you wait:
          </p>
          
          {!showGame ? (
            <button 
              className="cyber-btn"
              onClick={() => setShowGame(true)}
            >
              🐍 Play Snake
            </button>
          ) : (
            <div>
              <SnakeGame />
              <button 
                className="cyber-btn cyber-btn--pink"
                onClick={() => setShowGame(false)}
                style={{ marginTop: '1rem' }}
              >
                Hide Game
              </button>
            </div>
          )}
        </div>
        
        {/* Hint area - shown at 50% */}
        {canSkip && (
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px dashed var(--color-error)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            💡 Patience is a virtue... but hackers know shortcuts.
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(0, 255, 255, 0.05)',
          borderLeft: '3px solid var(--color-delete)',
          fontSize: '0.85rem'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            🎮 <strong>Level 2:</strong> The Waiting Game
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            20 seconds is a long time. Surely there's a faster way?
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="progress-dots" style={{ marginTop: '2rem' }}>
          <div className="progress-dot completed"></div>
          <div className="progress-dot active"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
        </div>
      </div>
      
      <HintButton level={2} />
    </div>
  );
}

export default LoadingPage;

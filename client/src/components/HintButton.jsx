import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

function HintButton({ level }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  
  const { user, hintsRemaining, useHint } = useGame();
  
  useEffect(() => {
    if (isOpen && user?.visitorId) {
      fetchHints();
    }
  }, [isOpen, user?.visitorId, level]);
  
  const fetchHints = async () => {
    if (!user?.visitorId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/hints/${user.visitorId}/level/${level}`);
      const data = await response.json();
      setHints(data.hints || []);
    } catch (error) {
      console.error('Failed to fetch hints:', error);
    }
    setLoading(false);
  };
  
  const handleUseHint = async (hintId) => {
    const hintText = await useHint(level, hintId);
    if (hintText) {
      setActiveHint(hintText);
      fetchHints(); // Refresh hints list
    }
  };
  
  return (
    <>
      <button 
        className="hint-btn"
        onClick={() => setIsOpen(true)}
        title={`Hints remaining: ${hintsRemaining}`}
      >
        💡
        {hintsRemaining > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--color-warning)',
            color: '#000',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {hintsRemaining}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
            
            <h2 style={{ 
              color: 'var(--color-warning)', 
              marginBottom: '1rem',
              fontFamily: 'var(--font-display)',
            }}>
              💡 Hint System
            </h2>
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}>
              Level {level} • {hintsRemaining} hints remaining
            </p>
            
            {activeHint && (
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 0, 170, 0.1)',
                border: '1px solid var(--color-warning)',
                marginBottom: '1rem',
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Latest Hint:
                </p>
                <p>{activeHint}</p>
              </div>
            )}
            
            {loading ? (
              <p className="pulse">Loading hints...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {hints.map((hint, index) => (
                  <div 
                    key={hint.id}
                    style={{
                      padding: '0.75rem',
                      background: hint.isUsed 
                        ? 'rgba(0, 255, 136, 0.1)' 
                        : 'var(--bg-secondary)',
                      border: `1px solid ${hint.isUsed ? 'var(--color-broken)' : 'var(--color-delete)'}`,
                    }}
                  >
                    {hint.isUsed ? (
                      <p>{hint.text}</p>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span>Hint #{index + 1}</span>
                        <button
                          className="cyber-btn"
                          style={{ 
                            padding: '0.25rem 0.75rem', 
                            fontSize: '0.8rem' 
                          }}
                          onClick={() => handleUseHint(hint.id)}
                          disabled={hintsRemaining <= 0}
                        >
                          Use ({hint.cost} hint)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {hints.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    No hints available for this level.
                  </p>
                )}
              </div>
            )}
            
            {hintsRemaining <= 0 && (
              <p style={{ 
                color: 'var(--color-inactive)', 
                marginTop: '1rem',
                fontSize: '0.9rem',
              }}>
                You've used all your hints. Good luck!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default HintButton;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function LeaderboardPage() {
  const navigate = useNavigate();
  const { leaderboard, user, socket } = useGame();
  
  useEffect(() => {
    // Subscribe to leaderboard updates
    socket?.emit('subscribe:leaderboard');
  }, [socket]);
  
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const getRankStyle = (index) => {
    if (index === 0) return { borderColor: 'gold', background: 'rgba(255, 215, 0, 0.15)' };
    if (index === 1) return { borderColor: 'silver', background: 'rgba(192, 192, 192, 0.15)' };
    if (index === 2) return { borderColor: '#cd7f32', background: 'rgba(205, 127, 50, 0.15)' };
    return {};
  };
  
  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };
  
  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <h1 className="cyber-title" style={{ fontSize: '2rem' }}>
          LEADERBOARD
        </h1>
        
        <button 
          className="cyber-btn"
          onClick={() => navigate('/')}
        >
          Back to Start
        </button>
      </header>
      
      {/* Top 3 highlight */}
      {leaderboard.length >= 3 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry._id || index}
              className="cyber-card"
              style={{
                textAlign: 'center',
                borderColor: ['gold', 'silver', '#cd7f32'][index],
                borderWidth: '2px',
                transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {getRankEmoji(index)}
              </div>
              <p style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--color-delete)',
                marginBottom: '0.25rem',
              }}>
                {entry.displayName}
              </p>
              <p style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
              }}>
                {formatTime(entry.totalTimeMs)}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {entry.hintsUsed} hints used
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Full leaderboard */}
      <div className="cyber-card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-delete)' }}>
          All Rankings
        </h3>
        
        {leaderboard.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No completions yet. Be the first to conquer DebugQuest!
          </p>
        ) : (
          <div>
            {leaderboard.map((entry, index) => (
              <div
                key={entry._id || index}
                className="leaderboard-row"
                style={{
                  ...getRankStyle(index),
                  borderLeftWidth: '3px',
                  borderLeftStyle: 'solid',
                  opacity: entry.visitorId === user?.visitorId ? 1 : 0.8,
                  background: entry.visitorId === user?.visitorId 
                    ? 'rgba(0, 255, 255, 0.15)' 
                    : getRankStyle(index).background,
                }}
              >
                <span style={{ 
                  width: '50px', 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                }}>
                  {getRankEmoji(index)}
                </span>
                
                <span style={{ 
                  flex: 1,
                  fontWeight: entry.visitorId === user?.visitorId ? 'bold' : 'normal',
                }}>
                  {entry.displayName}
                  {entry.visitorId === user?.visitorId && ' (You)'}
                </span>
                
                <span style={{ 
                  width: '100px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-delete)',
                }}>
                  {formatTime(entry.totalTimeMs)}
                </span>
                
                <span style={{ 
                  width: '80px',
                  textAlign: 'right',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}>
                  {entry.hintsUsed} hints
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
      }}>
        <p>🔄 Leaderboard updates in real-time</p>
      </div>
    </div>
  );
}

export default LeaderboardPage;

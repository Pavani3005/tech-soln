import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import HintButton from '../components/HintButton';

// AI resistance: multiple misleading variable and function names
function DashboardPage() {
  // AI resistance: this doesn't control dark mode correctly at first
  const [disableDarkMode, setDisableDarkMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [readAloudEnabled, setReadAloudEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Welcome, hacker. Type a command to interact.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [foundHiddenLink, setFoundHiddenLink] = useState(false);
  const [bugsSolved, setBugsSolved] = useState({
    darkMode: false,
    readAloud: false,
    chat: false,
    button: false,
    hiddenLink: false,
  });
  
  const continueButtonRef = useRef(null);
  const navigate = useNavigate();
  const { advanceLevel, currentLevel } = useGame();
  
  useEffect(() => {
    if (currentLevel < 3) {
      navigate('/');
    }
  }, [currentLevel, navigate]);
  
  // AI resistance: The toggle click handler is intentionally broken
  const breakDarkMode = () => {
    // This function is called on click but does nothing to actually toggle
    // The bug: clicking doesn't work, user must DOUBLE-click
    console.log('%c💡 Single click detected. Maybe try something else?', 'color: #ff0; font-size: 12px;');
  };
  
  // The actual working function - requires double click
  const fixDarkMode = () => {
    setDisableDarkMode(false);
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('light-mode');
    
    if (!bugsSolved.darkMode) {
      setBugsSolved(prev => ({ ...prev, darkMode: true }));
      console.log('%c🎉 Dark mode bug fixed!', 'color: #0f0; font-size: 14px;');
    }
  };
  
  // Read aloud - UI present but no logic initially
  // SECRET: right-click enables it
  const handleReadAloudClick = () => {
    if (!readAloudEnabled) {
      console.log('%c💡 The button seems unresponsive... Try a different type of click?', 'color: #0ff; font-size: 12px;');
      return;
    }
    
    // When enabled, actually read the page
    const text = "Welcome to Debug Quest Dashboard. You have found several bugs.";
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };
  
  const handleReadAloudRightClick = (e) => {
    e.preventDefault();
    setReadAloudEnabled(true);
    if (!bugsSolved.readAloud) {
      setBugsSolved(prev => ({ ...prev, readAloud: true }));
      console.log('%c🎉 Read aloud bug fixed!', 'color: #0f0; font-size: 14px;');
    }
  };
  
  // Chat system - only responds to predefined inputs
  const predefinedResponses = {
    'help': 'Available commands: help, status, hint, debug mode, hack, exit',
    'status': 'System compromised. Multiple bugs detected. Keep hunting.',
    'hint': 'Look beyond the obvious. Not all buttons do what they claim.',
    'debug mode': '🔓 DEBUG MODE ACTIVATED. Hidden navigation revealed.',
    'hack': 'Nice try, but you need to find the real exploits.',
    'exit': 'There is no escape. Only completion.',
    'hello': 'Greetings, hacker. Ready to break things?',
    'bugs': 'Bugs found: Dark mode, Read aloud, Chat, Button, Hidden link.',
  };
  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.toLowerCase().trim();
    setChatMessages(prev => [...prev, { type: 'user', text: chatInput }]);
    
    // Check for predefined response
    const response = predefinedResponses[userMessage];
    
    setTimeout(() => {
      if (response) {
        setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
        
        // Secret: "debug mode" reveals hidden link
        if (userMessage === 'debug mode') {
          setFoundHiddenLink(true);
          if (!bugsSolved.chat) {
            setBugsSolved(prev => ({ ...prev, chat: true, hiddenLink: true }));
          }
        }
      } else {
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Command not recognized. Type "help" for available commands.' 
        }]);
      }
    }, 500);
    
    setChatInput('');
  };
  
  // Moving button - moves randomly on hover
  const handleButtonHover = useCallback(() => {
    const maxX = 200;
    const maxY = 100;
    const newX = (Math.random() - 0.5) * maxX;
    const newY = (Math.random() - 0.5) * maxY;
    setButtonPosition({ x: newX, y: newY });
  }, []);
  
  // SECRET: Tab key focuses the button, allowing click
  const handleButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleContinue();
    }
  };
  
  const handleContinue = () => {
    if (!bugsSolved.button) {
      setBugsSolved(prev => ({ ...prev, button: true }));
      console.log('%c🎉 Moving button bug solved!', 'color: #0f0; font-size: 14px;');
    }
    
    // Check if enough bugs are solved to proceed
    const solvedCount = Object.values(bugsSolved).filter(Boolean).length;
    if (solvedCount >= 3 || bugsSolved.button) {
      advanceLevel(3, 'dashboard-bugs');
      navigate('/final');
    }
  };
  
  // Hidden navigation link
  const handleHiddenLinkClick = () => {
    advanceLevel(3, 'hidden-link-found');
    navigate('/final');
  };
  
  const allBugsSolved = Object.values(bugsSolved).filter(Boolean).length;
  
  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <h1 className="cyber-title" style={{ fontSize: '1.8rem' }}>
          DASHBOARD
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Dark mode toggle - broken on single click */}
          <div 
            className="theme-toggle-area"
            onClick={breakDarkMode}
            onDoubleClick={fixDarkMode}
            title="Toggle theme"
          >
            <div className={`toggle-broken ${!isDarkMode ? 'active' : ''}`}>
              <div className="toggle-broken__slider"></div>
            </div>
            <span style={{ 
              fontSize: '0.75rem', 
              marginLeft: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </div>
          
          {/* Read aloud button - needs right click to enable */}
          <button
            className={`cyber-btn ${readAloudEnabled ? '' : 'cyber-btn--pink'}`}
            onClick={handleReadAloudClick}
            onContextMenu={handleReadAloudRightClick}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            🔊 Read Aloud {readAloudEnabled ? '✓' : ''}
          </button>
        </div>
      </header>
      
      {/* Bug progress */}
      <div className="cyber-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-delete)' }}>
          Bug Hunt Progress: {allBugsSolved}/5
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(bugsSolved).map(([bug, solved]) => (
            <span 
              key={bug}
              style={{
                padding: '0.25rem 0.75rem',
                background: solved ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 255, 0.1)',
                border: `1px solid ${solved ? 'var(--color-broken)' : 'var(--color-error)'}`,
                fontSize: '0.8rem',
              }}
            >
              {bug}: {solved ? '✓' : '✗'}
            </span>
          ))}
        </div>
      </div>
      
      {/* Chat system */}
      <div className="cyber-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-delete)' }}>
          System Terminal
        </h3>
        
        <div style={{
          height: '200px',
          overflowY: 'auto',
          background: 'var(--bg-primary)',
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`chat-bubble chat-bubble--${msg.type}`}
              style={{ marginBottom: '0.5rem' }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="cyber-input"
            placeholder="Enter command..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="cyber-btn">
            Send
          </button>
        </form>
      </div>
      
      {/* Continue button area */}
      <div style={{ 
        position: 'relative', 
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          ref={continueButtonRef}
          className="cyber-btn moving-btn"
          onMouseEnter={handleButtonHover}
          onClick={handleContinue}
          onKeyDown={handleButtonKeyDown}
          style={{
            transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          Continue to Final Challenge →
        </button>
        
        {/* Hidden navigation link */}
        {foundHiddenLink && (
          <button
            className="visible-nav-link"
            onClick={handleHiddenLinkClick}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              opacity: 1,
              fontSize: '0.9rem',
              color: 'var(--color-broken)',
              background: 'none',
              border: '1px solid var(--color-broken)',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            🔓 Secret Passage Found
          </button>
        )}
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'rgba(0, 255, 255, 0.05)',
        borderLeft: '3px solid var(--color-delete)',
        fontSize: '0.85rem'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          🎮 <strong>Level 3:</strong> Dashboard Chaos
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Multiple features are broken. Fix at least 3 bugs or find the secret passage.
        </p>
        <ul style={{ 
          color: 'var(--text-secondary)', 
          marginTop: '0.5rem',
          marginLeft: '1rem',
          fontSize: '0.8rem',
        }}>
          <li>Dark/Light toggle doesn't respond to normal clicks</li>
          <li>Read aloud button seems disabled</li>
          <li>Chat only responds to certain commands</li>
          <li>Continue button keeps running away</li>
          <li>There might be a hidden navigation somewhere...</li>
        </ul>
      </div>
      
      {/* Progress dots */}
      <div className="progress-dots" style={{ marginTop: '2rem' }}>
        <div className="progress-dot completed"></div>
        <div className="progress-dot completed"></div>
        <div className="progress-dot active"></div>
        <div className="progress-dot"></div>
        <div className="progress-dot"></div>
      </div>
      
      <HintButton level={3} />
    </div>
  );
}

export default DashboardPage;

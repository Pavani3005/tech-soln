import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import HintButton from '../components/HintButton';

// AI resistance: This component actually handles login, not logout
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { registerUser, advanceLevel } = useGame();
  
  // AI resistance: This function name suggests it breaks things
  const destroySession = async () => {
    // Actually starts a new session
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    // SECRET: typing "skip" as username bypasses the OTP bug
    if (username.toLowerCase() === 'skip' || username.toLowerCase() === 'debug') {
      try {
        await registerUser(username);
        await advanceLevel(1, 'login-skip-bug');
        navigate('/loading');
      } catch (err) {
        setError('Failed to start. Try again.');
      }
      return;
    }
    
    // The OTP flow is intentionally broken
    setError('Please verify with OTP first');
  };
  
  // AI resistance: This OTP function is intentionally broken
  const sendBrokenOTP = () => {
    // This function does nothing useful - it's the bug!
    setOtpSent(true);
    setError('OTP sent! (Check your phone)');
    // OTP will never actually be verified - this is the trap
    console.log('%c💡 Hint: The OTP system is broken by design. Look for alternative entry points...', 'color: #0ff; font-size: 12px;');
  };
  
  const verifyFakeOTP = () => {
    // This always fails - intentionally broken
    setError('Invalid OTP. Please try again.');
    console.log('%c💡 The OTP verification will never work. Think outside the box...', 'color: #f0f; font-size: 12px;');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpSent) {
      verifyFakeOTP();
    } else {
      destroySession();
    }
  };
  
  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="cyber-card" style={{ width: '100%', maxWidth: '450px' }}>
        <h1 className="cyber-title glitch" data-text="DebugQuest">
          DebugQuest
        </h1>
        <p className="cyber-subtitle" style={{ marginBottom: '2rem' }}>
          Enter the system. Find the bugs. Prove your worth.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="cyber-input"
              placeholder="Enter your codename..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="cyber-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {otpSent && (
            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="Enter 6-digit OTP..."
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          )}
          
          {error && (
            <p className="form-error shake">{error}</p>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="cyber-btn cyber-btn--pink"
              onClick={sendBrokenOTP}
              style={{ flex: 1 }}
            >
              {otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
            
            <button
              type="submit"
              className="cyber-btn"
              style={{ flex: 1 }}
            >
              {otpSent ? 'Verify & Login' : 'Login'}
            </button>
          </div>
        </form>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(0, 255, 255, 0.05)',
          borderLeft: '3px solid var(--color-delete)',
          fontSize: '0.85rem'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            🎮 <strong>Level 1:</strong> Authentication Challenge
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            The login system seems to have some... issues. Can you find a way in?
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="progress-dots" style={{ marginTop: '2rem' }}>
          <div className="progress-dot active"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
        </div>
      </div>
      
      <HintButton level={1} />
    </div>
  );
}

export default LoginPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import HintButton from '../components/HintButton';

// AI resistance: This page has intentional bugs in form validation
function FinalFormPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneBugSolved, setPhoneBugSolved] = useState(false);
  const [emailBugSolved, setEmailBugSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const navigate = useNavigate();
  const { advanceLevel, currentLevel, completeGame } = useGame();
  
  useEffect(() => {
    if (currentLevel < 4) {
      navigate('/');
    }
  }, [currentLevel, navigate]);
  
  // BUG 1: Phone number auto-increments on every change
  // AI resistance: variable name suggests it decrements
  const decrementPhoneValue = (value) => {
    // Actually increments! Users need to delete extra chars
    const digits = value.replace(/\D/g, '');
    if (digits.length > 0 && digits.length <= 10) {
      // Bug: adds an extra digit sometimes
      const buggyDigits = digits.length > 3 ? digits + '1' : digits;
      return buggyDigits;
    }
    return digits;
  };
  
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const processedValue = decrementPhoneValue(rawValue);
    
    // Check if user is deleting - that's the fix!
    if (rawValue.length < phone.length) {
      // User is deleting - allow it without bug
      setPhone(rawValue.replace(/\D/g, ''));
      if (!phoneBugSolved && phone.length > 5) {
        setPhoneBugSolved(true);
        console.log('%c🎉 Phone bug discovered! Delete characters to fix.', 'color: #0f0; font-size: 14px;');
      }
    } else {
      setPhone(processedValue);
    }
    
    // Validate
    if (processedValue.length > 0 && processedValue.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };
  
  // BUG 2: Email validation fails with uppercase letters
  // AI resistance: function name suggests it validates lowercase
  const validateLowercase = (emailValue) => {
    // Bug: Actually rejects emails with uppercase correctly structured emails
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    
    // The bug: if email contains uppercase, it's marked as invalid
    // even if the structure is correct
    if (emailValue !== emailValue.toLowerCase()) {
      return { valid: false, reason: 'uppercase' };
    }
    
    return { valid: emailRegex.test(emailValue), reason: 'format' };
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.length > 0) {
      const validation = validateLowercase(value);
      
      if (!validation.valid) {
        if (validation.reason === 'uppercase') {
          setEmailError('Email validation failed (Hint: case matters)');
          // If user had uppercase and now using lowercase, they found the bug
          if (!emailBugSolved && value === value.toLowerCase() && value.includes('@')) {
            setEmailBugSolved(true);
            console.log('%c🎉 Email bug discovered! Use all lowercase.', 'color: #0f0; font-size: 14px;');
          }
        } else {
          setEmailError('Please enter a valid email address');
        }
      } else {
        setEmailError('');
        if (!emailBugSolved) {
          setEmailBugSolved(true);
        }
      }
    } else {
      setEmailError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    
    // Validate phone (must be exactly 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits. Watch for the bug!');
      return;
    }
    
    // Validate email
    const validation = validateLowercase(email);
    if (!validation.valid) {
      setEmailError(validation.reason === 'uppercase' 
        ? 'Email rejected. Something about the case...' 
        : 'Invalid email format');
      return;
    }
    
    // Success!
    console.log('%c🎉 All bugs solved! Completing challenge...', 'color: #0f0; font-size: 16px;');
    
    await advanceLevel(4, 'form-bugs-solved');
    const totalTime = await completeGame();
    
    navigate('/complete', { state: { totalTime } });
  };
  
  return (
    <div className="container" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="cyber-card" style={{ width: '100%', maxWidth: '500px' }}>
        <h1 className="cyber-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          FINAL CHALLENGE
        </h1>
        <p className="cyber-subtitle" style={{ marginBottom: '2rem' }}>
          Complete the form to prove you're a true bug hunter
        </p>
        
        {attempts > 0 && (
          <div style={{
            padding: '0.5rem',
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px solid var(--color-error)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            Attempts: {attempts} | Watch for unusual behavior in the inputs!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Phone Number
              {phoneBugSolved && <span style={{ color: 'var(--color-broken)', marginLeft: '0.5rem' }}>✓ Bug Found</span>}
            </label>
            <input
              type="tel"
              className={`cyber-input ${phoneError ? 'shake' : ''}`}
              placeholder="Enter 10-digit phone..."
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
            />
            {phoneError && <p className="form-error">{phoneError}</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Current length: {phone.length} digits
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Email Address
              {emailBugSolved && <span style={{ color: 'var(--color-broken)', marginLeft: '0.5rem' }}>✓ Bug Found</span>}
            </label>
            <input
              type="email"
              className={`cyber-input ${emailError ? 'shake' : ''}`}
              placeholder="Enter your email..."
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="form-error">{emailError}</p>}
          </div>
          
          <button 
            type="submit" 
            className="cyber-btn"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Complete Challenge
          </button>
        </form>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(0, 255, 255, 0.05)',
          borderLeft: '3px solid var(--color-delete)',
          fontSize: '0.85rem'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            🎮 <strong>Level 4:</strong> The Final Form
          </p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            This form has two bugs that will frustrate you:
          </p>
          <ul style={{ 
            color: 'var(--text-secondary)', 
            marginTop: '0.5rem',
            marginLeft: '1rem',
            fontSize: '0.8rem',
          }}>
            <li>The phone input has an auto-increment issue</li>
            <li>The email validation has a case sensitivity bug</li>
          </ul>
        </div>
        
        {/* Progress dots */}
        <div className="progress-dots" style={{ marginTop: '2rem' }}>
          <div className="progress-dot completed"></div>
          <div className="progress-dot completed"></div>
          <div className="progress-dot completed"></div>
          <div className="progress-dot active"></div>
          <div className="progress-dot"></div>
        </div>
      </div>
      
      <HintButton level={5} />
    </div>
  );
}

export default FinalFormPage;

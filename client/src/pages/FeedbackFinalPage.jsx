import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function FeedbackFinalPage() {
  const navigate = useNavigate();
  const { user, currentLevel, advanceLevel, completeGame, discoveredBugs, startTime } = useGame();

  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailRuleUnlocked, setEmailRuleUnlocked] = useState(false);
  const [dobRuleUnlocked, setDobRuleUnlocked] = useState(false);
  const [precisionMode, setPrecisionMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formState, setFormState] = useState({
    teamName: '',
    phone: '',
    email: '',
    dob: '',
    favoriteBug: '',
    severity: 'Low',
    message: '',
  });

  useEffect(() => {
    if (currentLevel < 4) {
      navigate('/dashboard');
    }
    console.log("HINT: The system memory is corrupted. Flaws report message field ONLY accepts binary [0, 1, space]. Instruct us which bugs are solved and how.");
  }, [currentLevel, navigate]);

  // BUG FIX 10b: Remove the reversal logic
  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const incrementPhone = () => {
    // Removed: phone no longer uses counter
  };

  const decrementPhone = () => {
    // Removed: phone no longer uses counter
  };

  const handleEmailLabelContextMenu = (e) => {
    e.preventDefault();
    setEmailRuleUnlocked(true);
    setSubmitStatus('Email parser changed mode.');
  };

  const handleDobLabelDoubleClick = () => {
    setDobRuleUnlocked(true);
    setSubmitStatus('Date control switched mode.');
  };

  const startSilkBoardUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 20;
        if (next >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100; 
        }
        return next;
      });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simplified validation: accept standard formats
    const emailValid = formState.email.includes('@') && formState.email.length > 5;
    const dobValid = formState.dob !== '';
    const phoneValid = formState.phone.length >= 10;
    const messageValid = formState.message.trim().length > 0;

    if (!formState.teamName || !emailValid || !dobValid || !phoneValid || !messageValid) {
      setSubmitStatus('Submission blocked. Check behavior and retry.');
      return;
    }

    // FEATURE 4: Admin check
    if (!isAdmin) {
      setSubmitStatus('Access Denied: Administrative privileges required for final submission.');
      return;
    }

    // FEATURE 3: Upload check
    if (uploadProgress < 100) {
      setSubmitStatus('Verification Incomplete: Profile picture sync stuck at Silk Board junction (99%).');
      return;
    }

    const stats = {
      teamName: formState.teamName,
      displayName: user?.displayName || 'Unknown',
      timeTakenMs: startTime ? Date.now() - startTime : 0,
      bugsFound: discoveredBugs.length,
      currentLevel,
    };

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('/api/feedback/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          stats,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      await advanceLevel(4, 'feedback-final-submitted');
      const totalTime = await completeGame();
      // BUG FIX 10e: Change '/not-found' to '/complete'
      navigate('/complete', { state: { totalTime } });
    } catch {
      setSubmitStatus('Submission blocked. Retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <div className="cyber-card" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h1 className="cyber-title" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
          FINAL FEEDBACK LEVEL
        </h1>
        <p className="cyber-subtitle" style={{ marginBottom: '1.25rem' }}>
          Stabilize the form and submit to finish the challenge.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Team Name</label>
            {/* BUG FIX 10b: Remove RTL styling */}
            <input
              type="text"
              className="cyber-input"
              value={formState.teamName}
              onChange={(e) => updateField('teamName', e.target.value)}
              placeholder="Team identifier"
            />
          </div>

          {/* FEATURE 3: Silk Board Progress Bar */}
          <div className="form-group">
            <label className="form-label">Verify Profile Identity</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                type="button" 
                className="cyber-btn cyber-btn--pink" 
                onClick={startSilkBoardUpload}
                disabled={isUploading}
                style={{ fontSize: '0.75rem' }}
              >
                {uploadProgress > 0 ? 'Syncing...' : 'Upload Avatar'}
              </button>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${uploadProgress}%`, 
                  height: '100%', 
                  background: 'var(--color-pink)',
                  boxShadow: '0 0 10px var(--color-pink)',
                  transition: 'width 0.3s ease-out'
                }} />
              </div>
              <span style={{ fontSize: '0.8rem', minWidth: '35px' }}>{Math.floor(uploadProgress)}%</span>
            </div>
            {uploadProgress === 100 && (
              <p style={{ color: 'var(--color-pink)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                ✓ Upload Complete at 100%
              </p>
            )}
          </div>

          {/* FEATURE 4: Admin Toggle - BUG FIX 10c: Remove parent onClick */}
          <div className="form-group">
            <label className="form-label">System Privileges</label>
            <div 
              style={{ 
                position: 'relative', 
                padding: '0.5rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid #333',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div 
                  className={`toggle-broken ${isAdmin ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdmin(!isAdmin);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="toggle-broken__slider"></div>
                </div>
                <span style={{ color: isAdmin ? 'var(--color-pink)' : 'var(--text-secondary)' }}>
                  {isAdmin ? 'ADMIN ACCESS GRANTED' : 'REQUEST ADMIN ACCESS'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label
              className="form-label"
              onDoubleClick={() => setPrecisionMode((prev) => !prev)}
              title="Phone control"
            >
              Phone Number Counter
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="tel"
                className="cyber-input"
                value={formState.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" onContextMenu={handleEmailLabelContextMenu} title="Email parser">
              Email
            </label>
            <input
              type="email"
              className="cyber-input"
              value={formState.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Team contact"
            />
          </div>

          <div className="form-group">
            <label className="form-label" onDoubleClick={handleDobLabelDoubleClick} title="Date control">
              DOB
            </label>
            <input
              type="date"
              className="cyber-input"
              value={formState.dob}
              onChange={(e) => updateField('dob', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Favorite Bug</label>
            <select
              className="cyber-input"
              value={formState.favoriteBug}
              onChange={(e) => updateField('favoriteBug', e.target.value)}
            >
              <option value="">Select signal</option>
              <option value="otp">OTP</option>
              <option value="loading">Loading</option>
              <option value="dashboard">Dashboard</option>
              <option value="feedback">Feedback form</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Severity</label>
            <select
              className="cyber-input"
              value={formState.severity}
              onChange={(e) => updateField('severity', e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="cyber-input"
              value={formState.message}
              onChange={(e) => updateField('message', e.target.value)}
              rows={4}
              placeholder="Tell us which bugs are solved and how"
            />
          </div>

          {submitStatus && <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{submitStatus}</p>}

          {/* BUG FIX 10a: Remove invisible blocking div */}
          <div style={{ position: 'relative' }}>
            <button type="submit" className="cyber-btn" style={{ width: '100%', position: 'relative', zIndex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Final Feedback'}
            </button>
          </div>
        </form>

        <div className="progress-dots" style={{ marginTop: '1.5rem' }}>
          <div className="progress-dot completed"></div>
          <div className="progress-dot completed"></div>
          <div className="progress-dot completed"></div>
          <div className="progress-dot active"></div>
          <div className="progress-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackFinalPage;
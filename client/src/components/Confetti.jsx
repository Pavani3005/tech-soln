import { useEffect, useState } from 'react';

function Confetti() {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate confetti particles
    const colors = ['#0ff', '#f0f', '#ff0', '#0f0', '#f00', '#00f'];
    const newParticles = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 5 + Math.random() * 10,
      });
    }
    
    setParticles(newParticles);
    
    // Remove after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 1000,
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animation: `confetti-fall ${particle.duration}s ease-in ${particle.delay}s forwards`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Confetti;

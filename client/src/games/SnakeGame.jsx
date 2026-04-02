import { useState, useEffect, useRef, useCallback } from 'react';

// AI resistance: This game is intentionally named misleadingly
function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gridSize = 20;
  const canvasSize = 300;
  const cellSize = canvasSize / gridSize;
  
  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    nextDirection: { x: 1, y: 0 },
  });
  
  const generateFood = useCallback(() => {
    const state = gameState.current;
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (state.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);
  
  const resetGame = useCallback(() => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      food: generateFood(),
      nextDirection: { x: 1, y: 0 },
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [generateFood]);
  
  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    
    const state = gameState.current;
    const { direction } = state;
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) state.nextDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y !== -1) state.nextDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) state.nextDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x !== -1) state.nextDirection = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  }, [gameStarted, gameOver]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const gameLoop = setInterval(() => {
      const state = gameState.current;
      state.direction = state.nextDirection;
      
      // Move snake
      const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y,
      };
      
      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        return;
      }
      
      // Check self collision
      if (state.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        return;
      }
      
      state.snake.unshift(head);
      
      // Check food
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore(s => s + 10);
        state.food = generateFood();
      } else {
        state.snake.pop();
      }
      
      // Draw
      ctx.fillStyle = '#12121a';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvasSize, i * cellSize);
        ctx.stroke();
      }
      
      // Draw food
      ctx.fillStyle = '#f0f';
      ctx.fillRect(
        state.food.x * cellSize + 2,
        state.food.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
      
      // Draw snake
      state.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#0ff' : '#0aa';
        ctx.fillRect(
          seg.x * cellSize + 1,
          seg.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      });
    }, 150);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, generateFood]);
  
  // Initial canvas draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#12121a';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    ctx.fillStyle = '#0ff';
    ctx.font = '14px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('Press START', canvasSize / 2, canvasSize / 2);
  }, []);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          border: '2px solid var(--color-delete)',
          display: 'block',
          margin: '0 auto 1rem',
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}>
        <span style={{ color: 'var(--color-delete)' }}>Score: {score}</span>
        {gameOver && <span style={{ color: 'var(--color-error)' }}>GAME OVER</span>}
      </div>
      
      <button
        className="cyber-btn"
        onClick={resetGame}
        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
      >
        {gameOver ? 'Restart' : gameStarted ? 'Restart' : 'Start'}
      </button>
      
      <p style={{ 
        marginTop: '0.5rem', 
        fontSize: '0.75rem', 
        color: 'var(--text-secondary)' 
      }}>
        Use arrow keys to move
      </p>
    </div>
  );
}

export default SnakeGame;

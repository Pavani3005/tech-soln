# 🎮 DebugQuest - The Ultimate Bug Hunting Challenge

Welcome to **DebugQuest**, an immersive cyberpunk-themed platform where you'll discover hidden bugs, decode system quirks, and prove your debugging skills. This isn't just about finding errors—it's about thinking like a hacker and exploring beyond the obvious.

## 🎯 What is DebugQuest?

DebugQuest is a multi-level challenge platform that tests your ability to:
- Navigate authentication systems with unexpected behavior
- Uncover hidden features and shortcuts
- Interact with broken UI elements in creative ways
- Solve form validation puzzles
- Compete on the real-time leaderboard

Each level presents real-world-like bugs and quirks that challenge you to think critically and explore thoroughly.

---

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   cd debugquest
   npm run install:all
   ```

2. **Start the game**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Go to: **http://localhost:5173**
   - Backend API: http://localhost:5000

**That's it!** No database setup required.

---

## 🏆 The Challenge

### Level 1: Authentication Challenge
Enter the system. The login page seems straightforward, but is it? Explore different approaches to gain access.

**Time Challenge:** How quickly can you find the way in?

### Level 2: The Loading Game
You face a 20-second loading screen. While waiting, can you find a faster path? There's even a mini-game to keep you entertained.

**Discovery:** Look for hidden mechanisms.

### Level 3: Dashboard Chaos
The dashboard has multiple interactive features—but several don't work as expected. Your mission:
- Toggle between themes
- Activate system features
- Communicate with the AI terminal
- Navigate unexpected UI behavior
- Find hidden navigation secrets

**Challenge:** Discover what's really broken and what's intentional.

### Level 4: Final Form
Complete the form to prove your mastery. But watch out—the inputs have their own quirks that will test your attention to detail.

**Reward:** See your name on the leaderboard!

---

## 💡 Features

✨ **Progressive Difficulty**
- Start easy, get progressively harder
- Each level builds on the last

🎨 **Cyberpunk Aesthetic**
- Neon-themed UI with glitch effects
- Immersive system terminal design
- Animated backgrounds and effects

⏱️ **Speedrun Mode**
- Complete the entire challenge as fast as you can
- Your time is tracked and ranked globally
- Compete with other players

🔗 **Real-time Leaderboard**
- Live rankings via Socket.io
- View top performers instantly
- See who's conquering the challenge

💚 **Hint System**
- Get stuck? Use your 3 hints strategically
- Each hint reveals a clue for the current level
- Choose wisely!

🎮 **Mini-Games**
- Play Snake while the system loads
- Beat your high score
- Pure retro fun

📊 **Progress Tracking**
- Your journey is recorded
- Track which bugs you've discovered
- See how many levels you've conquered

---

## 🎮 How to Play

1. **Enter Your Name** - Choose a display name (this will appear on the leaderboard if you win)

2. **Solve Level 1** - Find the way past authentication

3. **Speed Through Level 2** - Beat the loading screen

4. **Explore Level 3** - Discover and fix the dashboard bugs

5. **Conquer Level 4** - Complete the final challenge

6. **See Your Rank** - Check the leaderboard and compare times

### Tips for Success

- 🔍 **Look Beyond the Surface** - Not everything is what it seems
- ⌨️ **Try Different Interactions** - Click, double-click, right-click, use keyboard
- 💬 **Talk to the AI** - The chat system knows secrets
- 📱 **Watch Input Behavior** - Forms may react unexpectedly
- 🕐 **Time Your Actions** - Some discoveries require specific timing

---

## 🏅 Leaderboard

The leaderboard ranks players by:
- **Speed** - Fastest completion time wins
- **Efficiency** - Minimal hint usage is rewarded
- **Ranking** - See where you stand globally

**Top 3 players** get special recognition! Can you make it to the podium?

---

## ⚙️ System Requirements

- Node.js 18+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for real-time leaderboard updates)

---

## 🎨 Features Overview

| Feature | Description |
|---------|-------------|
| **5 Levels** | Progressively challenging bug hunts |
| **Real-time Leaderboard** | Compete with players worldwide |
| **Hint System** | 3 strategic hints per game |
| **Snake Mini-game** | Play while loading |
| **Cyberpunk Theme** | Immersive neon aesthetic |
| **Progress Tracking** | Track your journey |
| **Completion Timer** | Race against yourself |
| **Social Competition** | See who's fastest |

---

## 🎯 Objectives

- 🎖️ **Complete the Challenge** - Finish all 5 levels
- 🏆 **Make the Leaderboard** - Get into the top 10
- 🥇 **Reach Top 3** - Claim a medal
- ⚡ **Speed Run** - Complete it faster than others
- 🔓 **Discover Everything** - Find all hidden elements
- 💚 **Minimize Hints** - Beat it with few hints used

---

## 📞 Gameplay Flow

```
Start Game
    ↓
Level 1: Authentication
    ↓
Level 2: Loading & Mini-Game
    ↓
Level 3: Dashboard Exploration
    ↓
Level 4: Form Completion
    ↓
Victory Screen
    ↓
Leaderboard Ranking
```

---

## 🌟 What Makes DebugQuest Unique?

- **Real Skills** - Learn actual debugging and problem-solving techniques
- **Hidden Depth** - Multiple ways to succeed
- **Fair Competition** - All players face the same challenges
- **Time Tracking** - Pure speedrun potential
- **No Installation Headaches** - Run immediately after npm install
- **Immersive Theme** - Cyberpunk aesthetic throughout

---

## 🎮 Ready to Play?

```bash
# Get started in 3 steps:
cd debugquest
npm run install:all
npm run dev
```

Then open **http://localhost:5173** and begin your quest!

---

## 📈 Challenge Statistics

Tracked during your game:
- ⏱️ Total completion time
- 💡 Hints used
- 🐛 Bugs discovered
- 📊 Leaderboard position
- ⭐ Performance rating

---

## 🚀 Why DebugQuest?

Whether you're:
- 🎓 Learning debugging skills
- 🏆 Competing for speedrun records
- 🎨 Enjoying immersive design
- 🧠 Seeking a mental challenge
- 💻 Wanting hands-on experience

**DebugQuest** delivers an engaging, rewarding experience that combines education with entertainment.

---

**Good luck, hacker. The system awaits your expertise.**

✨ *DebugQuest - Where debugging meets gameplay.* ✨

## Project Structure

```
debugquest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (game state)
│   │   ├── games/          # Mini-games (Snake)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── styles/         # CSS styles
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── socket/             # Socket.io handlers
│   └── package.json
└── package.json           # Root workspace
```

## API Endpoints

- `POST /api/users/register` - Create new user
- `GET /api/users/:visitorId` - Get user data
- `POST /api/progress` - Record progress
- `GET /api/hints/:visitorId/level/:level` - Get available hints
- `POST /api/hints/:visitorId/use` - Use a hint
- `GET /api/leaderboard` - Get full leaderboard
- `GET /api/leaderboard/top3` - Get top 3 players

## AI Resistance Features

The codebase includes intentionally misleading elements:
- Function names that suggest opposite behavior
- Variable names that don't match their purpose
- Comments that lie about functionality
- Hidden logic paths

## License

MIT

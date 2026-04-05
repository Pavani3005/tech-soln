# DebugQuest: The Broken Web App Challenge

Welcome to **DebugQuest**! This repository is designed as a hands-on, codebase manipulation CTF (Capture The Flag) for React and web development students.

The application you are about to run is heavily sabotaged. Your goal is not just to click around the UI, but to dive into the React source code, find the intentional logic flaws, and fix them so you can progress through the levels and submit your Final Feedback.

## 🎯 Student Instructions

1. **Start the App:** Follow the Quick Start instructions below.
2. **Play the Game:** Attempt to progress from the Login Page to the Final Feedback level. 
3. **Fix the Code:** When you get stuck (and you will), open up the `client/` source code. You will need to inspect components, fix React state bugs, correct CSS traps, and repair broken asynchronous logic.
4. **No Cheating:** While you *could* technically bypass things by rewriting entire files, the true challenge is identifying the specific bugs and fixing them as intended. Let the code teach you!
5. **Submit:** Your final challenge is successfully submitting the feedback form at the end, which will record your completion time on the global leaderboard.

## 📝 Information for Evaluators & Teachers

This repository has been transformed from a basic visual puzzle into a **comprehensive React debugging assessment**. The challenge rating is a solid **8/10 for junior-to-mid-level React developers**, as it requires understanding of:
- React Router guards and layouts.
- Component state mutations vs. setter functions.
- Javascript asynchronous Promises (`async/await`).
- DOM manipulation and CSS stacking contexts (`z-index`).

> [!WARNING]
> Evaluators: DO NOT give the students the `SOLUTIONS.md` file. It contains the strict answer key with exact line-by-line solutions to the bugs scattered throughout the codebase.

## 🚀 Quick Start
1. Install dependencies:
```bash
npm run install:all
```
2. Configure server env in `server/.env` based on `server/.env.example`.
3. Start app:
```bash
npm run dev
```
4. Open `http://localhost:5173`.

## 📁 Project Structure (Where to look!)
```text
debugquest/
  client/
    src/
      App.jsx             <-- Routing happens here
      components/         <-- Shared UI and Guards
      context/            <-- Global game state and API calls
      pages/              <-- The individual level components
  server/                 <-- You shouldn't need to fix the backend (unless you want to!)
```

Good luck, and happy debugging!

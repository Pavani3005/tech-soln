# Evaluator Answer Key & Teacher's Guide

This document contains the exact solutions to the intentional bugs placed in the codebase. **Do not share this file with students.**

## Assessment Evaluation
**Challenge Rating:** 8 / 10
**Target Audience:** Mid-level React students.
**Summary:** This project started as a UI puzzle but has evolved into an architecture and debugging assessment. It successfully tests a student's ability to trace React state, manage asynchronous code, understand React Router patterns, and inspect DOM manipulation traps.

---

## 🛠 Bug Database & Solutions

### 1. The Broken Guard (Route Security)
*Students will notice they can't access `/loading` or `/dashboard` properly, or they can skip straight to `/feedback-final` if they type it in the URL.*

**Location 1:** `client/src/components/ProtectedRoute.jsx`
**The Flaw:** 
- It allows unauthenticated users through: `if (!user) { return children ? children : <Outlet />; }`.
- The level check is inverted: `if (currentLevel > requiredLevel)` instead of `<`.

**The Solution:**
Change the logic to block users without an active session and correctly measure the level:
```jsx
if (!user) {
  return <Navigate to="/" replace />;
}
if (currentLevel < requiredLevel) {
  return <Navigate to="/dashboard" replace />; // or to their current level route
}
```

**Location 2:** `client/src/App.jsx`
**The Flaw:**
- `ProtectedRoute` is implemented improperly. `<Route element={<ProtectedRoute requireLevel={2} />}>` has a typo (`requireLevel` instead of `requiredLevel`).
- The `FeedbackFinalPage` uses a string instead of a number: `requiredLevel="level-4"`.

**The Solution:**
Fix the prop names and data types in `App.jsx`:
```jsx
// Fixed prop name
<Route element={<ProtectedRoute requiredLevel={2} />}>
...
// Fixed type
<ProtectedRoute requiredLevel={4}>
```

---

### 2. The Direct Mutation Bug (React State)
*Students will click the "Decrypt Secret" button on the Dashboard, but the modal will not open.*

**Location:** `client/src/pages/DashboardPage.jsx` (Lines ~97)
**The Flaw:** 
The `handleDecryptClick` function mutates the state directly, which prevents React from triggering a re-render.
```jsx
decryptState.isVisible = true;
```

**The Solution:**
Students must use the provided state setter function instead:
```jsx
setDecryptState(prev => ({ ...prev, isVisible: true }));
```

---

### 3. The Evasive Button (UI Prank)
*The "Continue to Final Feedback" button jumps around the screen when clicked or focused.*

**Location:** `client/src/pages/DashboardPage.jsx`
**The Flaw:**
The button's `onClick` is bound to `moveButton` which randomizes its absolute position. The actual navigation function (`handleContinue`) is disconnected from the UI.

**The Solution:**
Students can either:
1. Re-bind the button's `onClick` to `handleContinue`.
2. Open their browser console and manually call the React Router navigation, or attach the method to the window object to bypass the UI constraint.

---

### 4. The Missing Promise (Network/Async)
*The app displays `[object Promise]` instead of returning the secret key payload.*

**Location:** `client/src/context/GameContext.jsx` -> `fetchSecretKey()`
**The Flaw:**
The function is missing the `await` keyword in front of the `fetch` call and the `.json()` parse, causing it to return an unresolved Promise synchronously.

**The Solution:**
Add `await` to the network requests in `GameContext.jsx`:
```jsx
const fetchSecretKey = async () => {
    const response = await fetch('/api/secret-key', {
      method: 'GET',
    });
    return await response.json();
};
```

---

### 5. The Z-Index Trap (CSS & DOM)
*On the Final Feedback level, the "Submit Final Feedback" button refuses to be clicked, throwing an "ERR_BLOCKED" text instead.*

**Location:** `client/src/pages/FeedbackFinalPage.jsx`
**The Flaw:**
There is a completely invisible `<div>` (opacity: 0) directly overlaying the submit button. It has a `z-index` of 9999, which intercepts all mouse clicks intended for the button.

**The Solution:**
Students must use Chrome DevTools (Elements panel) to inspect the submit button. They will discover the invisible sibling `<div>`. They can delete the node in DevTools, or fix the source code by removing the overlay block entirely.

---

### 6. Original Logic Puzzles (Level 2 & 4 Rules)
*If students don't look at the code, they must figure out the legacy puzzles.*
- **Level 2 Puzzle:** The sequence puzzle solution is `13-21-34` (Fibonacci sequence terms 7, 8, 9). Pressing `S` twice rapidly skips the timer.
- **Level 4 Feedback Validation:**
  - Phone counter must not end in `2` or `4`.
  - Email cannot have uppercase letters (unless parser mode is unlocked via context menu right-click).
  - DOB must be in the future (unless time control mode is unlocked via double-click).
  - Message must be binary (`1`, `0`, spaces).

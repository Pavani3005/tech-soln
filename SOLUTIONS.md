# DebugQuest Solutions

## Level 1 - Login
- **Bug 1 (OTP Endpoint)**: Fixed typo in API URL from `/api/users/send-otpp` → `/api/users/send-otp`
- **Bug 2 (Fetch Secret Key)**: Added missing `await` keywords in `fetchSecretKey()` function
- **Result**: Successfully received OTP in terminal and progressed to Level 2

## Level 2 - Loading Screen
- Used the **S key shortcut** to skip the loading timer and advance to the Dashboard

## Level 3 - Dashboard
- **Bug 6 (Decrypt Modal)**: Fixed direct state mutation in `handleDecryptClick()` 
  - Changed from mutating `decryptState` directly to using `setDecryptState()`
  - **Flag**: `CTF_FLAG{r34ct_mUt4t10n_b4d}`

- **Bug 8 (Light/Dark Mode Toggle)**: Removed the duplicate `classList.toggle()` call
  - The toggle was being called twice, canceling itself out
  
- **Bug 9 (Read Aloud Button)**: Added missing `window.speechSynthesis.speak(utterance)` call
  - Audio now plays when "Read Aloud" is clicked

- **Bug 7 (Continue Button)**: Fixed CSS positioning trap
  - Changed hidden div position from `-9999px` to `0` so button is accessible

## Level 4 - Final Feedback Form
- **Bug 10a (Invisible Z-Index Trap)**: Removed the invisible blocking div
  - Submit button now clickable

- **Bug 10b (Team Name Palindrome Trap)**: Removed the `.reverse().join()` logic
  - Team name is now accepted as-is, no reversal needed

- **Bug 10c (Admin Toggle)**: Added `e.stopPropagation()` to prevent event bubbling
  - Admin toggle now stays in ON state

- **Bug 10d (Upload Progress)**: Fixed progress bar to reach 100% instead of stopping at 99%
  - Changed condition from `>= 99` to `>= 100`

- **Phone Number**: Changed from counter to text input accepting standard formats
  - Now accepts: `+1 (555) 123-4567` etc.

- **Date of Birth**: Removed `min` attribute to accept past dates

- **Message Field**: Removed binary-only restriction
  - Now accepts letters, numbers, and all text

- **Email Validation**: Simplified to accept any email with `@` symbol
  - Previously required `@Gmail` (capital G)

- **Bug 10e (Final Redirect)**: Changed redirect from `/not-found` to `/complete`
  - Successfully lands on completion page

## Final Result
✅ Form submits successfully and redirects to `/complete` page with completion time
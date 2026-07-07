# NeoVault Frontend

AI Document Vault & Intelligent Form Autofill Engine — React frontend.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```
   Then open http://localhost:5173

3. Build for production:
   ```
   npm run build
   ```

## What's included

- All 13 screens converted from the Stitch design export into React components (`src/pages/`)
- React Router wiring so screens navigate as a real app (`src/App.jsx`)
- A simple auth context (`src/context/AuthContext.jsx`) using localStorage — currently a demo/mock login that accepts any email+password and issues a fake token. (The Flask backend is now available and should be integrated to replace this mock).
- Protected routes: all screens except Login/Register/OTP/Reset Password require being "logged in" (demo auth) to view, and redirect to /login otherwise.
- Sidebar navigation links are wired to real routes (Dashboard, Vault, Document Upload, URL Scanner, Profile, Settings, Admin Portal).

## Current Status & Next Steps

- **Frontend-Backend Integration**: A Flask backend (with JWT auth, database models, and OTP generation endpoints) has been created. The next step is to wire the frontend to use these real API endpoints instead of the mock authentication.
- **OTP Verification Endpoint**: The backend currently has a `/request-otp` endpoint, but an endpoint to actually *verify* the OTP and reset the password remains to be implemented.
- **AI Document Parsing (OCR + Gemini)**: The "AI Parsing Results" screen currently shows static placeholder data. The backend logic for this needs to be built and integrated.
- **URL Security Scanning**: The scanner screen is UI-only right now. Backend logic needs to be developed.
- **UI Enhancements**: Some interactive JavaScript from the original design (like OTP auto-advance between digit boxes, and password show/hide toggles) should be re-implemented using React state/hooks.

## Design System

Colors, typography, spacing, and component styles are defined via a Tailwind CDN config in `index.html`, matching the DESIGN.md exported from Google Stitch (dark cybersecurity theme, glassmorphism, blue/purple neon glow).

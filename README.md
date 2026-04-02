# JLPT-Mock-prep

Create a website where participants can attempt mock exams for JLPT.

## Firebase Firestore realtime setup

1. Copy env template and fill your Firebase web app keys:
   - `cp .env.example .env.local`
2. Start the app with `npm run dev`.
3. Ensure Firestore has a collection named `examAttempts` (auto-created on first submit).
4. Admin dashboard automatically uses Firestore realtime data when Firebase env vars are present.

# Habit Tracker

Premium habit and sleep tracker built with React, Vite, and Firebase.

## Local Setup

1. Install dependencies:
   `npm install`
2. Copy environment variables:
   `cp .env.example .env`
3. Update the values in `.env` for Firebase, EmailJS, and server keys.
4. Run the app:
   `npm run dev`

## Production Notes

- AI coaching now runs through `/api/v1/ai-coach`, so `GEMINI_API_KEY` stays server-side.
- SEO files are in `public/` (`robots.txt`, `sitemap.xml`, verification files).
- Optional IndexNow endpoint is available at `/api/v1/indexnow`.
- Suggested Firestore rules are in `firestore.rules.example`.
- Dependabot configuration is in `.github/dependabot.yml`.

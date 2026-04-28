# HabitFlowX

AI-powered habit and sleep tracking web app with real-time progress analytics, personalized motivation, and secure Firebase authentication.

## Live Demo
- Website: https://habitflowx.vercel.app/

## GitHub Description
Use this as your repository short description:

`HabitFlowX is an AI-powered habit and sleep tracking app built with React, TypeScript, Firebase, and Vercel for real-time progress insights and personalized coaching.`

## Overview
HabitFlowX helps users build consistency with focused daily tracking and meaningful feedback. It combines habit management, sleep monitoring, and AI-generated motivation in one modern dashboard.

## Core Features
- Habit creation and daily status tracking
- Monthly habit matrix for quick visual progress
- Sleep logging with chart-based trend insights
- Yearly overview with drill-down history
- AI coaching via a secure server API route
- Firebase authentication (signup, login, reset password)
- OTP email verification flow during signup
- Profile management with account deletion
- Responsive interface for mobile, tablet, and desktop

## Tech Stack
- Frontend: React 19, TypeScript, Vite
- Styling/UI: Tailwind CSS, Lucide React
- Charts: Recharts
- Backend services: Firebase Authentication, Cloud Firestore
- Email: EmailJS
- Deployment: Vercel

## Project Structure
```text
habit-tracker/
|- api/                  # Serverless routes (AI coach, IndexNow)
|- components/           # Reusable UI components
|- context/              # React context (auth and shared state)
|- hooks/                # App data hooks (habits, sleep)
|- lib/                  # Firebase and utility modules
|- pages/                # App screens/routes
|- public/               # Static SEO and verification files
|- App.tsx               # Route setup and app shell
|- apiKeys.ts            # Environment variable access
|- README.md
```

## Getting Started
### Prerequisites
- Node.js 18+
- npm
- Firebase project
- EmailJS account

### Installation
1. Clone the repository
```bash
git clone https://github.com/HariesHussain/habit-tracker.git
cd habit-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure your `.env` values for:
- Firebase config
- EmailJS keys
- AI coach server key(s)

5. Start development server
```bash
npm run dev
```

## Available Scripts
- `npm run dev` - Run local development server
- `npm run build` - Type-check and build production assets
- `npm run preview` - Preview production build locally

## Deployment
This project is configured for Vercel deployment.
- Production URL: https://habitflowx.vercel.app/
- `vercel.json` is included for routing behavior.

## Security Notes
- Keep secrets in `.env` and never commit them.
- AI requests are routed through serverless endpoints to protect private keys.
- Suggested Firestore rules are available in `firestore.rules.example`.

## Connect
- GitHub: https://github.com/HariesHussain
- Email: shaikharieshussain09@gmail.com

## License
This project is licensed under the MIT License. You can add a `LICENSE` file to formalize it.

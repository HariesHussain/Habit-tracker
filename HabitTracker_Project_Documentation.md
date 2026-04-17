# HABITTRACKER – AN AI-INTEGRATED PERSONAL HABIT TRACKING WEB APPLICATION

---

## TITLE PAGE

| | |
|---|---|
| **Project Title** | HabitTracker – An AI-Integrated Personal Habit Tracking Web Application |
| **Submitted By** | Shaik Haries Hussain |
| **Roll Number** | _[Your Roll Number]_ |
| **Department** | _[Your Department, e.g., Computer Science and Engineering]_ |
| **College** | _[Your College Name]_ |
| **University** | _[Your University Name]_ |
| **Guide** | _[Guide Name and Designation]_ |
| **Academic Year** | _[e.g., 2025–2026]_ |

---

## CERTIFICATE

> This is to certify that the mini project titled **"HabitTracker – An AI-Integrated Personal Habit Tracking Web Application"** is a bonafide work carried out by **Shaik Haries Hussain**, Roll No. _[Your Roll Number]_, in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology** in **_[Department Name]_** from **_[College Name]_**, affiliated to **_[University Name]_**, during the academic year **_[Year]_**.
>
> **Guide Signature:** ____________________
>
> **Name:** _[Guide Name]_
>
> **Designation:** _[Designation]_
>
> **Head of Department Signature:** ____________________
>
> **Name:** _[HOD Name]_
>
> **Date:** ____________________

---

## ABSTRACT

HabitTracker is a modern, full-stack web application designed to help users build and sustain positive daily habits through an intuitive, data-driven interface. Developed using **React 19** with **TypeScript** on the frontend and **Google Firebase** (Authentication and Cloud Firestore) on the backend, the application offers a seamless, real-time experience across devices. Users can create habits categorized under domains such as Health, Fitness, Productivity, and Learning, and track their daily progress through an interactive monthly grid matrix. A dedicated **Sleep Tracker** module with **Recharts**-powered line-chart visualizations enables users to monitor and analyze their sleep patterns over time.

The application integrates **Google Gemini AI** to provide real-time, context-aware motivational coaching on the dashboard, dynamically adapting its guidance based on the user's current habit portfolio. An **EmailJS**-powered email OTP verification system adds a second layer of trust during the user registration process. Firebase Authentication handles user login, signup, and password reset workflows securely. All sensitive configuration—including Firebase credentials, Gemini API keys, and EmailJS service identifiers—is externalized through environment variables using Vite's `import.meta.env` mechanism.

The application is deployed on **Vercel** with continuous deployment from GitHub, ensuring automatic builds on every code push. The responsive UI, built with **TailwindCSS** and **Lucide React** icons, delivers a premium dark-themed experience optimized for mobile, tablet, and desktop screens across all modern browsers.

**Keywords:** Habit Tracking, React, TypeScript, Firebase, Gemini AI, Sleep Monitoring, Vercel, Real-time Database

---

## TABLE OF CONTENTS

1. Introduction
2. Problem Statement
3. Objectives
4. Literature Survey
5. Existing System vs Proposed System
6. System Architecture
7. Module Description
   - 7.1 Authentication Module
   - 7.2 Habit Tracking Module
   - 7.3 Sleep Tracker Module
   - 7.4 Dashboard Module
   - 7.5 Profile Module
   - 7.6 AI (Gemini) Integration
   - 7.7 EmailJS Integration
8. Database Design
9. Implementation Details
10. Security Implementation
11. Deployment Process
12. Advantages
13. Limitations
14. Future Enhancements
15. Conclusion
16. References

---

## 1. INTRODUCTION

Habit formation is a cornerstone of personal development, yet most individuals struggle with sustained consistency due to a lack of structured tracking, accountability, and feedback. Traditional methods—paper journals, simple checklists—fail to provide the analytical depth and motivational reinforcement required for long-term behavioral change.

**HabitTracker** addresses this gap by providing a comprehensive, technology-driven platform for daily habit management. Built as a Single Page Application (SPA) using React 19 and TypeScript, it leverages Firebase's serverless ecosystem for authentication and real-time data synchronization, ensuring that user data is always current and available across devices without the overhead of managing a traditional backend server.

The application goes beyond simple check-in functionality by integrating **Google Gemini AI** for personalized motivational coaching and **Recharts** for data visualization of sleep patterns. The result is a holistic self-improvement tool that combines behavioral science principles with modern web technologies to deliver a genuinely useful product.

The project demonstrates proficiency in full-stack web development, third-party API integration, secure deployment practices, and responsive UI/UX design—skills essential for contemporary software engineering.

---

## 2. PROBLEM STATEMENT

Existing habit-tracking solutions in the market suffer from one or more of the following deficiencies:

1. **Lack of Real-Time Synchronization:** Offline-only or client-only apps lose data when users switch devices, resulting in fragmented tracking records.
2. **No Analytical Feedback:** Most simple trackers record completions but provide no visual analytics, streak calculations, or AI-driven insights to sustain motivation.
3. **Absence of Sleep Monitoring:** Sleep quality is a critical factor in habit adherence, yet it is rarely incorporated into habit-tracking workflows.
4. **Poor Security Practices:** Many lightweight web applications hardcode sensitive credentials directly in the frontend code, creating security vulnerabilities.
5. **Weak Identity Verification:** Basic email-password authentication without any additional verification step (such as OTP) results in unreliable user accounts.
6. **Non-Responsive UI:** Applications not optimized for mobile and tablet form factors lose a significant portion of their potential user base.

There is a clear need for a unified, secure, real-time, and AI-enhanced habit-tracking web application that addresses all of these shortcomings in a single cohesive platform.

---

## 3. OBJECTIVES

The primary objectives of this project are:

1. To design and develop a responsive, real-time habit-tracking web application using React, TypeScript, and Firebase.
2. To implement secure user authentication with email-password login, OTP-based email verification during signup, and password reset functionality.
3. To provide an interactive monthly grid matrix for daily habit tracking with tri-state status cycling (Completed / Failed / Neutral).
4. To build a sleep-tracking module with data visualization using Recharts line charts.
5. To integrate Google Gemini AI for delivering context-aware motivational coaching messages on the user dashboard.
6. To implement a yearly overview module with drill-down navigation (Year → Month → Day-level detail).
7. To follow security best practices by externalizing all API keys and credentials into environment variables.
8. To deploy the application on Vercel with continuous deployment from GitHub.
9. To provide a user profile management page with account deletion capability, including cascading deletion of all associated Firestore data.

---

## 4. LITERATURE SURVEY

| # | Title / Study | Key Findings | Relevance |
|---|---|---|---|
| 1 | "Atomic Habits" by James Clear (2018) | Habit formation is most effective when tracked daily with immediate visual feedback; the "habit scorecard" method emphasizes visible progress indicators. | Informed the design of the monthly grid matrix and streak counter. |
| 2 | "The Role of Sleep in Habit Formation" – *Journal of Behavioral Medicine*, Vol. 42, 2019 | Sleep quality correlates strongly with the ability to maintain new habits; individuals with fewer than 6 hours of sleep showed 40% lower habit adherence. | Directly motivated the inclusion of the Sleep Tracker module. |
| 3 | Firebase Documentation – Google (2024) | Firebase provides scalable, serverless backend services including real-time NoSQL database (Firestore), authentication, and security rules. | Firebase was selected as the backend platform. |
| 4 | "React: Up & Running" by Stoyan Stefanov, O'Reilly (2021) | React's component-based architecture and virtual DOM enable performant, maintainable single-page applications. | Justified the use of React 19 with functional components and hooks. |
| 5 | Google Gemini API Documentation (2025) | Gemini models provide text generation capabilities accessible via a simple REST/JS API, suitable for generating motivational content. | Used for the AI coaching feature on the Dashboard. |
| 6 | "Security Best Practices for Client-Side Web Applications" – OWASP (2024) | All sensitive credentials must be externalized from source code; environment variable injection at build time is a recommended pattern for frontend apps. | Guided the `.env` + `import.meta.env` implementation. |

---

## 5. EXISTING SYSTEM VS PROPOSED SYSTEM

| Aspect | Existing Systems | Proposed System (HabitTracker) |
|---|---|---|
| **Technology** | Native mobile apps or basic HTML/CSS/JS websites | React 19 + TypeScript SPA with Firebase backend |
| **Data Sync** | Typically client-only (localStorage) or requires manual sync | Real-time bi-directional sync via Firestore `onSnapshot` listeners |
| **Authentication** | Basic email-password only | Email-password + OTP email verification (EmailJS) + password reset |
| **AI Integration** | None or generic static tips | Google Gemini AI delivering context-aware motivational coaching |
| **Sleep Tracking** | Absent or offered as a separate unrelated app | Integrated sleep logging with Recharts line-chart visualization |
| **Analytics** | Limited to basic streaks | Monthly grid matrix, streak counters, yearly drill-down overview with per-month completion percentages |
| **Security** | Hardcoded API keys in source | All keys externalized via `.env` and `import.meta.env` |
| **Deployment** | Manual or ad-hoc | Automated CI/CD via GitHub + Vercel |
| **Responsiveness** | Often desktop-only | Fully responsive: mobile, tablet, and desktop with adaptive layouts |
| **Account Management** | No self-service deletion | Full account deletion with cascading Firestore data purge |

---

## 6. SYSTEM ARCHITECTURE

### 6.1 High-Level Architecture

The application follows a **client-heavy SPA architecture** with a serverless backend:

```
┌───────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                               │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ Pages/   │  │Components│  │  Hooks/   │  │  Context/            │ │
│  │Dashboard │  │HabitCard │  │useHabits  │  │  AuthContext          │ │
│  │Login     │  │HabitMatrix│ │useSleep   │  │  (User + Profile)    │ │
│  │Profile   │  │SleepTrack│  │           │  │                      │ │
│  │YearlyOvw │  │Layout    │  │           │  │                      │ │
│  │ResetPwd  │  │          │  │           │  │                      │ │
│  └──────────┘  └──────────┘  └───────────┘  └──────────────────────┘ │
│                        │              │                               │
│                  ┌─────┴──────────────┴──────┐                       │
│                  │    lib/firebase.ts         │                       │
│                  │    apiKeys.ts              │                       │
│                  │    constants.ts            │                       │
│                  │    lib/utils.ts            │                       │
│                  └──────────────┬─────────────┘                       │
└────────────────────────────────┼──────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼─────┐ ┌───▼────┐ ┌─────▼──────┐
              │  Firebase  │ │ Gemini │ │  EmailJS   │
              │  Auth +    │ │ AI API │ │  Service   │
              │  Firestore │ │        │ │            │
              └────────────┘ └────────┘ └────────────┘
```

### 6.2 Folder Structure

```
habit-tracker/
├── index.html              # Entry point with import map & TailwindCSS CDN
├── index.tsx               # React DOM root mount
├── App.tsx                 # Router configuration & protected routes
├── apiKeys.ts              # Centralized environment variable access
├── constants.ts            # App-wide constants (categories, months)
├── types.ts                # TypeScript interfaces (Habit, SleepLog, UserProfile)
├── vite.config.ts          # Vite dev server & build configuration
├── vercel.json             # Vercel deployment SPA rewrite rules
├── package.json            # Dependencies and scripts
├── components/
│   ├── Layout.tsx          # App shell: sidebar, mobile nav, footer
│   ├── HabitCard.tsx       # Individual habit display with status cycling
│   ├── HabitMatrix.tsx     # Monthly grid visualization for a habit
│   └── SleepTracker.tsx    # Sleep logging UI with Recharts line chart
├── pages/
│   ├── Login.tsx           # Login, Signup (with OTP), Forgot Password
│   ├── Dashboard.tsx       # Main page: habit table, sleep tracker, AI coach
│   ├── Profile.tsx         # User info display & account deletion
│   ├── YearlyOverview.tsx  # Year → Month → Day drill-down history
│   └── ResetPassword.tsx   # Firebase password reset confirmation
├── hooks/
│   ├── useHabits.ts        # Firestore CRUD + real-time sync for habits
│   └── useSleep.ts         # Firestore CRUD + real-time sync for sleep logs
├── context/
│   └── AuthContext.tsx     # React Context for auth state & user profile
└── lib/
    ├── firebase.ts         # Firebase app initialization (Auth + Firestore)
    └── utils.ts            # Date utilities, streak calculation, sleep quality
```

### 6.3 Data Flow

1. **Authentication Flow:** `Login.tsx` → Firebase Auth SDK → `AuthContext.tsx` → `ProtectedRoute` (in `App.tsx`) → Authorized Pages.
2. **Habit Data Flow:** `Dashboard.tsx` → `useHabits()` hook → Firestore `onSnapshot()` real-time listener → State update → UI re-render.
3. **Sleep Data Flow:** `SleepTracker.tsx` → `useSleep()` hook → Firestore write/read → Recharts visualization.
4. **AI Coaching Flow:** `Dashboard.tsx` → `GoogleGenAI` SDK → Gemini model `generateContent()` → Response rendered in Neuro Link card.

---

## 7. MODULE DESCRIPTION

### 7.1 Authentication Module

**Files Involved:** `pages/Login.tsx`, `pages/ResetPassword.tsx`, `context/AuthContext.tsx`, `lib/firebase.ts`

The Authentication module handles the complete user lifecycle:

- **Login:** Uses Firebase `signInWithEmailAndPassword()` to authenticate returning users. On success, the user is redirected to `/dashboard`.
- **Signup with OTP Verification:** A multi-step registration flow:
  1. User enters name, email, and password.
  2. A 6-digit OTP is generated client-side and sent to the user's email via **EmailJS** (`emailjs.send()`).
  3. The user enters the OTP; on match, `createUserWithEmailAndPassword()` creates the Firebase Auth account, `updateProfile()` sets the display name, and `setDoc()` writes the user profile to Firestore.
- **Password Reset:** Firebase's `sendPasswordResetEmail()` sends a reset link. The deep-link handler in `Login.tsx` detects `mode=resetPassword` and `oobCode` URL parameters and redirects to `ResetPassword.tsx`, which uses `confirmPasswordReset()` to complete the flow.
- **Auth State Management:** `AuthContext.tsx` uses `onAuthStateChanged()` for persistent auth observation and `onSnapshot()` on the user document for real-time profile syncing. A safety timer (8 seconds) ensures the loading state resolves even under poor connectivity.

**Auth Modes:** The `Login.tsx` component uses a `mode` state variable of type `'login' | 'signup' | 'forgot' | 'otp'` to manage the four distinct UI states within a single page.

### 7.2 Habit Tracking Module

**Files Involved:** `hooks/useHabits.ts`, `components/HabitCard.tsx`, `components/HabitMatrix.tsx`, `types.ts`

This is the core module of the application. It provides:

- **Habit CRUD Operations:**
  - `addHabit(title, category)`: Creates a new Firestore document in `users/{uid}/habits/{habitId}` with `serverTimestamp()`.
  - `updateHabitStatus(habitId, dateStr, status)`: Manages `completedDates` and `failedDates` arrays, then recalculates the current streak using `calculateStreak()`.
  - `deleteHabit(habitId)`: Performs optimistic UI removal followed by Firestore `deleteDoc()`, with rollback on failure.
  - `deleteMultipleHabits(habitIds)`: Uses Firestore `writeBatch()` for atomic multi-document deletion.

- **Real-Time Sync:** The `useHabits()` hook establishes a Firestore `onSnapshot()` listener ordered by `createdAt` ascending, ensuring habits appear in the order they were created.

- **Tri-State Status Cycling:** On the Dashboard, clicking a habit cell for today cycles through: Neutral → Completed → Failed → Neutral. This is implemented in `cycleStatus()`.

- **Streak Calculation:** The `calculateStreak()` utility in `lib/utils.ts` computes the consecutive-day streak by iterating backward from today (or yesterday if today is not yet completed), counting consecutive dates present in `completedDates`.

- **Habit Categories:** Six predefined categories are defined in `constants.ts`: General, Health, Productivity, Mindset, Fitness, and Learning.

### 7.3 Sleep Tracker Module

**Files Involved:** `hooks/useSleep.ts`, `components/SleepTracker.tsx`, `types.ts`

The Sleep Tracker provides:

- **Sleep Logging:** A modal UI allows users to log sleep duration (0–14 hours, in 0.5-hour increments) for today. Data is stored per-date in `users/{uid}/sleep/{date}`.
- **Quality Classification:** `getSleepQuality()` in `lib/utils.ts` classifies sleep into three tiers: Good (≥ 7h), Average (≥ 5h), or Poor (< 5h).
- **Visualization:** The last 7 entries are rendered as a **Recharts `LineChart`** with customized styling—indigo color scheme, ghost shadow lines for visual depth, animated dots, and a dynamically calculated Y-axis domain for meaningful visual fluctuation.
- **Summary Statistics:** The component displays the average sleep hours across the visible period and today's logged value in dedicated metric cards.

### 7.4 Dashboard Module

**Files Involved:** `pages/Dashboard.tsx`

The Dashboard is the primary user interface and aggregates all tracking modules:

- **Monthly Habit Table:** A horizontally scrollable table showing all habits as rows and days of the current month as columns. Today's column is visually highlighted and positioned via an auto-scroll mechanism (`useEffect` with `scrollTo`). Each cell is interactive for today's date, allowing status cycling.
- **Sticky Column Design:** The habit name column uses `position: sticky` with `z-index` and backdrop blur for a premium UX during horizontal scrolling.
- **Floating Delete Bar:** When habits are selected via checkboxes, a floating action bar appears at the bottom with "Cancel" and "Delete" options, including a confirmation modal.
- **Add Habit Modal:** A form modal with title input and category grid selection, styled with large rounded corners and uppercase tracking.
- **Sleep Tracker Integration:** The `SleepTracker` component is embedded in a responsive grid layout alongside the AI coaching card.
- **AI Coaching Card (Neuro Link):** Displays the Gemini-generated motivational quote with a "Refresh AI" button. Covered in detail in Section 7.6.

### 7.5 Profile Module

**Files Involved:** `pages/Profile.tsx`, `context/AuthContext.tsx`

The Profile page displays:

- **User Information:** Name, email, membership date (derived from `createdAt` timestamp), and admin badge (for the designated admin email).
- **Account Deletion (Danger Zone):** A multi-step destructive flow:
  1. Re-authenticates the user via `reauthenticateWithCredential()` to confirm identity.
  2. Batch-deletes all documents in the `habits` subcollection.
  3. Batch-deletes all documents in the `sleepLogs` subcollection.
  4. Deletes the user's root Firestore document.
  5. Deletes the Firebase Authentication user account via `deleteUser()`.
  6. Navigates to the login page.

### 7.6 AI (Gemini) Integration

**Files Involved:** `pages/Dashboard.tsx`, `apiKeys.ts`

The application integrates **Google Gemini AI** (model: `gemini-3-flash-preview`) to generate motivational coaching messages:

- **Implementation:** The `GoogleGenAI` class from `@google/genai` is instantiated with the API key from environment variables. The `generateContent()` method is called with a structured prompt that includes the user's current habit titles and categories, the current date, and an instruction to provide a concise (max 12 words), high-performance coaching quote.
- **Fallback:** On API failure, a static fallback message ("Consistency is the only path to mastery.") is displayed.
- **Refresh:** Users can manually refresh the AI response via the "Refresh AI" button on the dashboard.
- **Display:** The response is rendered in the "Neuro Link" card with bold italic typography and an emerald-themed accent design.

### 7.7 EmailJS Integration

**Files Involved:** `pages/Login.tsx`, `apiKeys.ts`, `constants.ts`

EmailJS is used to send OTP verification emails during the signup process:

- **Flow:** When a user initiates signup, the application generates a 6-digit random numeric OTP, stores it in component state, and sends it via `emailjs.send()` using the configured service ID, template ID, and public key.
- **Template Parameters:** `to_name` (user's entered name), `to_email` (user's entered email), and `otp` (the generated code).
- **Resend Cooldown:** A 60-second cooldown timer prevents spam sending, implemented via `setInterval` with countdown state.
- **Security Note:** OTP validation occurs client-side by comparing the user's input against the stored generated code. This is a lightweight verification suitable for non-critical applications.

---

## 8. DATABASE DESIGN

The application uses **Google Cloud Firestore** (NoSQL document-oriented database) with the following hierarchical structure:

```
Firestore Root
└── users (collection)
    └── {userId} (document)
        ├── uid: string
        ├── name: string
        ├── email: string
        ├── createdAt: number (epoch milliseconds)
        │
        ├── habits (subcollection)
        │   └── {habitId} (document)
        │       ├── id: string
        │       ├── title: string
        │       ├── category: string ("General" | "Health" | "Productivity" | "Mindset" | "Fitness" | "Learning")
        │       ├── streak: number
        │       ├── completedDates: string[] (format: "YYYY-MM-DD")
        │       ├── failedDates: string[] (format: "YYYY-MM-DD")
        │       └── createdAt: Timestamp (Firestore server timestamp)
        │
        └── sleep (subcollection)
            └── {date} (document, keyed by "YYYY-MM-DD")
                ├── date: string ("YYYY-MM-DD")
                ├── hours: number (0–14, step 0.5)
                └── quality: string ("Good" | "Average" | "Poor")
```

**Design Rationale:**

- **Subcollections over nested maps:** Habits and sleep logs are stored as subcollections rather than arrays or maps within the user document. This enables Firestore queries with ordering and pagination, avoids the 1 MB document size limit, and allows real-time listeners scoped to individual subcollections.
- **Date-keyed sleep documents:** Sleep logs use the date string (`YYYY-MM-DD`) as the document ID, ensuring natural deduplication—logging sleep for the same day overwrites the previous entry via `setDoc()`.
- **Denormalized streak:** The streak count is stored directly on each habit document to avoid expensive recalculation on every read. It is updated atomically whenever a habit status changes.

---

## 9. IMPLEMENTATION DETAILS

### 9.1 Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | React | 19.0.0 |
| Language | TypeScript | 5.7.3 |
| Build Tool | Vite | 6.0.11 |
| CSS Framework | TailwindCSS | 3.4.17 (CDN) |
| Icons | Lucide React | 0.475.0 |
| Data Visualization | Recharts | 2.15.1 |
| Backend / Database | Firebase (Firestore + Auth) | 11.3.1 |
| AI Service | Google Gemini (`@google/genai`) | 1.38.0 |
| Email Service | EmailJS (`@emailjs/browser`) | 4.4.1 |
| Routing | React Router DOM | 7.12.0 |
| Deployment | Vercel | — |

### 9.2 Routing Architecture

The application uses `HashRouter` from React Router DOM, configured in `App.tsx`:

| Route | Component | Access |
|---|---|---|
| `/login` | `Login` | Public |
| `/reset-password` | `ResetPassword` | Public |
| `/dashboard` | `Dashboard` | Protected |
| `/yearly` | `YearlyOverview` | Protected |
| `/profile` | `Profile` | Protected |
| `/` (default) | Redirect → `/dashboard` | — |
| `*` (catch-all) | Redirect → `/dashboard` | — |

**Protected Routes:** The `ProtectedRoute` wrapper component checks `useAuth()` state. If `loading` is true, the `GlobalLoader` splash screen is displayed. If `user` is null, navigation is redirected to `/login`. Otherwise, the page is rendered inside the `Layout` component.

### 9.3 State Management

The application uses **React Context** and **custom hooks** for state management, avoiding the need for external state libraries:

- `AuthContext` provides `user` (Firebase Auth user object), `profile` (Firestore user profile), and `loading` state globally.
- `useHabits()` manages habit data with local state backed by Firestore real-time listeners.
- `useSleep()` manages sleep log data similarly.

### 9.4 Responsive Design Strategy

The UI is designed with a **mobile-first approach** using TailwindCSS breakpoints:

- **Mobile (< 768px):** Bottom floating navigation bar, compact table cells, condensed typography.
- **Tablet (768px–1023px):** Two-column grids, expanded padding, larger touch targets.
- **Desktop (≥ 1024px):** Persistent sidebar navigation, multi-column dashboard grid, full-width habit table.

The `Layout.tsx` component implements dual navigation: a `<aside>` sidebar for desktop (hidden on mobile via `hidden lg:flex`) and a `<nav>` bottom bar for mobile/tablet (hidden on desktop via `lg:hidden`).

---

## 10. SECURITY IMPLEMENTATION

### 10.1 Environment Variables

All sensitive API keys are externalized into a `.env` file and accessed via Vite's `import.meta.env` mechanism. The centralized access point is `apiKeys.ts`:

```typescript
export const KEYS = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // ... (6 total Firebase keys)
  },
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
};
```

**Variables required (10 total):** `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_GEMINI_API_KEY`.

### 10.2 Firebase Security

- **Authentication:** Firebase Auth handles password hashing, session management, and token refresh automatically. No user passwords are stored or processed by the application.
- **Data Isolation:** All user data is stored under `users/{uid}/...` paths. Firestore security rules should restrict each user to reading/writing only their own document subtree.
- **Re-authentication:** Account deletion requires the user to re-enter their password, which is verified via `reauthenticateWithCredential()` before any destructive operations proceed.

### 10.3 Git Security

The `.gitignore` file excludes `.env`, `.env.local`, `node_modules/`, and build output (`dist/`) from version control, preventing accidental exposure of credentials in the repository.

---

## 11. DEPLOYMENT PROCESS

### 11.1 GitHub Repository

The project source code is hosted on **GitHub** at `HariesHussain/Habit-tracker`. All development is committed and pushed to the repository, which serves as the single source of truth.

### 11.2 Vercel Deployment

**Vercel** is used for production hosting with the following configuration:

1. **Connect Repository:** The GitHub repository is linked to a Vercel project.
2. **Build Command:** `tsc && vite build` (as defined in `package.json` → `scripts.build`).
3. **Output Directory:** `dist/` (Vite default).
4. **Environment Variables:** All 10 environment variables from `.env` are configured in the Vercel project settings dashboard.
5. **SPA Routing:** The `vercel.json` file contains a rewrite rule that routes all paths to `index.html`, enabling client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

6. **Continuous Deployment:** Every push to the main branch triggers an automatic rebuild and deployment on Vercel.

---

## 12. ADVANTAGES

1. **Real-Time Synchronization:** Firestore `onSnapshot` listeners ensure data is instantly consistent across all connected devices and browser tabs.
2. **AI-Powered Motivation:** Gemini integration provides dynamic, personalized coaching that adapts to the user's habit portfolio, setting this apart from static-content competitors.
3. **Integrated Sleep Tracking:** Combining habit tracking with sleep monitoring in a single application gives users a more holistic view of their behavioral patterns.
4. **Serverless Architecture:** Using Firebase eliminates the need for managing backend servers, reducing operational complexity and cost.
5. **Fully Responsive:** The adaptive layout with mobile bottom navigation, tablet-optimized grids, and desktop sidebar ensures a premium experience across all device classes.
6. **Automated Deployment:** GitHub + Vercel CI/CD pipeline ensures zero-downtime deployments with every code push.
7. **Optimistic UI Updates:** Habit deletion uses optimistic state updates with automatic rollback on failure, providing immediate visual feedback to users.
8. **Secure by Design:** All credentials are externalized; no secrets are embedded in the compiled JavaScript bundle.

---

## 13. LIMITATIONS

1. **Client-Side OTP Validation:** The OTP comparison occurs in the browser, which means a technically sophisticated attacker could bypass the check. A server-side validation via Firebase Cloud Functions would be more robust.
2. **No Offline Support:** The application requires an active internet connection; there is no service worker or offline caching strategy (such as Progressive Web App features).
3. **Single User Role:** There is no multi-role authorization system (e.g., admin dashboard for user management). The admin distinction is based solely on a hardcoded email comparison.
4. **No Data Export:** Users cannot export their habit or sleep data in CSV, PDF, or other formats for external analysis.
5. **Limited AI Customization:** The Gemini prompt is fixed; users cannot configure the tone or type of motivational content they receive.
6. **No Push Notifications:** The application does not send push or email reminders to prompt users to log their habits or sleep daily.

---

## 14. FUTURE ENHANCEMENTS

1. **Progressive Web App (PWA):** Add a service worker, manifest, and offline caching to allow the app to function without an internet connection and be installable on home screens.
2. **Push Notifications:** Implement browser push notifications (via Firebase Cloud Messaging) or scheduled email reminders to improve daily engagement.
3. **Social/Community Features:** Allow users to share habits, create groups, and compare progress, introducing a social accountability dimension.
4. **Data Export & Analytics Dashboard:** Provide CSV export and advanced analytics (weekly/monthly completion trends, habit correlation analysis, sleep-vs-habit performance charts).
5. **Server-Side OTP Validation:** Migrate OTP verification to Firebase Cloud Functions to eliminate client-side bypass risks.
6. **Multi-Language Support (i18n):** Internationalize the interface to support non-English-speaking users.
7. **Dark/Light Theme Toggle:** Add a user-selectable theme option (currently the app is dark-mode only).
8. **Habit Archiving:** Instead of permanent deletion, allow habits to be archived and restored, preserving historical data.
9. **Gamification:** Introduce badges, achievements, and leveling systems to increase user motivation.
10. **Mobile Native Apps:** Extend to native iOS and Android applications using React Native with shared business logic.

---

## 15. CONCLUSION

The **HabitTracker** project successfully demonstrates the design and implementation of a modern, full-stack web application that combines habit tracking, sleep monitoring, and AI-powered coaching into a unified, secure, and responsive platform. Built with React 19, TypeScript, Firebase, and Google Gemini AI, the application leverages contemporary web technologies and serverless architecture to deliver a production-ready product suitable for real-world use.

The project encompasses end-to-end software engineering practices: from requirement analysis and system design, through frontend component development and third-party API integration, to secure environment configuration and automated cloud deployment. The codebase follows clean architecture principles with clear separation of concerns across components, pages, hooks, context providers, and utility libraries.

The application addresses genuine user needs in the personal development space while providing a foundation that can be extended with features such as PWA support, push notifications, social features, and advanced analytics. This project has been a valuable exercise in applying theoretical knowledge to practical software development, producing a tangible, deployable, and useful product.

---

## 16. REFERENCES

1. React Official Documentation. (2025). *React: A JavaScript library for building user interfaces.* https://react.dev/
2. TypeScript Documentation. (2025). *TypeScript: Typed JavaScript at any scale.* https://www.typescriptlang.org/docs/
3. Firebase Documentation. (2025). *Firebase: Google's app development platform.* https://firebase.google.com/docs
4. Vite Official Documentation. (2025). *Vite: Next generation frontend tooling.* https://vite.dev/
5. TailwindCSS Documentation. (2025). *Tailwind CSS: A utility-first CSS framework.* https://tailwindcss.com/docs
6. Google Gemini AI API Documentation. (2025). *Gemini API: Build with Google AI.* https://ai.google.dev/docs
7. EmailJS Documentation. (2025). *EmailJS: Send emails directly from JavaScript.* https://www.emailjs.com/docs/
8. Recharts Documentation. (2025). *Recharts: A composable charting library built on React components.* https://recharts.org/
9. Vercel Documentation. (2025). *Vercel: Deploy web projects with zero configuration.* https://vercel.com/docs
10. React Router Documentation. (2025). *React Router: Declarative routing for React.* https://reactrouter.com/
11. Clear, J. (2018). *Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones.* Penguin Random House.
12. Lucide Icons. (2025). *Lucide: Beautiful & consistent icon toolkit.* https://lucide.dev/

---

*Document generated based on actual source code analysis of the HabitTracker project repository.*

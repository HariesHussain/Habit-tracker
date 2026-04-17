export const SITE_NAME = 'Habit Tracker';
export const SITE_DESCRIPTION = 'Track habits, sleep consistency, and long-term progress in one premium dashboard.';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://habitflowx.vercel.app';
export const SITE_IMAGE = `${SITE_URL}/og-image.svg`;

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

export const PAGE_SEO: Record<string, Omit<SeoConfig, 'path'>> = {
  '/login': {
    title: `Login | ${SITE_NAME}`,
    description: 'Securely sign in to your Habit Tracker account.',
  },
  '/reset-password': {
    title: `Reset Password | ${SITE_NAME}`,
    description: 'Reset your Habit Tracker password and recover account access.',
  },
  '/dashboard': {
    title: `Dashboard | ${SITE_NAME}`,
    description: 'Monitor daily habits, sleep metrics, and AI coaching insights.',
  },
  '/yearly': {
    title: `Yearly Overview | ${SITE_NAME}`,
    description: 'Analyze year-over-year habit completion and trends.',
  },
  '/profile': {
    title: `Profile | ${SITE_NAME}`,
    description: 'Manage your profile and account security settings.',
  },
};

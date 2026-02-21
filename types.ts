
import { type Timestamp } from 'firebase/firestore';

export type SleepQuality = 'Good' | 'Average' | 'Poor';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: Timestamp;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  failedDates: string[];    // YYYY-MM-DD
  createdAt: Timestamp;
  deletedAt?: Timestamp | null;
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  hours: number;
  quality: SleepQuality;
}

export interface HabitUpdate {
  title?: string;
  category?: string;
  completedDates?: string[];
  failedDates?: string[];
  streak?: number;
}


import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Habit } from '../types';
import { calculateStreak } from '../lib/utils';
import { sanitizeText, validateHabitTitle } from '../lib/security';

const parseTimestamp = (val: any): Timestamp => {
  if (val instanceof Timestamp) return val;
  if (val && typeof val === 'object' && 'seconds' in val) {
    return new Timestamp(val.seconds, val.nanoseconds || 0);
  }
  return Timestamp.now();
};

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const habitsCollectionRef = collection(db, 'users', user.uid, 'habits');
    // Changed ordering to createdAt asc so first added stay on top
    const q = query(habitsCollectionRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: parseTimestamp(data.createdAt),
          completedDates: data.completedDates || [],
          failedDates: data.failedDates || []
        } as Habit;
      });
      setHabits(habitsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const addHabit = async (title: string, category: string) => {
    if (!user) return;
    const cleanTitle = sanitizeText(title, 60);
    const cleanCategory = sanitizeText(category, 20);

    if (!validateHabitTitle(cleanTitle)) {
      throw new Error('Invalid habit title format.');
    }

    try {
      const habitsRef = collection(db, 'users', user.uid, 'habits');
      const newHabitRef = doc(habitsRef);
      await setDoc(newHabitRef, {
        id: newHabitRef.id,
        title: cleanTitle,
        category: cleanCategory || 'General',
        streak: 0,
        completedDates: [],
        failedDates: [],
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      alert(`Error adding habit: ${err.message}`);
    }
  };

  const updateHabitStatus = async (habitId: string, dateStr: string, status: 'Completed' | 'Failed' | 'Neutral') => {
    if (!user) return;
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    let completedDates = [...(habit.completedDates || [])];
    let failedDates = [...(habit.failedDates || [])];
    
    completedDates = completedDates.filter(d => d !== dateStr);
    failedDates = failedDates.filter(d => d !== dateStr);

    if (status === 'Completed') completedDates.push(dateStr);
    else if (status === 'Failed') failedDates.push(dateStr);

    const streak = calculateStreak(completedDates, failedDates);
    const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
    
    await updateDoc(habitRef, { completedDates, failedDates, streak });
  };

  const deleteHabit = async (habitId: string) => {
    if (!user || !habitId) return;
    
    const originalHabits = [...habits];
    setHabits(prev => prev.filter(h => h.id !== habitId));

    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
      await deleteDoc(habitRef);
    } catch (err: any) {
      setHabits(originalHabits);
      alert(`Cloud Delete Failed: ${err.message}`);
    }
  };

  const deleteMultipleHabits = async (habitIds: string[]) => {
    if (!user || habitIds.length === 0) return;

    const originalHabits = [...habits];
    setHabits(prev => prev.filter(h => !habitIds.includes(h.id)));

    try {
      const batch = writeBatch(db);
      habitIds.forEach(id => {
        const ref = doc(db, 'users', user.uid, 'habits', id);
        batch.delete(ref);
      });
      await batch.commit();
    } catch (err: any) {
      setHabits(originalHabits);
      alert(`Batch Wipe Failed: ${err.message}`);
    }
  };

  return { habits, loading, addHabit, updateHabitStatus, deleteHabit, deleteMultipleHabits };
};

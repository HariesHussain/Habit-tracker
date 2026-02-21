
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { SleepLog } from '../types';
import { getSleepQuality } from '../lib/utils';

export const useSleep = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CRITICAL: Clear state immediately when user changes
    setLogs([]);
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    // Using modular Firestore functions for real-time sync
    const q = query(
      collection(db, 'users', user.uid, 'sleep'),
      orderBy('date', 'desc'),
      limit(60)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sleepData = snapshot.docs.map(doc => doc.data() as SleepLog);
      setLogs(sleepData);
      setLoading(false);
    }, (error) => {
      console.error("Sleep Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const logSleep = async (date: string, hours: number) => {
    if (!user) return;
    const quality = getSleepQuality(hours);
    // Using modular doc and setDoc functions
    const logRef = doc(db, 'users', user.uid, 'sleep', date);
    await setDoc(logRef, {
      date,
      hours,
      quality
    });
  };

  return { logs, loading, logSleep };
};


export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getTodayStr = (): string => {
  return formatDate(new Date());
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const calculateStreak = (completedDates: string[], failedDates: string[]): number => {
  const todayStr = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // If today is failed, streak is 0.
  if (failedDates.includes(todayStr)) return 0;

  // We start checking from either today (if completed) or yesterday (if not completed but not failed yet)
  let checkDate = completedDates.includes(todayStr) ? new Date() : yesterday;
  let streak = 0;

  while (true) {
    const checkStr = formatDate(checkDate);
    if (completedDates.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getSleepQuality = (hours: number): 'Good' | 'Average' | 'Poor' => {
  if (hours >= 7) return 'Good';
  if (hours >= 5) return 'Average';
  return 'Poor';
};

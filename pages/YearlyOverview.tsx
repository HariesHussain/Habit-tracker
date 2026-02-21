
import React, { useMemo, useState } from 'react';
import { ChevronLeft, CalendarDays, Check, X, ArrowRight, Award, History, Trash2 } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { MONTHS } from '../constants';
import { getDaysInMonth, formatDate, getTodayStr } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Habit } from '../types';

type ViewMode = 'years' | 'months' | 'detail';

export const YearlyOverview: React.FC = () => {
  const { habits, updateHabitStatus, deleteHabit } = useHabits();
  const [viewMode, setViewMode] = useState<ViewMode>('years');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const todayStr = getTodayStr();

  const isHabitVisibleInMonth = (h: Habit, year: number, monthIdx: number) => {
    const createdDate = h.createdAt.toDate();
    const createdYear = createdDate.getFullYear();
    const createdMonth = createdDate.getMonth();
    
    // Habit must have been created before or during this month
    const isCreatedByMonth = createdYear < year || (createdYear === year && createdMonth <= monthIdx);
    if (!isCreatedByMonth) return false;

    // Check if there is any history for this month
    const hasHistoryInMonth = [...h.completedDates, ...h.failedDates].some(d => {
      const date = new Date(d);
      return date.getFullYear() === year && date.getMonth() === monthIdx;
    });

    if (hasHistoryInMonth) return true;

    // For hard-deleted habits, we only show them if they have history. 
    // Since we hard delete now, if it's in the 'habits' list, it is technically "active".
    return true;
  };

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear());
    habits.forEach(h => {
      years.add(h.createdAt.toDate().getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [habits]);

  const monthStats = useMemo(() => {
    return MONTHS.map((_, mIdx) => {
      const activeHabitsInMonth = habits.filter(h => isHabitVisibleInMonth(h, selectedYear, mIdx));
      const days = getDaysInMonth(selectedYear, mIdx);
      const totalPossible = days.length * activeHabitsInMonth.length;
      if (totalPossible === 0) return 0;
      let completed = 0;
      activeHabitsInMonth.forEach(h => {
        h.completedDates.forEach(d => {
          const date = new Date(d);
          if (date.getFullYear() === selectedYear && date.getMonth() === mIdx) {
            completed++;
          }
        });
      });
      return Math.round((completed / totalPossible) * 100);
    });
  }, [habits, selectedYear]);

  const visibleHabitsDetail = useMemo(() => {
    return habits.filter(h => isHabitVisibleInMonth(h, selectedYear, selectedMonth));
  }, [habits, selectedYear, selectedMonth]);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setViewMode('months');
  };

  const handleMonthSelect = (monthIdx: number) => {
    setSelectedMonth(monthIdx);
    setViewMode('detail');
  };

  const cycleStatus = (habitId: string, dateStr: string, currentStatus: 'Completed' | 'Failed' | 'Neutral') => {
    let nextStatus: 'Completed' | 'Failed' | 'Neutral' = 'Completed';
    if (currentStatus === 'Completed') nextStatus = 'Failed';
    else if (currentStatus === 'Failed') nextStatus = 'Neutral';
    updateHabitStatus(habitId, dateStr, nextStatus);
  };

  const handleDeleteClick = (e: React.MouseEvent, habitId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Permanently delete "${title}"? This will erase all history for this habit.`)) {
      deleteHabit(habitId);
    }
  };

  if (viewMode === 'years') {
    return (
      <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] md:text-sm font-black text-indigo-500 uppercase tracking-[0.3em] mb-1 md:mb-2">Archive</h2>
            <h1 className="text-3xl md:text-4xl font-black text-white">Select Year</h1>
          </div>
          <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors text-xs md:text-sm font-bold flex items-center gap-2">
            Back to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className="bg-gray-900 border border-gray-800 rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <CalendarDays className="w-8 h-8 md:w-10 md:h-10 text-indigo-500 group-hover:scale-110 transition-transform" />
                <Award className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              </div>
              <h3 className="text-xl md:text-3xl font-black text-white md:mb-2">{year}</h3>
              <p className="hidden md:block text-gray-500 font-medium text-sm">View history for {year}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'months') {
    return (
      <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
        <header className="flex items-center gap-4">
          <button onClick={() => setViewMode('years')} className="p-2 md:p-3 bg-gray-900 border border-gray-800 rounded-xl md:rounded-2xl text-gray-400 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{selectedYear} Archive</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select a month</p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {MONTHS.map((month, idx) => {
            const progress = monthStats[idx];
            return (
              <button
                key={month}
                onClick={() => handleMonthSelect(idx)}
                className="bg-gray-900 border border-gray-800 rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group overflow-hidden relative"
              >
                <div className="relative z-10">
                  <h3 className="text-lg md:text-2xl font-black text-white mb-2 md:mb-4">{month}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] md:text-[10px] font-black text-gray-500 uppercase">
                      <span>Progress</span>
                      <span className="text-indigo-400">{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
                <History className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 text-white/5 rotate-12 group-hover:scale-125 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex items-center gap-4">
        <button onClick={() => setViewMode('months')} className="p-2 md:p-3 bg-gray-900 border border-gray-800 rounded-xl md:rounded-2xl text-gray-400 hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{MONTHS[selectedMonth]} {selectedYear}</h1>
          <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">Historical Records</p>
        </div>
      </header>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800/50 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <th className="sticky left-0 z-20 bg-gray-900/95 backdrop-blur-md p-4 md:p-6 text-left border-r border-gray-800/50 min-w-[120px] md:min-w-[180px]">Tasks</th>
                {daysInMonth.map((day) => (
                  <th key={day.toISOString()} className={`p-3 md:p-4 min-w-[42px] md:min-w-[50px] text-center ${formatDate(day) === todayStr ? 'bg-indigo-500/20 text-indigo-400' : ''}`}>
                    {day.getDate()}
                  </th>
                ))}
                <th className="sticky right-0 z-20 bg-gray-900/95 backdrop-blur-md p-4 md:p-6 border-l border-gray-800/50 w-12 md:w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {visibleHabitsDetail.length > 0 ? visibleHabitsDetail.map((habit) => (
                <tr key={habit.id} className="group hover:bg-gray-800/20 transition-colors">
                  <td className="sticky left-0 z-20 bg-gray-900/95 backdrop-blur-md p-4 md:p-6 border-r border-gray-800/50 font-bold text-gray-200 truncate text-xs md:text-sm">
                    <div className="flex flex-col">
                      <span>{habit.title}</span>
                    </div>
                  </td>
                  {daysInMonth.map((day) => {
                    const dStr = formatDate(day);
                    const isCompleted = habit.completedDates.includes(dStr);
                    const isFailed = habit.failedDates.includes(dStr);
                    const status = isCompleted ? 'Completed' : isFailed ? 'Failed' : 'Neutral';
                    return (
                      <td key={`${habit.id}-${dStr}`} onClick={() => cycleStatus(habit.id, dStr, status)} className="p-0 min-w-[42px] md:min-w-[50px] cursor-pointer hover:bg-indigo-500/5">
                        <div className="flex items-center justify-center h-12 md:h-14 w-full">
                          {isCompleted && <div className="bg-indigo-500/90 text-white rounded-lg p-0.5 md:p-1"><Check className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[4px]" /></div>}
                          {isFailed && <div className="bg-rose-500/20 border border-rose-500/40 text-rose-500 rounded-lg p-0.5 md:p-1"><X className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[4px]" /></div>}
                        </div>
                      </td>
                    );
                  })}
                  <td className="sticky right-0 z-20 bg-gray-900/95 backdrop-blur-md p-1 md:p-2 border-l border-gray-800/50 text-center">
                    <button 
                      onClick={(e) => handleDeleteClick(e, habit.id, habit.title)}
                      className="p-2 md:p-3 text-gray-700 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={daysInMonth.length + 2} className="p-12 md:p-20 text-center text-gray-600 font-medium text-sm">
                    No active tasks recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { Habit } from '../types';
import { HabitMatrix } from './HabitMatrix';
import { getTodayStr } from '../lib/utils';
import { MONTHS } from '../constants';

interface HabitCardProps {
  habit: Habit;
  onUpdateStatus: (id: string, date: string, status: 'Completed' | 'Failed' | 'Neutral') => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onUpdateStatus }) => {
  const todayStr = getTodayStr();
  const isCompletedToday = habit.completedDates.includes(todayStr);
  const isFailedToday = habit.failedDates.includes(todayStr);

  const handleCycleStatus = () => {
    if (isCompletedToday) {
      onUpdateStatus(habit.id, todayStr, 'Failed');
    } else if (isFailedToday) {
      onUpdateStatus(habit.id, todayStr, 'Neutral');
    } else {
      onUpdateStatus(habit.id, todayStr, 'Completed');
    }
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-400 mb-2">
            {habit.category}
          </span>
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {habit.title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full">
            <Flame className="w-4 h-4 fill-emerald-400/20" />
            <span className="text-sm font-bold">{habit.streak}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-500 font-medium">{MONTHS[currentMonth]} Activity</p>
            <p className="text-xs text-gray-500">{habit.completedDates.length} total</p>
        </div>
        <HabitMatrix 
          completedDates={habit.completedDates} 
          failedDates={habit.failedDates} 
          month={currentMonth} 
          year={currentYear}
          interactive={true}
          onDateClick={handleCycleStatus}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <button
          onClick={handleCycleStatus}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${isCompletedToday ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
              isFailedToday ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 
              'bg-gray-800 text-gray-300 hover:bg-gray-700'}
          `}
        >
          {isCompletedToday ? 'Completed' : isFailedToday ? 'Failed' : 'Mark Progress'}
          <ChevronRight className={`w-4 h-4 transition-transform ${isCompletedToday || isFailedToday ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  );
};

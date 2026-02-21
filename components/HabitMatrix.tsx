
import React from 'react';
import { formatDate, getDaysInMonth, getTodayStr } from '../lib/utils';

interface HabitMatrixProps {
  completedDates: string[];
  failedDates: string[];
  month: number;
  year: number;
  interactive?: boolean;
  onDateClick?: (dateStr: string) => void;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({ 
  completedDates, 
  failedDates, 
  month, 
  year, 
  interactive = false,
  onDateClick 
}) => {
  const days = getDaysInMonth(year, month);
  const todayStr = getTodayStr();

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((day) => {
        const dStr = formatDate(day);
        const isCompleted = completedDates.includes(dStr);
        const isFailed = failedDates.includes(dStr);
        const isToday = dStr === todayStr;
        const isPast = new Date(dStr) < new Date(todayStr);

        let color = 'bg-gray-800';
        if (isCompleted) color = 'bg-emerald-500';
        else if (isFailed) color = 'bg-rose-500';
        else if (isToday) color = 'bg-gray-700 ring-2 ring-emerald-500/50';

        return (
          <div
            key={dStr}
            title={dStr}
            onClick={() => interactive && isToday && onDateClick?.(dStr)}
            className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 cursor-default
              ${color} 
              ${interactive && isToday ? 'cursor-pointer hover:scale-125' : ''}
              ${!isToday && !isCompleted && !isFailed && isPast ? 'opacity-40' : ''}
            `}
          />
        );
      })}
    </div>
  );
};

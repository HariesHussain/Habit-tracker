
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles, BrainCircuit, Loader2, Calendar, Check, X, Trash2, Info, Cpu } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { useSleep } from '../hooks/useSleep';
import { SleepTracker } from '../components/SleepTracker';
import { HABIT_CATEGORIES, MONTHS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { getTodayStr, getDaysInMonth, formatDate } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { habits, addHabit, updateHabitStatus, deleteHabit, deleteMultipleHabits, loading: habitsLoading } = useHabits();
  const { logs, logSleep } = useSleep();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('General');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [aiCoachResponse, setAiCoachResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const todayStr = getTodayStr();
  const todayDate = new Date();
  const daysInMonth = getDaysInMonth(todayDate.getFullYear(), todayDate.getMonth());
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollInitiated = useRef(false);

  // Tablet-Aware Scroll to Today
  useEffect(() => {
    if (!habitsLoading && tableContainerRef.current && !scrollInitiated.current && habits.length > 0) {
      const performScroll = () => {
        const container = tableContainerRef.current;
        if (!container) return;

        const todayHeader = container.querySelector('[data-today="true"]') as HTMLElement;
        if (todayHeader) {
          const width = window.innerWidth;
          const stickyColumnWidth = width < 768 ? 110 : (width < 1024 ? 160 : 240);
          const elementLeft = todayHeader.offsetLeft;
          
          container.scrollTo({
            left: Math.max(0, elementLeft - stickyColumnWidth - 20),
            behavior: 'smooth'
          });
          scrollInitiated.current = true;
        }
      };

      const timer = setTimeout(performScroll, 800);
      return () => clearTimeout(timer);
    }
  }, [habitsLoading, habits.length]);

  useEffect(() => {
    getAiCoaching();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === habits.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(habits.map(h => h.id));
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    await addHabit(newHabitTitle, newHabitCategory);
    setNewHabitTitle('');
    setIsAddModalOpen(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteMultipleHabits(selectedIds);
    setSelectedIds([]);
    setIsDeleteConfirmOpen(false);
  };

  const cycleStatus = (habitId: string, dateStr: string, currentStatus: 'Completed' | 'Failed' | 'Neutral') => {
    if (dateStr !== todayStr) return;
    let nextStatus: 'Completed' | 'Failed' | 'Neutral' = 'Completed';
    if (currentStatus === 'Completed') nextStatus = 'Failed';
    else if (currentStatus === 'Failed') nextStatus = 'Neutral';
    updateHabitStatus(habitId, dateStr, nextStatus);
  };

  const getAiCoaching = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const habitsSummary = habits.length > 0 
        ? habits.map(h => `${h.title} (${h.category})`).join(', ')
        : "The user has no habits yet.";
        
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User habits context: [${habitsSummary}]. Current date: ${todayStr}. Task: Provide a brutal, elite, high-performance coaching quote (max 12 words). No emojis. No preamble.`,
      });
      
      setAiCoachResponse(response.text?.trim().replace(/^"|"$/g, '') || "Excellence is not an act, but a habit.");
    } catch (error) {
      setAiCoachResponse("Consistency is the only path to mastery.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-32 animate-in fade-in duration-700">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3 mb-1 md:mb-2">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
              {MONTHS[todayDate.getMonth()]}
            </h1>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px] ml-9 md:ml-11">
            Neuro-Link Activated
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={getAiCoaching}
            disabled={isAiLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            <span className="hidden sm:inline">Refresh AI</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Track
          </button>
        </div>
      </section>

      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto scrollbar-hide touch-pan-x" ref={tableContainerRef}>
          <table className="w-full border-separate border-spacing-y-2 border-spacing-x-1 md:border-spacing-y-3 md:border-spacing-x-2 px-2 md:px-4 pb-4 md:pb-6">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-gray-950/90 backdrop-blur-xl p-3 md:p-5 lg:p-6 text-left rounded-2xl md:rounded-3xl min-w-[110px] md:min-w-[160px] lg:min-w-[240px]">
                  <div className="flex items-center gap-2 md:gap-4">
                    <input 
                      type="checkbox"
                      checked={habits.length > 0 && selectedIds.length === habits.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 md:w-5 md:h-5 rounded-lg border-gray-700 bg-gray-800 text-emerald-500 cursor-pointer accent-emerald-500"
                    />
                    <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Protocol</span>
                  </div>
                </th>
                {daysInMonth.map((day) => {
                  const dStr = formatDate(day);
                  const isToday = dStr === todayStr;
                  return (
                    <th 
                      key={dStr}
                      data-today={isToday}
                      className={`p-2 md:p-4 text-[9px] md:text-[10px] font-black transition-all min-w-[48px] md:min-w-[56px] text-center uppercase tracking-widest rounded-xl md:rounded-2xl
                        ${isToday ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 'text-gray-600'}
                      `}
                    >
                      {day.getDate()}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {habits.length > 0 ? habits.map((habit) => {
                const isSelected = selectedIds.includes(habit.id);
                return (
                  <tr key={habit.id} className="group">
                    <td className={`sticky left-0 z-20 bg-gray-950/90 backdrop-blur-xl p-3 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl transition-all ${isSelected ? 'ring-2 ring-emerald-500/50' : 'group-hover:bg-gray-900/80'}`}>
                      <div className="flex items-center gap-2 md:gap-4">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(habit.id)}
                          className="w-4 h-4 md:w-5 md:h-5 rounded-lg border-gray-700 bg-gray-800 text-emerald-500 cursor-pointer accent-emerald-500"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={`font-black transition-all text-[10px] md:text-sm uppercase tracking-tight truncate ${isSelected ? 'text-emerald-400' : 'text-gray-200'}`}>
                            {habit.title}
                          </span>
                          <span className="text-[7px] md:text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-0.5 truncate">{habit.category}</span>
                        </div>
                      </div>
                    </td>
                    {daysInMonth.map((day) => {
                      const dStr = formatDate(day);
                      const isToday = dStr === todayStr;
                      const isCompleted = habit.completedDates.includes(dStr);
                      const isFailed = habit.failedDates.includes(dStr);
                      const status = isCompleted ? 'Completed' : isFailed ? 'Failed' : 'Neutral';

                      return (
                        <td key={`${habit.id}-${dStr}`} className="p-0">
                          <div 
                            onClick={() => isToday && cycleStatus(habit.id, dStr, status)}
                            className={`
                              flex items-center justify-center h-12 md:h-14 w-full rounded-xl md:rounded-2xl transition-all
                              ${isToday 
                                ? 'cursor-pointer ring-1 md:ring-2 ring-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-90' 
                                : 'cursor-default bg-gray-900/20 border border-gray-800/10'
                              }
                              ${isCompleted ? '!bg-emerald-500/20 !border-emerald-500/30 ring-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}
                              ${isFailed ? '!bg-rose-500/20 !border-rose-500/30 ring-0' : ''}
                            `}
                          >
                            {isCompleted ? (
                              <div className="bg-emerald-500 text-white rounded-lg p-1 md:p-1.5 shadow-lg shadow-emerald-500/30">
                                <Check className="w-3 h-3 md:w-4 md:h-4 stroke-[4px]" />
                              </div>
                            ) : isFailed ? (
                              <div className="bg-rose-500 text-white rounded-lg p-1 md:p-1.5 shadow-lg shadow-rose-500/30">
                                <X className="w-3 h-3 md:w-4 md:h-4 stroke-[4px]" />
                              </div>
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={daysInMonth.length + 1} className="py-20 md:py-32 text-center opacity-10">
                    <Plus className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4" />
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">No active neural tracks</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 lg:col-span-2 order-1 lg:order-1">
          <SleepTracker logs={logs} onLogSleep={logSleep} />
        </div>
        <div className="md:col-span-2 lg:col-span-1 bg-gray-900/60 border border-gray-800 rounded-2xl md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group shadow-2xl min-h-[260px] md:min-h-[340px] order-2 lg:order-2">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="bg-emerald-500/20 p-3 md:p-4 rounded-2xl md:rounded-3xl">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Neuro Link</h3>
            </div>
            
            {aiCoachResponse ? (
              <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-2 duration-700">
                 <p className="text-gray-200 text-lg md:text-3xl font-black leading-tight italic tracking-tight">
                   "{aiCoachResponse}"
                 </p>
                 <div className="h-px w-20 md:w-24 bg-emerald-500/30" />
                 <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Protocol: Optimization active</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="h-6 bg-gray-800 rounded-xl w-full animate-pulse" />
                <div className="h-6 bg-gray-800 rounded-xl w-4/5 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8 md:mb-12">
               <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Initiate</h3>
                  <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">New Neural Track</p>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-400 transition-all"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-8 md:space-y-10">
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Identity Title</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. MORNING SUNLIGHT"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl md:rounded-3xl px-6 py-5 md:px-8 md:py-6 text-white font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-800 text-sm md:text-lg"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Classification</label>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {HABIT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewHabitCategory(cat)}
                      className={`px-3 py-4 md:px-4 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl border transition-all ${
                        newHabitCategory === cat 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-gray-950 border-gray-800 text-gray-600 hover:border-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 md:py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] md:text-xs transition-all shadow-xl shadow-emerald-600/30 active:scale-95"
              >
                Seal Protocol
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Delete Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[95] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-black text-sm">{selectedIds.length}</span>
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Selected</span>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <button
              onClick={() => { setSelectedIds([]); }}
              className="px-4 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Confirm Wipe</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-8">
              {selectedIds.length} protocol{selectedIds.length > 1 ? 's' : ''} will be permanently erased
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95"
              >
                Abort
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all shadow-xl shadow-rose-600/30 active:scale-95"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

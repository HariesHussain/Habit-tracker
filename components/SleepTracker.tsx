
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Moon, Plus, Activity, Zap } from 'lucide-react';
import { SleepLog } from '../types';
import { getTodayStr } from '../lib/utils';

interface SleepTrackerProps {
  logs: SleepLog[];
  onLogSleep: (date: string, hours: number) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ logs, onLogSleep }) => {
  const [hours, setHours] = useState(7.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const todayStr = getTodayStr();

  // Show fewer points (last 7) to make the lines longer and more spaced out
  const chartData = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7) 
    .map(log => ({
      date: log.date.split('-')[2], // Just the day number for cleaner X-axis
      fullDate: log.date.split('-').slice(1).join('/'),
      hours: log.hours,
      quality: log.quality
    }));

  const todayLog = logs.find(l => l.date === todayStr);

  // Dynamically calculate the Y-axis domain so the line has drama/flutuation
  const allHours = chartData.map(d => d.hours);
  const minH = Math.max(0, Math.min(...allHours, 4) - 1);
  const maxH = Math.min(24, Math.max(...allHours, 10) + 1);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000" />
      
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-500/20 p-4 rounded-3xl ring-1 ring-indigo-500/30">
            <Activity className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter italic">Sleep Pulse</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] mt-1">Neuro-Recovery Log</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Log Recovery
        </button>
      </div>

      <div className="flex-1 min-h-[260px] md:min-h-[320px] w-full relative z-10">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="10 10" stroke="#1f2937" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#4b5563" 
                fontSize={10} 
                fontWeight="900"
                tickLine={false} 
                axisLine={false}
                dy={20}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis 
                stroke="#4b5563" 
                fontSize={10} 
                fontWeight="900"
                tickLine={false} 
                axisLine={false} 
                domain={[minH, maxH]}
                ticks={[4, 6, 8, 10, 12]}
              />
              <Tooltip 
                cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  backgroundColor: '#030712', 
                  border: '1px solid #1f2937', 
                  borderRadius: '20px', 
                  fontSize: '11px',
                  fontWeight: '900',
                  padding: '12px 16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                }}
                labelStyle={{ color: '#6366f1', marginBottom: '4px', textTransform: 'uppercase' }}
                itemStyle={{ color: '#fff' }}
              />
              {/* Ghost shadow line for depth */}
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                strokeWidth={12}
                strokeOpacity={0.05}
                dot={false}
                activeDot={false}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                strokeWidth={5}
                dot={{ 
                  r: 7, 
                  fill: '#030712', 
                  strokeWidth: 4, 
                  stroke: '#6366f1',
                }}
                activeDot={{ 
                  r: 10, 
                  fill: '#fff', 
                  stroke: '#6366f1', 
                  strokeWidth: 5,
                }}
                animationDuration={2500}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 border-2 border-dashed border-gray-800 rounded-[2.5rem] bg-gray-950/30">
            <Zap className="w-12 h-12 opacity-10 mb-4 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 text-center">Awaiting Data Streams</p>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 relative z-10">
         <div className="p-6 bg-gray-950 border border-gray-800 rounded-3xl flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Efficiency</span>
            <div className="flex items-end gap-2">
               <span className="text-2xl font-black text-white italic">
                 {chartData.length > 0 ? (allHours.reduce((a,b)=>a+b,0)/chartData.length).toFixed(1) : '--'}
               </span>
               <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest pb-1">Hours Avg</span>
            </div>
         </div>
         <div className="p-6 bg-gray-950 border border-gray-800 rounded-3xl flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Last Sync</span>
            <div className="flex items-end gap-2">
               <span className="text-2xl font-black text-white italic">
                 {todayLog ? todayLog.hours : '--'}
               </span>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pb-1">Today</span>
            </div>
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(79,70,229,0.2)] animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Log Sleep</h3>
                <Moon className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div className="space-y-12 mb-12 relative z-10">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Magnitude</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-white tracking-tighter italic">{hours}</span>
                  <span className="text-sm font-bold text-indigo-500 uppercase">H</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full h-4 bg-gray-950 rounded-full appearance-none cursor-pointer accent-indigo-500 border border-gray-800"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-black px-1 uppercase tracking-[0.3em]">
                <span>Low</span>
                <span className="text-indigo-400">8.0H Target</span>
                <span>Max</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <button
                onClick={() => {
                  onLogSleep(todayStr, hours);
                  setIsModalOpen(false);
                }}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
              >
                Sync Metrics
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-transparent text-gray-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';

export default function StatCard({ label, value, unit, accent = 'from-blue-500 to-blue-600', icon = null }) {
  return (
    <div className="rounded-2xl p-4 glass-surface dark:glass-surface-dark border border-white/30 dark:border-slate-700 shadow-[0_10px_30px_-10px_rgba(2,6,23,.2)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_18px_50px_-16px_rgba(2,6,23,.35)] hover:ring-1 ring-white/40 dark:ring-slate-700/50 animate-fade-in-up">
      <div className="text-xs text-slate-600 dark:text-slate-200 flex items-center gap-2">
        {icon && <span className="inline-flex h-4 w-4 items-center justify-center text-slate-500 dark:text-slate-200">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-end gap-1">
        <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${accent}`}>
          {value}
        </div>
        {unit && <div className="text-xs text-slate-500 dark:text-slate-200 mb-0.5">{unit}</div>}
      </div>
    </div>
  );
}

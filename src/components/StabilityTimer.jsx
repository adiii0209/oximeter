import React from 'react';

export default function StabilityTimer({ stableSeconds, required = 2 }) {
  const remaining = Math.max(0, required - stableSeconds);
  const pct = Math.min(100, Math.round((stableSeconds / required) * 100));
  return (
    <div className="mt-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-600 dark:text-slate-200">Signal stability</span>
        <span className="text-slate-500 dark:text-slate-300">{remaining > 0 ? `${remaining.toFixed(0)}s` : 'Ready'}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

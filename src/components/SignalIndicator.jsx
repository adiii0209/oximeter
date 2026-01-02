import React from 'react';

export default function SignalIndicator({ strength = 3, fingerPlaced = true }) {
  const bars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-end gap-0.5">
        {bars.map((b) => (
          <span
            key={b}
            className={`w-1.5 rounded-sm ${b <= strength ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'}`}
            style={{ height: 4 + b * 3 }}
          />
        ))}
      </div>
      <span className={`font-medium ${fingerPlaced ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {fingerPlaced ? 'Good placement' : 'Adjust finger'}
      </span>
    </div>
  );
}

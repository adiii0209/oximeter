import React from 'react';

export default function HealthStatusBadge({ spo2, hr }) {
  let level = 'normal';
  if (spo2 <= 88 || hr >= 120 || hr <= 45) level = 'critical';
  else if (spo2 < 94 || hr >= 100 || hr <= 55) level = 'low';

  const map = {
    normal: {
      text: 'Normal',
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      icon: '✅',
    },
    low: {
      text: 'Low',
      className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
      icon: '⚠️',
    },
    critical: {
      text: 'Critical',
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      icon: '⛔',
    },
  };

  const cfg = map[level];

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${cfg.className}`} title={`SpO₂ ${spo2}% · HR ${hr} bpm`}>
      <span>{cfg.icon}</span>
      <span>{cfg.text}</span>
    </div>
  );
}

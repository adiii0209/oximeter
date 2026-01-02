import React, { useEffect, useState, useRef } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Load saved preference. If none exists, explicitly default to light mode.
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setEnabled(true);
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setEnabled(false);
    } else {
      // No saved preference: ensure light theme and keep toggle off
      document.documentElement.classList.remove('dark');
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    // Smooth theme transition
    document.documentElement.classList.add('theme-transition');
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    // Persist and apply theme only after component has mounted to avoid
    // writing a default on first render.
    if (initialized.current) {
      document.documentElement.classList.toggle('dark', enabled);
      localStorage.setItem('theme', enabled ? 'dark' : 'light');
    } else {
      initialized.current = true;
    }

    return () => clearTimeout(timer);
  }, [enabled]);

  const toggle = () => setEnabled((v) => !v);

  return (
    <button
      aria-label="Toggle dark mode"
      role="switch"
      aria-checked={enabled}
      onClick={toggle}
      className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    >
      <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-slate-200 dark:bg-slate-800">
        <span className={`absolute inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
      </span>
      <span className="inline-flex items-center gap-1">
        {enabled ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-slate-200" aria-hidden>
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z"></path>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500" aria-hidden>
            <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.95-6.95 1.41-1.41M4.64 19.36l-1.41 1.41m0-14.14L4.64 4.64m14.14 14.72 1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
        <span className="sr-only">Theme</span>
        <span aria-hidden className="text-xs">{enabled ? 'Dark' : 'Light'}</span>
      </span>
    </button>
  );
}

import React, { useEffect, useRef, useState } from 'react';

export default function GuidedBreathing() {
  const [phase, setPhase] = useState('Inhale');
  const [count, setCount] = useState(4);
  const circleRef = useRef(null);

  useEffect(() => {
    let t = 0;
    const seq = [
      { name: 'Inhale', secs: 4 },
      { name: 'Hold', secs: 4 },
      { name: 'Exhale', secs: 6 },
      { name: 'Hold', secs: 2 },
    ];
    let idx = 0, left = seq[0].secs;
    setPhase(seq[0].name);
    setCount(left);
    const id = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        idx = (idx + 1) % seq.length;
        left = seq[idx].secs;
        setPhase(seq[idx].name);
      }
      setCount(left);
      t += 1;
      const scale = seq[idx].name === 'Inhale' ? 1.15 : seq[idx].name === 'Exhale' ? 0.9 : 1.0;
      if (circleRef.current) circleRef.current.style.transform = `scale(${scale})`;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl p-4 glass-surface dark:glass-surface-dark border border-white/30 dark:border-slate-700 shadow-sm animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Guided Breathing</div>
        <div className="text-xs text-slate-500 dark:text-slate-300">4-4-6-2</div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div ref={circleRef} className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 transition-transform" />
        <div className="text-sm text-slate-700 dark:text-slate-200">
          <div className="font-medium">{phase}</div>
          <div className="text-xs text-slate-500 dark:text-slate-300">{count}s</div>
        </div>
      </div>
    </div>
  );
}

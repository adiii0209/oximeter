import React, { useEffect, useRef } from 'react';

/*
  GraphMonitor: more realistic medical waveform (ECG/pleth style)
  - Canvas-based animation with grid, heart-beat spikes and baseline
  - `measuring` increases heart rate and amplitude
  - Responsive to devicePixelRatio and resizes
*/
export default function GraphMonitor({ measuring = false }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();

    function draw(now) {
      const dt = (now - last) / 1000;
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // advance time (affects horizontal scrolling)
      // when measuring we slow the visual scroll so the measurement feels longer
      const speed = measuring ? 1.0 : 0.9; // visual scroll speed (reduced from 1.8)
      tRef.current += dt * 60 * speed;

      // Clear
      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains('dark');

      // Draw grid
      const gridSize = 12;
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.06)' : 'rgba(15,23,42,0.06)';
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      // waveform parameters
      const mid = h * 0.5;
      const baseAmp = measuring ? 34 : 10; // amplitude (larger when measuring)
      // approximate beats per minute: slower, smoother variation while measuring
      const bpm = measuring
        ? 78 + Math.sin(now / 1400) * 6 + (Math.cos(now / 1100) * 2) // slower, narrower fluctuation
        : 62; // resting
      const beatIntervalPx = (w / (bpm / 60)) * 0.12; // visual spacing (tuned)

      // gradient for the line
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      // use red/orange gradient for a medical-style pleth/ECG display
      if (isDark) {
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.5, '#ef4444');
        grad.addColorStop(1, '#f87171');
      } else {
        grad.addColorStop(0, '#ef4444');
        grad.addColorStop(0.5, '#dc2626');
        grad.addColorStop(1, '#b91c1c');
      }

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = grad;
      ctx.shadowColor = isDark ? 'rgba(34,197,94,0.25)' : 'rgba(2,6,23,0.08)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const i = x + tRef.current; // moving x

        // heartbeat spike: periodic gaussian-shaped peaks
        // choose beat spacing in pixels (approx)
        const spacing = Math.max(44, (w / (bpm / 60)) * 1.1); // wider spacing so spikes appear less frequently
        const phase = (i % spacing) / spacing; // 0..1 across beat
        // create a slightly wider, less instantaneous spike so it reads slower
        const spike = Math.exp(-Math.pow((phase - 0.12) / 0.015, 2)) * baseAmp * 2.2;

        // small secondary hump
        const hump = Math.exp(-Math.pow((phase - 0.32) / 0.06, 2)) * baseAmp * 0.45;

        // breathing baseline / noise
        const baseline = Math.sin(i / 140) * (baseAmp * 0.15) + Math.sin(i / 18) * 0.6;

        const y = mid - (spike + hump + baseline);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // small glow overlay (red-tinted)
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const i = x + tRef.current;
        const spacing = Math.max(40, (w / (bpm / 60)) * 0.75);
        const phase = (i % spacing) / spacing;
        const spike = Math.exp(-Math.pow((phase - 0.12) / 0.03, 2)) * baseAmp * 1.6;
        const hump = Math.exp(-Math.pow((phase - 0.32) / 0.08, 2)) * baseAmp * 0.35;
        const baseline = Math.sin(i / 140) * (baseAmp * 0.15) + Math.sin(i / 18) * 0.6;
        const y = mid - (spike + hump + baseline);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      // heartbeat marker (optional): small pulsing dot on left while measuring
      if (measuring) {
        const pulseAlpha = 0.35 + Math.abs(Math.sin(now / 420)) * 0.5; // slower pulsing
        ctx.fillStyle = isDark ? 'rgba(239,68,68,' + pulseAlpha + ')' : 'rgba(220,38,38,' + pulseAlpha + ')';
        ctx.beginPath();
        ctx.arc(14, mid, 3 + Math.abs(Math.sin(now / 600)) * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [measuring]);

  return (
    <div className="w-full mt-6 animate-fade-in-up">
      <div className="rounded-2xl glass-surface dark:glass-surface-dark border border-white/30 dark:border-slate-700 shadow-lg overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-44" />
      </div>
    </div>
  );
}

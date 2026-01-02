import React, { useEffect, useMemo, useState } from 'react';
import FingerLogo from '../components/FingerLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import DeviceStatus from '../components/DeviceStatus';
import StatCard from '../components/StatCard';
import MeasurePanel from '../components/MeasurePanel';
import Sparkline from '../components/Sparkline';
import GraphMonitor from '../components/GraphMonitor';
import StabilityTimer from '../components/StabilityTimer';
import SignalIndicator from '../components/SignalIndicator';
import HealthStatusBadge from '../components/HealthStatusBadge';
import GuidedBreathing from '../components/GuidedBreathing';

export default function OxygenSaturation() {
  // mock device data
  const [device, setDevice] = useState({
    name: 'Reliv Pulse Oximeter',
    connected: true,
    battery: 82,
    firmware: 'v1.8.2',
    serial: 'RLV-21A-93F4',
  });

  // live vitals and history
  const [measuring, setMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [spo2, setSpo2] = useState(98);
  const [hr, setHr] = useState(76);
  const [pr, setPr] = useState(12); // respiration/pulse rate proxy
  const [pi, setPi] = useState(4.2); // perfusion index
  const [history, setHistory] = useState([]); // {time, spo2, hr, pr}

  // signal and stability
  const [signalStrength, setSignalStrength] = useState(3); // 1-5
  const [fingerPlaced, setFingerPlaced] = useState(true);
  const [stableSeconds, setStableSeconds] = useState(0);

  // user context
  const [activity, setActivity] = useState('Resting'); // 'Resting' | 'Post-exercise'

  const sparklineData = useMemo(() => history.slice(-20).map(h => h.spo2), [history]);

  // quick explanation
  const explain = useMemo(() => {
    if (spo2 < 94) return 'Low oxygen detected. Stay still, warm finger, and consider guided breathing.';
    if (hr > 100) return activity === 'Post-exercise' ? 'Heart rate elevated from activity; oxygen is fine.' : 'High heart rate. Consider resting and hydration.';
    if (hr < 55) return 'Low heart rate. If symptomatic, consult a doctor.';
    return activity === 'Post-exercise' ? 'Normal oxygen. Heart rate recovering after exercise.' : 'Oxygen and heart rate are in typical ranges.';
  }, [spo2, hr, activity]);

  // UI: popup notification on reading
  const [notify, setNotify] = useState(null); // { title, message, icon }
  const [displayedSpo2, setDisplayedSpo2] = useState(null);
  const [showReading, setShowReading] = useState(false);
  const targetSpo2Ref = React.useRef(null);
  const startSpo2Ref = React.useRef(null);


  // Simulate gentle battery drain every minute
  useEffect(() => {
    const id = setInterval(() => {
      setDevice(d => ({ ...d, battery: Math.max(0, d.battery - 1) }));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  // Measure simulation: increments progress and produces values
  const startMeasure = () => {
    if (measuring) return;
    setProgress(0);
    setMeasuring(true);
    setStableSeconds(0);
    // pick a target SpO2 to animate towards during the measurement
    const provisional = 96 + Math.floor(Math.random() * 4); // 96-99
    targetSpo2Ref.current = provisional;
    startSpo2Ref.current = spo2;
    setDisplayedSpo2(spo2);
    setShowReading(true);
    // make the measurement process longer so it feels realistic (5-7s)
    const dur = 6000; // 6 seconds
    const started = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - started) / dur) * 100));
      setProgress(p);

      // animate displayed SpO2 towards the provisional target with small noise
      const eased = p / 100;
      const noise = Math.round(Math.sin((Date.now() - started) / 300) * 1);
      const current = Math.round(startSpo2Ref.current * (1 - eased) + targetSpo2Ref.current * eased + noise);
      setDisplayedSpo2(current);

      // simulate signal quality and finger placement while measuring
      const strength = Math.max(1, Math.min(5, Math.round(3 + Math.sin(Date.now()/500) + (Math.random() - 0.5) * 2)));
      setSignalStrength(strength);
      const placed = p > 8 ? Math.random() > 0.08 : false;
      setFingerPlaced(placed);
      setStableSeconds((s) => (placed && strength >= 3 ? Math.min(s + 0.08, 10) : 0));

      if (p >= 100) {
        clearInterval(id);
        // final reading uses the provisional target
        const nSpo2 = targetSpo2Ref.current || (96 + Math.floor(Math.random() * 4)); // 96-99
        const nHr = 62 + Math.floor(Math.random() * 28); // 62-89
        const nPr = 10 + Math.floor(Math.random() * 8); // 10-17
        const nPi = +(3 + Math.random() * 3).toFixed(1); // 3.0-6.0
        setSpo2(nSpo2);
        setDisplayedSpo2(nSpo2);
        setHr(nHr);
        setPr(nPr);
        setPi(nPi);
        const entry = { time: new Date(), spo2: nSpo2, hr: nHr, pr: nPr };
        setHistory(h => [entry, ...h].slice(0, 50));
        setMeasuring(false);
        // show notification popup (displayed inside measure panel)
        const iconChoice = nSpo2 < 95 ? '⚠️' : '✅';
        setNotify({
          title: 'Measurement Completed',
          message: `SpO₂ ${nSpo2}% · HR ${nHr} bpm · PR ${nPr}/s · PI ${nPi}`,
          icon: iconChoice,
        });
        setTimeout(() => {
          setNotify(null);
          setShowReading(false);
        }, 5000);
      }
    }, 100);
  };

  const triggerSOS = () => {
    try {
      window.location.href = 'tel:112';
    } catch (e) {
      setNotify({ title: 'SOS', message: 'Dial 112 on your phone.', icon: '📞' });
      setTimeout(() => setNotify(null), 2500);
    }
  };

  const shareReport = async () => {
    const latest = history[0] || { time: new Date(), spo2, hr, pr };
    const recent = history.slice(0, 5).map(h => `${h.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · SpO₂ ${h.spo2}% · HR ${h.hr} bpm`).join('\n');
    const reportText = `Reliv Pulse Oximeter Report\nActivity: ${activity}\nLatest: SpO₂ ${spo2}% · HR ${hr} bpm\nRecent measurements:\n${recent || 'No history yet.'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Reliv Report', text: reportText });
      } else {
        await navigator.clipboard.writeText(reportText);
        setNotify({ title: 'Report Copied', message: 'Summary copied to clipboard', icon: '📋' });
        setTimeout(() => setNotify(null), 2500);
      }
    } catch (e) {
      setNotify({ title: 'Share Failed', message: 'Unable to share report', icon: '❌' });
      setTimeout(() => setNotify(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-150px,#eef2ff_0%,#ffffff_40%,#ffffff_80%)] dark:bg-[radial-gradient(1200px_600px_at_50%_-150px,#0b1220_0%,#0b1220_100%)] transition-colors">
      {/* Notification toast moved into MeasurePanel (appears where "Tap to start" is) */}

      {/* Top header (logo + controls + device status) — scrolls with the page */}
      <div className="px-6 pt-6">
        <div className="max-w-7xl mx-auto rounded-2xl px-5 py-4 glass-surface dark:glass-surface-dark shadow-[0_12px_30px_-12px_rgba(2,6,23,.25)] ring-glow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 flex items-center">
                {/* Use the provided JPEG logo file placed at `public/reliv-logo.jpeg` */}
                <img src="/reliv-logo.jpeg" alt="Reliv logo" className="h-8 w-auto" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-slate-800 dark:text-slate-100">Reliv Health</div>
                <div className="text-slate-500 dark:text-slate-300">Pulse Oximeter</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => setActivity('Resting')} className={`px-3 py-1 rounded-full text-xs ${activity==='Resting' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Resting</button>
                <button onClick={() => setActivity('Post-exercise')} className={`px-3 py-1 rounded-full text-xs ${activity==='Post-exercise' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Post-exercise</button>
              </div>
              <DarkModeToggle />

              <div>
                <DeviceStatus device={device} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mt-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-stretch">
          {/* Left: Sensor + Measure */}
          <div className="col-span-3">
            <div className="rounded-2xl p-6 glass-surface dark:glass-surface-dark shadow-sm ring-glow animate-fade-in-up h-full flex flex-col justify-between">
              <div className={`relative h-44 w-44 mx-auto rounded-full bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 shadow-sensor ${measuring ? 'ring-glow animate-glow-soft' : 'animate-pulse-soft'} flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]`}>
                {/* Show animated reading while measuring (or while notify is visible), otherwise show fingerprint prompt */}
                {/* progress ring (SVG) - uses `progress` state to animate */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden>
                  <defs>
                    <linearGradient id="ringGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(50,50)">
                    <circle r="44" cx="0" cy="0" fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="6" />
                    <circle r="44" cx="0" cy="0" fill="none" stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={Math.PI * 2 * 44}
                      strokeDashoffset={(1 - progress / 100) * Math.PI * 2 * 44}
                      style={{ transition: 'stroke-dashoffset 280ms linear, stroke 280ms linear' }}
                    />
                  </g>
                </svg>

                {!(measuring || showReading) && (
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <FingerLogo size={80} className="text-slate-600 dark:text-slate-200" />
                    <span className="text-xs text-slate-600 dark:text-slate-200 font-medium select-none mt-1">Place Finger</span>
                  </div>
                )}
                {(measuring || showReading || notify) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className={`text-center transition-all duration-300`}> 
                      <div className={`text-4xl md:text-5xl font-extrabold leading-none tracking-tight ${displayedSpo2 < 95 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                        {displayedSpo2 ?? '--'}
                        <span className="text-lg font-medium align-top">%</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">SpO₂</div>
                    </div>
                  </div>
                )}
              </div>
              <MeasurePanel measuring={measuring} onMeasure={startMeasure} progress={progress} className="" notify={notify} />
              <div className="mt-4">
                <SignalIndicator strength={signalStrength} fingerPlaced={fingerPlaced} />
                <StabilityTimer stableSeconds={stableSeconds} required={2} />
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-200">Ensure your finger is warm and clean.</div>
              </div>
            </div>
          </div>

          {/* Middle: Graph monitor waveform */}
          <div className="col-span-6">
            <div className="rounded-2xl p-4 glass-surface dark:glass-surface-dark shadow-sm ring-glow animate-fade-in-up h-full flex flex-col">
              <div className="flex items-center justify-between px-2 mb-3">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Live Waveform</div>
                <div className="text-xs text-slate-500 dark:text-slate-300">Realtime</div>
              </div>
              
              <div className="flex-1 min-h-[20rem] flex flex-col">
                <GraphMonitor measuring={measuring} />

                {/* Past Readings visually nested inside the same monitor card */}
                <div className="mt-4 w-full pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Past Readings</div>
                      <Sparkline data={sparklineData} className="text-amber-500 dark:text-amber-300" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-slate-500 dark:text-slate-300">Last {Math.min(history.length, 20)}</div>
                      <button onClick={shareReport} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs shadow-sm dark:bg-slate-800 dark:text-slate-300">Share</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                    {history.slice(0, 10).map((h, idx) => (
                      <div key={idx} className="rounded-lg p-2 bg-white/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-white/70 dark:hover:bg-slate-900/35 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">🕒</span>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{h.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div className="flex gap-1.5 text-xs">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 text-[10px]">🫁 {h.spo2}%</span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800 text-[10px]">❤️ {h.hr}</span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 text-[10px]">💓 {h.pr}</span>
                        </div>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="py-4 text-sm text-slate-500 dark:text-slate-300 text-center">No readings yet. Click \"Measure Oxygen\" to take your first reading.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live stat cards */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 gap-4 h-full content-stretch">
              <div className="flex items-center justify-between">
                 <HealthStatusBadge spo2={spo2} hr={hr} />
                 <button onClick={shareReport} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs shadow-sm dark:bg-slate-800 dark:text-slate-300">Share</button>
               </div>
               <StatCard label="SpO₂" value={`${spo2}%`} unit="" accent="from-green-500 to-green-600" icon={<span>🫁</span>} />
               <StatCard label="Heart Rate" value={hr} unit="bpm" accent="from-sky-500 to-sky-600" icon={<span>❤️</span>} />
               <StatCard label="Pulse Rate" value={pr} unit="/s" accent="from-purple-500 to-purple-600" icon={<span>💓</span>} />
               <StatCard label="Perfusion Index" value={pi} unit="PI" accent="from-orange-500 to-orange-600" icon={<span>🧪</span>} />
               <div className="rounded-xl p-3 glass-surface dark:glass-surface-dark border border-white/30 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">{explain}</div>
               <GuidedBreathing />
            </div>
          </div>
        </div>



        {/* Instructions (now below Past Readings) */}
        <div className="max-w-7xl mx-auto mt-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 glass-surface dark:glass-surface-dark p-5 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
              <span className="text-slate-400">📄</span>
              <span>Important Instructions</span>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• Place finger <span className="font-medium">gently</span> — do not press hard</li>
              <li>• Ensure finger is warm and clean (no nail polish)</li>
              <li>• Keep hand relaxed and below <span className="font-medium">heart level</span></li>
              <li>• Keep finger on sensor until <span className="font-medium text-red-600">red light turns off</span></li>
              <li className="text-orange-600 dark:text-orange-400 col-span-2">⚠️ Make sure device is connected before starting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom animated logo moved into MeasurePanel */}
    </div>
  );
}

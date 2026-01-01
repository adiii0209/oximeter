import React from 'react';
import FingerLogo from '../components/FingerLogo';
import BottomOximeterVideo from '../components/BottomOximeterVideo';

export default function OxygenSaturation() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFDFD' }}>
      {/* Top curved header */}
      <div className="relative overflow-hidden">
        <div className="bg-peach h-28 rounded-b-[120px]" />
        <div className="absolute inset-0 flex flex-col items-center pt-6">
          <h1 className="text-xl font-semibold text-slate-800">Oxygen Saturation</h1>
          <p className="text-sm text-slate-500 mt-1">Please place your finger in the pulse oximeter</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
            <span className="text-xs text-green-600 font-medium">Device Connected</span>
          </div>
        </div>
      </div>

      {/* Sensor with finger */}
      <div className="flex flex-col items-center mt-6">
        <div className="relative">
          <div className="relative h-40 w-40 rounded-full bg-gradient-to-b from-slate-100 to-slate-300 shadow-sensor animate-pulse-soft flex items-center justify-center">
            <FingerLogo size={64} />
            <span className="absolute bottom-5 text-slate-600 text-sm font-medium select-none">Place Finger</span>
          </div>
        </div>

        {/* Measure button */}
        <button className="mt-6 px-8 py-2.5 rounded-md bg-gradient-to-b from-oxiOrange to-oxiOrangeDark text-white font-semibold shadow-md">
          Measure Oxygen
        </button>

        {/* Instructions card */}
        <div className="mt-5 w-[340px] max-w-[92%] rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="text-slate-400">📄</span>
            <span>Important Instructions</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Place finger <span className="font-medium">gently</span> — do not press hard</li>
            <li>• Ensure finger is warm and clean (no nail polish)</li>
            <li>• Keep hand relaxed and below <span className="font-medium">heart level</span></li>
            <li>• Keep finger on sensor until <span className="font-medium text-red-600">red light turns off</span></li>
            <li className="text-orange-600">⚠️ Make sure device is connected before starting</li>
          </ul>
        </div>
      </div>

      {/* Bottom animated logo (MP4 provided by user) */}
      <BottomOximeterVideo src="/Oximeter.mp4" />
    </div>
  );
}

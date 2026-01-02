import React from 'react';
import BottomOximeterVideo from './BottomOximeterVideo';

export default function MeasurePanel({ measuring, onMeasure, progress = 0, className = '', notify = null }) {
  return (
    <div className={`w-full ${className} mt-4 flex flex-col justify-center items-stretch gap-4 flex-1`}>
      <div>
        <button
          onClick={onMeasure}
          disabled={measuring}
          className={`w-full px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:scale-[1.01] focus-visible:ring-2 ring-oxiOrange/40 outline-none active:scale-[.99] ${
            measuring
              ? 'bg-orange-300 cursor-not-allowed'
              : 'bg-gradient-to-br from-oxiOrange via-amber-500 to-oxiOrangeDark hover:brightness-110 hover:shadow-[0_20px_40px_-16px_rgba(234,88,12,.45)]'
          }`}
          aria-busy={measuring}
        >
          {measuring ? 'Measuring…' : 'Measure Oxygen'}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative">
        {measuring ? (
          <div className="mt-2 h-3 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden w-full">
            <div className="h-full relative transition-all duration-500" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-oxiOrange via-amber-400 to-oxiOrangeDark" />
              <div className="absolute inset-0 progress-stripes animate-stripes opacity-40" />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-2 relative">
            {/* When notify is present, hide the video and show only the notification bubble. */}
            <div className={`w-full transition-opacity duration-500 ease-in-out ${notify ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="w-full overflow-hidden">
                <BottomOximeterVideo src="/Oximeter.mp4" width="100%" className="w-full h-24 object-cover transition-opacity duration-500" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300 text-center mt-2 transition-opacity duration-500">Tap to start a measurement</div>
            </div>

            {/* Notification bubble */}
            {notify && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700 text-center max-w-[300px] transform transition-all duration-400 ease-out opacity-0 animate-fade-in-up" style={{ opacity: 1 }}>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{notify.title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">{notify.message}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

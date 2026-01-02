import React from 'react';

export default function DeviceStatus({ device }) {
  const { connected, battery, name } = device;
  return (
    <div className="flex items-center w-full gap-3 px-2 py-1 text-sm bg-transparent">
      <div className="flex items-center gap-3">
        {/* Bluetooth icon when connected, warning when not */}
        {connected ? (
          <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M2 7L14 17L8 22V2L14 7L2 17M20.1445 6.5C21.2581 8.04804 21.914 9.94743 21.914 12C21.914 14.0526 21.2581 15.952 20.1445 17.5M17 8.85724C17.6214 9.74811 17.9858 10.8315 17.9858 12.0001C17.9858 13.1686 17.6214 14.2521 17 15.143" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="text-red-500">⚠️</span>
        )}

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{name}</span>
          <span className={`text-xs ${connected ? 'text-slate-600 dark:text-slate-200' : 'text-red-500'}`}>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
          <span className="sr-only">Battery</span>
          <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full ${battery > 20 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${battery}%` }} />
          </div>
          <span className="text-xs">{battery}%</span>
        </div>
      </div>
    </div>
  );
}

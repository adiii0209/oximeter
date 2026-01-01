import React from 'react';

/*
  Bottom animated oximeter logo similar to the provided screenshot.
  - Minimal line-art hand with an oximeter device
  - Gentle tilt animation to imply "keep your hand inside the oximeter"
*/
export default function BottomOximeter() {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="relative w-[360px] max-w-[92%]">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[12px] font-semibold text-slate-700 leading-tight">
            Please keep your hand inside
            <br />
            the oximeter
          </p>
          <span className="text-orange-500 font-bold">Reliv</span>
        </div>

        {/* Animated inline SVG */}
        <div className="animate-[tilt_2.6s_ease-in-out_infinite] inline-block">
          <svg
            width="340"
            height="110"
            viewBox="0 0 340 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#2b2b2b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* simple hand outline */}
              <path d="M95 90c-10-8-14-22-6-33 4-5 9-8 15-9 7-1 12 0 19 3" />
              <path d="M130 54c-2 6-1 14 4 18 6 6 16 6 22 0 7-7 5-19-4-24" />
              {/* fingers */}
              <path d="M128 60l-9-7" />
              <path d="M140 56l-11-10" />
              <path d="M149 54l-9-10" />

              {/* Oximeter device (rectangle with display) */}
              <rect x="170" y="28" width="64" height="40" rx="8" />
              <rect x="176" y="34" width="52" height="16" rx="4" />
              <path d="M182 42h12" />
              <path d="M198 42h8" />
              <path d="M208 42h8" />
              <rect x="200" y="54" width="18" height="6" rx="3" />
            </g>
          </svg>
        </div>

        {/* Inline keyframes for the tilt animation */}
        <style>{`
          @keyframes tilt { 0%,100% { transform: rotate(-2deg) translateY(0); } 50% { transform: rotate(2deg) translateY(-2px); } }
        `}</style>
      </div>
    </div>
  );
}

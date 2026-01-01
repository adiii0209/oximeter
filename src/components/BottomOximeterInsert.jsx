import React from 'react';

/*
  Animated bottom logo: a finger sliding into an oximeter slot.
  - Device on the right, finger/hand on the left sliding to the right.
  - Uses inline @keyframes so it works regardless of Tailwind version.
*/
export default function BottomOximeterInsert() {
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

        <div className="inline-block" style={{ animation: 'tilt 2.6s ease-in-out infinite' }}>
          <svg
            width="340"
            height="120"
            viewBox="0 0 340 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#2b2b2b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Oximeter device (right) */}
              <rect x="225" y="28" width="90" height="50" rx="12" />
              <rect x="235" y="36" width="60" height="16" rx="4" />
              {/* opening slot */}
              <rect x="232" y="60" width="68" height="12" rx="6" fill="#ffffff" />

              {/* Finger + hand that slides into the slot */}
              <g className="finger-in">
                {/* palm curve */}
                <path d="M60 95c-7-10-6-23 3-31 6-6 15-9 24-8 11 1 19 8 22 18" />
                {/* extra fingers */}
                <path d="M104 68l-12-10" />
                <path d="M116 66l-12-12" />
                {/* index finger bar entering slot */}
                <rect x="138" y="58" width="96" height="10" rx="5" fill="#ffffff" />
                <path d="M138 63h96" />
              </g>

              {/* tiny blinking LED */}
              <circle cx="305" cy="62" r="4" fill="#ef4444">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        {/* Inline keyframes for tilt and insert animations */}
        <style>{`
          @keyframes tilt { 0%,100% { transform: rotate(-2deg) translateY(0); } 50% { transform: rotate(2deg) translateY(-2px); } }
          @keyframes insert { 0%, 100% { transform: translateX(-20px); } 50% { transform: translateX(0); } }
          .finger-in { animation: insert 2.2s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}

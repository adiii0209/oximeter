import React from 'react';

/*
  Animated finger icon that gently moves up/down to suggest inserting the finger
  into the pulse oximeter sensor. Uses the `.animate-finger` utility defined in
  src/index.css
*/
export default function FingerLogo({ size = 72 }) {
  return (
    <div
      className="animate-finger"
      style={{ width: size, height: size }}
      aria-hidden="true"
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7C27E" />
            <stop offset="100%" stopColor="#E3A45F" />
          </linearGradient>
          <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Palm */}
        <path d="M18 34c0-5 4-9 9-9h10c6 0 11 5 11 11v7c0 9-7 16-16 16-8 0-14-6-14-14v-11z" fill="url(#skin)"/>

        {/* Index finger */}
        <rect x="34" y="9" width="9" height="26" rx="4.5" fill="url(#skin)"/>
        {/* Finger nail hint */}
        <rect x="35.2" y="10" width="6.6" height="6" rx="3" fill="#FCE2C3"/>

        {/* Other fingers (simplified) */}
        <rect x="24" y="16" width="8" height="18" rx="4" fill="url(#skin)"/>
        <rect x="17" y="20" width="7" height="16" rx="3.5" fill="url(#skin)"/>

        {/* Thumb hint */}
        <path d="M18 39c0-2 2-4 4-4h6c1.7 0 3 1.3 3 3v4c0 1.7-1.3 3-3 3h-5c-2.8 0-5-2.2-5-5z" fill="url(#skin)"/>

        {/* Subtle bottom shadow */}
        <ellipse cx="36" cy="65" rx="18" ry="4" fill="url(#shadow)"/>
      </svg>
    </div>
  );
}

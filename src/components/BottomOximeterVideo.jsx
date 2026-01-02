import React from 'react';

/*
  Bottom video logo: renders a provided MP4 animation showing a finger inserting
  into an oximeter.
*/
export default function BottomOximeterVideo({ src = '/oximeter.mp4', width = 240, blend = true, className = '' }) {
  const videoStyle = {
    background: 'transparent',
    ...(blend ? { mixBlendMode: 'multiply' } : {}),
  };

  return (
    <div className={`w-full flex justify-center mt-6 animate-fade-in-up ${className}`}>
      <div className="relative" style={{ width }}>
        <div className="overflow-hidden bg-transparent">
          <video
            src={src}
            className="w-full h-auto block"
            style={videoStyle}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </div>
  );
}

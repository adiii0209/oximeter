import React from 'react';

/*
  Bottom video logo: renders a provided MP4 animation showing a finger inserting
  into an oximeter. Place your MP4 file at public/oximeter.mp4 (or change the
  src prop to your desired path). The video is muted/autoplaying/looping and
  uses playsInline so it will autoplay on mobile too.
*/
export default function BottomOximeterVideo({ src = '/oximeter.mp4', width = 240 }) {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="relative" style={{ width }}>
        <div className="rounded-xl overflow-hidden">
          <video
            src={src}
            className="w-full h-auto block"
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

import React from 'react';
import '../../styles/recordPlayer.css';

interface TonearmProps {
  isPlaying: boolean;
}

export function Tonearm({ isPlaying }: TonearmProps) {
  return (
    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
      <div
        className={`origin-top-left ${isPlaying ? 'tonearm-playing' : 'tonearm-stopped'}`}
        style={{
          transformOrigin: '10% 10%',
          transform: isPlaying ? 'rotate(0deg)' : 'rotate(-20deg)',
          transition: 'transform 0.5s ease-out',
        }}
      >
        {/* Tonearm base */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg" />

        {/* Tonearm arm */}
        <div
          className="w-2 bg-gradient-to-r from-gray-400 to-gray-500 shadow-md"
          style={{
            height: '120px',
            transformOrigin: 'top center',
            marginLeft: '10px',
          }}
        >
          {/* Headshell */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-3 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-sm shadow-sm" />
            {/* Stylus */}
            <div className="w-0.5 h-2 bg-gray-800 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import '../../styles/recordPlayer.css';

interface VinylProps {
  isPlaying: boolean;
  albumArtUrl?: string;
  albumName?: string;
}

export function Vinyl({ isPlaying, albumArtUrl, albumName }: VinylProps) {
  return (
    <div className="relative">
      {/* Vinyl Disc */}
      <div
        className={`relative w-64 h-64 rounded-full ${isPlaying ? 'vinyl-spinning' : 'vinyl-paused'} ${isPlaying ? 'vinyl-glow-active' : 'vinyl-glow'}`}
        style={{
          background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
        }}
      >
        {/* Grooves */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-white/5"
            style={{
              width: `${100 - i * 6}%`,
              height: `${100 - i * 6}%`,
              top: `${i * 3}%`,
              left: `${i * 3}%`,
            }}
          />
        ))}

        {/* Center Label with Album Art */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-black border-4 border-gray-800 shadow-xl">
            {albumArtUrl ? (
              <img
                src={albumArtUrl}
                alt={albumName || 'Album'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Spindle hole */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-700 shadow-inner" />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Album } from '../../types/spotify';

interface VinylRecordProps {
  album: Album;
  onPlay: (uri: string) => void;
}

export function VinylRecord({ album, onPlay }: VinylRecordProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(album.uri)}
    >
      {/* Vinyl Record */}
      <div
        className={`relative w-32 h-32 transition-all duration-300 ${
          isHovered ? 'scale-110 z-10' : 'scale-100'
        }`}
      >
        {/* Outer sleeve showing album art */}
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
          <img
            src={album.imageUrl}
            alt={album.name}
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-fadeIn">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Vinyl peek effect - shows vinyl slightly pulled out */}
          {!isHovered && (
            <div
              className="absolute -right-2 top-0 bottom-0 w-8 bg-black rounded-r-full"
              style={{
                background: 'radial-gradient(circle at left, #2a2a2a 0%, #1a1a1a 100%)',
                boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Vinyl grooves */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-white/5"
                  style={{ top: `${10 + i * 12}%` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info tooltip on hover */}
        {isHovered && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl animate-fadeIn pointer-events-none z-20">
            <div className="font-semibold truncate max-w-xs">{album.name}</div>
            <div className="text-white/70 truncate">{album.artist}</div>
            <div className="text-white/50 text-xs mt-1">
              Listened {album.listenCount} {album.listenCount === 1 ? 'time' : 'times'}
            </div>
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}

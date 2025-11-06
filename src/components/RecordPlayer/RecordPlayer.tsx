import React from 'react';
import { Vinyl } from './Vinyl';
import { Tonearm } from './Tonearm';
import { PlaybackState } from '../../types/spotify';
import '../../styles/recordPlayer.css';

interface RecordPlayerProps {
  playbackState: PlaybackState | null;
}

export function RecordPlayer({ playbackState }: RecordPlayerProps) {
  const track = playbackState?.track_window?.current_track;
  const isPlaying = playbackState && !playbackState.paused;
  const albumArt = track?.album.images[0]?.url;
  const albumName = track?.album.name;
  const trackName = track?.name;
  const artistName = track?.artists.map((a) => a.name).join(', ');

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Record Player Base */}
      <div className="relative record-player-base rounded-2xl p-8 shadow-2xl">
        {/* Platter */}
        <div className="relative platter rounded-full p-4 flex items-center justify-center">
          {/* Vinyl */}
          <Vinyl isPlaying={!!isPlaying} albumArtUrl={albumArt} albumName={albumName} />

          {/* Tonearm */}
          <Tonearm isPlaying={!!isPlaying} />
        </div>

        {/* Spindle in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="spindle w-4 h-4 rounded-full" />
        </div>
      </div>

      {/* Track Info Display */}
      {track && (
        <div className="mt-6 text-center max-w-md animate-fadeIn">
          <h2 className="text-white text-2xl font-bold mb-1 truncate">{trackName}</h2>
          <p className="text-white/70 text-lg truncate">{artistName}</p>
          <p className="text-white/50 text-sm mt-1 truncate">{albumName}</p>

          {/* Now Playing Indicator */}
          {isPlaying && (
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded-full"
                    style={{
                      height: '16px',
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-green-500 text-sm font-medium">Now Playing</span>
            </div>
          )}
        </div>
      )}

      {!track && (
        <div className="mt-6 text-center text-white/50">
          <p>No track playing</p>
          <p className="text-sm mt-1">Start listening to see your vinyl spin!</p>
        </div>
      )}
    </div>
  );
}

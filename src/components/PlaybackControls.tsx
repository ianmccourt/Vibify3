import React, { useState, useEffect } from 'react';
import { PlaybackState } from '../types/spotify';

interface PlaybackControlsProps {
  playbackState: PlaybackState | null;
  isReady: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function PlaybackControls({
  playbackState,
  isReady,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}: PlaybackControlsProps) {
  const [volume, setVolume] = useState(50);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const track = playbackState?.track_window?.current_track;
  const isPlaying = playbackState && !playbackState.paused;
  const position = isSeeking ? seekPosition : playbackState?.position || 0;
  const duration = playbackState?.duration || 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    setSeekPosition(newPosition);
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    onSeek(seekPosition);
    setIsSeeking(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume / 100);
  };

  if (!isReady) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="text-center text-white/60">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/60 mx-auto mb-2"></div>
            <p>Initializing player...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="text-center text-white/60">
            <p>No track playing. Select a song to start!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <img
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="w-14 h-14 rounded-lg shadow-lg"
            />
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{track.name}</p>
              <p className="text-white/60 text-sm truncate">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={onPrevious}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Next track"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center space-x-2">
              <span className="text-white/60 text-xs w-10 text-right">{formatTime(position)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={position}
                onChange={handleSeekChange}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fff ${(position / duration) * 100}%, rgba(255,255,255,0.2) ${(position / duration) * 100}%)`,
                }}
              />
              <span className="text-white/60 text-xs w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end space-x-3">
            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fff ${volume}%, rgba(255,255,255,0.2) ${volume}%)`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

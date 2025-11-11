import React, { useState, useEffect } from 'react';
import { PlaybackState } from '../types/spotify';
import { saveTrack, removeTrack } from '../services/spotifyApi';

interface PlaybackControlsProps {
  playbackState: PlaybackState | null;
  isReady: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onQueueClick?: () => void;
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
  onQueueClick,
}: PlaybackControlsProps) {
  const [volume, setVolume] = useState(50);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

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

  const handleLikeToggle = async () => {
    if (!track) return;

    try {
      const trackId = track.id;
      if (isLiked) {
        await removeTrack(trackId);
        setIsLiked(false);
      } else {
        await saveTrack(trackId);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (!isReady) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="text-center text-white/60">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400 mx-auto mb-2"></div>
            <p className="font-semibold">Initializing Vibify Player...</p>
            <p className="text-xs mt-1">Connecting to Spotify servers</p>
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-white/80 font-medium">Player Ready</p>
            </div>
            <p className="text-white/40 text-sm mt-1">Click on a song, album, or playlist to start playing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <img
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="w-16 h-16 rounded-lg shadow-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold truncate mb-0.5">{track.name}</p>
              <p className="text-white/60 text-sm truncate">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
            <button
              onClick={handleLikeToggle}
              className="text-white/60 hover:text-white transition-colors hidden md:block"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <svg
                className={`w-6 h-6 ${isLiked ? 'fill-green-500 text-green-500' : 'fill-none'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-6">
              <button
                onClick={onPrevious}
                className="text-white/60 hover:text-white hover:scale-110 transition-all"
                aria-label="Previous track"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                className="text-white/60 hover:text-white hover:scale-110 transition-all"
                aria-label="Next track"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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
                  background: `linear-gradient(to right, #fff ${duration > 0 ? (position / duration) * 100 : 0}%, rgba(255,255,255,0.2) ${duration > 0 ? (position / duration) * 100 : 0}%)`,
                }}
              />
              <span className="text-white/60 text-xs w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-end space-x-4">
            {/* Queue Button */}
            {onQueueClick && (
              <button
                onClick={onQueueClick}
                className="text-white/60 hover:text-white transition-colors hidden md:block"
                aria-label="View queue"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            )}

            {/* Volume Control */}
            <div className="hidden md:flex items-center space-x-3 relative">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-28 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fff ${volume}%, rgba(255,255,255,0.2) ${volume}%)`,
                }}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

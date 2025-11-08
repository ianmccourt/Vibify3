import React, { useState, useEffect } from 'react';
import { PlaybackState } from '../../types/spotify';

interface QueueProps {
  playbackState: PlaybackState | null;
}

export function Queue({ playbackState }: QueueProps) {
  const currentTrack = playbackState?.track_window?.current_track;
  const nextTracks = playbackState?.track_window?.next_tracks || [];
  const previousTracks = playbackState?.track_window?.previous_tracks || [];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Queue Header */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">Queue</h2>
        <p className="text-white/60">Your upcoming tracks</p>
      </div>

      {!playbackState ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-white/60 text-lg">No music playing</p>
          <p className="text-white/40 text-sm mt-2">Start playing music to see your queue</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Now Playing */}
          {currentTrack && (
            <div className="glass-glow rounded-2xl p-6 border-2 border-white/20">
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-4">Now Playing</h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={currentTrack.album.images[0]?.url}
                    alt={currentTrack.album.name}
                    className="w-24 h-24 rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-2xl font-bold truncate mb-1">{currentTrack.name}</p>
                  <p className="text-white/80 text-lg truncate mb-2">
                    {currentTrack.artists.map((a) => a.name).join(', ')}
                  </p>
                  <p className="text-white/60 text-sm truncate">{currentTrack.album.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Up */}
          {nextTracks.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <span>Next Up</span>
                <span className="ml-2 text-white/60 text-sm font-normal">
                  {nextTracks.length} {nextTracks.length === 1 ? 'track' : 'tracks'}
                </span>
              </h3>
              <div className="space-y-3">
                {nextTracks.map((track, index) => (
                  <div
                    key={`next-${index}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <span className="text-white/40 text-sm font-semibold w-8 text-center">
                      {index + 1}
                    </span>
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      className="w-14 h-14 rounded shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{track.name}</p>
                      <p className="text-white/60 text-sm truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                    <span className="text-white/40 text-sm">
                      {Math.floor(track.duration_ms / 60000)}:
                      {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Played */}
          {previousTracks.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <span>Recently Played</span>
              </h3>
              <div className="space-y-3">
                {previousTracks.slice().reverse().map((track, index) => (
                  <div
                    key={`prev-${index}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-all opacity-70"
                  >
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      className="w-14 h-14 rounded shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{track.name}</p>
                      <p className="text-white/60 text-sm truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty Queue */}
          {nextTracks.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-white/60">No upcoming tracks</p>
              <p className="text-white/40 text-sm mt-2">Add more songs to your queue</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

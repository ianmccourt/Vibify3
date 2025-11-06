import React, { useState } from 'react';
import { SpotifyTrack } from '../../types/spotify';

interface RecommendationCardProps {
  track: SpotifyTrack;
  onPlay: (uri: string) => void;
  onAddToPlaylist: (track: SpotifyTrack) => void;
}

export function RecommendationCard({ track, onPlay, onAddToPlaylist }: RecommendationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToPlaylist = () => {
    onAddToPlaylist(track);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div
      className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-4">
        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <img
            src={track.album.images[0]?.url}
            alt={track.album.name}
            className="w-16 h-16 rounded-lg shadow-lg"
          />

          {/* Play button overlay */}
          {isHovered && (
            <button
              onClick={() => onPlay(track.uri)}
              className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fadeIn"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold truncate">{track.name}</h4>
          <p className="text-white/60 text-sm truncate">
            {track.artists.map((a) => a.name).join(', ')}
          </p>
          <p className="text-white/40 text-xs truncate mt-1">{track.album.name}</p>

          {/* Popularity indicator */}
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
            <span className="text-white/40 text-xs">{track.popularity}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddToPlaylist}
            disabled={showSuccess}
            className={`p-2 rounded-lg transition-all ${
              showSuccess
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
            title="Add to playlist"
          >
            {showSuccess ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { SpotifyTrack } from '../../types/spotify';
import { PopularitySlider } from './PopularitySlider';
import { RecommendationCard } from './RecommendationCard';
import { PlaylistSelector } from '../Playlists/PlaylistSelector';
import { getRecommendations, getTopArtists, getTopTracks } from '../../services/spotifyApi';

interface RecommendationsProps {
  onPlayTrack: (uri: string) => void;
}

export function Recommendations({ onPlayTrack }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [popularity, setPopularity] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user's top artists and tracks as seeds
      const [topArtists, topTracks] = await Promise.all([
        getTopArtists('medium_term', 5),
        getTopTracks('medium_term', 5),
      ]);

      const seedArtists = topArtists.slice(0, 2).map((a) => a.id);
      const seedTracks = topTracks.slice(0, 3).map((t) => t.id);

      // Spotify API requires at least one seed
      // If user has no listening history, use popular genres as fallback
      const hasSeeds = seedArtists.length > 0 || seedTracks.length > 0;
      const seedGenres = !hasSeeds ? ['pop', 'rock', 'indie'] : undefined;

      // Calculate target popularity based on slider
      let targetPopularity: number;
      let minPopularity: number;
      let maxPopularity: number;

      if (popularity < 33) {
        // Hidden gems
        targetPopularity = 20;
        minPopularity = 0;
        maxPopularity = 40;
      } else if (popularity < 67) {
        // Balanced mix
        targetPopularity = 50;
        minPopularity = 30;
        maxPopularity = 70;
      } else {
        // Mainstream hits
        targetPopularity = 80;
        minPopularity = 60;
        maxPopularity = 100;
      }

      const recs = await getRecommendations({
        seed_artists: seedArtists.length > 0 ? seedArtists : undefined,
        seed_tracks: seedTracks.length > 0 ? seedTracks : undefined,
        seed_genres: seedGenres,
        target_popularity: targetPopularity,
        min_popularity: minPopularity,
        max_popularity: maxPopularity,
        limit: 20,
      });

      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []); // Load on mount

  const handlePopularityChange = (value: number) => {
    setPopularity(value);
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  const handleAddToPlaylist = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    setShowPlaylistSelector(true);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold mb-2">Discover New Music</h2>
        <p className="text-white/60">
          Personalized recommendations based on your listening history
        </p>
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1">
            <PopularitySlider value={popularity} onChange={handlePopularityChange} />
          </div>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Recommendations Grid */}
      {isLoading && recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/60">Finding perfect songs for you...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((track) => (
            <RecommendationCard
              key={track.id}
              track={track}
              onPlay={onPlayTrack}
              onAddToPlaylist={handleAddToPlaylist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-2xl">
          <svg
            className="w-16 h-16 text-white/30 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <p className="text-white/60">No recommendations available</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Playlist Selector Modal */}
      {showPlaylistSelector && selectedTrack && (
        <PlaylistSelector
          track={selectedTrack}
          onClose={() => {
            setShowPlaylistSelector(false);
            setSelectedTrack(null);
          }}
        />
      )}
    </div>
  );
}

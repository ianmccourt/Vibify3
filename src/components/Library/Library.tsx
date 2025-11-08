import React, { useState, useEffect } from 'react';
import { getUserPlaylists } from '../../services/spotifyApi';
import { SpotifyPlaylist } from '../../types/spotify';

interface LibraryProps {
  onPlayPlaylist: (uri: string) => void;
}

export function Library({ onPlayPlaylist }: LibraryProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserPlaylists(50);
      setPlaylists(data);
    } catch (err) {
      console.error('Failed to load playlists:', err);
      setError('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/60 text-lg">{error}</p>
          <button
            onClick={loadPlaylists}
            className="mt-4 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Library Header */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">Your Library</h2>
        <p className="text-white/60">Browse and play your playlists</p>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-white/60 text-lg">No playlists yet</p>
          <p className="text-white/40 text-sm mt-2">Create playlists in Spotify to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="glass rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group"
              onClick={() => onPlayPlaylist(playlist.uri)}
            >
              <div className="relative mb-4">
                <img
                  src={playlist.images?.[0]?.url || '/placeholder-playlist.png'}
                  alt={playlist.name}
                  className="w-full aspect-square rounded-lg shadow-xl bg-white/5"
                />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <p className="text-white font-semibold truncate mb-1">{playlist.name}</p>
              <p className="text-white/60 text-sm truncate">
                {playlist.owner.display_name}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {playlist.tracks.total} tracks
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

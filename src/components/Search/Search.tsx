import React, { useState, useEffect } from 'react';
import { searchTracks, searchAlbums } from '../../services/spotifyApi';
import { SpotifyTrack, SpotifyAlbum } from '../../types/spotify';

interface SearchProps {
  onPlayTrack: (uri: string) => void;
  onPlayAlbum: (uri: string) => void;
}

export function Search({ onPlayTrack, onPlayAlbum }: SearchProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'tracks' | 'albums'>('tracks');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setTracks([]);
      setAlbums([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, searchType]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      if (searchType === 'tracks') {
        const results = await searchTracks(query, 20);
        setTracks(results);
      } else {
        const results = await searchAlbums(query, 20);
        setAlbums(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-6">Search</h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, albums, artists..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Search Type Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSearchType('tracks')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              searchType === 'tracks'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => setSearchType('albums')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              searchType === 'albums'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            Albums
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !hasSearched && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-white/60 text-lg">Search for your favorite music</p>
          <p className="text-white/40 text-sm mt-2">Find tracks and albums from Spotify's catalog</p>
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && searchType === 'tracks' && tracks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">No tracks found</p>
          <p className="text-white/40 text-sm mt-2">Try a different search term</p>
        </div>
      )}

      {!loading && hasSearched && searchType === 'albums' && albums.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">No albums found</p>
          <p className="text-white/40 text-sm mt-2">Try a different search term</p>
        </div>
      )}

      {/* Track Results */}
      {!loading && searchType === 'tracks' && tracks.length > 0 && (
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="glass rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group"
              onClick={() => onPlayTrack(track.uri)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.album.name}
                  className="w-16 h-16 rounded-lg shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{track.name}</p>
                  <p className="text-white/60 text-sm truncate">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                  <p className="text-white/40 text-xs truncate">{track.album.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white/40 text-sm">
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </span>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Results */}
      {!loading && searchType === 'albums' && albums.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="glass rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group"
              onClick={() => onPlayAlbum(album.uri)}
            >
              <div className="relative mb-4">
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="w-full aspect-square rounded-lg shadow-xl"
                />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <p className="text-white font-semibold truncate mb-1">{album.name}</p>
              <p className="text-white/60 text-sm truncate">
                {album.artists.map((a) => a.name).join(', ')}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {album.release_date.split('-')[0]} • {album.total_tracks} tracks
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

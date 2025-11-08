import React, { useState, useEffect } from 'react';
import { getTopTracks, getTopArtists } from '../../services/spotifyApi';
import { SpotifyTrack, SpotifyArtist } from '../../types/spotify';
import { Album } from '../../types/spotify';

interface StatsProps {
  collection: Album[];
  onPlayTrack: (uri: string) => void;
}

export function Stats({ collection, onPlayTrack }: StatsProps) {
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [tracks, artists] = await Promise.all([
        getTopTracks(timeRange, 10),
        getTopArtists(timeRange, 10),
      ]);
      setTopTracks(tracks);
      setTopArtists(artists);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeLabels = {
    short_term: 'Last 4 Weeks',
    medium_term: 'Last 6 Months',
    long_term: 'All Time',
  };

  // Calculate collection stats
  const totalAlbums = collection.length;
  const totalListens = collection.reduce((sum, album) => sum + (album.listenCount || 0), 0);
  const topAlbum = collection.sort((a, b) => (b.listenCount || 0) - (a.listenCount || 0))[0];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Stats Header */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-6">Your Statistics</h2>

        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {Object.entries(timeRangeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeRange(key as typeof timeRange)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeRange === key
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Collection Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60 text-sm font-semibold uppercase">Total Albums</h3>
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <p className="text-white text-4xl font-bold">{totalAlbums}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60 text-sm font-semibold uppercase">Total Listens</h3>
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                </svg>
              </div>
              <p className="text-white text-4xl font-bold">{totalListens}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60 text-sm font-semibold uppercase">Most Played</h3>
                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <p className="text-white text-lg font-bold truncate">{topAlbum?.name || 'N/A'}</p>
              <p className="text-white/60 text-sm truncate">{topAlbum ? `${topAlbum.listenCount} plays` : ''}</p>
            </div>
          </div>

          {/* Top Tracks */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6">Top Tracks</h3>
            <div className="space-y-3">
              {topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => onPlayTrack(track.uri)}
                >
                  <span className="text-white/60 text-lg font-bold w-8 text-center">{index + 1}</span>
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.album.name}
                    className="w-12 h-12 rounded shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{track.name}</p>
                    <p className="text-white/60 text-sm truncate">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Artists */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6">Top Artists</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {topArtists.map((artist, index) => (
                <div key={artist.id} className="text-center">
                  <div className="relative mb-3">
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-full aspect-square rounded-full shadow-xl"
                    />
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-white font-semibold truncate">{artist.name}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {artist.followers?.total?.toLocaleString()} followers
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

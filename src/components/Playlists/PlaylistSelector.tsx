import React, { useState, useEffect } from 'react';
import { SpotifyTrack, SpotifyPlaylist } from '../../types/spotify';
import { getAllUserPlaylists, addTrackToPlaylist, createNewPlaylist } from '../../services/playlistService';
import { useAuth } from '../../contexts/AuthContext';

interface PlaylistSelectorProps {
  track: SpotifyTrack;
  onClose: () => void;
}

export function PlaylistSelector({ track, onClose }: PlaylistSelectorProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const userPlaylists = await getAllUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (err) {
      console.error('Failed to load playlists:', err);
      setError('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    setIsAdding(true);
    setError(null);

    try {
      await addTrackToPlaylist(playlistId, track.uri);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to add track:', err);
      setError('Failed to add track to playlist');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || !user) return;

    setIsAdding(true);
    setError(null);

    try {
      const newPlaylist = await createNewPlaylist(
        user.id,
        newPlaylistName,
        `Created via Vibify`
      );
      await addTrackToPlaylist(newPlaylist.id, track.uri);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to create playlist:', err);
      setError('Failed to create playlist');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fadeIn" onClick={onClose}>
        {/* Modal */}
        <div
          className="glass-dark rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">Add to Playlist</h3>
              <p className="text-white/60 text-sm truncate">
                {track.name} - {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-4 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-200">Added to playlist successfully!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Create New Playlist */}
          {showCreateNew ? (
            <div className="mb-4 p-4 glass rounded-xl">
              <h4 className="text-white font-semibold mb-3">Create New Playlist</h4>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none mb-3"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || isAdding}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? 'Creating...' : 'Create & Add'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateNew(false);
                    setNewPlaylistName('');
                  }}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateNew(true)}
              className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Playlist</span>
            </button>
          )}

          {/* Playlists List */}
          <div>
            <h4 className="text-white/60 text-sm font-semibold mb-3">Your Playlists</h4>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto" />
              </div>
            ) : playlists.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isAdding}
                    className="w-full p-3 glass rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {playlist.images?.[0]?.url ? (
                      <img
                        src={playlist.images[0]?.url}
                        alt={playlist.name}
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium truncate">{playlist.name}</p>
                      <p className="text-white/60 text-sm">
                        {playlist.tracks.total} {playlist.tracks.total === 1 ? 'track' : 'tracks'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <p>No playlists found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

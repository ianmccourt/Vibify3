import { useState, useEffect, useCallback } from 'react';
import { Album } from '../types/spotify';
import { PlaybackState } from '../types/spotify';
import { getCollection, addAlbumToCollection } from '../services/collectionStorage';

export function useListeningHistory(playbackState: PlaybackState | null) {
  const [collection, setCollection] = useState<Album[]>([]);
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null);

  // Load collection on mount
  useEffect(() => {
    setCollection(getCollection());
  }, []);

  // Track current album
  useEffect(() => {
    if (!playbackState?.track_window?.current_track) return;

    const track = playbackState.track_window.current_track;
    const albumId = track.album.uri.split(':')[2]; // Extract album ID from URI

    // Only add if it's a new album
    if (albumId !== currentAlbumId) {
      setCurrentAlbumId(albumId);

      // Don't add if playback is paused or at the very beginning
      if (playbackState.paused || playbackState.position < 3000) {
        return;
      }

      const albumData = {
        id: albumId,
        name: track.album.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        imageUrl: track.album.images[0]?.url || '',
        uri: track.album.uri,
      };

      const updatedAlbum = addAlbumToCollection(albumData);
      setCollection(getCollection()); // Reload collection

      console.log('Added album to collection:', updatedAlbum);
    }
  }, [playbackState, currentAlbumId]);

  const refreshCollection = useCallback(() => {
    setCollection(getCollection());
  }, []);

  return {
    collection,
    refreshCollection,
  };
}

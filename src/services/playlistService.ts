import { SpotifyPlaylist } from '../types/spotify';
import { getUserPlaylists, addTracksToPlaylist, createPlaylist } from './spotifyApi';

export async function getAllUserPlaylists(): Promise<SpotifyPlaylist[]> {
  return getUserPlaylists(50);
}

export async function addTrackToPlaylist(playlistId: string, trackUri: string): Promise<void> {
  await addTracksToPlaylist(playlistId, [trackUri]);
}

export async function addTracksToPlaylistBatch(
  playlistId: string,
  trackUris: string[]
): Promise<void> {
  // Spotify allows max 100 tracks per request
  const batchSize = 100;
  for (let i = 0; i < trackUris.length; i += batchSize) {
    const batch = trackUris.slice(i, i + batchSize);
    await addTracksToPlaylist(playlistId, batch);
  }
}

export async function createNewPlaylist(
  userId: string,
  name: string,
  description?: string
): Promise<SpotifyPlaylist> {
  return createPlaylist(userId, name, description, true);
}

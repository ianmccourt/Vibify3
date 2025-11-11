import {
  SpotifyUser,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyArtist,
  RecommendationsParams,
} from '../types/spotify';
import { getValidAccessToken } from '../auth/authUtils';

const BASE_URL = 'https://api.spotify.com/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getValidAccessToken();

  if (!token) {
    throw new Error('No valid access token available');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// User API
export async function getCurrentUser(): Promise<SpotifyUser> {
  return fetchWithAuth('/me');
}

// Get available devices
export async function getAvailableDevices(): Promise<any[]> {
  const data = await fetchWithAuth('/me/player/devices');
  return data.devices;
}

// Transfer playback to device
export async function transferPlayback(deviceId: string, play: boolean = false): Promise<void> {
  await fetchWithAuth('/me/player', {
    method: 'PUT',
    body: JSON.stringify({
      device_ids: [deviceId],
      play,
    }),
  });
}

// Playback API
export async function play(
  deviceId: string,
  contextUri?: string,
  uris?: string[],
  offset?: number
): Promise<void> {
  const body: any = {};

  if (contextUri) {
    body.context_uri = contextUri;
    if (offset !== undefined) {
      body.offset = { position: offset };
    }
  } else if (uris) {
    body.uris = uris;
  }

  // Helper function to attempt playback
  const attemptPlay = async () => {
    await fetchWithAuth(`/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });
  };

  try {
    await attemptPlay();
  } catch (error: any) {
    const errorMessage = error.message?.toLowerCase() || '';

    // Check for various device-not-active error messages
    const isDeviceError =
      errorMessage.includes('404') ||
      errorMessage.includes('device not found') ||
      errorMessage.includes('not available') ||
      errorMessage.includes('no active device') ||
      errorMessage.includes('player command failed') ||
      errorMessage.includes('restriction');

    if (isDeviceError) {
      console.log('Device not active, attempting to activate device...');

      try {
        // Check if device is available
        const devices = await getAvailableDevices();
        console.log('Available devices:', devices.map(d => ({ id: d.id, name: d.name, is_active: d.is_active })));

        const ourDevice = devices.find(d => d.id === deviceId);

        if (!ourDevice) {
          throw new Error('Vibify player not found in available devices. Please refresh the page and try again.');
        }

        console.log('Device found:', ourDevice.name, '- Transferring playback...');

        // Transfer playback to activate the device
        await transferPlayback(deviceId, false);

        // Wait for transfer to complete
        console.log('Waiting for playback transfer to complete...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Retry play
        console.log('Retrying playback on activated device...');
        await attemptPlay();
        console.log('✓ Playback started successfully after device activation');
      } catch (transferError: any) {
        console.error('Error during device activation and retry:', transferError);

        if (transferError.message?.includes('404')) {
          throw new Error('Player not ready. Please wait a few seconds and try again, or refresh the page.');
        }

        if (transferError.message?.includes('Premium required')) {
          throw new Error('Spotify Premium is required for playback.');
        }

        throw new Error(transferError.message || 'Failed to activate player. Please try again or refresh the page.');
      }
    } else {
      // For non-device errors, throw the original error
      console.error('Playback error (non-device):', error);
      throw error;
    }
  }
}

export async function pause(deviceId: string): Promise<void> {
  await fetchWithAuth(`/me/player/pause?device_id=${deviceId}`, {
    method: 'PUT',
  });
}

export async function skipToNext(deviceId: string): Promise<void> {
  await fetchWithAuth(`/me/player/next?device_id=${deviceId}`, {
    method: 'POST',
  });
}

export async function skipToPrevious(deviceId: string): Promise<void> {
  await fetchWithAuth(`/me/player/previous?device_id=${deviceId}`, {
    method: 'POST',
  });
}

export async function seek(deviceId: string, positionMs: number): Promise<void> {
  await fetchWithAuth(`/me/player/seek?device_id=${deviceId}&position_ms=${positionMs}`, {
    method: 'PUT',
  });
}

export async function setVolume(deviceId: string, volumePercent: number): Promise<void> {
  await fetchWithAuth(`/me/player/volume?device_id=${deviceId}&volume_percent=${volumePercent}`, {
    method: 'PUT',
  });
}

// Playlists API
export async function getUserPlaylists(limit: number = 50): Promise<SpotifyPlaylist[]> {
  const data = await fetchWithAuth(`/me/playlists?limit=${limit}`);
  return data.items;
}

export async function addTracksToPlaylist(playlistId: string, uris: string[]): Promise<void> {
  await fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ uris }),
  });
}

export async function createPlaylist(
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = true
): Promise<SpotifyPlaylist> {
  return fetchWithAuth(`/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });
}

// Recommendations API
export async function getRecommendations(
  params: RecommendationsParams
): Promise<SpotifyTrack[]> {
  const searchParams = new URLSearchParams();

  if (params.seed_artists) {
    searchParams.append('seed_artists', params.seed_artists.join(','));
  }
  if (params.seed_tracks) {
    searchParams.append('seed_tracks', params.seed_tracks.join(','));
  }
  if (params.seed_genres) {
    searchParams.append('seed_genres', params.seed_genres.join(','));
  }
  if (params.target_popularity !== undefined) {
    searchParams.append('target_popularity', params.target_popularity.toString());
  }
  if (params.min_popularity !== undefined) {
    searchParams.append('min_popularity', params.min_popularity.toString());
  }
  if (params.max_popularity !== undefined) {
    searchParams.append('max_popularity', params.max_popularity.toString());
  }
  if (params.limit) {
    searchParams.append('limit', params.limit.toString());
  }

  const data = await fetchWithAuth(`/recommendations?${searchParams.toString()}`);
  return data.tracks;
}

// Top items API
export async function getTopArtists(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 5
): Promise<SpotifyArtist[]> {
  const data = await fetchWithAuth(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  return data.items;
}

export async function getTopTracks(
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 5
): Promise<SpotifyTrack[]> {
  const data = await fetchWithAuth(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  return data.items;
}

// Albums API
export async function getAlbum(albumId: string): Promise<SpotifyAlbum> {
  return fetchWithAuth(`/albums/${albumId}`);
}

export async function getAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
  const data = await fetchWithAuth(`/albums/${albumId}/tracks`);
  return data.items;
}

// Search API
export async function searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  const data = await fetchWithAuth(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
  );
  return data.tracks.items;
}

export async function searchAlbums(query: string, limit: number = 20): Promise<SpotifyAlbum[]> {
  const data = await fetchWithAuth(
    `/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`
  );
  return data.albums.items;
}

// Library API
export async function saveTrack(trackId: string): Promise<void> {
  await fetchWithAuth('/me/tracks', {
    method: 'PUT',
    body: JSON.stringify({ ids: [trackId] }),
  });
}

export async function removeTrack(trackId: string): Promise<void> {
  await fetchWithAuth('/me/tracks', {
    method: 'DELETE',
    body: JSON.stringify({ ids: [trackId] }),
  });
}

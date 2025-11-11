import { useState, useEffect, useCallback, useRef } from 'react';
import { PlaybackState, Spotify } from '../types/spotify';
import { useAuth } from '../contexts/AuthContext';

export function useSpotifyPlayer() {
  const { accessToken, user } = useAuth();
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(true);
  const playerRef = useRef<Spotify.Player | null>(null);

  // Initialize player
  useEffect(() => {
    if (!accessToken || !user) return;

    // Check if user has premium
    if (user.product !== 'premium') {
      setIsPremium(false);
      setError('Spotify Premium is required for playback features');
      return;
    }

    const initPlayer = () => {
      if (!window.Spotify) {
        console.error('Spotify SDK not loaded');
        setError('Spotify SDK failed to load');
        return;
      }

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Vibify Web Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization error:', message);
        setError('Failed to initialize player');
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication error:', message);
        setError('Authentication failed');
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account error:', message);
        setError('Account error - Premium required');
        setIsPremium(false);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback error:', message);
        setError('Playback error occurred');
      });

      // Ready
      spotifyPlayer.addListener('ready', async ({ device_id }) => {
        console.log('Player ready with Device ID:', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        setError(null);

        // Wait for device to register with Spotify servers
        console.log('Waiting for device to register with Spotify servers...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try to activate device by transferring playback
        try {
          const { transferPlayback, getAvailableDevices } = await import('../services/spotifyApi');

          // Retry logic to check if device is available (it may take a moment to register)
          let ourDevice = null;
          let attempts = 0;
          const maxAttempts = 3;

          while (!ourDevice && attempts < maxAttempts) {
            const devices = await getAvailableDevices();
            console.log(`Device check attempt ${attempts + 1}/${maxAttempts}:`,
              devices.map(d => ({ id: d.id, name: d.name, is_active: d.is_active })));

            ourDevice = devices.find(d => d.id === device_id);

            if (!ourDevice && attempts < maxAttempts - 1) {
              console.log('Device not found yet, waiting...');
              await new Promise(resolve => setTimeout(resolve, 1000));
            }

            attempts++;
          }

          if (ourDevice) {
            console.log('✓ Device found in available devices:', ourDevice.name);
            console.log('Transferring playback to activate device...');
            await transferPlayback(device_id, false);
            console.log('✓ Playback transferred - Vibify player is ready to use!');
          } else {
            console.log('Device not yet registered with Spotify. It will be activated automatically when you play a song.');
          }
        } catch (err) {
          console.warn('Could not transfer playback automatically:', err);
          console.log('Device will be activated automatically when you play a song.');
          // Don't set error, as manual play will trigger transfer
        }
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device has gone offline:', device_id);
        setIsReady(false);
      });

      // Player state changed
      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (state) {
          setPlaybackState(state);
        }
      });

      // Connect to the player
      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          console.error('Failed to connect to Spotify');
          setError('Failed to connect to Spotify');
        }
      });

      setPlayer(spotifyPlayer);
      playerRef.current = spotifyPlayer;
    };

    // Wait for Spotify SDK to be ready
    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [accessToken, user]);

  // Playback controls
  const play = useCallback(
    async (uri?: string) => {
      if (!player || !deviceId) return;

      try {
        if (uri) {
          // Play specific track/album/playlist
          const { play: playApi } = await import('../services/spotifyApi');
          if (uri.includes('album') || uri.includes('playlist')) {
            await playApi(deviceId, uri);
          } else {
            await playApi(deviceId, undefined, [uri]);
          }
        } else {
          // Resume current track
          await player.resume();
        }
      } catch (err) {
        console.error('Play error:', err);
        setError('Failed to play');
      }
    },
    [player, deviceId]
  );

  const pause = useCallback(async () => {
    if (!player) return;
    try {
      await player.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, [player]);

  const togglePlay = useCallback(async () => {
    if (!player) return;
    try {
      await player.togglePlay();
    } catch (err) {
      console.error('Toggle play error:', err);
    }
  }, [player]);

  const nextTrack = useCallback(async () => {
    if (!player) return;
    try {
      await player.nextTrack();
    } catch (err) {
      console.error('Next track error:', err);
    }
  }, [player]);

  const previousTrack = useCallback(async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (err) {
      console.error('Previous track error:', err);
    }
  }, [player]);

  const seek = useCallback(
    async (positionMs: number) => {
      if (!player) return;
      try {
        await player.seek(positionMs);
      } catch (err) {
        console.error('Seek error:', err);
      }
    },
    [player]
  );

  const setVolume = useCallback(
    async (volume: number) => {
      if (!player) return;
      try {
        await player.setVolume(volume);
      } catch (err) {
        console.error('Volume error:', err);
      }
    },
    [player]
  );

  return {
    player,
    deviceId,
    playbackState,
    isReady,
    isPremium,
    error,
    controls: {
      play,
      pause,
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
    },
  };
}

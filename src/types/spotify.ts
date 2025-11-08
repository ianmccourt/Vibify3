// Spotify API Types

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  product: string; // 'premium' or 'free'
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: SpotifyAlbum;
  duration_ms: number;
  uri: string;
  preview_url: string | null;
  popularity: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  images: Array<{ url: string; height: number; width: number }>;
  release_date: string;
  uri: string;
  total_tracks?: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
  uri: string;
  owner: {
    display_name: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  genres: string[];
  uri: string;
  followers?: {
    total: number;
  };
}

export interface PlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: SpotifyWebPlaybackTrack;
    previous_tracks: SpotifyWebPlaybackTrack[];
    next_tracks: SpotifyWebPlaybackTrack[];
  };
}

export interface SpotifyWebPlaybackTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; uri: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    uri: string;
  };
  duration_ms: number;
  uri: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  firstListened: string;
  listenCount: number;
  uri: string;
}

export interface RecommendationsParams {
  seed_artists?: string[];
  seed_tracks?: string[];
  seed_genres?: string[];
  target_popularity?: number;
  limit?: number;
  min_popularity?: number;
  max_popularity?: number;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  expires_at: number;
}

export interface RoomConfig {
  wallColor: string;
  lightingMode: 'warm' | 'cool' | 'neon' | 'natural';
  plants: {
    monstera: boolean;
    snakePlant: boolean;
    fiddleLeaf: boolean;
  };
  layout: 'default' | 'minimal' | 'cozy';
  floorType: 'wood' | 'carpet' | 'tile';
}

// Extend Window interface for Spotify SDK
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: Spotify.PlayerConstructor;
    };
  }
}

export namespace Spotify {
  export interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  export interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (state: any) => void): void;
    removeListener(event: string): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    _options: { id: string };
  }

  export interface PlayerConstructor {
    new (options: PlayerOptions): Player;
  }
}

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import { SpotifyAuth } from './auth/SpotifyAuth';
import { Header } from './components/Header';
import { Room } from './components/Room/Room';
import { PlaybackControls } from './components/PlaybackControls';
import { Recommendations } from './components/Recommendations/Recommendations';
import { CustomizationPanel } from './components/Customization/CustomizationPanel';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import { useListeningHistory } from './hooks/useListeningHistory';
import { play } from './services/spotifyApi';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<'room' | 'discover'>('room');

  // Initialize Spotify Player
  const {
    playbackState,
    isReady,
    isPremium,
    error: playerError,
    deviceId,
    controls,
  } = useSpotifyPlayer();

  // Track listening history
  const { collection } = useListeningHistory(playbackState);

  // Handle authentication success
  const handleAuthSuccess = () => {
    window.location.reload();
  };

  // Play a track/album
  const handlePlay = async (uri: string) => {
    if (!deviceId) {
      console.error('No device ID available');
      return;
    }

    try {
      if (uri.includes('album') || uri.includes('playlist')) {
        await play(deviceId, uri);
      } else {
        await play(deviceId, undefined, [uri]);
      }
    } catch (error) {
      console.error('Failed to play:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Vibify...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <SpotifyAuth onSuccess={handleAuthSuccess} />;
  }

  // Show premium required message
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 flex items-center justify-center p-4">
        <div className="max-w-md glass rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">Spotify Premium Required</h2>
          <p className="text-white/80 mb-6">
            Vibify requires Spotify Premium for playback features. Upgrade your account to unlock the full
            experience.
          </p>
          <a
            href="https://www.spotify.com/premium/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
          >
            Upgrade to Premium
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header onSettingsClick={() => setShowSettings(true)} />

      {/* Navigation Tabs */}
      <div className="fixed top-20 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('room')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeView === 'room'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Your Room
            </button>
            <button
              onClick={() => setActiveView('discover')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeView === 'discover'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Discover
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-32">
        {activeView === 'room' ? (
          <Room
            playbackState={playbackState}
            collection={collection}
            onPlayAlbum={handlePlay}
          />
        ) : (
          <Recommendations onPlayTrack={handlePlay} />
        )}
      </div>

      {/* Playback Controls */}
      <PlaybackControls
        playbackState={playbackState}
        isReady={isReady}
        onPlay={controls.play}
        onPause={controls.pause}
        onNext={controls.nextTrack}
        onPrevious={controls.previousTrack}
        onSeek={controls.seek}
        onVolumeChange={controls.setVolume}
      />

      {/* Customization Panel */}
      <CustomizationPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Player Error */}
      {playerError && (
        <div className="fixed bottom-24 right-6 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl animate-fadeIn max-w-md">
          <p className="font-semibold">Player Error</p>
          <p className="text-sm">{playerError}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <AppContent />
      </RoomProvider>
    </AuthProvider>
  );
}

export default App;

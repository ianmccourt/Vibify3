import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import { SpotifyAuth } from './auth/SpotifyAuth';
import { Header } from './components/Header';
import { Room } from './components/Room/Room';
import { PlaybackControls } from './components/PlaybackControls';
import { Recommendations } from './components/Recommendations/Recommendations';
import { CustomizationPanel } from './components/Customization/CustomizationPanel';
import { Search } from './components/Search/Search';
import { Library } from './components/Library/Library';
import { Stats } from './components/Stats/Stats';
import { Queue } from './components/Queue/Queue';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import { useListeningHistory } from './hooks/useListeningHistory';
import { play } from './services/spotifyApi';

type ViewType = 'room' | 'discover' | 'search' | 'library' | 'stats' | 'queue';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('room');

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      {/* Header */}
      <Header onSettingsClick={() => setShowSettings(true)} />

      {/* Navigation Tabs */}
      <div className="fixed top-20 left-0 right-0 z-40 glass-dark border-b border-white/10 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            <NavTab
              active={activeView === 'room'}
              onClick={() => setActiveView('room')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              }
              label="Your Room"
            />
            <NavTab
              active={activeView === 'discover'}
              onClick={() => setActiveView('discover')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              label="Discover"
            />
            <NavTab
              active={activeView === 'search'}
              onClick={() => setActiveView('search')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              label="Search"
            />
            <NavTab
              active={activeView === 'library'}
              onClick={() => setActiveView('library')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                </svg>
              }
              label="Library"
            />
            <NavTab
              active={activeView === 'stats'}
              onClick={() => setActiveView('stats')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Stats"
            />
            <NavTab
              active={activeView === 'queue'}
              onClick={() => setActiveView('queue')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              label="Queue"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-32">
        {activeView === 'room' && (
          <Room
            playbackState={playbackState}
            collection={collection}
            onPlayAlbum={handlePlay}
          />
        )}
        {activeView === 'discover' && (
          <Recommendations onPlayTrack={handlePlay} />
        )}
        {activeView === 'search' && (
          <Search onPlayTrack={handlePlay} onPlayAlbum={handlePlay} />
        )}
        {activeView === 'library' && (
          <Library onPlayPlaylist={handlePlay} />
        )}
        {activeView === 'stats' && (
          <Stats collection={collection} onPlayTrack={handlePlay} />
        )}
        {activeView === 'queue' && (
          <Queue playbackState={playbackState} />
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
        onQueueClick={() => setActiveView('queue')}
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

// Navigation Tab Component
interface NavTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavTab({ active, onClick, icon, label }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-5 py-3 font-semibold transition-all whitespace-nowrap ${
        active
          ? 'text-white border-b-2 border-purple-500'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-purple-400' : ''}>{icon}</span>
      <span>{label}</span>
    </button>
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

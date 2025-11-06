import React, { useEffect, useState } from 'react';
import { redirectToSpotifyAuth, exchangeCodeForTokens, storeTokens } from './authUtils';

interface SpotifyAuthProps {
  onSuccess: () => void;
}

export function SpotifyAuth({ onSuccess }: SpotifyAuthProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setError(`Authentication failed: ${error}`);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (code) {
        setIsLoading(true);
        try {
          const tokens = await exchangeCodeForTokens(code);
          storeTokens(tokens);
          window.history.replaceState({}, document.title, window.location.pathname);
          onSuccess();
        } catch (err) {
          setError('Failed to complete authentication. Please try again.');
          console.error('Auth error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [onSuccess]);

  const handleLogin = async () => {
    try {
      setError(null);
      await redirectToSpotifyAuth();
    } catch (err) {
      setError('Failed to start authentication. Please try again.');
      console.error('Login error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">Vibify</h1>
            <p className="text-white/80 text-lg">Your Personal Music Sanctuary</p>
          </div>

          <div className="mb-8">
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <h2 className="text-white text-xl font-semibold mb-3">Experience:</h2>
              <ul className="text-white/90 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">🎵</span>
                  Immersive virtual room
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💿</span>
                  Build your vinyl collection
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎨</span>
                  Customize your space
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔍</span>
                  Discover new music
                </li>
              </ul>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
              <p className="text-yellow-100 text-sm">
                <strong>Note:</strong> Spotify Premium is required for playback features.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect with Spotify
            </span>
          </button>

          <p className="text-white/60 text-xs text-center mt-6">
            By connecting, you agree to Spotify's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

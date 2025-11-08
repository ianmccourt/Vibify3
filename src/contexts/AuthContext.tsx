import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SpotifyUser, AuthTokens } from '../types/spotify';
import {
  getStoredTokens,
  storeTokens,
  clearTokens,
  getValidAccessToken,
  isTokenExpired,
  refreshAccessToken,
} from '../auth/authUtils';

interface AuthContextType {
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  // Define callbacks first
  const login = () => {
    // This will be handled by the SpotifyAuth component
    // Just update the state after successful auth
  };

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens?.refresh_token) {
      logout();
      return;
    }

    try {
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      storeTokens(newTokens);
      setAccessToken(newTokens.access_token);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, [logout]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = await getValidAccessToken();
      if (token) {
        setAccessToken(token);
        await fetchUserProfile(token);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!accessToken) return;

    const tokens = getStoredTokens();
    if (!tokens) return;

    const timeUntilExpiry = tokens.expires_at - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // 5 minutes before expiry

    const timeout = setTimeout(async () => {
      await refreshToken();
    }, refreshTime);

    return () => clearTimeout(timeout);
  }, [accessToken, refreshToken]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    accessToken,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

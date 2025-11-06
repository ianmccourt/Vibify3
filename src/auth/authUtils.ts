import { AuthTokens } from '../types/spotify';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-email',
  'user-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-library-read',
  'user-library-modify',
];

// Generate a random string for PKCE code verifier
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Generate SHA256 hash for PKCE code challenge
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

// Base64 URL encode
function base64urlencode(a: ArrayBuffer): string {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate PKCE code challenge
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const hashed = await sha256(codeVerifier);
  return base64urlencode(hashed);
}

// Initiate Spotify OAuth flow
export async function redirectToSpotifyAuth(): Promise<void> {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code verifier for later use
  localStorage.setItem('code_verifier', codeVerifier);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const params = {
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: SCOPES.join(' '),
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<AuthTokens> {
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();

  const tokens: AuthTokens = {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  // Clean up code verifier
  localStorage.removeItem('code_verifier');

  return tokens;
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();

  const tokens: AuthTokens = {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token || refreshToken, // Use existing if not provided
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return tokens;
}

// Store tokens securely
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem('spotify_tokens', JSON.stringify(tokens));
}

// Retrieve tokens
export function getStoredTokens(): AuthTokens | null {
  const tokensStr = localStorage.getItem('spotify_tokens');
  if (!tokensStr) return null;

  try {
    return JSON.parse(tokensStr);
  } catch {
    return null;
  }
}

// Clear tokens (logout)
export function clearTokens(): void {
  localStorage.removeItem('spotify_tokens');
  localStorage.removeItem('code_verifier');
}

// Check if token is expired
export function isTokenExpired(tokens: AuthTokens): boolean {
  return Date.now() >= tokens.expires_at - 60000; // 1 minute buffer
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();

  if (!tokens) return null;

  if (isTokenExpired(tokens)) {
    if (!tokens.refresh_token) {
      clearTokens();
      return null;
    }

    try {
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      storeTokens(newTokens);
      return newTokens.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
      return null;
    }
  }

  return tokens.access_token;
}

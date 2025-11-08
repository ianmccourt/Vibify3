import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark shadow-xl">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" style={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Vibify</h1>
              <p className="text-white/40 text-xs">Your Music Sanctuary</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                {user.images?.[0]?.url ? (
                  <img
                    src={user.images[0]?.url}
                    alt={user.display_name}
                    className="w-11 h-11 rounded-full border-2 border-purple-500/50 shadow-lg"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {user.display_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-white font-semibold text-sm">{user.display_name}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${user.product === 'premium' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <p className="text-white/60 text-xs">
                      {user.product === 'premium' ? 'Premium' : 'Free'}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-white/60 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-glow rounded-xl shadow-2xl py-2 animate-bounceIn">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-semibold truncate">{user.display_name}</p>
                    <p className="text-white/60 text-xs truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onSettingsClick();
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-all flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Room Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-3 text-left text-red-300 hover:bg-red-500/10 transition-all flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

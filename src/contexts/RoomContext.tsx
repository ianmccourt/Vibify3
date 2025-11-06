import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RoomConfig } from '../types/spotify';
import { getRoomConfig, saveRoomConfig, getDefaultConfig } from '../services/roomConfig';

interface RoomContextType {
  config: RoomConfig;
  updateConfig: (updates: Partial<RoomConfig>) => void;
  resetConfig: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

interface RoomProviderProps {
  children: ReactNode;
}

export function RoomProvider({ children }: RoomProviderProps) {
  const [config, setConfig] = useState<RoomConfig>(getRoomConfig());

  const updateConfig = (updates: Partial<RoomConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    saveRoomConfig(newConfig);
  };

  const resetConfig = () => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    saveRoomConfig(defaultConfig);
  };

  const value: RoomContextType = {
    config,
    updateConfig,
    resetConfig,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

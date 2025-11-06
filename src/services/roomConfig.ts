import { RoomConfig } from '../types/spotify';

const ROOM_CONFIG_KEY = 'vibify_room_config';

const DEFAULT_CONFIG: RoomConfig = {
  wallColor: '#F5E6D3',
  lightingMode: 'warm',
  plants: {
    monstera: true,
    snakePlant: true,
    fiddleLeaf: true,
  },
  layout: 'default',
  floorType: 'wood',
};

export function getRoomConfig(): RoomConfig {
  try {
    const data = localStorage.getItem(ROOM_CONFIG_KEY);
    return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error loading room config:', error);
    return DEFAULT_CONFIG;
  }
}

export function saveRoomConfig(config: RoomConfig): void {
  try {
    localStorage.setItem(ROOM_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving room config:', error);
  }
}

export function resetRoomConfig(): void {
  localStorage.removeItem(ROOM_CONFIG_KEY);
}

export function getDefaultConfig(): RoomConfig {
  return { ...DEFAULT_CONFIG };
}

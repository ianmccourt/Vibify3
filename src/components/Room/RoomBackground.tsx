import React from 'react';
import { RoomConfig } from '../../types/spotify';
import '../../styles/room.css';

interface RoomBackgroundProps {
  config: RoomConfig;
}

export function RoomBackground({ config }: RoomBackgroundProps) {
  return (
    <div className="absolute inset-0 room-3d">
      {/* Back Wall */}
      <div
        className="absolute inset-0 wall wall-back transition-colors duration-500"
        style={{ backgroundColor: config.wallColor }}
      />

      {/* Floor */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/3 floor ${config.floorType}`}
        style={{
          transform: 'perspective(800px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Left Wall (subtle) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/4 wall wall-left"
        style={{
          backgroundColor: config.wallColor,
          filter: 'brightness(0.8)',
        }}
      />

      {/* Right Wall (subtle) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/4 wall wall-right"
        style={{
          backgroundColor: config.wallColor,
          filter: 'brightness(0.9)',
        }}
      />
    </div>
  );
}

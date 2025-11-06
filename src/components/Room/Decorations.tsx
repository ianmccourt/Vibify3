import React from 'react';
import { RoomConfig } from '../../types/spotify';

interface DecorationsProps {
  config: RoomConfig;
}

export function Decorations({ config }: DecorationsProps) {
  return (
    <>
      {/* Window with sunlight */}
      <div className="absolute top-10 right-10 window w-48 h-64 rounded-lg">
        <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2 h-full">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="window-pane rounded" />
          ))}
        </div>
      </div>

      {/* Floor Lamp */}
      <div className="absolute bottom-20 left-10">
        <div className="relative">
          {/* Lamp light glow */}
          <div className={`lamp-light w-32 h-32 absolute -top-16 left-1/2 transform -translate-x-1/2 ${config.lightingMode === 'warm' ? 'opacity-100' : 'opacity-50'} ambient-glow`} />

          {/* Lamp shade */}
          <div className="lamp-shade w-20 h-16 mx-auto rounded-b-full" />

          {/* Lamp stand */}
          <div className="w-2 h-32 bg-gradient-to-b from-gray-700 to-gray-900 mx-auto" />

          {/* Lamp base */}
          <div className="w-12 h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full mx-auto" />
        </div>
      </div>

      {/* Plants */}
      {config.plants.monstera && (
        <div className="absolute bottom-16 right-16 animate-fadeIn">
          <div className="plant-pot w-16 h-20 relative">
            {/* Monstera leaves */}
            <svg
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-24 h-24"
              viewBox="0 0 100 100"
            >
              <path
                d="M50 10 Q30 30 35 50 Q20 60 25 80 L30 80 Q28 60 40 50 Q35 30 50 15 Q65 30 60 50 Q72 60 70 80 L75 80 Q80 60 65 50 Q70 30 50 10 Z"
                fill="#2d5016"
                opacity="0.9"
              />
              <path
                d="M50 20 Q40 35 42 50 L48 50 Q46 35 50 25 Q54 35 52 50 L58 50 Q60 35 50 20 Z"
                fill="#3a6b1f"
              />
            </svg>
          </div>
        </div>
      )}

      {config.plants.snakePlant && (
        <div className="absolute bottom-16 left-1/4 animate-fadeIn">
          <div className="plant-pot w-14 h-16 relative">
            {/* Snake plant leaves */}
            <svg
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-20 h-20"
              viewBox="0 0 100 100"
            >
              <rect x="35" y="20" width="8" height="60" fill="#4a6b3a" rx="2" />
              <rect x="45" y="10" width="8" height="70" fill="#5a7b4a" rx="2" />
              <rect x="55" y="25" width="8" height="55" fill="#4a6b3a" rx="2" />
            </svg>
          </div>
        </div>
      )}

      {config.plants.fiddleLeaf && (
        <div className="absolute bottom-16 right-1/3 animate-fadeIn">
          <div className="plant-pot w-16 h-20 relative">
            {/* Fiddle leaf fig */}
            <svg
              className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-28 h-28"
              viewBox="0 0 100 100"
            >
              {/* Leaves */}
              <ellipse cx="50" cy="30" rx="15" ry="20" fill="#3a6b2f" opacity="0.9" />
              <ellipse cx="35" cy="45" rx="15" ry="20" fill="#4a7b3f" opacity="0.9" />
              <ellipse cx="65" cy="45" rx="15" ry="20" fill="#4a7b3f" opacity="0.9" />
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#3a6b2f" opacity="0.9" />
              {/* Stem */}
              <line x1="50" y1="50" x2="50" y2="80" stroke="#5a4733" strokeWidth="2" />
            </svg>
          </div>
        </div>
      )}

      {/* Rug under record player area */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rug w-96 h-64 rounded-lg opacity-60" />

      {/* Ambient lighting effect based on mode */}
      <div className={`absolute inset-0 pointer-events-none lighting-${config.lightingMode} transition-opacity duration-1000`} />
    </>
  );
}

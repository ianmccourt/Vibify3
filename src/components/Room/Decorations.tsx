import React from 'react';
import { RoomConfig } from '../../types/spotify';

interface DecorationsProps {
  config: RoomConfig;
}

export function Decorations({ config }: DecorationsProps) {
  return (
    <>
      {/* Window with sunlight */}
      <div className="absolute top-10 right-10 w-48 h-64">
        <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-2xl">
          {/* Window frame */}
          <rect x="0" y="0" width="200" height="280" rx="8" fill="#8b7355" />
          <rect x="8" y="8" width="184" height="264" rx="4" fill="url(#skyGradient)" />

          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#B0E0E6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E0F6FF" stopOpacity="0.5" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFE4B5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Sun glow */}
          <circle cx="140" cy="60" r="50" fill="url(#sunGlow)" />

          {/* Sun */}
          <circle cx="140" cy="60" r="20" fill="#FFD700" opacity="0.9" />

          {/* Clouds */}
          <ellipse cx="60" cy="50" rx="20" ry="12" fill="white" opacity="0.6" />
          <ellipse cx="75" cy="48" rx="18" ry="10" fill="white" opacity="0.6" />
          <ellipse cx="50" cy="48" rx="15" ry="9" fill="white" opacity="0.6" />

          <ellipse cx="120" cy="120" rx="25" ry="15" fill="white" opacity="0.5" />
          <ellipse cx="140" cy="118" rx="22" ry="13" fill="white" opacity="0.5" />
          <ellipse cx="105" cy="118" rx="18" ry="11" fill="white" opacity="0.5" />

          {/* Window panes (cross divider) */}
          <rect x="96" y="8" width="8" height="264" fill="#8b7355" opacity="0.8" />
          <rect x="8" y="136" width="184" height="8" fill="#8b7355" opacity="0.8" />

          {/* Window reflection/shine */}
          <rect x="15" y="15" width="70" height="100" fill="white" opacity="0.15" rx="4" />
          <rect x="20" y="20" width="30" height="60" fill="white" opacity="0.2" rx="2" />
        </svg>
      </div>

      {/* Floor Lamp */}
      <div className="absolute bottom-20 left-10">
        <svg viewBox="0 0 120 200" className="w-24 h-40 drop-shadow-xl">
          <defs>
            <linearGradient id="lampShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FFF8DC" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F5DEB3" stopOpacity="0.75" />
            </linearGradient>
            <radialGradient id="lampGlow" cx="50%" cy="20%">
              <stop offset="0%" stopColor="#FFF9E6" stopOpacity={config.lightingMode === 'warm' ? '0.9' : '0.4'} />
              <stop offset="30%" stopColor="#FFE4B5" stopOpacity={config.lightingMode === 'warm' ? '0.6' : '0.2'} />
              <stop offset="70%" stopColor="#FFD580" stopOpacity={config.lightingMode === 'warm' ? '0.3' : '0.1'} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="lampStand" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="50%" stopColor="#6B6B6B" />
              <stop offset="100%" stopColor="#4A4A4A" />
            </linearGradient>
          </defs>

          {/* Light glow effect */}
          <ellipse cx="60" cy="30" rx="55" ry="40" fill="url(#lampGlow)" className="ambient-glow" />

          {/* Lamp shade - bell shape */}
          <path
            d="M 30 40 Q 25 35 25 30 L 25 25 Q 25 20 30 18 L 90 18 Q 95 20 95 25 L 95 30 Q 95 35 90 40 Z"
            fill="url(#lampShade)"
            stroke="#D4AF37"
            strokeWidth="0.5"
          />

          {/* Shade bottom rim */}
          <ellipse cx="60" cy="40" rx="32" ry="4" fill="#E6D0A0" opacity="0.8" />

          {/* Light bulb glow (visible through shade) */}
          <ellipse cx="60" cy="30" rx="8" ry="10" fill="#FFF4D6" opacity="0.6" />

          {/* Lamp neck (decorative) */}
          <rect x="57" y="40" width="6" height="8" fill="#B8860B" rx="1" />
          <circle cx="60" cy="48" r="5" fill="#CD853F" />

          {/* Main stand pole */}
          <rect x="57" y="53" width="6" height="110" fill="url(#lampStand)" />

          {/* Stand pole highlights */}
          <rect x="58" y="53" width="1.5" height="110" fill="white" opacity="0.3" />
          <rect x="62.5" y="53" width="1.5" height="110" fill="black" opacity="0.2" />

          {/* Base - circular weighted base */}
          <ellipse cx="60" cy="170" rx="28" ry="6" fill="#2C2C2C" opacity="0.4" />
          <ellipse cx="60" cy="168" rx="25" ry="5" fill="url(#lampStand)" />
          <ellipse cx="60" cy="168" rx="20" ry="4" fill="#5A5A5A" />
          <ellipse cx="60" cy="166" rx="18" ry="3" fill="#6B6B6B" />

          {/* Base highlight */}
          <ellipse cx="60" cy="166" rx="10" ry="1.5" fill="white" opacity="0.2" />
        </svg>
      </div>

      {/* Plants */}
      {config.plants.monstera && (
        <div className="absolute bottom-16 right-16 animate-fadeIn">
          <svg viewBox="0 0 140 180" className="w-32 h-44 drop-shadow-xl">
            <defs>
              <linearGradient id="monsteraPot" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A0826D" />
                <stop offset="100%" stopColor="#7A6B5D" />
              </linearGradient>
              <linearGradient id="monsteraLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a6b2f" />
                <stop offset="50%" stopColor="#2d5a23" />
                <stop offset="100%" stopColor="#234518" />
              </linearGradient>
              <linearGradient id="monsteraLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a7b3f" />
                <stop offset="50%" stopColor="#3d6a33" />
                <stop offset="100%" stopColor="#2d5526" />
              </linearGradient>
            </defs>

            {/* Pot */}
            <ellipse cx="70" cy="175" rx="32" ry="8" fill="#4A4A4A" opacity="0.3" />
            <path
              d="M 45 160 Q 45 155 48 150 L 92 150 Q 95 155 95 160 L 95 175 L 45 175 Z"
              fill="url(#monsteraPot)"
              stroke="#6B5B4D"
              strokeWidth="1"
            />
            <ellipse cx="70" cy="150" rx="23" ry="5" fill="#8A7A6D" />
            <ellipse cx="70" cy="151" rx="20" ry="4" fill="#5A4A3D" opacity="0.5" />

            {/* Soil */}
            <ellipse cx="70" cy="152" rx="18" ry="3" fill="#3B2F2F" />

            {/* Stems */}
            <path d="M 70 150 Q 68 120 60 90" stroke="#4A7B3F" strokeWidth="2.5" fill="none" />
            <path d="M 70 150 Q 71 110 75 70" stroke="#3D6A33" strokeWidth="2.5" fill="none" />
            <path d="M 70 150 Q 72 125 85 95" stroke="#4A7B3F" strokeWidth="2" fill="none" />
            <path d="M 70 150 Q 68 135 55 110" stroke="#3D6A33" strokeWidth="2" fill="none" />

            {/* Monstera leaves with characteristic holes/splits */}
            {/* Left leaf */}
            <g transform="translate(60, 90) rotate(-20)">
              <path
                d="M 0 0 Q -12 -8 -18 -5 Q -15 -15 -10 -20 Q -5 -15 0 -18 Q 5 -15 8 -20 Q 12 -15 15 -18 Q 18 -10 15 -5 Q 10 -8 0 0"
                fill="url(#monsteraLeaf1)"
                stroke="#234518"
                strokeWidth="0.5"
              />
              {/* Leaf holes (characteristic of Monstera) */}
              <ellipse cx="-8" cy="-10" rx="2" ry="3" fill="#1a3312" opacity="0.8" />
              <ellipse cx="5" cy="-12" rx="2" ry="3" fill="#1a3312" opacity="0.8" />
              {/* Leaf veins */}
              <path d="M 0 0 L -8 -10" stroke="#234518" strokeWidth="0.5" opacity="0.5" />
              <path d="M 0 0 L 5 -12" stroke="#234518" strokeWidth="0.5" opacity="0.5" />
            </g>

            {/* Center-top leaf */}
            <g transform="translate(75, 70) rotate(10)">
              <path
                d="M 0 0 Q -15 -10 -22 -8 Q -20 -20 -12 -28 Q -6 -22 0 -25 Q 6 -22 10 -28 Q 16 -22 20 -25 Q 24 -18 22 -10 Q 15 -12 0 0"
                fill="url(#monsteraLeaf2)"
                stroke="#2d5526"
                strokeWidth="0.5"
              />
              {/* Leaf holes */}
              <ellipse cx="-10" cy="-15" rx="2.5" ry="4" fill="#1a3312" opacity="0.8" />
              <ellipse cx="6" cy="-17" rx="2.5" ry="4" fill="#1a3312" opacity="0.8" />
              <ellipse cx="-2" cy="-20" rx="2" ry="3" fill="#1a3312" opacity="0.8" />
              {/* Leaf veins */}
              <path d="M 0 0 L -10 -15" stroke="#2d5526" strokeWidth="0.5" opacity="0.5" />
              <path d="M 0 0 L 6 -17" stroke="#2d5526" strokeWidth="0.5" opacity="0.5" />
              <path d="M 0 0 L 0 -22" stroke="#2d5526" strokeWidth="0.6" opacity="0.6" />
            </g>

            {/* Right leaf */}
            <g transform="translate(85, 95) rotate(35)">
              <path
                d="M 0 0 Q -10 -6 -14 -4 Q -12 -12 -8 -16 Q -4 -12 0 -14 Q 4 -12 6 -16 Q 10 -12 12 -14 Q 14 -8 12 -4 Q 8 -6 0 0"
                fill="url(#monsteraLeaf1)"
                stroke="#234518"
                strokeWidth="0.5"
              />
              {/* Leaf holes */}
              <ellipse cx="-6" cy="-8" rx="1.5" ry="2.5" fill="#1a3312" opacity="0.8" />
              <ellipse cx="4" cy="-10" rx="1.5" ry="2.5" fill="#1a3312" opacity="0.8" />
              {/* Leaf veins */}
              <path d="M 0 0 L -6 -8" stroke="#234518" strokeWidth="0.5" opacity="0.5" />
              <path d="M 0 0 L 4 -10" stroke="#234518" strokeWidth="0.5" opacity="0.5" />
            </g>

            {/* Left-bottom leaf */}
            <g transform="translate(55, 110) rotate(-35)">
              <path
                d="M 0 0 Q -10 -6 -14 -4 Q -12 -11 -8 -15 Q -4 -11 0 -13 Q 4 -11 6 -15 Q 10 -11 11 -13 Q 13 -8 11 -4 Q 8 -6 0 0"
                fill="url(#monsteraLeaf2)"
                stroke="#2d5526"
                strokeWidth="0.5"
              />
              {/* Leaf holes */}
              <ellipse cx="-5" cy="-8" rx="1.5" ry="2" fill="#1a3312" opacity="0.8" />
              <ellipse cx="3" cy="-9" rx="1.5" ry="2" fill="#1a3312" opacity="0.8" />
              {/* Leaf veins */}
              <path d="M 0 0 L -5 -8" stroke="#2d5526" strokeWidth="0.5" opacity="0.5" />
              <path d="M 0 0 L 3 -9" stroke="#2d5526" strokeWidth="0.5" opacity="0.5" />
            </g>

            {/* Small new growth leaves */}
            <g transform="translate(70, 150) rotate(0)">
              <path
                d="M 0 0 Q -3 -2 -4 -1 Q -3 -4 -2 -6 Q 0 -5 0 -7 Q 2 -5 3 -6 Q 3 -3 3 -1 Q 2 -2 0 0"
                fill="#5a8b4f"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>
      )}

      {config.plants.snakePlant && (
        <div className="absolute bottom-16 left-1/4 animate-fadeIn">
          <svg viewBox="0 0 120 180" className="w-28 h-42 drop-shadow-xl">
            <defs>
              <linearGradient id="snakePot" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#B8956A" />
              </linearGradient>
              <linearGradient id="snakeLeaf1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2d5526" />
                <stop offset="20%" stopColor="#4a6b3a" />
                <stop offset="40%" stopColor="#2d5526" />
                <stop offset="60%" stopColor="#4a6b3a" />
                <stop offset="80%" stopColor="#2d5526" />
                <stop offset="100%" stopColor="#3a5a2d" />
              </linearGradient>
              <linearGradient id="snakeLeaf2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3a5a2d" />
                <stop offset="25%" stopColor="#5a7b4a" />
                <stop offset="50%" stopColor="#3a5a2d" />
                <stop offset="75%" stopColor="#5a7b4a" />
                <stop offset="100%" stopColor="#4a6b3a" />
              </linearGradient>
            </defs>

            {/* Pot shadow */}
            <ellipse cx="60" cy="175" rx="28" ry="6" fill="#4A4A4A" opacity="0.3" />

            {/* Pot */}
            <path
              d="M 40 160 L 38 175 L 82 175 L 80 160 Z"
              fill="url(#snakePot)"
              stroke="#9A7A5A"
              strokeWidth="1"
            />
            <ellipse cx="60" cy="160" rx="20" ry="4" fill="#E4B584" />
            <ellipse cx="60" cy="161" rx="17" ry="3" fill="#5A4A3D" opacity="0.4" />

            {/* Soil */}
            <ellipse cx="60" cy="162" rx="15" ry="2.5" fill="#3B2F2F" />

            {/* Snake plant leaves - tall sword-like leaves with banding pattern */}
            {/* Back left leaf */}
            <g transform="translate(45, 160) rotate(-15)">
              <path
                d="M 0 0 Q -2 -30 0 -60 Q 2 -70 0 -75 L 6 -75 Q 4 -70 6 -60 Q 8 -30 6 0 Z"
                fill="url(#snakeLeaf1)"
                stroke="#2d5526"
                strokeWidth="0.5"
              />
              {/* Horizontal bands */}
              <rect x="0" y="-15" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-30" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-45" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-60" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              {/* Pointed tip */}
              <path d="M 0 -75 L 3 -82 L 6 -75" fill="#3a5a2d" />
              {/* Center vein highlight */}
              <line x1="3" y1="0" x2="3" y2="-75" stroke="#6a8b5a" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Center-back tall leaf */}
            <g transform="translate(58, 160) rotate(0)">
              <path
                d="M 0 0 Q -2 -40 0 -85 Q 2 -92 0 -95 L 6 -95 Q 4 -92 6 -85 Q 8 -40 6 0 Z"
                fill="url(#snakeLeaf2)"
                stroke="#3a5a2d"
                strokeWidth="0.5"
              />
              {/* Horizontal bands */}
              <rect x="0" y="-20" width="6" height="2.5" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-40" width="6" height="2.5" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-60" width="6" height="2.5" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-80" width="6" height="2.5" fill="#1a3312" opacity="0.6" rx="0.5" />
              {/* Pointed tip */}
              <path d="M 0 -95 L 3 -103 L 6 -95" fill="#4a6b3a" />
              {/* Center vein highlight */}
              <line x1="3" y1="0" x2="3" y2="-95" stroke="#7a9b6a" strokeWidth="0.3" opacity="0.5" />
            </g>

            {/* Back right leaf */}
            <g transform="translate(68, 160) rotate(12)">
              <path
                d="M 0 0 Q -2 -35 0 -70 Q 2 -78 0 -82 L 6 -82 Q 4 -78 6 -70 Q 8 -35 6 0 Z"
                fill="url(#snakeLeaf1)"
                stroke="#2d5526"
                strokeWidth="0.5"
              />
              {/* Horizontal bands */}
              <rect x="0" y="-18" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-36" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-54" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              <rect x="0" y="-72" width="6" height="2" fill="#1a3312" opacity="0.6" rx="0.5" />
              {/* Pointed tip */}
              <path d="M 0 -82 L 3 -89 L 6 -82" fill="#3a5a2d" />
              {/* Center vein highlight */}
              <line x1="3" y1="0" x2="3" y2="-82" stroke="#6a8b5a" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Front left leaf */}
            <g transform="translate(50, 160) rotate(-8)">
              <path
                d="M 0 0 Q -2 -32 0 -65 Q 2 -73 0 -78 L 7 -78 Q 5 -73 7 -65 Q 9 -32 7 0 Z"
                fill="url(#snakeLeaf2)"
                stroke="#3a5a2d"
                strokeWidth="0.5"
              />
              {/* Horizontal bands */}
              <rect x="0" y="-16" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-33" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-50" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-67" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              {/* Pointed tip */}
              <path d="M 0 -78 L 3.5 -86 L 7 -78" fill="#4a6b3a" />
              {/* Center vein highlight */}
              <line x1="3.5" y1="0" x2="3.5" y2="-78" stroke="#7a9b6a" strokeWidth="0.4" opacity="0.5" />
            </g>

            {/* Front right leaf */}
            <g transform="translate(63, 160) rotate(8)">
              <path
                d="M 0 0 Q -2 -30 0 -62 Q 2 -69 0 -73 L 7 -73 Q 5 -69 7 -62 Q 9 -30 7 0 Z"
                fill="url(#snakeLeaf1)"
                stroke="#2d5526"
                strokeWidth="0.5"
              />
              {/* Horizontal bands */}
              <rect x="0" y="-15" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-31" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-47" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              <rect x="0" y="-63" width="7" height="2" fill="#1a3312" opacity="0.7" rx="0.5" />
              {/* Pointed tip */}
              <path d="M 0 -73 L 3.5 -81 L 7 -73" fill="#3a5a2d" />
              {/* Center vein highlight */}
              <line x1="3.5" y1="0" x2="3.5" y2="-73" stroke="#6a8b5a" strokeWidth="0.4" opacity="0.5" />
            </g>
          </svg>
        </div>
      )}

      {config.plants.fiddleLeaf && (
        <div className="absolute bottom-16 right-1/3 animate-fadeIn">
          <svg viewBox="0 0 140 200" className="w-32 h-48 drop-shadow-xl">
            <defs>
              <linearGradient id="fiddlePot" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B7355" />
                <stop offset="100%" stopColor="#6B5644" />
              </linearGradient>
              <linearGradient id="fiddleLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a7b3f" />
                <stop offset="50%" stopColor="#3a6b2f" />
                <stop offset="100%" stopColor="#2d5a23" />
              </linearGradient>
              <radialGradient id="fiddleLeafHighlight" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#5a8b4f" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Pot shadow */}
            <ellipse cx="70" cy="195" rx="32" ry="8" fill="#4A4A4A" opacity="0.3" />

            {/* Pot - terracotta style */}
            <path
              d="M 42 175 Q 42 170 45 165 L 95 165 Q 98 170 98 175 L 98 190 Q 98 195 95 195 L 45 195 Q 42 195 42 190 Z"
              fill="url(#fiddlePot)"
              stroke="#5A4A3A"
              strokeWidth="1"
            />
            {/* Pot rim */}
            <ellipse cx="70" cy="165" rx="26" ry="5" fill="#9B8365" />
            <ellipse cx="70" cy="166" rx="23" ry="4" fill="#6B5644" opacity="0.6" />

            {/* Soil */}
            <ellipse cx="70" cy="167" rx="20" ry="3" fill="#3B2F2F" />

            {/* Main stem/trunk */}
            <path
              d="M 68 165 Q 67 140 65 120 Q 64 100 63 80 Q 62 60 61 40"
              stroke="#5A4A3A"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 72 165 Q 73 140 75 120 Q 76 100 77 80 Q 78 60 79 40"
              stroke="#4A3A2A"
              strokeWidth="3"
              fill="none"
            />

            {/* Branch stems */}
            <path d="M 70 120 Q 55 115 45 108" stroke="#5A4A3A" strokeWidth="1.5" fill="none" />
            <path d="M 70 100 Q 85 95 95 88" stroke="#5A4A3A" strokeWidth="1.5" fill="none" />
            <path d="M 70 80 Q 50 75 38 70" stroke="#5A4A3A" strokeWidth="1.5" fill="none" />
            <path d="M 70 60 Q 90 55 100 48" stroke="#5A4A3A" strokeWidth="1.5" fill="none" />

            {/* Fiddle-shaped leaves (bottom to top) */}
            {/* Bottom left leaf */}
            <g transform="translate(45, 108) rotate(-10)">
              <path
                d="M 0 0 Q -5 -5 -8 -8 Q -10 -12 -10 -16 Q -10 -20 -8 -24 Q -6 -26 -3 -26 L 3 -26 Q 6 -26 8 -24 Q 10 -20 10 -16 Q 10 -12 8 -8 Q 5 -5 0 0"
                fill="url(#fiddleLeaf)"
                stroke="#2d5a23"
                strokeWidth="0.5"
              />
              <ellipse cx="0" cy="-13" rx="8" ry="10" fill="url(#fiddleLeafHighlight)" />
              {/* Central vein */}
              <path d="M 0 0 L 0 -26" stroke="#2d5a23" strokeWidth="0.5" opacity="0.6" />
              {/* Side veins */}
              <path d="M 0 -8 Q -4 -10 -6 -12" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -8 Q 4 -10 6 -12" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -16 Q -5 -17 -7 -19" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -16 Q 5 -17 7 -19" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Bottom right leaf */}
            <g transform="translate(95, 88) rotate(15)">
              <path
                d="M 0 0 Q -5 -5 -9 -9 Q -11 -13 -11 -18 Q -11 -23 -9 -27 Q -6 -29 -3 -29 L 3 -29 Q 6 -29 9 -27 Q 11 -23 11 -18 Q 11 -13 9 -9 Q 5 -5 0 0"
                fill="url(#fiddleLeaf)"
                stroke="#2d5a23"
                strokeWidth="0.5"
              />
              <ellipse cx="0" cy="-15" rx="9" ry="11" fill="url(#fiddleLeafHighlight)" />
              <path d="M 0 0 L 0 -29" stroke="#2d5a23" strokeWidth="0.5" opacity="0.6" />
              <path d="M 0 -9 Q -4 -11 -7 -13" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -9 Q 4 -11 7 -13" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -18 Q -5 -19 -8 -22" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -18 Q 5 -19 8 -22" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Middle left leaf */}
            <g transform="translate(38, 70) rotate(-25)">
              <path
                d="M 0 0 Q -6 -6 -10 -10 Q -12 -15 -12 -20 Q -12 -26 -10 -30 Q -7 -33 -3 -33 L 3 -33 Q 7 -33 10 -30 Q 12 -26 12 -20 Q 12 -15 10 -10 Q 6 -6 0 0"
                fill="url(#fiddleLeaf)"
                stroke="#2d5a23"
                strokeWidth="0.5"
              />
              <ellipse cx="0" cy="-17" rx="10" ry="13" fill="url(#fiddleLeafHighlight)" />
              <path d="M 0 0 L 0 -33" stroke="#2d5a23" strokeWidth="0.6" opacity="0.6" />
              <path d="M 0 -10 Q -5 -12 -8 -15" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -10 Q 5 -12 8 -15" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -20 Q -6 -22 -9 -25" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -20 Q 6 -22 9 -25" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Top right leaf */}
            <g transform="translate(100, 48) rotate(20)">
              <path
                d="M 0 0 Q -6 -6 -10 -11 Q -13 -16 -13 -22 Q -13 -28 -10 -33 Q -7 -36 -3 -36 L 3 -36 Q 7 -36 10 -33 Q 13 -28 13 -22 Q 13 -16 10 -11 Q 6 -6 0 0"
                fill="url(#fiddleLeaf)"
                stroke="#2d5a23"
                strokeWidth="0.5"
              />
              <ellipse cx="0" cy="-18" rx="10" ry="14" fill="url(#fiddleLeafHighlight)" />
              <path d="M 0 0 L 0 -36" stroke="#2d5a23" strokeWidth="0.6" opacity="0.6" />
              <path d="M 0 -11 Q -5 -13 -8 -16" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -11 Q 5 -13 8 -16" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -22 Q -6 -24 -9 -27" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
              <path d="M 0 -22 Q 6 -24 9 -27" stroke="#2d5a23" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Top center leaf (newest growth) */}
            <g transform="translate(70, 40) rotate(0)">
              <path
                d="M 0 0 Q -7 -7 -11 -12 Q -14 -18 -14 -24 Q -14 -31 -11 -36 Q -8 -40 -4 -40 L 4 -40 Q 8 -40 11 -36 Q 14 -31 14 -24 Q 14 -18 11 -12 Q 7 -7 0 0"
                fill="url(#fiddleLeaf)"
                stroke="#2d5a23"
                strokeWidth="0.5"
              />
              <ellipse cx="0" cy="-20" rx="11" ry="15" fill="url(#fiddleLeafHighlight)" />
              <path d="M 0 0 L 0 -40" stroke="#2d5a23" strokeWidth="0.7" opacity="0.6" />
              <path d="M 0 -12 Q -6 -14 -9 -18" stroke="#2d5a23" strokeWidth="0.4" opacity="0.4" />
              <path d="M 0 -12 Q 6 -14 9 -18" stroke="#2d5a23" strokeWidth="0.4" opacity="0.4" />
              <path d="M 0 -24 Q -7 -26 -10 -30" stroke="#2d5a23" strokeWidth="0.4" opacity="0.4" />
              <path d="M 0 -24 Q 7 -26 10 -30" stroke="#2d5a23" strokeWidth="0.4" opacity="0.4" />
            </g>
          </svg>
        </div>
      )}

      {/* Rug under record player area */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rug w-96 h-64 rounded-lg opacity-60" />

      {/* Ambient lighting effect based on mode */}
      <div className={`absolute inset-0 pointer-events-none lighting-${config.lightingMode} transition-opacity duration-1000`} />
    </>
  );
}

import React from 'react';
import { useRoom } from '../../contexts/RoomContext';
import { ColorPicker } from './ColorPicker';
import { RoomConfig } from '../../types/spotify';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationPanel({ isOpen, onClose }: CustomizationPanelProps) {
  const { config, updateConfig, resetConfig } = useRoom();

  if (!isOpen) return null;

  const handleLightingChange = (mode: RoomConfig['lightingMode']) => {
    updateConfig({ lightingMode: mode });
  };

  const handlePlantToggle = (plant: keyof RoomConfig['plants']) => {
    updateConfig({
      plants: {
        ...config.plants,
        [plant]: !config.plants[plant],
      },
    });
  };

  const handleFloorChange = (floorType: RoomConfig['floorType']) => {
    updateConfig({ floorType });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-dark z-50 animate-slideInRight overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Room Settings</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Wall Color */}
          <div className="mb-8">
            <ColorPicker
              selectedColor={config.wallColor}
              onColorChange={(color) => updateConfig({ wallColor: color })}
            />
          </div>

          {/* Lighting Mode */}
          <div className="mb-8">
            <h3 className="text-white text-sm font-semibold mb-3">Lighting Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['warm', 'cool', 'neon', 'natural'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleLightingChange(mode)}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    config.lightingMode === mode
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Floor Type */}
          <div className="mb-8">
            <h3 className="text-white text-sm font-semibold mb-3">Floor Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['wood', 'carpet', 'tile'] as const).map((floor) => (
                <button
                  key={floor}
                  onClick={() => handleFloorChange(floor)}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    config.floorType === floor
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {floor.charAt(0).toUpperCase() + floor.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Plants */}
          <div className="mb-8">
            <h3 className="text-white text-sm font-semibold mb-3">Plants</h3>
            <div className="space-y-3">
              {[
                { key: 'monstera' as const, label: 'Monstera' },
                { key: 'snakePlant' as const, label: 'Snake Plant' },
                { key: 'fiddleLeaf' as const, label: 'Fiddle Leaf Fig' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <span className="text-white">{label}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlantToggle(key);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      config.plants[key] ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        config.plants[key] ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetConfig}
            className="w-full px-4 py-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </>
  );
}

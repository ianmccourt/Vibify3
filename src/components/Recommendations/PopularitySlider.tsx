import React from 'react';

interface PopularitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function PopularitySlider({ value, onChange }: PopularitySliderProps) {
  const getLabel = () => {
    if (value < 33) return 'Hidden Gems';
    if (value < 67) return 'Balanced Mix';
    return 'Mainstream Hits';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">Hidden Gems</span>
        <span className="text-white font-semibold">{getLabel()}</span>
        <span className="text-white/60 text-sm">Mainstream</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${value}%, rgba(255,255,255,0.2) ${value}%, rgba(255,255,255,0.2) 100%)`,
        }}
      />

      <div className="flex items-center justify-between mt-1 text-xs text-white/40">
        <span>Obscure</span>
        <span>Popularity: {value}</span>
        <span>Popular</span>
      </div>
    </div>
  );
}

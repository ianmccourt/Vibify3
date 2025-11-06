import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Warm Beige', value: '#F5E6D3' },
  { name: 'Cool Blue', value: '#E8F4F8' },
  { name: 'Sage Green', value: '#D4E6D4' },
  { name: 'Soft Pink', value: '#F5E6E8' },
  { name: 'Lavender', value: '#E6E6FA' },
  { name: 'Warm Gray', value: '#E8E8E8' },
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div>
      <h3 className="text-white text-sm font-semibold mb-3">Wall Color</h3>
      <div className="grid grid-cols-3 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`relative group rounded-lg p-1 transition-all ${
              selectedColor === color.value ? 'ring-2 ring-white scale-105' : 'hover:scale-105'
            }`}
          >
            <div
              className="w-full h-12 rounded-md shadow-md"
              style={{ backgroundColor: color.value }}
            />
            <p className="text-white text-xs mt-1 text-center">{color.name}</p>

            {/* Checkmark for selected */}
            {selectedColor === color.value && (
              <div className="absolute top-3 right-3 bg-white rounded-full p-1">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

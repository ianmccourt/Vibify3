import React from 'react';
import { Album } from '../../types/spotify';
import { VinylRecord } from './VinylRecord';

interface RecordCollectionProps {
  albums: Album[];
  onPlayAlbum: (uri: string) => void;
}

export function RecordCollection({ albums, onPlayAlbum }: RecordCollectionProps) {
  if (albums.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="glass rounded-2xl p-8">
          <svg
            className="w-20 h-20 text-white/30 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="text-white text-xl font-semibold mb-2">Your Collection is Empty</h3>
          <p className="text-white/60">
            Start listening to music to build your vinyl collection!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold mb-2">Your Vinyl Collection</h2>
        <p className="text-white/60">
          {albums.length} {albums.length === 1 ? 'album' : 'albums'} collected
        </p>
      </div>

      {/* Shelves with records */}
      <div className="space-y-8">
        {/* Calculate rows (4 albums per row) */}
        {Array.from({ length: Math.ceil(albums.length / 4) }, (_, rowIndex) => {
          const rowAlbums = albums.slice(rowIndex * 4, rowIndex * 4 + 4);

          return (
            <div key={rowIndex} className="relative">
              {/* Shelf */}
              <div className="shelf h-4 rounded-lg mb-4" />

              {/* Records on shelf */}
              <div className="grid grid-cols-4 gap-6 -mt-20 px-4">
                {rowAlbums.map((album) => (
                  <div key={album.id} className="flex justify-center">
                    <VinylRecord album={album} onPlay={onPlayAlbum} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { RoomBackground } from './RoomBackground';
import { Decorations } from './Decorations';
import { RecordPlayer } from '../RecordPlayer/RecordPlayer';
import { RecordCollection } from '../RecordCollection/RecordCollection';
import { useRoom } from '../../contexts/RoomContext';
import { PlaybackState } from '../../types/spotify';
import { Album } from '../../types/spotify';
import '../../styles/room.css';

interface RoomProps {
  playbackState: PlaybackState | null;
  collection: Album[];
  onPlayAlbum: (uri: string) => void;
}

export function Room({ playbackState, collection, onPlayAlbum }: RoomProps) {
  const { config } = useRoom();

  return (
    <div className="relative w-full min-h-screen room-container overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Room Background */}
      <RoomBackground config={config} />

      {/* Decorations */}
      <Decorations config={config} />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-screen-2xl mx-auto pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Side - Record Player */}
          <div className="flex items-center justify-center">
            <RecordPlayer playbackState={playbackState} />
          </div>

          {/* Right Side - Record Collection */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-2xl glass rounded-2xl shadow-2xl">
              <RecordCollection albums={collection} onPlayAlbum={onPlayAlbum} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

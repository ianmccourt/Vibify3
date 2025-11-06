import { Album } from '../types/spotify';

const COLLECTION_KEY = 'vibify_record_collection';

export function getCollection(): Album[] {
  try {
    const data = localStorage.getItem(COLLECTION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading collection:', error);
    return [];
  }
}

export function saveCollection(albums: Album[]): void {
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(albums));
  } catch (error) {
    console.error('Error saving collection:', error);
  }
}

export function addAlbumToCollection(album: Omit<Album, 'firstListened' | 'listenCount'>): Album {
  const collection = getCollection();
  const existing = collection.find((a) => a.id === album.id);

  if (existing) {
    // Increment listen count
    existing.listenCount += 1;
    saveCollection(collection);
    return existing;
  }

  // Add new album
  const newAlbum: Album = {
    ...album,
    firstListened: new Date().toISOString(),
    listenCount: 1,
  };

  collection.unshift(newAlbum); // Add to beginning
  saveCollection(collection);
  return newAlbum;
}

export function removeAlbumFromCollection(albumId: string): void {
  const collection = getCollection();
  const filtered = collection.filter((a) => a.id !== albumId);
  saveCollection(filtered);
}

export function clearCollection(): void {
  localStorage.removeItem(COLLECTION_KEY);
}

export function getAlbumFromCollection(albumId: string): Album | null {
  const collection = getCollection();
  return collection.find((a) => a.id === albumId) || null;
}

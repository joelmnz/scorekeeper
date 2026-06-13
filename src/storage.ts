import type { AppStorage } from './types';

const STORAGE_KEY = 'game-scorekeeper:v1';

export function load(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, games: [] };
    const data = JSON.parse(raw);
    return data?.version === 1 && Array.isArray(data.games)
      ? data
      : { version: 1, games: [] };
  } catch {
    return { version: 1, games: [] };
  }
}

export function save(data: AppStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

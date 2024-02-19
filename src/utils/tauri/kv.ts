import { Store } from 'tauri-plugin-store-api';

const store = new Store('.settings.dat');

/**
 * @example kv.get<string>('k')
 */
export async function get<T>(key: string): Promise<T | null> {
  return (await store.get(key)) as T;
}

/**
 * @example kv.set('k', 'v')
 */
export async function set<T>(key: string, value: T) {
  await store.set(key, value);
  await store.save();
}

export const kv = {
  set,
  get,
};

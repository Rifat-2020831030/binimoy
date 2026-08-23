/**
 * Persistent Store Service
 *
 * Manages reading/writing QR history entries to disk via
 * @tauri-apps/plugin-store. Uses LazyStore for synchronous
 * construction with async operations.
 */

import { LazyStore } from '@tauri-apps/plugin-store';
import type { QREntry } from '$lib/types';

const STORE_FILENAME = 'binimoy-store.json';
const ENTRIES_KEY = 'entries';

// Singleton lazy store instance
let store: LazyStore | null = null;

/**
 * Gets or creates the singleton LazyStore instance.
 */
function getStore(): LazyStore {
  if (!store) {
    store = new LazyStore(STORE_FILENAME, { autoSave: true });
  }
  return store;
}

// ============================================================
// Public API
// ============================================================

/**
 * Loads all QR entries from persistent storage.
 * Returns an empty array if no entries exist yet.
 */
export async function loadEntries(): Promise<QREntry[]> {
  const s = getStore();
  const entries = await s.get<QREntry[]>(ENTRIES_KEY);
  return entries ?? [];
}

/**
 * Persists the full entries array to disk.
 * Overwrites the existing entries key entirely.
 */
export async function saveEntries(entries: QREntry[]): Promise<void> {
  const s = getStore();
  await s.set(ENTRIES_KEY, entries);
  await s.save();
}

/**
 * Exports the full history as a JSON string (for file download).
 * Includes metadata alongside the entries.
 */
export async function exportHistoryAsJSON(): Promise<string> {
  const entries = await loadEntries();
  const exportData = {
    app: 'Binimoy',
    version: 1,
    exportedAt: new Date().toISOString(),
    count: entries.length,
    entries,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Clears all entries from the store.
 */
export async function clearAllEntries(): Promise<void> {
  const s = getStore();
  await s.set(ENTRIES_KEY, []);
  await s.save();
}

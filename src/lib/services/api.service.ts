/**
 * API Service
 *
 * Interfaces with the Rust backend via Tauri Commands to
 * manage QR code history in the SQLite database.
 */

import { invoke } from '@tauri-apps/api/core';
import type { QREntry } from '$lib/types';

// ============================================================
// Public API
// ============================================================

/**
 * Loads all QR entries from the SQLite database.
 * Returns an empty array if no entries exist yet.
 */
export async function loadEntries(): Promise<QREntry[]> {
  try {
    return await invoke<QREntry[]>('get_entries');
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
}

/**
 * Adds a new entry to the SQLite database.
 */
export async function addEntry(entry: QREntry): Promise<void> {
  try {
    await invoke('add_entry', { entry });
  } catch (error) {
    console.error('Failed to add entry:', error);
    throw error;
  }
}

/**
 * Deletes an entry from the SQLite database.
 */
export async function deleteEntry(id: string): Promise<void> {
  try {
    await invoke('delete_entry', { id });
  } catch (error) {
    console.error('Failed to delete entry:', error);
    throw error;
  }
}

/**
 * Toggles the pinned status of an entry.
 */
export async function togglePin(id: string, pinned: boolean): Promise<void> {
  try {
    await invoke('toggle_pin', { id, pinned });
  } catch (error) {
    console.error('Failed to toggle pin:', error);
    throw error;
  }
}

/**
 * Clears all entries from the database.
 */
export async function clearAllEntries(): Promise<void> {
  try {
    await invoke('clear_all');
  } catch (error) {
    console.error('Failed to clear all entries:', error);
    throw error;
  }
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

import { type QREntry } from '$lib/types';
import * as api from '$lib/services/api.service';

/**
 * Global History State
 *
 * Manages the list of QR code entries using Svelte 5 runes.
 * Synchronizes with the Rust SQLite backend via api.service.ts.
 */
class HistoryState {
  // Reactive state for entries
  entries = $state<QREntry[]>([]);
  // Loading indicator for async operations
  isLoading = $state(true);

  /**
   * Initializes the store by loading entries from the backend.
   */
  async load() {
    this.isLoading = true;
    try {
      this.entries = await api.loadEntries();
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Adds a new entry and updates the backend.
   */
  async add(entry: QREntry) {
    try {
      await api.addEntry(entry);
      // Optimistic UI update — prepend to list
      this.entries = [entry, ...this.entries];
    } catch (e) {
      console.error('Failed to add entry:', e);
      // Re-throw so caller can handle errors (e.g. show toast)
      throw e;
    }
  }

  /**
   * Updates an existing entry.
   */
  async update(entry: QREntry) {
    try {
      await api.addEntry(entry); // addEntry uses INSERT OR REPLACE
      const index = this.entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        this.entries[index] = entry;
      }
    } catch (e) {
      console.error('Failed to update entry:', e);
      throw e;
    }
  }

  /**
   * Deletes an entry by ID.
   */
  async delete(id: string) {
    try {
      await api.deleteEntry(id);
      this.entries = this.entries.filter(e => e.id !== id);
    } catch (e) {
      console.error('Failed to delete entry:', e);
      throw e;
    }
  }

  /**
   * Toggles the pinned status of an entry.
   */
  async togglePin(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (!entry) return;

    const newPinnedStatus = !entry.pinned;
    try {
      await api.togglePin(id, newPinnedStatus);
      entry.pinned = newPinnedStatus;
    } catch (e) {
      console.error('Failed to toggle pin:', e);
      throw e;
    }
  }

  /**
   * Clears all history entries.
   */
  async clearAll() {
    try {
      await api.clearAllEntries();
      this.entries = [];
    } catch (e) {
      console.error('Failed to clear entries:', e);
      throw e;
    }
  }
}

// Export a singleton instance
export const history = new HistoryState();

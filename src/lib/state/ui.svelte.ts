import { DEFAULT_QR_OPTIONS, type FilterMode, type QREntry, type SortMode, type QROptions } from '$lib/types';
import { history } from './history.svelte';

/**
 * UI State
 *
 * Manages the transient UI state for the application such as
 * the currently selected item, search query, sorting, and filtering.
 */
class UIState {
  // Currently selected history item ID (loaded in generator panel)
  selectedId = $state<string | null>(null);

  // Search and filter parameters
  searchQuery = $state('');
  sortMode = $state<SortMode>('newest');
  filterMode = $state<FilterMode>('all');

  // Generator panel options drawer state
  optionsOpen = $state(false);
  globalOptions = $state<QROptions>({ ...DEFAULT_QR_OPTIONS });

  // Mobile pairing modal state
  pairingOpen = $state(false);

  /**
   * Derived state: The filtered and sorted list of history entries.
   * Automatically recalculates when history.entries, searchQuery, sortMode,
   * or filterMode change.
   */
  get visibleEntries(): QREntry[] {
    let result = history.entries;

    // 1. Filter by Pinned status
    if (this.filterMode === 'pinned') {
      result = result.filter(e => e.pinned);
    }

    // 2. Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        e => e.url.toLowerCase().includes(q) || (e.label && e.label.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    result = [...result].sort((a, b) => {
      // Pinned items always float to the top
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

      // Then apply the selected sort mode
      if (this.sortMode === 'newest') {
        return b.createdAt - a.createdAt;
      }
      if (this.sortMode === 'oldest') {
        return a.createdAt - b.createdAt;
      }
      if (this.sortMode === 'alpha') {
        const strA = (a.label || a.url).toLowerCase();
        const strB = (b.label || b.url).toLowerCase();
        return strA.localeCompare(strB);
      }
      return 0;
    });

    return result;
  }
}

// Export a singleton instance
export const ui = new UIState();

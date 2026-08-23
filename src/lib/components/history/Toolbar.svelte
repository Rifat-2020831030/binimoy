<script lang="ts">
  import { ui } from '$lib/state/ui.svelte';
  import { history } from '$lib/state/history.svelte';
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import SearchBar from './SearchBar.svelte';

  /**
   * Toolbar
   *
   * Top bar of the history panel containing the search bar,
   * filter controls, and sorting options.
   */

  const filterOptions = [
    { value: 'all' as const, label: 'All' },
    { value: 'pinned' as const, label: 'Pinned' }
  ];

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest' },
    { value: 'oldest' as const, label: 'Oldest' },
    { value: 'alpha' as const, label: 'A-Z' }
  ];

  import { exportHistoryAsJSON } from '$lib/services/api.service';
  import { saveJSON } from '$lib/services/export.service';
  import { toaster } from '$lib/state/toast.svelte';

  async function handleExport() {
    try {
      const json = await exportHistoryAsJSON();
      const success = await saveJSON(json);
      if (success) toaster.success('History exported successfully');
    } catch (e) {
      toaster.error('Failed to export history');
    }
  }
</script>

<div class="flex flex-col gap-4 p-6 bg-surface-0 border-b border-border sticky top-0 z-10">
  <div class="flex items-center justify-between gap-4">
    <SearchBar />
    
    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-1.5 text-xs font-medium bg-surface-1 hover:bg-surface-2 text-text-base px-3 py-1.5 rounded-lg border border-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
        onclick={() => (ui as any).pairingOpen = true}
      >
        <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        Pair Mobile
      </button>

      <button
        class="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-base transition-colors px-2 outline-none focus-visible:ring-2 focus-visible:ring-text-muted rounded"
        onclick={handleExport}
        title="Export full history as JSON"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Export
      </button>
      <div class="text-xs text-text-muted font-medium bg-surface-1 px-3 py-1.5 rounded-full border border-border">
        {ui.visibleEntries.length} {ui.visibleEntries.length === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  </div>

  <div class="flex items-center justify-between">
    <div class="w-[180px]">
      <SegmentedControl 
        options={filterOptions} 
        selected={ui.filterMode} 
        onChange={(v) => ui.filterMode = v} 
        size="sm"
      />
    </div>

    <div class="w-[240px]">
      <SegmentedControl 
        options={sortOptions} 
        selected={ui.sortMode} 
        onChange={(v) => ui.sortMode = v} 
        size="sm"
      />
    </div>
  </div>
</div>

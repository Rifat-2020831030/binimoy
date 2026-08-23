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

      <!-- Export will be added here in Step 8 -->
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

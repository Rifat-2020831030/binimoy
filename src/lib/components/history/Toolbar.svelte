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

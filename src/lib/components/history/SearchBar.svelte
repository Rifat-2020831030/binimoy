<script lang="ts">
  import { ui } from '$lib/state/ui.svelte';

  /**
   * SearchBar
   *
   * An input for filtering history entries by URL or label.
   */
</script>

<div class="relative w-full max-w-md">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <input
    type="text"
    bind:value={ui.searchQuery}
    placeholder="Search links and labels..."
    class="w-full bg-surface-1 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-base focus:ring-2 focus:ring-text-muted/30 focus:border-text-muted outline-none transition-all placeholder:text-text-muted/70"
    spellcheck="false"
  />
  
  {#if ui.searchQuery}
    <button 
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-base transition-colors"
      onclick={() => ui.searchQuery = ''}
      aria-label="Clear search"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  {/if}
</div>

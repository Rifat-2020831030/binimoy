<script lang="ts">
  /**
   * EmptyState
   *
   * Displayed when the history list is completely empty or when
   * a search yields no results.
   */
  
  interface Props {
    isSearch?: boolean;
    onClearSearch?: () => void;
  }

  let { isSearch = false, onClearSearch } = $props<Props>();
</script>

<div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
  {#if isSearch}
    <div class="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4 shadow-sm">
      <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-text-base mb-1">No results found</h3>
    <p class="text-sm text-text-muted max-w-sm mb-4">
      We couldn't find any QR codes matching your search or filter criteria.
    </p>
    {#if onClearSearch}
      <button 
        class="text-sm font-medium text-text-base bg-surface-2 hover:bg-surface-3 px-4 py-2 rounded-lg transition-colors"
        onclick={onClearSearch}
      >
        Clear Search
      </button>
    {/if}
  {:else}
    <div class="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4 shadow-sm">
      <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-text-base mb-1">No QR codes yet</h3>
    <p class="text-sm text-text-muted max-w-sm">
      Enter a URL or text in the panel on the left to generate your first QR code.
    </p>
  {/if}
</div>

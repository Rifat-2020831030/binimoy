<script lang="ts">
  import type { QREntry } from '$lib/types';
  import { ui } from '$lib/state/ui.svelte';
  import { history } from '$lib/state/history.svelte';
  import { relativeTime } from '$lib/utils/time';
  import { extractDomain, truncate } from '$lib/utils/validate';

  /**
   * HistoryItem
   *
   * A single row in the history list. Shows domain, label, time,
   * and provides actions for pin/delete.
   */

  interface Props {
    entry: QREntry;
    onDelete: (id: string) => void;
  }

  let { entry, onDelete } = $props<Props>();

  let isSelected = $derived(ui.selectedId === entry.id);
  
  // Format the display title: prefer label, fallback to domain, fallback to raw url
  let displayTitle = $derived(entry.label ? truncate(entry.label, 40) : extractDomain(entry.url));
  // Determine if it's a URL to show a link icon
  let isUrl = $derived(entry.url.startsWith('http'));

  function handleSelect() {
    ui.selectedId = entry.id;
  }

  function handleTogglePin(e: MouseEvent) {
    e.stopPropagation();
    history.togglePin(entry.id);
  }

  function handleDelete(e: MouseEvent) {
    e.stopPropagation();
    onDelete(entry.id);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div 
  class="group flex items-center justify-between p-4 border-b border-border transition-colors cursor-pointer
    {isSelected ? 'bg-surface-2' : 'hover:bg-surface-1/50 bg-surface-0'}"
  onclick={handleSelect}
  role="button"
  aria-pressed={isSelected}
>
  <div class="flex items-center gap-4 min-w-0 flex-1">
    <!-- Icon -->
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm
      {isSelected ? 'bg-text-base text-surface-0' : 'bg-surface-2 text-text-muted'} transition-colors">
      {#if isUrl}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
      {:else}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
      {/if}
    </div>

    <!-- Details -->
    <div class="flex flex-col min-w-0">
      <div class="flex items-center gap-2">
        <span class="font-medium text-sm text-text-base truncate">{displayTitle}</span>
        {#if entry.pinned}
          <svg class="w-3.5 h-3.5 text-warning shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
        {/if}
      </div>
      <span class="text-xs text-text-muted truncate mt-0.5 font-mono">{truncate(entry.url, 50)}</span>
    </div>
  </div>

  <!-- Actions & Time -->
  <div class="flex items-center gap-4 pl-4 shrink-0">
    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        class="p-1.5 text-text-muted hover:text-warning hover:bg-surface-3 rounded-md transition-colors outline-none focus-visible:ring-2"
        onclick={handleTogglePin}
        title={entry.pinned ? 'Unpin' : 'Pin'}
        aria-label={entry.pinned ? 'Unpin' : 'Pin'}
      >
        <svg class="w-4 h-4" fill={entry.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
      <button 
        class="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors outline-none focus-visible:ring-2"
        onclick={handleDelete}
        title="Delete"
        aria-label="Delete"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    <span class="text-xs text-text-muted whitespace-nowrap min-w-[60px] text-right">
      {relativeTime(entry.createdAt)}
    </span>
  </div>
</div>

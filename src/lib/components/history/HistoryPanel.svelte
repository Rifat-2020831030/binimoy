<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '$lib/state/ui.svelte';
  import { history } from '$lib/state/history.svelte';
  import Toolbar from './Toolbar.svelte';
  import HistoryItem from './HistoryItem.svelte';
  import EmptyState from './EmptyState.svelte';
  import ConfirmDialog from '../shared/ConfirmDialog.svelte';

  /**
   * HistoryPanel
   *
   * The main right-side panel assembling the toolbar, list, and empty states.
   */

  let itemToDelete = $state<string | null>(null);

  // Initialize history on mount
  onMount(() => {
    history.load();
  });

  function confirmDelete(id: string) {
    itemToDelete = id;
  }

  async function executeDelete() {
    if (!itemToDelete) return;
    try {
      await history.delete(itemToDelete);
      itemToDelete = null;
    } catch (e) {
      // Error handled by history state
    }
  }
</script>

<!-- Delete Confirmation Dialog -->
<ConfirmDialog
  open={!!itemToDelete}
  title="Delete QR Code"
  message="Are you sure you want to delete this QR code? This action cannot be undone."
  confirmText="Delete"
  onConfirm={executeDelete}
  onCancel={() => itemToDelete = null}
/>

<div class="flex flex-col h-full bg-surface-0 relative overflow-hidden">
  <Toolbar />

  <div class="flex-1 overflow-y-auto overflow-x-hidden relative">
    {#if history.isLoading}
      <div class="absolute inset-0 flex items-center justify-center bg-surface-0/50 backdrop-blur-sm z-10">
        <div class="w-8 h-8 rounded-full border-2 border-text-muted/30 border-t-text-base animate-spin"></div>
      </div>
    {/if}

    {#if history.entries.length === 0 && !history.isLoading}
      <EmptyState />
    {:else if ui.visibleEntries.length === 0 && !history.isLoading}
      <EmptyState 
        isSearch={true} 
        onClearSearch={() => {
          ui.searchQuery = '';
          ui.filterMode = 'all';
        }} 
      />
    {:else}
      <div class="flex flex-col pb-20">
        {#each ui.visibleEntries as entry (entry.id)}
          <HistoryItem {entry} onDelete={confirmDelete} />
        {/each}
      </div>
    {/if}
  </div>
</div>

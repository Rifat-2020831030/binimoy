<script lang="ts">
  import { onMount } from 'svelte';
  import { history } from '$lib/state/history.svelte';
  import { ui } from '$lib/state/ui.svelte';
  import { toaster } from '$lib/state/toast.svelte';
  import * as qrService from '$lib/services/qr.service';
  import * as exportService from '$lib/services/export.service';

  /**
   * QRPreview
   *
   * Renders the generated QR code on a canvas.
   * Auto-updates when the selected history item or its options change.
   */

  let canvasContainer: HTMLDivElement;
  let hasRendered = $state(false);

  // Get the currently selected entry from UI state
  let selectedEntry = $derived(history.entries.find(e => e.id === ui.selectedId));

  // Re-render QR code whenever the selected entry's data or options change
  $effect(() => {
    if (!canvasContainer || !selectedEntry) {
      hasRendered = false;
      return;
    }

    // Call the async render function
    qrService.renderQRToDOM(
      canvasContainer, 
      selectedEntry.url, 
      selectedEntry.options
    ).then(() => {
      hasRendered = true;
    }).catch(e => {
      console.error('QR Render Error:', e);
      hasRendered = false;
    });
  });

  async function handleCopy() {
    if (!selectedEntry) return;
    try {
      const blob = await qrService.getQRBlob(selectedEntry.url, selectedEntry.options, 'png');
      await exportService.copyPNGToClipboard(blob);
      toaster.success('Copied to clipboard');
    } catch (e) {
      toaster.error('Failed to copy QR code');
    }
  }

  async function handleSavePNG() {
    if (!selectedEntry) return;
    try {
      const blob = await qrService.getQRBlob(selectedEntry.url, selectedEntry.options, 'png');
      const filename = selectedEntry.label || 'binimoy-qr';
      const success = await exportService.savePNG(blob, filename);
      if (success) toaster.success('Saved PNG');
    } catch (e) {
      toaster.error('Failed to save PNG');
    }
  }

  async function handleSaveSVG() {
    if (!selectedEntry) return;
    try {
      const blob = await qrService.getQRBlob(selectedEntry.url, selectedEntry.options, 'svg');
      const filename = selectedEntry.label || 'binimoy-qr';
      const success = await exportService.saveSVG(blob, filename);
      if (success) toaster.success('Saved SVG');
    } catch (e) {
      toaster.error('Failed to save SVG');
    }
  }
</script>

<div class="flex flex-col items-center flex-1 bg-surface-2 border border-border rounded-2xl overflow-hidden relative">
  <!-- Empty State -->
  {#if !selectedEntry}
    <div class="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
      <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
      <p class="text-sm font-medium">Select or create a QR code</p>
    </div>
  {/if}

  <!-- Canvas Container -->
  <div class="flex-1 flex items-center justify-center w-full min-h-[300px] p-6 relative">
    <div 
      bind:this={canvasContainer} 
      class="transition-opacity duration-300 {hasRendered ? 'opacity-100' : 'opacity-0'}"
    ></div>
  </div>

  <!-- Action Toolbar (only visible when selected) -->
  {#if selectedEntry && hasRendered}
    <div class="w-full flex items-center justify-between px-4 py-3 bg-surface-1 border-t border-border mt-auto">
      <button
        onclick={handleCopy}
        class="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-base transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-3 outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        Copy
      </button>

      <div class="flex items-center gap-2">
        <button
          onclick={handleSavePNG}
          class="text-xs font-medium bg-surface-3 hover:bg-border text-text-base px-3 py-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
        >
          PNG
        </button>
        <button
          onclick={handleSaveSVG}
          class="text-xs font-medium bg-surface-3 hover:bg-border text-text-base px-3 py-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
        >
          SVG
        </button>
      </div>
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { fade, scale } from 'svelte/transition';
  import * as qrService from '$lib/services/qr.service';
  import { DEFAULT_QR_OPTIONS } from '$lib/types';
  
  /**
   * PairingModal
   *
   * Displays a QR code that the mobile Expo app can scan
   * to connect to this desktop's local IP address.
   */

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose } = $props<Props>();

  let localIp = $state<string | null>(null);
  let canvasContainer: HTMLDivElement;
  let isLoading = $state(true);

  // When modal opens, fetch the IP and generate the QR code
  $effect(() => {
    if (open && !localIp) {
      loadNetworkInfo();
    }
  });

  async function loadNetworkInfo() {
    isLoading = true;
    try {
      const ip = await invoke<string>('get_network_info');
      localIp = ip;
      
      // Give the DOM a tick to mount the canvas container if it wasn't there
      setTimeout(() => {
        if (canvasContainer && localIp) {
          const port = 14201;
          // In a real app, you'd generate a secure token here.
          const token = 'dev-token-123'; 
          const connectUrl = `binimoy://connect?ip=${localIp}&port=${port}&token=${token}`;
          
          qrService.renderQRToDOM(canvasContainer, connectUrl, {
            ...DEFAULT_QR_OPTIONS,
            darkColor: '#2563eb', // Make the pairing QR distinctly blue
            dotStyle: 'rounded'
          });
          isLoading = false;
        }
      }, 50);
    } catch (e) {
      console.error('Failed to get local IP', e);
      isLoading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (open && e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface-0/80 backdrop-blur-sm p-4"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
  >
    <div class="absolute inset-0" onclick={onClose} role="button" tabindex="-1" aria-label="Close modal"></div>

    <div
      class="relative z-10 w-full max-w-sm bg-surface-1 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      in:scale={{ duration: 250, start: 0.95, opacity: 0 }}
      out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
    >
      <div class="p-6 pb-2 text-center">
        <h2 class="text-xl font-bold text-text-base">Pair Mobile Device</h2>
        <p class="text-sm text-text-muted mt-2">
          Scan this code with the Binimoy mobile app to connect to your desktop database.
        </p>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center p-6 min-h-[250px]">
        {#if isLoading}
          <div class="w-8 h-8 rounded-full border-2 border-text-muted/30 border-t-text-base animate-spin"></div>
        {:else if localIp}
          <div class="bg-surface-0 p-3 rounded-xl shadow-inner mb-4" bind:this={canvasContainer}></div>
          <div class="bg-surface-2 border border-border px-3 py-1.5 rounded-lg text-xs font-mono text-text-muted">
            {localIp}:14201
          </div>
        {:else}
          <p class="text-error text-sm">Could not detect local network.</p>
        {/if}
      </div>

      <div class="p-4 bg-surface-2 border-t border-border">
        <button
          class="w-full py-2.5 bg-surface-0 hover:bg-surface-1 text-text-base border border-border rounded-xl font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
          onclick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

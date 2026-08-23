<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Toast from '$lib/components/shared/Toast.svelte';
  import ConfirmDialog from '$lib/components/shared/ConfirmDialog.svelte';
  
  import InputPanel from '$lib/components/generator/InputPanel.svelte';
  import QRPreview from '$lib/components/generator/QRPreview.svelte';
  import OptionsDrawer from '$lib/components/generator/OptionsDrawer.svelte';
  
  import HistoryPanel from '$lib/components/history/HistoryPanel.svelte';
  import PairingModal from '$lib/components/shared/PairingModal.svelte';
  import { ui } from '$lib/state/ui.svelte';
  import { history } from '$lib/state/history.svelte';
  import { toaster } from '$lib/state/toast.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { listen } from '@tauri-apps/api/event';
  import { readText } from '@tauri-apps/plugin-clipboard-manager';
  import { getInputType } from '$lib/utils/validate';
  import { DEFAULT_QR_OPTIONS, type QREntry } from '$lib/types';

  let unlistenQuickGenerate: () => void;

  onMount(async () => {
    unlistenQuickGenerate = await listen('quick-generate', async () => {
      try {
        const text = await readText();
        if (!text) {
          toaster.info('Clipboard is empty');
          return;
        }

        const inputType = getInputType(text);
        if (inputType === 'empty' || inputType === 'too-long') {
          toaster.error('Clipboard content is invalid for QR code');
          return;
        }

        const entry: QREntry = {
          id: crypto.randomUUID(),
          url: text.trim(),
          createdAt: Date.now(),
          pinned: false,
          options: { ...DEFAULT_QR_OPTIONS }
        };

        await history.add(entry);
        ui.selectedId = entry.id;
        toaster.success('Generated from clipboard');
      } catch (e) {
        toaster.error('Failed to read clipboard');
      }
    });
  });

  onDestroy(() => {
    if (unlistenQuickGenerate) unlistenQuickGenerate();
  });

  function handleKeydown(e: KeyboardEvent) {
    // Global Ctrl+F / Cmd+F to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      const searchInput = document.querySelector('input[placeholder="Search links and labels..."]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Toast />
<PairingModal open={ui.pairingOpen} onClose={() => ui.pairingOpen = false} />

<!-- We'll mount ConfirmDialog globally or in the history panel later when deleting -->

<AppShell>
  {#snippet leftPanel()}
    <div class="mb-2">
      <h1 class="text-xl font-semibold text-text-base tracking-tight">Binimoy</h1>
      <p class="text-xs text-text-muted mt-0.5">Cross-platform QR Generator</p>
    </div>

    <InputPanel />
    <QRPreview />
    <OptionsDrawer />
  {/snippet}

  {#snippet rightPanel()}
    <HistoryPanel />
  {/snippet}
</AppShell>

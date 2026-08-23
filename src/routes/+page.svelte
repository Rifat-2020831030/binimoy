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

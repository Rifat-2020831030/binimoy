<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Toast from '$lib/components/shared/Toast.svelte';
  import ConfirmDialog from '$lib/components/shared/ConfirmDialog.svelte';
  
  import InputPanel from '$lib/components/generator/InputPanel.svelte';
  import QRPreview from '$lib/components/generator/QRPreview.svelte';
  import OptionsDrawer from '$lib/components/generator/OptionsDrawer.svelte';
  
  import HistoryPanel from '$lib/components/history/HistoryPanel.svelte';
</script>

<Toast />

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

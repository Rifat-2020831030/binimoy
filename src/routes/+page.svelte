<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Toast from '$lib/components/shared/Toast.svelte';
  import ConfirmDialog from '$lib/components/shared/ConfirmDialog.svelte';
  
  import InputPanel from '$lib/components/generator/InputPanel.svelte';
  import QRPreview from '$lib/components/generator/QRPreview.svelte';
  import OptionsDrawer from '$lib/components/generator/OptionsDrawer.svelte';

  // We'll add the HistoryPanel components in Step 6
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
    <div class="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted">
      <div class="text-4xl mb-4 opacity-20">📋</div>
      <h2 class="text-base font-medium mb-1">History Panel</h2>
      <p class="text-sm">Coming in Step 6 (Search, Sort, and list of all your generated codes).</p>
    </div>
  {/snippet}
</AppShell>

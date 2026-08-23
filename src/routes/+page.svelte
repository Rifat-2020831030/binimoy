<script lang="ts">
  // Binimoy — main page (SPA, single route)
  // Components will be added in subsequent steps
</script>

<div class="flex h-screen w-screen bg-surface-0">
  <!-- LEFT PANEL — Generator -->
  <aside class="flex w-[400px] shrink-0 flex-col border-r border-border bg-surface-0 p-6 overflow-y-auto">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-text-base tracking-tight">Binimoy</h1>
      <p class="text-xs text-text-faint mt-0.5">QR Code Generator</p>
    </div>

    <!-- InputPanel, QRPreview, OptionsDrawer will go here -->
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center text-text-faint">
        <div class="text-4xl mb-3 opacity-30">⬚</div>
        <p class="text-sm">Generator panel</p>
        <p class="text-xs mt-1">Coming in Step 5</p>
      </div>
    </div>
  </aside>

  <!-- RIGHT PANEL — History -->
  <main class="flex flex-1 flex-col bg-surface-0 overflow-hidden">
    <!-- SearchBar, Toolbar, HistoryItem list will go here -->
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center text-text-faint">
        <div class="text-4xl mb-3 opacity-30">📋</div>
        <p class="text-sm">History panel</p>
        <p class="text-xs mt-1">Coming in Step 6</p>
      </div>
    </div>
  </main>
</div>

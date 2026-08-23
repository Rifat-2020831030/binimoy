<script lang="ts">
  /**
   * AppShell
   *
   * The main two-column layout wrapper for the application.
   * Handles the fixed left panel for the generator and the
   * flexible right panel for the history.
   */
  
  let { leftPanel, rightPanel } = $props();
</script>

<div class="flex h-screen w-screen bg-surface-0 overflow-hidden text-text-base">
  <!-- Left Panel: Fixed width, scrollable, houses generator -->
  <aside class="flex w-[400px] shrink-0 flex-col border-r border-border bg-surface-1 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10 relative">
    <div class="flex flex-col flex-1 p-5 gap-5">
      {@render leftPanel()}
    </div>
  </aside>

  <!-- Right Panel: Flexible width, houses history list -->
  <main class="flex flex-1 flex-col bg-surface-0 overflow-hidden relative">
    {@render rightPanel()}
  </main>
</div>

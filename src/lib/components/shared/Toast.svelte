<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { toaster } from '$lib/state/toast.svelte';
  
  // Icon mapping based on toast type
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  // Color mapping based on toast type
  const colors = {
    success: 'border-success text-success bg-success/10',
    error: 'border-error text-error bg-error/10',
    info: 'border-border text-text-base bg-surface-2'
  };
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
  {#each toaster.toasts as toast (toast.id)}
    <div
      in:fly={{ y: 20, duration: 300 }}
      out:fade={{ duration: 200 }}
      class="pointer-events-auto flex items-center gap-3 rounded-lg border shadow-lg backdrop-blur-md px-4 py-3 min-w-[280px] max-w-[400px] {colors[toast.type]}"
      role="alert"
    >
      <div class="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-current/20 text-current text-xs font-bold">
        {icons[toast.type]}
      </div>
      <p class="text-sm font-medium flex-1 m-0">{toast.message}</p>
      <button 
        class="shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1 -mr-2"
        onclick={() => toaster.dismiss(toast.id)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  {/each}
</div>

<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  
  /**
   * ConfirmDialog
   *
   * A reusable modal dialog for confirming destructive actions.
   */

  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let {
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
    onConfirm,
    onCancel
  } = $props<Props>();

  // Prevent background scrolling when open (if this wasn't a full-screen app)
  // Also handle escape key
  function handleKeydown(e: KeyboardEvent) {
    if (open && e.key === 'Escape') {
      onCancel();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface-0/80 backdrop-blur-sm p-4"
    in:fade={{ duration: 150 }}
    out:fade={{ duration: 150 }}
  >
    <!-- Click outside to cancel -->
    <div 
      class="absolute inset-0" 
      onclick={onCancel} 
      role="button" 
      tabindex="-1" 
      aria-label="Close dialog"
    ></div>

    <!-- Dialog Box -->
    <div
      class="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-surface-1 border border-border shadow-2xl"
      in:scale={{ duration: 150, start: 0.95 }}
      out:scale={{ duration: 150, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div class="p-6">
        <h2 id="dialog-title" class="text-lg font-semibold text-text-base mb-2">
          {title}
        </h2>
        <p class="text-sm text-text-muted m-0">
          {message}
        </p>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-end gap-3 bg-surface-2/50 px-6 py-4 border-t border-border/50">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium text-text-base hover:bg-surface-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
          onclick={onCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/50
            {isDestructive ? 'bg-error hover:bg-error/90' : 'bg-success hover:bg-success/90'}"
          onclick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

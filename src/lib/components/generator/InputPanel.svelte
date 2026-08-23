<script lang="ts">
  import { getInputType, isValidURL } from '$lib/utils/validate';
  import { history } from '$lib/state/history.svelte';
  import { ui } from '$lib/state/ui.svelte';
  import { DEFAULT_QR_OPTIONS, type QREntry } from '$lib/types';
  import { toaster } from '$lib/state/toast.svelte';

  /**
   * InputPanel
   *
   * Textarea for entering URLs/text, live validation, and
   * the "Generate" button. 
   */

  let inputData = $state('');
  let customLabel = $state('');
  let showLabelInput = $state(false);

  // Derived validation state
  let inputType = $derived(getInputType(inputData));
  let isValid = $derived(inputType === 'url' || inputType === 'text');
  let isTooLong = $derived(inputType === 'too-long');

  // Status indicators mapping
  const statusConfig = {
    'empty': { color: 'bg-transparent', text: '' },
    'url': { color: 'bg-success', text: 'Valid URL' },
    'text': { color: 'bg-warning', text: 'Plain text' },
    'too-long': { color: 'bg-error', text: 'Input too long' }
  };

  async function handleGenerate() {
    if (!isValid) return;

    try {
      const entry: QREntry = {
        id: crypto.randomUUID(),
        url: inputData.trim(),
        label: customLabel.trim() || undefined,
        createdAt: Date.now(),
        pinned: false,
        options: { ...DEFAULT_QR_OPTIONS }
      };

      await history.add(entry);
      
      // Automatically select the newly created entry
      ui.selectedId = entry.id;
      
      // Clear inputs for next time
      inputData = '';
      customLabel = '';
      showLabelInput = false;

    } catch (e) {
      toaster.error('Failed to save QR code');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div class="relative flex flex-col gap-2">
    <!-- Main Textarea -->
    <textarea
      bind:value={inputData}
      onkeydown={handleKeydown}
      placeholder="🔗 Enter URL or text"
      class="w-full resize-none rounded-xl bg-surface-2 border {isTooLong ? 'border-error focus:ring-error/30' : 'border-border focus:border-text-muted focus:ring-text-muted/30'} text-text-base px-4 py-3 text-sm focus:ring-1 outline-none transition-all min-h-[80px]"
      rows="3"
      spellcheck="false"
    ></textarea>

    <!-- Validation Status -->
    {#if inputType !== 'empty'}
      <div class="absolute right-3 top-3 flex items-center gap-1.5 bg-surface-2/90 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
        <span class="w-1.5 h-1.5 rounded-full {statusConfig[inputType].color}"></span>
        {statusConfig[inputType].text}
      </div>
    {/if}

    <!-- Error message -->
    {#if isTooLong}
      <p class="text-error text-xs ml-1">Maximum length is 2953 characters.</p>
    {/if}

    <!-- Optional Label -->
    {#if showLabelInput}
      <input
        type="text"
        bind:value={customLabel}
        placeholder="Custom display label (optional)"
        class="w-full rounded-lg bg-surface-2 border border-border text-text-base px-3 py-2 text-sm focus:border-text-muted focus:ring-1 focus:ring-text-muted/30 outline-none transition-all"
        onkeydown={(e) => e.key === 'Enter' && handleGenerate()}
      />
    {:else}
      <button 
        type="button" 
        class="text-xs text-text-muted hover:text-text-base underline underline-offset-2 text-left self-start ml-1 transition-colors outline-none"
        onclick={() => showLabelInput = true}
      >
        Add a label
      </button>
    {/if}
  </div>

  <button
    type="button"
    disabled={!isValid}
    class="bg-text-base hover:bg-white text-surface-0 rounded-xl px-5 py-3 font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-text-base/50"
    onclick={handleGenerate}
  >
    Generate QR Code
  </button>
</div>

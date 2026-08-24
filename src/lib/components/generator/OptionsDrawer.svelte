<script lang="ts">
  import { slide } from 'svelte/transition';
  import { history } from '$lib/state/history.svelte';
  import { ui } from '$lib/state/ui.svelte';
  import { toaster } from '$lib/state/toast.svelte';
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import ColorPicker from '../shared/ColorPicker.svelte';
  import type { QROptions } from '$lib/types';
  import * as api from '$lib/services/api.service';

  /**
   * OptionsDrawer
   *
   * An accordion-style panel to customize the selected QR code's styling.
   * Auto-saves changes to the database on modification.
   */

  // Options configuration for SegmentedControls
  const errorOptions = [
    { value: 'L', label: 'Low' },
    { value: 'M', label: 'Med' },
    { value: 'Q', label: 'High' },
    { value: 'H', label: 'Max' }
  ];

  const dotOptions = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'dots', label: 'Dots' },
    { value: 'classy', label: 'Classy' }
  ];

  const cornerOptions = [
    { value: 'square', label: 'Square' },
    { value: 'extra-rounded', label: 'Rounded' },
    { value: 'dot', label: 'Dot' }
  ];

  let selectedEntry = $derived(history.entries.find(e => e.id === ui.selectedId));
  let currentOptions = $derived(selectedEntry ? selectedEntry.options : ui.globalOptions);

  // Update a specific option field and persist it immediately if an entry is selected
  async function updateOption<K extends keyof QROptions>(key: K, value: QROptions[K]) {
    if (selectedEntry) {
      selectedEntry.options[key] = value;
      try {
        // SQLite backend uses INSERT OR REPLACE so this acts as an upsert
        await api.addEntry(selectedEntry);
      } catch (e) {
        console.error('Failed to save options', e);
      }
    } else {
      // Update global defaults for the next generated QR code
      ui.globalOptions[key] = value;
    }
  }
</script>

<div class="border border-border rounded-xl bg-surface-1 overflow-hidden">
  <!-- Header / Toggle -->
  <button
    class="w-full flex items-center justify-between p-4 bg-surface-1 hover:bg-surface-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-muted"
    onclick={() => ui.optionsOpen = !ui.optionsOpen}
    aria-expanded={ui.optionsOpen}
  >
    <div class="flex items-center gap-2">
      <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      <span class="font-semibold text-sm text-text-base">Customization</span>
    </div>
    
    <svg 
      class="w-4 h-4 text-text-muted transition-transform duration-300 {ui.optionsOpen ? 'rotate-180' : ''}" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <!-- Drawer Body -->
  {#if ui.optionsOpen}
    <div transition:slide={{ duration: 200 }} class="border-t border-border bg-surface-0">
        <div class="p-4 flex flex-col gap-5">
          <!-- Colors -->
          <div class="grid grid-cols-2 gap-4">
            <ColorPicker
              id="color-dark"
              label="Foreground Color"
              value={currentOptions.darkColor}
              onChange={(v) => updateOption('darkColor', v)}
            />
            <ColorPicker
              id="color-light"
              label="Background Color"
              value={currentOptions.lightColor}
              onChange={(v) => updateOption('lightColor', v)}
            />
          </div>

          <!-- Shapes -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-text-muted">Dot Style</label>
            <SegmentedControl 
              options={dotOptions} 
              selected={currentOptions.dotStyle} 
              onChange={(v) => updateOption('dotStyle', v)} 
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-text-muted">Corner Style</label>
            <SegmentedControl 
              options={cornerOptions} 
              selected={currentOptions.cornersStyle} 
              onChange={(v) => updateOption('cornersStyle', v)} 
            />
          </div>

          <!-- Technical -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-medium text-text-muted">Error Correction</label>
              <SegmentedControl 
                options={errorOptions} 
                selected={currentOptions.errorCorrectionLevel} 
                onChange={(v) => updateOption('errorCorrectionLevel', v)} 
                size="sm"
              />
            </div>
            
            <div class="flex flex-col gap-1.5">
              <label for="margin-range" class="flex justify-between text-xs font-medium text-text-muted">
                <span>Padding</span>
                <span>{currentOptions.margin}px</span>
              </label>
              <input 
                id="margin-range"
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={currentOptions.margin}
                oninput={(e) => updateOption('margin', parseInt((e.target as HTMLInputElement).value))}
                class="w-full accent-text-base h-1.5 bg-surface-2 rounded-lg appearance-none cursor-pointer mt-2" 
              />
            </div>
          </div>
        </div>
    </div>
  {/if}
</div>

<script lang="ts" generics="T extends string">
  /**
   * SegmentedControl
   *
   * A reusable segmented button group for selecting between multiple options.
   * Uses generics to maintain type safety for the selected value.
   */

  export interface SegmentOption<V> {
    value: V;
    label: string;
  }

  interface Props {
    options: SegmentOption<T>[];
    selected: T;
    onChange: (value: T) => void;
    size?: 'sm' | 'md';
  }

  let { options, selected, onChange, size = 'md' } = $props<Props>();
</script>

<div class="flex rounded-lg overflow-hidden border border-border bg-surface-2 p-0.5" role="group">
  {#each options as option}
    {@const isSelected = selected === option.value}
    <button
      type="button"
      class="flex-1 flex items-center justify-center transition-all duration-200
        {size === 'sm' ? 'py-1 text-xs' : 'py-1.5 text-sm'}
        {isSelected 
          ? 'bg-surface-0 text-text-base font-medium shadow-sm rounded-md' 
          : 'bg-transparent text-text-muted hover:text-text-base hover:bg-surface-3/50'}"
      onclick={() => onChange(option.value)}
      aria-pressed={isSelected}
    >
      {option.label}
    </button>
  {/each}
</div>

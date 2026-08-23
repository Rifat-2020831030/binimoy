<script lang="ts">
  /**
   * ColorPicker
   *
   * A custom color picker input that combines a native color input
   * (styled as a swatch) with a text input for the hex code.
   */

  interface Props {
    id: string;
    label: string;
    value: string;
    onChange: (color: string) => void;
  }

  let { id, label, value, onChange } = $props<Props>();

  // Ensure value starts with #
  let hexValue = $derived(value.startsWith('#') ? value : `#${value}`);

  function handleTextInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let val = input.value;
    
    // Add # if missing and it's a valid hex length
    if (!val.startsWith('#') && (val.length === 3 || val.length === 6)) {
      val = `#${val}`;
    }
    
    // Only trigger onChange if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
      onChange(val);
    }
  }
</script>

<div class="flex flex-col gap-1.5">
  <label for={id} class="text-xs font-medium text-text-muted">{label}</label>
  <div class="flex items-center gap-2 bg-surface-1 border border-border rounded-lg p-1 focus-within:border-text-muted focus-within:ring-1 focus-within:ring-text-muted/30 transition-all">
    <!-- Swatch wrapper -->
    <div 
      class="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border-subtle shadow-inner cursor-pointer"
      style:background-color={hexValue}
    >
      <input
        {id}
        type="color"
        value={hexValue}
        oninput={(e) => onChange((e.target as HTMLInputElement).value)}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
    
    <!-- Text input -->
    <input
      type="text"
      value={value}
      oninput={handleTextInput}
      onblur={() => {
        // Enforce formatting on blur
        if (value !== hexValue) onChange(hexValue);
      }}
      class="flex-1 w-full bg-transparent text-sm text-text-base border-none outline-none font-mono uppercase px-1"
      placeholder="#FFFFFF"
      maxlength="7"
      spellcheck="false"
    />
  </div>
</div>

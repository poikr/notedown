<script lang="ts">
  import { notedownToHtml, getNotedownStyles, type RenderOptions } from "@notedown/renderer";

  let { source, className = "", theme = "light" }: { source: string; className?: string; theme?: "light" | "dark" | "auto" } = $props();

  let html = $derived(notedownToHtml(source, { theme }));

  let styleElement: HTMLStyleElement | null = null;
  $effect(() => {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "notedown-styles";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = getNotedownStyles(theme);
  });
</script>

<div class={className}>
  {@html html}
</div>

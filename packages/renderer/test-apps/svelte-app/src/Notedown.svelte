<script lang="ts">
  import { notedownToHtml, getNotedownStyles } from "@notedown/renderer";

  let { source, className = "" }: { source: string; className?: string } = $props();

  let html = $derived(notedownToHtml(source));

  let stylesInjected = false;
  $effect(() => {
    if (stylesInjected) return;
    stylesInjected = true;
    const style = document.createElement("style");
    style.textContent = getNotedownStyles();
    document.head.appendChild(style);
  });
</script>

<div class={className}>
  {@html html}
</div>

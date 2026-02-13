import type { ColorNode, InlineNode } from "@notedown/parser";
import { escapeHtmlAttr } from "../sanitize";
import { resolveThemedColor, type ThemeSetting } from "../theme-utils";

export function renderColor(
  node: ColorNode,
  renderChildren: (nodes: InlineNode[]) => string,
  theme: ThemeSetting = "light",
): string {
  const fg = resolveThemedColor(node.foreground, node.foregroundDark, theme);
  const bg = resolveThemedColor(node.background, node.backgroundDark, theme);

  // Auto theme with CSS custom properties
  if (fg.mode === "auto" || bg.mode === "auto") {
    const styles: string[] = [];

    if (fg.lightValue || fg.darkValue) {
      styles.push(`--nd-color-light:${escapeHtmlAttr(fg.lightValue!)}`);
      styles.push(`--nd-color-dark:${escapeHtmlAttr(fg.darkValue!)}`);
      styles.push(`color:var(--nd-color-light)`);
    }

    if (bg.lightValue || bg.darkValue) {
      styles.push(`--nd-bg-light:${escapeHtmlAttr(bg.lightValue!)}`);
      styles.push(`--nd-bg-dark:${escapeHtmlAttr(bg.darkValue!)}`);
      styles.push(`background-color:var(--nd-bg-light)`);
    }

    return `<span class="nd-color nd-color-auto" style="${styles.join(";")}">${renderChildren(node.children)}</span>`;
  }

  // Static theme
  const styles: string[] = [];
  if (fg.value) styles.push(`color:${escapeHtmlAttr(fg.value)}`);
  if (bg.value) styles.push(`background-color:${escapeHtmlAttr(bg.value)}`);

  return `<span class="nd-color" style="${styles.join(";")}">${renderChildren(node.children)}</span>`;
}

import type { ColorNode, InlineNode } from "@notedown/parser";

export function renderColor(
  node: ColorNode,
  renderChildren: (nodes: InlineNode[]) => string,
  theme: "light" | "dark" | "auto" = "light",
): string {
  // For auto theme with both light and dark colors, use CSS custom properties
  if (theme === "auto" && (node.foreground && node.foregroundDark || node.background && node.backgroundDark)) {
    const styles: string[] = [];

    if (node.foreground || node.foregroundDark) {
      const lightFg = node.foreground || node.foregroundDark;
      const darkFg = node.foregroundDark || node.foreground;
      styles.push(`--nd-color-light:${lightFg}`);
      styles.push(`--nd-color-dark:${darkFg}`);
      styles.push(`color:var(--nd-color-light)`);
    }

    if (node.background || node.backgroundDark) {
      const lightBg = node.background || node.backgroundDark;
      const darkBg = node.backgroundDark || node.background;
      styles.push(`--nd-bg-light:${lightBg}`);
      styles.push(`--nd-bg-dark:${darkBg}`);
      styles.push(`background-color:var(--nd-bg-light)`);
    }

    return `<span class="nd-color nd-color-auto" style="${styles.join(";")}">${renderChildren(node.children)}</span>`;
  }

  // For light/dark theme or when only one color is specified
  let foreground: string | null = null;
  let background: string | null = null;

  // If both light and dark colors are specified, choose based on theme
  if (node.foreground && node.foregroundDark) {
    foreground = theme === "dark" ? node.foregroundDark : node.foreground;
  } else {
    // If only one is specified, use it for all themes
    foreground = node.foreground || node.foregroundDark;
  }

  if (node.background && node.backgroundDark) {
    background = theme === "dark" ? node.backgroundDark : node.background;
  } else {
    background = node.background || node.backgroundDark;
  }

  const styles: string[] = [];
  if (foreground) styles.push(`color:${foreground}`);
  if (background) styles.push(`background-color:${background}`);

  return `<span class="nd-color" style="${styles.join(";")}">${renderChildren(node.children)}</span>`;
}

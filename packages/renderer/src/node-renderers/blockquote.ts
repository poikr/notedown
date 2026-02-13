import type { BlockquoteNode, BlockNode, InlineNode } from "@notedown/parser";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

const ICON_MAP: Record<string, string> = {
  question: "help",
};

export function renderBlockquote(
  node: BlockquoteNode,
  renderBlock: (node: BlockNode) => string,
  renderChildren: (nodes: InlineNode[]) => string,
  theme: "light" | "dark" | "auto" = "light",
): string {
  const materialIcon = node.icon ? (ICON_MAP[node.icon] ?? node.icon) : null;

  // Determine which color to use based on theme
  let customColor: string | null = null;
  if (node.color && node.colorDark) {
    if (theme === "auto") {
      // For auto theme, we'll use CSS custom properties
      customColor = null; // Will be handled separately
    } else {
      customColor = theme === "dark" ? node.colorDark : node.color;
    }
  } else {
    // If only one is specified, use it for all themes
    customColor = node.color || node.colorDark;
  }

  // Build icon HTML
  let headerHtml = "";
  if (materialIcon) {
    const iconStyle = customColor ? ` style="color:${escapeHtmlAttr(customColor)}"` : "";
    headerHtml += `<span class="material-icons nd-blockquote-icon"${iconStyle}>${materialIcon}</span>`;
  }

  // Build title HTML (only when t# is explicitly specified)
  if (node.title) {
    const titleStyle = customColor ? ` style="color:${escapeHtmlAttr(customColor)}"` : "";
    headerHtml += `<span class="nd-blockquote-title"${titleStyle}>${escapeHtml(node.title)}</span>`;
  }

  const content = node.children.map(child => {
    if (child.type === "blockquote") {
      return renderBlockquote(child as BlockquoteNode, renderBlock, renderChildren, theme);
    }
    return renderBlock(child as BlockNode);
  }).join("\n");

  // Build class: use CSS theme class only when no custom color
  const hasCustomColor = node.color || node.colorDark;
  const cls = node.icon && !hasCustomColor
    ? `nd-blockquote nd-blockquote-${node.icon}`
    : "nd-blockquote";

  // Build inline style for custom color
  let inlineStyle = "";
  if (theme === "auto" && node.color && node.colorDark) {
    // For auto theme with both colors, use CSS custom properties
    const lightColor = node.color;
    const darkColor = node.colorDark;
    const lightMix = `color-mix(in srgb, ${lightColor} 10%, white)`;
    const darkMix = `color-mix(in srgb, ${darkColor} 10%, #1e1e1e)`;

    inlineStyle = ` class="${cls} nd-blockquote-auto" style="--nd-bq-border-light:${escapeHtmlAttr(lightColor)};--nd-bq-border-dark:${escapeHtmlAttr(darkColor)};--nd-bq-bg-light:${escapeHtmlAttr(lightMix)};--nd-bq-bg-dark:${escapeHtmlAttr(darkMix)};border-left-color:var(--nd-bq-border-light);background-color:var(--nd-bq-bg-light)"`;

    // Update icon and title styles for auto theme
    if (materialIcon) {
      headerHtml = headerHtml.replace(
        '<span class="material-icons nd-blockquote-icon"',
        `<span class="material-icons nd-blockquote-icon nd-blockquote-icon-auto" style="--nd-icon-light:${escapeHtmlAttr(node.color)};--nd-icon-dark:${escapeHtmlAttr(node.colorDark)};color:var(--nd-icon-light)"`
      );
    }
    if (node.title) {
      headerHtml = headerHtml.replace(
        '<span class="nd-blockquote-title"',
        `<span class="nd-blockquote-title nd-blockquote-title-auto" style="--nd-title-light:${escapeHtmlAttr(node.color)};--nd-title-dark:${escapeHtmlAttr(node.colorDark)};color:var(--nd-title-light)"`
      );
    }

    return `<blockquote${inlineStyle}>${headerHtml}${content}</blockquote>`;
  } else if (customColor) {
    const mixBase = theme === "dark" ? "#1e1e1e" : "white";
    inlineStyle = ` style="border-left-color:${escapeHtmlAttr(customColor)};background-color:color-mix(in srgb, ${escapeHtmlAttr(customColor)} 10%, ${mixBase})"`;
  }

  return `<blockquote class="${cls}"${inlineStyle}>${headerHtml}${content}</blockquote>`;
}

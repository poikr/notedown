import type { BlockquoteNode, BlockNode, InlineNode } from "@notedown/parser";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

const ICON_MAP: Record<string, string> = {
  question: "help",
};

export function renderBlockquote(
  node: BlockquoteNode,
  renderBlock: (node: BlockNode) => string,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const materialIcon = node.icon ? (ICON_MAP[node.icon] ?? node.icon) : null;
  const customColor = node.color;

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
      return renderBlockquote(child as BlockquoteNode, renderBlock, renderChildren);
    }
    return renderBlock(child as BlockNode);
  }).join("\n");

  // Build class: use CSS theme class only when no custom color
  const cls = node.icon && !customColor
    ? `nd-blockquote nd-blockquote-${node.icon}`
    : "nd-blockquote";

  // Build inline style for custom color
  const inlineStyle = customColor
    ? ` style="border-left-color:${escapeHtmlAttr(customColor)};background-color:color-mix(in srgb, ${escapeHtmlAttr(customColor)} 10%, white)"`
    : "";

  return `<blockquote class="${cls}"${inlineStyle}>${headerHtml}${content}</blockquote>`;
}

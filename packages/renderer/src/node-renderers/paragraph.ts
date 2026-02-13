import type { ParagraphNode, InlineNode } from "@notedown/parser";

export function renderParagraph(
  node: ParagraphNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  return `<p class="nd-p">${renderChildren(node.children)}</p>`;
}

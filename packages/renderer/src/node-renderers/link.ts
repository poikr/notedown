import type { LinkNode, InlineNode } from "@notedown/parser";
import { escapeHtmlAttr } from "../sanitize";

export function renderLink(
  node: LinkNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  return `<a href="${escapeHtmlAttr(node.url)}">${renderChildren(node.children)}</a>`;
}

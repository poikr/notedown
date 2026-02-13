import type { HeadingNode, InlineNode } from "@notedown/parser";

export function renderHeading(
  node: HeadingNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const tag = `h${node.level}`;
  return `<${tag} class="nd-h${node.level}">${renderChildren(node.children)}</${tag}>`;
}

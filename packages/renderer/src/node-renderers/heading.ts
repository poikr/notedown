import type { HeadingNode, InlineNode } from "@notedown/parser";

export function renderHeading(
  node: HeadingNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const tag = `h${node.level}`;
  return `<${tag}>${renderChildren(node.children)}</${tag}>`;
}

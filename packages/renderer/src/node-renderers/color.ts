import type { ColorNode, InlineNode } from "@notedown/parser";

export function renderColor(
  node: ColorNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const styles: string[] = [];
  if (node.foreground) styles.push(`color:${node.foreground}`);
  if (node.background) styles.push(`background-color:${node.background}`);
  return `<span style="${styles.join(";")}">${renderChildren(node.children)}</span>`;
}

import type { CollapseNode, BlockNode, InlineNode } from "@notedown/parser";

export function renderCollapse(
  node: CollapseNode,
  renderBlock: (node: BlockNode) => string,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const summaryContent = node.title
    ? renderChildren(node.title)
    : "";
  const summary = `<summary class="nd-summary">${summaryContent}</summary>`;

  const content = node.children.map(renderBlock).join("\n");

  return `<details class="nd-details">\n${summary}\n${content}\n</details>`;
}

import type { ListNode, ListItemNode, InlineNode } from "@notedown/parser";

export function renderList(
  node: ListNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const tag = node.ordered ? "ol" : "ul";
  const cls = node.ordered ? "nd-ol" : "nd-ul";
  const startAttr =
    node.ordered && node.startNumber !== 1
      ? ` start="${node.startNumber}"`
      : "";

  const items = node.items
    .map((item) => renderListItem(item, renderChildren))
    .join("\n");

  return `<${tag} class="${cls}"${startAttr}>\n${items}\n</${tag}>`;
}

function renderListItem(
  item: ListItemNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  let content = renderChildren(item.children);

  if (item.sublists.length > 0) {
    const sublistHtml = item.sublists
      .map((sl) => renderList(sl, renderChildren))
      .join("\n");
    content += "\n" + sublistHtml;
  }

  return `<li class="nd-li">${content}</li>`;
}

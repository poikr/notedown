import type { TableNode, InlineNode } from "@notedown/parser";

export function renderTable(
  node: TableNode,
  renderChildren: (nodes: InlineNode[]) => string,
): string {
  const headerCells = node.headers.map((cell, i) => {
    const align = node.alignments[i];
    const style = align !== "left" ? ` style="text-align:${align}"` : "";
    return `<th${style}>${renderChildren(cell.children)}</th>`;
  }).join("");

  const bodyRows = node.rows.map(row => {
    const cells = row.map((cell, i) => {
      const align = node.alignments[i];
      const style = align !== "left" ? ` style="text-align:${align}"` : "";
      return `<td${style}>${renderChildren(cell.children)}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("\n");

  return [
    '<table class="nd-table">',
    "<thead>",
    `<tr>${headerCells}</tr>`,
    "</thead>",
    "<tbody>",
    bodyRows,
    "</tbody>",
    "</table>",
  ].join("\n");
}

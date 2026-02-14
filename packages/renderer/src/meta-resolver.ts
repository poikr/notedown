import type { NotedownDocument, BlockNode, InlineNode } from "@notedown/parser";

export function resolveMetaRefs(doc: NotedownDocument): NotedownDocument {
  return {
    metadata: doc.metadata,
    content: doc.content.map(node => resolveBlockNode(node, doc.metadata)),
  };
}

function resolveBlockNode(node: BlockNode, meta: Record<string, string>): BlockNode {
  switch (node.type) {
    case "heading":
      return { ...node, children: resolveInlineNodes(node.children, meta) };
    case "paragraph":
      return { ...node, children: resolveInlineNodes(node.children, meta) };
    case "table":
      return {
        ...node,
        headers: node.headers.map(cell => ({
          ...cell,
          children: resolveInlineNodes(cell.children, meta),
        })),
        rows: node.rows.map(row =>
          row.map(cell => ({
            ...cell,
            children: resolveInlineNodes(cell.children, meta),
          }))
        ),
      };
    case "blockquote":
      return {
        ...node,
        children: node.children.map(child =>
          resolveBlockNode(child as BlockNode, meta)
        ),
      };
    case "collapse":
      return {
        ...node,
        title: node.title ? resolveInlineNodes(node.title, meta) : null,
        children: node.children.map(child => resolveBlockNode(child, meta)),
      };
    case "list":
      return {
        ...node,
        items: node.items.map(item => ({
          ...item,
          children: resolveInlineNodes(item.children, meta),
          sublists: item.sublists.map(sl => resolveBlockNode(sl, meta) as typeof sl),
        })),
      };
    case "codeBlock":
    case "error":
      return node;
  }
}

function resolveInlineNodes(nodes: InlineNode[], meta: Record<string, string>): InlineNode[] {
  return nodes.map(node => resolveInlineNode(node, meta));
}

function resolveInlineNode(node: InlineNode, meta: Record<string, string>): InlineNode {
  switch (node.type) {
    case "metaRef":
      return {
        type: "text",
        value: meta[node.key] ?? `@{${node.key}}`,
      };
    case "bold":
    case "italic":
    case "boldItalic":
    case "underline":
    case "strikethrough":
      return { ...node, children: resolveInlineNodes(node.children, meta) };
    case "color":
      return { ...node, children: resolveInlineNodes(node.children, meta) };
    case "link":
      return { ...node, children: resolveInlineNodes(node.children, meta) };
    default:
      return node;
  }
}

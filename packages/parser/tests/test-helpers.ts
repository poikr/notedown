import type {
  BlockNode,
  HeadingNode,
  ParagraphNode,
  CodeBlockNode,
  TableNode,
  BlockquoteNode,
  CollapseNode,
  ListNode,
  ErrorNode,
} from "../src/types";

export function assertHeading(node: BlockNode): HeadingNode {
  if (node.type !== "heading") throw new Error(`Expected heading, got ${node.type}`);
  return node;
}

export function assertParagraph(node: BlockNode): ParagraphNode {
  if (node.type !== "paragraph") throw new Error(`Expected paragraph, got ${node.type}`);
  return node;
}

export function assertCodeBlock(node: BlockNode): CodeBlockNode {
  if (node.type !== "codeBlock") throw new Error(`Expected codeBlock, got ${node.type}`);
  return node;
}

export function assertTable(node: BlockNode): TableNode {
  if (node.type !== "table") throw new Error(`Expected table, got ${node.type}`);
  return node;
}

export function assertBlockquote(node: BlockNode): BlockquoteNode {
  if (node.type !== "blockquote") throw new Error(`Expected blockquote, got ${node.type}`);
  return node;
}

export function assertCollapse(node: BlockNode): CollapseNode {
  if (node.type !== "collapse") throw new Error(`Expected collapse, got ${node.type}`);
  return node;
}

export function assertList(node: BlockNode): ListNode {
  if (node.type !== "list") throw new Error(`Expected list, got ${node.type}`);
  return node;
}

export function assertError(node: BlockNode): ErrorNode {
  if (node.type !== "error") throw new Error(`Expected error, got ${node.type}`);
  return node;
}

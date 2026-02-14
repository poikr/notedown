import { parseMeta } from "./meta-parser";
import { parseBlocks } from "./block-parser";
import type { NotedownDocument } from "./types";

export function parse(input: string): NotedownDocument {
  const lines = input.split("\n");

  // Step 1: Extract metadata from document top
  const { metadata, contentStartIndex } = parseMeta(lines);

  // Step 2: Block-level parse on remaining lines
  const remainingLines = lines.slice(contentStartIndex);
  const content = parseBlocks(remainingLines);

  return { metadata, content };
}

// Re-export types for consumers
export type {
  NotedownDocument,
  BlockNode,
  HeadingNode,
  ParagraphNode,
  CodeBlockNode,
  TableNode,
  TableAlignment,
  TableCellNode,
  BlockquoteNode,
  CollapseNode,
  ListNode,
  ListItemNode,
  ErrorNode,
  InlineNode,
  TextNode,
  BoldNode,
  ItalicNode,
  BoldItalicNode,
  UnderlineNode,
  StrikethroughNode,
  ColorNode,
  InlineCodeNode,
  LatexNode,
  LinkNode,
  ImageNode,
  MetaRefNode,
  LineBreakNode,
} from "./types";

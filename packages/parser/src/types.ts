// ===========================================================================
// TOP-LEVEL DOCUMENT
// ===========================================================================

export interface NotedownDocument {
  metadata: Record<string, string>;
  content: BlockNode[];
}

// ===========================================================================
// BLOCK-LEVEL NODES
// ===========================================================================

export type BlockNode =
  | HeadingNode
  | ParagraphNode
  | CodeBlockNode
  | TableNode
  | BlockquoteNode
  | CollapseNode
  | ErrorNode;

export interface HeadingNode {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
  line: number;
}

export interface ParagraphNode {
  type: "paragraph";
  children: InlineNode[];
  line: number;
}

export interface CodeBlockNode {
  type: "codeBlock";
  language: string;
  content: string;
  isIframe: boolean;
  line: number;
}

export interface TableNode {
  type: "table";
  headers: TableCellNode[];
  alignments: TableAlignment[];
  rows: TableCellNode[][];
  line: number;
}

export type TableAlignment = "left" | "center" | "right";

export interface TableCellNode {
  type: "tableCell";
  children: InlineNode[];
}

export interface BlockquoteNode {
  type: "blockquote";
  icon: string | null;
  title: string | null;
  color: string | null;
  colorDark: string | null;
  children: (BlockNode | BlockquoteNode)[];
  line: number;
}

export interface CollapseNode {
  type: "collapse";
  title: InlineNode[] | null;
  children: BlockNode[];
  line: number;
}

export interface ErrorNode {
  type: "error";
  message: string;
  line: number;
  raw: string;
}

// ===========================================================================
// INLINE-LEVEL NODES
// ===========================================================================

export type InlineNode =
  | TextNode
  | BoldNode
  | ItalicNode
  | BoldItalicNode
  | UnderlineNode
  | StrikethroughNode
  | ColorNode
  | InlineCodeNode
  | LatexNode
  | LinkNode
  | ImageNode
  | MetaRefNode
  | LineBreakNode;

export interface TextNode {
  type: "text";
  value: string;
}

export interface BoldNode {
  type: "bold";
  children: InlineNode[];
}

export interface ItalicNode {
  type: "italic";
  children: InlineNode[];
}

export interface BoldItalicNode {
  type: "boldItalic";
  children: InlineNode[];
}

export interface UnderlineNode {
  type: "underline";
  children: InlineNode[];
}

export interface StrikethroughNode {
  type: "strikethrough";
  children: InlineNode[];
}

export interface ColorNode {
  type: "color";
  foreground: string | null;
  background: string | null;
  foregroundDark: string | null;
  backgroundDark: string | null;
  children: InlineNode[];
}

export interface InlineCodeNode {
  type: "inlineCode";
  value: string;
}

export interface LatexNode {
  type: "latex";
  value: string;
}

export interface LinkNode {
  type: "link";
  url: string;
  children: InlineNode[];
}

export interface ImageNode {
  type: "image";
  url: string;
  alt: string;
  width: string | null;
  height: string | null;
  alignment: "left" | "center" | "right" | null;
  link: string | null;
}

export interface MetaRefNode {
  type: "metaRef";
  key: string;
}

export interface LineBreakNode {
  type: "lineBreak";
}

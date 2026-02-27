import type {
  NotedownDocument,
  BlockNode,
  InlineNode,
  TableNode,
} from "./types";

export interface ITextOnlyOptions {
  image?: (alt: string) => string;
  video?: (alt: string) => string;
  table?: (table: string[][]) => string;
}

const defaultOptions: Required<ITextOnlyOptions> = {
  image: (alt) => `[Image ${alt}]`,
  video: (alt) => `[Video ${alt}]`,
  table: () => `[Table]`,
};

export function getTextOnly(
  doc: NotedownDocument,
  options?: ITextOnlyOptions
): string {
  const opts: Required<ITextOnlyOptions> = {
    ...defaultOptions,
    ...options,
  };

  return doc.content.map((block) => blockToText(block, opts)).join("\n");
}

function blockToText(
  block: BlockNode,
  opts: Required<ITextOnlyOptions>
): string {
  switch (block.type) {
    case "heading":
      return inlinesToText(block.children, opts);
    case "paragraph":
      return inlinesToText(block.children, opts);
    case "codeBlock":
      return block.content;
    case "table":
      return tableToText(block, opts);
    case "blockquote":
      return block.children
        .map((child) => blockToText(child, opts))
        .join("\n");
    case "collapse":
      return [
        block.title ? inlinesToText(block.title, opts) : "",
        ...block.children.map((child) => blockToText(child, opts)),
      ]
        .filter(Boolean)
        .join("\n");
    case "list":
      return block.items
        .map((item, i) => {
          const prefix = block.ordered
            ? `${block.startNumber + i}. `
            : "- ";
          const text = inlinesToText(item.children, opts);
          const sublists = item.sublists
            .map((sub) => blockToText(sub, opts))
            .join("\n");
          return sublists ? `${prefix}${text}\n${sublists}` : `${prefix}${text}`;
        })
        .join("\n");
    case "error":
      return "";
  }
}

function tableToText(
  table: TableNode,
  opts: Required<ITextOnlyOptions>
): string {
  const headers = table.headers.map((cell) =>
    inlinesToText(cell.children, opts)
  );
  const rows = table.rows.map((row) =>
    row.map((cell) => inlinesToText(cell.children, opts))
  );
  return opts.table([headers, ...rows]);
}

function inlinesToText(
  nodes: InlineNode[],
  opts: Required<ITextOnlyOptions>
): string {
  return nodes.map((node) => inlineToText(node, opts)).join("");
}

function inlineToText(
  node: InlineNode,
  opts: Required<ITextOnlyOptions>
): string {
  switch (node.type) {
    case "text":
      return node.value;
    case "bold":
    case "italic":
    case "boldItalic":
    case "underline":
    case "strikethrough":
    case "color":
    case "link":
      return inlinesToText(node.children, opts);
    case "inlineCode":
      return node.value;
    case "latex":
      return node.value;
    case "image":
      return opts.image(node.alt);
    case "video":
      return opts.video(node.alt);
    case "metaRef":
      return `@{${node.key}}`;
    case "lineBreak":
      return "\n";
  }
}

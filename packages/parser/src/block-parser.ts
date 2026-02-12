import type {
  BlockNode,
  HeadingNode,
  ParagraphNode,
  CodeBlockNode,
  InlineNode,
} from "./types";
import { parseInline } from "./inline-parser";
import { parseBlockquoteGroup } from "./blockquote-parser";
import { parseTableBlock } from "./table-parser";
import {
  parseCollapseBlock,
  isCollapseStart,
  isCollapseEnd,
  setBlockParserForCollapse,
} from "./collapse-parser";

// Register block parser for collapse context
setBlockParserForCollapse(parseBlocksInContext);

export function parseBlocks(lines: string[]): BlockNode[] {
  const result = parseBlocksInContext(lines, 0, false);
  return result.nodes;
}

function parseBlocksInContext(
  lines: string[],
  startIndex: number,
  stopAtCollapse: boolean,
): { nodes: BlockNode[]; nextIndex: number } {
  const nodes: BlockNode[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];

    // Stop conditions for collapse context
    if (stopAtCollapse && (isCollapseStart(line) || isCollapseEnd(line))) {
      break;
    }

    // Skip blank lines
    if (isBlankLine(line)) {
      i++;
      continue;
    }

    // 1. Code block: starts with ```
    if (isCodeBlockStart(line)) {
      const result = parseCodeBlock(lines, i);
      nodes.push(result.node);
      i = result.nextIndex;
      continue;
    }

    // 2. Collapse start: starts with |>
    if (isCollapseStart(line)) {
      const result = parseCollapseBlock(lines, i);
      nodes.push(result.node);
      i = result.nextIndex;
      continue;
    }

    // 3. Table: current line has pipes AND next line is a separator row
    if (isTableStart(lines, i)) {
      const result = parseTableBlock(lines, i);
      nodes.push(result.node);
      i = result.nextIndex;
      continue;
    }

    // 4. Blockquote: starts with >
    if (isBlockquoteLine(line)) {
      const result = parseBlockquoteGroup(lines, i);
      nodes.push(...result.nodes);
      i = result.nextIndex;
      continue;
    }

    // 5. Heading: starts with # followed by space
    if (isHeadingLine(line)) {
      nodes.push(parseHeading(line));
      i++;
      continue;
    }

    // 6. Default: paragraph
    const result = parseParagraph(lines, i, stopAtCollapse);
    nodes.push(...result.nodes);
    i = result.nextIndex;
  }

  return { nodes, nextIndex: i };
}

// ===========================================================================
// PATTERN DETECTION
// ===========================================================================

function isBlankLine(line: string): boolean {
  return line.trim().length === 0;
}

function isCodeBlockStart(line: string): boolean {
  return /^```/.test(line);
}

function isTableStart(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length) return false;
  const currentLine = lines[index];
  const nextLine = lines[index + 1];
  if (!currentLine.includes("|")) return false;
  return /^\|?[\s:]*-+[\s:]*(\|[\s:]*-+[\s:]*)*\|?\s*$/.test(nextLine);
}

function isBlockquoteLine(line: string): boolean {
  return /^>/.test(line);
}

function isHeadingLine(line: string): boolean {
  return /^#{1,6}\s/.test(line);
}

// ===========================================================================
// BLOCK PARSERS
// ===========================================================================

function parseHeading(line: string): HeadingNode {
  const match = line.match(/^(#{1,6})\s(.+)$/);
  if (!match) {
    return { type: "heading", level: 1, children: [{ type: "text", value: line }] };
  }
  const level = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
  const text = match[2];
  const children = parseInline(text);
  return { type: "heading", level, children };
}

function parseParagraph(
  lines: string[],
  startIndex: number,
  stopAtCollapse: boolean,
): { nodes: BlockNode[]; nextIndex: number } {
  const paragraphLines: string[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (isBlankLine(line)) break;
    if (isCodeBlockStart(line)) break;
    if (isCollapseStart(line)) break;
    if (stopAtCollapse && isCollapseEnd(line)) break;
    if (isTableStart(lines, i)) break;
    if (isBlockquoteLine(line)) break;
    if (isHeadingLine(line)) break;
    paragraphLines.push(line);
    i++;
  }

  // Split on \np to create multiple paragraphs
  const paragraphGroups: string[][] = [];
  let currentGroup: string[] = [];

  for (const line of paragraphLines) {
    if (line.trim() === "\\np") {
      if (currentGroup.length > 0) {
        paragraphGroups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(line);
    }
  }
  if (currentGroup.length > 0) {
    paragraphGroups.push(currentGroup);
  }

  // Convert each group to a ParagraphNode
  const nodes: ParagraphNode[] = paragraphGroups.map(group => {
    const children: InlineNode[] = [];
    for (let j = 0; j < group.length; j++) {
      const line = group[j];

      if (line.trim() === "\\n") {
        children.push({ type: "lineBreak" });
      } else {
        if (j > 0) {
          children.push({ type: "lineBreak" });
        }
        const inlineNodes = parseInline(line);
        children.push(...inlineNodes);
      }
    }
    return { type: "paragraph" as const, children };
  });

  return { nodes, nextIndex: i };
}

function parseCodeBlock(lines: string[], startIndex: number): {
  node: CodeBlockNode;
  nextIndex: number;
} {
  const openLine = lines[startIndex];
  const langMatch = openLine.match(/^```(\w*)$/);
  const language = langMatch ? langMatch[1] : "";

  const contentLines: string[] = [];
  let i = startIndex + 1;

  while (i < lines.length) {
    if (lines[i].trim() === "```") {
      i++;
      break;
    }
    contentLines.push(lines[i]);
    i++;
  }

  return {
    node: {
      type: "codeBlock",
      language,
      content: contentLines.join("\n"),
      isIframe: language === "iframe",
    },
    nextIndex: i,
  };
}

import type { BlockNode, BlockquoteNode, ParagraphNode } from "./types";
import { parseInline } from "./inline-parser";
import { createErrorNode } from "./errors";

interface QuoteLevelInfo {
  icon: string | null;
  title: string | null;
  color: string | null;
  colorDark: string | null;
}

interface ParsedQuoteLine {
  levels: QuoteLevelInfo[];
  content: string;
  originalLineIndex: number;
}

function parseOptions(
  line: string,
  pos: number,
): { title: string | null; color: string | null; colorDark: string | null; pos: number } {
  let title: string | null = null;
  let color: string | null = null;
  let colorDark: string | null = null;

  while (pos < line.length && line[pos] === ",") {
    pos++; // skip comma
    const segStart = pos;
    while (pos < line.length && line[pos] !== "," && line[pos] !== ">") {
      pos++;
    }
    const segment = line.slice(segStart, pos);

    if (segment.startsWith("t#")) {
      title = segment.slice(2) || null;
    } else if (segment.startsWith("C#")) {
      colorDark = segment.slice(2) || null;
    } else if (segment.startsWith("c#")) {
      color = segment.slice(2) || null;
    }
    // Unknown options silently ignored
  }

  return { title, color, colorDark, pos };
}

function parseQuotePrefix(line: string): ParsedQuoteLine | null {
  if (line.length === 0 || line[0] !== ">") return null;

  let pos = 1; // past first >
  const levels: QuoteLevelInfo[] = [{ icon: null, title: null, color: null, colorDark: null }];

  while (pos <= line.length) {
    // Try to read icon name: sequence of alpha characters
    const iconStart = pos;
    while (pos < line.length && /[a-zA-Z]/.test(line[pos])) {
      pos++;
    }

    if (pos > iconStart && pos < line.length && (line[pos] === ">" || line[pos] === ",")) {
      // Found icon for current level
      levels[levels.length - 1].icon = line.slice(iconStart, pos);

      // Parse comma-separated options (t#..., c#..., C#...)
      if (line[pos] === ",") {
        const opts = parseOptions(line, pos);
        levels[levels.length - 1].title = opts.title;
        levels[levels.length - 1].color = opts.color;
        levels[levels.length - 1].colorDark = opts.colorDark;
        pos = opts.pos;
      }

      if (pos < line.length && line[pos] === ">") {
        pos++; // past closing >

        // Check what comes next
        if (pos < line.length && /[a-zA-Z]/.test(line[pos])) {
          // Another icon starts immediately = next level
          levels.push({ icon: null, title: null, color: null, colorDark: null });
          continue;
        } else if (pos < line.length && line[pos] === ">") {
          // Bare > = next level with no icon
          levels.push({ icon: null, title: null, color: null, colorDark: null });
          pos++;
          continue;
        } else {
          // Content starts (space or end of line)
          break;
        }
      } else {
        // No closing > after options — revert to treat as content
        pos = iconStart;
        break;
      }
    } else {
      // No icon found, revert pos
      pos = iconStart;

      if (pos < line.length && line[pos] === ">") {
        // Bare > = next level
        levels.push({ icon: null, title: null, color: null, colorDark: null });
        pos++;
        continue;
      } else {
        // Content starts
        break;
      }
    }
  }

  const content = pos < line.length ? line.slice(pos).trimStart() : "";
  return { levels, content, originalLineIndex: -1 };
}

export function parseBlockquoteGroup(lines: string[], startIndex: number, lineNumber: number): {
  nodes: BlockNode[];
  nextIndex: number;
} {
  // Collect consecutive blockquote lines
  const parsedLines: ParsedQuoteLine[] = [];
  let i = startIndex;

  while (i < lines.length && lines[i].startsWith(">")) {
    const parsed = parseQuotePrefix(lines[i]);
    if (parsed) {
      parsed.originalLineIndex = i;
      parsedLines.push(parsed);
    }
    i++;
  }

  // Validate nesting and build nodes
  // A line with icons at each level (e.g. >warning>error>) is self-consistent
  // and valid even without prior lines establishing each level.
  // Invalid case: bare >>> without preceding >> (pure nesting jump with no icons).
  let maxLevelSeen = 0;
  const nodes: BlockNode[] = [];

  for (const pl of parsedLines) {
    const level = pl.levels.length;

    // Check if this line is a bare nesting jump (all icons null, jumping levels)
    const allIconsNull = pl.levels.every(l => l.icon === null);
    if (allIconsNull && level > maxLevelSeen + 1) {
      nodes.push(
        createErrorNode(
          `Invalid blockquote nesting: level ${level} without level ${level - 1}`,
          pl.originalLineIndex + 1,
          lines[pl.originalLineIndex],
        )
      );
      continue;
    }

    maxLevelSeen = Math.max(maxLevelSeen, level);

    // Build nested blockquote structure for this line
    const innerContent = parseInline(pl.content);
    const innerParagraph: ParagraphNode = {
      type: "paragraph",
      children: innerContent,
      line: pl.originalLineIndex + 1,
    };

    // Create nested blockquotes from deepest to shallowest
    let current: BlockquoteNode = {
      type: "blockquote",
      icon: pl.levels[level - 1].icon,
      title: pl.levels[level - 1].title,
      color: pl.levels[level - 1].color,
      colorDark: pl.levels[level - 1].colorDark,
      children: [innerParagraph],
      line: pl.originalLineIndex + 1,
    };

    for (let lvl = level - 2; lvl >= 0; lvl--) {
      current = {
        type: "blockquote",
        icon: pl.levels[lvl].icon,
        title: pl.levels[lvl].title,
        color: pl.levels[lvl].color,
        colorDark: pl.levels[lvl].colorDark,
        children: [current],
        line: pl.originalLineIndex + 1,
      };
    }

    nodes.push(current);
  }

  // Merge adjacent blockquotes at the same level
  const merged = mergeBlockquotes(nodes);

  return { nodes: merged, nextIndex: i };
}

function blockquoteMatches(a: BlockquoteNode, b: BlockquoteNode): boolean {
  return a.icon === b.icon && a.title === b.title && a.color === b.color && a.colorDark === b.colorDark;
}

function mergeBlockquotes(nodes: BlockNode[]): BlockNode[] {
  const result: BlockNode[] = [];

  for (const node of nodes) {
    if (node.type !== "blockquote") {
      result.push(node);
      continue;
    }

    const prev = result[result.length - 1];
    if (prev && prev.type === "blockquote" && blockquoteMatches(prev, node)) {
      // Same level and options: merge children
      // Check if both have nested blockquotes as children to merge recursively
      const prevLastChild = prev.children[prev.children.length - 1];
      const nodeFirstChild = node.children[0];

      if (
        prevLastChild &&
        nodeFirstChild &&
        prevLastChild.type === "blockquote" &&
        nodeFirstChild.type === "blockquote" &&
        blockquoteMatches(prevLastChild as BlockquoteNode, nodeFirstChild as BlockquoteNode)
      ) {
        // Recursively merge nested blockquotes
        const mergedInner = mergeBlockquotes([
          prevLastChild as BlockNode,
          nodeFirstChild as BlockNode,
        ]);
        prev.children.splice(prev.children.length - 1, 1, ...mergedInner);
        // Add any remaining children from the current node
        if (node.children.length > 1) {
          prev.children.push(...node.children.slice(1));
        }
      } else {
        prev.children.push(...node.children);
      }
    } else {
      result.push(node);
    }
  }

  return result;
}

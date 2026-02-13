import type { BlockNode, CollapseNode, InlineNode } from "./types";
import { parseInline } from "./inline-parser";

interface CollapseFrame {
  title: InlineNode[] | null;
  children: BlockNode[];
}

export type ParseBlocksFn = (lines: string[], startIndex: number, stopAtCollapse: boolean) => {
  nodes: BlockNode[];
  nextIndex: number;
};

export function parseCollapseBlock(
  lines: string[],
  startIndex: number,
  lineNumber: number,
  parseBlocksInContext: ParseBlocksFn,
): {
  node: CollapseNode;
  nextIndex: number;
} {
  const titleText = extractCollapseTitle(lines[startIndex]);
  const rootFrame: CollapseFrame = {
    title: titleText !== null ? parseInline(titleText) : null,
    children: [],
  };

  const stack: CollapseFrame[] = [rootFrame];
  let i = startIndex + 1;

  while (i < lines.length && stack.length > 0) {
    const line = lines[i];

    if (isCollapseEnd(line)) {
      if (stack.length === 1) {
        i++;
        break;
      }
      const closed = stack.pop()!;
      const parent = stack[stack.length - 1];
      parent.children.push({
        type: "collapse",
        title: closed.title,
        children: closed.children,
        line: i + 1,
      });
      i++;
      continue;
    }

    if (isCollapseStart(line)) {
      const nestedTitle = extractCollapseTitle(line);
      const nestedFrame: CollapseFrame = {
        title: nestedTitle !== null ? parseInline(nestedTitle) : null,
        children: [],
      };
      stack.push(nestedFrame);
      i++;
      continue;
    }

    // Regular content: parse as blocks until next collapse marker
    const result = parseBlocksInContext(lines, i, true);
    const currentFrame = stack[stack.length - 1];
    currentFrame.children.push(...result.nodes);
    i = result.nextIndex;
  }

  // Close any unclosed collapses gracefully
  while (stack.length > 1) {
    const unclosed = stack.pop()!;
    const parent = stack[stack.length - 1];
    parent.children.push({
      type: "collapse",
      title: unclosed.title,
      children: unclosed.children,
      line: startIndex + 1,
    });
  }

  return {
    node: {
      type: "collapse",
      title: rootFrame.title,
      children: rootFrame.children,
      line: lineNumber,
    },
    nextIndex: i,
  };
}

function extractCollapseTitle(line: string): string | null {
  const after = line.slice(2).trim();
  return after.length > 0 ? after : null;
}

export function isCollapseStart(line: string): boolean {
  return /^\|>/.test(line);
}

export function isCollapseEnd(line: string): boolean {
  return /^\/>/.test(line.trim());
}

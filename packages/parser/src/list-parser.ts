import type { ListNode, ListItemNode } from "./types";
import { parseInline } from "./inline-parser";

interface RawListItem {
  indent: number;
  marker: "unordered" | "ordered";
  number: number;
  content: string;
}

function parseRawListItem(line: string): RawListItem | null {
  const unorderedMatch = line.match(/^(\s*)([-*])\s(.*)$/);
  if (unorderedMatch) {
    return {
      indent: unorderedMatch[1].length,
      marker: "unordered",
      number: 0,
      content: unorderedMatch[3],
    };
  }

  const orderedMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);
  if (orderedMatch) {
    return {
      indent: orderedMatch[1].length,
      marker: "ordered",
      number: parseInt(orderedMatch[2], 10),
      content: orderedMatch[3],
    };
  }

  return null;
}

export function isListLine(line: string): boolean {
  return /^(\s*)([-*]\s|\d+\.\s)/.test(line);
}

export function parseListBlock(
  lines: string[],
  startIndex: number,
  lineNumber: number,
): { nodes: ListNode[]; nextIndex: number } {
  const rawItems: RawListItem[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().length === 0) break;
    const item = parseRawListItem(line);
    if (!item) break;
    rawItems.push(item);
    i++;
  }

  if (rawItems.length === 0) {
    return { nodes: [], nextIndex: startIndex };
  }

  const nodes = buildListNodes(rawItems, rawItems[0].indent, lineNumber);
  return { nodes, nextIndex: i };
}

function buildListNodes(
  items: RawListItem[],
  baseIndent: number,
  lineNumber: number,
): ListNode[] {
  const result: ListNode[] = [];
  let currentList: ListNode | null = null;
  let idx = 0;

  while (idx < items.length) {
    const item = items[idx];

    if (item.indent < baseIndent) {
      break;
    }

    if (item.indent === baseIndent) {
      const isOrdered = item.marker === "ordered";

      if (!currentList || currentList.ordered !== isOrdered) {
        currentList = {
          type: "list",
          ordered: isOrdered,
          startNumber: isOrdered ? item.number : 1,
          items: [],
          line: lineNumber,
        };
        result.push(currentList);
      }

      const listItem: ListItemNode = {
        type: "listItem",
        children: parseInline(item.content),
        sublists: [],
      };
      currentList.items.push(listItem);
      idx++;

      // Collect nested items
      if (idx < items.length && items[idx].indent > baseIndent) {
        const childIndent = items[idx].indent;
        const childStart = idx;
        while (idx < items.length && items[idx].indent >= childIndent) {
          idx++;
        }
        const childItems = items.slice(childStart, idx);
        listItem.sublists = buildListNodes(childItems, childIndent, lineNumber);
      }
    } else {
      // Orphan indented item — skip gracefully
      idx++;
    }
  }

  return result;
}

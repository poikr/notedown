import type { TableNode, TableCellNode, TableAlignment } from "./types";
import { parseInline } from "./inline-parser";

export function parseTableBlock(lines: string[], startIndex: number, lineNumber: number): {
  node: TableNode;
  nextIndex: number;
} {
  // Line 1: header row
  const headerCells = splitTableRow(lines[startIndex]);

  // Line 2: separator row (determines alignment)
  const separatorCells = splitTableRow(lines[startIndex + 1]);
  const alignments = separatorCells.map(parseAlignment);

  // Lines 3+: data rows
  const rows: TableCellNode[][] = [];
  let i = startIndex + 2;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().length === 0) break;
    if (!line.includes("|")) break;
    const cells = splitTableRow(line);
    rows.push(
      cells.map(text => ({
        type: "tableCell" as const,
        children: parseInline(text.trim()),
      }))
    );
    i++;
  }

  return {
    node: {
      type: "table",
      headers: headerCells.map(text => ({
        type: "tableCell" as const,
        children: parseInline(text.trim()),
      })),
      alignments,
      rows,
      line: lineNumber,
    },
    nextIndex: i,
  };
}

export function splitTableRow(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|") && !trimmed.endsWith("\\|")) {
    trimmed = trimmed.slice(0, -1);
  }

  const cells: string[] = [];
  let current = "";
  let i = 0;
  let insideColor = false;

  while (i < trimmed.length) {
    // Escaped pipe: \|
    if (trimmed[i] === "\\" && i + 1 < trimmed.length && trimmed[i + 1] === "|") {
      current += "|";
      i += 2;
      continue;
    }

    if (trimmed[i] === "|") {
      if (insideColor) {
        current += "|";
        insideColor = false;
        i++;
        continue;
      }

      // Check if this pipe opens a color syntax
      const remaining = trimmed.slice(i + 1);
      if (looksLikeColorStart(remaining)) {
        current += "|";
        insideColor = true;
        i++;
        continue;
      }

      // This is a cell delimiter
      cells.push(current);
      current = "";
      i++;
      continue;
    }

    current += trimmed[i];
    i++;
  }

  if (current.length > 0) {
    cells.push(current);
  }

  return cells;
}

function looksLikeColorStart(text: string): boolean {
  return /^(f#[\w#]+,|b#[\w#]+,|\w+,)/.test(text);
}

function parseAlignment(separator: string): TableAlignment {
  const trimmed = separator.trim().replace(/-+/g, "-");
  const left = trimmed.startsWith(":");
  const right = trimmed.endsWith(":");
  if (left && right) return "center";
  if (right) return "right";
  return "left";
}

import type { ErrorNode } from "./types";

export class NotedownParseError extends Error {
  constructor(
    message: string,
    public readonly line: number,
    public readonly column: number,
  ) {
    super(`Parse error at line ${line}, column ${column}: ${message}`);
    this.name = "NotedownParseError";
  }
}

export function createErrorNode(message: string, line: number, raw: string): ErrorNode {
  return { type: "error", message, line, raw };
}

import { isColorName } from "./css-colors";

export interface ColorParseResult {
  foreground: string | null;
  background: string | null;
  foregroundDark: string | null;
  backgroundDark: string | null;
  textContent: string;
  nextPos: number;
}

export function tryParseColor(text: string, pos: number): ColorParseResult | null {
  // Find closing |
  let closePos = pos + 1;
  while (closePos < text.length) {
    if (text[closePos] === "\\" && closePos + 1 < text.length && text[closePos + 1] === "|") {
      // Escaped closing pipe means this is not color syntax
      return null;
    }
    if (text[closePos] === "|") break;
    closePos++;
  }
  if (closePos >= text.length) return null;

  const inner = text.slice(pos + 1, closePos);

  // Check for escaped tag: \f# or \b# or \F# or \B#
  if (inner.startsWith("\\f#") || inner.startsWith("\\b#") ||
      inner.startsWith("\\F#") || inner.startsWith("\\B#")) return null;

  // Parse the comma-separated segments
  const segments = inner.split(",");
  if (segments.length < 2) return null;

  let foreground: string | null = null;
  let background: string | null = null;
  let foregroundDark: string | null = null;
  let backgroundDark: string | null = null;
  let textStartIndex = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i].trim();

    if (seg.startsWith("F#")) {
      foregroundDark = normalizeColor(seg.slice(2));
      textStartIndex = i + 1;
    } else if (seg.startsWith("f#")) {
      foreground = normalizeColor(seg.slice(2));
      textStartIndex = i + 1;
    } else if (seg.startsWith("B#")) {
      backgroundDark = normalizeColor(seg.slice(2));
      textStartIndex = i + 1;
    } else if (seg.startsWith("b#")) {
      background = normalizeColor(seg.slice(2));
      textStartIndex = i + 1;
    } else if (i === 0 && isColorName(seg)) {
      foreground = seg;
      textStartIndex = i + 1;
    } else {
      textStartIndex = i;
      break;
    }
  }

  if (foreground === null && background === null &&
      foregroundDark === null && backgroundDark === null) return null;

  const textContent = segments.slice(textStartIndex).join(",");
  if (textContent.length === 0) return null;

  return {
    foreground,
    background,
    foregroundDark,
    backgroundDark,
    textContent,
    nextPos: closePos + 1,
  };
}

export function normalizeColor(value: string): string {
  if (/^[0-9a-fA-F]{3,8}$/.test(value)) {
    return "#" + value;
  }
  return value;
}

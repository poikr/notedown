export interface EscapeResult {
  type: "lineBreak" | "literal";
  value?: string;
  nextPos: number;
}

export function tryParseEscape(text: string, pos: number): EscapeResult | null {
  if (text[pos] !== "\\") return null;
  if (pos + 1 >= text.length) return null;

  const next = text[pos + 1];

  // \| = literal pipe
  if (next === "|") {
    return { type: "literal", value: "|", nextPos: pos + 2 };
  }

  // \@ = literal @
  if (next === "@") {
    return { type: "literal", value: "@", nextPos: pos + 2 };
  }

  // \\ = literal backslash
  if (next === "\\") {
    return { type: "literal", value: "\\", nextPos: pos + 2 };
  }

  // \* = literal asterisk
  if (next === "*") {
    return { type: "literal", value: "*", nextPos: pos + 2 };
  }

  // \_ = literal underscore
  if (next === "_") {
    return { type: "literal", value: "_", nextPos: pos + 2 };
  }

  // \~ = literal tilde
  if (next === "~") {
    return { type: "literal", value: "~", nextPos: pos + 2 };
  }

  // \` = literal backtick
  if (next === "`") {
    return { type: "literal", value: "`", nextPos: pos + 2 };
  }

  // \$ = literal dollar
  if (next === "$") {
    return { type: "literal", value: "$", nextPos: pos + 2 };
  }

  // \[ = literal bracket
  if (next === "[") {
    return { type: "literal", value: "[", nextPos: pos + 2 };
  }

  // \! = literal exclamation
  if (next === "!") {
    return { type: "literal", value: "!", nextPos: pos + 2 };
  }

  // Unknown escape: not recognized
  return null;
}

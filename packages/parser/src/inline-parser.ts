import type {
  InlineNode,
  InlineCodeNode,
  LatexNode,
  ColorNode,
  MetaRefNode,
  ImageNode,
  LinkNode,
} from "./types";
import { tryParseEscape } from "./escape";

// CSS named colors (subset of most common ones)
const CSS_COLORS = new Set([
  "red", "blue", "green", "yellow", "orange", "purple", "pink",
  "black", "white", "gray", "grey", "brown", "cyan", "magenta",
  "lime", "navy", "teal", "aqua", "maroon", "olive", "silver",
  "fuchsia", "coral", "salmon", "gold", "indigo", "violet",
  "turquoise", "tan", "khaki", "crimson", "plum", "orchid",
  "sienna", "tomato", "wheat", "ivory", "linen", "lavender",
  "beige", "azure", "bisque", "chartreuse", "chocolate",
  "cornflowerblue", "cornsilk", "darkblue", "darkcyan", "darkgoldenrod",
  "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
  "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
  "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
  "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
  "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "goldenrod",
  "greenyellow", "honeydew", "hotpink", "indianred", "lawngreen",
  "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
  "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen",
  "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow",
  "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid",
  "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
  "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream",
  "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab",
  "orangered", "palegoldenrod", "palegreen", "paleturquoise",
  "palevioletred", "papayawhip", "peachpuff", "peru", "powderblue",
  "rosybrown", "royalblue", "saddlebrown", "sandybrown", "seagreen",
  "seashell", "skyblue", "slateblue", "slategray", "snow",
  "springgreen", "steelblue", "thistle", "yellowgreen", "rebeccapurple",
  "aliceblue", "antiquewhite", "blanchedalmond", "blueviolet",
  "burlywood", "cadetblue", "darksalmon", "darkseagreen",
]);

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let pos = 0;
  let textBuffer = "";

  function flushText() {
    if (textBuffer.length > 0) {
      nodes.push({ type: "text", value: textBuffer });
      textBuffer = "";
    }
  }

  while (pos < text.length) {
    // ----- ESCAPE SEQUENCES -----
    if (text[pos] === "\\") {
      const escResult = tryParseEscape(text, pos);
      if (escResult) {
        if (escResult.type === "literal") {
          textBuffer += escResult.value;
        }
        pos = escResult.nextPos;
        continue;
      }
    }

    // ----- INLINE CODE: `...` -----
    if (text[pos] === "`") {
      const result = parseInlineCode(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- LATEX: $...$ -----
    if (text[pos] === "$") {
      const result = parseLatex(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- BOLD+ITALIC: ***...*** -----
    if (text.startsWith("***", pos)) {
      const result = parseWrapped(text, pos, "***", "***", "boldItalic");
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- BOLD: **...** -----
    if (text.startsWith("**", pos) && !text.startsWith("***", pos)) {
      const result = parseWrapped(text, pos, "**", "**", "bold");
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- ITALIC: *...* -----
    if (text[pos] === "*" && !text.startsWith("**", pos)) {
      const result = parseWrapped(text, pos, "*", "*", "italic");
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- UNDERLINE: __...__ -----
    if (text.startsWith("__", pos)) {
      const result = parseWrapped(text, pos, "__", "__", "underline");
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- STRIKETHROUGH: ~~...~~ -----
    if (text.startsWith("~~", pos)) {
      const result = parseWrapped(text, pos, "~~", "~~", "strikethrough");
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- COLOR: |...,text| -----
    if (text[pos] === "|") {
      const result = tryParseColor(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- META REFERENCE: @{key} -----
    if (text.startsWith("@{", pos)) {
      const result = parseMetaRef(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- LINKED IMAGE: [![alt](imgurl)](linkurl) -----
    if (text.startsWith("[![", pos)) {
      const result = parseLinkedImage(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- IMAGE: ![alt](url) -----
    if (text.startsWith("![", pos)) {
      const result = parseImage(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- LINK: [text](url) -----
    if (text[pos] === "[") {
      const result = parseLink(text, pos);
      if (result) {
        flushText();
        nodes.push(result.node);
        pos = result.nextPos;
        continue;
      }
    }

    // ----- DEFAULT: accumulate text -----
    textBuffer += text[pos];
    pos++;
  }

  flushText();
  return nodes;
}

// ===========================================================================
// SUB-PARSERS
// ===========================================================================

type WrappedType = "bold" | "italic" | "boldItalic" | "underline" | "strikethrough";

function parseWrapped(
  text: string,
  pos: number,
  openMarker: string,
  closeMarker: string,
  nodeType: WrappedType,
): { node: InlineNode; nextPos: number } | null {
  const contentStart = pos + openMarker.length;
  const closeIndex = findClosingMarker(text, contentStart, closeMarker);

  if (closeIndex === -1) return null;

  const innerText = text.slice(contentStart, closeIndex);
  if (innerText.length === 0) return null;

  const children = parseInline(innerText);

  return {
    node: { type: nodeType, children } as InlineNode,
    nextPos: closeIndex + closeMarker.length,
  };
}

function findClosingMarker(text: string, startPos: number, marker: string): number {
  let pos = startPos;
  while (pos <= text.length - marker.length) {
    if (text[pos] === "\\" && pos + 1 < text.length) {
      pos += 2; // skip escaped character
      continue;
    }
    if (text.startsWith(marker, pos)) {
      return pos;
    }
    pos++;
  }
  return -1;
}

function parseInlineCode(text: string, pos: number): {
  node: InlineCodeNode;
  nextPos: number;
} | null {
  const closeIndex = text.indexOf("`", pos + 1);
  if (closeIndex === -1) return null;

  return {
    node: {
      type: "inlineCode",
      value: text.slice(pos + 1, closeIndex),
    },
    nextPos: closeIndex + 1,
  };
}

function parseLatex(text: string, pos: number): {
  node: LatexNode;
  nextPos: number;
} | null {
  const closeIndex = text.indexOf("$", pos + 1);
  if (closeIndex === -1) return null;

  return {
    node: {
      type: "latex",
      value: text.slice(pos + 1, closeIndex),
    },
    nextPos: closeIndex + 1,
  };
}

function tryParseColor(text: string, pos: number): {
  node: ColorNode;
  nextPos: number;
} | null {
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

  const children = parseInline(textContent);

  return {
    node: {
      type: "color",
      foreground,
      background,
      foregroundDark,
      backgroundDark,
      children,
    },
    nextPos: closePos + 1,
  };
}

function normalizeColor(value: string): string {
  if (/^[0-9a-fA-F]{3,8}$/.test(value)) {
    return "#" + value;
  }
  return value;
}

function isColorName(value: string): boolean {
  return CSS_COLORS.has(value.toLowerCase());
}

function parseMetaRef(text: string, pos: number): {
  node: MetaRefNode;
  nextPos: number;
} | null {
  const closeIndex = text.indexOf("}", pos + 2);
  if (closeIndex === -1) return null;

  const key = text.slice(pos + 2, closeIndex);
  if (key.length === 0) return null;

  return {
    node: { type: "metaRef", key },
    nextPos: closeIndex + 1,
  };
}

function parseImage(text: string, pos: number): {
  node: ImageNode;
  nextPos: number;
} | null {
  if (text[pos] !== "!" || text[pos + 1] !== "[") return null;

  const closeBracket = findMatchingBracket(text, pos + 1, "[", "]");
  if (closeBracket === -1) return null;

  if (closeBracket + 1 >= text.length || text[closeBracket + 1] !== "(") return null;

  const closeParen = findMatchingBracket(text, closeBracket + 1, "(", ")");
  if (closeParen === -1) return null;

  const altRaw = text.slice(pos + 2, closeBracket);
  const url = text.slice(closeBracket + 2, closeParen);

  const { width, height, alignment, alt } = parseImageAttributes(altRaw);

  return {
    node: {
      type: "image",
      url,
      alt,
      width,
      height,
      alignment,
      link: null,
    },
    nextPos: closeParen + 1,
  };
}

function parseImageAttributes(altRaw: string): {
  width: string | null;
  height: string | null;
  alignment: "left" | "center" | "right" | null;
  alt: string;
} {
  const segments = altRaw.split(",").map(s => s.trim());
  let width: string | null = null;
  let height: string | null = null;
  let alignment: "left" | "center" | "right" | null = null;
  const altParts: string[] = [];

  for (const seg of segments) {
    if (seg.startsWith("w#")) {
      width = seg.slice(2);
    } else if (seg.startsWith("h#")) {
      height = seg.slice(2);
    } else if (seg.startsWith("a#")) {
      const val = seg.slice(2);
      if (val === "left" || val === "center" || val === "right") {
        alignment = val;
      }
    } else {
      altParts.push(seg);
    }
  }

  return { width, height, alignment, alt: altParts.join(",") };
}

function parseLinkedImage(text: string, pos: number): {
  node: ImageNode;
  nextPos: number;
} | null {
  // Pattern: [![alt](imgurl)](linkurl)
  if (!text.startsWith("[![", pos)) return null;

  // Parse the inner image starting at pos+1 (the !)
  const innerResult = parseImage(text, pos + 1);
  if (!innerResult) return null;

  // After the inner image, expect ](linkurl)
  const afterInner = innerResult.nextPos;
  if (afterInner >= text.length || text[afterInner] !== "]") return null;
  if (afterInner + 1 >= text.length || text[afterInner + 1] !== "(") return null;

  const closeParen = findMatchingBracket(text, afterInner + 1, "(", ")");
  if (closeParen === -1) return null;

  const linkUrl = text.slice(afterInner + 2, closeParen);

  return {
    node: {
      ...innerResult.node,
      link: linkUrl,
    },
    nextPos: closeParen + 1,
  };
}

function parseLink(text: string, pos: number): {
  node: LinkNode;
  nextPos: number;
} | null {
  const closeBracket = findMatchingBracket(text, pos, "[", "]");
  if (closeBracket === -1) return null;

  if (closeBracket + 1 >= text.length || text[closeBracket + 1] !== "(") return null;

  const closeParen = findMatchingBracket(text, closeBracket + 1, "(", ")");
  if (closeParen === -1) return null;

  const linkText = text.slice(pos + 1, closeBracket);
  const url = text.slice(closeBracket + 2, closeParen);

  const children = parseInline(linkText);

  return {
    node: { type: "link", url, children },
    nextPos: closeParen + 1,
  };
}

function findMatchingBracket(
  text: string,
  openPos: number,
  openChar: string,
  closeChar: string,
): number {
  let depth = 0;
  for (let i = openPos; i < text.length; i++) {
    if (text[i] === "\\" && i + 1 < text.length) {
      i++;
      continue;
    }
    if (text[i] === openChar) depth++;
    if (text[i] === closeChar) depth--;
    if (depth === 0) return i;
  }
  return -1;
}

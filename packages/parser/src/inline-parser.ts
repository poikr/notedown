import type {
  InlineNode,
  InlineCodeNode,
  LatexNode,
  MetaRefNode,
} from "./types";
import { tryParseEscape } from "./escape";
import { tryParseColor } from "./color-parser";
import {
  parseLink as parseLinkRaw,
  parseImage,
  parseLinkedImage,
} from "./link-image-parser";

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
      const colorResult = tryParseColor(text, pos);
      if (colorResult) {
        flushText();
        const { textContent, nextPos, ...colorProps } = colorResult;
        nodes.push({
          type: "color",
          ...colorProps,
          children: parseInline(textContent),
        });
        pos = nextPos;
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
      const linkResult = parseLinkRaw(text, pos);
      if (linkResult) {
        flushText();
        nodes.push({
          type: "link",
          url: linkResult.url,
          children: parseInline(linkResult.rawText),
        });
        pos = linkResult.nextPos;
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
// SUB-PARSERS (kept local — no circular dependency risk)
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

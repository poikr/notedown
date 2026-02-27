import type { ImageNode, VideoNode } from "./types";

export interface LinkParseResult {
  url: string;
  rawText: string;
  nextPos: number;
}

export function parseLink(text: string, pos: number): LinkParseResult | null {
  const closeBracket = findMatchingBracket(text, pos, "[", "]");
  if (closeBracket === -1) return null;

  if (closeBracket + 1 >= text.length || text[closeBracket + 1] !== "(") return null;

  const closeParen = findMatchingBracket(text, closeBracket + 1, "(", ")");
  if (closeParen === -1) return null;

  const rawText = text.slice(pos + 1, closeBracket);
  const url = text.slice(closeBracket + 2, closeParen);

  return {
    url,
    rawText,
    nextPos: closeParen + 1,
  };
}

export function parseImage(text: string, pos: number): {
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

  const { width, height, aspectRatio, alignment, alt } = parseMediaAttributes(altRaw);

  return {
    node: {
      type: "image",
      url,
      alt,
      width,
      height,
      aspectRatio,
      alignment,
      link: null,
    },
    nextPos: closeParen + 1,
  };
}

export function parseLinkedImage(text: string, pos: number): {
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

export function parseVideo(text: string, pos: number): {
  node: VideoNode;
  nextPos: number;
} | null {
  if (text[pos] !== "@" || text[pos + 1] !== "[") return null;

  const closeBracket = findMatchingBracket(text, pos + 1, "[", "]");
  if (closeBracket === -1) return null;

  if (closeBracket + 1 >= text.length || text[closeBracket + 1] !== "(") return null;

  const closeParen = findMatchingBracket(text, closeBracket + 1, "(", ")");
  if (closeParen === -1) return null;

  const altRaw = text.slice(pos + 2, closeBracket);
  const url = text.slice(closeBracket + 2, closeParen);

  const { width, height, aspectRatio, alignment, youtube, alt } = parseVideoAttributes(altRaw);

  return {
    node: {
      type: "video",
      url,
      alt,
      width,
      height,
      aspectRatio,
      alignment,
      youtube,
    },
    nextPos: closeParen + 1,
  };
}

function parseVideoAttributes(altRaw: string): {
  width: string | null;
  height: string | null;
  alignment: "left" | "center" | "right" | null;
  youtube: boolean;
  alt: string;
} {
  const base = parseMediaAttributes(altRaw);
  let youtube = false;
  const altParts: string[] = [];

  for (const seg of base.alt.split(",").map(s => s.trim())) {
    if (seg === "y#true") {
      youtube = true;
    } else {
      altParts.push(seg);
    }
  }

  return { ...base, youtube, alt: altParts.join(",") };
}

function parseMediaAttributes(altRaw: string): {
  width: string | null;
  height: string | null;
  aspectRatio: string | null;
  alignment: "left" | "center" | "right" | null;
  alt: string;
} {
  const segments = altRaw.split(",").map(s => s.trim());
  let width: string | null = null;
  let height: string | null = null;
  let aspectRatio: string | null = null;
  let alignment: "left" | "center" | "right" | null = null;
  const altParts: string[] = [];

  for (const seg of segments) {
    if (seg.startsWith("w#")) {
      width = seg.slice(2);
    } else if (seg.startsWith("h#")) {
      height = seg.slice(2);
    } else if (seg.startsWith("p#")) {
      aspectRatio = seg.slice(2);
    } else if (seg.startsWith("a#")) {
      const val = seg.slice(2);
      if (val === "left" || val === "center" || val === "right") {
        alignment = val;
      }
    } else {
      altParts.push(seg);
    }
  }

  return { width, height, aspectRatio, alignment, alt: altParts.join(",") };
}

export function findMatchingBracket(
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

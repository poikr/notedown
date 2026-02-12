const META_REGEX = /^@meta\s+([^=]+)=(.+)$/;
const ESCAPED_META_REGEX = /^\\@meta/;

export function parseMeta(lines: string[]): {
  metadata: Record<string, string>;
  contentStartIndex: number;
} {
  const metadata: Record<string, string> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const metaMatch = line.match(META_REGEX);
    if (metaMatch) {
      const key = metaMatch[1].trim();
      const value = metaMatch[2].trim();
      metadata[key] = value;
      i++;
      continue;
    }

    if (ESCAPED_META_REGEX.test(line)) {
      // Escaped meta: content starts here, \@ becomes @
      return { metadata, contentStartIndex: i };
    }

    if (line.trim().length === 0) {
      // Blank line: skip within meta section
      i++;
      continue;
    }

    // Non-meta, non-blank line: content starts
    return { metadata, contentStartIndex: i };
  }

  // All lines consumed (document is only meta)
  return { metadata, contentStartIndex: lines.length };
}

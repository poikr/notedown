import { describe, it, expect } from "bun:test";
import { parse, getTextOnly } from "../src/index";

describe("getTextOnly", () => {
  it("extracts text from a simple paragraph", () => {
    const doc = parse("Hello world");
    expect(getTextOnly(doc)).toBe("Hello world");
  });

  it("extracts text from bold/italic/underline", () => {
    const doc = parse("**bold** *italic* __underline__");
    expect(getTextOnly(doc)).toBe("bold italic underline");
  });

  it("extracts text from headings", () => {
    const doc = parse("# Heading 1\n\n## Heading 2");
    expect(getTextOnly(doc)).toBe("Heading 1\nHeading 2");
  });

  it("extracts text from code blocks", () => {
    const doc = parse("```js\nconsole.log('hi')\n```");
    expect(getTextOnly(doc)).toBe("console.log('hi')");
  });

  it("extracts text from inline code", () => {
    const doc = parse("use `console.log` here");
    expect(getTextOnly(doc)).toBe("use console.log here");
  });

  it("uses default image formatter", () => {
    const doc = parse("![my photo](https://example.com/img.png)");
    expect(getTextOnly(doc)).toBe("[Image my photo]");
  });

  it("uses custom image formatter", () => {
    const doc = parse("![my photo](https://example.com/img.png)");
    expect(getTextOnly(doc, { image: (alt) => `<${alt}>` })).toBe(
      "<my photo>"
    );
  });

  it("uses default table formatter", () => {
    const doc = parse("| A | B |\n|---|---|\n| 1 | 2 |");
    expect(getTextOnly(doc)).toBe("[Table]");
  });

  it("uses custom table formatter", () => {
    const doc = parse("| A | B |\n|---|---|\n| 1 | 2 |");
    const result = getTextOnly(doc, {
      table: (rows) => rows.map((r) => r.join(", ")).join(" | "),
    });
    expect(result).toBe("A, B | 1, 2");
  });

  it("extracts text from links (text only)", () => {
    const doc = parse("[click here](https://example.com)");
    expect(getTextOnly(doc)).toBe("click here");
  });

  it("extracts text from colored text", () => {
    const doc = parse("|red,hello world|");
    expect(getTextOnly(doc)).toBe("hello world");
  });

  it("handles multiple paragraphs", () => {
    const doc = parse("first paragraph\n\nsecond paragraph");
    expect(getTextOnly(doc)).toBe("first paragraph\nsecond paragraph");
  });

  it("handles line breaks within paragraphs", () => {
    const doc = parse("line one\\\nline two");
    expect(getTextOnly(doc)).toBe("line one\\\nline two");
  });

  it("extracts text from blockquotes", () => {
    const doc = parse("> quoted text");
    expect(getTextOnly(doc)).toBe("quoted text");
  });

  it("extracts text from lists", () => {
    const doc = parse("- item one\n- item two\n- item three");
    expect(getTextOnly(doc)).toBe("- item one\n- item two\n- item three");
  });

  it("extracts text from ordered lists", () => {
    const doc = parse("1. first\n2. second\n3. third");
    expect(getTextOnly(doc)).toBe("1. first\n2. second\n3. third");
  });
});

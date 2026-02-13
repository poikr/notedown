import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";
import { assertParagraph } from "./test-helpers";

describe("Paragraph Parser", () => {
  it("parses single paragraph", () => {
    const doc = parse("Hello World");
    expect(doc.content.length).toBe(1);
    expect(doc.content[0].type).toBe("paragraph");
  });

  it("separates paragraphs by blank lines", () => {
    const doc = parse("Paragraph 1\n\nParagraph 2");
    expect(doc.content.length).toBe(2);
    expect(doc.content[0].type).toBe("paragraph");
    expect(doc.content[1].type).toBe("paragraph");
  });

  it("handles multiple blank lines as single separator", () => {
    const doc = parse("Paragraph 1\n\n\n\nParagraph 2");
    expect(doc.content.length).toBe(2);
  });

  it("adds line breaks between lines within paragraph", () => {
    const doc = parse("Line 1\nLine 2\nLine 3");
    const para = assertParagraph(doc.content[0]);
    // Should have: text, lineBreak, text, lineBreak, text
    const textNodes = para.children.filter((n: any) => n.type === "text");
    const brNodes = para.children.filter((n: any) => n.type === "lineBreak");
    expect(textNodes.length).toBe(3);
    expect(brNodes.length).toBe(2);
  });
});

import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";
import { assertParagraph } from "./test-helpers";

describe("Special Syntax", () => {
  it("handles \\n as line break within paragraph", () => {
    const doc = parse("Line 1\n\\n\n\\n\n\\n\nLine 2");
    const para = assertParagraph(doc.content[0]);
    const lineBreaks = para.children.filter((n: any) => n.type === "lineBreak");
    expect(lineBreaks.length).toBeGreaterThanOrEqual(3);
  });

  it("handles \\np as paragraph separator", () => {
    const doc = parse("Paragraph 1\n\\np\nParagraph 2");
    expect(doc.content.length).toBe(2);
    expect(doc.content[0].type).toBe("paragraph");
    expect(doc.content[1].type).toBe("paragraph");
  });

  it("handles escape sequences in inline text", () => {
    const doc = parse("\\*not italic\\*");
    const para = assertParagraph(doc.content[0]);
    const text = para.children.map((n: any) => n.type === "text" ? n.value : "").join("");
    expect(text).toContain("*not italic*");
  });

  it("handles escaped backslash", () => {
    const doc = parse("\\\\double backslash");
    const para = assertParagraph(doc.content[0]);
    const text = para.children.map((n: any) => n.type === "text" ? n.value : "").join("");
    expect(text).toContain("\\");
  });

  it("handles inline \\n as line break escape", () => {
    const doc = parse("Hello\\nWorld");
    const para = assertParagraph(doc.content[0]);
    expect(para.children).toEqual([
      { type: "text", value: "Hello" },
      { type: "lineBreak" },
      { type: "text", value: "World" },
    ]);
  });

  it("handles \\n\\n\\n as 3 line break escapes in a single line", () => {
    const doc = parse("A\\n\\n\\nB");
    const para = assertParagraph(doc.content[0]);
    expect(para.children).toEqual([
      { type: "text", value: "A" },
      { type: "lineBreak" },
      { type: "lineBreak" },
      { type: "lineBreak" },
      { type: "text", value: "B" },
    ]);
  });
});

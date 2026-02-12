import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Special Syntax", () => {
  it("handles \\n as line break within paragraph", () => {
    const doc = parse("Line 1\n\\n\n\\n\n\\n\nLine 2");
    const para = doc.content[0] as any;
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
    const para = doc.content[0] as any;
    const text = para.children.map((n: any) => n.type === "text" ? n.value : "").join("");
    expect(text).toContain("*not italic*");
  });

  it("handles escaped backslash", () => {
    const doc = parse("\\\\double backslash");
    const para = doc.content[0] as any;
    const text = para.children.map((n: any) => n.type === "text" ? n.value : "").join("");
    expect(text).toContain("\\");
  });
});

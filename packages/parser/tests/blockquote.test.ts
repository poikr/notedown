import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Blockquote Parser", () => {
  it("parses basic blockquote", () => {
    const doc = parse("> This is a quote");
    expect(doc.content[0]).toMatchObject({
      type: "blockquote",
      icon: null,
    });
  });

  it("parses nested blockquote", () => {
    const doc = parse("> Level 1\n>> Level 2");
    const bq = doc.content[0] as any;
    expect(bq.type).toBe("blockquote");
    // Should have nested structure
    const hasNestedQuote = bq.children.some(
      (c: any) => c.type === "blockquote"
    );
    expect(hasNestedQuote).toBe(true);
  });

  it("parses blockquote with info icon", () => {
    const doc = parse(">info> This is info");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("info");
  });

  it("parses blockquote with warning icon", () => {
    const doc = parse(">warning> This is a warning");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("warning");
  });

  it("parses chained icons as nested levels", () => {
    const doc = parse(">warning>error> Important message");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("warning");
    // Should have a nested blockquote with error icon
    const nested = bq.children.find((c: any) => c.type === "blockquote");
    expect(nested).toBeDefined();
    expect(nested.icon).toBe("error");
  });

  it("handles > > as literal > in content", () => {
    const doc = parse("> > literal angle bracket");
    const bq = doc.content[0] as any;
    expect(bq.type).toBe("blockquote");
    // The content should contain > literal angle bracket
    const para = bq.children.find((c: any) => c.type === "paragraph");
    expect(para).toBeDefined();
  });

  it("returns error for invalid nesting (>>> without >>)", () => {
    const doc = parse(">>> Invalid nesting");
    // Should produce an error node
    const hasError = doc.content.some((n: any) => n.type === "error");
    expect(hasError).toBe(true);
  });

  it("parses multi-line blockquote", () => {
    const doc = parse("> Line 1\n> Line 2\n> Line 3");
    const bq = doc.content[0] as any;
    expect(bq.type).toBe("blockquote");
    // Should have merged children
    expect(bq.children.length).toBeGreaterThanOrEqual(1);
  });

  it("parses blockquote with text decoration", () => {
    const doc = parse("> **Bold quoted text**");
    const bq = doc.content[0] as any;
    const para = bq.children.find((c: any) => c.type === "paragraph");
    expect(para.children[0].type).toBe("bold");
  });

  // === Title and Color Options ===

  it("parses blockquote with title option", () => {
    const doc = parse(">warning,t#경고> text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("warning");
    expect(bq.title).toBe("경고");
    expect(bq.color).toBeNull();
  });

  it("parses blockquote with color option", () => {
    const doc = parse(">info,c#blue> text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("info");
    expect(bq.title).toBeNull();
    expect(bq.color).toBe("blue");
  });

  it("parses blockquote with both title and color", () => {
    const doc = parse(">error,t#오류,c#red> text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("error");
    expect(bq.title).toBe("오류");
    expect(bq.color).toBe("red");
  });

  it("parses options in any order (color before title)", () => {
    const doc = parse(">info,c#green,t#정보> text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("info");
    expect(bq.title).toBe("정보");
    expect(bq.color).toBe("green");
  });

  it("basic blockquote has null title and color", () => {
    const doc = parse("> simple quote");
    const bq = doc.content[0] as any;
    expect(bq.title).toBeNull();
    expect(bq.color).toBeNull();
  });

  it("icon-only blockquote has null title and color", () => {
    const doc = parse(">info> text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("info");
    expect(bq.title).toBeNull();
    expect(bq.color).toBeNull();
  });

  it("merges multi-line blockquotes with same options", () => {
    const doc = parse(">info,t#Note> Line 1\n>info,t#Note> Line 2");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("info");
    expect(bq.title).toBe("Note");
    expect(bq.children.length).toBe(2);
  });

  it("does not merge blockquotes with different titles", () => {
    const doc = parse(">info,t#A> text\n>info,t#B> text");
    expect(doc.content.length).toBe(2);
  });

  it("parses nested blockquote with options on outer level", () => {
    const doc = parse(">warning,t#주의>error> nested text");
    const bq = doc.content[0] as any;
    expect(bq.icon).toBe("warning");
    expect(bq.title).toBe("주의");
    const nested = bq.children.find((c: any) => c.type === "blockquote");
    expect(nested).toBeDefined();
    expect(nested.icon).toBe("error");
    expect(nested.title).toBeNull();
  });

  it("parses hex color value", () => {
    const doc = parse(">info,c##ff6600> orange text");
    const bq = doc.content[0] as any;
    expect(bq.color).toBe("#ff6600");
  });
});

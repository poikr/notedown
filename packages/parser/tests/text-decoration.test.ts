import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Text Decoration", () => {
  it("parses bold text", () => {
    const doc = parse("**bold text**");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "bold" });
    expect(para.children[0].children[0]).toMatchObject({ type: "text", value: "bold text" });
  });

  it("parses italic text", () => {
    const doc = parse("*italic text*");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "italic" });
  });

  it("parses underline text", () => {
    const doc = parse("__underline text__");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "underline" });
  });

  it("parses strikethrough text", () => {
    const doc = parse("~~strikethrough text~~");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "strikethrough" });
  });

  it("parses bold+italic text", () => {
    const doc = parse("***bold italic***");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "boldItalic" });
  });

  it("parses nested decorations", () => {
    const doc = parse("**__bold underline__**");
    const para = doc.content[0] as any;
    expect(para.children[0].type).toBe("bold");
    expect(para.children[0].children[0].type).toBe("underline");
  });

  it("parses inline code", () => {
    const doc = parse("`code here`");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "inlineCode", value: "code here" });
  });

  it("parses latex", () => {
    const doc = parse("$E=mc^2$");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "latex", value: "E=mc^2" });
  });

  it("does not parse decorations inside inline code", () => {
    const doc = parse("`**not bold**`");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({ type: "inlineCode", value: "**not bold**" });
  });

  it("parses mixed decorations in a line", () => {
    const doc = parse("**bold**, *italic*, __underline__, ~~strike~~");
    const para = doc.content[0] as any;
    const types = para.children.map((n: any) => n.type);
    expect(types).toContain("bold");
    expect(types).toContain("italic");
    expect(types).toContain("underline");
    expect(types).toContain("strikethrough");
  });
});

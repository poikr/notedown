import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";
import { assertParagraph } from "./test-helpers";

describe("Link Parser", () => {
  it("parses basic link", () => {
    const doc = parse("[Google](https://www.google.com)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "link",
      url: "https://www.google.com",
    });
    expect(para.children[0].children[0]).toMatchObject({ type: "text", value: "Google" });
  });

  it("parses relative path link", () => {
    const doc = parse("[Other](./other.md)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "link",
      url: "./other.md",
    });
  });

  it("parses anchor link", () => {
    const doc = parse("[Section](#section-name)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "link",
      url: "#section-name",
    });
  });

  it("parses link with bold text", () => {
    const doc = parse("[**bold link**](https://example.com)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0].type).toBe("link");
    expect(para.children[0].children[0].type).toBe("bold");
  });

  it("parses link with italic text", () => {
    const doc = parse("[*italic link*](https://example.com)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0].type).toBe("link");
    expect(para.children[0].children[0].type).toBe("italic");
  });
});

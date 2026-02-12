import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Collapse Parser", () => {
  it("parses basic collapse without title", () => {
    const doc = parse("|>\nHidden content\n/>");
    expect(doc.content[0]).toMatchObject({
      type: "collapse",
      title: null,
    });
    const collapse = doc.content[0] as any;
    expect(collapse.children.length).toBeGreaterThan(0);
  });

  it("parses collapse with title", () => {
    const doc = parse("|> Click to expand\nHidden content\n/>");
    const collapse = doc.content[0] as any;
    expect(collapse.title).not.toBeNull();
    expect(collapse.title[0]).toMatchObject({ type: "text", value: "Click to expand" });
  });

  it("parses nested collapse", () => {
    const doc = parse("|> Outer\nOuter content\n|> Inner\nInner content\n/>\n/>");
    const outer = doc.content[0] as any;
    expect(outer.type).toBe("collapse");
    const inner = outer.children.find((c: any) => c.type === "collapse");
    expect(inner).toBeDefined();
  });

  it("parses collapse with formatted content", () => {
    const doc = parse("|> Details\n**Bold text** and [link](https://example.com)\n/>");
    const collapse = doc.content[0] as any;
    const para = collapse.children.find((c: any) => c.type === "paragraph");
    expect(para).toBeDefined();
  });

  it("handles unclosed collapse gracefully", () => {
    const doc = parse("|> Unclosed\nSome content");
    expect(doc.content[0]).toMatchObject({
      type: "collapse",
    });
  });

  it("parses multiple collapses", () => {
    const doc = parse("|> First\nContent 1\n/>\n\n|> Second\nContent 2\n/>");
    expect(doc.content.filter((n: any) => n.type === "collapse").length).toBe(2);
  });
});

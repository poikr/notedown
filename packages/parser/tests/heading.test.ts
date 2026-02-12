import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Heading Parser", () => {
  it("parses H1", () => {
    const doc = parse("# Hello World");
    expect(doc.content[0]).toMatchObject({
      type: "heading",
      level: 1,
    });
    const heading = doc.content[0] as any;
    expect(heading.children[0]).toMatchObject({ type: "text", value: "Hello World" });
  });

  it("parses H2 through H6", () => {
    for (let level = 2; level <= 6; level++) {
      const hashes = "#".repeat(level);
      const doc = parse(`${hashes} Level ${level}`);
      expect(doc.content[0]).toMatchObject({
        type: "heading",
        level,
      });
    }
  });

  it("parses heading with inline decorations", () => {
    const doc = parse("# **Bold** Heading");
    const heading = doc.content[0] as any;
    expect(heading.children.length).toBeGreaterThan(1);
    expect(heading.children[0]).toMatchObject({ type: "bold" });
  });

  it("parses heading with meta reference", () => {
    const doc = parse("@meta title=My Title\n\n# @{title}");
    const heading = doc.content[0] as any;
    expect(heading.children[0]).toMatchObject({ type: "metaRef", key: "title" });
  });
});

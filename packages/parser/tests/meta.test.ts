import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Meta Parser", () => {
  it("parses single meta definition", () => {
    const doc = parse("@meta title=Hello\n\nContent");
    expect(doc.metadata).toEqual({ title: "Hello" });
    expect(doc.content.length).toBe(1);
  });

  it("parses multiple meta definitions", () => {
    const doc = parse("@meta title=Hello\n@meta author=World\n\nContent");
    expect(doc.metadata).toEqual({ title: "Hello", author: "World" });
  });

  it("preserves value with equals sign", () => {
    const doc = parse("@meta equation=a=b+c\n\nContent");
    expect(doc.metadata.equation).toBe("a=b+c");
  });

  it("stops meta parsing at first non-meta non-blank line", () => {
    const doc = parse("@meta title=Test\nRegular text\n@meta ignored=yes");
    expect(doc.metadata).toEqual({ title: "Test" });
    // The rest becomes content
    expect(doc.content.length).toBeGreaterThan(0);
  });

  it("handles escaped meta at document top", () => {
    const doc = parse("\\@meta this is normal text");
    expect(doc.metadata).toEqual({});
    expect(doc.content.length).toBe(1);
  });

  it("handles document with no meta", () => {
    const doc = parse("Just regular text");
    expect(doc.metadata).toEqual({});
    expect(doc.content.length).toBe(1);
  });

  it("skips blank lines between meta definitions", () => {
    const doc = parse("@meta title=Hello\n\n@meta author=World\n\nContent");
    expect(doc.metadata).toEqual({ title: "Hello", author: "World" });
  });

  it("treats mid-document @meta as regular text", () => {
    const doc = parse("@meta title=Test\n\nSome text\n@meta this is not meta");
    expect(doc.metadata).toEqual({ title: "Test" });
  });
});

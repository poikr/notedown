import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Integration Tests", () => {
  it("parses a complete document", () => {
    const input = `@meta title=My Blog
@meta author=John

# @{title}

Written by **@{author}**.

This is a paragraph with *italic*, __underline__, and ~~strikethrough~~.

|red,This text is red| and |f#00FF00,this is green|.

\`\`\`python
def hello():
    print("Hello!")
\`\`\`

| Feature | Status |
|---------|--------|
| Parser | Done |
| Renderer | WIP |

> This is a blockquote.
>info> This has an info icon.

|> Click to expand
This is hidden content with **bold**.
/>

![w#200px,a#center,logo](./logo.png)

[Visit Google](https://google.com)`;

    const doc = parse(input);

    // Metadata
    expect(doc.metadata).toEqual({ title: "My Blog", author: "John" });

    // Content types
    const types = doc.content.map(n => n.type);
    expect(types).toContain("heading");
    expect(types).toContain("paragraph");
    expect(types).toContain("codeBlock");
    expect(types).toContain("table");
    expect(types).toContain("blockquote");
    expect(types).toContain("collapse");
  });

  it("handles empty document", () => {
    const doc = parse("");
    expect(doc.metadata).toEqual({});
    expect(doc.content).toEqual([]);
  });

  it("handles document with only metadata", () => {
    const doc = parse("@meta title=Test");
    expect(doc.metadata).toEqual({ title: "Test" });
    expect(doc.content).toEqual([]);
  });
});

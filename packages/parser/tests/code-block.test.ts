import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Code Block Parser", () => {
  it("parses code block with language", () => {
    const doc = parse("```python\ndef hello():\n    print('hi')\n```");
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "python",
      content: "def hello():\n    print('hi')",
      isIframe: false,
    });
  });

  it("parses code block without language", () => {
    const doc = parse("```\nsome code\n```");
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "",
      content: "some code",
    });
  });

  it("parses iframe code block", () => {
    const doc = parse('```iframe\n<div>Hello</div>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
    });
  });

  it("preserves whitespace and special characters", () => {
    const doc = parse("```\n  indented\n    more indented\n  **not bold**\n```");
    const block = doc.content[0] as any;
    expect(block.content).toBe("  indented\n    more indented\n  **not bold**");
  });

  it("handles unclosed code block gracefully", () => {
    const doc = parse("```python\ncode without closing");
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "python",
    });
  });
});

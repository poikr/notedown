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

  it("parses iframe with width prop", () => {
    const doc = parse('```iframe,w#300px\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeWidth: "300px",
    });
  });

  it("parses iframe with height prop", () => {
    const doc = parse('```iframe,h#100%\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeHeight: "100%",
    });
  });

  it("parses iframe with resize prop - width only", () => {
    const doc = parse('```iframe,r#w\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeResizable: "width",
    });
  });

  it("parses iframe with resize prop - height only", () => {
    const doc = parse('```iframe,r#h\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeResizable: "height",
    });
  });

  it("parses iframe with resize prop - both", () => {
    const doc = parse('```iframe,r#b\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeResizable: "both",
    });
  });

  it("parses iframe with resize prop - none", () => {
    const doc = parse('```iframe,r#n\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeResizable: "none",
    });
  });

  it("parses iframe with multiple props", () => {
    const doc = parse('```iframe,w#500px,h#300px,r#b\n<h1>Test</h1>\n```');
    expect(doc.content[0]).toMatchObject({
      type: "codeBlock",
      language: "iframe",
      isIframe: true,
      iframeWidth: "500px",
      iframeHeight: "300px",
      iframeResizable: "both",
    });
  });

  it("ignores props for non-iframe code blocks", () => {
    const doc = parse('```javascript,w#300px\nconsole.log("test");\n```');
    const block = doc.content[0] as any;
    expect(block.iframeWidth).toBeUndefined();
    expect(block.iframeHeight).toBeUndefined();
    expect(block.iframeResizable).toBeUndefined();
  });
});

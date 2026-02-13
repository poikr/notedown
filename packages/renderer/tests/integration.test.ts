import { describe, it, expect } from "bun:test";
import { notedownToHtml, render } from "../src/index";
import { parse } from "@notedown/parser";

describe("Renderer Integration", () => {
  it("renders a full document end-to-end", () => {
    const input = `@meta title=Demo
@meta author=Test

# @{title}

Written by **@{author}**.

This is a *paragraph* with __underline__ and ~~strike~~.

|red,Red text| and |f#00FF00,green text|.

\`\`\`javascript
console.log("hello");
\`\`\`

| Name | Value |
|------|-------|
| Key | **Val** |

> A quote
>info> An info quote

|> Details
Hidden **content**
/>

![w#200px,a#center,logo](./logo.png)

[Link](https://example.com)`;

    const html = notedownToHtml(input);

    // Check key elements
    expect(html).toContain(">Demo</h1>");
    expect(html).toContain(">Test</strong>");
    expect(html).toContain(">paragraph</em>");
    expect(html).toContain(">underline</u>");
    expect(html).toContain(">strike</del>");
    expect(html).toContain('style="color:red"');
    expect(html).toContain('language-javascript');
    expect(html).toContain("<table");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<details");
    expect(html).toContain('src="./logo.png"');
    expect(html).toContain('href="https://example.com"');
  });

  it("render() accepts parsed document", () => {
    const doc = parse("@meta title=Hi\n\n# @{title}");
    const html = render(doc);
    expect(html).toContain(">Hi</h1>");
  });

  it("handles empty document", () => {
    const html = notedownToHtml("");
    expect(html).toBe("");
  });

  it("renders with dark theme", () => {
    const input = `>info> Information
This is content`;
    const html = notedownToHtml(input, { theme: "dark" });
    expect(html).toContain("<blockquote");
    expect(html).toContain("nd-blockquote-info");
  });

  it("renders with light theme", () => {
    const input = `>warning> Warning
This is a warning`;
    const html = notedownToHtml(input, { theme: "light" });
    expect(html).toContain("<blockquote");
    expect(html).toContain("nd-blockquote-warning");
  });

  it("renders with auto theme", () => {
    const input = `>error> Error
This is an error`;
    const html = notedownToHtml(input, { theme: "auto" });
    expect(html).toContain("<blockquote");
    expect(html).toContain("nd-blockquote-error");
  });
});

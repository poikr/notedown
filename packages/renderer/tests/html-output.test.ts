import { describe, it, expect } from "bun:test";
import { notedownToHtml, getNotedownStyles, getNotedownStyleTag } from "../src/index";

describe("HTML Output", () => {
  describe("Heading", () => {
    it("renders h1-h6", () => {
      expect(notedownToHtml("# Hello")).toContain(">Hello</h1>");
      expect(notedownToHtml("## Hello")).toContain(">Hello</h2>");
      expect(notedownToHtml("### Hello")).toContain(">Hello</h3>");
      expect(notedownToHtml("#### Hello")).toContain(">Hello</h4>");
      expect(notedownToHtml("##### Hello")).toContain(">Hello</h5>");
      expect(notedownToHtml("###### Hello")).toContain(">Hello</h6>");
    });
  });

  describe("Paragraph", () => {
    it("renders paragraph with text", () => {
      expect(notedownToHtml("Hello World")).toContain(">Hello World</p>");
    });

    it("renders multiple paragraphs", () => {
      const html = notedownToHtml("Para 1\n\nPara 2");
      expect(html).toContain(">Para 1</p>");
      expect(html).toContain(">Para 2</p>");
    });

    it("renders line breaks within paragraph", () => {
      const html = notedownToHtml("Line 1\nLine 2");
      expect(html).toContain("Line 1<br");
      expect(html).toContain(">Line 2</p>");
    });
  });

  describe("Text Decoration", () => {
    it("renders bold", () => {
      expect(notedownToHtml("**bold**")).toContain("<strong");
      expect(notedownToHtml("**bold**")).toContain(">bold</strong>");
    });

    it("renders italic", () => {
      expect(notedownToHtml("*italic*")).toContain("<em");
      expect(notedownToHtml("*italic*")).toContain(">italic</em>");
    });

    it("renders underline", () => {
      expect(notedownToHtml("__underline__")).toContain("<u");
      expect(notedownToHtml("__underline__")).toContain(">underline</u>");
    });

    it("renders strikethrough", () => {
      expect(notedownToHtml("~~strike~~")).toContain("<del");
      expect(notedownToHtml("~~strike~~")).toContain(">strike</del>");
    });

    it("renders bold+italic", () => {
      const html = notedownToHtml("***both***");
      expect(html).toContain("<strong");
      expect(html).toContain("<em");
      expect(html).toContain(">both</em>");
    });

    it("renders inline code", () => {
      expect(notedownToHtml("`code`")).toContain("<code");
      expect(notedownToHtml("`code`")).toContain(">code</code>");
    });

    it("renders latex with KaTeX", () => {
      const html = notedownToHtml("$E=mc^2$");
      expect(html).toContain("nd-latex");
      expect(html).toContain("katex");
    });
  });

  describe("Color", () => {
    it("renders foreground color", () => {
      const html = notedownToHtml("|red,text|");
      expect(html).toContain('style="color:red"');
      expect(html).toContain("text");
    });

    it("renders background color", () => {
      const html = notedownToHtml("|b#blue,text|");
      expect(html).toContain("background-color:blue");
    });

    it("renders both foreground and background", () => {
      const html = notedownToHtml("|f#red,b#blue,text|");
      expect(html).toContain("color:red");
      expect(html).toContain("background-color:blue");
    });
  });

  describe("Link", () => {
    it("renders link", () => {
      const html = notedownToHtml("[Google](https://google.com)");
      expect(html).toContain('href="https://google.com"');
      expect(html).toContain(">Google</a>");
    });

    it("renders link with bold text", () => {
      const html = notedownToHtml("[**Bold**](https://example.com)");
      expect(html).toContain("<strong");
      expect(html).toContain(">Bold</strong>");
      expect(html).toContain('href="https://example.com"');
    });
  });

  describe("Image", () => {
    it("renders basic image", () => {
      const html = notedownToHtml("![alt](./img.png)");
      expect(html).toContain('src="./img.png"');
      expect(html).toContain('alt="alt"');
    });

    it("renders image with width", () => {
      const html = notedownToHtml("![w#100px,alt](./img.png)");
      expect(html).toContain('width="100px"');
    });

    it("renders image with alignment", () => {
      const html = notedownToHtml("![a#center,alt](./img.png)");
      expect(html).toContain("margin-left:auto");
      expect(html).toContain("margin-right:auto");
    });

    it("renders linked image", () => {
      const html = notedownToHtml("[![alt](./img.png)](https://example.com)");
      expect(html).toContain('href="https://example.com"');
      expect(html).toContain("<img");
    });
  });

  describe("Code Block", () => {
    it("renders code block with language", () => {
      const html = notedownToHtml("```python\nprint('hi')\n```");
      expect(html).toContain('<pre class="nd-codeblock">');
      expect(html).toContain('language-python');
      expect(html).toContain("hljs");
      expect(html).toContain("print");
    });

    it("renders code block with syntax highlighting", () => {
      const html = notedownToHtml("```javascript\nconst x = 42;\n```");
      expect(html).toContain("hljs-keyword");
      expect(html).toContain("hljs-number");
    });

    it("renders code block language header", () => {
      const html = notedownToHtml("```typescript\nconst x: number = 1;\n```");
      expect(html).toContain("nd-codeblock-header");
      expect(html).toContain("nd-codeblock-lang");
      expect(html).toContain("typescript");
    });

    it("renders code block without language with auto-detect", () => {
      const html = notedownToHtml("```\nplain text\n```");
      expect(html).toContain('<pre class="nd-codeblock">');
      expect(html).toContain("hljs");
    });

    it("renders copy button in code block", () => {
      const html = notedownToHtml("```javascript\nconst x = 1;\n```");
      expect(html).toContain("nd-codeblock-copy");
      expect(html).toContain("nd-copy-icon");
      expect(html).toContain("nd-copy-label");
      expect(html).toContain("navigator.clipboard");
    });

    it("renders copy button even without language", () => {
      const html = notedownToHtml("```\nsome code\n```");
      expect(html).toContain("nd-codeblock-copy");
    });

    it("renders iframe code block with trust prompt", () => {
      const html = notedownToHtml("```iframe\n<div>Hello</div>\n```");
      expect(html).toContain("nd-iframe-trust");
      expect(html).toContain("nd-iframe-trust-btn");
      expect(html).toContain("Trust &amp; Run Code");
      expect(html).toContain("nd-iframe-trust-preview");
      expect(html).toContain("&lt;div&gt;Hello&lt;/div&gt;");
    });
  });

  describe("Table", () => {
    it("renders basic table", () => {
      const html = notedownToHtml("| H1 | H2 |\n|---|---|\n| D1 | D2 |");
      expect(html).toContain("<table");
      expect(html).toContain("<thead>");
      expect(html).toContain(">H1</th>");
      expect(html).toContain(">D1</td>");
    });

    it("renders table with alignment", () => {
      const html = notedownToHtml("| L | C | R |\n|:---|:---:|---:|\n| a | b | c |");
      expect(html).toContain('style="text-align:center"');
      expect(html).toContain('style="text-align:right"');
    });
  });

  describe("Blockquote", () => {
    it("renders basic blockquote", () => {
      const html = notedownToHtml("> Quoted text");
      expect(html).toContain("<blockquote");
      expect(html).toContain("Quoted text");
    });

    it("renders blockquote with icon", () => {
      const html = notedownToHtml(">info> Info text");
      expect(html).toContain("material-icons");
      expect(html).toContain("info");
    });

    it("renders question blockquote with help icon", () => {
      const html = notedownToHtml(">question> Question text");
      expect(html).toContain("nd-blockquote-question");
      expect(html).toContain(">help</span>");
      expect(html).not.toContain(">question</span>");
    });

    it("renders blockquote with title", () => {
      const html = notedownToHtml(">warning,t#경고> Warning text");
      expect(html).toContain("nd-blockquote-title");
      expect(html).toContain("경고");
      expect(html).toContain("material-icons");
    });

    it("renders blockquote with custom color via inline styles", () => {
      const html = notedownToHtml(">info,c#blue> Info text");
      expect(html).toContain("border-left-color:blue");
      expect(html).toContain("color-mix");
      expect(html).not.toContain("nd-blockquote-info");
    });

    it("renders blockquote with all options", () => {
      const html = notedownToHtml(">error,t#오류,c#red> Error text");
      expect(html).toContain("오류");
      expect(html).toContain("border-left-color:red");
      expect(html).toContain("material-icons");
      expect(html).toContain("nd-blockquote-title");
    });

    it("renders icon-only blockquote without title element", () => {
      const html = notedownToHtml(">info> text");
      expect(html).toContain("nd-blockquote-info");
      expect(html).not.toContain("nd-blockquote-title");
    });
  });

  describe("Collapse", () => {
    it("renders collapse with title", () => {
      const html = notedownToHtml("|> Title\nContent\n/>");
      expect(html).toContain("<details");
      expect(html).toContain("<summary");
      expect(html).toContain(">Title</summary>");
      expect(html).toContain("Content");
    });
  });

  describe("Meta Resolution", () => {
    it("resolves meta references", () => {
      const html = notedownToHtml("@meta title=Hello\n\n# @{title}");
      expect(html).toContain(">Hello</h1>");
    });

    it("preserves unresolved meta references", () => {
      const html = notedownToHtml("@{unknown}");
      expect(html).toContain("@{unknown}");
    });
  });

  describe("HTML Escaping", () => {
    it("escapes HTML entities in text", () => {
      const html = notedownToHtml("<script>alert('xss')</script>");
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });
  });

  describe("Styles", () => {
    it("getNotedownStyles returns CSS with blockquote rules", () => {
      const css = getNotedownStyles();
      expect(css).toContain(".nd-blockquote");
      expect(css).toContain(".nd-blockquote-info");
      expect(css).toContain(".nd-blockquote-warning");
      expect(css).toContain(".nd-blockquote-error");
      expect(css).toContain(".nd-blockquote-question");
      expect(css).toContain("border-left");
    });

    it("getNotedownStyles returns CSS with code block rules", () => {
      const css = getNotedownStyles();
      expect(css).toContain(".nd-codeblock");
      expect(css).toContain("border-radius");
      expect(css).toContain(".nd-codeblock-header");
      expect(css).toContain(".nd-codeblock-lang");
      expect(css).toContain(".nd-codeblock-copy");
      expect(css).toContain(".nd-copy-icon");
      expect(css).toContain("nd-fade-in");
    });

    it("getNotedownStyles returns CSS with syntax highlighting rules", () => {
      const css = getNotedownStyles();
      expect(css).toContain(".hljs-keyword");
      expect(css).toContain(".hljs-string");
      expect(css).toContain(".hljs-comment");
      expect(css).toContain(".hljs-number");
      expect(css).toContain(".hljs-title");
    });

    it("getNotedownStyleTag wraps CSS in style tag", () => {
      const tag = getNotedownStyleTag();
      expect(tag).toStartWith("<style>");
      expect(tag).toEndWith("</style>");
      expect(tag).toContain(".nd-blockquote");
    });
  });

  describe("LaTeX with KaTeX", () => {
    it("renders simple expression", () => {
      const html = notedownToHtml("$E=mc^2$");
      expect(html).toContain("katex");
      expect(html).toContain("nd-latex");
    });

    it("renders fraction", () => {
      const html = notedownToHtml("$\\frac{a}{b}$");
      expect(html).toContain("katex");
      expect(html).toContain("frac");
    });

    it("renders sqrt", () => {
      const html = notedownToHtml("$\\sqrt{x}$");
      expect(html).toContain("katex");
    });

    it("handles invalid LaTeX gracefully", () => {
      const html = notedownToHtml("$\\invalid{$");
      // Should not throw, still renders something
      expect(html).toContain("nd-latex");
    });
  });
});

import { describe, it, expect } from "bun:test";
import type { TextState } from "../src/actions/types";
import {
  boldAction,
  italicAction,
  boldItalicAction,
  underlineAction,
  strikethroughAction,
  inlineCodeAction,
  latexAction,
  colorAction,
  linkAction,
  imageAction,
} from "../src/actions/wrap-actions";
import {
  h1Action,
  h2Action,
  h3Action,
  blockquoteAction,
  prefixAction,
} from "../src/actions/prefix-actions";
import {
  codeBlockAction,
  tableAction,
  collapseAction,
} from "../src/actions/block-actions";

function state(value: string, start: number, end: number): TextState {
  return { value, selectionStart: start, selectionEnd: end };
}

describe("Wrap Actions", () => {
  it("wraps selected text with bold", () => {
    const result = boldAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello **world**");
    expect(result.newSelectionStart).toBe(8);
    expect(result.newSelectionEnd).toBe(13);
  });

  it("inserts bold placeholder when no selection", () => {
    const result = boldAction(state("hello ", 6, 6));
    expect(result.newValue).toBe("hello **text**");
    expect(result.newSelectionStart).toBe(8);
    expect(result.newSelectionEnd).toBe(12);
  });

  it("wraps with italic", () => {
    const result = italicAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello *world*");
  });

  it("wraps with bold+italic", () => {
    const result = boldItalicAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello ***world***");
  });

  it("wraps with underline", () => {
    const result = underlineAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello __world__");
  });

  it("wraps with strikethrough", () => {
    const result = strikethroughAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello ~~world~~");
  });

  it("wraps with inline code", () => {
    const result = inlineCodeAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello `world`");
  });

  it("wraps with latex", () => {
    const result = latexAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello $world$");
  });

  it("inserts color with selection", () => {
    const result = colorAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello |red,world|");
    // Selects "red" for easy replacement
    expect(result.newSelectionStart).toBe(7);
    expect(result.newSelectionEnd).toBe(10);
  });

  it("inserts color without selection", () => {
    const result = colorAction(state("hello ", 6, 6));
    expect(result.newValue).toBe("hello |red,text|");
    expect(result.newSelectionStart).toBe(7);
    expect(result.newSelectionEnd).toBe(10);
  });

  it("inserts link with selection as text", () => {
    const result = linkAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello [world](url)");
    // Selects "url" for easy replacement
    expect(result.newSelectionStart).toBe(14);
    expect(result.newSelectionEnd).toBe(17);
  });

  it("inserts link without selection", () => {
    const result = linkAction(state("hello ", 6, 6));
    expect(result.newValue).toBe("hello [text](url)");
    // Selects "text" for easy replacement
    expect(result.newSelectionStart).toBe(7);
    expect(result.newSelectionEnd).toBe(11);
  });

  it("inserts image with selection as alt", () => {
    const result = imageAction(state("hello world", 6, 11));
    expect(result.newValue).toBe("hello ![world](url)");
    expect(result.newSelectionStart).toBe(15);
    expect(result.newSelectionEnd).toBe(18);
  });

  it("inserts image without selection", () => {
    const result = imageAction(state("hello ", 6, 6));
    expect(result.newValue).toBe("hello ![alt](url)");
    expect(result.newSelectionStart).toBe(8);
    expect(result.newSelectionEnd).toBe(11);
  });
});

describe("Prefix Actions", () => {
  it("adds h1 prefix", () => {
    const result = h1Action(state("Hello", 0, 0));
    expect(result.newValue).toBe("# Hello");
    expect(result.newSelectionStart).toBe(2);
  });

  it("adds h2 prefix", () => {
    const result = h2Action(state("Hello", 0, 0));
    expect(result.newValue).toBe("## Hello");
  });

  it("adds h3 prefix", () => {
    const result = h3Action(state("Hello", 0, 0));
    expect(result.newValue).toBe("### Hello");
  });

  it("adds blockquote prefix", () => {
    const result = blockquoteAction(state("Hello", 0, 0));
    expect(result.newValue).toBe("> Hello");
  });

  it("adds prefix to middle line", () => {
    const result = h1Action(state("Line 1\nLine 2\nLine 3", 7, 7));
    expect(result.newValue).toBe("Line 1\n# Line 2\nLine 3");
    expect(result.newSelectionStart).toBe(9);
  });

  it("adds prefix to last line without trailing newline", () => {
    const result = blockquoteAction(state("Line 1\nLine 2", 7, 7));
    expect(result.newValue).toBe("Line 1\n> Line 2");
  });

  it("preserves selection offset after prefix", () => {
    const result = h1Action(state("Hello World", 6, 11));
    expect(result.newValue).toBe("# Hello World");
    expect(result.newSelectionStart).toBe(8);
    expect(result.newSelectionEnd).toBe(13);
  });
});

describe("Block Actions", () => {
  it("inserts code block", () => {
    const result = codeBlockAction(state("", 0, 0));
    expect(result.newValue).toBe("```\ncode\n```");
    // Cursor at lang position (after ```)
    expect(result.newSelectionStart).toBe(3);
    expect(result.newSelectionEnd).toBe(3);
  });

  it("inserts code block with selected text as content", () => {
    const result = codeBlockAction(state("print('hi')", 0, 11));
    expect(result.newValue).toBe("```\nprint('hi')\n```");
  });

  it("inserts code block with newline before if needed", () => {
    const result = codeBlockAction(state("Hello", 5, 5));
    expect(result.newValue).toBe("Hello\n```\ncode\n```");
  });

  it("inserts table", () => {
    const result = tableAction(state("", 0, 0));
    expect(result.newValue).toBe("| Header | Header |\n|---|---|\n| Data | Data |");
    // Selects first "Header"
    expect(result.newSelectionStart).toBe(2);
    expect(result.newSelectionEnd).toBe(8);
  });

  it("inserts table with newline before if needed", () => {
    const result = tableAction(state("Hello", 5, 5));
    expect(result.newValue).toContain("Hello\n| Header");
  });

  it("inserts collapse", () => {
    const result = collapseAction(state("", 0, 0));
    expect(result.newValue).toBe("|> Title\nContent\n/>");
    // Selects "Title"
    expect(result.newSelectionStart).toBe(3);
    expect(result.newSelectionEnd).toBe(8);
  });

  it("inserts collapse with selected text as content", () => {
    const result = collapseAction(state("Some text", 0, 9));
    expect(result.newValue).toBe("|> Title\nSome text\n/>");
  });

  it("adds newline before block when not at start", () => {
    const result = collapseAction(state("Hello", 5, 5));
    expect(result.newValue).toBe("Hello\n|> Title\nContent\n/>");
  });

  it("no duplicate newline when already on new line", () => {
    const result = codeBlockAction(state("Hello\n", 6, 6));
    expect(result.newValue).toBe("Hello\n```\ncode\n```");
  });
});

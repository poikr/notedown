import type { BlockNode, InlineNode, NotedownDocument } from "@notedown/parser";
import { escapeHtml, escapeHtmlAttr } from "./sanitize";
import { renderHeading } from "./node-renderers/heading";
import { renderParagraph } from "./node-renderers/paragraph";
import { renderCodeBlock } from "./node-renderers/code-block";
import { renderTable } from "./node-renderers/table";
import { renderBlockquote } from "./node-renderers/blockquote";
import { renderCollapse } from "./node-renderers/collapse";
import { renderColor } from "./node-renderers/color";
import { renderImage } from "./node-renderers/image";
import { renderLink } from "./node-renderers/link";
import { renderLatex } from "./node-renderers/latex";
import type { RenderOptions } from "./index";

export function renderDocument(doc: NotedownDocument, options?: RenderOptions): string {
  const theme = options?.theme ?? "light";
  return doc.content.map(node => renderBlock(node, theme)).join("\n");
}

export function renderBlock(node: BlockNode, theme: "light" | "dark" | "auto" = "light"): string {
  switch (node.type) {
    case "heading":
      return renderHeading(node, renderInlineChildren);
    case "paragraph":
      return renderParagraph(node, renderInlineChildren);
    case "codeBlock":
      return renderCodeBlock(node);
    case "table":
      return renderTable(node, renderInlineChildren);
    case "blockquote":
      return renderBlockquote(node, (n) => renderBlock(n, theme), renderInlineChildren, theme);
    case "collapse":
      return renderCollapse(node, (n) => renderBlock(n, theme), renderInlineChildren);
    case "error":
      return `<div class="nd-error" data-line="${node.line}">${escapeHtml(node.message)}</div>`;
  }
}

export function renderInlineChildren(nodes: InlineNode[]): string {
  return nodes.map(renderInline).join("");
}

export function renderInline(node: InlineNode): string {
  switch (node.type) {
    case "text":
      return escapeHtml(node.value);
    case "bold":
      return `<strong class="nd-bold">${renderInlineChildren(node.children)}</strong>`;
    case "italic":
      return `<em class="nd-italic">${renderInlineChildren(node.children)}</em>`;
    case "boldItalic":
      return `<strong class="nd-bold"><em class="nd-italic">${renderInlineChildren(node.children)}</em></strong>`;
    case "underline":
      return `<u class="nd-underline">${renderInlineChildren(node.children)}</u>`;
    case "strikethrough":
      return `<del class="nd-strikethrough">${renderInlineChildren(node.children)}</del>`;
    case "inlineCode":
      return `<code class="nd-inline-code">${escapeHtml(node.value)}</code>`;
    case "latex":
      return renderLatex(node);
    case "color":
      return renderColor(node, renderInlineChildren);
    case "link":
      return renderLink(node, renderInlineChildren);
    case "image":
      return renderImage(node);
    case "metaRef":
      return `<span class="nd-meta-ref" data-key="${escapeHtmlAttr(node.key)}">@{${escapeHtml(node.key)}}</span>`;
    case "lineBreak":
      return '<br class="nd-br">';
  }
}

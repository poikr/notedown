import type { LatexNode } from "@notedown/parser";
import katex from "katex";

export function renderLatex(node: LatexNode): string {
  try {
    const html = katex.renderToString(node.value, {
      throwOnError: false,
      output: "htmlAndMathml",
    });
    return `<span class="nd-latex">${html}</span>`;
  } catch {
    return `<span class="nd-latex nd-latex-error">${node.value}</span>`;
  }
}

import type { CodeBlockNode } from "@notedown/parser";
import hljs from "highlight.js";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

export function renderCodeBlock(node: CodeBlockNode): string {
  if (node.isIframe) {
    return `<iframe srcdoc="${escapeHtmlAttr(node.content)}" sandbox="allow-scripts" class="nd-iframe"></iframe>`;
  }

  let highlightedCode: string;
  let detectedLang = node.language ?? "";

  if (node.language) {
    try {
      const result = hljs.highlight(node.content, {
        language: node.language,
        ignoreIllegals: true,
      });
      highlightedCode = result.value;
    } catch {
      // language not registered in hljs — fall back to auto-detect
      highlightedCode = escapeHtml(node.content);
    }
  } else {
    const result = hljs.highlightAuto(node.content);
    highlightedCode = result.value;
    if (result.language) {
      detectedLang = result.language;
    }
  }

  const langClass = detectedLang ? ` class="language-${escapeHtmlAttr(detectedLang)} hljs"` : ' class="hljs"';

  const copyBtn = `<button class="nd-codeblock-copy" onclick="navigator.clipboard.writeText(this.closest('.nd-codeblock').querySelector('code').textContent).then(()=>{this.classList.add('copied');setTimeout(()=>this.classList.remove('copied'),2000)})"><span class="nd-copy-icon"></span><span class="nd-copy-label">Copy</span></button>`;

  const headerContent = detectedLang
    ? `<span class="nd-codeblock-lang">${escapeHtml(detectedLang)}</span>${copyBtn}`
    : copyBtn;

  const header = `<div class="nd-codeblock-header">${headerContent}</div>`;

  return `<pre class="nd-codeblock">${header}<code${langClass}>${highlightedCode}</code></pre>`;
}

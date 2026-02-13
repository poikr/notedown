import type { CodeBlockNode } from "@notedown/parser";
import hljs from "highlight.js";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

export function renderCodeBlock(node: CodeBlockNode): string {
  if (node.isIframe) {
    const iframeId = `nd-iframe-${Math.random().toString(36).slice(2, 10)}`;
    const escapedContent = escapeHtmlAttr(node.content);
    const previewContent = escapeHtml(
      node.content.length > 200 ? node.content.slice(0, 200) + "…" : node.content
    );

    return `<div class="nd-iframe-trust" id="${iframeId}-wrapper">` +
      `<div class="nd-iframe-trust-preview"><pre><code>${previewContent}</code></pre></div>` +
      `<div class="nd-iframe-trust-overlay">` +
        `<div class="nd-iframe-trust-icon">` +
          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
            `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` +
          `</svg>` +
        `</div>` +
        `<p class="nd-iframe-trust-msg">This code block contains embedded HTML/JavaScript that will run in a sandboxed iframe.</p>` +
        `<button class="nd-iframe-trust-btn" onclick="(function(){` +
          `var w=document.getElementById('${iframeId}-wrapper');` +
          `var iframe=document.createElement('iframe');` +
          `iframe.setAttribute('srcdoc','${escapedContent.replace(/'/g, "\\'")}');` +
          `iframe.setAttribute('sandbox','allow-scripts');` +
          `iframe.className='nd-iframe';` +
          `w.parentNode.replaceChild(iframe,w);` +
        `})()">Trust &amp; Run Code</button>` +
      `</div>` +
    `</div>`;
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

import type { CodeBlockNode } from "@notedown/parser";
import hljs from "highlight.js";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

export function renderCodeBlock(node: CodeBlockNode): string {
  if (node.isIframe) {
    const iframeId = `nd-iframe-${Math.random().toString(36).slice(2, 10)}`;
    const previewContent = escapeHtml(
      node.content.length > 200 ? node.content.slice(0, 200) + "…" : node.content
    );
    const fullContent = escapeHtml(node.content);
    // base64로 인코딩 (모든 특수 문자 문제 해결)
    const tEncoded = new TextEncoder().encode(node.content);
    const base64Content = btoa(String.fromCharCode(...tEncoded));

    return `<div class="nd-iframe-trust" id="${iframeId}-wrapper">` +
      `<div class="nd-iframe-trust-preview"><pre><code>${previewContent}</code></pre></div>` +
      `<div class="nd-iframe-trust-overlay">` +
      `<div class="nd-iframe-trust-icon">` +
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
      `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` +
      `</svg>` +
      `</div>` +
      `<p class="nd-iframe-trust-msg">This code block contains embedded HTML/JavaScript that will run in a sandboxed iframe.</p>` +
      `<div class="nd-iframe-trust-actions">` +
      `<button class="nd-iframe-view-btn" onclick="document.getElementById('${iframeId}-modal').style.display='flex'">` +
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
      `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>` +
      `<polyline points="14 2 14 8 20 8"/>` +
      `<line x1="16" y1="13" x2="8" y2="13"/>` +
      `<line x1="16" y1="17" x2="8" y2="17"/>` +
      `<polyline points="10 9 9 9 8 9"/>` +
      `</svg>` +
      `전체 코드 보기` +
      `</button>` +
      `<button class="nd-iframe-trust-btn" onclick="(function(){` +
      `var w=document.getElementById('${iframeId}-wrapper');` +
      `var iframe=document.createElement('iframe');` +
      `iframe.setAttribute('srcdoc', new TextDecoder().decode(Uint8Array.from(atob('${base64Content}'), c => c.charCodeAt(0))));` +
      `iframe.setAttribute('sandbox','allow-scripts');` +
      `iframe.className='nd-iframe';` +
      `w.parentNode.replaceChild(iframe,w);` +
      `})()">Trust &amp; Run Code</button>` +
      `</div>` +
      `</div>` +
      `<div class="nd-iframe-modal" id="${iframeId}-modal" onclick="if(event.target===this)this.style.display='none'">` +
      `<div class="nd-iframe-modal-content">` +
      `<div class="nd-iframe-modal-header">` +
      `<h3>전체 코드</h3>` +
      `<button class="nd-iframe-modal-close" onclick="document.getElementById('${iframeId}-modal').style.display='none'">` +
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
      `<line x1="18" y1="6" x2="6" y2="18"/>` +
      `<line x1="6" y1="6" x2="18" y2="18"/>` +
      `</svg>` +
      `</button>` +
      `</div>` +
      `<div class="nd-iframe-modal-body">` +
      `<pre><code class="nd-iframe-code">${fullContent}</code></pre>` +
      `</div>` +
      `</div>` +
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

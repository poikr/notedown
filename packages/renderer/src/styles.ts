export function getNotedownStyles(): string {
  return `
/* Notedown Blockquote */
.nd-blockquote {
  margin: 1em 0;
  padding: 0.75em 1em;
  border-left: 4px solid #d0d7de;
  background-color: #f6f8fa;
  color: #1f2328;
}

.nd-blockquote .nd-blockquote {
  margin: 0.5em 0;
}

.nd-blockquote-icon {
  vertical-align: middle;
  margin-right: 0.4em;
  font-size: 1.2em;
}

.nd-blockquote-title {
  font-weight: 600;
  vertical-align: middle;
  font-size: 0.95em;
}

/* Info */
.nd-blockquote-info {
  border-left-color: #218bff;
  background-color: #ddf4ff;
}

.nd-blockquote-info > .nd-blockquote-icon,
.nd-blockquote-info > .nd-blockquote-title {
  color: #218bff;
}

/* Warning */
.nd-blockquote-warning {
  border-left-color: #d4a72c;
  background-color: #fff8c5;
}

.nd-blockquote-warning > .nd-blockquote-icon,
.nd-blockquote-warning > .nd-blockquote-title {
  color: #d4a72c;
}

/* Error */
.nd-blockquote-error {
  border-left-color: #cf222e;
  background-color: #ffebe9;
}

.nd-blockquote-error > .nd-blockquote-icon,
.nd-blockquote-error > .nd-blockquote-title {
  color: #cf222e;
}

/* Question */
.nd-blockquote-question {
  border-left-color: #8250df;
  background-color: #fbefff;
}

.nd-blockquote-question > .nd-blockquote-icon,
.nd-blockquote-question > .nd-blockquote-title {
  color: #8250df;
}

/* Notedown Code Block */
.nd-codeblock {
  margin: 1em 0;
  padding: 0;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.nd-codeblock code {
  display: block;
  padding: 1em 1.2em;
  color: #d4d4d4;
  font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}

.nd-codeblock-header {
  display: flex;
  align-items: center;
  padding: 0.4em 1em;
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
}

.nd-codeblock-lang {
  font-size: 0.75em;
  color: #9d9d9d;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Copy Button */
.nd-codeblock-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.2em 0.6em;
  border: 1px solid #555;
  border-radius: 4px;
  background: transparent;
  color: #9d9d9d;
  font-size: 0.75em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nd-codeblock-copy:hover {
  background-color: #404040;
  color: #d4d4d4;
  border-color: #777;
}

.nd-codeblock-copy:active {
  transform: scale(0.95);
}

/* Copy icon (clipboard) */
.nd-copy-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  position: relative;
}

.nd-copy-icon::before,
.nd-copy-icon::after {
  content: '';
  position: absolute;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nd-copy-icon::before {
  width: 9px;
  height: 9px;
  top: 0;
  right: 0;
}

.nd-copy-icon::after {
  width: 9px;
  height: 9px;
  bottom: 0;
  left: 0;
  background-color: #2d2d2d;
}

/* Copied state animation */
.nd-codeblock-copy.copied {
  border-color: #4ec9b0;
  color: #4ec9b0;
}

.nd-codeblock-copy.copied .nd-copy-label {
  display: none;
}

.nd-codeblock-copy.copied::after {
  content: 'Copied!';
  animation: nd-fade-in 0.2s ease;
}

.nd-codeblock-copy.copied .nd-copy-icon::before {
  transform: rotate(-5deg);
}

.nd-codeblock-copy.copied .nd-copy-icon::after {
  border-color: #4ec9b0;
  background-color: transparent;
}

@keyframes nd-fade-in {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Notedown Inline Code */
code {
  background-color: #eff1f3;
  padding: 0.15em 0.4em;
  border-radius: 6px;
  font-size: 0.9em;
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;
}

.nd-codeblock code {
  background-color: transparent;
  padding: 1em 1.2em;
  border-radius: 0;
  font-size: 0.9em;
}

/* Syntax Highlighting (VS Code Dark+ theme) */
.hljs-keyword,
.hljs-selector-tag,
.hljs-type { color: #569cd6; }

.hljs-built_in { color: #4ec9b0; }

.hljs-literal,
.hljs-number { color: #b5cea8; }

.hljs-string,
.hljs-template-variable { color: #ce9178; }

.hljs-regexp { color: #d16969; }

.hljs-title,
.hljs-title.function_ { color: #dcdcaa; }

.hljs-title.class_ { color: #4ec9b0; }

.hljs-params { color: #9cdcfe; }

.hljs-variable,
.hljs-attr { color: #9cdcfe; }

.hljs-property { color: #9cdcfe; }

.hljs-comment,
.hljs-doctag { color: #6a9955; font-style: italic; }

.hljs-meta,
.hljs-meta .hljs-keyword { color: #c586c0; }

.hljs-tag { color: #808080; }
.hljs-tag .hljs-name { color: #569cd6; }
.hljs-tag .hljs-attr { color: #9cdcfe; }

.hljs-name { color: #569cd6; }

.hljs-attribute { color: #9cdcfe; }

.hljs-selector-class,
.hljs-selector-id { color: #d7ba7d; }

.hljs-symbol,
.hljs-bullet { color: #d4d4d4; }

.hljs-section { color: #dcdcaa; }

.hljs-link { color: #569cd6; text-decoration: underline; }

.hljs-operator { color: #d4d4d4; }

.hljs-punctuation { color: #d4d4d4; }

.hljs-addition { color: #b5cea8; background-color: rgba(155, 185, 85, 0.1); }

.hljs-deletion { color: #ce9178; background-color: rgba(206, 145, 120, 0.1); }

.hljs-emphasis { font-style: italic; }

.hljs-strong { font-weight: bold; }

/* Notedown Error Node */
.nd-error {
  margin: 1em 0;
  padding: 0.75em 1em;
  border-left: 4px solid #cf222e;
  background-color: #ffebe9;
  color: #cf222e;
  font-family: monospace;
  font-size: 0.9em;
}

/* Notedown Collapse */
details {
  margin: 0.5em 0;
}

details summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.3em 0;
}

/* Notedown Table */
.nd-blockquote p,
details p {
  margin: 0.3em 0;
}

/* Notedown iframe */
.nd-iframe {
  width: 100%;
  min-height: 150px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}
`.trim();
}

export function getNotedownStyleTag(): string {
  return `<style>${getNotedownStyles()}</style>`;
}

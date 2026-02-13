export function getNotedownStyles(theme: "light" | "dark" | "auto" = "light"): string {
  const isDark = theme === "dark";
  const isAuto = theme === "auto";

  // Light theme colors
  const lightColors = {
    blockquoteBg: '#f6f8fa',
    blockquoteBorder: '#d0d7de',
    blockquoteText: '#1f2328',
    inlineCodeBg: '#eff1f3',
    // Theme-specific callout colors (light mode)
    infoBg: '#ddf4ff',
    infoColor: '#218bff',
    warningBg: '#fff8c5',
    warningColor: '#d4a72c',
    errorBg: '#ffebe9',
    errorColor: '#cf222e',
    questionBg: '#fbefff',
    questionColor: '#8250df',
  };

  // Dark theme colors
  const darkColors = {
    blockquoteBg: '#161b22',
    blockquoteBorder: '#30363d',
    blockquoteText: '#e6edf3',
    inlineCodeBg: '#2d333b',
    // Theme-specific callout colors (dark mode)
    infoBg: '#1c2d41',
    infoColor: '#58a6ff',
    warningBg: '#3d3416',
    warningColor: '#f0c355',
    errorBg: '#3d1319',
    errorColor: '#ff7b72',
    questionBg: '#2d2440',
    questionColor: '#bc8cff',
  };

  const colors = isDark ? darkColors : lightColors;

  return `
/* Notedown Blockquote */
.nd-blockquote {
  margin: 1em 0;
  padding: 0.75em 1em;
  border-left: 4px solid ${colors.blockquoteBorder};
  background-color: ${colors.blockquoteBg};
  color: ${colors.blockquoteText};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-blockquote {
    border-left-color: ${darkColors.blockquoteBorder};
    background-color: ${darkColors.blockquoteBg};
    color: ${darkColors.blockquoteText};
  }
}` : ''}

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
  border-left-color: ${colors.infoColor};
  background-color: ${colors.infoBg};
}

.nd-blockquote-info > .nd-blockquote-icon,
.nd-blockquote-info > .nd-blockquote-title {
  color: ${colors.infoColor};
}

/* Warning */
.nd-blockquote-warning {
  border-left-color: ${colors.warningColor};
  background-color: ${colors.warningBg};
}

.nd-blockquote-warning > .nd-blockquote-icon,
.nd-blockquote-warning > .nd-blockquote-title {
  color: ${colors.warningColor};
}

/* Error */
.nd-blockquote-error {
  border-left-color: ${colors.errorColor};
  background-color: ${colors.errorBg};
}

.nd-blockquote-error > .nd-blockquote-icon,
.nd-blockquote-error > .nd-blockquote-title {
  color: ${colors.errorColor};
}

/* Question */
.nd-blockquote-question {
  border-left-color: ${colors.questionColor};
  background-color: ${colors.questionBg};
}

.nd-blockquote-question > .nd-blockquote-icon,
.nd-blockquote-question > .nd-blockquote-title {
  color: ${colors.questionColor};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-blockquote-info {
    border-left-color: ${darkColors.infoColor};
    background-color: ${darkColors.infoBg};
  }
  .nd-blockquote-info > .nd-blockquote-icon,
  .nd-blockquote-info > .nd-blockquote-title {
    color: ${darkColors.infoColor};
  }

  .nd-blockquote-warning {
    border-left-color: ${darkColors.warningColor};
    background-color: ${darkColors.warningBg};
  }
  .nd-blockquote-warning > .nd-blockquote-icon,
  .nd-blockquote-warning > .nd-blockquote-title {
    color: ${darkColors.warningColor};
  }

  .nd-blockquote-error {
    border-left-color: ${darkColors.errorColor};
    background-color: ${darkColors.errorBg};
  }
  .nd-blockquote-error > .nd-blockquote-icon,
  .nd-blockquote-error > .nd-blockquote-title {
    color: ${darkColors.errorColor};
  }

  .nd-blockquote-question {
    border-left-color: ${darkColors.questionColor};
    background-color: ${darkColors.questionBg};
  }
  .nd-blockquote-question > .nd-blockquote-icon,
  .nd-blockquote-question > .nd-blockquote-title {
    color: ${darkColors.questionColor};
  }
}` : ''}

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
code,
.nd-inline-code {
  background-color: ${colors.inlineCodeBg};
  padding: 0.15em 0.4em;
  border-radius: 6px;
  font-size: 0.9em;
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  code,
  .nd-inline-code {
    background-color: ${darkColors.inlineCodeBg};
  }
}` : ''}

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
details,
.nd-details {
  margin: 0.5em 0;
}

details summary,
.nd-summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.3em 0;
}

/* Notedown Table */
.nd-blockquote p,
.nd-blockquote .nd-p,
details p,
.nd-details .nd-p {
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

export function getNotedownStyleTag(theme: "light" | "dark" | "auto" = "light"): string {
  return `<style>${getNotedownStyles(theme)}</style>`;
}

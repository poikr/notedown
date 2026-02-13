export function getSyntaxHighlightStyles(): string {
  return `
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

.hljs-strong { font-weight: bold; }`;
}

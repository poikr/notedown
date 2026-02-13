import type { ThemeColors } from "./theme-colors";

export function getBaseStyles(
  colors: ThemeColors,
  darkColors: ThemeColors,
  isAuto: boolean,
): string {
  return `
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

/* Notedown Table & Blockquote paragraph spacing */
.nd-blockquote p,
.nd-blockquote .nd-p,
details p,
.nd-details .nd-p {
  margin: 0.3em 0;
}`;
}

import type { ThemeColors } from "./theme-colors";

export function getBlockquoteStyles(
  colors: ThemeColors,
  darkColors: ThemeColors,
  isAuto: boolean,
): string {
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
}` : ''}`;
}

export function getAutoThemeStyles(): string {
  return `
/* Notedown Color auto theme support */
@media (prefers-color-scheme: dark) {
  .nd-color-auto {
    color: var(--nd-color-dark) !important;
    background-color: var(--nd-bg-dark) !important;
  }
}

/* Notedown Blockquote auto theme support */
@media (prefers-color-scheme: dark) {
  .nd-blockquote-auto {
    border-left-color: var(--nd-bq-border-dark) !important;
    background-color: var(--nd-bq-bg-dark) !important;
  }
  .nd-blockquote-icon-auto {
    color: var(--nd-icon-dark) !important;
  }
  .nd-blockquote-title-auto {
    color: var(--nd-title-dark) !important;
  }
}`;
}

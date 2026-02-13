import { lightColors, darkColors } from "./theme-colors";
import { getBlockquoteStyles } from "./blockquote";
import { getCodeBlockStyles } from "./code-block";
import { getBaseStyles } from "./base";
import { getIframeStyles } from "./iframe";
import { getSyntaxHighlightStyles } from "./syntax-highlight";
import { getAutoThemeStyles } from "./auto-theme";

export function getNotedownStyles(theme: "light" | "dark" | "auto" = "light"): string {
  const isDark = theme === "dark";
  const isAuto = theme === "auto";
  const colors = isDark ? darkColors : lightColors;

  return [
    getBlockquoteStyles(colors, darkColors, isAuto),
    getCodeBlockStyles(),
    getBaseStyles(colors, darkColors, isAuto),
    getIframeStyles(isDark, isAuto),
    getSyntaxHighlightStyles(),
    getAutoThemeStyles(),
  ].join("\n").trim();
}

export function getNotedownStyleTag(theme: "light" | "dark" | "auto" = "light"): string {
  return `<style>${getNotedownStyles(theme)}</style>`;
}

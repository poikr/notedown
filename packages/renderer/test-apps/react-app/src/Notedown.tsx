import { notedownToHtml, getNotedownStyles, type RenderOptions } from "@notedown/renderer";
import { useEffect } from "react";

interface NotedownProps {
  source: string;
  className?: string;
  theme?: "light" | "dark" | "auto";
}

let styleElement: HTMLStyleElement | null = null;

function injectStyles(theme: "light" | "dark" | "auto" = "light") {
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "notedown-styles";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = getNotedownStyles(theme);
}

export function Notedown({ source, className, theme = "light" }: NotedownProps) {
  useEffect(() => {
    injectStyles(theme);
  }, [theme]);

  const html = notedownToHtml(source, { theme });
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

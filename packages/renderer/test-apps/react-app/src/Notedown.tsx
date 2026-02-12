import { notedownToHtml, getNotedownStyles } from "@notedown/renderer";
import { useEffect } from "react";

interface NotedownProps {
  source: string;
  className?: string;
}

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement("style");
  style.textContent = getNotedownStyles();
  document.head.appendChild(style);
}

export function Notedown({ source, className }: NotedownProps) {
  useEffect(() => {
    injectStyles();
  }, []);

  const html = notedownToHtml(source);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

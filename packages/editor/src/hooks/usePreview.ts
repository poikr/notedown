import { useState, useEffect, useRef } from "react";
import { notedownToHtml, getNotedownStyles } from "@notedown/renderer";

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = getNotedownStyles();
  document.head.appendChild(style);
}

export function usePreview(value: string, debounceMs = 300) {
  const [html, setHtml] = useState(() => notedownToHtml(value));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setHtml(notedownToHtml(value));
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, debounceMs]);

  return html;
}

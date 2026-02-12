import { useCallback, type RefObject } from "react";
import type { ToolbarAction, TextState } from "../actions/types";

export function useTextManipulation(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (value: string) => void,
) {
  const getTextState = useCallback((): TextState => {
    const el = textareaRef.current;
    if (!el) {
      return { value, selectionStart: value.length, selectionEnd: value.length };
    }
    return {
      value: el.value,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    };
  }, [textareaRef, value]);

  const applyAction = useCallback(
    (action: ToolbarAction) => {
      const state = getTextState();
      const transform = action(state);
      onChange(transform.newValue);

      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(transform.newSelectionStart, transform.newSelectionEnd);
        }
      });
    },
    [getTextState, onChange, textareaRef],
  );

  return { applyAction };
}

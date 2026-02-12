import type { ToolbarAction } from "./types";

export function prefixAction(prefix: string): ToolbarAction {
  return (state) => {
    const lineStart = state.value.lastIndexOf("\n", state.selectionStart - 1) + 1;
    const lineEnd = state.value.indexOf("\n", state.selectionStart);
    const actualLineEnd = lineEnd === -1 ? state.value.length : lineEnd;
    const line = state.value.slice(lineStart, actualLineEnd);

    const newLine = `${prefix}${line}`;
    const newValue =
      state.value.slice(0, lineStart) + newLine + state.value.slice(actualLineEnd);

    return {
      newValue,
      newSelectionStart: state.selectionStart + prefix.length,
      newSelectionEnd: state.selectionEnd + prefix.length,
    };
  };
}

export const h1Action = prefixAction("# ");
export const h2Action = prefixAction("## ");
export const h3Action = prefixAction("### ");
export const h4Action = prefixAction("#### ");
export const h5Action = prefixAction("##### ");
export const h6Action = prefixAction("###### ");
export const blockquoteAction = prefixAction("> ");

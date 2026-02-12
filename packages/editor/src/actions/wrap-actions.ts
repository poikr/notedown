import type { ToolbarAction } from "./types";

export function wrapAction(before: string, after: string): ToolbarAction {
  return (state) => {
    const selected = state.value.slice(state.selectionStart, state.selectionEnd);
    const placeholder = selected || "text";
    const wrapped = `${before}${placeholder}${after}`;
    const newValue =
      state.value.slice(0, state.selectionStart) +
      wrapped +
      state.value.slice(state.selectionEnd);

    if (selected) {
      return {
        newValue,
        newSelectionStart: state.selectionStart + before.length,
        newSelectionEnd: state.selectionStart + before.length + selected.length,
      };
    }
    return {
      newValue,
      newSelectionStart: state.selectionStart + before.length,
      newSelectionEnd: state.selectionStart + before.length + placeholder.length,
    };
  };
}

export const boldAction = wrapAction("**", "**");
export const italicAction = wrapAction("*", "*");
export const boldItalicAction = wrapAction("***", "***");
export const underlineAction = wrapAction("__", "__");
export const strikethroughAction = wrapAction("~~", "~~");
export const inlineCodeAction = wrapAction("`", "`");
export const latexAction = wrapAction("$", "$");

export const colorAction: ToolbarAction = (state) => {
  const selected = state.value.slice(state.selectionStart, state.selectionEnd);
  const placeholder = selected || "text";
  const inserted = `|red,${placeholder}|`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    inserted +
    state.value.slice(state.selectionEnd);

  return {
    newValue,
    newSelectionStart: state.selectionStart + 1,
    newSelectionEnd: state.selectionStart + 4,
  };
};

export const linkAction: ToolbarAction = (state) => {
  const selected = state.value.slice(state.selectionStart, state.selectionEnd);
  const text = selected || "text";
  const inserted = `[${text}](url)`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    inserted +
    state.value.slice(state.selectionEnd);

  if (selected) {
    const urlStart = state.selectionStart + selected.length + 3;
    return {
      newValue,
      newSelectionStart: urlStart,
      newSelectionEnd: urlStart + 3,
    };
  }
  return {
    newValue,
    newSelectionStart: state.selectionStart + 1,
    newSelectionEnd: state.selectionStart + 1 + text.length,
  };
};

export const imageAction: ToolbarAction = (state) => {
  const selected = state.value.slice(state.selectionStart, state.selectionEnd);
  const alt = selected || "alt";
  const inserted = `![${alt}](url)`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    inserted +
    state.value.slice(state.selectionEnd);

  if (selected) {
    const urlStart = state.selectionStart + selected.length + 4;
    return {
      newValue,
      newSelectionStart: urlStart,
      newSelectionEnd: urlStart + 3,
    };
  }
  return {
    newValue,
    newSelectionStart: state.selectionStart + 2,
    newSelectionEnd: state.selectionStart + 2 + alt.length,
  };
};

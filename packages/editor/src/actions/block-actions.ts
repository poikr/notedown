import type { ToolbarAction } from "./types";

function ensureNewlineBefore(value: string, pos: number): string {
  if (pos === 0) return "";
  if (value[pos - 1] === "\n") return "";
  return "\n";
}

function ensureNewlineAfter(value: string, pos: number): string {
  if (pos >= value.length) return "";
  if (value[pos] === "\n") return "";
  return "\n";
}

export function blockInsertAction(template: string): ToolbarAction {
  return (state) => {
    const before = ensureNewlineBefore(state.value, state.selectionStart);
    const after = ensureNewlineAfter(state.value, state.selectionEnd);
    const inserted = `${before}${template}${after}`;
    const newValue =
      state.value.slice(0, state.selectionStart) +
      inserted +
      state.value.slice(state.selectionEnd);

    const cursorPos = state.selectionStart + inserted.length - after.length;
    return {
      newValue,
      newSelectionStart: cursorPos,
      newSelectionEnd: cursorPos,
    };
  };
}

export const codeBlockAction: ToolbarAction = (state) => {
  const selected = state.value.slice(state.selectionStart, state.selectionEnd);
  const code = selected || "code";
  const before = ensureNewlineBefore(state.value, state.selectionStart);
  const after = ensureNewlineAfter(state.value, state.selectionEnd);
  const block = `${before}\`\`\`\n${code}\n\`\`\`${after}`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    block +
    state.value.slice(state.selectionEnd);

  const langPos = state.selectionStart + before.length + 3;
  return {
    newValue,
    newSelectionStart: langPos,
    newSelectionEnd: langPos,
  };
};

export const tableAction: ToolbarAction = (state) => {
  const before = ensureNewlineBefore(state.value, state.selectionStart);
  const after = ensureNewlineAfter(state.value, state.selectionEnd);
  const table = `${before}| Header | Header |\n|---|---|\n| Data | Data |${after}`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    table +
    state.value.slice(state.selectionEnd);

  const headerStart = state.selectionStart + before.length + 2;
  return {
    newValue,
    newSelectionStart: headerStart,
    newSelectionEnd: headerStart + 6,
  };
};

export const collapseAction: ToolbarAction = (state) => {
  const selected = state.value.slice(state.selectionStart, state.selectionEnd);
  const content = selected || "Content";
  const before = ensureNewlineBefore(state.value, state.selectionStart);
  const after = ensureNewlineAfter(state.value, state.selectionEnd);
  const block = `${before}|> Title\n${content}\n/>${after}`;
  const newValue =
    state.value.slice(0, state.selectionStart) +
    block +
    state.value.slice(state.selectionEnd);

  const titleStart = state.selectionStart + before.length + 3;
  return {
    newValue,
    newSelectionStart: titleStart,
    newSelectionEnd: titleStart + 5,
  };
};

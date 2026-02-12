export interface TextState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface TextTransform {
  newValue: string;
  newSelectionStart: number;
  newSelectionEnd: number;
}

export type ToolbarAction = (state: TextState) => TextTransform;

import type { NotedownDocument } from "@notedown/parser";
import { renderDocument } from "./html-renderer";
import { resolveMetaRefs } from "./meta-resolver";
import { parse } from "@notedown/parser";

export interface RenderOptions {
  theme?: "light" | "dark" | "auto";
}

export function render(doc: NotedownDocument, options?: RenderOptions): string {
  const resolved = resolveMetaRefs(doc);
  return renderDocument(resolved, options);
}

export function notedownToHtml(input: string, options?: RenderOptions): string {
  const doc = parse(input);
  return render(doc, options);
}

export { renderDocument, resolveMetaRefs };
export { getNotedownStyles, getNotedownStyleTag } from "./styles";

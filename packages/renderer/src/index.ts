import type { NotedownDocument } from "@notedown/parser";
import { renderDocument } from "./html-renderer";
import { resolveMetaRefs } from "./meta-resolver";
import { parse } from "@notedown/parser";

export function render(doc: NotedownDocument): string {
  const resolved = resolveMetaRefs(doc);
  return renderDocument(resolved);
}

export function notedownToHtml(input: string): string {
  const doc = parse(input);
  return render(doc);
}

export { renderDocument, resolveMetaRefs };
export { getNotedownStyles, getNotedownStyleTag } from "./styles";

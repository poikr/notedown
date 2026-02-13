import type { ImageNode } from "@notedown/parser";
import { escapeHtmlAttr } from "../sanitize";

export function renderImage(node: ImageNode): string {
  const attrs: string[] = [
    'class="nd-img"',
    `src="${escapeHtmlAttr(node.url)}"`,
    `alt="${escapeHtmlAttr(node.alt)}"`,
  ];

  if (node.width) attrs.push(`width="${escapeHtmlAttr(node.width)}"`);
  if (node.height) attrs.push(`height="${escapeHtmlAttr(node.height)}"`);

  const styles: string[] = [];
  if (node.alignment === "center") {
    styles.push("display:block", "margin-left:auto", "margin-right:auto");
  } else if (node.alignment === "right") {
    styles.push("display:block", "margin-left:auto");
  }

  if (styles.length > 0) {
    attrs.push(`style="${styles.join(";")}"`);
  }

  const img = `<img ${attrs.join(" ")}>`;

  if (node.link) {
    return `<a class="nd-img-link" href="${escapeHtmlAttr(node.link)}">${img}</a>`;
  }
  return img;
}

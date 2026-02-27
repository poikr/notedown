import type { VideoNode } from "@notedown/parser";
import { escapeHtml, escapeHtmlAttr } from "../sanitize";

export function renderVideo(node: VideoNode): string {
  if (node.youtube) {
    return renderYoutubeEmbed(node);
  }

  const attrs: string[] = [
    'class="nd-video"',
    `src="${escapeHtmlAttr(node.url)}"`,
    "controls",
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

  return `<video ${attrs.join(" ")}>${escapeHtml(node.alt)}</video>`;
}

function renderYoutubeEmbed(node: VideoNode): string {
  const attrs: string[] = [
    'class="nd-video nd-video-youtube"',
    `src="${escapeHtmlAttr(node.url)}"`,
    `title="${escapeHtmlAttr(node.alt)}"`,
    "frameborder=\"0\"",
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"',
    "allowfullscreen",
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

  return `<iframe ${attrs.join(" ")}></iframe>`;
}

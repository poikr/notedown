import * as vscode from "vscode";
import { parse } from "@notedown/parser";
import { render, getNotedownStyleTag } from "@notedown/renderer";

type PreviewTheme = "auto" | "light" | "dark";

interface PreviewEntry {
  panel: vscode.WebviewPanel;
  uri: vscode.Uri;
}

const previews = new Map<string, PreviewEntry>();

function getTheme(): PreviewTheme {
  const cfg = vscode.workspace.getConfiguration("notedown");
  return (cfg.get<PreviewTheme>("preview.theme") ?? "auto");
}

function buildHtml(source: string, theme: PreviewTheme, csp: string): string {
  let body = "";
  try {
    const doc = parse(source);
    body = render(doc, { theme });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    body = `<pre style="color:#c33;white-space:pre-wrap;">Notedown parse error:\n${escapeHtml(msg)}</pre>`;
  }
  const styles = getNotedownStyleTag(theme);
  const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
${katexCss}
${styles}
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 1.5rem 2rem; max-width: 960px; margin: 0 auto; line-height: 1.6; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function updatePreview(entry: PreviewEntry) {
  vscode.workspace.openTextDocument(entry.uri).then((doc) => {
    const csp = `default-src 'none'; img-src ${entry.panel.webview.cspSource} https: data:; media-src ${entry.panel.webview.cspSource} https: data:; style-src ${entry.panel.webview.cspSource} https: 'unsafe-inline'; font-src https: data:; script-src 'unsafe-inline' https:; frame-src data: https:;`;
    entry.panel.webview.html = buildHtml(doc.getText(), getTheme(), csp);
  });
}

function showPreview(uri: vscode.Uri, side: boolean) {
  const key = uri.toString();
  const existing = previews.get(key);
  if (existing) {
    existing.panel.reveal(side ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active);
    updatePreview(existing);
    return;
  }
  const panel = vscode.window.createWebviewPanel(
    "notedown.preview",
    `Preview: ${uri.path.split("/").pop()}`,
    side ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: true }
  );
  const entry: PreviewEntry = { panel, uri };
  previews.set(key, entry);
  panel.onDidDispose(() => previews.delete(key));
  updatePreview(entry);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("notedown.showPreview", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      showPreview(editor.document.uri, false);
    }),
    vscode.commands.registerCommand("notedown.showPreviewToSide", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      showPreview(editor.document.uri, true);
    }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      const entry = previews.get(e.document.uri.toString());
      if (entry) updatePreview(entry);
    }),
    vscode.workspace.onDidSaveTextDocument((doc) => {
      const entry = previews.get(doc.uri.toString());
      if (entry) updatePreview(entry);
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("notedown.preview")) {
        for (const entry of previews.values()) updatePreview(entry);
      }
    })
  );
}

export function deactivate() {}

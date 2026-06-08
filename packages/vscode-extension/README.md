# Notedown for VS Code

Syntax highlighting and live preview for [Notedown](https://github.com/poikr/notedown) (`.nd`, `.notedown`).

## Features

- TextMate grammar covering headings, meta, paragraphs, blockquotes, collapses, tables, links/images/videos, color syntax, inline code, LaTeX, and fenced code blocks (with embedded HTML inside `iframe` blocks).
- Live preview webview powered by `@notedown/renderer` — updates as you type.
- Theme selector (`auto` / `light` / `dark`) via `notedown.preview.theme`.

## Commands

- `Notedown: Open Preview`
- `Notedown: Open Preview to the Side` (`Cmd/Ctrl+Shift+V`)

## Building

```bash
bun install
bun run --filter @notedown/parser build
bun run --filter @notedown/renderer build
bun run --filter notedown-vscode build
```

Then launch the Extension Development Host in VS Code (`F5`) with this folder open, or package with `vsce package`.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notedown is a TypeScript monorepo implementing a custom markup language parser and HTML renderer. Two main packages: `@notedown/parser` (text → AST) and `@notedown/renderer` (AST → themed HTML).

## Commands

```bash
# Test
bun test --recursive          # All tests (165 tests across 15 files)
bun test packages/parser      # Parser tests only
bun test packages/renderer    # Renderer tests only
bun test packages/parser/tests/color.test.ts  # Single test file

# Build (must build parser before renderer can resolve @notedown/parser)
bun run build                 # Build all packages
bun run typecheck             # TypeScript type check all packages

# Install
bun install                   # Install all workspace dependencies
```

## Architecture

### Parsing Pipeline
`parse(input)` → `parseMeta(lines)` → `parseBlocks(lines)` → `parseInline(text)`

- **meta-parser.ts**: Extracts `@meta key=value` pairs from document header
- **block-parser.ts**: Detects block types by line patterns (code blocks, tables, blockquotes, headings, collapses, paragraphs). Detection order matters.
- **inline-parser.ts**: Main inline parsing loop. Delegates to:
  - **color-parser.ts**: `|f#hex,F#darkHex,text|` color syntax
  - **link-image-parser.ts**: `[text](url)`, `![alt](url)`, `[![alt](img)](link)`
  - Local sub-parsers for bold/italic/underline/strikethrough/code/latex
- **collapse-parser.ts**: Stack-based nested `|> title` ... `/>` parsing. Receives `parseBlocksInContext` as a parameter to avoid circular imports.
- **css-colors.ts**: Named CSS color validation set
- **types.ts**: All AST node type definitions (`BlockNode`, `InlineNode` unions)

### Rendering Pipeline
`notedownToHtml(input)` → `render(doc)` → `resolveMetaRefs(doc)` → `renderDocument(doc)`

- **html-renderer.ts**: Dispatcher — `renderBlock()` and `renderInline()` switch on node type, delegating to individual renderers in `node-renderers/`
- **node-renderers/**: One file per node type. Key complex ones:
  - **code-block.ts**: Regular syntax highlighting (highlight.js) + iframe sandboxing with base64-encoded content and trust UI
  - **blockquote.ts** and **color.ts**: Theme-aware rendering using `resolveThemedColor()` from theme-utils.ts
- **theme-utils.ts**: Shared `resolveThemedColor(light, dark, theme)` returns static value or light/dark pair for CSS custom properties
- **sanitize.ts**: `escapeHtml()` and `escapeHtmlAttr()` — applied to all user content before HTML insertion
- **styles/**: CSS generation split into logical modules (blockquote, code-block, iframe, base, syntax-highlight, auto-theme, theme-colors). Composed in `styles/index.ts`

### Theme System
Three modes: `"light"`, `"dark"`, `"auto"`. Auto mode uses CSS custom properties with `@media (prefers-color-scheme: dark)` rules. Static modes inline the resolved color directly.

## Key Types (packages/parser/src/types.ts)

- `NotedownDocument { metadata: Record<string, string>, content: BlockNode[] }`
- `BlockNode = HeadingNode | ParagraphNode | CodeBlockNode | TableNode | BlockquoteNode | CollapseNode | ErrorNode`
- `InlineNode = TextNode | BoldNode | ItalicNode | ... | ColorNode | LinkNode | ImageNode | MetaRefNode | LineBreakNode`

## Notedown Syntax Highlights

- Colors: `|red,text|`, `|f#FF0000,F#00FF00,text|` (light/dark foreground)
- Blockquotes: `>info,t#Title,c#blue,C#cyan> content`
- Iframe code blocks: `` ```iframe,w#500px,h#300px,r#b ``
- Collapse: `|> title` ... `/>`
- Metadata: `@meta key=value`, referenced as `@{key}`

## Conventions

- Package manager: Bun (not npm/yarn)
- Test framework: Bun's built-in (`describe`/`it`/`expect`)
- File naming: kebab-case for source files
- Test helpers: `packages/parser/tests/test-helpers.ts` provides `assertParagraph()`, `assertHeading()`, etc. for type-safe node assertions (avoid `as any`)
- All user content must pass through `escapeHtml`/`escapeHtmlAttr` before HTML insertion
- Build produces `dist/index.js` (Bun bundle) + `dist/index.d.ts` (TypeScript declarations)

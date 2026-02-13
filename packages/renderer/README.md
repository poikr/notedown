# @notedown/renderer

Worst markdown alternative renderer ever made. Use at your own risk.

## Usage

```typescript
import { notedownToHtml, getNotedownStyles } from '@notedown/renderer';

// Basic usage (light theme)
const html = notedownToHtml('# Hello World');

// Dark theme
const darkHtml = notedownToHtml('>info> Information', { theme: 'dark' });

// Auto theme (uses prefers-color-scheme media query)
const autoHtml = notedownToHtml('>warning> Warning', { theme: 'auto' });

// Get styles
const styles = getNotedownStyles('dark'); // 'light', 'dark', or 'auto'
```

## Theme Support

The renderer supports three theme modes:
- `light`: Light mode colors (default)
- `dark`: Dark mode colors
- `auto`: Automatic theme switching using CSS `prefers-color-scheme`

## Test Apps

To see the theme switching in action, run the test applications:

**React App:**
```bash
cd packages/renderer/test-apps/react-app
bun install
bun run dev
```

**Svelte App:**
```bash
cd packages/renderer/test-apps/svelte-app
bun install
bun run dev
```

Both apps include theme switcher buttons (Light / Dark / Auto) to preview how your Notedown content looks in different themes.

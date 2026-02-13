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

### Theme-Aware Text Colors

When using both light and dark colors in the Notedown syntax (e.g., `|f#000,F#FFF,text|`), the renderer automatically selects the appropriate color based on the theme:

```typescript
// Light theme - uses f# and b# colors
notedownToHtml('|f#000,F#FFF,Theme text|', { theme: 'light' });
// Output: <span style="color:#000">Theme text</span>

// Dark theme - uses F# and B# colors
notedownToHtml('|f#000,F#FFF,Theme text|', { theme: 'dark' });
// Output: <span style="color:#FFF">Theme text</span>

// Auto theme - uses CSS variables
notedownToHtml('|f#000,F#FFF,Theme text|', { theme: 'auto' });
// Output uses CSS custom properties that automatically switch based on prefers-color-scheme
```

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

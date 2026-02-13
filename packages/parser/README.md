# @notedown/parser

Worst markdown alternative parser ever made. Use at your own risk.

## Syntax

### Color Text

Notedown supports colored text with theme-aware colors for light and dark modes.

#### Basic Colors

```notedown
|red,This text is red|
|f#00FF00,This text is green using hex|
|b#yellow,This has a yellow background|
|f#red,b#blue,Red text on blue background|
```

#### Theme-Aware Colors

Use uppercase `F#` and `B#` for dark mode colors:

- `f#` - Foreground color for light mode (or all modes if F# is not specified)
- `F#` - Foreground color for dark mode (or all modes if f# is not specified)
- `b#` - Background color for light mode (or all modes if B# is not specified)
- `B#` - Background color for dark mode (or all modes if b# is not specified)

**Examples:**

```notedown
// Only light mode color - same in both themes
|f#000000,Black text in all themes|

// Only dark mode color - same in both themes
|F#FFFFFF,White text in all themes|

// Different colors for light and dark modes
|f#000000,F#FFFFFF,Black in light mode, white in dark mode|

// Background colors with theme support
|b#FFFFFF,B#000000,White bg in light, black bg in dark|

// All four options
|f#000,F#FFF,b#EEE,B#111,Fully theme-aware text|
```

**Color Behavior:**

1. **Only `f#` or `b#`**: Color applies to all themes (light, dark, and auto)
2. **Only `F#` or `B#`**: Color applies to all themes (light, dark, and auto)
3. **Both `f#` and `F#`**:
   - Light mode: uses `f#` color
   - Dark mode: uses `F#` color
   - Auto mode: switches automatically based on system preference
4. **Both `b#` and `B#`**: Same logic as foreground colors

**Color Formats:**

- Named colors: `red`, `blue`, `yellow`, etc.
- Hex colors: `#FF0000`, `#00FF00`, `#0000FF`
- Short hex: `#F00`, `#0F0`, `#00F` (automatically converted to full hex)

**Escaping:**

Use backslash to escape color tags:

```notedown
\|f#red,This is not colored\|
|\f#red,This is also not colored|
```

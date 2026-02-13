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

### Blockquote/Callout Colors

Blockquotes also support theme-aware colors using `c#` and `C#`:

- `c#` - Color for light mode (or all modes if C# is not specified)
- `C#` - Color for dark mode (or all modes if c# is not specified)

**Examples:**

```notedown
// Only light mode color - same in both themes
>info,c#blue> Information in blue

// Only dark mode color - same in both themes
>warning,C#orange> Warning in orange

// Different colors for light and dark modes
>error,c#red,C#pink> Red in light mode, pink in dark mode

// With title and both colors
>info,t#Notice,c#blue,C#cyan> Complete theme-aware callout
```

### Code Blocks with Iframe

Notedown supports HTML iframe code blocks with customizable properties.

#### Basic Iframe

```notedown
\`\`\`iframe
<h1>Hello World</h1>
<button onclick="alert('Hi!')">Click me</button>
\`\`\`
```

#### Iframe Properties

You can customize iframe dimensions and resizability:

- `w#` - Width (e.g., `w#300px`, `w#100%`, `w#50vw`)
- `h#` - Height (e.g., `h#400px`, `h#100%`, `h#50vh`)
- `r#` - Resize mode:
  - `r#w` - Width only resizable (horizontal)
  - `r#h` - Height only resizable (vertical)
  - `r#b` - Both directions resizable
  - `r#n` - Not resizable (none)

**Examples:**

```notedown
// Iframe with custom width and height, resizable in both directions
\`\`\`iframe,w#500px,h#300px,r#b
<h1>Resizable Iframe</h1>
<p>This iframe is 500px wide, 300px tall, and can be resized in both directions.</p>
\`\`\`

// Full width iframe, not resizable
\`\`\`iframe,w#100%,r#n
<div>Full width, fixed size iframe</div>
\`\`\`

// Custom height, vertically resizable
\`\`\`iframe,h#200px,r#h
<div>This iframe can only be resized vertically</div>
\`\`\`

// Only resize option (defaults to 100% width, 400px height)
\`\`\`iframe,r#b
<p>Default size, fully resizable</p>
\`\`\`
```

**Default Values:**
- Width: `100%` (if not specified)
- Height: `400px` (if not specified)
- Resize: `both` (if not specified)

**Security Note:** Iframe content is sandboxed with `allow-scripts` permission only. Users must explicitly trust and run the code by clicking a button.

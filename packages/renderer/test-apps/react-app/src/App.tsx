import { Notedown } from "./Notedown";
import { useState } from "react";

const sampleDoc = `@meta title=Notedown Demo
@meta author=Test User

# @{title}

Written by **@{author}**.

This is a paragraph with *italic*, __underline__, and ~~strikethrough~~.

|red,This text is red| and |f#00FF00,this is green|.

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

| Feature | Status |
|---------|--------|
| Parser | Done |
| Renderer | Done |

> This is a blockquote.
>info> This is an informational note.
>warning> This is a warning message.
>error> This is an error message.
>question> This is a question.

|> Click to expand
This is hidden content with **bold formatting**.
/>

![w#200px,a#center,Notedown Logo](https://via.placeholder.com/200)

[Visit Example](https://example.com)

## LaTeX Examples

The famous equation $E = mc^2$ by Einstein.

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

Pythagorean theorem: $a^2 + b^2 = c^2$

\`\`\`iframe
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<div style="padding:20px; background:#f0f0f0; border:1px solid #ccc;">
  <h2>Embedded HTML Block</h2>
  <p>This content is rendered from an iframe code block.</p>
</div>
<script>
  let count = 0;
  function increment() {
    count++;
    document.getElementById('count').innerText = count;
  }
</script>
<button onclick="increment()">Click me</button>
<p>Button clicked <span id="count">0</span> times.</p>
</script>
\`\`\`
`;

export function App() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");

  const appBg =
    theme === "dark" ? "#0d1117" : theme === "auto" ? "#fff" : "#fff";
  const appColor = theme === "dark" ? "#e6edf3" : "#1f2328";
  const borderColor = theme === "dark" ? "#30363d" : "#333";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: appBg,
        color: appColor,
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 20,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px solid ${borderColor}`,
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          <h1 style={{ margin: 0 }}>Notedown React Test</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setTheme("light")}
              style={{
                padding: "6px 12px",
                border:
                  theme === "light" ? "2px solid #218bff" : "1px solid #30363d",
                borderRadius: 6,
                background: theme === "light" ? "#ddf4ff" : "transparent",
                color: theme === "light" ? "#218bff" : appColor,
                cursor: "pointer",
                fontWeight: theme === "light" ? 600 : 400,
              }}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              style={{
                padding: "6px 12px",
                border:
                  theme === "dark" ? "2px solid #58a6ff" : "1px solid #30363d",
                borderRadius: 6,
                background: theme === "dark" ? "#1c2d41" : "transparent",
                color: theme === "dark" ? "#58a6ff" : appColor,
                cursor: "pointer",
                fontWeight: theme === "dark" ? 600 : 400,
              }}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme("auto")}
              style={{
                padding: "6px 12px",
                border:
                  theme === "auto" ? "2px solid #8250df" : "1px solid #30363d",
                borderRadius: 6,
                background: theme === "auto" ? "#fbefff" : "transparent",
                color: theme === "auto" ? "#8250df" : appColor,
                cursor: "pointer",
                fontWeight: theme === "auto" ? 600 : 400,
              }}
            >
              Auto
            </button>
          </div>
        </div>
        <Notedown source={sampleDoc} theme={theme} />
      </div>
    </div>
  );
}

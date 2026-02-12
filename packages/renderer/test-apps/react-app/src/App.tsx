import { Notedown } from "./Notedown";

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
`;

export function App() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #333", paddingBottom: 10 }}>Notedown React Test</h1>
      <Notedown source={sampleDoc} />
    </div>
  );
}

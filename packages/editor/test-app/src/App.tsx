import { useState } from "react";
import { NotedownEditor } from "@notedown/editor";

const initialDoc = `@meta title=Notedown Editor Demo
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
| Editor | Done |

> This is a blockquote.
>info> This is an informational note.
>warning,t#Warning!> Be careful with this.
>error,c#purple> Custom colored blockquote.

|> Click to expand
This is hidden content with **bold formatting**.
/>

[Visit Example](https://example.com)

## LaTeX Examples

The famous equation $E = mc^2$ by Einstein.

Pythagorean theorem: $a^2 + b^2 = c^2$
`;

export function App() {
  const [value, setValue] = useState(initialDoc);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #333", paddingBottom: 10, marginBottom: 20 }}>
        Notedown Editor Test
      </h1>
      <NotedownEditor
        value={value}
        onChange={setValue}
        placeholder="Write notedown here..."
      />
    </div>
  );
}

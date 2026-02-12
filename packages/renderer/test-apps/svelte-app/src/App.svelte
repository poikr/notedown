<script lang="ts">
  import Notedown from "./Notedown.svelte";

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

> 이것은 첫 번째 줄의 인용된 텍스트입니다.
> 이것은 두 번째 줄의 인용된 텍스트입니다.
> 이것은 세 번째 줄의 인용된 텍스트입니다.
>> 이것은 인용안의 중첩된 인용입니다.
>> 이것은 중첩된 인용의 두 번째 줄입니다.
> 이것은 다시 첫 번째 수준의 인용입니다.
>> 이것은 첫 번째 수준의 인용의 두 번째 줄입니다.
> 이것은 첫 번째 수준의 인용의 세 번째 줄입니다.
`;
</script>

<div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
  <h1 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Notedown Svelte Test</h1>
  <Notedown source={sampleDoc} />
</div>

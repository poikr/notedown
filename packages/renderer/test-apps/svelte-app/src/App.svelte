<script lang="ts">
  import Notedown from "./Notedown.svelte";

  let theme = $state<"light" | "dark" | "auto">("light");

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

  $effect(() => {
    const appBg = theme === "dark" ? "#0d1117" : "#fff";
    const appColor = theme === "dark" ? "#e6edf3" : "#1f2328";
    document.body.style.backgroundColor = appBg;
    document.body.style.color = appColor;
    document.body.style.transition = "background-color 0.3s, color 0.3s";
  });
</script>

<div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid {theme === 'dark' ? '#30363d' : '#333'}; padding-bottom: 10px; margin-bottom: 20px;">
    <h1 style="margin: 0;">Notedown Svelte Test</h1>
    <div style="display: flex; gap: 8px;">
      <button
        onclick={() => theme = "light"}
        style="
          padding: 6px 12px;
          border: {theme === 'light' ? '2px solid #218bff' : '1px solid #30363d'};
          border-radius: 6px;
          background: {theme === 'light' ? '#ddf4ff' : 'transparent'};
          color: {theme === 'light' ? '#218bff' : theme === 'dark' ? '#e6edf3' : '#1f2328'};
          cursor: pointer;
          font-weight: {theme === 'light' ? 600 : 400};
        "
      >
        Light
      </button>
      <button
        onclick={() => theme = "dark"}
        style="
          padding: 6px 12px;
          border: {theme === 'dark' ? '2px solid #58a6ff' : '1px solid #30363d'};
          border-radius: 6px;
          background: {theme === 'dark' ? '#1c2d41' : 'transparent'};
          color: {theme === 'dark' ? '#58a6ff' : theme === 'dark' ? '#e6edf3' : '#1f2328'};
          cursor: pointer;
          font-weight: {theme === 'dark' ? 600 : 400};
        "
      >
        Dark
      </button>
      <button
        onclick={() => theme = "auto"}
        style="
          padding: 6px 12px;
          border: {theme === 'auto' ? '2px solid #8250df' : '1px solid #30363d'};
          border-radius: 6px;
          background: {theme === 'auto' ? '#fbefff' : 'transparent'};
          color: {theme === 'auto' ? '#8250df' : theme === 'dark' ? '#e6edf3' : '#1f2328'};
          cursor: pointer;
          font-weight: {theme === 'auto' ? 600 : 400};
        "
      >
        Auto
      </button>
    </div>
  </div>
  <Notedown source={sampleDoc} {theme} />
</div>

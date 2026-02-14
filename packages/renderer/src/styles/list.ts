export function getListStyles(): string {
  return `
.nd-ul,
.nd-ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.nd-ul .nd-ul,
.nd-ul .nd-ol,
.nd-ol .nd-ul,
.nd-ol .nd-ol {
  margin: 0.25em 0;
}

.nd-li {
  margin: 0.2em 0;
  line-height: 1.6;
}

.nd-ul {
  list-style-type: disc;
}

.nd-ul .nd-ul {
  list-style-type: circle;
}

.nd-ul .nd-ul .nd-ul {
  list-style-type: square;
}

.nd-ol {
  list-style-type: decimal;
}`;
}

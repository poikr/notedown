export function getCodeBlockStyles(): string {
  return `
/* Notedown Code Block */
.nd-codeblock {
  margin: 1em 0;
  padding: 0;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.nd-codeblock code {
  display: block;
  padding: 1em 1.2em;
  color: #d4d4d4;
  font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}

.nd-codeblock-header {
  display: flex;
  align-items: center;
  padding: 0.4em 1em;
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
}

.nd-codeblock-lang {
  font-size: 0.75em;
  color: #9d9d9d;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Copy Button */
.nd-codeblock-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.2em 0.6em;
  border: 1px solid #555;
  border-radius: 4px;
  background: transparent;
  color: #9d9d9d;
  font-size: 0.75em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nd-codeblock-copy:hover {
  background-color: #404040;
  color: #d4d4d4;
  border-color: #777;
}

.nd-codeblock-copy:active {
  transform: scale(0.95);
}

/* Copy icon (clipboard) */
.nd-copy-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  position: relative;
}

.nd-copy-icon::before,
.nd-copy-icon::after {
  content: '';
  position: absolute;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nd-copy-icon::before {
  width: 9px;
  height: 9px;
  top: 0;
  right: 0;
}

.nd-copy-icon::after {
  width: 9px;
  height: 9px;
  bottom: 0;
  left: 0;
  background-color: #2d2d2d;
}

/* Copied state animation */
.nd-codeblock-copy.copied {
  border-color: #4ec9b0;
  color: #4ec9b0;
}

.nd-codeblock-copy.copied .nd-copy-label {
  display: none;
}

.nd-codeblock-copy.copied::after {
  content: 'Copied!';
  animation: nd-fade-in 0.2s ease;
}

.nd-codeblock-copy.copied .nd-copy-icon::before {
  transform: rotate(-5deg);
}

.nd-codeblock-copy.copied .nd-copy-icon::after {
  border-color: #4ec9b0;
  background-color: transparent;
}

@keyframes nd-fade-in {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}`;
}

export function getIframeStyles(isDark: boolean, isAuto: boolean): string {
  return `
/* Notedown iframe */
.nd-iframe {
  width: 100%;
  min-height: 150px;
  border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  border-radius: 6px;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe {
    border: 1px solid #30363d;
  }
}` : ''}

/* Notedown iframe trust prompt */
.nd-iframe-trust {
  position: relative;
  margin: 1em 0;
  border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  border-radius: 6px;
  overflow: hidden;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust {
    border: 1px solid #30363d;
  }
}` : ''}

.nd-iframe-trust-preview {
  padding: 0.8em 1em;
  background-color: ${isDark ? '#161b22' : '#f6f8fa'};
  max-height: 120px;
  overflow: hidden;
  opacity: 0.5;
  pointer-events: none;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-preview {
    background-color: #161b22;
  }
}` : ''}

.nd-iframe-trust-preview pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 0.8em;
  color: ${isDark ? '#8d96a0' : '#656d76'};
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-preview pre {
    color: #8d96a0;
  }
}` : ''}

.nd-iframe-trust-preview code {
  background: transparent;
  padding: 0;
  font-size: inherit;
}

.nd-iframe-trust-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5em 1em;
  background-color: ${isDark ? '#0d1117' : '#fff'};
  border-top: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  text-align: center;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-overlay {
    background-color: #0d1117;
    border-top: 1px solid #30363d;
  }
}` : ''}

.nd-iframe-trust-icon {
  color: ${isDark ? '#8d96a0' : '#656d76'};
  margin-bottom: 0.5em;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-icon {
    color: #8d96a0;
  }
}` : ''}

.nd-iframe-trust-msg {
  margin: 0 0 1em 0;
  font-size: 0.85em;
  color: ${isDark ? '#8d96a0' : '#656d76'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 400px;
  line-height: 1.4;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-msg {
    color: #8d96a0;
  }
}` : ''}

.nd-iframe-trust-actions {
  display: flex;
  gap: 0.8em;
  align-items: center;
}

.nd-iframe-view-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.5em 1em;
  border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  border-radius: 6px;
  background-color: ${isDark ? '#21262d' : '#fff'};
  color: ${isDark ? '#e6edf3' : '#1f2328'};
  font-size: 0.85em;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nd-iframe-view-btn:hover {
  background-color: ${isDark ? '#30363d' : '#f6f8fa'};
  border-color: ${isDark ? '#3fb950' : '#1f883d'};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-view-btn {
    border: 1px solid #30363d;
    background-color: #21262d;
    color: #e6edf3;
  }
  .nd-iframe-view-btn:hover {
    background-color: #30363d;
    border-color: #3fb950;
  }
}` : ''}

.nd-iframe-view-btn:active {
  transform: scale(0.98);
}

.nd-iframe-view-btn svg {
  flex-shrink: 0;
}

.nd-iframe-trust-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.5em 1.2em;
  border: 1px solid ${isDark ? '#3fb950' : '#1f883d'};
  border-radius: 6px;
  background-color: ${isDark ? '#3fb950' : '#1f883d'};
  color: #fff;
  font-size: 0.85em;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.nd-iframe-trust-btn:hover {
  background-color: ${isDark ? '#46a553' : '#1a7f37'};
  border-color: ${isDark ? '#46a553' : '#1a7f37'};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-trust-btn {
    border: 1px solid #3fb950;
    background-color: #3fb950;
  }
  .nd-iframe-trust-btn:hover {
    background-color: #46a553;
    border-color: #46a553;
  }
}` : ''}

.nd-iframe-trust-btn:active {
  transform: scale(0.98);
}

/* Notedown iframe modal */
.nd-iframe-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, ${isDark ? '0.8' : '0.6'});
  z-index: 10000;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal {
    background-color: rgba(0, 0, 0, 0.8);
  }
}` : ''}

.nd-iframe-modal-content {
  background-color: ${isDark ? '#0d1117' : '#fff'};
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-content {
    background-color: #0d1117;
  }
}` : ''}

.nd-iframe-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 1.2em;
  border-bottom: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  background-color: ${isDark ? '#161b22' : '#f6f8fa'};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-header {
    border-bottom: 1px solid #30363d;
    background-color: #161b22;
  }
}` : ''}

.nd-iframe-modal-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
  color: ${isDark ? '#e6edf3' : '#1f2328'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-header h3 {
    color: #e6edf3;
  }
}` : ''}

.nd-iframe-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: ${isDark ? '#8d96a0' : '#656d76'};
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.nd-iframe-modal-close:hover {
  background-color: ${isDark ? '#30363d' : '#d0d7de'};
  color: ${isDark ? '#e6edf3' : '#1f2328'};
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-close {
    color: #8d96a0;
  }
  .nd-iframe-modal-close:hover {
    background-color: #30363d;
    color: #e6edf3;
  }
}` : ''}

.nd-iframe-modal-close:active {
  transform: scale(0.95);
}

.nd-iframe-modal-body {
  overflow: auto;
  padding: 1.2em;
  background-color: ${isDark ? '#0d1117' : '#fff'};
  flex: 1;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-body {
    background-color: #0d1117;
  }
}` : ''}

.nd-iframe-modal-body pre {
  margin: 0;
  padding: 1em;
  background-color: ${isDark ? '#161b22' : '#f6f8fa'};
  border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9em;
  line-height: 1.6;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-body pre {
    background-color: #161b22;
    border: 1px solid #30363d;
  }
}` : ''}

.nd-iframe-modal-body code {
  font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, 'Courier New', monospace;
  color: ${isDark ? '#e6edf3' : '#1f2328'};
  white-space: pre;
}${isAuto ? `

@media (prefers-color-scheme: dark) {
  .nd-iframe-modal-body code {
    color: #e6edf3;
  }
}` : ''}

.nd-iframe-code {
  width: 100%;
  display: block;
  box-sizing: border-box;
}`;
}

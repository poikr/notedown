export const EDITOR_STYLES = `
.nde-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.nde-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 6px 8px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
}

.nde-toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.nde-toolbar-divider {
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #d0d7de;
  margin: 0 4px;
}

.nde-toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #1f2328;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s;
}

.nde-toolbar-btn:hover {
  background-color: #e1e4e8;
  border-color: #d0d7de;
}

.nde-toolbar-btn:active {
  background-color: #d0d7de;
}

.nde-body {
  display: flex;
  flex-direction: row;
  min-height: 300px;
}

.nde-source {
  flex: 1;
  min-height: 300px;
  padding: 12px;
  border: none;
  border-right: 1px solid #d0d7de;
  outline: none;
  resize: none;
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2328;
  background-color: #fff;
  tab-size: 2;
}

.nde-source::placeholder {
  color: #8b949e;
}

.nde-preview {
  flex: 1;
  min-height: 300px;
  padding: 12px;
  overflow-y: auto;
  background-color: #fff;
  color: #1f2328;
  font-size: 14px;
  line-height: 1.6;
}

.nde-preview > *:first-child {
  margin-top: 0;
}
`.trim();

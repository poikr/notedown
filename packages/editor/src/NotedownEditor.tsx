import { useRef, useCallback, useEffect } from "react";
import type { IRumiOptions } from "./rumi/types";
import type { ToolbarAction } from "./actions/types";
import { Toolbar } from "./components/Toolbar";
import { SourceEditor } from "./components/SourceEditor";
import { Preview } from "./components/Preview";
import { useTextManipulation } from "./hooks/useTextManipulation";
import { usePreview } from "./hooks/usePreview";
import { uploadImage } from "./rumi/api";
import { EDITOR_STYLES } from "./styles/editor-css";

export interface NotedownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rumiOptions?: IRumiOptions;
  className?: string;
  placeholder?: string;
}

let editorStylesInjected = false;

function injectEditorStyles() {
  if (editorStylesInjected) return;
  editorStylesInjected = true;
  const style = document.createElement("style");
  style.textContent = EDITOR_STYLES;
  document.head.appendChild(style);
}

export function NotedownEditor({
  value,
  onChange,
  rumiOptions,
  className,
  placeholder,
}: NotedownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { applyAction } = useTextManipulation(textareaRef, value, onChange);
  const previewHtml = usePreview(value);

  useEffect(() => {
    injectEditorStyles();
  }, []);

  const handleAction = useCallback(
    (action: ToolbarAction) => {
      applyAction(action);
    },
    [applyAction],
  );

  const handleUploadImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !rumiOptions) return;

      try {
        const url = await uploadImage(file, rumiOptions);
        const insertText = `![image](${url})`;
        const el = textareaRef.current;
        const pos = el ? el.selectionStart : value.length;
        const newValue = value.slice(0, pos) + insertText + value.slice(pos);
        onChange(newValue);
      } catch (err) {
        console.error("Image upload failed:", err);
      }

      e.target.value = "";
    },
    [rumiOptions, value, onChange],
  );

  return (
    <div className={`nde-editor${className ? ` ${className}` : ""}`}>
      <Toolbar
        onAction={handleAction}
        rumiOptions={rumiOptions}
        onUploadImage={handleUploadImage}
      />
      <div className="nde-body">
        <SourceEditor
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <Preview html={previewHtml} />
      </div>
      {rumiOptions && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      )}
    </div>
  );
}

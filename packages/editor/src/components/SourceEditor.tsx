import { forwardRef } from "react";

interface SourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SourceEditor = forwardRef<HTMLTextAreaElement, SourceEditorProps>(
  ({ value, onChange, placeholder }, ref) => {
    return (
      <textarea
        ref={ref}
        className="nde-source"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Write notedown here..."}
        spellCheck={false}
      />
    );
  },
);

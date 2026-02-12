import type { ToolbarAction } from "../actions/types";
import type { IRumiOptions } from "../rumi/types";
import {
  boldAction,
  italicAction,
  boldItalicAction,
  underlineAction,
  strikethroughAction,
  inlineCodeAction,
  latexAction,
  colorAction,
  linkAction,
  imageAction,
} from "../actions/wrap-actions";
import {
  h1Action,
  h2Action,
  h3Action,
  h4Action,
  h5Action,
  h6Action,
  blockquoteAction,
} from "../actions/prefix-actions";
import {
  codeBlockAction,
  tableAction,
  collapseAction,
} from "../actions/block-actions";

interface ToolbarButton {
  label: string;
  title: string;
  action: ToolbarAction;
  group: string;
}

const buttons: ToolbarButton[] = [
  { label: "H1", title: "Heading 1", action: h1Action, group: "heading" },
  { label: "H2", title: "Heading 2", action: h2Action, group: "heading" },
  { label: "H3", title: "Heading 3", action: h3Action, group: "heading" },
  { label: "H4", title: "Heading 4", action: h4Action, group: "heading" },
  { label: "H5", title: "Heading 5", action: h5Action, group: "heading" },
  { label: "H6", title: "Heading 6", action: h6Action, group: "heading" },
  { label: "B", title: "Bold", action: boldAction, group: "decoration" },
  { label: "I", title: "Italic", action: italicAction, group: "decoration" },
  { label: "BI", title: "Bold Italic", action: boldItalicAction, group: "decoration" },
  { label: "U", title: "Underline", action: underlineAction, group: "decoration" },
  { label: "S", title: "Strikethrough", action: strikethroughAction, group: "decoration" },
  { label: "<>", title: "Inline Code", action: inlineCodeAction, group: "code" },
  { label: "TeX", title: "LaTeX", action: latexAction, group: "code" },
  { label: "Color", title: "Color", action: colorAction, group: "insert" },
  { label: "Link", title: "Link", action: linkAction, group: "insert" },
  { label: "Image", title: "Image", action: imageAction, group: "insert" },
  { label: "Code", title: "Code Block", action: codeBlockAction, group: "block" },
  { label: "Table", title: "Table", action: tableAction, group: "block" },
  { label: "Quote", title: "Blockquote", action: blockquoteAction, group: "block" },
  { label: "Fold", title: "Collapse", action: collapseAction, group: "block" },
];

interface ToolbarProps {
  onAction: (action: ToolbarAction) => void;
  rumiOptions?: IRumiOptions;
  onUploadImage?: () => void;
}

export function Toolbar({ onAction, rumiOptions, onUploadImage }: ToolbarProps) {
  const groups = ["heading", "decoration", "code", "insert", "block"];

  return (
    <div className="nde-toolbar">
      {groups.map((group, gi) => (
        <span key={group} className="nde-toolbar-group">
          {gi > 0 && <span className="nde-toolbar-divider" />}
          {buttons
            .filter((b) => b.group === group)
            .map((btn) => (
              <button
                key={btn.title}
                className="nde-toolbar-btn"
                title={btn.title}
                onClick={() => onAction(btn.action)}
                type="button"
              >
                {btn.label}
              </button>
            ))}
        </span>
      ))}
      {rumiOptions && (
        <span className="nde-toolbar-group">
          <span className="nde-toolbar-divider" />
          <button
            className="nde-toolbar-btn"
            title="Upload Image"
            onClick={onUploadImage}
            type="button"
          >
            Upload
          </button>
        </span>
      )}
    </div>
  );
}

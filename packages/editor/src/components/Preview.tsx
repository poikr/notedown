interface PreviewProps {
  html: string;
}

export function Preview({ html }: PreviewProps) {
  return (
    <div
      className="nde-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

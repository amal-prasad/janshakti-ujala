import ReactMarkdown from "react-markdown";

// Single Markdown renderer for article bodies — used by the public article page
// (via ArticleBody) and the /newsroom live preview, so both always match.
// Plain-text legacy bodies render unchanged: Markdown paragraphs are exactly
// the blank-line splits the old renderer used.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown-body space-y-4 text-lg leading-relaxed">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

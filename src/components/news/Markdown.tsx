import ReactMarkdown, { type Components } from "react-markdown";
import { parseSocialPost } from "@/lib/utils/socialPosts";
import { SocialPost } from "@/components/news/SocialPost";

// Stable component identities keep third-party widgets mounted when reading
// progress changes or the editor updates a different part of the article.
const components: Components = {
  p({ node, children }) {
    const child = node?.children.length === 1 ? node.children[0] : undefined;
    const value = child?.type === "text" ? child.value
      : child?.type === "element" && child.tagName === "a" ? String(child.properties.href ?? "") : "";
    const post = parseSocialPost(value);
    return post ? <SocialPost post={post} /> : <p>{children}</p>;
  },
};

// Single Markdown renderer for article bodies — used by the public article page
// (via ArticleBody) and the /newsroom live preview, so both always match.
// Plain-text legacy bodies render unchanged: Markdown paragraphs are exactly
// the blank-line splits the old renderer used.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown-body space-y-4 text-lg leading-relaxed">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}

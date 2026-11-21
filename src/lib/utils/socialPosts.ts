export type SocialPost = {
  provider: "twitter" | "instagram" | "youtube";
  id: string;
  url: string;
};

// Only exact provider hosts and public post paths can become embeds. Never use
// pasted HTML, URL credentials, arbitrary iframe sources or query parameters.
export function parseSocialPost(value: string): SocialPost | null {
  let url: URL;
  try { url = new URL(value.trim()); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  if (["x.com", "www.x.com", "twitter.com", "www.twitter.com", "mobile.twitter.com", "mobile.x.com"].includes(host)) {
    const match = url.pathname.match(/^\/(?:([A-Za-z0-9_]{1,15})\/status|i\/web\/status|i\/status)\/(\d{1,25})(?:\/(?:photo|video)\/\d+)?\/?$/);
    if (!match) return null;
    return { provider: "twitter", id: match[2], url: `https://twitter.com/${match[1] ?? "i/web"}/status/${match[2]}` };
  }
  if (["instagram.com", "www.instagram.com"].includes(host)) {
    const match = url.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/);
    if (!match) return null;
    return { provider: "instagram", id: match[2], url: `https://www.instagram.com/${match[1]}/${match[2]}/` };
  }
  if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
    const id = host === "youtu.be" ? url.pathname.slice(1)
      : url.pathname === "/watch" ? url.searchParams.get("v")
      : url.pathname.match(/^\/(?:shorts|live|embed)\/([A-Za-z0-9_-]+)\/?$/)?.[1];
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    return { provider: "youtube", id, url: `https://www.youtube.com/watch?v=${id}` };
  }
  return null;
}

export function insertSocialPost(body: string, value: string, start: number, end: number) {
  const post = parseSocialPost(value);
  if (!post) throw new Error("Unsupported social post URL");
  const before = body.slice(0, start);
  const after = body.slice(end);
  const insertion = `${before && !before.endsWith("\n\n") ? "\n\n" : ""}${post.url}\n\n`;
  return { body: before + insertion + after, cursor: before.length + insertion.length };
}

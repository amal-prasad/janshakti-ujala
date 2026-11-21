"use client";

import { useEffect, useRef, useState } from "react";
import type { SocialPost as Post } from "@/lib/utils/socialPosts";

declare global {
  interface Window {
    twttr?: { widgets: { createTweet: (id: string, element: HTMLElement, options: Record<string, unknown>) => Promise<HTMLElement | undefined> } };
    instgrm?: { Embeds: { process: () => void } };
  }
}

const scripts = new Map<string, Promise<void>>();
function loadScript(src: string): Promise<void> {
  const existing = scripts.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timer);
      script.remove();
      scripts.delete(src);
      reject(new Error("Social embed unavailable"));
    }
    script.src = src;
    script.async = true;
    script.onload = () => { window.clearTimeout(timer); resolve(); };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  scripts.set(src, promise);
  return promise;
}

const names = { twitter: "X / Twitter", instagram: "Instagram", youtube: "YouTube" };

export function SocialPost({ post }: { post: Post }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const root = container.current;
    if (!root || post.provider === "youtube") return;
    let cancelled = false;
    setFailed(false);
    // Give each render its own DOM island: provider scripts may replace children.
    const mount = document.createElement("div");
    root.replaceChildren(mount);
    async function render() {
      try {
        if (post.provider === "twitter") {
          await loadScript("https://platform.twitter.com/widgets.js");
          if (cancelled) return;
          const result = await window.twttr?.widgets.createTweet(post.id, mount, { dnt: true, align: "center" });
          if (!cancelled && !result) setFailed(true);
        } else {
          const block = document.createElement("blockquote");
          block.className = "instagram-media";
          block.dataset.instgrmPermalink = post.url;
          block.dataset.instgrmVersion = "14";
          block.dataset.instgrmCaptioned = "";
          const link = document.createElement("a");
          link.href = post.url;
          link.textContent = "Instagram पर पोस्ट देखें";
          block.appendChild(link);
          mount.appendChild(block);
          await loadScript("https://www.instagram.com/embed.js");
          if (cancelled) return;
          if (!window.instgrm) throw new Error("Instagram unavailable");
          window.instgrm.Embeds.process();
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    // Defer network/script work until the embed approaches the viewport.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void render();
      }
    }, { rootMargin: "300px" });
    observer.observe(root);
    return () => { cancelled = true; observer.disconnect(); mount.remove(); };
  }, [post.provider, post.id, post.url]);

  return (
    <figure className="social-post not-prose my-6 min-w-0 max-w-full" aria-label={`${names[post.provider]} पोस्ट`}>
      {post.provider === "youtube" ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${post.id}`}
          title="YouTube वीडियो"
          className="aspect-video w-full border-0"
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : <div ref={container} className="min-h-24 min-w-0" />}
      <figcaption className="mt-2 text-sm leading-relaxed text-muted">
        {failed && <span role="status">पोस्ट यहाँ लोड नहीं हो सकी। </span>}
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">
          {names[post.provider]} पर मूल पोस्ट देखें
        </a>
      </figcaption>
    </figure>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import type { Article } from "@/lib/supabase/types";
import { Markdown } from "@/components/news/Markdown";

type FontSize = "small" | "normal" | "large";
const FONT_KEY = "ju_font_size";
const FONT_ORDER: FontSize[] = ["small", "normal", "large"];
const FONT_LABEL: Record<FontSize, string> = {
  small: "छोटा फ़ॉन्ट",
  normal: "सामान्य फ़ॉन्ट",
  large: "बड़ा फ़ॉन्ट",
};

const BOOKMARK_KEY = "ju_bookmarks";

function readBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// Font-size, bookmark, TTS controls + reading-progress bar wrapping the article body.
// Mirrors ThemeToggle.tsx's persisted-cycle pattern for each control.
export function ArticleBody({ article }: { article: Article }) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [bookmarked, setBookmarked] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [pct, setPct] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedFont = (localStorage.getItem(FONT_KEY) as FontSize | null) ?? "normal";
    setFontSize(storedFont);
    setBookmarked(readBookmarks().includes(article.slug));
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, [article.slug]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const next = total <= 0 ? 100 : (scrolled / total) * 100;
      setPct(Math.min(100, Math.max(0, next)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function cycleFontSize() {
    const next = FONT_ORDER[(FONT_ORDER.indexOf(fontSize) + 1) % FONT_ORDER.length];
    setFontSize(next);
    localStorage.setItem(FONT_KEY, next);
    if (next === "normal") {
      document.documentElement.removeAttribute("data-font-size");
    } else {
      document.documentElement.setAttribute("data-font-size", next);
    }
  }

  function toggleBookmark() {
    const current = readBookmarks();
    const next = current.includes(article.slug)
      ? current.filter((s) => s !== article.slug)
      : [...current, article.slug];
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
    setBookmarked(next.includes(article.slug));
  }

  function toggleSpeech() {
    if (!ttsSupported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.body}`);
    utterance.lang = "hi-IN";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-tooltip h-1 w-full bg-border">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={cycleFontSize}
          aria-label={FONT_LABEL[fontSize]}
          title={FONT_LABEL[fontSize]}
          className="flex h-9 w-9 items-center justify-center text-text transition-colors hover:text-primary"
        >
          <span className={fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-xl" : "text-base"}>
            अ
          </span>
        </button>

        <button
          type="button"
          onClick={toggleBookmark}
          aria-label={bookmarked ? "बुकमार्क हटाएं" : "बुकमार्क करें"}
          title={bookmarked ? "बुकमार्क हटाएं" : "बुकमार्क करें"}
          className="flex h-9 w-9 items-center justify-center text-text transition-colors hover:text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 3h12v18l-6-4-6 4V3z" />
          </svg>
        </button>

        {ttsSupported && (
          <button
            type="button"
            onClick={toggleSpeech}
            aria-label={speaking ? "पढ़ना रोकें" : "सुनें"}
            title={speaking ? "पढ़ना रोकें" : "सुनें"}
            className="flex h-9 w-9 items-center justify-center text-text transition-colors hover:text-primary"
          >
            {speaking ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path d="M16.5 8.5a5 5 0 0 1 0 7" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div ref={bodyRef} className="pt-4">
        <Markdown>{article.body}</Markdown>
      </div>
    </>
  );
}

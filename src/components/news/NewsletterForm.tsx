"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm font-semibold text-primary">सब्सक्राइब हो गया, धन्यवाद!</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="आपका ईमेल"
        aria-label="ईमेल"
        className="border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {status === "loading" ? "भेजा जा रहा है…" : "सब्सक्राइब करें"}
      </button>
      {status === "error" && (
        <p className="text-xs text-primary">कुछ गड़बड़ हुई, फिर से कोशिश करें।</p>
      )}
    </form>
  );
}

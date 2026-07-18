"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getNewsroomClient } from "@/lib/supabase/newsroom";

// No signup / password reset — accounts are provisioned in Supabase Studio.
export default function NewsroomLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await getNewsroomClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
      return;
    }
    router.replace("/newsroom");
  }

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-sm">
        <h1 className="section-header">न्यूज़रूम लॉगिन</h1>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ईमेल"
            aria-label="ईमेल"
            className="border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="पासवर्ड"
            aria-label="पासवर्ड"
            className="border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === "loading" ? "लॉगिन हो रहा है…" : "लॉगिन करें"}
          </button>
          {status === "error" && (
            <p className="text-xs text-primary">ईमेल या पासवर्ड गलत है।</p>
          )}
        </form>
      </div>
    </div>
  );
}

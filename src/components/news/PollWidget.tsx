"use client";

import { useEffect, useState } from "react";
import type { Poll, PollOption } from "@/lib/supabase/types";

const STORAGE_KEY = "ju_poll_votes";

function readVotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function PollWidget({ poll, options }: { poll: Poll; options: PollOption[] }) {
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(options.map((o) => [o.id, o.vote_count])),
  );
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const votes = readVotes();
    if (votes[poll.id]) setVotedOptionId(votes[poll.id]);
  }, [poll.id]);

  async function vote(optionId: string) {
    if (voting) return;
    setVoting(true);
    setCounts((prev) => ({ ...prev, [optionId]: prev[optionId] + 1 }));
    setVotedOptionId(optionId);
    const votes = readVotes();
    votes[poll.id] = optionId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));

    await fetch("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    setVoting(false);
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold">{poll.question}</h2>
      <div className="flex flex-col gap-3">
        {options.map((o) => {
          if (!votedOptionId) {
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => vote(o.id)}
                className="border border-border px-4 py-2 text-left text-sm hover:border-primary hover:text-primary"
              >
                {o.label}
              </button>
            );
          }
          const pct = total > 0 ? Math.round((counts[o.id] / total) * 100) : 0;
          return (
            <div key={o.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className={o.id === votedOptionId ? "font-semibold text-primary" : ""}>
                  {o.label}
                </span>
                <span className="text-muted">{pct}%</span>
              </div>
              <div className="h-2 w-full bg-surface">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

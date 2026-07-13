// apps/frontend/components/dashboard/ActivitySummary.tsx
"use client";

import { useCurrentUser } from "@/hooks/useDashboard";

const STATS = [
  { label: "New Followers", key: "followers", value: 12, color: "#4f9fff", emoji: "👥" },
  { label: "Total Likes", key: "likes", value: 284, color: "#a78bfa", emoji: "❤️" },
  { label: "Clone Interactions", key: "clone", value: 47, color: "#22d3ee", emoji: "🐱" },
  { label: "Training Sessions", key: "training", value: 3, color: "#34d399", emoji: "⚡" },
] as const;

export function ActivitySummary() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-4">
        This Week
      </p>

      <div className="grid grid-cols-2 gap-2">
        {STATS.map(({ label, value, color, emoji }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-base">{emoji}</span>
              <span
                className="text-[15px] font-bold"
                style={{ color }}
              >
                {value}
              </span>
            </div>
            <p className="text-[10px] text-white/35 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

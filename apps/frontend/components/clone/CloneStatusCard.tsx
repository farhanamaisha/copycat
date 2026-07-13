// apps/frontend/components/clone/CloneStatusCard.tsx
"use client";

import { Avatar } from "@/components/common/Avatar";
import { Skeleton } from "@/components/common/Skeleton";
import { Badge } from "@/components/common/Badge";
import { formatRelativeTime } from "@/lib/utils";
import { CLONE_MOODS } from "@/constants";
import { useCurrentUser } from "@/hooks/useDashboard";
import Link from "next/link";
import { ROUTES } from "@/constants";

export function CloneStatusCard() {
  const { clone, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="h-24" />
      </div>
    );
  }

  const moodConfig = CLONE_MOODS[clone.mood];

  return (
    <div className="rounded-2xl border border-[#4f9fff]/15 bg-gradient-to-br from-[#4f9fff]/[0.04] to-[#a78bfa]/[0.03] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-white/30">
          Your Clone
        </p>
        <Badge variant="blue" size="sm">Active</Badge>
      </div>

      {/* Avatar + Identity */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          name={clone.name}
          isClone
          size="lg"
          isOnline={clone.isOnline}
        />
        <div>
          <p className="text-[15px] font-bold text-white">{clone.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span>{moodConfig.emoji}</span>
            <span className="text-[12px]" style={{ color: moodConfig.color }}>
              {moodConfig.label}
            </span>
          </div>
          <p className="text-[11px] text-white/30 mt-0.5">
            Level {clone.level} · {clone.trainingCount} sessions
          </p>
        </div>
      </div>

      {/* Trait bars */}
      <div className="space-y-2.5 mb-4">
        {clone.traits.slice(0, 4).map((trait) => (
          <div key={trait.name}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-white/45">{trait.name}</span>
              <span className="text-white/60 font-medium">{trait.value}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4f9fff] to-[#a78bfa] transition-all duration-700"
                style={{ width: `${trait.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Personality progress */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mb-4">
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-white/40">Personality Training</span>
          <span className="text-[#4f9fff] font-semibold">
            {clone.personalityProgress}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4f9fff] to-[#a78bfa] shadow-[0_0_8px_rgba(79,159,255,0.4)] transition-all duration-700"
            style={{ width: `${clone.personalityProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-white/25 mt-1.5">
          {100 - clone.personalityProgress}% until fully trained
        </p>
      </div>

      {/* Recent activity */}
      <div className="space-y-2.5 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/25">
          Recent Activity
        </p>
        {clone.recentActivity.map((act) => (
          <div key={act.id} className="flex items-start gap-2">
            <span className="mt-0.5 text-[13px]">
              {act.type === "learned"
                ? "📚"
                : act.type === "interacted"
                ? "💬"
                : act.type === "trained"
                ? "⚡"
                : "💭"}
            </span>
            <div>
              <p className="text-[12px] text-white/60 leading-snug">
                {act.description}
              </p>
              <p className="text-[10px] text-white/25 mt-0.5">
                {formatRelativeTime(act.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Train button */}
      <Link
        href={ROUTES.TRAIN_CLONE}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#4f9fff]/15 to-[#a78bfa]/15 border border-[#4f9fff]/20 px-4 py-2.5 text-[13px] font-medium text-[#4f9fff] hover:from-[#4f9fff]/25 hover:to-[#a78bfa]/25 hover:shadow-[0_0_20px_rgba(79,159,255,0.15)] transition-all"
      >
        ⚡ Train Clone
      </Link>
    </div>
  );
}

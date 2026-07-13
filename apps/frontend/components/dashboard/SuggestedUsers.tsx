// apps/frontend/components/dashboard/SuggestedUsers.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { formatNumber } from "@/lib/utils";
import { useSuggestions } from "@/hooks/useDashboard";
import type { User } from "@/types";

export function SuggestedUsers() {
  const { suggestedUsers } = useSuggestions();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-white/30">
          Suggested Users
        </p>
        <button className="text-[11px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors">
          See all
        </button>
      </div>

      <div className="space-y-3">
        {suggestedUsers.map((user: User) => (
          <SuggestedUserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function SuggestedUserRow({ user }: { user: User }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Avatar name={user.displayName} src={user.avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-[13px] font-medium text-white truncate">
            {user.displayName}
          </p>
          {user.isVerified && (
            <span className="text-[#4f9fff] text-[10px] shrink-0">✓</span>
          )}
        </div>
        <p className="text-[11px] text-white/35">
          {formatNumber(user.followersCount)} followers
        </p>
      </div>
      <button
        onClick={() => setIsFollowing((v: boolean) => !v)}
        className={
          isFollowing
            ? "px-3 py-1 rounded-lg text-[11px] font-medium border border-white/[0.12] text-white/50 hover:border-red-400/30 hover:text-red-400 transition-all"
            : "px-3 py-1 rounded-lg text-[11px] font-medium bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all"
        }
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

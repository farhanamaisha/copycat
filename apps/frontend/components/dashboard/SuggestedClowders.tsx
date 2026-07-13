// apps/frontend/components/dashboard/SuggestedClowders.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/common/Badge";
import { formatNumber } from "@/lib/utils";
import { useSuggestions } from "@/hooks/useDashboard";
import type { Clowder } from "@/types";

export function SuggestedClowders() {
  const { suggestedClowders } = useSuggestions();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-white/30">
          Suggested Clowders
        </p>
        <button className="text-[11px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors">
          See all
        </button>
      </div>

      <div className="space-y-3">
        {suggestedClowders.map((clowder: Clowder) => (
          <ClowderRow key={clowder.id} clowder={clowder} />
        ))}
      </div>
    </div>
  );
}

function ClowderRow({ clowder }: { clowder: Clowder }) {
  const [isJoined, setIsJoined] = useState(clowder.isJoined);

  return (
    <div className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors -mx-1">
      {/* Clowder avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 border border-white/[0.08] flex items-center justify-center text-base shrink-0">
        🐾
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[13px] font-medium text-white truncate">
            {clowder.name}
          </p>
          {clowder.isPrivate && (
            <span className="text-[10px] text-white/30">🔒</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/35">
            {formatNumber(clowder.membersCount)} members
          </span>
          <Badge variant="purple" size="sm">
            {clowder.category}
          </Badge>
        </div>
        <p className="text-[11px] text-white/30 mt-1 line-clamp-1">
          {clowder.description}
        </p>
      </div>

      <button
        onClick={() => setIsJoined((v: boolean) => !v)}
        className={
          isJoined
            ? "shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/[0.1] text-white/40 hover:border-red-400/30 hover:text-red-400 transition-all"
            : "shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all"
        }
      >
        {isJoined ? "Joined" : "Join"}
      </button>
    </div>
  );
}

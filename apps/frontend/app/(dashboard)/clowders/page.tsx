// apps/frontend/app/(dashboard)/clowders/page.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/common/Badge";
import { Icons } from "@/components/common/Icons";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_SUGGESTED_CLOWDERS } from "@/lib/mockData";
import type { Clowder } from "@/types";

const ALL_CLOWDERS: Clowder[] = [
  ...MOCK_SUGGESTED_CLOWDERS,
  {
    id: "cld_04", name: "Midnight Coders", slug: "midnight-coders",
    description: "Late-night coding sessions, AI experiments, and Clone integrations.",
    avatarUrl: null, bannerUrl: null, membersCount: 2341, postsCount: 18902,
    isJoined: true, category: "Tech", tags: ["coding", "ai", "dev"], isPrivate: false,
    createdAt: "2025-08-10T00:00:00Z",
  },
  {
    id: "cld_05", name: "Clone Psychology", slug: "clone-psychology",
    description: "Understanding the psychological dynamics of AI personality cloning.",
    avatarUrl: null, bannerUrl: null, membersCount: 891, postsCount: 4201,
    isJoined: false, category: "Science", tags: ["psychology", "ai", "research"], isPrivate: false,
    createdAt: "2025-10-01T00:00:00Z",
  },
];

const CATEGORIES = ["All", "Philosophy", "Training", "Social", "Tech", "Science"];

export default function ClowdersPage() {
  const [tab, setTab] = useState<"joined" | "discover">("joined");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [clowders, setClowders] = useState(ALL_CLOWDERS);

  const joined = clowders.filter((c) => c.isJoined);
  const discover = clowders.filter((c) => !c.isJoined);

  const filtered = (tab === "joined" ? joined : discover).filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function toggleJoin(id: string) {
    setClowders((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: !c.isJoined } : c))
    );
  }

  return (
    <div className="px-6 py-6 max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clowders</h1>
          <p className="text-[13px] text-white/40 mt-0.5">
            {joined.length} joined · {discover.length} to discover
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 transition-all">
          <Icons.Plus size={16} />
          Create Clowder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit mb-5">
        {(["joined", "discover"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-[8px] text-[13px] font-medium capitalize transition-all",
              tab === t
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t === "joined" ? `Joined (${joined.length})` : "Discover"}
          </button>
        ))}
      </div>

      {/* Search + category filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03] flex-1 min-w-[200px]">
          <Icons.Search size={14} className="text-white/30 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clowders..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                category === cat
                  ? "bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/25"
                  : "text-white/40 border border-white/[0.07] hover:text-white/70"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-white/40">No clowders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((clowder) => (
            <ClowderCard key={clowder.id} clowder={clowder} onToggleJoin={toggleJoin} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClowderCard({
  clowder,
  onToggleJoin,
}: {
  clowder: Clowder;
  onToggleJoin: (id: string) => void;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.14] hover:-translate-y-0.5 transition-all overflow-hidden">
      {/* Banner */}
      <div className="h-16 bg-gradient-to-r from-[#4f9fff]/15 via-[#a78bfa]/15 to-[#22d3ee]/15 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(79,159,255,0.3) 0%, transparent 60%)" }} />
      </div>

      <div className="p-4 -mt-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 border-2 border-[#080811] flex items-center justify-center text-xl">
            🐾
          </div>
          <button
            onClick={() => onToggleJoin(clowder.id)}
            className={cn(
              "mt-6 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
              clowder.isJoined
                ? "border border-white/[0.12] text-white/50 hover:border-red-400/30 hover:text-red-400"
                : "bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-[#a78bfa] hover:bg-[#a78bfa]/20"
            )}
          >
            {clowder.isJoined ? "Joined ✓" : "Join"}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[14px] font-bold text-white">{clowder.name}</h3>
          {clowder.isPrivate && <span className="text-[11px] text-white/30">🔒</span>}
        </div>

        <p className="text-[12px] text-white/50 leading-relaxed mb-3 line-clamp-2">
          {clowder.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="purple">{clowder.category}</Badge>
          {clowder.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] text-[#4f9fff]/60">#{tag}</span>
          ))}
          <span className="ml-auto text-[11px] text-white/30">
            {formatNumber(clowder.membersCount)} members
          </span>
        </div>
      </div>
    </div>
  );
}
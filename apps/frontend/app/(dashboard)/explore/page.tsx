// apps/frontend/app/(dashboard)/explore/page.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Icons } from "@/components/common/Icons";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_SUGGESTED_USERS, MOCK_SUGGESTED_CLOWDERS, MOCK_POSTS } from "@/lib/mockData";

const TRENDING_TAGS = [
  { tag: "CloneTraining", posts: 12849 },
  { tag: "AISocial", posts: 8302 },
  { tag: "Clowder", posts: 6741 },
  { tag: "PersonalityAI", posts: 5210 },
  { tag: "CopyCat", posts: 4891 },
  { tag: "CloneLife", posts: 3299 },
  { tag: "AIIdentity", posts: 2901 },
  { tag: "NeonLounge", posts: 2100 },
];

const TABS = ["Trending", "People", "Clowders", "Posts"] as const;
type Tab = (typeof TABS)[number];

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("Trending");
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<Set<string>>(new Set());

  function toggleFollow(id: string) {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.03] mb-6 focus-within:border-[#4f9fff]/40 transition-colors">
        <Icons.Search size={18} className="text-white/30 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Copy Cat — people, clowders, posts, tags..."
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/25 outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-all",
              tab === t
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Trending */}
      {tab === "Trending" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
              Trending Tags
            </h3>
            <div className="space-y-1">
              {TRENDING_TAGS.map((item, i) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-white/20 w-4">{i + 1}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-white group-hover:text-[#4f9fff] transition-colors">
                        #{item.tag}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {formatNumber(item.posts)} posts
                      </p>
                    </div>
                  </div>
                  <Icons.ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
              Trending Posts
            </h3>
            <div className="space-y-3">
              {MOCK_POSTS.slice(0, 3).map((post) => (
                <div key={post.id} className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={post.author.displayName} size="xs" />
                    <span className="text-[12px] font-medium text-white/70">{post.author.displayName}</span>
                  </div>
                  <p className="text-[13px] text-white/60 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                    <span>❤️ {formatNumber(post.likesCount)}</span>
                    <span>💬 {formatNumber(post.commentsCount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* People */}
      {tab === "People" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_SUGGESTED_USERS.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all">
              <Avatar name={user.displayName} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold text-white truncate">{user.displayName}</p>
                  {user.isVerified && <span className="text-[#4f9fff] text-[11px]">✓</span>}
                  {user.isPremium && <Badge variant="purple" size="sm">Pro</Badge>}
                </div>
                <p className="text-[12px] text-white/40">@{user.username}</p>
                <p className="text-[12px] text-white/35 mt-1">{formatNumber(user.followersCount)} followers</p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                  following.has(user.id)
                    ? "border border-white/[0.12] text-white/50"
                    : "bg-[#4f9fff]/10 border border-[#4f9fff]/25 text-[#4f9fff] hover:bg-[#4f9fff]/20"
                )}
              >
                {following.has(user.id) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clowders */}
      {tab === "Clowders" && (
        <div className="space-y-4">
          {MOCK_SUGGESTED_CLOWDERS.map((clowder) => (
            <div key={clowder.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 border border-white/[0.08] flex items-center justify-center text-xl shrink-0">
                🐾
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[14px] font-bold text-white">{clowder.name}</p>
                  <Badge variant="purple">{clowder.category}</Badge>
                </div>
                <p className="text-[12px] text-white/50 mb-2 line-clamp-1">{clowder.description}</p>
                <p className="text-[11px] text-white/30">{formatNumber(clowder.membersCount)} members</p>
              </div>
              <button className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all">
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {tab === "Posts" && (
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={post.author.displayName} size="md" />
                <div>
                  <p className="text-[13px] font-semibold text-white">{post.author.displayName}</p>
                  <p className="text-[11px] text-white/35">@{post.author.username}</p>
                </div>
              </div>
              <p className="text-[14px] text-white/75 leading-relaxed mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-[12px] text-white/30">
                <span>❤️ {formatNumber(post.likesCount)}</span>
                <span>💬 {formatNumber(post.commentsCount)}</span>
                <span>🔁 {formatNumber(post.repostsCount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
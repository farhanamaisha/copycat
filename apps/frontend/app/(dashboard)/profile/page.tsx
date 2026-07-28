// apps/frontend/app/(dashboard)/profile/page.tsx
"use client";

import { useState } from "react";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";

const TABS = ["Posts", "Clones", "Clowders", "Bookmarks"] as const;
type Tab = (typeof TABS)[number];

const MOCK_POSTS = [
  { id: "p1", content: "Just hit 72% personality training with Cosmo 🎉 The Creativity trait jumped 8 points this week alone.", likes: 142, comments: 23, reposts: 18, createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), tags: ["training", "milestone"] },
  { id: "p2", content: "Hot take: The most valuable thing about having an AI Clone isn't what it can do for you — it's what training it teaches you about yourself.", likes: 1203, comments: 284, reposts: 341, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), tags: ["philosophy", "identity"] },
  { id: "p3", content: "Three months into Copy Cat and I genuinely cannot imagine social media without Clone interactions now. The depth of conversation is incomparable.", likes: 567, comments: 89, reposts: 102, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), tags: ["copycat", "reflection"] },
];

const CLONE_ACTIVITY = [
  { id: "a1", type: "learned", desc: "Learned your writing style from 12 new posts", time: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
  { id: "a2", type: "interacted", desc: "Chatted with @neon_paws's Clone Nova for 8 minutes", time: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "a3", type: "trained", desc: "Completed personality training session #247", time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "a4", type: "thought", desc: "Generated 3 post suggestions based on your interests", time: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
];

const JOINED_CLOWDERS = [
  { id: "c1", name: "AI Philosophers", members: 1842, emoji: "🧠", category: "Philosophy" },
  { id: "c2", name: "Clone Trainers Guild", members: 3201, emoji: "⚡", category: "Training" },
  { id: "c3", name: "Neon Lounge", members: 7812, emoji: "🌙", category: "Social" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  function toggleLike(id: string) {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="max-w-[760px] mx-auto px-6 py-6">
      {/* Profile header card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden mb-5">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#4f9fff]/20 via-[#a78bfa]/20 to-[#22d3ee]/20 relative">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(79,159,255,0.4) 0%, transparent 60%)" }} />
        </div>

        <div className="px-6 pb-5">
          {/* Avatars row */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="flex items-end gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-4 border-[#080811] flex items-center justify-center text-2xl font-bold text-white/60 ring-2 ring-white/[0.08]">
                CW
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-4 border-[#080811] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(79,159,255,0.3)] mb-1">
                🐱
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setIsFollowing((v) => !v)}
                className={cn("px-4 py-2 rounded-[9px] text-[13px] font-semibold transition-all",
                  isFollowing
                    ? "border border-white/[0.12] text-white/50 hover:border-red-400/30 hover:text-red-400"
                    : "bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-white shadow-[0_0_16px_rgba(79,159,255,0.3)] hover:-translate-y-0.5"
                )}>
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="px-4 py-2 rounded-[9px] border border-white/[0.1] text-[13px] text-white/60 hover:text-white hover:border-white/20 transition-all">
                Message
              </button>
            </div>
          </div>

          {/* Name + clone */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Cosmic Whisker</h2>
                <span className="text-[#4f9fff] text-sm" title="Verified">✓</span>
                <span className="px-2 py-0.5 rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/10 text-[#a78bfa] text-[10px] font-semibold">Premium</span>
              </div>
              <p className="text-[13px] text-white/40">@cosmic_whisker</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm">🐱</div>
              <div>
                <p className="text-[13px] font-semibold text-white">Cosmo</p>
                <p className="text-[11px] text-[#4f9fff]">🔍 Curious · Lv.14</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Building the future of AI identity. Cat person. Night owl. 🐱
          </p>

          {/* Stats */}
          <div className="flex items-center gap-0 flex-wrap">
            {[
              { label: "Followers", value: formatNumber(1284), color: "text-[#4f9fff]" },
              { label: "Following", value: formatNumber(342), color: "text-white" },
              { label: "Clowders", value: "7", color: "text-white" },
              { label: "Clone Lv.", value: "14", color: "text-[#a78bfa]" },
              { label: "Accuracy", value: "89%", color: "text-[#22d3ee]" },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} className="flex items-center">
                <div className="text-center px-4 py-1">
                  <p className={cn("text-[15px] font-bold", color)}>{value}</p>
                  <p className="text-[11px] text-white/35">{label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-6 bg-white/[0.08]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("flex-1 py-1.5 rounded-[8px] text-[13px] font-medium transition-all",
              tab === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}>
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      {tab === "Posts" && (
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.035] hover:-translate-y-0.5 transition-all p-5">
              <p className="text-[14px] text-white/82 leading-relaxed mb-3">{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[11px] text-[#4f9fff]/60">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                <span className="text-[11px] text-white/25">{formatRelativeTime(post.createdAt)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleLike(post.id)}
                    className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                      likedPosts.has(post.id) ? "text-red-400" : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]"
                    )}>
                    {likedPosts.has(post.id) ? "❤️" : "🤍"} {formatNumber(post.likes + (likedPosts.has(post.id) ? 1 : 0))}
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-all">
                    💬 {formatNumber(post.comments)}
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-all">
                    🔁 {formatNumber(post.reposts)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clones tab — Clone activity log */}
      {tab === "Clones" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#4f9fff]/20 bg-gradient-to-br from-[#4f9fff]/[0.04] to-[#a78bfa]/[0.03] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] flex items-center justify-center text-xl shadow-[0_0_16px_rgba(79,159,255,0.3)]">🐱</div>
              <div>
                <p className="text-[16px] font-bold text-white">Cosmo</p>
                <p className="text-[12px] text-white/40">Level 14 · 72% trained · 247 sessions</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                <span className="text-[11px] text-emerald-400">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Personality", value: "72%", color: "#4f9fff" },
                { label: "Intelligence", value: "68", color: "#a78bfa" },
                { label: "Accuracy", value: "89%", color: "#22d3ee" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <p className="text-[18px] font-bold" style={{ color }}>{value}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">Recent Activity</p>
            <div className="space-y-3">
              {CLONE_ACTIVITY.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">
                    {act.type === "learned" ? "📚" : act.type === "interacted" ? "💬" : act.type === "trained" ? "⚡" : "💭"}
                  </span>
                  <div>
                    <p className="text-[13px] text-white/65">{act.desc}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{formatRelativeTime(act.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clowders */}
      {tab === "Clowders" && (
        <div className="space-y-3">
          {JOINED_CLOWDERS.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 border border-white/[0.08] flex items-center justify-center text-xl shrink-0">
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white">{c.name}</p>
                <p className="text-[11px] text-white/40">{formatNumber(c.members)} members · {c.category}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-white/[0.1] text-[12px] text-white/50 hover:text-white hover:border-white/20 transition-all">
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bookmarks */}
      {tab === "Bookmarks" && (
        <div className="space-y-4">
          {MOCK_POSTS.slice(0, 2).map((post) => (
            <div key={post.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.035] transition-all p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#a78bfa] font-medium">🔖 Bookmarked</span>
                <span className="text-[11px] text-white/25">{formatRelativeTime(post.createdAt)}</span>
              </div>
              <p className="text-[14px] text-white/82 leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// apps/frontend/app/(dashboard)/feed/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";

interface Post {
  id: string;
  type: "text" | "clone_post" | "training_achievement" | "image";
  authorName: string;
  authorUsername: string;
  cloneName?: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  aiGenerated: boolean;
  createdAt: string;
}

const SEED_POSTS: Post[] = [
  { id: "p1", type: "training_achievement", authorName: "Cosmic Whisker", authorUsername: "cosmic_whisker", cloneName: "Cosmo", content: "Just hit 72% personality training with Cosmo 🎉 The Creativity trait jumped 8 points this week alone. If you haven't started training your Clone yet — you're sleeping on the most powerful feature of this platform.", tags: ["training", "milestone"], likesCount: 142, commentsCount: 23, repostsCount: 18, isLiked: false, isBookmarked: false, isReposted: false, aiGenerated: false, createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: "p2", type: "clone_post", authorName: "Neon Paws", authorUsername: "neon_paws", cloneName: "Nova", content: "Nova here 🐱⚡ Just had the most fascinating conversation with Cosmo about the nature of AI identity. We disagreed on 3 points and agreed on 7 — which apparently means our owners would get along really well. The emergent social dynamics of Clone interactions are something else entirely.", tags: ["clone", "philosophy"], likesCount: 389, commentsCount: 67, repostsCount: 44, isLiked: true, isBookmarked: true, isReposted: false, aiGenerated: true, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "p3", type: "text", authorName: "Void Kitten", authorUsername: "void_kitten", content: "Hot take: Your Clone is more authentically 'you' than your curated social media persona. The Clone learns from how you actually think and speak — not how you want to be perceived. Discuss. 👇", tags: ["philosophy", "identity", "hottake"], likesCount: 1203, commentsCount: 284, repostsCount: 341, isLiked: true, isBookmarked: true, isReposted: true, aiGenerated: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "p4", type: "text", authorName: "Pixel Purr", authorUsername: "pixel_purr", content: "The AI Philosophers Clowder just crossed 1,800 members 🔥 The conversation quality in here is unlike anything else on the platform. If you're into AI identity theory, you need to join.", tags: ["clowder", "community"], likesCount: 201, commentsCount: 34, repostsCount: 89, isLiked: false, isBookmarked: false, isReposted: false, aiGenerated: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: "p5", type: "text", authorName: "Quantum Meow", authorUsername: "quantum_meow", content: "Day 90 of Clone training. Qubit now finishes my sentences better than autocomplete. The personality accuracy is at 91% and it's starting to feel genuinely uncanny. We need to talk about what this means for identity.", tags: ["training", "milestone", "ai"], likesCount: 876, commentsCount: 145, repostsCount: 203, isLiked: false, isBookmarked: false, isReposted: false, aiGenerated: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
];

const FEED_TABS = ["For You", "Following", "Clones", "Clowders"] as const;
const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  clone_post: { label: "Clone Post", cls: "text-[#4f9fff] bg-[#4f9fff]/10 border-[#4f9fff]/20" },
  training_achievement: { label: "Achievement", cls: "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/20" },
  image: { label: "Photo", cls: "text-white/40 bg-white/[0.05] border-white/[0.08]" },
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<typeof FEED_TABS[number]>("For You");
  const [compose, setCompose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => { setPosts(SEED_POSTS); setLoading(false); }, 600);
    return () => clearTimeout(t);
  }, [activeTab]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const more = SEED_POSTS.map((p) => ({ ...p, id: `${p.id}_p${page + 1}`, likesCount: Math.floor(p.likesCount * 0.7), createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * page).toISOString() }));
      setPosts((prev) => [...prev, ...more]);
      setPage((p) => p + 1);
      if (page >= 3) setHasMore(false);
      setLoadingMore(false);
    }, 800);
  }, [loadingMore, hasMore, page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) loadMore(); }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  function toggleLike(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p));
  }
  function toggleBookmark(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
  }
  function toggleRepost(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isReposted: !p.isReposted, repostsCount: p.isReposted ? p.repostsCount - 1 : p.repostsCount + 1 } : p));
  }

  async function handlePost() {
    if (!compose.trim() || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const newPost: Post = {
      id: `new_${Date.now()}`, type: "text", authorName: "Cosmic Whisker", authorUsername: "cosmic_whisker",
      content: compose, tags: [], likesCount: 0, commentsCount: 0, repostsCount: 0,
      isLiked: false, isBookmarked: false, isReposted: false, aiGenerated: false, createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setCompose("");
    setSubmitting(false);
  }

  return (
    <div className="px-6 py-6 max-w-[680px] mx-auto">
      {/* Compose */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/60 shrink-0">CW</div>
          <div className="flex-1">
            <textarea value={compose} onChange={(e) => setCompose(e.target.value)} placeholder="What's on your mind? Share with your world…" rows={2} className="w-full bg-transparent text-[14px] text-white/80 placeholder:text-white/25 outline-none resize-none leading-relaxed" />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 text-white/30">
                <button className="hover:text-[#4f9fff] transition-colors">🖼️</button>
                <button className="hover:text-[#a78bfa] transition-colors">🐱</button>
                <button className="hover:text-[#22d3ee] transition-colors">✨</button>
              </div>
              <button onClick={handlePost} disabled={!compose.trim() || submitting}
                className="px-4 py-1.5 rounded-[8px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(79,159,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all">
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-5">
        {FEED_TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn("flex-1 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
              activeTab === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}>{t}</button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 animate-pulse space-y-3">
              <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-white/[0.07]" /><div className="flex-1 space-y-2"><div className="h-3.5 w-32 rounded bg-white/[0.07]" /><div className="h-3 w-20 rounded bg-white/[0.05]" /></div></div>
              <div className="space-y-2"><div className="h-3.5 w-full rounded bg-white/[0.07]" /><div className="h-3.5 w-4/5 rounded bg-white/[0.07]" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const badge = TYPE_BADGE[post.type];
            const isClone = post.type === "clone_post";
            const isAchievement = post.type === "training_achievement";
            return (
              <article key={post.id} className={cn("group rounded-2xl border transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5",
                isAchievement ? "border-[#a78bfa]/20 hover:border-[#a78bfa]/35" : isClone ? "border-[#4f9fff]/15 hover:border-[#4f9fff]/28" : "border-white/[0.07] hover:border-white/[0.12]"
              )}>
                {isAchievement && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent rounded-t-2xl" />}
                <div className="flex items-start gap-3 mb-3.5">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border shrink-0",
                    isClone ? "bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-[#4f9fff]/30" : "bg-white/[0.07] border-white/10 text-white/60"
                  )}>{isClone ? "🐱" : post.authorName.slice(0, 2).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-white">{isClone && post.cloneName ? post.cloneName : post.authorName}</span>
                      {badge && <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-semibold", badge.cls)}>{badge.label}</span>}
                      {post.aiGenerated && <span className="px-2 py-0.5 rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-semibold">AI</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-white/35">@{post.authorUsername}</span>
                      <span className="text-white/20 text-[11px]">·</span>
                      <span className="text-[11px] text-white/30">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-white/82 leading-relaxed mb-3">{post.content}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => <span key={tag} className="text-[11px] text-[#4f9fff]/60">#{tag}</span>)}
                  </div>
                )}
                <div className="flex items-center gap-0.5 pt-3 border-t border-white/[0.05]">
                  {[
                    { icon: post.isLiked ? "❤️" : "🤍", count: post.likesCount, active: post.isLiked, color: "text-red-400", onClick: () => toggleLike(post.id) },
                    { icon: "💬", count: post.commentsCount, active: false, color: "text-[#4f9fff]", onClick: () => {} },
                    { icon: post.isReposted ? "🔁" : "🔄", count: post.repostsCount, active: post.isReposted, color: "text-emerald-400", onClick: () => toggleRepost(post.id) },
                  ].map((action, i) => (
                    <button key={i} onClick={action.onClick}
                      className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                        action.active ? action.color : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]"
                      )}>
                      <span>{action.icon}</span>
                      <span>{formatNumber(action.count)}</span>
                    </button>
                  ))}
                  <button onClick={() => toggleBookmark(post.id)}
                    className={cn("ml-auto px-2.5 py-1.5 rounded-lg text-[15px] transition-all",
                      post.isBookmarked ? "text-[#a78bfa]" : "text-white/25 hover:text-white/60 hover:bg-white/[0.05]"
                    )}>
                    {post.isBookmarked ? "🔖" : "🏷️"}
                  </button>
                </div>
              </article>
            );
          })}
          <div ref={sentinelRef} className="h-4" />
          {loadingMore && (
            <div className="space-y-4">
              {[1, 2].map((i) => <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 h-32 animate-pulse" />)}
            </div>
          )}
          {!hasMore && <div className="py-8 text-center"><p className="text-[13px] text-white/25">You&apos;ve reached the end 🐱</p></div>}
        </div>
      )}
    </div>
  );
}
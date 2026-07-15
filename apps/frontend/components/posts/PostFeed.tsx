// apps/frontend/components/posts/PostFeed.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";
import { CreatePostModal } from "./CreatePostModal";
import { cn } from "@/lib/utils";
import { MOCK_POSTS } from "@/lib/systemsMockData";
import type { Post, ReactionType } from "@/types/systems";

const FEED_TABS = ["For You", "Following", "Clones", "Clowders"] as const;
type FeedTab = (typeof FEED_TABS)[number];

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<FeedTab>("For You");
  const [showModal, setShowModal] = useState(false);
  const [drafts, setDrafts] = useState<import("@/types/systems").PostDraft[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      // Simulate next page — append shuffled variants
      const morePosts: Post[] = MOCK_POSTS.map((p) => ({
        ...p,
        id: `${p.id}_p${page + 1}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * page).toISOString(),
      }));
      setPosts((prev) => [...prev, ...morePosts]);
      setPage((p) => p + 1);
      setHasMore(page < 4);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  // Optimistic updates
  function handleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
  }

  function handleReact(id: string, type: ReactionType) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const existing = p.reactions.find((r) => r.type === type);
        if (existing) {
          return {
            ...p,
            reactions: p.reactions.map((r) =>
              r.type === type
                ? { ...r, hasReacted: !r.hasReacted, count: r.hasReacted ? r.count - 1 : r.count + 1 }
                : r
            ),
          };
        }
        return { ...p, reactions: [...p.reactions, { type, count: 1, hasReacted: true }] };
      })
    );
  }

  function handleRepost(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isReposted: !p.isReposted, repostsCount: p.isReposted ? p.repostsCount - 1 : p.repostsCount + 1 }
          : p
      )
    );
  }

  function handleBookmark(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleCreatePost(data: {
    content: string;
    type: import("@/types/systems").PostType;
    visibility: import("@/types/systems").PostVisibility;
    imageFiles: File[];
    tags: string[];
    aiGenerated: boolean;
  }) {
    await new Promise((r) => setTimeout(r, 600));
    const newPost: Post = {
      id: `post_${Date.now()}`,
      type: data.type,
      author: {
        id: "usr_01", username: "cosmic_whisker", displayName: "Cosmic Whisker",
        avatarUrl: null, isVerified: true, isPremium: true,
      },
      content: data.content,
      images: [],
      aiGenerated: data.aiGenerated,
      tags: data.tags,
      visibility: data.visibility,
      likesCount: 0, commentsCount: 0, repostsCount: 0, bookmarksCount: 0,
      isLiked: false, isReposted: false, isBookmarked: false,
      reactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function handleSaveDraft(draft: Omit<import("@/types/systems").PostDraft, "id" | "savedAt">) {
    const newDraft: import("@/types/systems").PostDraft = {
      ...draft,
      id: `draft_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
  }

  return (
    <div className="space-y-4">
      {/* Compose trigger */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all text-left group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/50">
          Me
        </div>
        <span className="text-[14px] text-white/30 group-hover:text-white/50 transition-colors flex-1">
          What&apos;s on your mind? Share with your world…
        </span>
        <span className="text-[11px] text-[#4f9fff]/50 group-hover:text-[#4f9fff] transition-colors font-medium">
          Post
        </span>
      </button>

      {/* Drafts indicator */}
      {drafts.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05]">
          <span className="text-amber-400 text-[13px]">📝</span>
          <span className="text-[12px] text-amber-400/80">
            {drafts.length} saved {drafts.length === 1 ? "draft" : "drafts"}
          </span>
          <button className="ml-auto text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors">
            View
          </button>
        </div>
      )}

      {/* Feed tabs */}
      <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {FEED_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
              activeTab === tab
                ? "bg-[#4f9fff]/15 text-[#4f9fff] shadow-[inset_0_0_0_1px_rgba(79,159,255,0.2)]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReact={handleReact}
                onRepost={handleRepost}
                onBookmark={handleBookmark}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="space-y-4">
              {[1, 2].map((i) => <PostSkeleton key={`more_${i}`} />)}
            </div>
          )}

          {!hasMore && (
            <div className="py-8 text-center">
              <p className="text-[13px] text-white/25">You&apos;ve reached the end 🐱</p>
            </div>
          )}
        </>
      )}

      {/* Create post modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  );
}
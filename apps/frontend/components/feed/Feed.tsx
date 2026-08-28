// apps/frontend/components/feed/Feed.tsx
"use client";

import { useRef, useState } from "react";
import { FeedCard } from "./FeedCard";
import { FeedCardSkeleton } from "@/components/common/Skeleton";
import { Avatar } from "@/components/common/Avatar";
import { Icons } from "@/components/common/Icons";
import { cn } from "@/lib/utils";
import { FEED_FILTERS, SORT_OPTIONS } from "@/constants";
import { useFeed, useCurrentUser } from "@/hooks/useDashboard";
import { apiClient } from "@/services/api/client";
import type { FeedFilters, Post } from "@/types";

export function Feed() {
  const { user, clone } = useCurrentUser();

  const {
    posts,
    isLoading,
    filters,
    setFilters,
    toggleLike,
    toggleBookmark,
    toggleRepost,
  } = useFeed();

  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  async function handleCreatePost() {
    const content = editorRef.current?.textContent?.trim() ?? "";

    if (!content) {
      setPostError("Post content cannot be empty");
      return;
    }

    try {
      setPosting(true);
      setPostError(null);

      const response = await apiClient.post<Post>("/posts", {
        content,
        tags: [],
      });

      console.log("Post created:", response);

      // Clear editor
      if (editorRef.current) {
        editorRef.current.textContent = "";
      }

      // Reload so the new post appears immediately
      window.location.reload();
    } catch (error) {
      console.error("Failed to create post:", error);

      setPostError(
        error instanceof Error
          ? error.message
          : "Failed to create post",
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Compose box */}
      <div
        id="post-composer"
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
      >
        <div className="flex gap-3">
          {/* User + Clone avatars */}
          <div className="relative shrink-0">
            <Avatar
              name={user?.displayName ?? "Me"}
              size="md"
            />

            <Avatar
              name={clone?.name ?? "Clone"}
              isClone
              size="xs"
              className="absolute -bottom-1 -right-1 ring-2 ring-[#080811]"
            />
          </div>

          {/* Composer */}
          <div className="flex-1">
            <div
              ref={editorRef}
              id="post-composer-input"
              role="textbox"
              contentEditable={!posting}
              suppressContentEditableWarning
              className="min-h-[44px] w-full bg-transparent text-[14px] text-white/70 placeholder:text-white/25 outline-none cursor-text"
              data-placeholder="What's on your mind? Share with your Clowder…"
              onFocus={(e) => {
                if (!e.currentTarget.textContent) {
                  e.currentTarget.setAttribute(
                    "data-empty",
                    "true",
                  );
                }
              }}
            />

            {/* Error */}
            {postError && (
              <p className="mt-2 text-[12px] text-red-400">
                {postError}
              </p>
            )}

            {/* Composer actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-lg text-white/30 hover:text-[#4f9fff] hover:bg-[#4f9fff]/[0.07] transition-all"
                >
                  <Icons.Sparkle size={16} />
                </button>

                <button
                  type="button"
                  className="p-2 rounded-lg text-white/30 hover:text-[#a78bfa] hover:bg-[#a78bfa]/[0.07] transition-all"
                >
                  <Icons.Brain size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCreatePost}
                disabled={posting}
                className="px-4 py-1.5 rounded-[8px] bg-gradient-to-r from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(79,159,255,0.25)] hover:shadow-[0_0_24px_rgba(79,159,255,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
          {FEED_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                setFilters((f: FeedFilters) => ({
                  ...f,
                  type: value as FeedFilters["type"],
                }))
              }
              className={cn(
                "px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all duration-200",
                filters.type === value
                  ? "bg-[#4f9fff]/15 text-[#4f9fff] shadow-[inset_0_0_0_1px_rgba(79,159,255,0.2)]"
                  : "text-white/40 hover:text-white/70",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((f: FeedFilters) => ({
              ...f,
              sortBy: e.target.value as FeedFilters["sortBy"],
            }))
          }
          className="bg-white/[0.03] border border-white/[0.07] rounded-[9px] px-3 py-1.5 text-[12px] text-white/50 outline-none cursor-pointer hover:border-white/[0.12] transition-colors"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option
              key={value}
              value={value}
              className="bg-[#0d0d1a]"
            >
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <FeedCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
          <p className="text-4xl mb-3">🐱</p>

          <p className="text-[14px] text-white/40">
            No posts yet. Be the first to post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <FeedCard
              key={post.id}
              post={post}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              onRepost={toggleRepost}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// apps/frontend/features/posts/usePostFeed.ts
"use client";

import { useState, useCallback } from "react";
import type { Post, ReactionType } from "@/types/systems";
import { MOCK_POSTS } from "@/lib/systemsMockData";

export function usePostFeed() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(false);

  const likePost = useCallback((id: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
  }, []);

  const reactToPost = useCallback((id: string, type: ReactionType) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) => {
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
  }, []);

  const repostPost = useCallback((id: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === id
          ? { ...p, isReposted: !p.isReposted, repostsCount: p.isReposted ? p.repostsCount - 1 : p.repostsCount + 1 }
          : p
      )
    );
  }, []);

  const bookmarkPost = useCallback((id: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts((prev: Post[]) => [post, ...prev]);
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev: Post[]) => prev.filter((p: Post) => p.id !== id));
  }, []);

  return { posts, isLoading, likePost, reactToPost, repostPost, bookmarkPost, addPost, deletePost };
}
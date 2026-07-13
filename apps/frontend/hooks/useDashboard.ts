// apps/frontend/hooks/useDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Post, FeedFilters, Notification } from "@/types";
import {
  MOCK_USER,
  MOCK_CLONE,
  MOCK_POSTS,
  MOCK_NOTIFICATIONS,
  MOCK_SUGGESTED_USERS,
  MOCK_SUGGESTED_CLOWDERS,
} from "@/lib/mockData";

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return { user: MOCK_USER, clone: MOCK_CLONE, isLoading };
}

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FeedFilters>({
    type: "all",
    sortBy: "latest",
  });

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [filters]);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
  }, []);

  const toggleBookmark = useCallback((postId: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  }, []);

  const toggleRepost = useCallback((postId: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === postId
          ? { ...p, isReposted: !p.isReposted, repostsCount: p.isReposted ? p.repostsCount - 1 : p.repostsCount + 1 }
          : p
      )
    );
  }, []);

  return {
    posts,
    isLoading,
    filters,
    setFilters,
    toggleLike,
    toggleBookmark,
    toggleRepost,
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev: Notification[]) => prev.map((n: Notification) => ({ ...n, isRead: true })));
  }, []);

  return { notifications, unreadCount, markAllRead };
}

export function useSuggestions() {
  return {
    suggestedUsers: MOCK_SUGGESTED_USERS,
    suggestedClowders: MOCK_SUGGESTED_CLOWDERS,
  };
}

export function useCloneWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [thought, setThought] = useState(0);

  const THOUGHTS = [
    "I've been thinking about what you said earlier...",
    "Did you know 73% of cats prefer nighttime activities? Just like us. 😸",
    "Your personality profile is evolving. I'm learning every day!",
    "Three users in your Clowder are online. Shall I say hi?",
    "I noticed you haven't trained me today. I miss our sessions!",
    "I just had a fascinating chat with Nova from Neon Paws.",
  ];

  useEffect(() => {
    const t = setInterval(() => {
    setThought((prev: number) => (prev + 1) % THOUGHTS.length);
    }, 8000);
    return () => clearInterval(t);
  }, [THOUGHTS.length]);

  return {
    isOpen,
    setIsOpen,
    currentThought: THOUGHTS[thought],
    clone: MOCK_CLONE,
  };
}

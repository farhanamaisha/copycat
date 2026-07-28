// apps/frontend/hooks/useDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Post, FeedFilters, Notification } from "@/types";
import {
  MOCK_POSTS,
  MOCK_NOTIFICATIONS,
  MOCK_SUGGESTED_USERS,
  MOCK_SUGGESTED_CLOWDERS,
} from "@/lib/mockData";

import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api/client";
interface CloneTrait {
  name: string;
  value: number;
}

interface CloneActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface Clone {
  id: string;
  userId: string;
  name: string;
  mood: string;
  level: number;
  accuracyPercent: number;
  isOnline: boolean;
  trainingCount: number;
  personalityProgress: number;
  traits: CloneTrait[];
  recentActivity: CloneActivity[];
}

export function useCurrentUser() {
  const { user, loading } = useAuth();
  const [clone, setClone] = useState<Clone | null>(null);
  const [cloneLoading, setCloneLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadClone = async () => {
      try {
       const cloneData = await apiClient.get("/clones/me") as Clone;
       setClone(cloneData);
      } catch (error) {
        console.error("Failed to load clone:", error);
        // Fall back to a default clone structure
        setClone({
  id: "default_clone",
  userId: user.id,
  name: user.displayName + "'s Clone",
  mood: "curious",
  level: 1,
  accuracyPercent: 0,
  isOnline: false,
  trainingCount: 0,
  personalityProgress: 0,
  traits: [],
  recentActivity: [],
});
      } finally {
        setCloneLoading(false);
      }
    };

    loadClone();
  }, [user]);

  return {
    user,
    clone,
    isLoading: loading || cloneLoading,
  };
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
    const loadFeed = async () => {
      try {
        const feedData = await apiClient.get("/posts/feed");
        setPosts(Array.isArray(feedData) ? feedData : []);
      } catch (error) {
        console.error("Failed to load feed:", error);
        // Fall back to mock posts
        setPosts(MOCK_POSTS);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadFeed();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev: Post[]) =>
      prev.map((p: Post) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );

    // Sync with backend
    apiClient.post(`/posts/${postId}/like`, {}).catch((error) => {
      console.error("Failed to toggle like:", error);
    });
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

  const { clone } = useCurrentUser();

  return {
    isOpen,
    setIsOpen,
    currentThought: THOUGHTS[thought],
    clone: clone || {
      id: "default_clone",
      name: "Clone",
      mood: "curious",
    },
  };
}

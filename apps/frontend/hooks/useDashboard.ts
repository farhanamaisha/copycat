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

  const loadFeed = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await apiClient.get<
        { success: boolean; data: Post[] } | Post[]
      >(
        `/posts/feed?type=${filters.type}&sortBy=${filters.sortBy}`,
      );

      const data = Array.isArray(response)
        ? response
        : response.data;

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load feed:", error);

      // IMPORTANT: no mock fallback
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.type, filters.sortBy]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const toggleLike = useCallback(async (postId: string) => {
    // Optimistic UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked
                ? p.likesCount - 1
                : p.likesCount + 1,
            }
          : p,
      ),
    );

    try {
      await apiClient.post(`/posts/${postId}/like`, {});
    } catch (error) {
      console.error("Failed to toggle like:", error);

      // Reload real backend state if request fails
      await loadFeed();
    }
  }, [loadFeed]);

  const toggleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isBookmarked: !p.isBookmarked,
            }
          : p,
      ),
    );
  }, []);

  const toggleRepost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isReposted: !p.isReposted,
              repostsCount: p.isReposted
                ? p.repostsCount - 1
                : p.repostsCount + 1,
            }
          : p,
      ),
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);

      const [notificationsResponse, unreadResponse] =
        await Promise.all([
          apiClient.get<{
            success: boolean;
            data: Notification[];
          }>("/notifications"),

          apiClient.get<{
            success: boolean;
            data: { count: number };
          }>("/notifications/unread-count"),
        ]);

      setNotifications(notificationsResponse.data);
      setUnreadCount(unreadResponse.data.count);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.patch(
        `/notifications/${notificationId}/read`,
        {},
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiClient.patch(
        "/notifications/read-all",
        {},
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    reloadNotifications: loadNotifications,
  };
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

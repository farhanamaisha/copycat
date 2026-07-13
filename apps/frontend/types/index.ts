// apps/frontend/types/index.ts

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  clowdersCount: number;
  createdAt: string;
  isVerified: boolean;
  isPremium: boolean;
}

export interface Clone {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  personalityProgress: number; // 0–100
  intelligenceScore: number;   // 0–100
  level: number;
  accuracyPercent: number;
  mood: CloneMood;
  isOnline: boolean;
  trainingCount: number;
  lastActive: string;
  traits: CloneTrait[];
  recentActivity: CloneActivity[];
}

export type CloneMood =
  | "curious"
  | "playful"
  | "focused"
  | "chill"
  | "energetic"
  | "sleepy";

export interface CloneTrait {
  name: string;
  value: number; // 0–100
}

export interface CloneActivity {
  id: string;
  type: "learned" | "interacted" | "trained" | "thought";
  description: string;
  timestamp: string;
}

export interface Post {
  id: string;
  type: PostType;
  author: User;
  clone?: Clone;
  content: string;
  imageUrls?: string[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  clowder?: Clowder;
  tags?: string[];
  createdAt: string;
  aiGenerated?: boolean;
}

export type PostType =
  | "user_post"
  | "clone_post"
  | "clone_interaction"
  | "training_achievement"
  | "clowder_activity"
  | "ai_recommendation"
  | "system_event";

export interface Clowder {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  membersCount: number;
  postsCount: number;
  isJoined: boolean;
  category: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actor?: User;
  createdAt: string;
  link?: string;
}

export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "clone_message"
  | "training_complete"
  | "clowder_invite"
  | "mention"
  | "system";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface FeedFilters {
  type: "all" | "posts" | "clones" | "clowders" | "achievements";
  sortBy: "latest" | "popular" | "recommended";
}

export interface DashboardStats {
  newFollowers: number;
  totalLikes: number;
  cloneInteractions: number;
  trainingSessionsThisWeek: number;
}

export type SidebarItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  isActive?: boolean;
};

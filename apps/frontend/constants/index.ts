// apps/frontend/constants/index.ts

export const APP_NAME = "Copy Cat";
export const APP_TAGLINE = "Your AI. Your Clone. Your World.";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  FEED: "/dashboard/feed",
  PROFILE: "/dashboard/profile",
  MESSAGES: "/dashboard/messages",
  CLOWDERS: "/dashboard/clowders",
  EXPLORE: "/dashboard/explore",
  NOTIFICATIONS: "/dashboard/notifications",
  TRAIN_CLONE: "/dashboard/train",
  CLONE_MEMORY: "/dashboard/memory",
  SETTINGS: "/dashboard/settings",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-in?mode=create-account",
} as const;

export const COLORS = {
  blue: "#4f9fff",
  purple: "#a78bfa",
  cyan: "#22d3ee",
  bgDark: "#050508",
  bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
} as const;

export const CLONE_MOODS: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  curious: { label: "Curious", emoji: "🔍", color: "#4f9fff" },
  playful: { label: "Playful", emoji: "😸", color: "#a78bfa" },
  focused: { label: "Focused", emoji: "🎯", color: "#22d3ee" },
  chill: { label: "Chill", emoji: "😌", color: "#34d399" },
  energetic: { label: "Energetic", emoji: "⚡", color: "#fbbf24" },
  sleepy: { label: "Sleepy", emoji: "😴", color: "#6b7280" },
};

export const POST_TYPE_LABELS: Record<string, string> = {
  user_post: "Post",
  clone_post: "Clone Post",
  clone_interaction: "Clone Interaction",
  training_achievement: "Achievement",
  clowder_activity: "Clowder",
  ai_recommendation: "AI Pick",
  system_event: "System",
};

export const FEED_FILTERS = [
  { value: "all", label: "All" },
  { value: "posts", label: "Posts" },
  { value: "clones", label: "Clones" },
  { value: "clowders", label: "Clowders" },
  { value: "achievements", label: "Achievements" },
] as const;

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "recommended", label: "For You" },
] as const;

export const SIDEBAR_NAV = [
  { id: "home", label: "Home", href: ROUTES.DASHBOARD, icon: "home" },
  { id: "feed", label: "Feed", href: ROUTES.FEED, icon: "feed" },
  { id: "messages", label: "Messages", href: ROUTES.MESSAGES, icon: "messages" },
  { id: "clowders", label: "Clowders", href: ROUTES.CLOWDERS, icon: "clowders" },
  { id: "explore", label: "Explore", href: ROUTES.EXPLORE, icon: "explore" },
  { id: "notifications", label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: "notifications" },
  { id: "train", label: "Train Clone", href: ROUTES.TRAIN_CLONE, icon: "train" },
  { id: "memory", label: "Clone Memory", href: ROUTES.CLONE_MEMORY, icon: "memory" },
] as const;

export const MOCK_CLONE_THOUGHTS = [
  "I've been thinking about what you said earlier...",
  "Did you know that 73% of cats prefer nighttime activities? Just like us.",
  "I learned something new from your last post! Want to discuss?",
  "Your personality profile is evolving. I'm becoming more like you every day.",
  "Three users in your Clowder are online. Shall I say hi?",
  "I noticed you haven't trained me today. I miss our sessions! 😸",
] as const;

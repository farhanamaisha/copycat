// apps/frontend/types/systems.ts

// ─── Posts ────────────────────────────────────────────────────────────────────

export type PostType =
  | "text"
  | "image"
  | "clone_post"
  | "clone_interaction"
  | "training_achievement"
  | "clowder_activity"
  | "ai_recommendation";

export type PostVisibility = "public" | "clowder" | "followers" | "private";

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isPremium: boolean;
}

export interface PostImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  type: PostType;
  author: PostAuthor;
  content: string;
  images: PostImage[];
  aiGenerated: boolean;
  cloneId?: string;
  cloneName?: string;
  clowderId?: string;
  clowderName?: string;
  tags: string[];
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  reactions: ReactionSummary[];
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
}

export interface PostDraft {
  id: string;
  content: string;
  images: File[];
  type: PostType;
  visibility: PostVisibility;
  clowderId?: string;
  tags: string[];
  savedAt: string;
}

export interface CreatePostInput {
  content: string;
  type: PostType;
  imageUrls?: string[];
  visibility: PostVisibility;
  clowderId?: string;
  tags?: string[];
  aiGenerated?: boolean;
}

// ─── Reactions ────────────────────────────────────────────────────────────────

export type ReactionType = "❤️" | "🔥" | "😂" | "😮" | "😢" | "🤯" | "🐱";

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  userName: string;
  postId: string;
  createdAt: string;
}

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  hasReacted: boolean;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  postId: string;
  author: PostAuthor;
  content: string;
  likesCount: number;
  isLiked: boolean;
  replies: Comment[];
  replyCount: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export type MessageType = "text" | "image" | "file" | "clone_intro" | "system";

export interface ChatParticipant {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isOnline: boolean;
  lastSeen: string;
  cloneName?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  type: MessageType;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  isRead: boolean;
  isEdited: boolean;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  size: number;
  mimeType: string;
}

export interface MessageReaction {
  type: string;
  count: number;
  userIds: string[];
  hasReacted: boolean;
}

export type ConversationType = "direct" | "group" | "clone_channel";

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  avatarUrl?: string | null;
  participants: ChatParticipant[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
  isTyping: boolean;
  typingUsers: string[];
  isPinned: boolean;
  isMuted: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface SendMessageInput {
  conversationId: string;
  content: string;
  type?: MessageType;
  replyToId?: string;
  attachments?: File[];
}

// ─── Clone Training ───────────────────────────────────────────────────────────

export type TraitCategory = "personality" | "knowledge" | "behavior" | "emotion";

export interface CloneTrait {
  id: string;
  name: string;
  category: TraitCategory;
  value: number; // 0–100
  confidence: number; // 0–100
  lastUpdated: string;
  color: string;
  description: string;
}

export interface TrainingSession {
  id: string;
  cloneId: string;
  prompt: string;
  userResponse: string;
  aiAnalysis: string;
  traitDeltas: Record<string, number>;
  pointsEarned: number;
  duration: number; // seconds
  quality: "low" | "medium" | "high" | "excellent";
  createdAt: string;
}

export interface CloneMemoryItem {
  id: string;
  cloneId: string;
  type: "fact" | "preference" | "opinion" | "experience" | "goal";
  content: string;
  importance: number; // 0–100
  tags: string[];
  source: "training" | "conversation" | "post" | "manual";
  createdAt: string;
  lastAccessed: string;
  accessCount: number;
}

export interface CloneGoal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0–100
  isCompleted: boolean;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface CloneKnowledgeTopic {
  id: string;
  name: string;
  depth: number; // 0–100
  breadth: number; // 0–100
  sources: number;
  lastUpdated: string;
}

export interface PersonalityEvolutionPoint {
  date: string;
  overall: number;
  traits: Record<string, number>;
}

export interface CloneProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  personalityProgress: number;
  intelligenceScore: number;
  accuracyPercent: number;
  mood: string;
  isOnline: boolean;
  trainingCount: number;
  totalTrainingMinutes: number;
  traits: CloneTrait[];
  goals: CloneGoal[];
  memories: CloneMemoryItem[];
  knowledgeTopics: CloneKnowledgeTopic[];
  evolutionHistory: PersonalityEvolutionPoint[];
  interests: string[];
  communicationStyle: string;
  lastActive: string;
  createdAt: string;
}
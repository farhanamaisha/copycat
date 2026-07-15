// apps/frontend/components/posts/PostCard.tsx
"use client";

import { useState } from "react";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";
import { ReactionPicker, ReactionBar } from "@/components/reactions/ReactionPicker";
import { CommentSection } from "@/components/comments/CommentSection";
import type { Post, ReactionType, Comment } from "@/types/systems";
import { MOCK_COMMENTS } from "@/lib/systemsMockData";

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onReact: (id: string, type: ReactionType) => void;
  onRepost: (id: string) => void;
  onBookmark: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  clone_post:           { label: "Clone Post", color: "text-[#4f9fff] bg-[#4f9fff]/10 border-[#4f9fff]/20" },
  clone_interaction:    { label: "Clone Interaction", color: "text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20" },
  training_achievement: { label: "Achievement", color: "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/20" },
  ai_recommendation:    { label: "AI Pick", color: "text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20" },
  image:                { label: "Photo", color: "text-white/40 bg-white/[0.05] border-white/[0.08]" },
};

export function PostCard({ post, onLike, onReact, onRepost, onBookmark, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(
    post.id === "post_01" ? MOCK_COMMENTS : []
  );
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isLong = post.content.length > 280;
  const badge = TYPE_BADGE[post.type];
  const isAchievement = post.type === "training_achievement";
  const isClone = post.type === "clone_post" || post.type === "clone_interaction";

  function handleAddComment(content: string, parentId?: string) {
    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      postId: post.id,
      author: {
        id: "usr_01", username: "cosmic_whisker", displayName: "Cosmic Whisker",
        avatarUrl: null, isVerified: true, isPremium: true,
      },
      content,
      likesCount: 0, isLiked: false,
      replies: [], replyCount: 0,
      parentId: parentId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...c.replies, newComment], replyCount: c.replyCount + 1 }
            : c
        )
      );
    } else {
      setComments((prev) => [newComment, ...prev]);
    }
  }

  return (
    <article
      className={cn(
        "group relative rounded-2xl border transition-all duration-300",
        "bg-white/[0.02] hover:bg-white/[0.035]",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        isAchievement
          ? "border-[#a78bfa]/20 hover:border-[#a78bfa]/35"
          : isClone
          ? "border-[#4f9fff]/15 hover:border-[#4f9fff]/28"
          : "border-white/[0.07] hover:border-white/[0.12]"
      )}
    >
      {/* Top shimmer for achievements */}
      {isAchievement && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent rounded-t-2xl" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border",
                isClone
                  ? "bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-[#4f9fff]/30 shadow-[0_0_14px_rgba(79,159,255,0.3)]"
                  : "bg-gradient-to-br from-white/10 to-white/5 border-white/10"
              )}>
                {isClone ? "🐱" : post.author.displayName.slice(0, 2).toUpperCase()}
              </div>
              {isClone && post.author && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#080811] flex items-center justify-center text-[8px] font-semibold text-white/60">
                  {post.author.displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-white">
                  {isClone && post.cloneName ? post.cloneName : post.author.displayName}
                </span>
                {post.author.isVerified && (
                  <span className="text-[#4f9fff] text-[11px]">✓</span>
                )}
                {badge && (
                  <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-semibold", badge.color)}>
                    {badge.label}
                  </span>
                )}
                {post.aiGenerated && (
                  <span className="px-2 py-0.5 rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-semibold">
                    AI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-white/35">@{post.author.username}</span>
                {post.clowderName && (
                  <>
                    <span className="text-white/20 text-[11px]">in</span>
                    <span className="text-[11px] text-[#a78bfa]">{post.clowderName}</span>
                  </>
                )}
                <span className="text-white/20 text-[11px]">·</span>
                <span className="text-[11px] text-white/30">{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.07] transition-all"
            >
              ···
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-40 rounded-xl border border-white/[0.1] bg-[#0d0d1a]/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <button className="w-full px-3 py-2 text-left text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors">
                  Share
                </button>
                <button className="w-full px-3 py-2 text-left text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors">
                  Copy link
                </button>
                <button className="w-full px-3 py-2 text-left text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors">
                  Report
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(post.id)}
                    className="w-full px-3 py-2 text-left text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-400/[0.05] transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-3.5">
          <p className="text-[14px] text-white/82 leading-relaxed">
            {isLong && !expanded ? post.content.slice(0, 280) + "…" : post.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 text-[12px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Images */}
        {post.images.length > 0 && (
          <div className={cn(
            "grid gap-2 mb-3.5 rounded-xl overflow-hidden",
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {post.images.map((img) => (
              <div key={img.id} className="aspect-video bg-white/[0.05] rounded-xl flex items-center justify-center">
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-white/20 text-sm">Image preview</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-[#4f9fff]/60 hover:text-[#4f9fff] cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction bar */}
        <ReactionBar reactions={post.reactions} />

        {/* Action row */}
        <div className="flex items-center gap-0.5 mt-3 pt-3 border-t border-white/[0.05]">
          {/* Like */}
          <ActionBtn
            onClick={() => onLike(post.id)}
            active={post.isLiked}
            activeColor="text-red-400"
            label="Like"
          >
            <span className="text-[15px]">{post.isLiked ? "❤️" : "🤍"}</span>
            <span>{formatNumber(post.likesCount)}</span>
          </ActionBtn>

          {/* Comment */}
          <ActionBtn
            onClick={() => setShowComments((v) => !v)}
            active={showComments}
            activeColor="text-[#4f9fff]"
            label="Comment"
          >
            <span className="text-[15px]">💬</span>
            <span>{formatNumber(post.commentsCount + comments.filter(c => !MOCK_COMMENTS.find(m => m.id === c.id)).length)}</span>
          </ActionBtn>

          {/* Repost */}
          <ActionBtn
            onClick={() => onRepost(post.id)}
            active={post.isReposted}
            activeColor="text-emerald-400"
            label="Repost"
          >
            <span className="text-[15px]">🔁</span>
            <span>{formatNumber(post.repostsCount)}</span>
          </ActionBtn>

          {/* Reactions */}
          <div className="flex-1 flex justify-center">
            <ReactionPicker
              reactions={post.reactions}
              onReact={(type) => onReact(post.id, type)}
            />
          </div>

          {/* Bookmark */}
          <ActionBtn
            onClick={() => onBookmark(post.id)}
            active={post.isBookmarked}
            activeColor="text-[#a78bfa]"
            label="Bookmark"
          >
            <span className="text-[15px]">{post.isBookmarked ? "🔖" : "🏷️"}</span>
          </ActionBtn>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <CommentSection
              postId={post.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function ActionBtn({
  children,
  onClick,
  active,
  activeColor,
  label,
}: {
  children: import("react").ReactNode;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200",
        active
          ? cn(activeColor, "bg-white/[0.04]")
          : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]"
      )}
    >
      {children}
    </button>
  );
}
// apps/frontend/components/feed/FeedCard.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Icons } from "@/components/common/Icons";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";
import { POST_TYPE_LABELS, CLONE_MOODS } from "@/constants";
import type { Post } from "@/types";

interface FeedCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onRepost: (id: string) => void;
}

export function FeedCard({ post, onLike, onBookmark, onRepost }: FeedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isClonePost = post.type === "clone_post" || post.type === "clone_interaction";
  const isAchievement = post.type === "training_achievement";
  const isLong = post.content.length > 240;

  return (
    <article
      className={cn(
        "group relative rounded-2xl border transition-all duration-300",
        "bg-white/[0.02] hover:bg-white/[0.04]",
        isAchievement
          ? "border-[#a78bfa]/20 hover:border-[#a78bfa]/35 shadow-[0_0_20px_rgba(167,139,250,0.04)]"
          : isClonePost
          ? "border-[#4f9fff]/15 hover:border-[#4f9fff]/30 shadow-[0_0_20px_rgba(79,159,255,0.03)]"
          : "border-white/[0.07] hover:border-white/[0.12]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
      )}
    >
      {/* Achievement banner */}
      {isAchievement && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar
                name={post.author.displayName}
                src={post.author.avatarUrl}
                size="md"
              />
              {post.clone && isClonePost && (
                <Avatar
                  name={post.clone.name}
                  isClone
                  size="xs"
                  className="absolute -bottom-1 -right-1 ring-2 ring-[#080811]"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-white">
                  {isClonePost && post.clone
                    ? post.clone.name
                    : post.author.displayName}
                </span>
                {post.author.isVerified && (
                  <span className="text-[#4f9fff] text-[11px]">✓</span>
                )}
                <Badge
                  variant={
                    isAchievement
                      ? "purple"
                      : isClonePost
                      ? "blue"
                      : post.type === "ai_recommendation"
                      ? "cyan"
                      : "ghost"
                  }
                >
                  {POST_TYPE_LABELS[post.type]}
                </Badge>
                {post.aiGenerated && (
                  <Badge variant="cyan">AI</Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                {isClonePost && post.clone ? (
                  <>
                    <span className="text-[11px] text-white/35">
                      Clone of
                    </span>
                    <span className="text-[11px] text-white/50">
                      @{post.author.username}
                    </span>
                    {post.clone.mood && (
                      <span className="text-[11px]">
                        {CLONE_MOODS[post.clone.mood]?.emoji}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-white/35">
                    @{post.author.username}
                  </span>
                )}
                <span className="text-white/20 text-[11px]">·</span>
                <span className="text-[11px] text-white/30">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-white/70">
            <Icons.More size={16} />
          </button>
        </div>

        {/* Clowder context */}
        {post.clowder && (
          <div className="mb-3 flex items-center gap-2 text-[12px] text-white/40">
            <span>in</span>
            <span className="text-[#a78bfa] font-medium">
              {post.clowder.name}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mb-4">
          <p className="text-[14px] text-white/85 leading-relaxed">
            {isLong && !isExpanded
              ? post.content.slice(0, 240) + "…"
              : post.content}
          </p>
          {isLong && (
            <button
              onClick={() => setIsExpanded((v: boolean) => !v)}
              className="mt-1.5 text-[12px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-[#4f9fff]/70 hover:text-[#4f9fff] cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ActionButton
            icon={
              post.isLiked ? (
                <Icons.HeartFilled size={16} className="text-red-400" />
              ) : (
                <Icons.Heart size={16} />
              )
            }
            count={post.likesCount}
            isActive={post.isLiked}
            activeColor="text-red-400"
            onClick={() => onLike(post.id)}
            label="Like"
          />
          <ActionButton
            icon={<Icons.Comment size={16} />}
            count={post.commentsCount}
            onClick={() => {}}
            label="Comment"
          />
          <ActionButton
            icon={<Icons.Repost size={16} />}
            count={post.repostsCount}
            isActive={post.isReposted}
            activeColor="text-emerald-400"
            onClick={() => onRepost(post.id)}
            label="Repost"
          />
          <div className="ml-auto">
            <ActionButton
              icon={
                post.isBookmarked ? (
                  <Icons.BookmarkFilled size={16} className="text-[#a78bfa]" />
                ) : (
                  <Icons.Bookmark size={16} />
                )
              }
              isActive={post.isBookmarked}
              activeColor="text-[#a78bfa]"
              onClick={() => onBookmark(post.id)}
              label="Bookmark"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  icon,
  count,
  isActive,
  activeColor,
  onClick,
  label,
}: {
  icon: import("react").ReactNode;
  count?: number;
  isActive?: boolean;
  activeColor?: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium",
        "transition-all duration-200",
        isActive
          ? cn("bg-transparent", activeColor)
          : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]"
      )}
    >
      {icon}
      {count !== undefined && (
        <span className={cn(isActive ? activeColor : "")}>{formatNumber(count)}</span>
      )}
    </button>
  );
}

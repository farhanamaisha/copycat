"use client";

import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Icons } from "@/components/common/Icons";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";
import { POST_TYPE_LABELS, CLONE_MOODS } from "@/constants";
import { apiClient } from "@/services/api/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Post } from "@/types";

interface FeedCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onRepost: (id: string) => void;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName?: string | null;
    avatarUrl?: string | null;
  };
}

export function FeedCard({
  post,
  onLike,
  onBookmark,
  onRepost,
}: FeedCardProps) {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const [commentError, setCommentError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const [showPostMenu, setShowPostMenu] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const isClonePost =
    post.type === "clone_post" ||
    post.type === "clone_interaction";

  const isAchievement = post.type === "training_achievement";
  const isLong = post.content.length > 240;

  const isPostOwner = user?.id === post.author.id;

  async function handleComments() {
    const next = !showComments;

    setShowComments(next);

    if (!next || comments.length > 0) {
      return;
    }

    try {
      setLoadingComments(true);
      setCommentError(null);

      const response = await apiClient.get<Comment[]>(
        `/posts/${post.id}/comments`,
      );

      setComments(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to load comments:", error);

      setCommentError(
        error instanceof Error
          ? error.message
          : "Failed to load comments",
      );
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleCreateComment() {
    const content = commentText.trim();

    if (!content) {
      return;
    }

    try {
      setPostingComment(true);
      setCommentError(null);

      const comment = await apiClient.post<Comment>(
        `/posts/${post.id}/comments`,
        {
          content,
        },
      );

      setComments((prev) => [...prev, comment]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error);

      setCommentError(
        error instanceof Error
          ? error.message
          : "Failed to create comment",
      );
    } finally {
      setPostingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCommentId(commentId);
      setCommentError(null);

      await apiClient.delete(
        `/posts/comments/${commentId}`,
      );

      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId),
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);

      setCommentError(
        error instanceof Error
          ? error.message
          : "Failed to delete comment",
      );
    } finally {
      setDeletingCommentId(null);
    }
  }

  async function handleDeletePost() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPost(true);
      setPostError(null);
      setShowPostMenu(false);

      await apiClient.delete(`/posts/${post.id}`);

      // Reload feed so the deleted post disappears immediately.
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete post:", error);

      setPostError(
        error instanceof Error
          ? error.message
          : "Failed to delete post",
      );

      setDeletingPost(false);
    }
  }

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

        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5",
      )}
    >
      {isAchievement && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent" />
      )}

      <div className="p-5">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar
                name={
                  post.author.displayName ??
                  post.author.username
                }
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
                    : post.author.displayName ??
                      post.author.username}
                </span>

                {post.author.isVerified && (
                  <span className="text-[#4f9fff] text-[11px]">
                    ✓
                  </span>
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

                <span className="text-white/20 text-[11px]">
                  ·
                </span>

                <span className="text-[11px] text-white/30">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* MORE MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowPostMenu((value) => !value)
              }
              disabled={deletingPost}
              aria-label="Post options"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-white/70 disabled:opacity-40"
            >
              <Icons.More size={16} />
            </button>

            {showPostMenu && (
              <div className="absolute right-0 top-9 z-30 w-36 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d1a] shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
                {isPostOwner ? (
                  <button
                    type="button"
                    onClick={handleDeletePost}
                    disabled={deletingPost}
                    className="w-full px-3 py-2.5 text-left text-[12px] text-red-400 hover:bg-red-400/[0.08] transition-colors disabled:opacity-50"
                  >
                    {deletingPost
                      ? "Deleting..."
                      : "Delete post"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPostMenu(false)}
                    className="w-full px-3 py-2.5 text-left text-[12px] text-white/40 hover:bg-white/[0.05]"
                  >
                    No actions available
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* POST ERROR */}
        {postError && (
          <p className="mb-3 text-[11px] text-red-400">
            {postError}
          </p>
        )}

        {/* CLOWDER */}
        {post.clowder && (
          <div className="mb-3 flex items-center gap-2 text-[12px] text-white/40">
            <span>in</span>

            <span className="text-[#a78bfa] font-medium">
              {post.clowder.name}
            </span>
          </div>
        )}

        {/* CONTENT */}
        <div className="mb-4">
          <p className="text-[14px] text-white/85 leading-relaxed">
            {isLong && !isExpanded
              ? post.content.slice(0, 240) + "…"
              : post.content}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() =>
                setIsExpanded((value) => !value)
              }
              className="mt-1.5 text-[12px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* TAGS */}
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

        {/* ACTIONS */}
        <div className="flex items-center gap-1">

          {/* LIKE */}
          <ActionButton
            icon={
              post.isLiked ? (
                <Icons.HeartFilled
                  size={16}
                  className="text-red-400"
                />
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

          {/* COMMENT */}
          <ActionButton
            icon={<Icons.Comment size={16} />}
            count={
              comments.length > 0
                ? comments.length
                : post.commentsCount
            }
            isActive={showComments}
            activeColor="text-[#4f9fff]"
            onClick={handleComments}
            label="Comment"
          />

          {/* REPOST */}
          <ActionButton
            icon={<Icons.Repost size={16} />}
            count={post.repostsCount}
            isActive={post.isReposted}
            activeColor="text-emerald-400"
            onClick={() => onRepost(post.id)}
            label="Repost"
          />

          {/* BOOKMARK */}
          <div className="ml-auto">
            <ActionButton
              icon={
                post.isBookmarked ? (
                  <Icons.BookmarkFilled
                    size={16}
                    className="text-[#a78bfa]"
                  />
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

        {/* COMMENTS */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">

            {/* CREATE COMMENT */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleCreateComment();
                  }
                }}
                placeholder="Write a comment..."
                disabled={postingComment}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[12px] text-white outline-none placeholder:text-white/25 focus:border-[#4f9fff]/30"
              />

              <button
                type="button"
                onClick={handleCreateComment}
                disabled={
                  postingComment ||
                  !commentText.trim()
                }
                className="px-3 py-2 rounded-xl bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {postingComment ? "..." : "Send"}
              </button>
            </div>

            {/* ERROR */}
            {commentError && (
              <p className="text-[11px] text-red-400 mb-3">
                {commentError}
              </p>
            )}

            {/* LOADING */}
            {loadingComments ? (
              <p className="text-[12px] text-white/30 text-center py-3">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-[12px] text-white/30 text-center py-3">
                No comments yet. Be the first!
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const isCommentOwner =
                    user?.id === comment.author.id;

                  const isDeleting =
                    deletingCommentId === comment.id;

                  return (
                    <div
                      key={comment.id}
                      className="flex gap-2.5"
                    >
                      <Avatar
                        name={
                          comment.author.displayName ??
                          comment.author.username
                        }
                        src={comment.author.avatarUrl}
                        size="xs"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 rounded-xl bg-white/[0.03] px-3 py-2">
                            <p className="text-[11px] font-semibold text-white/70">
                              {comment.author.displayName ??
                                comment.author.username}
                            </p>

                            <p className="text-[12px] text-white/65 mt-0.5 break-words">
                              {comment.content}
                            </p>
                          </div>

                          {/* COMMENT DELETE */}
                          {isCommentOwner && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteComment(
                                  comment.id,
                                )
                              }
                              disabled={isDeleting}
                              className="shrink-0 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors disabled:opacity-40"
                              aria-label="Delete comment"
                              title="Delete comment"
                            >
                              {isDeleting ? (
                                <span className="text-[10px]">
                                  ...
                                </span>
                              ) : (
                                <span className="text-[12px]">
                                  🗑
                                </span>
                              )}
                            </button>
                          )}
                        </div>

                        <p className="text-[10px] text-white/25 mt-1 ml-2">
                          {formatRelativeTime(
                            comment.createdAt,
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
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
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium",
        "transition-all duration-200",

        isActive
          ? cn("bg-transparent", activeColor)
          : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]",
      )}
    >
      {icon}

      {count !== undefined && (
        <span className={cn(isActive ? activeColor : "")}>
          {formatNumber(count)}
        </span>
      )}
    </button>
  );
}
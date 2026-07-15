// apps/frontend/components/comments/CommentSection.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Comment } from "@/types/systems";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
}

export function CommentSection({ postId, comments, onAddComment }: CommentSectionProps) {
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const content = input.trim();
    if (!content || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onAddComment(content);
    setInput("");
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {/* Compose */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/60 shrink-0">
          Me
        </div>
        <div className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.03] focus-within:border-[#4f9fff]/30 transition-colors overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a comment…"
            rows={2}
            className="w-full bg-transparent px-3 py-2.5 text-[13px] text-white/80 placeholder:text-white/25 outline-none resize-none leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleSubmit();
            }}
          />
          {input.trim() && (
            <div className="flex justify-end px-3 pb-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-3 py-1 rounded-lg bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/25 disabled:opacity-50 transition-all"
              >
                {submitting ? "Posting…" : "Reply"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={onAddComment} />
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onReply: (content: string, parentId?: string) => void;
  isReply?: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likesCount);
  const [showReplies, setShowReplies] = useState(false);

  function handleLike() {
    setLiked((v) => !v);
    setLikes((v) => (liked ? v - 1 : v + 1));
  }

  async function submitReply() {
    const content = replyInput.trim();
    if (!content) return;
    onReply(content, comment.id);
    setReplyInput("");
    setShowReply(false);
  }

  return (
    <div className={cn("flex gap-3", isReply && "ml-10")}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[10px] font-semibold text-white/60 shrink-0 mt-0.5">
        {comment.author.displayName.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-semibold text-white">
              {comment.author.displayName}
            </span>
            {comment.author.isVerified && (
              <span className="text-[#4f9fff] text-[10px]">✓</span>
            )}
            <span className="text-[11px] text-white/30">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-[13px] text-white/75 leading-relaxed">
            {comment.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1.5 px-1">
          <button
            onClick={handleLike}
            className={cn(
              "text-[11px] font-medium transition-colors",
              liked ? "text-red-400" : "text-white/35 hover:text-white/60"
            )}
          >
            {liked ? "❤️" : "♡"} {likes > 0 && likes}
          </button>
          <button
            onClick={() => setShowReply((v) => !v)}
            className="text-[11px] text-white/35 hover:text-white/60 font-medium transition-colors"
          >
            Reply
          </button>
          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="text-[11px] text-[#4f9fff] hover:text-[#7cb4ff] font-medium transition-colors"
            >
              {showReplies ? "Hide" : `Show ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>

        {/* Reply input */}
        {showReply && (
          <div className="flex gap-2 mt-2">
            <input
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder={`Reply to ${comment.author.displayName}…`}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/30 transition-colors"
              onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
            />
            <button
              onClick={submitReply}
              className="px-3 py-1.5 rounded-lg bg-[#4f9fff]/15 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/25 transition-all"
            >
              Post
            </button>
          </div>
        )}

        {/* Replies */}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

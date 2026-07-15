// apps/frontend/components/chat/ChatMessage.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/systems";

const QUICK_REACTIONS = ["❤️", "🔥", "😂", "🐱"];

interface ChatMessageProps {
  message: ChatMessageType;
  isMine: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export function ChatMessage({ message, isMine, showAvatar = true, showTimestamp = false }: ChatMessageProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  return (
    <div className={cn("group flex gap-2.5", isMine ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {showAvatar && !isMine ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[10px] font-semibold text-white/50 shrink-0 mt-auto mb-0.5">
          {message.senderName.slice(0, 2).toUpperCase()}
        </div>
      ) : (
        <div className="w-7 shrink-0" />
      )}

      <div className={cn("max-w-[72%] flex flex-col", isMine ? "items-end" : "items-start")}>
        {/* Sender name for groups */}
        {showAvatar && !isMine && (
          <span className="text-[11px] text-white/35 mb-1 px-1">{message.senderName}</span>
        )}

        {/* Reply context */}
        {message.replyTo && (
          <div className="mb-1 px-3 py-1.5 rounded-lg border-l-2 border-[#4f9fff]/40 bg-white/[0.03] max-w-full">
            <p className="text-[11px] text-[#4f9fff]/70 font-medium">{message.replyTo.senderName}</p>
            <p className="text-[11px] text-white/40 truncate">{message.replyTo.content}</p>
          </div>
        )}

        {/* Bubble */}
        <div className="relative">
          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
              isMine
                ? "bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-white rounded-br-sm shadow-[0_4px_16px_rgba(79,159,255,0.2)]"
                : "bg-white/[0.06] border border-white/[0.08] text-white/80 rounded-bl-sm"
            )}
          >
            {message.content}
            {message.isEdited && (
              <span className="ml-2 text-[10px] opacity-50">(edited)</span>
            )}
          </div>

          {/* Hover actions */}
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
            isMine ? "right-full mr-2" : "left-full ml-2"
          )}>
            <button
              onClick={() => setShowReactionPicker((v) => !v)}
              className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-[11px] hover:bg-white/[0.14] transition-colors"
            >
              😊
            </button>
            <button className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-[11px] hover:bg-white/[0.14] transition-colors">
              ↩
            </button>
          </div>

          {/* Reaction quick-picker */}
          {showReactionPicker && (
            <div className={cn(
              "absolute bottom-full mb-1 flex items-center gap-1 px-2 py-1 rounded-xl border border-white/[0.1] bg-[#0d0d1a]/98 backdrop-blur-xl shadow-lg z-10",
              isMine ? "right-0" : "left-0"
            )}>
              {QUICK_REACTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setShowReactionPicker(false)}
                  className="text-base hover:scale-125 transition-transform"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions on message */}
        {message.reactions.filter((r) => r.count > 0).length > 0 && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {message.reactions.filter((r) => r.count > 0).map((r) => (
              <button
                key={r.type}
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] transition-all",
                  r.hasReacted
                    ? "border-[#4f9fff]/30 bg-[#4f9fff]/10 text-[#4f9fff]"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70"
                )}
              >
                <span>{r.type}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div className={cn("flex items-center gap-1.5 mt-0.5 px-1", isMine ? "flex-row-reverse" : "flex-row")}>
          {showTimestamp && (
            <span className="text-[10px] text-white/25">{formatRelativeTime(message.createdAt)}</span>
          )}
          {isMine && (
            <span className={cn("text-[10px]", message.isRead ? "text-[#4f9fff]" : "text-white/25")}>
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
// apps/frontend/components/messaging/ConversationList.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation } from "@/types/systems";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const name = c.name ?? c.participants[0]?.displayName ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const pinned = filtered.filter((c) => c.isPinned);
  const rest = filtered.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-white">Messages</h2>
          <button className="w-7 h-7 rounded-lg bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[#4f9fff] flex items-center justify-center text-lg hover:bg-[#4f9fff]/20 transition-all">
            +
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03]">
          <span className="text-white/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <>
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Pinned
            </p>
            {pinned.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeId === conv.id}
                onClick={() => onSelect(conv)}
              />
            ))}
          </>
        )}
        {rest.length > 0 && (
          <>
            {pinned.length > 0 && (
              <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                All Messages
              </p>
            )}
            {rest.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeId === conv.id}
                onClick={() => onSelect(conv)}
              />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-[13px] text-white/30">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const isGroup = conv.type === "group";
  const isCloneChannel = conv.type === "clone_channel";
  const displayName = conv.name ?? conv.participants[0]?.displayName ?? "Unknown";
  const initials = displayName.slice(0, 2).toUpperCase();
  const isOnline = conv.participants[0]?.isOnline ?? false;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/[0.03]",
        isActive
          ? "bg-[#4f9fff]/[0.08] border-l-2 border-l-[#4f9fff]"
          : "hover:bg-white/[0.03]"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border",
          isCloneChannel
            ? "bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-[#4f9fff]/30 text-white"
            : isGroup
            ? "bg-gradient-to-br from-[#a78bfa]/20 to-[#22d3ee]/20 border-white/[0.1] text-white/60"
            : "bg-gradient-to-br from-white/10 to-white/5 border-white/10 text-white/60"
        )}>
          {isCloneChannel ? "🐱" : initials}
        </div>
        {!isGroup && !isCloneChannel && (
          <span className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080811]",
            isOnline ? "bg-emerald-400" : "bg-white/20"
          )} />
        )}
        {isGroup && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0d0d1a] border border-white/[0.1] flex items-center justify-center text-[8px]">
            👥
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[13px] font-semibold text-white truncate">{displayName}</span>
          <span className="text-[10px] text-white/30 shrink-0 ml-2">
            {conv.lastMessage ? formatRelativeTime(conv.lastMessage.createdAt) : ""}
          </span>
        </div>
        {conv.isTyping ? (
          <span className="text-[12px] text-[#4f9fff]/70 italic">typing...</span>
        ) : (
          <p className="text-[12px] text-white/40 truncate">
            {conv.lastMessage?.content ?? "No messages yet"}
          </p>
        )}
      </div>

      {conv.unreadCount > 0 && (
        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#4f9fff] text-white text-[10px] font-bold flex items-center justify-center mt-1">
          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
        </span>
      )}
      {conv.isMuted && (
        <span className="shrink-0 text-white/20 text-[12px] mt-1">🔇</span>
      )}
    </button>
  );
}
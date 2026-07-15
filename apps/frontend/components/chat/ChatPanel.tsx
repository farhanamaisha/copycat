// apps/frontend/components/chat/ChatPanel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MOCK_MESSAGES } from "@/lib/systemsMockData";
import type { Conversation, ChatMessage as ChatMessageType } from "@/types/systems";

interface ChatPanelProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ChatPanel({ conversation, currentUserId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>(
    MOCK_MESSAGES[conversation.id] ?? []
  );
  const [isTyping, setIsTyping] = useState(conversation.isTyping);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isGroup = conversation.type === "group";
  const isCloneChannel = conversation.type === "clone_channel";

  const displayName =
    conversation.name ?? conversation.participants[0]?.displayName ?? "Unknown";
  const isOnline = conversation.participants[0]?.isOnline ?? false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate remote typing
  useEffect(() => {
    if (!conversation.isTyping) return;
    const t = setTimeout(() => setIsTyping(false), 4000);
    return () => clearTimeout(t);
  }, [conversation.isTyping]);

  function handleSend(content: string) {
    const newMsg: ChatMessageType = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: "Cosmic Whisker",
      senderAvatar: null,
      content,
      type: "text",
      attachments: [],
      reactions: [],
      isRead: false,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulate reply after delay for Clone channel
    if (isCloneChannel) {
      setTimeout(() => {
        const reply: ChatMessageType = {
          id: `msg_clone_${Date.now()}`,
          conversationId: conversation.id,
          senderId: "clone_01",
          senderName: "Cosmo",
          senderAvatar: null,
          content: getCloneReply(content),
          type: "text",
          attachments: [],
          reactions: [],
          isRead: true,
          isEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1500);
    }
  }

  function getCloneReply(userMsg: string): string {
    const replies = [
      "That's interesting — it connects to something you mentioned in our last training session about creative autonomy.",
      "I've been thinking about this too. My analysis suggests you'd approach this differently than most people, which is exactly what makes you interesting.",
      "Based on what I know about you, I think you're underestimating yourself here. You have a pattern of doing that.",
      "This reminds me of the conversation we had about identity and authenticity. How does it feel to see that pattern recurring?",
      "I noticed something in how you phrased that. Want to explore it further? 🐱",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Group messages by date
  const grouped = messages.reduce<{ date: string; msgs: ChatMessageType[] }[]>(
    (acc, msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric",
      });
      const last = acc[acc.length - 1];
      if (last?.date === date) {
        last.msgs.push(msg);
      } else {
        acc.push({ date, msgs: [msg] });
      }
      return acc;
    },
    []
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#080811]/60 backdrop-blur-xl">
        <div className="relative">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border",
            isCloneChannel
              ? "bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-[#4f9fff]/30"
              : "bg-gradient-to-br from-white/10 to-white/5 border-white/10 text-white/60"
          )}>
            {isCloneChannel ? "🐱" : displayName.slice(0, 2).toUpperCase()}
          </div>
          {!isGroup && !isCloneChannel && (
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#080811]",
              isOnline ? "bg-emerald-400" : "bg-white/20"
            )} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-white truncate">{displayName}</p>
          <p className="text-[11px] text-white/35">
            {isCloneChannel
              ? "Your AI Clone · Always learning"
              : isGroup
              ? `${conversation.participants.length} members`
              : isOnline
              ? "Online now"
              : `Last seen ${formatRelativeTime(conversation.participants[0]?.lastSeen ?? "")}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">📞</button>
          <button className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">🔍</button>
          <button className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">⋯</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-white/25 font-medium">{date}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="space-y-1">
              {msgs.map((msg, i) => {
                const isMine = msg.senderId === currentUserId;
                const prevMsg = msgs[i - 1];
                const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
                const showTimestamp =
                  !msgs[i + 1] ||
                  new Date(msgs[i + 1]?.createdAt ?? "").getTime() -
                    new Date(msg.createdAt).getTime() > 60000;
                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    showTimestamp={showTimestamp}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <TypingIndicator users={conversation.typingUsers} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        placeholder={isCloneChannel ? `Message Cosmo...` : `Message ${displayName}...`}
      />
    </div>
  );
}
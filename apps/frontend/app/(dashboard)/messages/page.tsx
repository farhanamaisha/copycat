// apps/frontend/app/(dashboard)/messages/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { chatWithClone } from "@/services/api/ai.api";
import { getChatHistory } from "@/services/api/clone.api";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isError?: boolean;
}

interface Conversation {
  id: string;
  type: "direct" | "group" | "clone_channel";
  name?: string;
  participant?: {
    id: string;
    username: string;
    displayName: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  isTyping?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv_clone",
    type: "clone_channel",
    name: "Cosmo (Your Clone)",
    lastMessage: "I've been thinking about what you said...",
    lastTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    unreadCount: 0,
  },
  {
    id: "conv_2",
    type: "direct",
    participant: { id: "u2", username: "neon_paws", displayName: "Neon Paws", isOnline: true },
    lastMessage: "That's insane progress 🔥",
    lastTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: "conv_3",
    type: "group",
    name: "Clone Trainers Core",
    lastMessage: "Anyone hit the 60% plateau?",
    lastTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unreadCount: 0,
    isTyping: true,
  },
];

const INITIAL_CLONE_MESSAGES: Message[] = [
  {
    id: "cm1",
    senderId: "clone",
    content: "Hey! I'm Cosmo, your Clone. I'm here whenever you need me. The more you train me, the more I become you. 🐱",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isRead: true,
  },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string>("conv_clone");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCloneTyping, setIsCloneTyping] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
  conv_clone: [],
});
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find((c) => c.id === activeId);
  const isCloneChat = active?.type === "clone_channel";
  const currentMessages = messages[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isCloneTyping]);
  useEffect(() => {
  async function loadCloneHistory() {
    try {
      const history = await getChatHistory();

      const formattedMessages: Message[] = history.map(
        (msg, index) => ({
          id: `history_${index}`,
          senderId: msg.from === "user" ? "usr_01" : "clone",
          content: msg.text,
          createdAt: new Date().toISOString(),
          isRead: true,
        }),
      );

      setMessages((prev) => ({
        ...prev,
        conv_clone: formattedMessages,
      }));
    } catch (error) {
      console.error("Failed to load Clone chat history:", error);
    }
  }

  loadCloneHistory();
}, []);

  function getDisplayName(conv: Conversation) {
    return conv.name ?? conv.participant?.displayName ?? "Unknown";
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || isSending) return;

    setError(null);

    // Add user message immediately (optimistic)
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "usr_01",
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), userMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: content, lastTime: new Date().toISOString(), unreadCount: 0 }
          : c
      )
    );

    setInput("");
    setIsSending(true);

    // If Clone channel — call real OpenAI
    if (isCloneChat) {
      setIsCloneTyping(true);
      try {
        const result = await chatWithClone(content);
        const cloneMsg: Message = {
          id: `clone_${Date.now()}`,
          senderId: "clone",
          content: result.data.reply,
          createdAt: new Date().toISOString(),
          isRead: true,
        };
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] ?? []), cloneMsg],
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? { ...c, lastMessage: result.data.reply, lastTime: new Date().toISOString() }
              : c
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        // Add error message in chat
        const errMsg: Message = {
          id: `err_${Date.now()}`,
          senderId: "clone",
          content: `⚠️ ${message}`,
          createdAt: new Date().toISOString(),
          isRead: true,
          isError: true,
        };
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] ?? []), errMsg],
        }));
      } finally {
        setIsCloneTyping(false);
      }
    }

    setIsSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <h2 className="text-[15px] font-bold text-white mb-3">Messages</h2>
          <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03]">
            <span className="text-white/30 text-sm">🔍</span>
            <input
              placeholder="Search..."
              className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors",
                activeId === conv.id ? "bg-[#4f9fff]/[0.08]" : "hover:bg-white/[0.03]"
              )}
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border",
                  conv.type === "clone_channel"
                    ? "bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] border-[#4f9fff]/30"
                    : "bg-white/[0.07] border-white/10 text-white/60"
                )}>
                  {conv.type === "clone_channel" ? "🐱" : conv.type === "group" ? "👥" : getDisplayName(conv).slice(0, 2).toUpperCase()}
                </div>
                {conv.type === "direct" && (
                  <span className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080811]",
                    conv.participant?.isOnline ? "bg-emerald-400" : "bg-white/20"
                  )} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[13px] font-semibold text-white truncate">{getDisplayName(conv)}</span>
                  <span className="text-[10px] text-white/30 shrink-0 ml-2">{formatRelativeTime(conv.lastTime)}</span>
                </div>
                {conv.isTyping
                  ? <span className="text-[12px] text-[#4f9fff]/70 italic">typing...</span>
                  : <p className="text-[12px] text-white/40 truncate">{conv.lastMessage}</p>
                }
              </div>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-[#4f9fff] text-white text-[10px] font-bold flex items-center justify-center mt-1">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#080811]/60 backdrop-blur-xl">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border shrink-0",
            active?.type === "clone_channel"
              ? "bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] border-[#4f9fff]/30 shadow-[0_0_12px_rgba(79,159,255,0.3)]"
              : "bg-white/[0.07] border-white/10 text-white/60"
          )}>
            {active?.type === "clone_channel" ? "🐱" : active ? getDisplayName(active).slice(0, 2).toUpperCase() : ""}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white">{active ? getDisplayName(active) : ""}</p>
            <p className="text-[11px] text-white/35">
              {active?.type === "clone_channel"
                ? "Your AI Clone · Powered by OpenAI"
                : active?.type === "group"
                ? "Group chat"
                : active?.participant?.isOnline ? "Online now" : "Offline"}
            </p>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all">⋯</button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl border border-red-400/20 bg-red-400/[0.06] flex items-center justify-between">
            <p className="text-[12px] text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 text-[11px] ml-3">✕</button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {currentMessages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-[14px] text-white/40">Start the conversation</p>
              </div>
            </div>
          )}

          {currentMessages.map((msg) => {
            const isMine = msg.senderId === "usr_01";
            const isClone = msg.senderId === "clone";
            return (
              <div key={msg.id} className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
                {isClone && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm shrink-0 mb-0.5">
                    🐱
                  </div>
                )}
                <div className={cn(
                  "max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                  isMine
                    ? "bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-white rounded-br-sm"
                    : msg.isError
                    ? "bg-red-400/10 border border-red-400/20 text-red-400 rounded-bl-sm"
                    : "bg-white/[0.06] border border-white/[0.08] text-white/80 rounded-bl-sm"
                )}>
                  {msg.content}
                  <p className={cn("text-[10px] mt-1", isMine ? "text-white/60" : "text-white/30")}>
                    {formatRelativeTime(msg.createdAt)}
                    {isMine && <span className="ml-1">{msg.isRead ? " ✓✓" : " ✓"}</span>}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Clone typing indicator */}
          {isCloneTyping && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm shrink-0">
                🐱
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/[0.08] flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#4f9fff]/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          {isCloneChat && (
            <p className="text-[11px] text-white/20 mb-2 px-1">
              🐱 Powered by Gemini · Cosmo responds based on your training data
            </p>
          )}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.03] focus-within:border-[#4f9fff]/35 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isCloneChat
                  ? "Message Cosmo..."
                  : `Message ${active ? getDisplayName(active) : ""}...`
              }
              disabled={isSending}
              className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all",
                input.trim() && !isSending
                  ? "bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] shadow-[0_0_12px_rgba(79,159,255,0.3)] hover:shadow-[0_0_20px_rgba(79,159,255,0.5)]"
                  : "bg-white/[0.06] opacity-40 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "➤"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
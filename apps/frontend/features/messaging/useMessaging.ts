// apps/frontend/features/messaging/useMessaging.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { MOCK_CONVERSATIONS } from "@/lib/systemsMockData";
import type { Conversation, ChatMessage, SendMessageInput } from "@/types/systems";

/**
 * useMessaging — manages conversation list and active chat state.
 *
 * WebSocket-ready: the `connectWebSocket` function is a stub that will
 * wire up to your NestJS WebSocket gateway when ready. Replace the
 * simulated timeout-based updates with real socket event listeners.
 */
export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket stub — replace with real socket connection
  useEffect(() => {
    // TODO: const socket = io(process.env.NEXT_PUBLIC_WS_URL, { auth: { token } })
    // socket.on("message", handleIncomingMessage)
    // socket.on("typing", handleTypingEvent)
    // socket.on("read", handleReadEvent)
    setIsConnected(true);
    return () => setIsConnected(false);
  }, []);

  const selectConversation = useCallback((conv: Conversation) => {
    setActiveConversation(conv);
    // Mark as read
    setConversations((prev: Conversation[]) =>
      prev.map((c: Conversation) =>
        c.id === conv.id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (input: SendMessageInput) => {
      // Optimistically update last message in conversation list
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: input.conversationId,
        senderId: "usr_01",
        senderName: "Cosmic Whisker",
        senderAvatar: null,
        content: input.content,
        type: input.type ?? "text",
        attachments: [],
        reactions: [],
        isRead: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setConversations((prev: Conversation[]) =>
        prev.map((c: Conversation) =>
          c.id === input.conversationId
            ? { ...c, lastMessage: newMsg, updatedAt: newMsg.createdAt }
            : c
        )
      );

      // TODO: socket.emit("sendMessage", input)
      await new Promise((r) => setTimeout(r, 200));
      return newMsg;
    },
    []
  );

  const markTyping = useCallback((conversationId: string) => {
    // TODO: socket.emit("typing", { conversationId })
    void conversationId;
  }, []);

  const totalUnread = conversations.reduce(
    (sum: number, c: Conversation) => sum + c.unreadCount,
    0
  );

  const pinConversation = useCallback((id: string) => {
    setConversations((prev: Conversation[]) =>
      prev.map((c: Conversation) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    );
  }, []);

  const muteConversation = useCallback((id: string) => {
    setConversations((prev: Conversation[]) =>
      prev.map((c: Conversation) =>
        c.id === id ? { ...c, isMuted: !c.isMuted } : c
      )
    );
  }, []);

  return {
    conversations,
    activeConversation,
    isConnected,
    totalUnread,
    selectConversation,
    sendMessage,
    markTyping,
    pinConversation,
    muteConversation,
  };
}
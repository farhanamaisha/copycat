// apps/frontend/features/messaging/useMessaging.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { MOCK_CONVERSATIONS } from "@/lib/systemsMockData";
import { apiRequest } from "@/lib/api";
import type { Conversation, ChatMessage, SendMessageInput } from "@/types/systems";

function readStoredConversations() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("copy-cat-conversations");
    return stored ? (JSON.parse(stored) as Conversation[]) : null;
  } catch {
    return null;
  }
}

function readStoredActiveConversationId() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem("copy-cat-active-conversation");
  } catch {
    return null;
  }
}

/**
 * useMessaging — manages conversation list and active chat state.
 *
 * The hook now keeps the conversation list in sync locally and remembers the
 * last selected conversation for a smoother experience.
 */
export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const storedConversations = readStoredConversations();
    return storedConversations?.length ? storedConversations : MOCK_CONVERSATIONS;
  });
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(() => {
    const storedConversations = readStoredConversations();
    const storedActiveConversationId = readStoredActiveConversationId();
    const fallback = storedConversations?.find((conversation) => conversation.type === "clone_channel") ?? storedConversations?.[0] ?? null;

    if (!storedActiveConversationId) {
      return fallback;
    }

    return storedConversations?.find((conversation) => conversation.id === storedActiveConversationId) ?? fallback;
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncConversations = async () => {
      try {
        const payload = await apiRequest<{ conversations?: Conversation[] }>('/messages/conversations');
        const remoteConversations = payload.conversations ?? [];

        if (isMounted && remoteConversations.length > 0) {
          setConversations(remoteConversations);
          setIsConnected(true);
        }
      } catch {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    const timer = window.setTimeout(() => {
      void syncConversations();
      setIsConnected(true);
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("copy-cat-conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (typeof window !== "undefined" && activeConversation) {
      window.localStorage.setItem("copy-cat-active-conversation", activeConversation.id);
    }
  }, [activeConversation]);

  const selectConversation = useCallback((conv: Conversation) => {
    setActiveConversation(conv);
    setConversations((prev: Conversation[]) =>
      prev.map((c: Conversation) =>
        c.id === conv.id ? { ...c, unreadCount: 0, isTyping: false } : c
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (input: SendMessageInput) => {
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
            ? { ...c, lastMessage: newMsg, updatedAt: newMsg.createdAt, isTyping: false }
            : c
        )
      );

      try {
        await apiRequest<{ success: boolean }>('/messages', {
          method: 'POST',
          body: JSON.stringify({
            recipientId: input.conversationId,
            content: input.content,
          }),
        });
      } catch {
        // Fall back to the local optimistic message state if the backend is unavailable.
      }

      await new Promise((resolve) => setTimeout(resolve, 180));
      return newMsg;
    },
    []
  );

  const markTyping = useCallback((conversationId: string) => {
    setConversations((prev: Conversation[]) =>
      prev.map((c: Conversation) =>
        c.id === conversationId ? { ...c, isTyping: true, typingUsers: ["Cosmic Whisker"] } : c
      )
    );

    window.setTimeout(() => {
      setConversations((prev: Conversation[]) =>
        prev.map((c: Conversation) =>
          c.id === conversationId ? { ...c, isTyping: false, typingUsers: [] } : c
        )
      );
    }, 1400);
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
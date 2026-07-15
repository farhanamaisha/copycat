// apps/frontend/app/(dashboard)/messages/page.tsx
"use client";

import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useMessaging } from "@/features/messaging/useMessaging";

export default function MessagesPage() {
  const { conversations, activeConversation, selectConversation } = useMessaging();

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] shrink-0 border-r border-white/[0.06] bg-[#080811]/50">
        <ConversationList
          conversations={conversations}
          activeId={activeConversation?.id ?? null}
          onSelect={selectConversation}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0">
        {activeConversation ? (
          <ChatPanel
            conversation={activeConversation}
            currentUserId="usr_01"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f9fff]/20 to-[#a78bfa]/20 border border-white/[0.08] flex items-center justify-center text-3xl">
              💬
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-white mb-1">
                Your messages
              </p>
              <p className="text-[13px] text-white/40">
                Select a conversation to start chatting,
                <br />
                or open your Clone&apos;s channel.
              </p>
            </div>
            <button
              onClick={() => {
                const cloneConv = conversations.find((c) => c.type === "clone_channel");
                if (cloneConv) selectConversation(cloneConv);
              }}
              className="px-5 py-2.5 rounded-[10px] bg-gradient-to-br from-[#4f9fff]/15 to-[#a78bfa]/15 border border-[#4f9fff]/25 text-[13px] font-medium text-[#4f9fff] hover:from-[#4f9fff]/25 hover:to-[#a78bfa]/25 transition-all"
            >
              🐱 Open Clone Channel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
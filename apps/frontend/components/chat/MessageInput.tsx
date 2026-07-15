// apps/frontend/components/messages/MessageInput.tsx
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Write a message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = message.trim().length > 0 && !sending && !disabled;

  async function handleSend() {
    const content = message.trim();

    if (!content || sending || disabled) return;

    setSending(true);

    try {
      await onSend(content);
      setMessage("");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-white/[0.08] bg-[#0d0d1a]/80 backdrop-blur-xl px-4 py-3">
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <button
          type="button"
          className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          +
        </button>

        {/* Input */}
        <div className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.03] focus-within:border-[#4f9fff]/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent px-4 py-3 text-sm text-white/80",
              "placeholder:text-white/25 outline-none resize-none",
              "max-h-32 leading-relaxed"
            )}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "h-9 px-4 rounded-xl text-sm font-semibold transition-all",
            canSend
              ? "bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-white hover:-translate-y-0.5"
              : "bg-white/[0.05] text-white/30 cursor-not-allowed"
          )}
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
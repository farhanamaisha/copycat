// apps/frontend/components/clone/FloatingCloneWidget.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CLONE_MOODS } from "@/constants";
import { useCloneWidget } from "@/hooks/useDashboard";
import { Icons } from "@/components/common/Icons";

export function FloatingCloneWidget() {
  const { isOpen, setIsOpen, currentThought, clone } = useCloneWidget();
  const [showThought, setShowThought] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const thoughtRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodConfig = CLONE_MOODS[clone.mood];

  // Show a thought bubble periodically when collapsed
  useEffect(() => {
    if (isOpen) return;

    const interval = setInterval(() => {
      setIsPulsing(true);
      setShowThought(true);
      thoughtRef.current = setTimeout(() => {
        setShowThought(false);
        setIsPulsing(false);
      }, 5000);
    }, 12000);

    return () => {
      clearInterval(interval);
      if (thoughtRef.current) clearTimeout(thoughtRef.current);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Thought bubble */}
      {showThought && !isOpen && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 max-w-[240px] rounded-2xl rounded-br-sm border border-white/[0.12] bg-[#0d0d1a]/95 backdrop-blur-xl p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <p className="text-[12px] text-white/75 leading-relaxed">
            {currentThought}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px]">{moodConfig.emoji}</span>
            <span className="text-[10px] text-white/35">{clone.name}</span>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-[300px] rounded-2xl border border-[#4f9fff]/20 bg-[#0a0a14]/98 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(79,159,255,0.08)] overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-gradient-to-r from-[#4f9fff]/[0.06] to-[#a78bfa]/[0.04]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] flex items-center justify-center text-sm shadow-[0_0_12px_rgba(79,159,255,0.3)]">
                🐱
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0a14]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-white">{clone.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px]">{moodConfig.emoji}</span>
                <span className="text-[10px]" style={{ color: moodConfig.color }}>
                  {moodConfig.label}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.07] transition-all"
            >
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="h-[200px] overflow-y-auto p-4 space-y-3 scrollbar-thin">
            <ChatMessage
              from="clone"
              name={clone.name}
              message="Hey! I'm here whenever you need me. I've been thinking about our last conversation..."
            />
            <ChatMessage
              from="clone"
              name={clone.name}
              message={currentThought}
            />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.07]">
            <div className="flex items-center gap-2 rounded-[10px] border border-white/[0.1] bg-white/[0.04] px-3 py-2">
              <input
                type="text"
                placeholder={`Talk to ${clone.name}...`}
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
              />
              <button className="shrink-0 p-1 rounded-md bg-[#4f9fff]/20 text-[#4f9fff] hover:bg-[#4f9fff]/30 transition-colors">
                <Icons.ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => {
          setIsOpen((v: boolean) => !v);
          setShowThought(false);
          setIsPulsing(false);
        }}
        className={cn(
          "relative w-14 h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-[#4f9fff] via-[#7c6dfa] to-[#a78bfa]",
          "shadow-[0_0_24px_rgba(79,159,255,0.4),0_8px_24px_rgba(0,0,0,0.4)]",
          "hover:shadow-[0_0_36px_rgba(79,159,255,0.6),0_8px_24px_rgba(0,0,0,0.4)]",
          "hover:scale-105 active:scale-95 transition-all duration-200",
          "border border-white/20"
        )}
      >
        <span className="text-2xl select-none">{isOpen ? "✕" : "🐱"}</span>

        {/* Online dot */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#4f9fff] shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
        )}

        {/* Pulse ring when has thought */}
        {isPulsing && !isOpen && (
          <span className="absolute inset-0 rounded-2xl border-2 border-[#4f9fff]/40 animate-ping" />
        )}
      </button>
    </div>
  );
}

function ChatMessage({
  from,
  name,
  message,
}: {
  from: "clone" | "user";
  name: string;
  message: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-[11px] shrink-0 mt-0.5">
        🐱
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-white/30 mb-1">{name}</p>
        <div className="rounded-xl rounded-tl-sm bg-[#4f9fff]/[0.08] border border-[#4f9fff]/[0.12] px-3 py-2">
          <p className="text-[12px] text-white/75 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

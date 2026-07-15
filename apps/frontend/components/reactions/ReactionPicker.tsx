// apps/frontend/components/reactions/ReactionPicker.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ReactionSummary, ReactionType } from "@/types/systems";

const ALL_REACTIONS: ReactionType[] = ["❤️", "🔥", "😂", "😮", "😢", "🤯", "🐱"];

interface ReactionPickerProps {
  reactions: ReactionSummary[];
  onReact: (type: ReactionType) => void;
  size?: "sm" | "md";
}

export function ReactionPicker({ reactions, onReact, size = "md" }: ReactionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
  const hasReacted = reactions.some((r) => r.hasReacted);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-1.5">
        {/* Existing reactions */}
        {reactions
          .filter((r) => r.count > 0)
          .slice(0, 3)
          .map((r) => (
            <button
              key={r.type}
              onClick={() => onReact(r.type as ReactionType)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-medium transition-all hover:scale-105",
                r.hasReacted
                  ? "border-[#4f9fff]/30 bg-[#4f9fff]/10 text-[#4f9fff]"
                  : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80"
              )}
            >
              <span>{r.type}</span>
              <span>{r.count}</span>
            </button>
          ))}

        {/* Add reaction button */}
        <button
          onClick={() => setShowPicker((v) => !v)}
          className={cn(
            "flex items-center justify-center px-2 py-1 rounded-full border text-[12px] transition-all hover:scale-105",
            showPicker
              ? "border-[#4f9fff]/30 bg-[#4f9fff]/10"
              : "border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white/60"
          )}
        >
          {hasReacted ? "😊" : "＋"}
        </button>
      </div>

      {/* Picker popup */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 px-2 py-1.5 rounded-2xl border border-white/[0.12] bg-[#0d0d1a]/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {ALL_REACTIONS.map((type) => (
            <button
              key={type}
              onClick={() => {
                onReact(type);
                setShowPicker(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-lg hover:bg-white/[0.08] hover:scale-125 transition-all duration-150"
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReactionBar({ reactions }: { reactions: ReactionSummary[] }) {
  const visible = reactions.filter((r) => r.count > 0);
  if (visible.length === 0) return null;

  const total = visible.reduce((s, r) => s + r.count, 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1">
        {visible.slice(0, 4).map((r) => (
          <span key={r.type} className="text-[13px]">{r.type}</span>
        ))}
      </div>
      <span className="text-[12px] text-white/35">{total}</span>
    </div>
  );
}
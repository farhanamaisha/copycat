// apps/frontend/components/clone/KnowledgeMap.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface KnowledgeTopic {
  id: string;
  name: string;
  depth: number;
  breadth: number;
  sources: number;
}

interface KnowledgeMapProps {
  topics: KnowledgeTopic[];
}

export function KnowledgeMap({ topics }: KnowledgeMapProps) {
  const [view, setView] = useState<"grid" | "bars">("grid");
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = [...topics].sort((a, b) => b.depth - a.depth);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
          {topics.length} Knowledge Areas
        </p>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5">
          {(["grid", "bars"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                view === v ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/60"
              )}
            >
              {v === "grid" ? "⬡ Map" : "≡ Bars"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sorted.map((topic) => {
            const avg = (topic.depth + topic.breadth) / 2;
            const color = avg > 75 ? "#4f9fff" : avg > 50 ? "#a78bfa" : "#22d3ee";
            return (
              <div
                key={topic.id}
                onMouseEnter={() => setHovered(topic.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "relative rounded-2xl border p-4 cursor-default transition-all duration-300 hover:-translate-y-0.5",
                  hovered === topic.id ? "border-white/[0.18] bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02]"
                )}
                style={{ boxShadow: hovered === topic.id ? `0 0 20px ${color}20` : "none" }}
              >
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke={color} strokeWidth="4"
                      strokeDasharray={`${138.2 * topic.depth / 100} 138.2`}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[13px] font-bold" style={{ color }}>{topic.depth}</span>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-white text-center leading-tight mb-1">{topic.name}</p>
                {hovered === topic.id && (
                  <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/35">Depth</span>
                      <span style={{ color }}>{topic.depth}%</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/35">Breadth</span>
                      <span style={{ color }}>{topic.breadth}%</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/35">Sources</span>
                      <span className="text-white/50">{topic.sources}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "bars" && (
        <div className="space-y-4">
          {sorted.map((topic) => {
            const color = topic.depth > 75 ? "#4f9fff" : topic.depth > 50 ? "#a78bfa" : "#22d3ee";
            return (
              <div key={topic.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-white/80">{topic.name}</span>
                  <span className="text-[11px] text-white/30">{topic.sources} sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 w-12">Depth</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topic.depth}%`, background: color, boxShadow: `0 0 6px ${color}60` }} />
                  </div>
                  <span className="text-[10px] font-semibold w-8 text-right" style={{ color }}>{topic.depth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 w-12">Breadth</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topic.breadth}%`, background: color + "90" }} />
                  </div>
                  <span className="text-[10px] text-white/40 w-8 text-right">{topic.breadth}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
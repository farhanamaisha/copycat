// apps/frontend/components/clone/MemoryTimeline.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { CloneMemoryItem } from "@/types/systems";

interface MemoryTimelineProps {
  memories: CloneMemoryItem[];
  onDelete: (id: string) => void;
  onAdd: (memory: Omit<CloneMemoryItem, "id" | "cloneId" | "createdAt" | "lastAccessed" | "accessCount">) => void;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  fact:       { icon: "📌", color: "#4f9fff",  label: "Fact" },
  preference: { icon: "⭐", color: "#fbbf24",  label: "Preference" },
  opinion:    { icon: "💭", color: "#a78bfa",  label: "Opinion" },
  experience: { icon: "🎯", color: "#22d3ee",  label: "Experience" },
  goal:       { icon: "🚀", color: "#34d399",  label: "Goal" },
};

const ALL_TYPES = ["all", "fact", "preference", "opinion", "experience", "goal"] as const;

export function MemoryTimeline({ memories, onDelete, onAdd }: MemoryTimelineProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ content: "", type: "fact" as CloneMemoryItem["type"], importance: 50, tags: "" });

  const filtered = memories.filter((m) => {
    const matchType = filter === "all" || m.type === filter;
    const matchSearch = m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  function handleAdd() {
    if (!newMemory.content.trim()) return;
    onAdd({
      type: newMemory.type,
      content: newMemory.content,
      importance: newMemory.importance,
      tags: newMemory.tags.split(",").map((t) => t.trim()).filter(Boolean),
      source: "manual",
    });
    setNewMemory({ content: "", type: "fact", importance: 50, tags: "" });
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03] flex-1 min-w-[180px]">
          <span className="text-white/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="px-3 py-2 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] font-medium text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all"
        >
          + Add Memory
        </button>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {ALL_TYPES.map((type) => {
          const config = type === "all" ? null : TYPE_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all border",
                filter === type
                  ? "bg-white/[0.08] text-white border-white/[0.15]"
                  : "text-white/40 border-white/[0.07] hover:text-white/70"
              )}
            >
              {config && <span>{config.icon}</span>}
              {type === "all" ? "All" : config?.label}
            </button>
          );
        })}
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.04] p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[13px] font-semibold text-white">Add New Memory</p>
          <textarea
            value={newMemory.content}
            onChange={(e) => setNewMemory((p) => ({ ...p, content: e.target.value }))}
            placeholder="What should Cosmo remember about you?"
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none resize-none focus:border-[#4f9fff]/30 transition-colors"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={newMemory.type}
              onChange={(e) => setNewMemory((p) => ({ ...p, type: e.target.value as CloneMemoryItem["type"] }))}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[12px] text-white/60 outline-none"
            >
              {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#0d0d1a]">{v.icon} {v.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 flex-1 min-w-[160px]">
              <span className="text-[11px] text-white/40 shrink-0">Importance</span>
              <input
                type="range"
                min={0}
                max={100}
                value={newMemory.importance}
                onChange={(e) => setNewMemory((p) => ({ ...p, importance: Number(e.target.value) }))}
                className="flex-1 accent-[#4f9fff]"
              />
              <span className="text-[11px] text-white/50 w-7 text-right">{newMemory.importance}</span>
            </div>
          </div>
          <input
            value={newMemory.tags}
            onChange={(e) => setNewMemory((p) => ({ ...p, tags: e.target.value }))}
            placeholder="Tags: comma separated (e.g. preferences, daily)"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/70 placeholder:text-white/25 outline-none focus:border-[#4f9fff]/30 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/25 transition-all"
            >
              Save Memory
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Memory list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">🧠</p>
            <p className="text-[13px] text-white/30">No memories found</p>
          </div>
        ) : (
          filtered.map((memory) => {
            const config = TYPE_CONFIG[memory.type];
            return (
              <div
                key={memory.id}
                className="group flex gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
              >
                {/* Type icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5"
                  style={{ background: `${config.color}18`, border: `1px solid ${config.color}30` }}
                >
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] text-white/80 leading-relaxed">{memory.content}</p>
                    <button
                      onClick={() => onDelete(memory.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/[0.08] transition-all text-[11px]"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-[10px] font-semibold" style={{ color: config.color }}>
                      {config.label}
                    </span>
                    {memory.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-white/25">#{tag}</span>
                    ))}
                    <span className="ml-auto text-[10px] text-white/20">
                      {formatRelativeTime(memory.createdAt)}
                    </span>
                  </div>

                  {/* Importance bar */}
                  <div className="mt-2 h-0.5 rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${memory.importance}%`,
                        background: config.color,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
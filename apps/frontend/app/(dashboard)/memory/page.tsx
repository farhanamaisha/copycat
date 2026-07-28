// apps/frontend/app/(dashboard)/memory/page.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Memory {
  id: string;
  type: "fact" | "preference" | "opinion" | "experience" | "goal";
  content: string;
  importance: number;
  tags: string[];
  source: string;
  createdAt: string;
  accessCount: number;
}

const TYPE_CONFIG = {
  fact:       { icon: "📌", color: "#4f9fff",  label: "Fact" },
  preference: { icon: "⭐", color: "#fbbf24",  label: "Preference" },
  opinion:    { icon: "💭", color: "#a78bfa",  label: "Opinion" },
  experience: { icon: "🎯", color: "#22d3ee",  label: "Experience" },
  goal:       { icon: "🚀", color: "#34d399",  label: "Goal" },
};

const INITIAL: Memory[] = [
  { id: "m1", type: "preference", content: "Prefers dark mode in all applications. Finds light mode genuinely uncomfortable.", importance: 45, tags: ["preferences", "visual"], source: "training", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), accessCount: 23 },
  { id: "m2", type: "opinion", content: "Believes AI will fundamentally change creative work but is cautiously optimistic rather than fearful.", importance: 78, tags: ["ai", "philosophy", "creativity"], source: "training", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(), accessCount: 41 },
  { id: "m3", type: "experience", content: "Stayed up until 4am debugging a CSS issue. Felt triumph mixed with absurdity.", importance: 62, tags: ["coding", "experience", "humor"], source: "training", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), accessCount: 17 },
  { id: "m4", type: "goal", content: "Wants to build something that genuinely changes how people relate to technology at a personal level.", importance: 95, tags: ["goals", "ambition", "technology"], source: "training", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(), accessCount: 67 },
  { id: "m5", type: "fact", content: "Has never owned a cat despite the cat obsession, but insists this makes the aesthetic choice more intentional.", importance: 38, tags: ["personal", "humor", "irony"], source: "conversation", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), accessCount: 9 },
  { id: "m6", type: "preference", content: "Music taste: ambient electronic for focus, loud indie rock for creative sessions, jazz for social contexts.", importance: 55, tags: ["music", "preferences", "context"], source: "training", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), accessCount: 12 },
];

const ALL_TYPES = ["all", "fact", "preference", "opinion", "experience", "goal"] as const;

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>(INITIAL);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMem, setNewMem] = useState({ content: "", type: "fact" as Memory["type"], importance: 50, tags: "" });

  const filtered = memories.filter((m) => {
    const matchType = filter === "all" || m.type === filter;
    const matchSearch = m.content.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  function handleAdd() {
    if (!newMem.content.trim()) return;
    const mem: Memory = {
      id: `m_${Date.now()}`, type: newMem.type, content: newMem.content,
      importance: newMem.importance,
      tags: newMem.tags.split(",").map((t) => t.trim()).filter(Boolean),
      source: "manual",
      createdAt: new Date().toISOString(), accessCount: 0,
    };
    setMemories((prev) => [mem, ...prev]);
    setNewMem({ content: "", type: "fact", importance: 50, tags: "" });
    setShowAdd(false);
  }

  return (
    <div className="px-6 py-6 max-w-[860px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Clone Memory</h1>
        <p className="text-[13px] text-white/40 mt-1">Everything Cosmo knows and remembers about you.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Memories", value: memories.length, color: "#4f9fff" },
          { label: "High Importance", value: memories.filter((m) => m.importance > 70).length, color: "#a78bfa" },
          { label: "Most Accessed", value: Math.max(...memories.map((m) => m.accessCount)), color: "#22d3ee" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
            <p className="text-[22px] font-bold" style={{ color }}>{value}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03] flex-1 min-w-[180px]">
            <span className="text-white/30">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memories..." className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none" />
          </div>
          <button onClick={() => setShowAdd((v) => !v)} className="px-3 py-2 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] font-medium text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all">
            + Add Memory
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_TYPES.map((type) => {
            const cfg = type === "all" ? null : TYPE_CONFIG[type];
            return (
              <button key={type} onClick={() => setFilter(type)}
                className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all border",
                  filter === type ? "bg-white/[0.08] text-white border-white/[0.15]" : "text-white/40 border-white/[0.07] hover:text-white/70"
                )}>
                {cfg && <span>{cfg.icon}</span>}
                {type === "all" ? "All" : cfg?.label}
              </button>
            );
          })}
        </div>

        {showAdd && (
          <div className="rounded-xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.04] p-4 space-y-3">
            <p className="text-[13px] font-semibold text-white">Add New Memory</p>
            <textarea value={newMem.content} onChange={(e) => setNewMem((p) => ({ ...p, content: e.target.value }))}
              placeholder="What should Cosmo remember about you?" rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none resize-none focus:border-[#4f9fff]/30 transition-colors" />
            <div className="flex items-center gap-3 flex-wrap">
              <select value={newMem.type} onChange={(e) => setNewMem((p) => ({ ...p, type: e.target.value as Memory["type"] }))}
                className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[12px] text-white/60 outline-none">
                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#0d0d1a]">{v.icon} {v.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[11px] text-white/40 shrink-0">Importance</span>
                <input type="range" min={0} max={100} value={newMem.importance}
                  onChange={(e) => setNewMem((p) => ({ ...p, importance: Number(e.target.value) }))}
                  className="flex-1 accent-[#4f9fff]" />
                <span className="text-[11px] text-white/50 w-7 text-right">{newMem.importance}</span>
              </div>
            </div>
            <input value={newMem.tags} onChange={(e) => setNewMem((p) => ({ ...p, tags: e.target.value }))}
              placeholder="Tags: comma separated" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/70 placeholder:text-white/25 outline-none focus:border-[#4f9fff]/30 transition-colors" />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/25 transition-all">Save Memory</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-10 text-center"><p className="text-3xl mb-2">🧠</p><p className="text-[13px] text-white/30">No memories found</p></div>
          ) : filtered.map((memory) => {
            const cfg = TYPE_CONFIG[memory.type];
            return (
              <div key={memory.id} className="group flex gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5"
                  style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] text-white/80 leading-relaxed">{memory.content}</p>
                    <button onClick={() => setMemories((prev) => prev.filter((m) => m.id !== memory.id))}
                      className="shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-red-400 transition-all text-[11px]">✕</button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                    {memory.tags.map((tag) => <span key={tag} className="text-[10px] text-white/25">#{tag}</span>)}
                    <span className="ml-auto text-[10px] text-white/20">{formatRelativeTime(memory.createdAt)}</span>
                  </div>
                  <div className="mt-2 h-0.5 rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full" style={{ width: `${memory.importance}%`, background: cfg.color, opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
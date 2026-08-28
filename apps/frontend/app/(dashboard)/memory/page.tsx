
"use client";

import { useEffect, useMemo, useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  CloneMemory,
  createMemory,
  deleteMemory,
  getMemories,
} from "@/services/api/memory.api";

export default function MemoryPage() {
  const [memories, setMemories] = useState<CloneMemory[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [newMemory, setNewMemory] = useState("");
  const [importance, setImportance] = useState(50);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // LOAD REAL MEMORIES FROM BACKEND
  // ============================================================

  useEffect(() => {
    async function loadMemories() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMemories();

        setMemories(data);
      } catch (err) {
        console.error("Failed to load memories:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load memories.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMemories();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return memories;

    return memories.filter((memory) =>
      memory.memory.toLowerCase().includes(query),
    );
  }, [memories, search]);

  // ============================================================
  // ADD MEMORY
  // ============================================================

  async function handleAddMemory() {
    const content = newMemory.trim();

    if (!content || saving) return;

    try {
      setSaving(true);
      setError(null);

      const created = await createMemory(
        content,
        importance,
      );

      setMemories((prev) => [
        created,
        ...prev,
      ]);

      setNewMemory("");
      setImportance(50);
      setShowAdd(false);
    } catch (err) {
      console.error("Failed to create memory:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save memory.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE MEMORY
  // ============================================================

  async function handleDeleteMemory(id: string) {
    if (deletingId) return;

    try {
      setDeletingId(id);
      setError(null);

      await deleteMemory(id);

      setMemories((prev) =>
        prev.filter((memory) => memory.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete memory:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete memory.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ============================================================
  // STATS
  // ============================================================

  const totalMemories = memories.length;

  const highImportance = memories.filter(
    (memory) => memory.importance > 70,
  ).length;

  const averageImportance =
    memories.length > 0
      ? Math.round(
          memories.reduce(
            (sum, memory) => sum + memory.importance,
            0,
          ) / memories.length,
        )
      : 0;

  return (
    <div className="px-6 py-6 max-w-[860px] mx-auto">
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Clone Memory
        </h1>

        <p className="text-[13px] text-white/40 mt-1">
          Everything your Clone has learned and remembers about you.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] flex items-center justify-between">
          <p className="text-[12px] text-red-400">
            {error}
          </p>

          <button
            onClick={() => setError(null)}
            className="text-red-400/60 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
          <p className="text-[22px] font-bold text-[#4f9fff]">
            {totalMemories}
          </p>

          <p className="text-[11px] text-white/35 mt-0.5">
            Total Memories
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
          <p className="text-[22px] font-bold text-[#a78bfa]">
            {highImportance}
          </p>

          <p className="text-[11px] text-white/35 mt-0.5">
            High Importance
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
          <p className="text-[22px] font-bold text-[#22d3ee]">
            {averageImportance}
          </p>

          <p className="text-[11px] text-white/35 mt-0.5">
            Average Importance
          </p>
        </div>
      </div>

      {/* MAIN CARD */}

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
        {/* SEARCH + ADD */}

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] border border-white/[0.08] bg-white/[0.03] flex-1 min-w-[180px]">
            <span className="text-white/30">
              🔍
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search memories..."
              className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none"
            />
          </div>

          <button
            onClick={() =>
              setShowAdd((value) => !value)
            }
            className="px-3 py-2 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] font-medium text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all"
          >
            + Add Memory
          </button>
        </div>

        {/* ADD MEMORY */}

        {showAdd && (
          <div className="rounded-xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.04] p-4 space-y-3">
            <p className="text-[13px] font-semibold text-white">
              Add New Memory
            </p>

            <textarea
              value={newMemory}
              onChange={(e) =>
                setNewMemory(e.target.value)
              }
              placeholder="What should your Clone remember about you?"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none resize-none focus:border-[#4f9fff]/30 transition-colors"
            />

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-white/40 shrink-0">
                Importance
              </span>

              <input
                type="range"
                min={0}
                max={100}
                value={importance}
                onChange={(e) =>
                  setImportance(
                    Number(e.target.value),
                  )
                }
                className="flex-1 accent-[#4f9fff]"
              />

              <span className="text-[11px] text-white/50 w-7 text-right">
                {importance}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddMemory}
                disabled={
                  !newMemory.trim() || saving
                }
                className={cn(
                  "px-4 py-2 rounded-lg text-[12px] font-semibold transition-all",
                  newMemory.trim() && !saving
                    ? "bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[#4f9fff] hover:bg-[#4f9fff]/25"
                    : "bg-white/[0.05] text-white/20 cursor-not-allowed",
                )}
              >
                {saving
                  ? "Saving..."
                  : "Save Memory"}
              </button>

              <button
                onClick={() => {
                  setShowAdd(false);
                  setNewMemory("");
                }}
                className="px-4 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* MEMORIES */}

        <div className="space-y-3">
          {loading ? (
            <>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] animate-pulse"
                >
                  <div className="h-4 w-3/4 bg-white/[0.06] rounded mb-3" />
                  <div className="h-2 w-full bg-white/[0.05] rounded" />
                </div>
              ))}
            </>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">
                🧠
              </p>

              <p className="text-[13px] text-white/30">
                {search
                  ? "No memories match your search."
                  : "No memories yet."}
              </p>

              {!search && (
                <p className="text-[11px] text-white/20 mt-1">
                  Add a memory to start teaching your Clone.
                </p>
              )}
            </div>
          ) : (
            filtered.map((memory) => (
              <div
                key={memory.id}
                className="group flex gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
              >
                {/* ICON */}

                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5 bg-[#4f9fff]/10 border border-[#4f9fff]/20">
                  🧠
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] text-white/80 leading-relaxed">
                      {memory.memory}
                    </p>

                    <button
                      onClick={() =>
                        handleDeleteMemory(
                          memory.id,
                        )
                      }
                      disabled={
                        deletingId === memory.id
                      }
                      className="shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-red-400 transition-all text-[11px]"
                    >
                      {deletingId === memory.id
                        ? "..."
                        : "✕"}
                    </button>
                  </div>

                  {/* META */}

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-[10px] font-semibold text-[#4f9fff]">
                      Clone Memory
                    </span>

                    <span className="text-[10px] text-white/25">
                      Importance {memory.importance}
                    </span>

                    <span className="ml-auto text-[10px] text-white/20">
                      {formatRelativeTime(
                        memory.createdAt,
                      )}
                    </span>
                  </div>

                  {/* IMPORTANCE BAR */}

                  <div className="mt-2 h-0.5 rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-[#4f9fff] opacity-50"
                      style={{
                        width: `${memory.importance}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

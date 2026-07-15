// apps/frontend/components/clone/TraitManager.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CloneGoal } from "@/types/systems";

interface TraitManagerProps {
  goals: CloneGoal[];
  interests: string[];
  communicationStyle: string;
  onUpdateGoal: (id: string, progress: number) => void;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Communication: "#4f9fff",
  Knowledge: "#22d3ee",
  Social: "#a78bfa",
  Personality: "#fbbf24",
  Behavior: "#34d399",
};

export function TraitManager({
  goals,
  interests,
  communicationStyle,
  onUpdateGoal,
  onAddInterest,
  onRemoveInterest,
}: TraitManagerProps) {
  const [interestInput, setInterestInput] = useState("");
  const [activeTab, setActiveTab] = useState<"goals" | "interests" | "style">("goals");

  const active = goals.filter((g) => !g.isCompleted);
  const completed = goals.filter((g) => g.isCompleted);

  function handleAddInterest() {
    const val = interestInput.trim().toLowerCase();
    if (!val) return;
    onAddInterest(val);
    setInterestInput("");
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {(["goals", "interests", "style"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-[8px] text-[12px] font-medium capitalize transition-all",
              activeTab === t
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t === "goals" ? `Goals (${active.length})` : t === "interests" ? `Interests (${interests.length})` : "Style"}
          </button>
        ))}
      </div>

      {/* Goals */}
      {activeTab === "goals" && (
        <div className="space-y-5">
          {active.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                In Progress
              </p>
              {active.map((goal) => {
                const color = CATEGORY_COLORS[goal.category] ?? "#4f9fff";
                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-[13px] font-semibold text-white">{goal.title}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{goal.description}</p>
                      </div>
                      <span
                        className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                        style={{ color, borderColor: color + "40", background: color + "15" }}
                      >
                        {goal.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${goal.progress}%`,
                            background: color,
                            boxShadow: `0 0 6px ${color}60`,
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-bold shrink-0" style={{ color }}>
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Progress bumper */}
                    <div className="flex items-center gap-2 mt-3">
                      {[25, 50, 75, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => onUpdateGoal(goal.id, v)}
                          className={cn(
                            "flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all border",
                            goal.progress >= v
                              ? "border-transparent text-white/30 bg-white/[0.03]"
                              : "border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                          )}
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {completed.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Completed ✓
              </p>
              {completed.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04]"
                >
                  <span className="text-emerald-400 text-lg">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/70 line-through">{goal.title}</p>
                    {goal.completedAt && (
                      <p className="text-[10px] text-white/25 mt-0.5">
                        Completed {new Date(goal.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interests */}
      {activeTab === "interests" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddInterest(); }}
              placeholder="Add an interest..."
              className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-[9px] px-3 py-2 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/35 transition-colors"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <div
                key={interest}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/[0.08] text-[12px] text-[#a78bfa]"
              >
                {interest}
                <button
                  onClick={() => onRemoveInterest(interest)}
                  className="opacity-50 hover:opacity-100 transition-opacity text-[11px]"
                >
                  ×
                </button>
              </div>
            ))}
            {interests.length === 0 && (
              <p className="text-[13px] text-white/25">No interests added yet. Add some to help Cosmo understand you better.</p>
            )}
          </div>
        </div>
      )}

      {/* Communication style */}
      {activeTab === "style" && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <p className="text-[13px] font-semibold text-white">Detected Communication Style</p>
          </div>
          <p className="text-[13px] text-white/65 leading-relaxed">{communicationStyle}</p>
          <p className="mt-4 text-[11px] text-white/30">
            This profile is automatically updated as Cosmo learns more from your training sessions and conversations.
          </p>
        </div>
      )}
    </div>
  );
}
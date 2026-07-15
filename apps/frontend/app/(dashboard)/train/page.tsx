// apps/frontend/app/(dashboard)/train/page.tsx
"use client";

import { useState, useRef } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils";
import { MOCK_CLONE } from "@/lib/mockData";

const TRAINING_PROMPTS = [
  "What's your honest opinion on AI replacing creative jobs?",
  "Describe your perfect Saturday morning.",
  "What do you think about when you can't sleep?",
  "What's something most people misunderstand about you?",
  "How do you handle conflict with someone you care about?",
  "What would you tell your 15-year-old self?",
];

const TRAIT_COLORS: Record<string, string> = {
  Humor: "#4f9fff",
  Empathy: "#a78bfa",
  Creativity: "#22d3ee",
  Logic: "#34d399",
  Curiosity: "#fbbf24",
};

interface TrainingEntry {
  id: string;
  prompt: string;
  response: string;
  traits: string[];
  pointsEarned: number;
  timestamp: string;
}

export default function TrainClonePage() {
  const [clone, setClone] = useState(MOCK_CLONE);
  const [input, setInput] = useState("");
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [history, setHistory] = useState<TrainingEntry[]>([]);
  const [lastDelta, setLastDelta] = useState<Record<string, number> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleTrain() {
    const message = input.trim();
    if (!message || isTraining) return;

    setIsTraining(true);

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1200));

    const delta = {
      Humor: Math.floor(Math.random() * 6) - 2,
      Creativity: Math.floor(Math.random() * 5),
      Empathy: Math.floor(Math.random() * 4) - 1,
    };

    const entry: TrainingEntry = {
      id: `train_${Date.now()}`,
      prompt: activePrompt ?? "Custom training",
      response: message,
      traits: Object.keys(delta).filter((k) => delta[k as keyof typeof delta] > 0),
      pointsEarned: Math.floor(Math.random() * 5) + 1,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [entry, ...prev]);
    setLastDelta(delta);
    setClone((prev) => ({
      ...prev,
      personalityProgress: Math.min(100, prev.personalityProgress + 1),
      trainingCount: prev.trainingCount + 1,
      traits: prev.traits.map((t) => ({
        ...t,
        value: Math.min(100, t.value + Math.max(0, delta[t.name as keyof typeof delta] ?? 0)),
      })),
    }));

    setInput("");
    setActivePrompt(null);
    setIsTraining(false);
  }

  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Train Clone</h1>
        <p className="text-[13px] text-white/40 mt-0.5">
          Every response teaches {clone.name} more about who you are.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left — Training area */}
        <div className="space-y-5">
          {/* Prompt suggestions */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
              Training Prompts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRAINING_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setActivePrompt(prompt);
                    setInput(prompt + "\n\n");
                    textareaRef.current?.focus();
                  }}
                  className={cn(
                    "text-left px-3 py-2.5 rounded-xl text-[12px] leading-snug transition-all border",
                    activePrompt === prompt
                      ? "border-[#4f9fff]/40 bg-[#4f9fff]/[0.08] text-[#4f9fff]"
                      : "border-white/[0.07] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  )}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] focus-within:border-[#4f9fff]/30 transition-colors overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
              <Avatar name="Me" size="sm" />
              <span className="text-[13px] font-medium text-white/60">
                Share your thoughts, opinions, or stories…
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write anything authentic — your Clone learns from how you think and express yourself. The more honest and detailed, the better the training."
              className="w-full bg-transparent px-5 py-4 text-[14px] text-white/80 placeholder:text-white/20 outline-none resize-none min-h-[140px] leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleTrain();
              }}
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
              <span className="text-[11px] text-white/25">
                {input.length} chars · ⌘↵ to train
              </span>
              <button
                onClick={handleTrain}
                disabled={!input.trim() || isTraining}
                className="flex items-center gap-2 px-5 py-2 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(79,159,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
              >
                {isTraining ? (
                  <><span className="animate-spin">⚡</span> Training…</>
                ) : (
                  <>⚡ Train Clone</>
                )}
              </button>
            </div>
          </div>

          {/* Last delta result */}
          {lastDelta && (
            <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/[0.04] p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✨</span>
                <p className="text-[13px] font-semibold text-[#22d3ee]">
                  Training complete! {clone.name} learned from your response.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(lastDelta).map(([trait, delta]) => (
                  <div key={trait} className="flex items-center gap-1.5">
                    <span className="text-[12px] text-white/50">{trait}</span>
                    <span className={cn(
                      "text-[12px] font-bold",
                      delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-white/30"
                    )}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Training History
              </p>
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[11px] text-white/30 mb-1">{entry.prompt}</p>
                    <p className="text-[13px] text-white/65 line-clamp-2">{entry.response}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {entry.traits.map((t) => (
                        <Badge key={t} variant="cyan" size="sm">+{t}</Badge>
                      ))}
                      <span className="ml-auto text-[10px] text-white/25">
                        +{entry.pointsEarned}pt
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Clone status */}
        <div className="space-y-4">
          {/* Clone card */}
          <div className="rounded-2xl border border-[#4f9fff]/20 bg-gradient-to-br from-[#4f9fff]/[0.04] to-[#a78bfa]/[0.03] p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] flex items-center justify-center text-xl border border-white/10 shadow-[0_0_20px_rgba(79,159,255,0.2)]">
                🐱
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">{clone.name}</p>
                <p className="text-[11px] text-white/40">Level {clone.level} · {clone.trainingCount} sessions</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-white/40">Personality Training</span>
                <span className="text-[#4f9fff] font-semibold">{clone.personalityProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4f9fff] to-[#a78bfa] shadow-[0_0_8px_rgba(79,159,255,0.4)] transition-all duration-700"
                  style={{ width: `${clone.personalityProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {clone.traits.map((trait) => (
                <div key={trait.name}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/45">{trait.name}</span>
                    <span className="font-semibold" style={{ color: TRAIT_COLORS[trait.name] ?? "#fff" }}>
                      {trait.value}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${trait.value}%`,
                        background: TRAIT_COLORS[trait.name] ?? "#4f9fff",
                        boxShadow: `0 0 6px ${TRAIT_COLORS[trait.name] ?? "#4f9fff"}60`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-3">
              Training Tips
            </p>
            <ul className="space-y-2 text-[12px] text-white/40 leading-relaxed">
              <li>🎯 Be specific — general answers teach less</li>
              <li>💭 Share opinions, not just facts</li>
              <li>😂 Use your natural voice and humor</li>
              <li>📝 Longer responses train more traits</li>
              <li>🔄 Train daily for faster evolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
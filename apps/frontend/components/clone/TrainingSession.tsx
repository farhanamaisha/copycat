// apps/frontend/components/clone/TrainingSession.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";

export interface TrainingSessionData {
  id: string;
  prompt: string;
  userResponse: string;
  aiAnalysis: string;
  traitDeltas: Record<string, number>;
  pointsEarned: number;
  quality: "low" | "medium" | "high" | "excellent";
  createdAt: string;
}

const PROMPTS = [
  "What's your honest opinion on AI replacing creative jobs?",
  "Describe your perfect Saturday morning.",
  "What do you think about when you can't sleep?",
  "What's something most people misunderstand about you?",
  "How do you handle conflict with someone you care about?",
  "What would you tell your 15-year-old self?",
  "What's a belief you hold that most people around you don't share?",
  "Describe the last time you changed your mind about something important.",
];

const QUALITY_CONFIG = {
  excellent: { color: "#34d399", label: "Excellent", icon: "✨" },
  high: { color: "#4f9fff", label: "High", icon: "⚡" },
  medium: { color: "#fbbf24", label: "Medium", icon: "📝" },
  low: { color: "#f87171", label: "Low", icon: "💤" },
};

interface TrainingSessionProps {
  onTrain: (prompt: string, response: string) => Promise<TrainingSessionData>;
  recentSessions: TrainingSessionData[];
  isTraining: boolean;
  lastSession: TrainingSessionData | null;
}

export function TrainingSessionComponent({
  onTrain, recentSessions, isTraining, lastSession,
}: TrainingSessionProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const finalPrompt = activePrompt ?? customPrompt;

  async function handleSubmit() {
    if (!finalPrompt.trim() || !response.trim() || isTraining) return;
    await onTrain(finalPrompt, response);
    setResponse("");
    setActivePrompt(null);
    setCustomPrompt("");
  }

  return (
    <div className="space-y-5">
      {lastSession && (
        <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/[0.04] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <span>✨</span>
            <p className="text-[13px] font-semibold text-[#22d3ee]">
              Training complete! {lastSession.pointsEarned} points earned.
            </p>
            <span className="ml-auto text-[11px]" style={{ color: QUALITY_CONFIG[lastSession.quality].color }}>
              {QUALITY_CONFIG[lastSession.quality].icon} {QUALITY_CONFIG[lastSession.quality].label}
            </span>
          </div>
          <p className="text-[12px] text-white/50 leading-relaxed">{lastSession.aiAnalysis}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {Object.entries(lastSession.traitDeltas).filter(([, v]) => v !== 0).map(([trait, delta]) => (
              <span key={trait} className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full",
                delta > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
              )}>
                {trait} {delta > 0 ? `+${delta}` : delta}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">Choose a Prompt</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => { setActivePrompt(prompt); setCustomPrompt(""); }}
              className={cn("text-left px-3 py-2.5 rounded-xl text-[12px] leading-snug transition-all border",
                activePrompt === prompt
                  ? "border-[#4f9fff]/40 bg-[#4f9fff]/[0.08] text-[#4f9fff]"
                  : "border-white/[0.06] text-white/45 hover:text-white/75 hover:bg-white/[0.04]"
              )}>
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-white/25">or write your own</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <input value={customPrompt} onChange={(e) => { setCustomPrompt(e.target.value); setActivePrompt(null); }}
          placeholder="Write a custom training prompt..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/30 transition-colors"
        />
      </div>

      {(activePrompt || customPrompt) && (
        <div className="rounded-2xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.03] p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-2 mb-4">
            <span className="text-[#4f9fff] text-lg mt-0.5">💬</span>
            <p className="text-[14px] font-medium text-white/80 leading-relaxed">{activePrompt ?? customPrompt}</p>
          </div>
          <textarea value={response} onChange={(e) => setResponse(e.target.value)}
            placeholder="Answer authentically — your Clone learns from how you think and express yourself..."
            rows={5}
            className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-[14px] text-white/80 placeholder:text-white/20 outline-none resize-none focus:border-[#4f9fff]/35 transition-colors leading-relaxed"
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-white/25">
              {response.length} chars · ⌘↵ to train ·{" "}
              {response.length > 200 ? "✨ Excellent" : response.length > 100 ? "⚡ Good" : "Write more for better training"}
            </span>
            <button onClick={handleSubmit} disabled={!response.trim() || isTraining}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all">
              {isTraining ? <><span className="animate-spin inline-block">⚡</span> Training…</> : "⚡ Train Clone"}
            </button>
          </div>
        </div>
      )}

      <div>
        <button onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/70 transition-colors mb-3">
          <span>{showHistory ? "▼" : "▶"}</span>
          Recent Sessions ({recentSessions.length})
        </button>
        {showHistory && (
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const qc = QUALITY_CONFIG[session.quality];
              return (
                <div key={session.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[12px] font-medium text-white/60 leading-snug">{session.prompt}</p>
                    <span className="text-[11px] shrink-0" style={{ color: qc.color }}>{qc.icon} {qc.label}</span>
                  </div>
                  <p className="text-[12px] text-white/45 line-clamp-2 mb-3">{session.userResponse}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {Object.entries(session.traitDeltas).filter(([, v]) => v !== 0).map(([trait, delta]) => (
                      <span key={trait} className={cn("text-[10px] font-semibold", delta > 0 ? "text-emerald-400" : "text-red-400")}>
                        {trait} {delta > 0 ? `+${delta}` : delta}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] text-white/20">{formatRelativeTime(session.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
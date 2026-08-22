// apps/frontend/app/(dashboard)/train/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  submitTraining,
  getTrainingSessions,
  getMyClone,
  type TrainingSession,
  type CloneData,
} from "@/services/api/training.api";

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
  high:      { color: "#4f9fff", label: "High",      icon: "⚡" },
  medium:    { color: "#fbbf24", label: "Medium",    icon: "📝" },
  low:       { color: "#f87171", label: "Low",       icon: "💤" },
};

const TRAIT_COLORS: Record<string, string> = {
  Humor: "#4f9fff", Empathy: "#a78bfa", Creativity: "#22d3ee",
  Logic: "#34d399", Curiosity: "#fbbf24",
};

export default function TrainPage() {
  const [clone, setClone] = useState<CloneData | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [lastSession, setLastSession] = useState<TrainingSession | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const finalPrompt = activePrompt ?? customPrompt;

  // Load clone + sessions on mount
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [cloneRes, sessionsRes] = await Promise.all([
          getMyClone(),
          getTrainingSessions(),
        ]);
        setClone(cloneRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error('Failed to load:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleTrain() {
    const msg = response.trim();
    if (!finalPrompt.trim() || !msg || isTraining) return;

    setError(null);
    setIsTraining(true);

    try {
      const result = await submitTraining(finalPrompt, msg);

      setLastSession(result.data.session);
      setSessions((prev) => [result.data.session, ...prev]);
      setClone(result.data.clone);
      setResponse("");
      setActivePrompt(null);
      setCustomPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed. Try again.');
    } finally {
      setIsTraining(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-2xl mx-auto animate-pulse">🐱</div>
          <p className="text-[13px] text-white/40">Loading your Clone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Train Clone</h1>
        <p className="text-[13px] text-white/40 mt-1">
          Every response is analyzed by Gemini AI and teaches {clone?.name ?? "your Clone"} more about who you are.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] flex items-center justify-between">
          <p className="text-[13px] text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 text-[11px] ml-3">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Sessions",          value: clone?.trainingCount ?? 0,              color: "#4f9fff" },
          { label: "Personality",       value: `${Math.round(clone?.personalityProgress ?? 0)}%`, color: "#a78bfa" },
          { label: "Clone Level",       value: `Lv.${clone?.level ?? 1}`,              color: "#22d3ee" },
          { label: "Accuracy",          value: `${clone?.accuracyPercent ?? 0}%`,      color: "#34d399" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
            <p className="text-[20px] font-bold" style={{ color }}>{value}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left — training area */}
        <div className="space-y-5">
          {/* Last session result */}
          {lastSession && (
            <div className="rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/[0.04] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span>✨</span>
                <p className="text-[13px] font-semibold text-[#22d3ee]">
                  Gemini analyzed your response! {lastSession.pointsEarned} points earned.
                </p>
                <span className="ml-auto text-[11px]"
                  style={{ color: QUALITY_CONFIG[lastSession.quality].color }}>
                  {QUALITY_CONFIG[lastSession.quality].icon} {QUALITY_CONFIG[lastSession.quality].label}
                </span>
              </div>
              <p className="text-[12px] text-white/55 leading-relaxed mb-3">{lastSession.aiAnalysis}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(lastSession.traitDeltas)
                  .filter(([, v]) => v !== 0)
                  .map(([trait, delta]) => (
                    <span key={trait}
                      className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        delta > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                      )}>
                      {trait} {delta > 0 ? `+${delta}` : delta}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Prompt picker */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
              Choose a Prompt
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {PROMPTS.map((prompt) => (
                <button key={prompt}
                  onClick={() => { setActivePrompt(prompt); setCustomPrompt(""); textareaRef.current?.focus(); }}
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

            <input
              value={customPrompt}
              onChange={(e) => { setCustomPrompt(e.target.value); setActivePrompt(null); }}
              placeholder="Write a custom training prompt..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/30 transition-colors"
            />
          </div>

          {/* Response area */}
          {(activePrompt || customPrompt) && (
            <div className="rounded-2xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.03] p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start gap-2 mb-4">
                <span className="text-[#4f9fff] text-lg mt-0.5">💬</span>
                <p className="text-[14px] font-medium text-white/80 leading-relaxed">
                  {activePrompt ?? customPrompt}
                </p>
              </div>

              <textarea
                ref={textareaRef}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Answer authentically — Gemini will analyze your personality from this response..."
                rows={5}
                className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-[14px] text-white/80 placeholder:text-white/20 outline-none resize-none focus:border-[#4f9fff]/35 transition-colors leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleTrain(); }}
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-white/25">
                  {response.length} chars · ⌘↵ to train ·{" "}
                  {response.length > 200 ? "✨ Excellent length"
                    : response.length > 100 ? "⚡ Good length"
                    : "Write more for better Gemini analysis"}
                </span>
                <button
                  onClick={handleTrain}
                  disabled={!response.trim() || isTraining}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                >
                  {isTraining ? (
                    <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    "⚡ Train with Gemini"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/70 transition-colors mb-3"
            >
              <span>{showHistory ? "▼" : "▶"}</span>
              Training History ({sessions.length})
            </button>

            {showHistory && (
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-[13px] text-white/30 text-center py-6">No sessions yet — start training!</p>
                ) : sessions.map((session) => {
                  const qc = QUALITY_CONFIG[session.quality];
                  return (
                    <div key={session.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-[12px] font-medium text-white/60 leading-snug">{session.prompt}</p>
                        <span className="text-[11px] shrink-0" style={{ color: qc.color }}>
                          {qc.icon} {qc.label}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/45 line-clamp-2 mb-3">{session.userResponse}</p>
                      {session.aiAnalysis && (
                        <p className="text-[11px] text-[#22d3ee]/60 italic mb-3">"{session.aiAnalysis}"</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        {Object.entries(session.traitDeltas)
                          .filter(([, v]) => v !== 0)
                          .map(([trait, delta]) => (
                            <span key={trait}
                              className={cn("text-[10px] font-semibold",
                                delta > 0 ? "text-emerald-400" : "text-red-400"
                              )}>
                              {trait} {delta > 0 ? `+${delta}` : delta}
                            </span>
                          ))}
                        <span className="ml-auto text-[10px] text-white/20">
                          {formatRelativeTime(session.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right — Clone live state */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#4f9fff]/20 bg-gradient-to-br from-[#4f9fff]/[0.05] to-[#a78bfa]/[0.03] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(79,159,255,0.25)]">
                🐱
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">{clone?.name ?? "Your Clone"}</p>
                <p className="text-[11px] text-white/40">
                  Level {clone?.level ?? 1} · {clone?.trainingCount ?? 0} sessions
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-white/40">Personality Training</span>
                <span className="text-[#4f9fff] font-semibold">
                  {Math.round(clone?.personalityProgress ?? 0)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4f9fff] to-[#a78bfa] shadow-[0_0_8px_rgba(79,159,255,0.4)] transition-all duration-700"
                  style={{ width: `${clone?.personalityProgress ?? 0}%` }}
                />
              </div>
            </div>

            {/* Traits */}
            <div className="space-y-2.5">
              {(clone?.traits ?? []).map((trait) => {
                const color = TRAIT_COLORS[trait.name] ?? "#4f9fff";
                return (
                  <div key={trait.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/45">{trait.name}</span>
                      <span className="font-semibold" style={{ color }}>{trait.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${trait.value}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
              {(!clone?.traits || clone.traits.length === 0) && (
                <p className="text-[12px] text-white/25 text-center py-2">
                  Train to develop traits
                </p>
              )}
            </div>
          </div>

          {/* Powered by badge */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-[12px] font-semibold text-white">Powered by Gemini AI</p>
              <p className="text-[11px] text-white/35">
                Every response is analyzed by Google Gemini 1.5 Flash
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-3">Tips</p>
            <ul className="space-y-2 text-[12px] text-white/40 leading-relaxed">
              <li>🎯 Be specific — details train better</li>
              <li>💭 Share opinions, not just facts</li>
              <li>😂 Use your natural voice</li>
              <li>📝 150+ chars = Excellent quality</li>
              <li>🔄 Train daily for faster growth</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
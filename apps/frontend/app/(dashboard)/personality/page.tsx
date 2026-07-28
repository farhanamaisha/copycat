// apps/frontend/app/(dashboard)/personality/page.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Trait {
  id: string;
  name: string;
  category: "personality" | "emotion" | "behavior" | "knowledge";
  value: number;
  confidence: number;
  color: string;
  description: string;
}

interface KnowledgeTopic {
  id: string;
  name: string;
  depth: number;
  breadth: number;
  sources: number;
}

interface EvolutionPoint {
  date: string;
  overall: number;
  traits: Record<string, number>;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  category: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRAITS: Trait[] = [
  { id: "t1", name: "Humor",       category: "personality", value: 81, confidence: 88, color: "#4f9fff", description: "Tendency to use wit, irony, and playful language" },
  { id: "t2", name: "Empathy",     category: "emotion",     value: 74, confidence: 82, color: "#a78bfa", description: "Ability to understand and share emotional context" },
  { id: "t3", name: "Creativity",  category: "personality", value: 88, confidence: 91, color: "#22d3ee", description: "Tendency toward original thinking and novel connections" },
  { id: "t4", name: "Logic",       category: "behavior",    value: 65, confidence: 75, color: "#34d399", description: "Systematic reasoning and analytical approach" },
  { id: "t5", name: "Curiosity",   category: "personality", value: 92, confidence: 95, color: "#fbbf24", description: "Drive to explore, learn, and ask questions" },
  { id: "t6", name: "Directness",  category: "behavior",    value: 71, confidence: 79, color: "#f87171", description: "Preference for clear, unambiguous communication" },
];

const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  { id: "k1", name: "AI & Machine Learning", depth: 72, breadth: 68, sources: 89 },
  { id: "k2", name: "Philosophy of Mind",    depth: 65, breadth: 58, sources: 34 },
  { id: "k3", name: "Creative Writing",       depth: 88, breadth: 71, sources: 127 },
  { id: "k4", name: "Frontend Development",  depth: 91, breadth: 85, sources: 203 },
  { id: "k5", name: "Music Theory",          depth: 34, breadth: 45, sources: 22 },
  { id: "k6", name: "Cognitive Science",     depth: 55, breadth: 48, sources: 41 },
];

const EVOLUTION: EvolutionPoint[] = Array.from({ length: 12 }, (_, i) => ({
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (11 - i) * 7).toISOString(),
  overall: 20 + i * 4.5 + Math.random() * 3,
  traits: {
    Humor:      50 + i * 2.5 + Math.random() * 5,
    Creativity: 45 + i * 3.5 + Math.random() * 4,
    Empathy:    40 + i * 2.8 + Math.random() * 3,
    Curiosity:  60 + i * 2.7 + Math.random() * 4,
  },
}));

const GOALS: Goal[] = [
  { id: "g1", title: "Master creative writing style", description: "Learn user's unique narrative voice", progress: 67, isCompleted: false, category: "Communication" },
  { id: "g2", title: "Understand technical interests", description: "Build knowledge map of tech expertise", progress: 45, isCompleted: false, category: "Knowledge" },
  { id: "g3", title: "Map social relationship style", description: "Learn how user builds relationships", progress: 82, isCompleted: false, category: "Social" },
  { id: "g4", title: "Humor calibration complete", description: "Match user's exact comedic timing", progress: 100, isCompleted: true, category: "Personality" },
];

const INTERESTS = ["AI ethics", "generative art", "indie music", "philosophy", "TypeScript", "design systems", "sci-fi literature"];

const TABS = ["Overview", "Traits", "Knowledge", "Goals"] as const;
type Tab = typeof TABS[number];

const TRAIT_COLORS: Record<string, string> = {
  overall: "#4f9fff", Humor: "#a78bfa", Creativity: "#22d3ee", Empathy: "#34d399", Curiosity: "#fbbf24",
};

const CATEGORY_LABELS: Record<string, string> = {
  personality: "Personality", emotion: "Emotion", behavior: "Behavior", knowledge: "Knowledge",
};

// ─── EvolutionGraph ───────────────────────────────────────────────────────────

function EvolutionGraph({ history }: { history: EvolutionPoint[] }) {
  const [activeTraits, setActiveTraits] = useState<Set<string>>(new Set(["overall"]));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const W = 560, H = 200, PL = 36, PR = 16, PT = 16, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;

  const toX = (i: number) => PL + (i / (history.length - 1)) * cW;
  const toY = (v: number) => PT + cH - (Math.min(100, Math.max(0, v)) / 100) * cH;

  function makePath(values: number[]) {
    return values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(" ");
  }

  const allTraits = ["overall", ...Object.keys(history[0]?.traits ?? {})];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {allTraits.map((t) => {
          const color = TRAIT_COLORS[t] ?? "#fff";
          const active = activeTraits.has(t);
          return (
            <button key={t} onClick={() => {
              setActiveTraits((prev) => {
                const next = new Set(prev);
                if (next.has(t)) { if (next.size > 1) next.delete(t); } else next.add(t);
                return next;
              });
            }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border"
              style={{ borderColor: active ? color + "50" : "rgba(255,255,255,0.07)", background: active ? color + "15" : "transparent", color: active ? color : "rgba(255,255,255,0.3)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: active ? color : "rgba(255,255,255,0.2)" }} />
              {t === "overall" ? "Overall" : t}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}
          onMouseLeave={() => setHoveredIndex(null)}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PL - 5} y={toY(v) + 4} fontSize="9" fill="rgba(255,255,255,0.2)" textAnchor="end">{v}</text>
            </g>
          ))}
          {history.map((pt, i) => {
            if (i % Math.max(1, Math.floor(history.length / 5)) !== 0) return null;
            return (
              <text key={i} x={toX(i)} y={H - 5} fontSize="9" fill="rgba(255,255,255,0.2)" textAnchor="middle">
                {new Date(pt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            );
          })}
          {allTraits.filter((t) => activeTraits.has(t)).map((t) => {
            const color = TRAIT_COLORS[t] ?? "#fff";
            const values = t === "overall" ? history.map((p) => p.overall) : history.map((p) => p.traits[t] ?? 0);
            return (
              <g key={t}>
                <path d={`${makePath(values)} L ${toX(values.length - 1).toFixed(1)} ${toY(0).toFixed(1)} L ${toX(0).toFixed(1)} ${toY(0).toFixed(1)} Z`} fill={color} opacity={0.05} />
                <path d={makePath(values)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
                {values.map((v, i) => (
                  <circle key={i} cx={toX(i)} cy={toY(v)} r={hoveredIndex === i ? 4 : 2.5} fill={color} opacity={hoveredIndex === i ? 1 : 0.7}
                    className="transition-all cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} />
                ))}
              </g>
            );
          })}
          {hoveredIndex !== null && (
            <line x1={toX(hoveredIndex)} y1={PT} x2={toX(hoveredIndex)} y2={H - PB} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
          )}
        </svg>

        {hoveredIndex !== null && history[hoveredIndex] && (
          <div className="absolute top-3 pointer-events-none" style={{ left: Math.min((toX(hoveredIndex) / W) * 100, 68) + "%" }}>
            <div className="rounded-xl border border-white/[0.12] bg-[#0d0d1a]/98 backdrop-blur-xl p-3 shadow-xl min-w-[140px]">
              <p className="text-[11px] text-white/40 mb-2">
                {new Date(history[hoveredIndex].date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </p>
              {allTraits.filter((t) => activeTraits.has(t)).map((t) => {
                const color = TRAIT_COLORS[t] ?? "#fff";
                const val = t === "overall" ? history[hoveredIndex].overall : history[hoveredIndex].traits[t] ?? 0;
                return (
                  <div key={t} className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-[11px] text-white/60">{t === "overall" ? "Overall" : t}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color }}>{val.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PersonalitySliders ───────────────────────────────────────────────────────

function PersonalitySliders({ traits, onUpdate, readOnly }: { traits: Trait[]; onUpdate: (id: string, val: number) => void; readOnly?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const grouped = traits.reduce<Record<string, Trait[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, catTraits]) => (
        <div key={cat}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">{CATEGORY_LABELS[cat] ?? cat}</p>
          <div className="space-y-4">
            {catTraits.map((trait) => (
              <div key={trait.id} onMouseEnter={() => setHovered(trait.id)} onMouseLeave={() => setHovered(null)}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white/80">{trait.name}</span>
                    {hovered === trait.id && (
                      <span className="text-[11px] text-white/30 animate-in fade-in duration-150">{trait.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/30">{trait.confidence}% conf.</span>
                    <span className="text-[14px] font-bold min-w-[36px] text-right" style={{ color: trait.color }}>{trait.value}</span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                    style={{ width: `${trait.value}%`, background: `linear-gradient(90deg, ${trait.color}88, ${trait.color})`, boxShadow: `0 0 8px ${trait.color}60` }} />
                  {!readOnly && (
                    <input type="range" min={0} max={100} value={trait.value}
                      onChange={(e) => onUpdate(trait.id, Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                  )}
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] text-white/20">Low</span>
                  <span className="text-[9px] text-white/20">High</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── KnowledgeMap ─────────────────────────────────────────────────────────────

function KnowledgeMap({ topics }: { topics: KnowledgeTopic[] }) {
  const [view, setView] = useState<"grid" | "bars">("grid");
  const [hovered, setHovered] = useState<string | null>(null);
  const sorted = [...topics].sort((a, b) => b.depth - a.depth);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{topics.length} Knowledge Areas</p>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-lg p-0.5">
          {(["grid", "bars"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                view === v ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/60"
              )}>
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
              <div key={topic.id}
                onMouseEnter={() => setHovered(topic.id)} onMouseLeave={() => setHovered(null)}
                className={cn("relative rounded-2xl border p-4 cursor-default transition-all duration-300 hover:-translate-y-0.5",
                  hovered === topic.id ? "border-white/[0.18] bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02]"
                )}
                style={{ boxShadow: hovered === topic.id ? `0 0 20px ${color}20` : "none" }}>
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="4"
                      strokeDasharray={`${138.2 * topic.depth / 100} 138.2`} strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[13px] font-bold" style={{ color }}>{topic.depth}</span>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-white text-center leading-tight mb-1">{topic.name}</p>
                {hovered === topic.id && (
                  <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                    <div className="flex justify-between text-[10px]"><span className="text-white/35">Depth</span><span style={{ color }}>{topic.depth}%</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/35">Breadth</span><span style={{ color }}>{topic.breadth}%</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/35">Sources</span><span className="text-white/50">{topic.sources}</span></div>
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
                {[{ label: "Depth", val: topic.depth }, { label: "Breadth", val: topic.breadth }].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 w-12">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: color, boxShadow: `0 0 6px ${color}60` }} />
                    </div>
                    <span className="text-[10px] font-semibold w-7 text-right" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PersonalityPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [traits, setTraits] = useState<Trait[]>(TRAITS);
  const [interests, setInterests] = useState<string[]>(INTERESTS);
  const [interestInput, setInterestInput] = useState("");
  const [goals, setGoals] = useState<Goal[]>(GOALS);

  function updateTrait(id: string, value: number) {
    setTraits((prev) => prev.map((t) => t.id === id ? { ...t, value } : t));
  }

  function addInterest() {
    const val = interestInput.trim().toLowerCase();
    if (!val || interests.includes(val)) return;
    setInterests((prev) => [...prev, val]);
    setInterestInput("");
  }

  function updateGoal(id: string, progress: number) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, progress, isCompleted: progress >= 100 } : g));
  }

  return (
    <div className="px-6 py-6 max-w-[960px] mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cosmo&apos;s Personality</h1>
          <p className="text-[13px] text-white/40 mt-1">Level 14 · 89% accuracy · 247 training sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center px-4 py-2 rounded-xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.06]">
            <p className="text-[20px] font-bold text-[#4f9fff]">72%</p>
            <p className="text-[10px] text-white/35">Trained</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/[0.06]">
            <p className="text-[20px] font-bold text-[#a78bfa]">68</p>
            <p className="text-[10px] text-white/35">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-all",
              tab === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === "Overview" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <p className="text-[13px] font-semibold text-white mb-4">Personality Evolution</p>
            <EvolutionGraph history={EVOLUTION} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">Interests</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/[0.08] text-[11px] text-[#a78bfa]">{i}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">Communication Style</p>
              <p className="text-[12px] text-white/55 leading-relaxed">
                Wit-forward, direct but warm. Prefers concrete examples over abstractions. Uses irony frequently. Values intellectual honesty over social comfort.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Traits */}
      {tab === "Traits" && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] font-semibold text-white">Personality Traits</p>
            <p className="text-[11px] text-white/30">Drag sliders to adjust manually</p>
          </div>
          <PersonalitySliders traits={traits} onUpdate={updateTrait} />
        </div>
      )}

      {/* Knowledge */}
      {tab === "Knowledge" && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <p className="text-[13px] font-semibold text-white mb-5">Knowledge Map</p>
          <KnowledgeMap topics={KNOWLEDGE_TOPICS} />
        </div>
      )}

      {/* Goals */}
      {tab === "Goals" && (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">In Progress</p>
            {goals.filter((g) => !g.isCompleted).map((goal) => {
              const color = goal.category === "Communication" ? "#4f9fff" : goal.category === "Knowledge" ? "#22d3ee" : goal.category === "Social" ? "#a78bfa" : "#fbbf24";
              return (
                <div key={goal.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[13px] font-semibold text-white">{goal.title}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{goal.description}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ color, borderColor: color + "40", background: color + "15" }}>{goal.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goal.progress}%`, background: color }} />
                    </div>
                    <span className="text-[12px] font-bold" style={{ color }}>{goal.progress}%</span>
                  </div>
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((v) => (
                      <button key={v} onClick={() => updateGoal(goal.id, v)}
                        className={cn("flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all border",
                          goal.progress >= v ? "border-transparent text-white/30 bg-white/[0.03]" : "border-white/[0.08] text-white/40 hover:text-white/70"
                        )}>{v}%</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Completed ✓</p>
            {goals.filter((g) => g.isCompleted).map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 p-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04]">
                <span className="text-emerald-400 text-lg">✓</span>
                <p className="text-[13px] font-medium text-white/70 line-through">{goal.title}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">Interests</p>
            <div className="flex gap-2 mb-3">
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addInterest(); }}
                placeholder="Add an interest..."
                className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-[9px] px-3 py-2 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/35 transition-colors" />
              <button onClick={addInterest} className="px-4 py-2 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/20 transition-all">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <div key={interest} className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/[0.08] text-[12px] text-[#a78bfa]">
                  {interest}
                  <button onClick={() => setInterests((prev) => prev.filter((i) => i !== interest))} className="opacity-50 hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
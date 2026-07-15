// apps/frontend/components/clone/EvolutionGraph.tsx
"use client";

import { useState } from "react";
import type { PersonalityEvolutionPoint } from "@/types/systems";

interface EvolutionGraphProps {
  history: PersonalityEvolutionPoint[];
  height?: number;
}

const TRAIT_COLORS: Record<string, string> = {
  overall: "#4f9fff",
  Humor: "#a78bfa",
  Creativity: "#22d3ee",
  Empathy: "#34d399",
  Curiosity: "#fbbf24",
};

export function EvolutionGraph({ history, height = 200 }: EvolutionGraphProps) {
  const [activeTraits, setActiveTraits] = useState<Set<string>>(
    new Set(["overall"])
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (history.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px] text-white/25 text-sm">
        Not enough data yet — keep training!
      </div>
    );
  }

  const width = 600;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  function toX(i: number) {
    return padL + (i / (history.length - 1)) * chartW;
  }

  function toY(value: number) {
    return padT + chartH - (Math.min(100, Math.max(0, value)) / 100) * chartH;
  }

  function makePath(values: number[]) {
    return values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`)
      .join(" ");
  }

  const allTraits = ["overall", ...Object.keys(history[0]?.traits ?? {})];

  function toggleTrait(t: string) {
    setActiveTraits((prev) => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); }
      else next.add(t);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Trait toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        {allTraits.map((t) => {
          const color = TRAIT_COLORS[t] ?? "#ffffff";
          const active = activeTraits.has(t);
          return (
            <button
              key={t}
              onClick={() => toggleTrait(t)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border"
              style={{
                borderColor: active ? color + "50" : "rgba(255,255,255,0.07)",
                background: active ? color + "15" : "transparent",
                color: active ? color : "rgba(255,255,255,0.3)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: active ? color : "rgba(255,255,255,0.2)" }}
              />
              {t === "overall" ? "Overall" : t}
            </button>
          );
        })}
      </div>

      {/* SVG chart */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={padL} y1={toY(v)} x2={width - padR} y2={toY(v)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1"
              />
              <text
                x={padL - 6} y={toY(v) + 4}
                fontSize="9" fill="rgba(255,255,255,0.2)" textAnchor="end"
              >
                {v}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {history.map((pt, i) => {
            if (i % Math.max(1, Math.floor(history.length / 6)) !== 0) return null;
            const date = new Date(pt.date);
            return (
              <text
                key={i}
                x={toX(i)} y={height - 5}
                fontSize="9" fill="rgba(255,255,255,0.2)" textAnchor="middle"
              >
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            );
          })}

          {/* Trait lines */}
          {allTraits.filter((t) => activeTraits.has(t)).map((t) => {
            const color = TRAIT_COLORS[t] ?? "#ffffff";
            const values =
              t === "overall"
                ? history.map((p) => p.overall)
                : history.map((p) => p.traits[t] ?? 0);

            return (
              <g key={t}>
                {/* Area fill */}
                <path
                  d={`${makePath(values)} L ${toX(values.length - 1).toFixed(1)} ${toY(0).toFixed(1)} L ${toX(0).toFixed(1)} ${toY(0).toFixed(1)} Z`}
                  fill={color}
                  opacity={0.05}
                />
                {/* Line */}
                <path
                  d={makePath(values)}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
                />
                {/* Dots */}
                {values.map((v, i) => (
                  <circle
                    key={i}
                    cx={toX(i)} cy={toY(v)} r={hoveredIndex === i ? 4 : 2.5}
                    fill={color}
                    opacity={hoveredIndex === i ? 1 : 0.7}
                    className="transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                ))}
              </g>
            );
          })}

          {/* Hover line */}
          {hoveredIndex !== null && (
            <line
              x1={toX(hoveredIndex)} y1={padT}
              x2={toX(hoveredIndex)} y2={height - padB}
              stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && history[hoveredIndex] && (
          <div
            className="absolute top-4 pointer-events-none"
            style={{ left: Math.min(toX(hoveredIndex) / width * 100, 75) + "%" }}
          >
            <div className="rounded-xl border border-white/[0.12] bg-[#0d0d1a]/98 backdrop-blur-xl p-3 shadow-xl min-w-[140px]">
              <p className="text-[11px] text-white/40 mb-2">
                {new Date(history[hoveredIndex].date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </p>
              {allTraits.filter((t) => activeTraits.has(t)).map((t) => {
                const color = TRAIT_COLORS[t] ?? "#fff";
                const val = t === "overall"
                  ? history[hoveredIndex].overall
                  : history[hoveredIndex].traits[t] ?? 0;
                return (
                  <div key={t} className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-[11px] text-white/60">{t === "overall" ? "Overall" : t}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color }}>
                      {val.toFixed(1)}
                    </span>
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
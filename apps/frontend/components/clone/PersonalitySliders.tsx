// apps/frontend/components/clone/PersonalitySliders.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CloneTrait } from "@/types/systems";

interface PersonalitySlidersProps {
  traits: CloneTrait[];
  onUpdate: (traitId: string, value: number) => void;
  readOnly?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  personality: "Personality",
  knowledge: "Knowledge",
  behavior: "Behavior",
  emotion: "Emotion",
};

export function PersonalitySliders({ traits, onUpdate, readOnly }: PersonalitySlidersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const grouped = traits.reduce<Record<string, CloneTrait[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categoryTraits]) => (
        <div key={category}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="space-y-4">
            {categoryTraits.map((trait) => (
              <div
                key={trait.id}
                className="group"
                onMouseEnter={() => setHoveredId(trait.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white/80">{trait.name}</span>
                    {hoveredId === trait.id && (
                      <span className="text-[11px] text-white/35 animate-in fade-in duration-150">
                        {trait.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/35">
                      {trait.confidence}% confidence
                    </span>
                    <span
                      className="text-[14px] font-bold min-w-[36px] text-right"
                      style={{ color: trait.color }}
                    >
                      {trait.value}
                    </span>
                  </div>
                </div>

                <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  {/* Background fill */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                    style={{
                      width: `${trait.value}%`,
                      background: `linear-gradient(90deg, ${trait.color}88, ${trait.color})`,
                      boxShadow: `0 0 8px ${trait.color}60`,
                    }}
                  />

                  {/* Confidence overlay */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-20"
                    style={{
                      width: `${trait.confidence}%`,
                      background: trait.color,
                    }}
                  />

                  {/* Interactive slider */}
                  {!readOnly && (
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={trait.value}
                      onChange={(e) => onUpdate(trait.id, Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                      style={{ appearance: "none" }}
                    />
                  )}
                </div>

                {/* Value labels */}
                <div className="flex justify-between mt-1">
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
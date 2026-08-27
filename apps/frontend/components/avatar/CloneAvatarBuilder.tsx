// apps/frontend/components/avatar/CloneAvatarBuilder.tsx
"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Avatar config types ──────────────────────────────────────────────────────

export interface CloneAvatarConfig {
  baseColor: string;
  accentColor: string;
  eyeStyle: string;
  earStyle: string;
  accessory: string;
  expression: string;
  backgroundStyle: string;
  pattern: string;
}

export const DEFAULT_AVATAR: CloneAvatarConfig = {
  baseColor: "#4f9fff",
  accentColor: "#a78bfa",
  eyeStyle: "normal",
  earStyle: "pointed",
  accessory: "none",
  expression: "happy",
  backgroundStyle: "gradient",
  pattern: "none",
};

// ─── Options ──────────────────────────────────────────────────────────────────

const BASE_COLORS = [
  { value: "#4f9fff", label: "Sky Blue" },
  { value: "#a78bfa", label: "Violet" },
  { value: "#22d3ee", label: "Cyan" },
  { value: "#34d399", label: "Emerald" },
  { value: "#fbbf24", label: "Amber" },
  { value: "#f87171", label: "Rose" },
  { value: "#e879f9", label: "Fuchsia" },
  { value: "#fb923c", label: "Orange" },
  { value: "#94a3b8", label: "Slate" },
  { value: "#f1f5f9", label: "White" },
];

const ACCENT_COLORS = [
  { value: "#a78bfa", label: "Violet" },
  { value: "#4f9fff", label: "Blue" },
  { value: "#22d3ee", label: "Cyan" },
  { value: "#f9a8d4", label: "Pink" },
  { value: "#fde68a", label: "Yellow" },
  { value: "#6ee7b7", label: "Mint" },
  { value: "#c4b5fd", label: "Lavender" },
  { value: "#fdba74", label: "Peach" },
  { value: "#ffffff", label: "White" },
  { value: "#1e293b", label: "Dark" },
];

const EYE_STYLES = [
  { value: "normal",  label: "Round",    emoji: "👀" },
  { value: "sleepy",  label: "Sleepy",   emoji: "😴" },
  { value: "star",    label: "Star",     emoji: "⭐" },
  { value: "heart",   label: "Heart",    emoji: "💕" },
  { value: "wink",    label: "Wink",     emoji: "😉" },
  { value: "serious", label: "Serious",  emoji: "😐" },
];

const EAR_STYLES = [
  { value: "pointed",  label: "Pointed" },
  { value: "rounded",  label: "Rounded" },
  { value: "folded",   label: "Folded" },
  { value: "fluffy",   label: "Fluffy" },
];

const ACCESSORIES = [
  { value: "none",       label: "None",       emoji: "✕" },
  { value: "glasses",    label: "Glasses",    emoji: "🤓" },
  { value: "sunglasses", label: "Sunglasses", emoji: "😎" },
  { value: "crown",      label: "Crown",      emoji: "👑" },
  { value: "headphones", label: "Headphones", emoji: "🎧" },
  { value: "hat",        label: "Hat",        emoji: "🎩" },
  { value: "bow",        label: "Bow",        emoji: "🎀" },
  { value: "halo",       label: "Halo",       emoji: "😇" },
];

const EXPRESSIONS = [
  { value: "happy",     label: "Happy",     emoji: "😊" },
  { value: "excited",   label: "Excited",   emoji: "🤩" },
  { value: "cool",      label: "Cool",      emoji: "😎" },
  { value: "curious",   label: "Curious",   emoji: "🧐" },
  { value: "mischief",  label: "Mischief",  emoji: "😏" },
  { value: "sleepy",    label: "Sleepy",    emoji: "😴" },
];

const BG_STYLES = [
  { value: "gradient", label: "Gradient" },
  { value: "solid",    label: "Solid" },
  { value: "glow",     label: "Glow" },
  { value: "dark",     label: "Dark" },
];

const PATTERNS = [
  { value: "none",   label: "None" },
  { value: "dots",   label: "Dots" },
  { value: "stars",  label: "Stars" },
  { value: "waves",  label: "Waves" },
];

// ─── SVG Avatar renderer ──────────────────────────────────────────────────────

export function CloneAvatarSVG({
  config,
  size = 200,
}: {
  config: CloneAvatarConfig;
  size?: number;
}) {
  const c = config;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;

  // Background
  const bgId = `bg_${size}`;
  const glowId = `glow_${size}`;

  // Eye rendering
  function renderEyes() {
    const eyeY = cy - radius * 0.1;
    const eyeOffsetX = radius * 0.28;
    const eyeR = radius * 0.1;

    switch (c.eyeStyle) {
      case "star":
        return (
          <>
            <text x={cx - eyeOffsetX} y={eyeY + 5} textAnchor="middle" fontSize={radius * 0.18} fill={c.accentColor}>★</text>
            <text x={cx + eyeOffsetX} y={eyeY + 5} textAnchor="middle" fontSize={radius * 0.18} fill={c.accentColor}>★</text>
          </>
        );
      case "heart":
        return (
          <>
            <text x={cx - eyeOffsetX} y={eyeY + 5} textAnchor="middle" fontSize={radius * 0.18} fill="#f87171">♥</text>
            <text x={cx + eyeOffsetX} y={eyeY + 5} textAnchor="middle" fontSize={radius * 0.18} fill="#f87171">♥</text>
          </>
        );
      case "sleepy":
        return (
          <>
            <path d={`M${cx - eyeOffsetX - eyeR},${eyeY} Q${cx - eyeOffsetX},${eyeY - eyeR * 1.5} ${cx - eyeOffsetX + eyeR},${eyeY}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.05} strokeLinecap="round"/>
            <path d={`M${cx + eyeOffsetX - eyeR},${eyeY} Q${cx + eyeOffsetX},${eyeY - eyeR * 1.5} ${cx + eyeOffsetX + eyeR},${eyeY}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.05} strokeLinecap="round"/>
          </>
        );
      case "wink":
        return (
          <>
            <circle cx={cx - eyeOffsetX} cy={eyeY} r={eyeR} fill="rgba(255,255,255,0.95)" />
            <circle cx={cx - eyeOffsetX + eyeR * 0.2} cy={eyeY + eyeR * 0.1} r={eyeR * 0.55} fill="#1e293b" />
            <path d={`M${cx + eyeOffsetX - eyeR},${eyeY} Q${cx + eyeOffsetX},${eyeY - eyeR * 1.5} ${cx + eyeOffsetX + eyeR},${eyeY}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.05} strokeLinecap="round"/>
          </>
        );
      case "serious":
        return (
          <>
            <rect x={cx - eyeOffsetX - eyeR} y={eyeY - eyeR * 0.4} width={eyeR * 2} height={eyeR * 0.8} rx={eyeR * 0.2} fill="rgba(255,255,255,0.95)" />
            <rect x={cx + eyeOffsetX - eyeR} y={eyeY - eyeR * 0.4} width={eyeR * 2} height={eyeR * 0.8} rx={eyeR * 0.2} fill="rgba(255,255,255,0.95)" />
          </>
        );
      default: // normal
        return (
          <>
            <circle cx={cx - eyeOffsetX} cy={eyeY} r={eyeR} fill="rgba(255,255,255,0.95)" />
            <circle cx={cx - eyeOffsetX + eyeR * 0.2} cy={eyeY + eyeR * 0.1} r={eyeR * 0.55} fill="#1e293b" />
            <circle cx={cx - eyeOffsetX + eyeR * 0.05} cy={eyeY - eyeR * 0.15} r={eyeR * 0.2} fill="rgba(255,255,255,0.8)" />
            <circle cx={cx + eyeOffsetX} cy={eyeY} r={eyeR} fill="rgba(255,255,255,0.95)" />
            <circle cx={cx + eyeOffsetX + eyeR * 0.2} cy={eyeY + eyeR * 0.1} r={eyeR * 0.55} fill="#1e293b" />
            <circle cx={cx + eyeOffsetX + eyeR * 0.05} cy={eyeY - eyeR * 0.15} r={eyeR * 0.2} fill="rgba(255,255,255,0.8)" />
          </>
        );
    }
  }

  // Mouth rendering
  function renderMouth() {
    const mouthY = cy + radius * 0.22;
    const mouthW = radius * 0.3;

    switch (c.expression) {
      case "excited":
        return <ellipse cx={cx} cy={mouthY} rx={mouthW} ry={mouthW * 0.6} fill="rgba(255,255,255,0.9)" />;
      case "cool":
        return <path d={`M${cx - mouthW},${mouthY} Q${cx},${mouthY + mouthW * 0.4} ${cx + mouthW},${mouthY}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.045} strokeLinecap="round"/>;
      case "curious":
        return <circle cx={cx} cy={mouthY} r={mouthW * 0.4} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.045} />;
      case "mischief":
        return <path d={`M${cx - mouthW},${mouthY + mouthW * 0.1} Q${cx + mouthW * 0.3},${mouthY - mouthW * 0.3} ${cx + mouthW},${mouthY - mouthW * 0.2}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.045} strokeLinecap="round"/>;
      case "sleepy":
        return <path d={`M${cx - mouthW * 0.6},${mouthY} L${cx + mouthW * 0.6},${mouthY}`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={radius * 0.04} strokeLinecap="round"/>;
      default: // happy
        return <path d={`M${cx - mouthW},${mouthY - mouthW * 0.1} Q${cx},${mouthY + mouthW * 0.5} ${cx + mouthW},${mouthY - mouthW * 0.1}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={radius * 0.045} strokeLinecap="round"/>;
    }
  }

  // Ears
  function renderEars() {
    const earW = radius * 0.28;
    const earH = radius * 0.35;
    const earY = cy - radius * 0.7;

    switch (c.earStyle) {
      case "rounded":
        return (
          <>
            <ellipse cx={cx - radius * 0.55} cy={earY} rx={earW * 0.7} ry={earH * 0.7} fill={c.baseColor} />
            <ellipse cx={cx + radius * 0.55} cy={earY} rx={earW * 0.7} ry={earH * 0.7} fill={c.baseColor} />
            <ellipse cx={cx - radius * 0.55} cy={earY} rx={earW * 0.4} ry={earH * 0.4} fill={c.accentColor} opacity={0.6} />
            <ellipse cx={cx + radius * 0.55} cy={earY} rx={earW * 0.4} ry={earH * 0.4} fill={c.accentColor} opacity={0.6} />
          </>
        );
      case "folded":
        return (
          <>
            <path d={`M${cx - radius * 0.7},${earY + earH * 0.3} Q${cx - radius * 0.55},${earY - earH * 0.3} ${cx - radius * 0.35},${earY + earH * 0.1}`} fill={c.baseColor} />
            <path d={`M${cx + radius * 0.35},${earY + earH * 0.1} Q${cx + radius * 0.55},${earY - earH * 0.3} ${cx + radius * 0.7},${earY + earH * 0.3}`} fill={c.baseColor} />
          </>
        );
      case "fluffy":
        return (
          <>
            {[-1, 1].map((side) => (
              <g key={side}>
                <circle cx={cx + side * (radius * 0.5)} cy={earY - radius * 0.05} r={earW * 0.7} fill={c.baseColor} />
                <circle cx={cx + side * (radius * 0.42)} cy={earY - radius * 0.18} r={earW * 0.45} fill={c.baseColor} />
                <circle cx={cx + side * (radius * 0.6)} cy={earY - radius * 0.1} r={earW * 0.4} fill={c.baseColor} />
                <circle cx={cx + side * (radius * 0.5)} cy={earY - radius * 0.05} r={earW * 0.4} fill={c.accentColor} opacity={0.5} />
              </g>
            ))}
          </>
        );
      default: // pointed
        return (
          <>
            <path d={`M${cx - radius * 0.7},${earY + earH * 0.4} L${cx - radius * 0.42},${earY - earH * 0.5} L${cx - radius * 0.25},${earY + earH * 0.1}`} fill={c.baseColor} />
            <path d={`M${cx + radius * 0.25},${earY + earH * 0.1} L${cx + radius * 0.42},${earY - earH * 0.5} L${cx + radius * 0.7},${earY + earH * 0.4}`} fill={c.baseColor} />
            <path d={`M${cx - radius * 0.62},${earY + earH * 0.2} L${cx - radius * 0.42},${earY - earH * 0.25} L${cx - radius * 0.3},${earY + earH * 0.05}`} fill={c.accentColor} opacity={0.6} />
            <path d={`M${cx + radius * 0.3},${earY + earH * 0.05} L${cx + radius * 0.42},${earY - earH * 0.25} L${cx + radius * 0.62},${earY + earH * 0.2}`} fill={c.accentColor} opacity={0.6} />
          </>
        );
    }
  }

  // Accessory
  function renderAccessory() {
    const topY = cy - radius * 0.9;
    switch (c.accessory) {
      case "crown":
        return (
          <g>
            <path d={`M${cx - radius * 0.4},${topY + radius * 0.15} L${cx - radius * 0.4},${topY - radius * 0.1} L${cx - radius * 0.15},${topY + radius * 0.05} L${cx},${topY - radius * 0.2} L${cx + radius * 0.15},${topY + radius * 0.05} L${cx + radius * 0.4},${topY - radius * 0.1} L${cx + radius * 0.4},${topY + radius * 0.15} Z`}
              fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
            <circle cx={cx - radius * 0.25} cy={topY} r={radius * 0.05} fill="#f87171" />
            <circle cx={cx} cy={topY - radius * 0.15} r={radius * 0.05} fill="#4f9fff" />
            <circle cx={cx + radius * 0.25} cy={topY} r={radius * 0.05} fill="#34d399" />
          </g>
        );
      case "glasses":
        return (
          <g>
            <circle cx={cx - radius * 0.28} cy={cy - radius * 0.1} r={radius * 0.16} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={radius * 0.04} />
            <circle cx={cx + radius * 0.28} cy={cy - radius * 0.1} r={radius * 0.16} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={radius * 0.04} />
            <line x1={cx - radius * 0.12} y1={cy - radius * 0.1} x2={cx + radius * 0.12} y2={cy - radius * 0.1} stroke="rgba(255,255,255,0.7)" strokeWidth={radius * 0.04} />
            <line x1={cx - radius * 0.44} y1={cy - radius * 0.1} x2={cx - radius * 0.55} y2={cy - radius * 0.08} stroke="rgba(255,255,255,0.7)" strokeWidth={radius * 0.03} />
            <line x1={cx + radius * 0.44} y1={cy - radius * 0.1} x2={cx + radius * 0.55} y2={cy - radius * 0.08} stroke="rgba(255,255,255,0.7)" strokeWidth={radius * 0.03} />
          </g>
        );
      case "sunglasses":
        return (
          <g>
            <rect x={cx - radius * 0.48} y={cy - radius * 0.22} width={radius * 0.36} height={radius * 0.22} rx={radius * 0.06} fill="rgba(0,0,0,0.7)" />
            <rect x={cx + radius * 0.12} y={cy - radius * 0.22} width={radius * 0.36} height={radius * 0.22} rx={radius * 0.06} fill="rgba(0,0,0,0.7)" />
            <line x1={cx - radius * 0.12} y1={cy - radius * 0.11} x2={cx + radius * 0.12} y2={cy - radius * 0.11} stroke="rgba(255,255,255,0.3)" strokeWidth={radius * 0.04} />
          </g>
        );
      case "headphones":
        return (
          <g>
            <path d={`M${cx - radius * 0.55},${cy - radius * 0.3} Q${cx - radius * 0.55},${cy - radius * 0.9} ${cx},${cy - radius * 0.9} Q${cx + radius * 0.55},${cy - radius * 0.9} ${cx + radius * 0.55},${cy - radius * 0.3}`}
              fill="none" stroke={c.accentColor} strokeWidth={radius * 0.06} />
            <rect x={cx - radius * 0.65} y={cy - radius * 0.38} width={radius * 0.2} height={radius * 0.22} rx={radius * 0.05} fill={c.accentColor} />
            <rect x={cx + radius * 0.45} y={cy - radius * 0.38} width={radius * 0.2} height={radius * 0.22} rx={radius * 0.05} fill={c.accentColor} />
          </g>
        );
      case "hat":
        return (
          <g>
            <rect x={cx - radius * 0.45} y={topY - radius * 0.05} width={radius * 0.9} height={radius * 0.15} rx={radius * 0.04} fill="#1e293b" />
            <rect x={cx - radius * 0.28} y={topY - radius * 0.45} width={radius * 0.56} height={radius * 0.42} rx={radius * 0.06} fill="#1e293b" />
            <rect x={cx - radius * 0.28} y={topY - radius * 0.08} width={radius * 0.56} height={radius * 0.06} fill={c.accentColor} />
          </g>
        );
      case "bow":
        return (
          <g>
            <path d={`M${cx - radius * 0.3},${topY + radius * 0.1} C${cx - radius * 0.4},${topY - radius * 0.2} ${cx - radius * 0.1},${topY - radius * 0.05} ${cx},${topY + radius * 0.05}`} fill={c.accentColor} />
            <path d={`M${cx},${topY + radius * 0.05} C${cx + radius * 0.1},${topY - radius * 0.05} ${cx + radius * 0.4},${topY - radius * 0.2} ${cx + radius * 0.3},${topY + radius * 0.1}`} fill={c.accentColor} />
            <circle cx={cx} cy={topY + radius * 0.05} r={radius * 0.07} fill={c.accentColor} opacity={0.8} />
          </g>
        );
      case "halo":
        return (
          <ellipse cx={cx} cy={topY - radius * 0.05} rx={radius * 0.38} ry={radius * 0.1}
            fill="none" stroke="#fbbf24" strokeWidth={radius * 0.06}
            style={{ filter: "drop-shadow(0 0 4px #fbbf2480)" }} />
        );
      default:
        return null;
    }
  }

  // Whiskers
  function renderWhiskers() {
    const wY = cy + radius * 0.05;
    const wLen = radius * 0.38;
    return (
      <>
        <line x1={cx - radius * 0.08} y1={wY - radius * 0.04} x2={cx - radius * 0.08 - wLen} y2={wY - radius * 0.1} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
        <line x1={cx - radius * 0.08} y1={wY} x2={cx - radius * 0.08 - wLen} y2={wY} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
        <line x1={cx - radius * 0.08} y1={wY + radius * 0.04} x2={cx - radius * 0.08 - wLen} y2={wY + radius * 0.1} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
        <line x1={cx + radius * 0.08} y1={wY - radius * 0.04} x2={cx + radius * 0.08 + wLen} y2={wY - radius * 0.1} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
        <line x1={cx + radius * 0.08} y1={wY} x2={cx + radius * 0.08 + wLen} y2={wY} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
        <line x1={cx + radius * 0.08} y1={wY + radius * 0.04} x2={cx + radius * 0.08 + wLen} y2={wY + radius * 0.1} stroke="rgba(255,255,255,0.4)" strokeWidth={radius * 0.02} strokeLinecap="round" />
      </>
    );
  }

  // Pattern overlay
  function renderPattern() {
    switch (c.pattern) {
      case "dots":
        return (
          <g opacity={0.15} clipPath={`url(#face_${size})`}>
            {[-2, -1, 0, 1, 2].flatMap((row) =>
              [-2, -1, 0, 1, 2].map((col) => (
                <circle key={`${row}_${col}`}
                  cx={cx + col * radius * 0.28}
                  cy={cy + row * radius * 0.28}
                  r={radius * 0.04}
                  fill="rgba(255,255,255,0.8)" />
              ))
            )}
          </g>
        );
      case "stars":
        return (
          <g opacity={0.15} clipPath={`url(#face_${size})`}>
            {[-1, 0, 1].flatMap((row) =>
              [-1, 0, 1].map((col) => (
                <text key={`${row}_${col}`}
                  x={cx + col * radius * 0.4}
                  y={cy + row * radius * 0.4 + 5}
                  textAnchor="middle"
                  fontSize={radius * 0.12}
                  fill="rgba(255,255,255,0.8)">★</text>
              ))
            )}
          </g>
        );
      case "waves":
        return (
          <g opacity={0.12} clipPath={`url(#face_${size})`}>
            {[-2, -1, 0, 1, 2].map((row) => (
              <path key={row}
                d={`M${cx - radius},${cy + row * radius * 0.2} Q${cx - radius * 0.5},${cy + row * radius * 0.2 - radius * 0.08} ${cx},${cy + row * radius * 0.2} Q${cx + radius * 0.5},${cy + row * radius * 0.2 + radius * 0.08} ${cx + radius},${cy + row * radius * 0.2}`}
                fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={radius * 0.025} />
            ))}
          </g>
        );
      default:
        return null;
    }
  }

  const bgOpacity = c.backgroundStyle === "dark" ? 1 : 0.9;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={bgId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={c.baseColor} stopOpacity={bgOpacity} />
          <stop offset="100%" stopColor={c.backgroundStyle === "dark" ? "#0a0a16" : c.accentColor} stopOpacity={bgOpacity} />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation={size * 0.04} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id={`face_${size}`}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={cx * 0.95}
        fill={c.backgroundStyle === "solid" ? c.baseColor : c.backgroundStyle === "dark" ? "#0d0d1a" : `url(#${bgId})`}
      />

      {/* Glow effect */}
      {c.backgroundStyle === "glow" && (
        <circle cx={cx} cy={cy} r={cx * 0.95}
          fill={c.baseColor} opacity={0.3}
          style={{ filter: `blur(${size * 0.05}px)` }} />
      )}

      {/* Ears (behind face) */}
      {renderEars()}

      {/* Face */}
      <circle cx={cx} cy={cy} r={radius} fill={`url(#${bgId})`} />

      {/* Pattern overlay */}
      {renderPattern()}

      {/* Cheeks */}
      <ellipse cx={cx - radius * 0.5} cy={cy + radius * 0.2} rx={radius * 0.18} ry={radius * 0.1}
        fill={c.accentColor} opacity={0.35} />
      <ellipse cx={cx + radius * 0.5} cy={cy + radius * 0.2} rx={radius * 0.18} ry={radius * 0.1}
        fill={c.accentColor} opacity={0.35} />

      {/* Whiskers */}
      {renderWhiskers()}

      {/* Eyes */}
      {renderEyes()}

      {/* Nose */}
      <path d={`M${cx - radius * 0.06},${cy + radius * 0.06} L${cx},${cy + radius * 0.12} L${cx + radius * 0.06},${cy + radius * 0.06}`}
        fill={c.accentColor} opacity={0.8} />

      {/* Mouth */}
      {renderMouth()}

      {/* Accessory */}
      {renderAccessory()}
    </svg>
  );
}

// ─── Builder UI ───────────────────────────────────────────────────────────────

interface CloneAvatarBuilderProps {
  initialConfig?: CloneAvatarConfig;
  cloneName?: string;
  onSave: (config: CloneAvatarConfig) => Promise<void>;
}

type BuilderSection = "colors" | "face" | "accessories" | "background";

export function CloneAvatarBuilder({
  initialConfig = DEFAULT_AVATAR,
  cloneName = "Your Clone",
  onSave,
}: CloneAvatarBuilderProps) {
  const [config, setConfig] = useState<CloneAvatarConfig>(initialConfig);
  const [activeSection, setActiveSection] = useState<BuilderSection>("colors");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = useCallback(<K extends keyof CloneAvatarConfig>(
    key: K,
    value: CloneAvatarConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setConfig(DEFAULT_AVATAR);
    setSaved(false);
  }

  const SECTIONS: { id: BuilderSection; label: string; icon: string }[] = [
    { id: "colors",      label: "Colors",      icon: "🎨" },
    { id: "face",        label: "Face",         icon: "😺" },
    { id: "accessories", label: "Accessories",  icon: "✨" },
    { id: "background",  label: "Background",   icon: "🖼️" },
  ];

  return (
    <div className="space-y-6">
      {/* Preview + name */}
      <div className="flex items-center gap-6">
        {/* Live preview */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/[0.12] shadow-[0_0_30px_rgba(0,0,0,0.4)]">
            <CloneAvatarSVG config={config} size={128} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#080811] border-2 border-white/[0.1] flex items-center justify-center text-base">
            🐱
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-bold text-white">{cloneName}</p>
          <p className="text-[12px] text-white/40 mt-0.5">Your Clone's appearance</p>
          <p className="text-[11px] text-white/25 mt-3 leading-relaxed">
            Customize how your Clone looks across the platform. Changes are reflected everywhere your Clone appears.
          </p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
              activeSection === s.id ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}>
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">

        {/* Colors */}
        {activeSection === "colors" && (
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Base Color</p>
              <div className="flex flex-wrap gap-2">
                {BASE_COLORS.map((color) => (
                  <button key={color.value} onClick={() => update("baseColor", color.value)}
                    title={color.label}
                    className={cn("w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      config.baseColor === color.value ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "border-transparent"
                    )}
                    style={{ background: color.value }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button key={color.value} onClick={() => update("accentColor", color.value)}
                    title={color.label}
                    className={cn("w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      config.accentColor === color.value ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "border-transparent"
                    )}
                    style={{ background: color.value }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Face */}
        {activeSection === "face" && (
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Eye Style</p>
              <div className="grid grid-cols-3 gap-2">
                {EYE_STYLES.map((style) => (
                  <button key={style.value} onClick={() => update("eyeStyle", style.value)}
                    className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-medium transition-all",
                      config.eyeStyle === style.value ? "border-[#4f9fff]/40 bg-[#4f9fff]/10 text-[#4f9fff]" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}>
                    <span>{style.emoji}</span>
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Ear Style</p>
              <div className="grid grid-cols-4 gap-2">
                {EAR_STYLES.map((style) => (
                  <button key={style.value} onClick={() => update("earStyle", style.value)}
                    className={cn("px-3 py-2 rounded-xl border text-[12px] font-medium transition-all",
                      config.earStyle === style.value ? "border-[#4f9fff]/40 bg-[#4f9fff]/10 text-[#4f9fff]" : "border-white/[0.08] text-white/50 hover:text-white/80"
                    )}>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Expression</p>
              <div className="grid grid-cols-3 gap-2">
                {EXPRESSIONS.map((expr) => (
                  <button key={expr.value} onClick={() => update("expression", expr.value)}
                    className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-medium transition-all",
                      config.expression === expr.value ? "border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}>
                    <span>{expr.emoji}</span>
                    <span>{expr.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Accessories */}
        {activeSection === "accessories" && (
          <div>
            <p className="text-[12px] font-semibold text-white/50 mb-3">Accessory</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCESSORIES.map((acc) => (
                <button key={acc.value} onClick={() => update("accessory", acc.value)}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all",
                    config.accessory === acc.value ? "border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#22d3ee]" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  )}>
                  <span className="text-xl">{acc.emoji}</span>
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background */}
        {activeSection === "background" && (
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Background Style</p>
              <div className="grid grid-cols-2 gap-2">
                {BG_STYLES.map((style) => (
                  <button key={style.value} onClick={() => update("backgroundStyle", style.value)}
                    className={cn("px-4 py-3 rounded-xl border text-[13px] font-medium transition-all",
                      config.backgroundStyle === style.value ? "border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fbbf24]" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/50 mb-3">Pattern Overlay</p>
              <div className="grid grid-cols-2 gap-2">
                {PATTERNS.map((pattern) => (
                  <button key={pattern.value} onClick={() => update("pattern", pattern.value)}
                    className={cn("px-4 py-3 rounded-xl border text-[13px] font-medium transition-all",
                      config.pattern === pattern.value ? "border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fbbf24]" : "border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}>
                    {pattern.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview row — 3 sizes */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
          Preview at different sizes
        </p>
        <div className="flex items-end gap-4">
          {[32, 48, 64, 96].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <div className="rounded-full overflow-hidden border border-white/[0.1]" style={{ width: s, height: s }}>
                <CloneAvatarSVG config={config} size={s} />
              </div>
              <span className="text-[9px] text-white/25">{s}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.07]">
        <button onClick={handleReset}
          className="px-4 py-2 rounded-[9px] border border-white/[0.1] text-[13px] text-white/40 hover:text-white/70 hover:border-white/20 transition-all">
          Reset
        </button>
        <button onClick={handleSave} disabled={saving}
          className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {saving ? (
            <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : saved ? (
            "✓ Saved!"
          ) : (
            "Save Avatar"
          )}
        </button>
      </div>
    </div>
  );
}
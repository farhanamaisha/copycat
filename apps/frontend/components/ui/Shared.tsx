import type { ReactNode } from "react";

/* ─────────────────────────────────────────────
   CatSVG — the cat-themed AI Clone face icon
───────────────────────────────────────────── */
export function CatSVG({
  size = 100,
  eyeColors = ["#4f9fff", "#a78bfa"] as [string, string],
}: {
  size?: number;
  eyeColors?: [string, string];
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="18,42 28,18 42,42"
        fill="#1e1e4a"
        stroke="rgba(79,159,255,0.5)"
        strokeWidth="1.5"
      />
      <polygon
        points="58,42 72,18 82,42"
        fill="#1e1e4a"
        stroke="rgba(167,139,250,0.5)"
        strokeWidth="1.5"
      />
      <polygon points="22,40 28,24 38,40" fill="rgba(167,139,250,0.2)" />
      <polygon points="62,40 72,24 78,40" fill="rgba(79,159,255,0.2)" />
      <ellipse
        cx="50"
        cy="60"
        rx="32"
        ry="28"
        fill="#12123a"
        stroke="rgba(79,159,255,0.3)"
        strokeWidth="1"
      />
      <ellipse cx="38" cy="57" rx="7" ry="8" fill="#0d0d2b" />
      <ellipse cx="62" cy="57" rx="7" ry="8" fill="#0d0d2b" />
      <ellipse cx="38" cy="57" rx="5" ry="6" fill={eyeColors[0]} opacity="0.9" />
      <ellipse cx="62" cy="57" rx="5" ry="6" fill={eyeColors[1]} opacity="0.9" />
      <ellipse cx="38" cy="57" rx="2.5" ry="4" fill="#020212" />
      <ellipse cx="62" cy="57" rx="2.5" ry="4" fill="#020212" />
      <circle cx="40" cy="55" r="1.5" fill="white" opacity="0.9" />
      <circle cx="64" cy="55" r="1.5" fill="white" opacity="0.9" />
      <ellipse cx="50" cy="68" rx="3" ry="2" fill="rgba(167,139,250,0.7)" />
      <path
        d="M47 70 Q50 73 53 70"
        stroke="rgba(240,240,255,0.4)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="18" y1="66" x2="40" y2="68" stroke="rgba(79,159,255,0.3)" strokeWidth="0.8" />
      <line x1="18" y1="70" x2="40" y2="70" stroke="rgba(79,159,255,0.3)" strokeWidth="0.8" />
      <line x1="60" y1="68" x2="82" y2="66" stroke="rgba(167,139,250,0.3)" strokeWidth="0.8" />
      <line x1="60" y1="70" x2="82" y2="70" stroke="rgba(167,139,250,0.3)" strokeWidth="0.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Stat — small number + label used in hero stat row
───────────────────────────────────────────── */
export function Stat({
  num,
  label,
  color,
}: {
  num: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{num}</div>
      <div className="text-xs text-white/30 mt-1 tracking-wide">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Trait — small pill used on the Clone preview card
───────────────────────────────────────────── */
export function Trait({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.14] text-white/60 bg-white/[0.04]">
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ProgressBar — animated training progress bar
───────────────────────────────────────────── */
export function ProgressBar({
  label,
  value,
  mounted,
  gradient,
}: {
  label: string;
  value: number;
  mounted: boolean;
  gradient: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center text-[13px] text-white/60 mb-2">
        <span>{label}</span>
        <span className="text-[#4f9fff] font-semibold">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-[0_0_10px_rgba(79,159,255,0.4)] transition-all duration-1000 ease-out`}
          style={{ width: mounted ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ChatBubble — single message in the live chat preview
───────────────────────────────────────────── */
export function ChatBubble({
  from,
  text,
  meta,
}: {
  from: "clone" | "user";
  text: ReactNode;
  meta: string;
}) {
  const isClone = from === "clone";
  return (
    <div className={isClone ? "self-start" : "self-end ml-auto"}>
      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] ${
          isClone
            ? "bg-[#4f9fff]/10 border border-[#4f9fff]/20 rounded-bl-[4px]"
            : "bg-white/[0.04] border border-white/[0.08] rounded-br-[4px] text-white/60 ml-auto"
        }`}
      >
        {text}
      </div>
      <p className="text-[11px] text-white/30 mt-1">{meta}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ActivityRow — label/value row in the activity panel
───────────────────────────────────────────── */
export function ActivityRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-white/60">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

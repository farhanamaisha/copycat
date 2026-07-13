// apps/frontend/components/common/Badge.tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: import("react").ReactNode;
  variant?: "blue" | "purple" | "cyan" | "green" | "yellow" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  blue: "bg-[#4f9fff]/10 text-[#4f9fff] border-[#4f9fff]/20",
  purple: "bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20",
  cyan: "bg-[#22d3ee]/10 text-[#22d3ee] border-[#22d3ee]/20",
  green: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  yellow: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  ghost: "bg-white/[0.06] text-white/50 border-white/[0.08]",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "ghost",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

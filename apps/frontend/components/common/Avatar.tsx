// apps/frontend/components/common/Avatar.tsx
"use client";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isClone?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

const onlineDotSize = {
  xs: "w-1.5 h-1.5 -bottom-0.5 -right-0.5",
  sm: "w-2 h-2 bottom-0 right-0",
  md: "w-2.5 h-2.5 bottom-0 right-0",
  lg: "w-3 h-3 bottom-0.5 right-0.5",
  xl: "w-4 h-4 bottom-1 right-1",
};

export function Avatar({
  src,
  name,
  size = "md",
  isClone = false,
  isOnline,
  className,
}: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold overflow-hidden",
          sizeMap[size],
          isClone
            ? "bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border border-[#4f9fff]/30"
            : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : isClone ? (
          <span className="select-none">🐱</span>
        ) : (
          <span className="text-white/80 select-none">{getInitials(name)}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute border-2 border-[#080811] rounded-full",
            onlineDotSize[size],
            isOnline ? "bg-emerald-400" : "bg-white/20"
          )}
        />
      )}
    </div>
  );
}

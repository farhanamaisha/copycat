// apps/frontend/components/common/Icons.tsx
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const Icons = {
  Home: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  Feed: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <rect x="3" y="3" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="11" height="4" rx="1" />
      <rect x="3" y="17" width="14" height="4" rx="1" />
    </svg>
  ),
  Messages: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Clowders: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" />
      <path d="M21 21v-2a4 4 0 00-3-3.85" />
    </svg>
  ),
  Explore: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Notifications: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Train: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Memory: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Settings: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Logout: ({ className, size = 20 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Heart: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  HeartFilled: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Comment: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Repost: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  Bookmark: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  BookmarkFilled: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  More: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  Plus: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: ({ className, size = 18 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ChevronRight: ({ className, size = 16 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Sparkle: ({ className, size = 16 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  ),
  Brain: ({ className, size = 16 }: IconProps) => (
    <svg {...base(size)} className={className} stroke="currentColor">
      <path d="M12 5a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 00-3 3 3 3 0 003 3 3 3 0 003 3 3 3 0 003-3" />
      <path d="M12 5a3 3 0 013-3 3 3 0 013 3 3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3 3 3 3 0 01-3-3" />
      <path d="M6 14a3 3 0 00-3 3 3 3 0 003 3" />
      <path d="M18 14a3 3 0 013 3 3 3 0 01-3 3" />
      <line x1="12" y1="14" x2="12" y2="21" />
    </svg>
  ),
};

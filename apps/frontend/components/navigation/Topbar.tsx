// apps/frontend/components/navigation/Topbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icons } from "@/components/common/Icons";
import { Avatar } from "@/components/common/Avatar";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { useCurrentUser, useNotifications } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { user, clone } = useCurrentUser();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-white/[0.06] bg-[#080811]/90 backdrop-blur-xl">
      {/* Search */}
      <div className="flex items-center gap-2 w-[280px] h-8 px-3 rounded-[9px] border border-white/[0.08] bg-white/[0.03] text-white/30 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all cursor-text">
        <Icons.Search size={14} className="shrink-0" />
        <span className="text-[13px] select-none">Search Copy Cat…</span>
        <span className="ml-auto text-[11px] border border-white/[0.1] rounded px-1 py-0.5">⌘K</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Write post */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-[9px] bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[#4f9fff] text-[12px] font-medium hover:bg-[#4f9fff]/20 transition-all">
          <Icons.Plus size={14} />
          Post
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications((v: boolean) => !v);
              setShowUserMenu(false);
            }}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-[9px] transition-all",
              showNotifications
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
            )}
          >
            <Icons.Notifications size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#4f9fff] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-10 right-0 w-[360px] z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <NotificationsPanel />
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setShowUserMenu((v: boolean) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2.5 h-8 rounded-[9px] hover:bg-white/[0.06] transition-all"
          >
            <div className="relative">
              <Avatar name={user?.displayName ?? "Me"} size="xs" />
              <Avatar
                name={clone?.name ?? "Clone"}
                isClone
                size="xs"
                isOnline={clone?.isOnline}
                className="absolute -bottom-1.5 -right-1.5 scale-75 ring-2 ring-[#080811]"
              />
            </div>
            <span className="hidden sm:block text-[12px] font-medium text-white/70 max-w-[80px] truncate">
              {user?.displayName}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute top-10 right-0 w-[200px] z-50 rounded-xl border border-white/[0.08] bg-[#0a0a14]/98 backdrop-blur-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="px-3 py-2.5 border-b border-white/[0.06]">
                <p className="text-[13px] font-semibold text-white">{user?.displayName}</p>
                <p className="text-[11px] text-white/40">@{user?.username}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "Profile", href: ROUTES.PROFILE },
                  { label: "Settings", href: ROUTES.SETTINGS },
                  { label: "Train Clone", href: ROUTES.TRAIN_CLONE },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center px-3 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
                    onClick={() => setShowUserMenu(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="my-1 border-t border-white/[0.06]" />
                <Link
                  href={ROUTES.SIGN_IN}
                  className="flex items-center px-3 py-2 rounded-lg text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-400/[0.06] transition-all"
                  onClick={() => setShowUserMenu(false)}
                >
                  Log out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

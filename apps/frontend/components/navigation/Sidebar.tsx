// apps/frontend/components/navigation/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/common/Avatar";
import { Icons } from "@/components/common/Icons";
import { ROUTES } from "@/constants";
import { useCurrentUser, useNotifications } from "@/hooks/useDashboard";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: ROUTES.DASHBOARD, Icon: Icons.Home },
  { id: "feed", label: "Feed", href: ROUTES.FEED, Icon: Icons.Feed },
  { id: "messages", label: "Messages", href: ROUTES.MESSAGES, Icon: Icons.Messages, badge: 3 },
  { id: "clowders", label: "Clowders", href: ROUTES.CLOWDERS, Icon: Icons.Clowders },
  { id: "explore", label: "Explore", href: ROUTES.EXPLORE, Icon: Icons.Explore },
  { id: "notifications", label: "Notifications", href: ROUTES.NOTIFICATIONS, Icon: Icons.Notifications },
] as const;

const BOTTOM_NAV = [
  { id: "train", label: "Train Clone", href: ROUTES.TRAIN_CLONE, Icon: Icons.Train },
  { id: "memory", label: "Clone Memory", href: ROUTES.CLONE_MEMORY, Icon: Icons.Memory },
  { id: "settings", label: "Settings", href: ROUTES.SETTINGS, Icon: Icons.Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clone, isLoading } = useCurrentUser();
  const { unreadCount } = useNotifications();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-white/[0.06] bg-[#080811]/95 backdrop-blur-xl z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-base shadow-[0_0_14px_rgba(79,159,255,0.4)]">
          🐱
        </div>
        <span className="text-[15px] font-bold tracking-tight text-white">
          Copy Cat
        </span>
      </div>

      {/* User + Clone profile card */}
      <div className="mx-3 mt-4 p-3 rounded-xl border border-white/[0.07] bg-white/[0.03]">
        {isLoading ? (
          <div className="flex gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <div className="h-3 bg-white/10 rounded w-24" />
              <div className="h-2.5 bg-white/10 rounded w-16" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar name={user?.displayName ?? "User"} size="sm" />
                <Avatar
                  name={clone.name}
                  size="xs"
                  isClone
                  isOnline={clone.isOnline}
                  className="absolute -bottom-1 -right-1 ring-2 ring-[#080811]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">
                  {user?.displayName ?? "user"}
                </p>
                <p className="text-[11px] text-white/40 truncate">
                  @{user?.username?? "user"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/40">Clone: {clone.name}</span>
                <span className="text-[#4f9fff] font-semibold">
                  Lv.{clone.level}
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4f9fff] to-[#a78bfa] transition-all duration-700"
                  style={{ width: `${clone.personalityProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-white/30">
                {clone.personalityProgress}% trained
              </p>
            </div>
          </>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 mt-4 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, href, Icon, ...rest }) => {
          const badge = "badge" in rest ? rest.badge : undefined;
          const isNotifications = id === "notifications";
          const resolvedBadge = isNotifications ? unreadCount : badge;
          const isActive = pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={id}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#4f9fff]/10 text-[#4f9fff] shadow-[inset_0_0_0_1px_rgba(79,159,255,0.2)]"
                  : "text-white/50 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-[#4f9fff]" : "text-white/40 group-hover:text-white/70"
                )}
              />
              <span className="flex-1">{label}</span>
              {resolvedBadge != null && resolvedBadge > 0 && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-[#4f9fff] text-white">
                  {resolvedBadge > 99 ? "99+" : resolvedBadge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-white/[0.06]" />

        {BOTTOM_NAV.map(({ id, label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={id}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#a78bfa]/10 text-[#a78bfa]"
                  : "text-white/40 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0",
                  isActive ? "text-[#a78bfa]" : "text-white/30 group-hover:text-white/60"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={() => router.push(ROUTES.SIGN_IN)}
          className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-white/30 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200"
        >
          <Icons.Logout
            size={18}
            className="shrink-0 text-white/20 group-hover:text-red-400 transition-colors"
          />
          Log out
        </button>
      </div>
    </aside>
  );
}

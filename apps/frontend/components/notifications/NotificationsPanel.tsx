// apps/frontend/components/notifications/NotificationsPanel.tsx
"use client";

import { Avatar } from "@/components/common/Avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useNotifications } from "@/hooks/useDashboard";
import type { Notification } from "@/types";

const TYPE_CONFIG: Record<
  string,
  { emoji: string; color: string }
> = {
  like: { emoji: "❤️", color: "#ef4444" },
  comment: { emoji: "💬", color: "#4f9fff" },
  follow: { emoji: "👤", color: "#a78bfa" },
  clone_message: { emoji: "🐱", color: "#22d3ee" },
  training_complete: { emoji: "⚡", color: "#fbbf24" },
  clowder_invite: { emoji: "🐾", color: "#a78bfa" },
  mention: { emoji: "@", color: "#4f9fff" },
  system: { emoji: "🔔", color: "#6b7280" },
};

export function NotificationsPanel() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a14]/98 backdrop-blur-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-white">Notifications</p>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-[#4f9fff] text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-white/[0.04]">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-4xl mb-2">🔔</p>
            <p className="text-[13px] text-white/40">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n: Notification) => (
            <NotificationRow key={n.id} notification={n} />
          ))
        )}
      </div>
    </div>
  );
}

function NotificationRow({ notification }: { notification: Notification }) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer",
        !notification.isRead && "bg-[#4f9fff]/[0.03]"
      )}
    >
      <div className="relative shrink-0 mt-0.5">
        {notification.actor ? (
          <Avatar
            name={notification.actor.displayName}
            src={notification.actor.avatarUrl}
            size="sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-sm">
            {config.emoji}
          </div>
        )}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#080811] border border-white/[0.08] flex items-center justify-center text-[9px]">
          {config.emoji}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/80 leading-snug">
          {notification.message}
        </p>
        <p className="text-[11px] text-white/30 mt-0.5">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {!notification.isRead && (
        <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#4f9fff]" />
      )}
    </div>
  );
}

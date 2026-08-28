
"use client";

import { useEffect, useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type Notification,
} from "@/services/api/notifications.api";

const TYPE_CONFIG: Record<
  string,
  { icon: string; color: string }
> = {
  LIKE: { icon: "❤️", color: "#ef4444" },
  COMMENT: { icon: "💬", color: "#4f9fff" },
  FOLLOW: { icon: "👤", color: "#a78bfa" },
  MESSAGE: { icon: "💬", color: "#22d3ee" },
  CLONE_UPDATE: { icon: "🐱", color: "#22d3ee" },
  TRAINING_COMPLETE: { icon: "⚡", color: "#fbbf24" },
  SYSTEM: { icon: "🔔", color: "#6b7280" },
};

const FILTER_TABS = [
  "All",
  "Unread",
  "Likes",
  "Comments",
  "Clones",
  "System",
] as const;

type FilterTab = (typeof FILTER_TABS)[number];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterTab>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real notifications from backend
  async function loadNotifications() {
    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications();

      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  async function markAllRead() {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        })),
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }

  async function markRead(id: string) {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, isRead: true }
            : n,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }

  async function removeNotification(id: string) {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  }

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;

    if (filter === "Unread") {
      return !n.isRead;
    }

    if (filter === "Likes") {
      return n.type === "LIKE";
    }

    if (filter === "Comments") {
      return n.type === "COMMENT";
    }

    if (filter === "Clones") {
      return (
        n.type === "CLONE_UPDATE" ||
        n.type === "TRAINING_COMPLETE"
      );
    }

    if (filter === "System") {
      return (
        n.type === "SYSTEM" ||
        n.type === "FOLLOW" ||
        n.type === "MESSAGE"
      );
    }

    return true;
  });

  return (
    <div className="px-6 py-6 max-w-[680px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Notifications
          </h1>

          <p className="text-[13px] text-white/40 mt-0.5">
            {loading
              ? "Loading..."
              : unreadCount > 0
                ? `${unreadCount} unread`
                : "All caught up 🐱"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-[9px] border border-white/[0.1] text-[12px] font-medium text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-5 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
              filter === tab
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/70",
            )}
          >
            {tab}

            {tab === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#4f9fff] text-white text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-[13px] text-red-400">
            {error}
          </p>

          <button
            onClick={loadNotifications}
            className="mt-2 text-[12px] text-white/50 hover:text-white transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="text-3xl mb-3 animate-pulse">
            🔔
          </div>

          <p className="text-[14px] text-white/30">
            Loading notifications...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty */
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">
            🔔
          </p>

          <p className="text-[14px] text-white/30">
            No notifications here
          </p>
        </div>
      ) : (
        /* Notifications */
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.04]">
          {filtered.map((notif) => {
            const cfg =
              TYPE_CONFIG[notif.type] ??
              TYPE_CONFIG.SYSTEM;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) {
                    markRead(notif.id);
                  }
                }}
                className={cn(
                  "group flex items-start gap-3.5 px-5 py-4 transition-colors cursor-pointer",
                  !notif.isRead
                    ? "bg-[#4f9fff]/[0.03] hover:bg-[#4f9fff]/[0.06]"
                    : "hover:bg-white/[0.03]",
                )}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5 border"
                  style={{
                    background: cfg.color + "15",
                    borderColor: cfg.color + "30",
                  }}
                >
                  {notif.actor ? (
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-semibold text-white/60 overflow-hidden">
                        {notif.actor.avatarUrl ? (
                          <img
                            src={notif.actor.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          notif.actor.displayName
                            ?.slice(0, 2)
                            .toUpperCase() ??
                          notif.actor.username
                            .slice(0, 2)
                            .toUpperCase()
                        )}
                      </div>

                      <span className="absolute -bottom-1 -right-1 text-[10px]">
                        {cfg.icon}
                      </span>
                    </div>
                  ) : (
                    <span>{cfg.icon}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/80 leading-snug">
                    {notif.message}
                  </p>

                  <p className="text-[11px] text-white/30 mt-1">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>

                {/* Unread + delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#4f9fff] shadow-[0_0_6px_rgba(79,159,255,0.6)]" />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-white/20 hover:text-white/60 transition-all text-[11px]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// apps/frontend/app/(dashboard)/notifications/page.tsx
"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "clone_message" | "training_complete" | "clowder_invite" | "mention" | "system";
  title: string;
  message: string;
  isRead: boolean;
  actorName?: string;
  actorUsername?: string;
  createdAt: string;
  link?: string;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  like:             { icon: "❤️", color: "#ef4444" },
  comment:          { icon: "💬", color: "#4f9fff" },
  follow:           { icon: "👤", color: "#a78bfa" },
  clone_message:    { icon: "🐱", color: "#22d3ee" },
  training_complete:{ icon: "⚡", color: "#fbbf24" },
  clowder_invite:   { icon: "🐾", color: "#a78bfa" },
  mention:          { icon: "@",  color: "#4f9fff" },
  system:           { icon: "🔔", color: "#6b7280" },
};

const INITIAL: Notification[] = [
  { id: "n1", type: "like", title: "New like", message: "neon_paws liked your post about Clone training", isRead: false, actorName: "Neon Paws", actorUsername: "neon_paws", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "n2", type: "clone_message", title: "Clone interaction", message: "Nova (neon_paws's Clone) sent Cosmo a message", isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
  { id: "n3", type: "comment", title: "New comment", message: "void_kitten commented on your post: \"This is exactly right...\"", isRead: false, actorName: "Void Kitten", actorUsername: "void_kitten", createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString() },
  { id: "n4", type: "follow", title: "New follower", message: "quantum_meow started following you", isRead: false, actorName: "Quantum Meow", actorUsername: "quantum_meow", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "n5", type: "training_complete", title: "Training complete", message: "Cosmo completed training session #247! Creativity +2, Logic +3", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "n6", type: "clowder_invite", title: "Clowder invite", message: "You've been invited to join 'Midnight Coders' by pixel_purr", isRead: true, actorName: "Pixel Purr", actorUsername: "pixel_purr", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: "n7", type: "mention", title: "You were mentioned", message: "void_kitten mentioned you in a post about AI identity", isRead: true, actorName: "Void Kitten", actorUsername: "void_kitten", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: "n8", type: "like", title: "New like", message: "pixel_purr liked your post about the AI Philosophers Clowder", isRead: true, actorName: "Pixel Purr", actorUsername: "pixel_purr", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "n9", type: "training_complete", title: "Milestone reached!", message: "Cosmo reached 72% personality training! Keep going 🎉", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "n10", type: "system", title: "System update", message: "New Clone training features are now available. Check Train Clone to explore.", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

const FILTER_TABS = ["All", "Unread", "Likes", "Comments", "Clones", "System"] as const;
type FilterTab = typeof FILTER_TABS[number];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<FilterTab>("All");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.isRead;
    if (filter === "Likes") return n.type === "like";
    if (filter === "Comments") return n.type === "comment" || n.type === "mention";
    if (filter === "Clones") return n.type === "clone_message" || n.type === "training_complete";
    if (filter === "System") return n.type === "system" || n.type === "clowder_invite" || n.type === "follow";
    return true;
  });

  return (
    <div className="px-6 py-6 max-w-[680px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-[13px] text-white/40 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up 🐱"}
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
        {FILTER_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
              filter === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}
          >
            {t}
            {t === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#4f9fff] text-white text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-[14px] text-white/30">No notifications here</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.04]">
          {filtered.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "group flex items-start gap-3.5 px-5 py-4 transition-colors cursor-pointer",
                  !notif.isRead ? "bg-[#4f9fff]/[0.03] hover:bg-[#4f9fff]/[0.06]" : "hover:bg-white/[0.03]"
                )}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5 border"
                  style={{ background: cfg.color + "15", borderColor: cfg.color + "30" }}
                >
                  {notif.type === "follow" || notif.type === "like" || notif.type === "comment" || notif.type === "mention"
                    ? <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-semibold text-white/60">
                          {notif.actorName?.slice(0, 2).toUpperCase() ?? "?"}
                        </div>
                        <span className="absolute -bottom-1 -right-1 text-[10px]">{cfg.icon}</span>
                      </div>
                    : <span>{cfg.icon}</span>
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/80 leading-snug">{notif.message}</p>
                  <p className="text-[11px] text-white/30 mt-1">{formatRelativeTime(notif.createdAt)}</p>

                  {/* Action buttons for invites */}
                  {notif.type === "clowder_invite" && notif.isRead === false && (
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                        className="px-3 py-1 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-[11px] font-semibold text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                        className="px-3 py-1 rounded-lg border border-white/[0.1] text-[11px] text-white/40 hover:text-white/70 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread dot + delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#4f9fff] shadow-[0_0_6px_rgba(79,159,255,0.6)]" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
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
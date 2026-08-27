// apps/frontend/app/(dashboard)/connections/page.tsx
"use client";

import { useState, useEffect } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  getConnections,
  getPendingRequests,
  respondToConnection,
  removeConnection,
  type Connection,
  type PendingRequest,
} from "@/services/api/social.api";

const TABS = ["Connections", "Requests", "Sent"] as const;
type Tab = typeof TABS[number];

export default function ConnectionsPage() {
  const [tab, setTab] = useState<Tab>("Connections");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [received, setReceived] = useState<PendingRequest[]>([]);
  const [sent, setSent] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [connRes, pendingRes] = await Promise.all([
          getConnections(),
          getPendingRequests(),
        ]);
        setConnections(connRes.data);
        setReceived(pendingRes.data.received);
        setSent(pendingRes.data.sent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleRespond(connectionId: string, status: 'ACCEPTED' | 'REJECTED') {
    try {
      await respondToConnection(connectionId, status);
      setReceived((prev) => prev.filter((r) => r.id !== connectionId));
      if (status === 'ACCEPTED') {
        // Refresh connections list
        const res = await getConnections();
        setConnections(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    }
  }

  async function handleRemove(connectionId: string) {
    try {
      await removeConnection(connectionId);
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove connection.');
    }
  }

  const pendingCount = received.length;

  return (
    <div className="px-6 py-6 max-w-[700px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
        <p className="text-[13px] text-white/40 mt-1">
          Your close connections and pending requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Connections", value: connections.length, color: "#4f9fff" },
          { label: "Pending",     value: received.length,    color: "#fbbf24" },
          { label: "Sent",        value: sent.length,        color: "#a78bfa" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
            <p className="text-[22px] font-bold" style={{ color }}>{value}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] flex items-center justify-between">
          <p className="text-[13px] text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 ml-3 text-[11px]">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("flex-1 py-1.5 rounded-[8px] text-[13px] font-medium transition-all relative",
              tab === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/40 hover:text-white/70"
            )}>
            {t}
            {t === "Requests" && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#fbbf24] text-[#080811] text-[9px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white/[0.08]" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-32 rounded bg-white/[0.08]" />
                <div className="h-3 w-20 rounded bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Connections tab */}
          {tab === "Connections" && (
            <div className="space-y-3">
              {connections.length === 0 ? (
                <EmptyState
                  icon="🤝"
                  title="No connections yet"
                  desc="Search for people and send a connection request to build your close network."
                />
              ) : connections.map((conn) => (
                <div key={conn.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-[14px] font-semibold text-white/60 shrink-0">
                    {(conn.user.displayName ?? conn.user.username).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-bold text-white">{conn.user.displayName ?? conn.user.username}</p>
                      {conn.user.isVerified && <span className="text-[#4f9fff] text-[11px]">✓</span>}
                    </div>
                    <p className="text-[12px] text-white/40">@{conn.user.username}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">
                      Connected {formatRelativeTime(conn.connectedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(conn.id)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg border border-red-400/20 text-[12px] text-red-400/60 hover:text-red-400 hover:bg-red-400/[0.08] transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Requests tab */}
          {tab === "Requests" && (
            <div className="space-y-3">
              {received.length === 0 ? (
                <EmptyState icon="📬" title="No pending requests" desc="When someone sends you a connection request, it will appear here." />
              ) : received.map((req) => (
                <div key={req.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-[#fbbf24]/15 bg-[#fbbf24]/[0.04] transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-[14px] font-semibold text-white/60 shrink-0">
                    {(req.user.displayName ?? req.user.username).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-bold text-white">{req.user.displayName ?? req.user.username}</p>
                      {req.user.isVerified && <span className="text-[#4f9fff] text-[11px]">✓</span>}
                    </div>
                    <p className="text-[12px] text-white/40">@{req.user.username}</p>
                    {req.user.clone && (
                      <p className="text-[11px] text-white/30 mt-0.5">
                        🐱 {req.user.clone.name} · Lv.{req.user.clone.level}
                      </p>
                    )}
                    <p className="text-[11px] text-white/25 mt-0.5">
                      Sent {formatRelativeTime(req.createdAt)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleRespond(req.id, 'ACCEPTED')}
                        className="px-4 py-1.5 rounded-lg bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[12px] font-semibold text-[#4f9fff] hover:bg-[#4f9fff]/25 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'REJECTED')}
                        className="px-4 py-1.5 rounded-lg border border-white/[0.1] text-[12px] text-white/40 hover:text-white/70 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sent tab */}
          {tab === "Sent" && (
            <div className="space-y-3">
              {sent.length === 0 ? (
                <EmptyState icon="📤" title="No sent requests" desc="Connection requests you've sent will appear here." />
              ) : sent.map((req) => (
                <div key={req.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-[14px] font-semibold text-white/60 shrink-0">
                    {(req.user.displayName ?? req.user.username).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-bold text-white">{req.user.displayName ?? req.user.username}</p>
                      {req.user.isVerified && <span className="text-[#4f9fff] text-[11px]">✓</span>}
                    </div>
                    <p className="text-[12px] text-white/40">@{req.user.username}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">
                      Sent {formatRelativeTime(req.createdAt)}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg border border-white/[0.1] text-[11px] text-white/30">
                    Pending...
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-[14px] font-semibold text-white/50 mb-1">{title}</p>
      <p className="text-[12px] text-white/30 max-w-[280px] mx-auto">{desc}</p>
    </div>
  );
}
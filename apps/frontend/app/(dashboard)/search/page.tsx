// apps/frontend/app/(dashboard)/search/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  searchUsers,
  getSuggestedUsers,
  followUser,
  unfollowUser,
  sendConnection,
  respondToConnection,
  type SearchedUser,
} from "@/services/api/social.api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [suggested, setSuggested] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load suggested users on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await getSuggestedUsers();
        setSuggested(res.data);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        setIsLoadingSuggested(false);
      }
    }
    load();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        setError(null);
        const res = await searchUsers(query.trim());
        setResults(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed.');
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function updateUser(userId: string, updates: Partial<SearchedUser>) {
    setResults((prev) => prev.map((u) => u.id === userId ? { ...u, ...updates } : u));
    setSuggested((prev) => prev.map((u) => u.id === userId ? { ...u, ...updates } : u));
  }

  async function handleFollow(user: SearchedUser) {
    try {
      if (user.isFollowedByMe) {
        await unfollowUser(user.id);
        updateUser(user.id, {
          isFollowedByMe: false,
          followersCount: user.followersCount - 1,
        });
      } else {
        await followUser(user.id);
        updateUser(user.id, {
          isFollowedByMe: true,
          followersCount: user.followersCount + 1,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    }
  }

  async function handleConnect(user: SearchedUser) {
    try {
      await sendConnection(user.id);
      updateUser(user.id, {
        connectionStatus: { status: 'PENDING', connectionId: null, isSender: true },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send connection.');
    }
  }

  const showResults = query.trim().length > 0;
  const displayUsers = showResults ? results : suggested;

  return (
    <div className="px-6 py-6 max-w-[700px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Search</h1>
        <p className="text-[13px] text-white/40 mt-1">
          Find people, follow them, or add them as a close connection.
        </p>
      </div>

      {/* Search input */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/[0.1] bg-white/[0.03] focus-within:border-[#4f9fff]/40 transition-colors mb-6">
        <span className="text-white/30 text-lg shrink-0">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          autoFocus
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/25 outline-none"
        />
        {isSearching && (
          <span className="w-4 h-4 border-2 border-white/20 border-t-[#4f9fff] rounded-full animate-spin shrink-0" />
        )}
        {query && !isSearching && (
          <button onClick={() => setQuery("")} className="text-white/30 hover:text-white/60 transition-colors text-sm shrink-0">✕</button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] flex items-center justify-between">
          <p className="text-[13px] text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 ml-3 text-[11px]">✕</button>
        </div>
      )}

      {/* Section label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
        {showResults
          ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
          : "People you may know"}
      </p>

      {/* Loading skeletons */}
      {isLoadingSuggested && !showResults && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white/[0.08]" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-32 rounded bg-white/[0.08]" />
                <div className="h-3 w-20 rounded bg-white/[0.05]" />
              </div>
              <div className="h-8 w-20 rounded-lg bg-white/[0.05]" />
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {showResults && !isSearching && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-[14px] text-white/40">No users found for &quot;{query}&quot;</p>
          <p className="text-[12px] text-white/25 mt-1">Try a different name or username</p>
        </div>
      )}

      {/* User cards */}
      <div className="space-y-3">
        {displayUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onFollow={() => handleFollow(user)}
            onConnect={() => handleConnect(user)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── UserCard ─────────────────────────────────────────────────────────────────

function UserCard({
  user,
  onFollow,
  onConnect,
}: {
  user: SearchedUser;
  onFollow: () => void;
  onConnect: () => void;
}) {
  const [followLoading, setFollowLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  async function handleFollow() {
    setFollowLoading(true);
    await onFollow();
    setFollowLoading(false);
  }

  async function handleConnect() {
    setConnectLoading(true);
    await onConnect();
    setConnectLoading(false);
  }

  const connStatus = user.connectionStatus.status ?? "NONE";

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] hover:-translate-y-0.5 transition-all">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[14px] font-semibold text-white/60">
          {(user.displayName ?? user.username).slice(0, 2).toUpperCase()}
        </div>
        {user.clone && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] border-2 border-[#080811] flex items-center justify-center text-[9px]">
            🐱
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[14px] font-bold text-white">
            {user.displayName ?? user.username}
          </p>
          {user.isVerified && <span className="text-[#4f9fff] text-[11px]">✓</span>}
          {user.isPremium && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-[9px] font-semibold">
              PRO
            </span>
          )}
        </div>
        <p className="text-[12px] text-white/40">@{user.username}</p>
        {user.bio && (
          <p className="text-[12px] text-white/50 mt-1 line-clamp-1">{user.bio}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/30">
          <span>{user.followersCount.toLocaleString()} followers</span>
          {user.clone && (
            <>
              <span>·</span>
              <span>🐱 {user.clone.name} Lv.{user.clone.level}</span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Follow button */}
        <button
          onClick={handleFollow}
          disabled={followLoading}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-50",
            user.isFollowedByMe
              ? "border border-white/[0.12] text-white/50 hover:border-red-400/30 hover:text-red-400"
              : "bg-[#4f9fff]/10 border border-[#4f9fff]/25 text-[#4f9fff] hover:bg-[#4f9fff]/20"
          )}
        >
          {followLoading ? (
            <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
          ) : user.isFollowedByMe ? "Following" : "Follow"}
        </button>

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={connectLoading || connStatus === 'ACCEPTED' || connStatus === 'PENDING'}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:cursor-not-allowed",
            connStatus === 'ACCEPTED'
              ? "border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400"
              : connStatus === 'PENDING'
              ? "border border-white/[0.1] text-white/30"
              : "bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-[#a78bfa] hover:bg-[#a78bfa]/20"
          )}
        >
          {connectLoading ? (
            <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
          ) : connStatus === 'ACCEPTED' ? "Connected ✓"
            : connStatus === 'PENDING' ? "Pending..."
            : "Connect"}
        </button>
      </div>
    </div>
  );
}
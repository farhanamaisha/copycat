"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserByUsername } from "@/services/api/user.api";
import type { User } from "@/types";
import { cn, formatNumber } from "@/lib/utils";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();

  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setUser(data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadUser();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-[760px] mx-auto px-6 py-10 text-center">
        <p className="text-white/50">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-[760px] mx-auto px-6 py-10 text-center">
        <p className="text-4xl mb-3">😿</p>
        <p className="text-white font-semibold mb-1">
          Profile not found
        </p>
        <p className="text-white/40 text-sm mb-5">
          {error || "This user does not exist."}
        </p>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#4f9fff]/15 border border-[#4f9fff]/25 text-[#4f9fff] text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const clone = user.clone;

  return (
    <div className="max-w-[760px] mx-auto px-6 py-6">

      {/* Profile header */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden mb-5">

        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#4f9fff]/20 via-[#a78bfa]/20 to-[#22d3ee]/20 relative">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(79,159,255,0.4) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="px-6 pb-5">

          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-10 mb-4">

            <div className="flex items-end gap-3">

              {/* User avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-4 border-[#080811] flex items-center justify-center text-2xl font-bold text-white/60 ring-2 ring-white/[0.08] overflow-hidden">

                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user.displayName || user.username || "U")
                    .slice(0, 2)
                    .toUpperCase()
                )}

              </div>

              {/* Clone avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] border-4 border-[#080811] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(79,159,255,0.3)] mb-1">
                🐱
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mb-1">

              <button
                className="px-4 py-2 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-white text-[13px] font-semibold shadow-[0_0_16px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 transition-all"
              >
                Follow
              </button>

              <button
  onClick={() => router.push(`/messages?userId=${user.id}`)}
  className="px-4 py-2 rounded-[9px] border border-white/[0.1] text-[13px] text-white/60 hover:text-white hover:border-white/20 transition-all"
>
  Message
</button>

            </div>
          </div>

          {/* Name + clone */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-3">

            <div>
              <div className="flex items-center gap-2">

                <h2 className="text-xl font-bold text-white">
                  {user.displayName || user.username}
                </h2>

                {user.isVerified && (
                  <span
                    className="text-[#4f9fff] text-sm"
                    title="Verified"
                  >
                    ✓
                  </span>
                )}

                {user.isPremium && (
                  <span className="px-2 py-0.5 rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/10 text-[#a78bfa] text-[10px] font-semibold">
                    Premium
                  </span>
                )}

              </div>

              <p className="text-[13px] text-white/40">
                @{user.username}
              </p>
            </div>

            {/* Clone */}
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm">
                🐱
              </div>

              <div>
                <p className="text-[13px] font-semibold text-white">
                  {clone?.name || "No Clone"}
                </p>

                <p className="text-[11px] text-[#4f9fff]">
                  🐱 Clone
                  {clone?.level
                    ? ` · Lv.${clone.level}`
                    : ""}
                </p>
              </div>

            </div>

          </div>

          {/* Bio */}
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            {user.bio || "No bio added yet"}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-0 flex-wrap">

            {[
              {
                label: "Followers",
                value: formatNumber(user.followersCount || 0),
                color: "text-[#4f9fff]",
              },
              {
                label: "Following",
                value: formatNumber(user.followingCount || 0),
                color: "text-white",
              },
              {
                label: "Clowders",
                value: String(user.clowdersCount || 0),
                color: "text-white",
              },
              {
                label: "Clone Lv.",
                value: String(clone?.level || 1),
                color: "text-[#a78bfa]",
              },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} className="flex items-center">

                <div className="text-center px-4 py-1">

                  <p className={cn("text-[15px] font-bold", color)}>
                    {value}
                  </p>

                  <p className="text-[11px] text-white/35">
                    {label}
                  </p>

                </div>

                {i < arr.length - 1 && (
                  <div className="w-px h-6 bg-white/[0.08]" />
                )}

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* Simple profile tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">

        {["Posts", "Clones", "Clowders"].map((tab, index) => (
          <button
            key={tab}
            className={cn(
              "flex-1 py-1.5 rounded-[8px] text-[13px] font-medium",
              index === 0
                ? "bg-[#4f9fff]/15 text-[#4f9fff]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab}
          </button>
        ))}

      </div>

    </div>
  );
}


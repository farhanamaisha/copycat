// apps/frontend/components/profile/ProfileHeader.tsx
"use client";

import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Skeleton } from "@/components/common/Skeleton";
import { formatNumber } from "@/lib/utils";
import { CLONE_MOODS } from "@/constants";
import { useCurrentUser } from "@/hooks/useDashboard";

export function ProfileHeader() {
  const { user, clone, isLoading } = useCurrentUser();

  if (isLoading||!user) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
        <div className="flex items-start gap-5">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moodConfig = CLONE_MOODS[clone.mood];

  const stats = [
    { label: "Followers", value: formatNumber(user.followersCount) },
    { label: "Following", value: formatNumber(user.followingCount) },
    { label: "Clowders", value: user.clowdersCount },
    { label: "Clone Lv.", value: clone.level },
    { label: "Accuracy", value: `${clone.accuracyPercent}%` },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02]">
      {/* Banner gradient */}
      <div className="h-24 bg-gradient-to-r from-[#4f9fff]/20 via-[#a78bfa]/20 to-[#22d3ee]/20 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="px-6 pb-5">
        {/* Avatars */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="flex items-end gap-3">
            <Avatar
              name={user.displayName}
              size="xl"
              className="ring-4 ring-[#080811]"
            />
            <Avatar
              name={clone.name}
              size="lg"
              isClone
              isOnline={clone.isOnline}
              className="ring-4 ring-[#080811] mb-1"
            />
          </div>

          <button className="mb-1 px-4 py-2 rounded-[9px] border border-white/[0.12] bg-white/[0.05] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.18] transition-all">
            Edit Profile
          </button>
        </div>

        {/* Names */}
        <div className="flex items-start gap-3 flex-wrap mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user.displayName}</h2>
              {user.isVerified && (
                <span className="text-[#4f9fff] text-sm" title="Verified">✓</span>
              )}
              {user.isPremium && (
                <Badge variant="purple" size="sm">Premium</Badge>
              )}
            </div>
            <p className="text-[13px] text-white/40">@{user.username}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-lg">{moodConfig.emoji}</span>
            <div>
              <p className="text-[13px] font-semibold text-white">
                {clone.name}
              </p>
              <p className="text-[11px]" style={{ color: moodConfig.color }}>
                {moodConfig.label}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-[13px] text-white/55 mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-1 flex-wrap">
          {stats.map(({ label, value }, i) => (
            <div key={label} className="flex items-center">
              <div className="text-center px-3">
                <p className="text-[15px] font-bold text-white">{value}</p>
                <p className="text-[11px] text-white/35">{label}</p>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-6 bg-white/[0.08]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

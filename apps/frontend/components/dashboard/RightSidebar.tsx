// apps/frontend/components/dashboard/RightSidebar.tsx
import { CloneStatusCard } from "@/components/clone/CloneStatusCard";
import { SuggestedUsers } from "@/components/dashboard/SuggestedUsers";
import { SuggestedClowders } from "@/components/dashboard/SuggestedClowders";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";

export function RightSidebar() {
  return (
    <aside className="w-[300px] shrink-0 space-y-4">
      <CloneStatusCard />
      <ActivitySummary />
      <SuggestedUsers />
      <SuggestedClowders />

      <p className="text-[10px] text-white/20 px-1 leading-relaxed">
        Copy Cat · Privacy · Terms · Help · About
        <br />© 2026 Copy Cat Inc.
      </p>
    </aside>
  );
}

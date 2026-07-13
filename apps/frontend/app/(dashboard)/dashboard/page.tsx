// apps/frontend/app/(dashboard)/dashboard/page.tsx
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Feed } from "@/components/feed/Feed";
import { RightSidebar } from "@/components/dashboard/RightSidebar";

export const metadata = {
  title: "Dashboard — Copy Cat",
  description: "Your AI social home. Train your Clone, connect with Clowders.",
};

export default function DashboardPage() {
  return (
    <div className="flex items-start gap-6 px-6 py-6 max-w-[1280px] mx-auto">
      {/* Center column */}
      <div className="flex-1 min-w-0 space-y-5">
        <ProfileHeader />
        <Feed />
      </div>

      {/* Right sidebar */}
      <RightSidebar />
    </div>
  );
}

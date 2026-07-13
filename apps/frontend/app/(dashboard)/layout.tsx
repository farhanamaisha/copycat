// apps/frontend/app/(dashboard)/layout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";
import { FloatingCloneWidget } from "@/components/clone/FloatingCloneWidget";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#080811] text-[#f0f0ff]">
      {/* Ambient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.07] bg-[#4f9fff] -top-40 left-40 animate-[drift_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.06] bg-[#a78bfa] top-1/2 -right-20 animate-[drift_18s_ease-in-out_infinite_alternate_-5s]" />
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.05] bg-[#22d3ee] bottom-0 left-1/3 animate-[drift_12s_ease-in-out_infinite_alternate_-9s]" />
      </div>

      {/* Left sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="relative z-10 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>

      {/* Floating Clone */}
      <FloatingCloneWidget />
    </div>
  );
}

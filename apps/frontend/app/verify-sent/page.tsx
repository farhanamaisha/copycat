import { Suspense } from "react";
import { VerifySentClient } from "./verify-sent-client";

export default function VerifySentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
          <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p>Loading…</p>
          </div>
        </div>
      }
    >
      <VerifySentClient />
    </Suspense>
  );
}
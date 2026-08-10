import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
          <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p>Verifying…</p>
          </div>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
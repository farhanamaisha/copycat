"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/services/api/auth.api";

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const resp = await verifyEmail(token);
        setMessage(resp.message);
        setTimeout(() => router.push("/account-created"), 1200);
      } catch (error) {
        console.error(error);
        setMessage("Verification failed. The link may have expired.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        {loading ? (
          <p>Verifying…</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">Verification</h2>
            <p className="text-sm text-white/60">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
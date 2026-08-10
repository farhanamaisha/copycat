"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resendVerification } from "@/services/api/auth.api";

export function VerifySentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleResend() {
    setSending(true);
    try {
      const resp = await resendVerification(email);
      setMessage(resp.message);
    } catch {
      setMessage("Unable to resend verification email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
        <p className="text-sm text-white/60 mb-4">
          We sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to complete account creation.
        </p>
        <button
          onClick={handleResend}
          disabled={sending}
          className="mb-4 rounded-lg bg-[#4f9fff] px-4 py-2"
        >
          {sending ? "Sending..." : "Resend verification email"}
        </button>
        {message && <p className="text-sm text-white/60">{message}</p>}
        <div className="mt-6">
          <button onClick={() => router.push("/sign-in")} className="text-sm text-white/50">
            Back to sign-in
          </button>
        </div>
      </div>
    </div>
  );
}
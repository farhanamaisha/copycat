import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { AuthForm, type AuthMode } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In — Copy Cat",
  description: "Sign in or create your Copy Cat Clone account.",
};

function resolveMode(value: string | string[] | undefined): AuthMode {
  return value === "create-account" ? "create-account" : "sign-in";
}

export default function AuthPage({
  searchParams,
}: {
  searchParams?: { mode?: string };
}) {
  const initialMode = resolveMode(searchParams?.mode);

  return (
    <main className="flex min-h-screen bg-[#050508]">
      <AuthBrandPanel />
      <Suspense fallback={null}>
        <AuthForm initialMode={initialMode} />
      </Suspense>
    </main>
  );
}

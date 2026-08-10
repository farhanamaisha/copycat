import { Suspense } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { AuthForm, type AuthMode } from "@/components/auth/AuthForm";

function resolveMode(value: string | null | undefined): AuthMode {
  return value === "create-account" ? "create-account" : "sign-in";
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: { mode?: string } | Promise<{ mode?: string }>;
}) {
  const sp = await (searchParams as any);
  const initialMode = resolveMode(sp?.mode ?? undefined);

  return (
    <main className="flex min-h-screen bg-[#050508]">
      <AuthBrandPanel />
      <Suspense fallback={null}>
        {/* AuthForm is a client component and receives the initial mode as a prop */}
        <AuthForm initialMode={initialMode} />
      </Suspense>
    </main>
  );
}

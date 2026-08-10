export default function AccountCreatedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <div className="max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4f9fff]/10 text-2xl">🐱</div>
        <h2 className="text-2xl font-bold mb-2">Account created</h2>
        <p className="text-sm text-white/60">Your account and Clone have been created. Welcome!</p>
      </div>
    </div>
  );
}

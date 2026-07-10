import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.08] backdrop-blur-xl bg-[#050508]/60">
      <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-lg shadow-[0_0_16px_rgba(79,159,255,0.4)]">
          🐱
        </div>
        Copy Cat
      </Link>

      <div className="hidden md:flex gap-7">
        {[
          { label: "Clones", href: "/#core-concepts" },
          { label: "Clowder", href: "/#core-concepts" },
          { label: "Explore", href: "/#how-it-works" },
          { label: "Pricing", href: "/#pricing" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Link
        href="/sign-in"
        className="inline-block rounded-lg border border-[#4f9fff]/30 bg-[#4f9fff]/10 px-4 py-2 text-sm font-medium text-[#4f9fff] transition-all hover:bg-[#4f9fff]/20 hover:shadow-[0_0_20px_rgba(79,159,255,0.2)]"
      >
        Sign In
      </Link>
    </nav>
  );
}

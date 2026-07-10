import Link from "next/link";

export function CtaBanner() {
  return (
    <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.14] bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,159,255,0.12)_0%,rgba(167,139,250,0.06)_50%,transparent_100%)] bg-[#0a0a14]/80 px-6 md:px-12 py-16 text-center">
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#4f9fff]/60 to-transparent" />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/10 px-3.5 py-1.5 text-xs font-medium text-[#a78bfa] mb-6">
          🚀 Limited Early Access
        </div>

        <h2 className="text-[28px] md:text-[44px] font-extrabold tracking-[-1.5px] leading-tight mb-3.5">
          Your Clone is
          <br />
          <span className="bg-gradient-to-r from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
            waiting for you
          </span>
        </h2>
        <p className="text-base text-white/60 mb-9">
          Join thousands already training their AI personality. The future of
          social is here.
        </p>

        <div className="flex flex-wrap gap-3.5 justify-center">
          <Link
            href="/sign-in"
            className="rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] px-8 py-3.5 text-[15px] font-semibold tracking-tight shadow-[0_0_30px_rgba(79,159,255,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(79,159,255,0.5)]"
          >
            ⚡ Enter Copy Cat
          </Link>
          <Link
            href="/sign-in?mode=create-account"
            className="rounded-[10px] border border-white/[0.14] bg-white/[0.04] px-8 py-3.5 text-[15px] font-medium tracking-tight transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
          >
            Create Account →
          </Link>
        </div>
      </div>
    </section>
  );
}

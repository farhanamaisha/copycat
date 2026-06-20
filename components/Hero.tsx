import Link from "next/link";
import { CatSVG, Stat } from "./ui/Shared";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-28">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/10 px-3.5 py-1.5 text-xs font-medium text-[#a78bfa] mb-9">
        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa] animate-pulse" />
        Now in Early Access — Your Clone Awaits
      </div>

      {/* Clone avatar */}
      <div className="relative w-[180px] h-[180px] mb-11">
        <div className="absolute -inset-6 rounded-full bg-gradient-to-bl from-[#4f9fff]/30 to-[#a78bfa]/30 animate-[rotatering_10s_linear_infinite_reverse] [mask-image:radial-gradient(circle,transparent_calc(50%-1px),black_calc(50%-1px),black_50%,transparent_calc(50%+1px))]" />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee]/60 animate-[rotatering_6s_linear_infinite] p-[1.5px]">
          <div className="w-full h-full rounded-full bg-[#050508]" />
        </div>
        <div className="absolute inset-0 w-[180px] h-[180px] rounded-full bg-[radial-gradient(ellipse_at_40%_35%,#1a1a3e_0%,#0a0a1a_70%)] border border-[#4f9fff]/25 flex items-center justify-center shadow-[0_0_40px_rgba(79,159,255,0.15),0_0_80px_rgba(167,139,250,0.08)] overflow-hidden">
          <CatSVG size={100} />
        </div>
      </div>

      <h1 className="text-[44px] md:text-[80px] font-extrabold tracking-[-2.5px] leading-[1.05] mb-5">
        <span className="bg-gradient-to-br from-[#f0f0ff] to-[#f0f0ff]/70 bg-clip-text text-transparent">
          Copy{" "}
        </span>
        <span className="bg-gradient-to-r from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
          Cat
        </span>
      </h1>

      <p className="text-xl md:text-2xl font-bold tracking-tight text-white/80 mb-3">
        Your AI. Your Clone. Your World.
      </p>
      <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-[520px] mb-11">
        Meet your Clone — an AI personality avatar that learns from you,
        evolves with you, and represents you across a social universe built
        for the future.
      </p>

      <div className="flex flex-wrap gap-3.5 justify-center">
        <Link
          href="/sign-in"
          className="rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] px-8 py-3.5 text-[15px] font-semibold tracking-tight shadow-[0_0_30px_rgba(79,159,255,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(79,159,255,0.5),0_8px_30px_rgba(0,0,0,0.3)]"
        >
          ⚡ Enter Copy Cat
        </Link>
        <Link
          href="/sign-in?mode=create-account"
          className="rounded-[10px] border border-white/[0.14] bg-white/[0.04] px-8 py-3.5 text-[15px] font-medium tracking-tight transition-all hover:-translate-y-0.5 hover:bg-white/[0.07] hover:border-white/20"
        >
          Create Account →
        </Link>
      </div>

      <div className="flex gap-10 mt-16 pt-8 border-t border-white/[0.08] justify-center flex-wrap">
        <Stat num="2.4M+" label="CLONES ACTIVE" color="text-[#4f9fff]" />
        <Stat num="840K+" label="CLOWDERS FORMED" color="text-[#a78bfa]" />
        <Stat num="98%" label="PERSONALITY ACCURACY" color="text-[#22d3ee]" />
      </div>
    </section>
  );
}

import { CatSVG } from "../ui/Shared";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-[#050508] px-12">
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-20 h-[480px] w-[480px] rounded-full bg-[#4f9fff] opacity-[0.14] blur-[90px] animate-[drift_12s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-[-120px] right-[-60px] h-[420px] w-[420px] rounded-full bg-[#a78bfa] opacity-[0.14] blur-[90px] animate-[drift_12s_ease-in-out_infinite_alternate_-4s]" />
        <div className="absolute top-1/3 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#22d3ee] opacity-[0.1] blur-[90px] animate-[drift_12s_ease-in-out_infinite_alternate_-8s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <div className="relative mb-10 h-[140px] w-[140px]">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#4f9fff] via-[#a78bfa] to-[#22d3ee]/60 animate-[rotatering_6s_linear_infinite] p-[1.5px]">
            <div className="h-full w-full rounded-full bg-[#050508]" />
          </div>
          <div className="absolute inset-0 flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full border border-[#4f9fff]/25 bg-[radial-gradient(ellipse_at_40%_35%,#1a1a3e_0%,#0a0a1a_70%)] shadow-[0_0_40px_rgba(79,159,255,0.15),0_0_80px_rgba(167,139,250,0.08)]">
            <CatSVG size={78} />
          </div>
        </div>

        <h1 className="mb-3 text-[34px] font-extrabold leading-tight tracking-[-1.5px] text-white">
          Copy{" "}
          <span className="bg-gradient-to-r from-[#4f9fff] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
            Cat
          </span>
        </h1>
        <p className="mb-10 text-[15px] leading-relaxed text-white/55">
          Your AI. Your Clone. Your World. Sign in to keep training your
          Clone, or create one in seconds.
        </p>

        <div className="flex w-full gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08]">
          <BrandStat num="2.4M+" label="CLONES ACTIVE" color="text-[#4f9fff]" />
          <BrandStat num="840K+" label="CLOWDERS" color="text-[#a78bfa]" />
          <BrandStat num="98%" label="ACCURACY" color="text-[#22d3ee]" />
        </div>
      </div>
    </div>
  );
}

function BrandStat({
  num,
  label,
  color,
}: {
  num: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 bg-[#0a0a0f] px-3 py-4 text-center">
      <div className={`text-lg font-bold tracking-tight ${color}`}>{num}</div>
      <div className="mt-1 text-[10px] tracking-wide text-white/30">
        {label}
      </div>
    </div>
  );
}

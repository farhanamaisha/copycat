"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050508] text-[#f0f0ff]">
      {/* ───────────── Animated mesh background ───────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-20 bg-[#4f9fff] -top-52 -left-24 animate-[drift_12s_ease-in-out_infinite_alternate]" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-20 bg-[#a78bfa] top-48 -right-36 animate-[drift_12s_ease-in-out_infinite_alternate_-4s]" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-20 bg-[#22d3ee] -bottom-24 left-1/3 animate-[drift_12s_ease-in-out_infinite_alternate_-8s]" />
      </div>

      {/* Floating particles */}
      <div className="fixed top-[20%] left-[15%] w-[3px] h-[3px] rounded-full bg-[#4f9fff] opacity-50 animate-[floatP_8s_ease-in-out_infinite] z-0 pointer-events-none" />
      <div className="fixed top-[40%] left-[80%] w-[2px] h-[2px] rounded-full bg-[#a78bfa] opacity-40 animate-[floatP_11s_ease-in-out_infinite_reverse] z-0 pointer-events-none" />
      <div className="fixed top-[70%] left-[25%] w-[4px] h-[4px] rounded-full bg-[#22d3ee] opacity-35 animate-[floatP_9s_ease-in-out_infinite_2s] z-0 pointer-events-none" />
      <div className="fixed top-[60%] left-[60%] w-[2px] h-[2px] rounded-full bg-[#4f9fff] opacity-40 animate-[floatP_13s_ease-in-out_infinite_4s_reverse] z-0 pointer-events-none" />

      <div className="relative z-10">
        {/* ───────────── NAV ───────────── */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.08] backdrop-blur-xl bg-[#050508]/60">
          <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-lg shadow-[0_0_16px_rgba(79,159,255,0.4)]">
              🐱
            </div>
            Copy Cat
          </div>
         <div className="hidden md:flex gap-7">
  {["Clones", "Clowder", "Explore", "Pricing"].map((item) => (
    <a
      key={item}
      href="#"
      className="text-sm text-white/60 hover:text-white transition-colors"
    >
      {item}
    </a>
  ))}
</div>

<a
  href="#"
  className="inline-block rounded-lg border border-[#4f9fff]/30 bg-[#4f9fff]/10 px-4 py-2 text-sm font-medium text-[#4f9fff] transition-all hover:bg-[#4f9fff]/20 hover:shadow-[0_0_20px_rgba(79,159,255,0.2)]"
>
  Sign In
</a>
        </nav>

        {/* ───────────── HERO ───────────── */}
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
            evolves with you, and represents you across a social universe
            built for the future.
          </p>

          <div className="flex flex-wrap gap-3.5 justify-center">
            <button className="rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] px-8 py-3.5 text-[15px] font-semibold tracking-tight shadow-[0_0_30px_rgba(79,159,255,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(79,159,255,0.5),0_8px_30px_rgba(0,0,0,0.3)]">
              ⚡ Enter Copy Cat
            </button>
            <button className="rounded-[10px] border border-white/[0.14] bg-white/[0.04] px-8 py-3.5 text-[15px] font-medium tracking-tight transition-all hover:-translate-y-0.5 hover:bg-white/[0.07] hover:border-white/20">
              Create Account →
            </button>
          </div>

          <div className="flex gap-10 mt-16 pt-8 border-t border-white/[0.08] justify-center flex-wrap">
            <Stat num="2.4M+" label="CLONES ACTIVE" color="text-[#4f9fff]" />
            <Stat num="840K+" label="CLOWDERS FORMED" color="text-[#a78bfa]" />
            <Stat num="98%" label="PERSONALITY ACCURACY" color="text-[#22d3ee]" />
          </div>
        </section>

        {/* ───────────── CORE CONCEPT ───────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#4f9fff] mb-3.5">
            Core Concepts
          </p>
          <h2 className="text-[28px] md:text-[44px] font-extrabold tracking-[-1.5px] leading-tight mb-3.5">
            The future of social
            <br />
            is your Clone
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[480px]">
            Three pillars that power an entirely new kind of social
            experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <ConceptCard
              icon="🤖"
              color="blue"
              title="Your Clone"
              body="An AI personality avatar — cat-themed, uniquely yours. It learns your voice, humor, and opinions through every interaction. The more you train it, the more it becomes you."
              tag="AI AVATAR"
            />
            <ConceptCard
              icon="🐾"
              color="purple"
              title="Clowder Groups"
              body="A Clowder is your inner circle — a social layer where Clones connect, collaborate, and converse. Build communities around shared interests, vibes, or ideas."
              tag="SOCIAL LAYER"
            />
            <ConceptCard
              icon="⚡"
              color="cyan"
              title="Train Your Clone"
              body="Every message, reaction, and choice teaches your Clone who you are. Watch your personality score grow as your Clone evolves into a true digital reflection."
              tag="EVOLVING AI"
            />
          </div>
        </section>

        {/* ───────────── CLONE PREVIEW ───────────── */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#4f9fff] mb-3.5">
              Clone Preview
            </p>
            <h2 className="text-[28px] md:text-[44px] font-extrabold tracking-[-1.5px] leading-tight mb-10">
              Meet your digital self
            </h2>

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.14] bg-[#0a0a14]/80 p-9 shadow-[0_0_60px_rgba(79,159,255,0.06),0_40px_80px_rgba(0,0,0,0.4)] grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 items-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4f9fff]/50 to-transparent" />

              {/* Left: avatar + traits */}
              <div className="text-center">
                <div className="relative w-[160px] h-[160px] mx-auto">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] animate-[rotatering_8s_linear_infinite] p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-[#0a0a14]" />
                  </div>
                  <div className="absolute inset-0 w-[160px] h-[160px] rounded-full bg-[radial-gradient(ellipse_at_40%_35%,#1a1a3e_0%,#0a0a1a_70%)] border border-[#4f9fff]/25 flex items-center justify-center overflow-hidden">
                    <CatSVG size={88} eyeColors={["#22d3ee", "#a78bfa"]} />
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    My Clone
                  </h3>
                  <p className="text-[13px] text-white/40 mb-6">
                    @myhandle.clone
                  </p>

                  <div className="flex gap-2 flex-wrap justify-center mb-7">
                    <Trait label="😄 Funny" />
                    <Trait label="🧘 Calm" />
                    <Trait label="🧠 Intelligent" />
                  </div>

                  <div className="text-left">
                    <ProgressBar
                      label="Personality Trained"
                      value={72}
                      mounted={mounted}
                      gradient="from-[#4f9fff] to-[#a78bfa]"
                    />
                    <ProgressBar
                      label="Vocabulary Learned"
                      value={58}
                      mounted={mounted}
                      gradient="from-[#a78bfa] to-[#22d3ee]"
                    />
                  </div>

                  <button className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#4f9fff]/30 bg-gradient-to-br from-[#4f9fff]/15 to-[#a78bfa]/15 px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(79,159,255,0.2)] hover:from-[#4f9fff]/25 hover:to-[#a78bfa]/25">
                    💬 Chat with Clone ↗
                  </button>
                </div>
              </div>

              {/* Right: chat + activity */}
              <div>
                <p className="text-[13px] text-white/40 mb-4 font-medium tracking-wide">
                  LIVE CLONE CONVERSATION
                </p>
                <div className="flex flex-col gap-3">
                  <ChatBubble
                    from="clone"
                    text="Hey! I just read that article you bookmarked about generative AI ethics. Honestly? It reminded me of the conversation we had last Tuesday. 😸"
                    meta="My Clone · just now"
                  />
                  <ChatBubble
                    from="user"
                    text="That's wild, I was literally just thinking about that."
                    meta="You · just now"
                  />
                  <ChatBubble
                    from="clone"
                    text={
                      <>
                        I know. That's kind of my whole thing. 🐱⚡{" "}
                        <span className="text-[#4f9fff]">
                          +1 training point earned
                        </span>
                      </>
                    }
                    meta="My Clone · just now"
                  />
                </div>

                <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                  <p className="text-xs text-white/40 mb-2.5 font-medium tracking-wide">
                    CLONE ACTIVITY
                  </p>
                  <div className="flex flex-col gap-2">
                    <ActivityRow
                      label="Interactions this week"
                      value="247"
                      color="text-[#4f9fff]"
                    />
                    <ActivityRow
                      label="Clowder members"
                      value="18"
                      color="text-[#a78bfa]"
                    />
                    <ActivityRow
                      label="Personality evolution"
                      value="↑ 3% this week"
                      color="text-[#22d3ee]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── HOW IT WORKS ───────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#4f9fff] mb-3.5">
            How It Works
          </p>
          <h2 className="text-[28px] md:text-[44px] font-extrabold tracking-[-1.5px] leading-tight mb-12">
            Four steps to your Clone
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/[0.08]">
            <Step
              num="01"
              icon="✨"
              title="Create Account"
              desc="Sign up in seconds. Your Clone is born the moment you arrive."
            />
            <Step
              num="02"
              icon="🐱"
              title="Name Your Clone"
              desc="Customize your cat avatar. Give it a name, style, and starter traits."
            />
            <Step
              num="03"
              icon="🧠"
              title="Train & Interact"
              desc="Chat, react, post — every action trains your Clone's personality model."
            />
            <Step
              num="04"
              icon="🐾"
              title="Join a Clowder"
              desc="Connect with others. Let your Clone represent you in group spaces."
            />
          </div>
        </section>

        {/* ───────────── CTA BANNER ───────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
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
              Join thousands already training their AI personality. The
              future of social is here.
            </p>

            <div className="flex flex-wrap gap-3.5 justify-center">
              <button className="rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] px-8 py-3.5 text-[15px] font-semibold tracking-tight shadow-[0_0_30px_rgba(79,159,255,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(79,159,255,0.5)]">
                ⚡ Enter Copy Cat
              </button>
              <button className="rounded-[10px] border border-white/[0.14] bg-white/[0.04] px-8 py-3.5 text-[15px] font-medium tracking-tight transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]">
                Create Account →
              </button>
            </div>
          </div>
        </section>

        {/* ───────────── FOOTER ───────────── */}
        <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-white/30">
          <div className="flex items-center gap-2.5 text-[15px] font-bold">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm">
              🐱
            </div>
            Copy Cat
          </div>
          <div>© 2026 Copy Cat. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes drift {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(30px, 20px) scale(1.08);
          }
        }
        @keyframes rotatering {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes floatP {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(12px, -18px);
          }
          66% {
            transform: translate(-8px, 10px);
          }
        }
      `}</style>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function Stat({
  num,
  label,
  color,
}: {
  num: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{num}</div>
      <div className="text-xs text-white/30 mt-1 tracking-wide">{label}</div>
    </div>
  );
}

const colorMap = {
  blue: {
    icon: "bg-[#4f9fff]/10 shadow-[0_0_16px_rgba(79,159,255,0.15)]",
    tag: "bg-[#4f9fff]/10 text-[#4f9fff]",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(79,159,255,0.08)]",
  },
  purple: {
    icon: "bg-[#a78bfa]/10 shadow-[0_0_16px_rgba(167,139,250,0.15)]",
    tag: "bg-[#a78bfa]/10 text-[#a78bfa]",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.08)]",
  },
  cyan: {
    icon: "bg-[#22d3ee]/10 shadow-[0_0_16px_rgba(34,211,238,0.15)]",
    tag: "bg-[#22d3ee]/10 text-[#22d3ee]",
    hoverGlow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]",
  },
} as const;

function ConceptCard({
  icon,
  color,
  title,
  body,
  tag,
}: {
  icon: string;
  color: keyof typeof colorMap;
  title: string;
  body: string;
  tag: string;
}) {
  const c = colorMap[color];
  return (
    <div
      className={`group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 transition-all hover:-translate-y-1 hover:border-white/[0.14] ${c.hoverGlow}`}
    >
      <div
        className={`w-11 h-11 rounded-[11px] flex items-center justify-center text-xl mb-4 ${c.icon}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{body}</p>
      <span
        className={`inline-block mt-4 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide ${c.tag}`}
      >
        {tag}
      </span>
    </div>
  );
}

function Trait({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.14] text-white/60 bg-white/[0.04]">
      {label}
    </span>
  );
}

function ProgressBar({
  label,
  value,
  mounted,
  gradient,
}: {
  label: string;
  value: number;
  mounted: boolean;
  gradient: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center text-[13px] text-white/60 mb-2">
        <span>{label}</span>
        <span className="text-[#4f9fff] font-semibold">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-[0_0_10px_rgba(79,159,255,0.4)] transition-all duration-1000 ease-out`}
          style={{ width: mounted ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function ChatBubble({
  from,
  text,
  meta,
}: {
  from: "clone" | "user";
  text: ReactNode;
  meta: string;
}) {
  const isClone = from === "clone";
  return (
    <div className={isClone ? "self-start" : "self-end ml-auto"}>
      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] ${
          isClone
            ? "bg-[#4f9fff]/10 border border-[#4f9fff]/20 rounded-bl-[4px]"
            : "bg-white/[0.04] border border-white/[0.08] rounded-br-[4px] text-white/60 ml-auto"
        }`}
      >
        {text}
      </div>
      <p className="text-[11px] text-white/30 mt-1">{meta}</p>
    </div>
  );
}

function ActivityRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-white/60">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function Step({
  num,
  icon,
  title,
  desc,
}: {
  num: string;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#0a0a0f] p-7 transition-colors hover:bg-[#0f0f1a]">
      <div className="text-[11px] font-bold tracking-wide text-white/30 mb-4">
        {num}
      </div>
      <div className="text-[26px] mb-3">{icon}</div>
      <h4 className="text-base font-bold tracking-tight mb-2">{title}</h4>
      <p className="text-[13px] text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function CatSVG({
  size = 100,
  eyeColors = ["#4f9fff", "#a78bfa"] as [string, string],
}: {
  size?: number;
  eyeColors?: [string, string];
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="18,42 28,18 42,42"
        fill="#1e1e4a"
        stroke="rgba(79,159,255,0.5)"
        strokeWidth="1.5"
      />
      <polygon
        points="58,42 72,18 82,42"
        fill="#1e1e4a"
        stroke="rgba(167,139,250,0.5)"
        strokeWidth="1.5"
      />
      <polygon points="22,40 28,24 38,40" fill="rgba(167,139,250,0.2)" />
      <polygon points="62,40 72,24 78,40" fill="rgba(79,159,255,0.2)" />
      <ellipse
        cx="50"
        cy="60"
        rx="32"
        ry="28"
        fill="#12123a"
        stroke="rgba(79,159,255,0.3)"
        strokeWidth="1"
      />
      <ellipse cx="38" cy="57" rx="7" ry="8" fill="#0d0d2b" />
      <ellipse cx="62" cy="57" rx="7" ry="8" fill="#0d0d2b" />
      <ellipse cx="38" cy="57" rx="5" ry="6" fill={eyeColors[0]} opacity="0.9" />
      <ellipse cx="62" cy="57" rx="5" ry="6" fill={eyeColors[1]} opacity="0.9" />
      <ellipse cx="38" cy="57" rx="2.5" ry="4" fill="#020212" />
      <ellipse cx="62" cy="57" rx="2.5" ry="4" fill="#020212" />
      <circle cx="40" cy="55" r="1.5" fill="white" opacity="0.9" />
      <circle cx="64" cy="55" r="1.5" fill="white" opacity="0.9" />
      <ellipse cx="50" cy="68" rx="3" ry="2" fill="rgba(167,139,250,0.7)" />
      <path
        d="M47 70 Q50 73 53 70"
        stroke="rgba(240,240,255,0.4)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="66"
        x2="40"
        y2="68"
        stroke="rgba(79,159,255,0.3)"
        strokeWidth="0.8"
      />
      <line
        x1="18"
        y1="70"
        x2="40"
        y2="70"
        stroke="rgba(79,159,255,0.3)"
        strokeWidth="0.8"
      />
      <line
        x1="60"
        y1="68"
        x2="82"
        y2="66"
        stroke="rgba(167,139,250,0.3)"
        strokeWidth="0.8"
      />
      <line
        x1="60"
        y1="70"
        x2="82"
        y2="70"
        stroke="rgba(167,139,250,0.3)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CatSVG,
  Trait,
  ProgressBar,
  ChatBubble,
  ActivityRow,
} from "./ui/Shared";

export function ClonePreview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
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

              <Link
                href="/sign-in"
                className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#4f9fff]/30 bg-gradient-to-br from-[#4f9fff]/15 to-[#a78bfa]/15 px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(79,159,255,0.2)] hover:from-[#4f9fff]/25 hover:to-[#a78bfa]/25"
              >
                💬 Chat with Clone ↗
              </Link>
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
  );
}

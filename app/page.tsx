import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ClonePreview } from "@/components/ClonePreview";
import { HowItWorks } from "@/components/HowItWorks";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050508] text-[#f0f0ff]">
      {/* Animated mesh background */}
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
        <Navbar />
        <Hero />
        <FeaturesSection />
        <ClonePreview />
        <HowItWorks />
        <CtaBanner />
        <Footer />
      </div>
    </main>
  );
}

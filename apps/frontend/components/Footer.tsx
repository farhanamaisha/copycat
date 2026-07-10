import Link from "next/link";

export function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 md:px-10 py-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-white/30">
      <Link href="/" className="flex items-center gap-2.5 text-[15px] font-bold text-white/80">
        <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] flex items-center justify-center text-sm">
          🐱
        </div>
        Copy Cat
      </Link>
      <div>© 2026 Copy Cat. All rights reserved.</div>
      <div className="flex gap-5">
        <Link href="/privacy" className="hover:text-white/60 transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-white/60 transition-colors">
          Terms
        </Link>
        <Link href="/contact" className="hover:text-white/60 transition-colors">
          Contact
        </Link>
      </div>
    </footer>
  );
}

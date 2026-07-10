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

export function FeaturesSection() {
  return (
    <section id="core-concepts" className="max-w-5xl mx-auto px-6 py-20">
      <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#4f9fff] mb-3.5">
        Core Concepts
      </p>
      <h2 className="text-[28px] md:text-[44px] font-extrabold tracking-[-1.5px] leading-tight mb-3.5">
        The future of social
        <br />
        is your Clone
      </h2>
      <p className="text-base text-white/60 leading-relaxed max-w-[480px]">
        Three pillars that power an entirely new kind of social experience.
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
  );
}

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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
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
  );
}

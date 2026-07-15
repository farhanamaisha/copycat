// apps/frontend/components/chat/TypingIndicator.tsx
export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;

  const label =
    users.length === 1
      ? `${users[0]} is typing`
      : users.length === 2
      ? `${users[0]} and ${users[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#4f9fff]/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-[12px] text-white/35 italic">{label}</span>
    </div>
  );
}
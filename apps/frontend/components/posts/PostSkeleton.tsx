// apps/frontend/components/posts/PostSkeleton.tsx
export function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/[0.07]" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded-lg bg-white/[0.07]" />
          <div className="h-3 w-20 rounded-lg bg-white/[0.05]" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded-lg bg-white/[0.07]" />
        <div className="h-3.5 w-[85%] rounded-lg bg-white/[0.07]" />
        <div className="h-3.5 w-[65%] rounded-lg bg-white/[0.05]" />
      </div>
      <div className="flex gap-3 pt-2 border-t border-white/[0.05]">
        <div className="h-7 w-16 rounded-lg bg-white/[0.05]" />
        <div className="h-7 w-16 rounded-lg bg-white/[0.05]" />
        <div className="h-7 w-16 rounded-lg bg-white/[0.05]" />
      </div>
    </div>
  );
}
"use client";

interface SocialButtonProps {
  provider: "google" | "github";
  onClick?: () => void;
}

const providerConfig = {
  google: {
    label: "Continue with Google",
    icon: (
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.9 36.3 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
        />
      </svg>
    ),
  },
  github: {
    label: "Continue with GitHub",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.58 0-.287-.012-1.243-.018-2.25-3.338.726-4.043-1.415-4.043-1.415-.546-1.387-1.332-1.756-1.332-1.756-1.087-.745.083-.73.083-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.833 2.805 1.304 3.49.997.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.123-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.302 1.23a11.5 11.5 0 016.01 0c2.293-1.553 3.3-1.23 3.3-1.23.654 1.653.24 2.873.118 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.805 5.625-5.476 5.92.43.372.814 1.103.814 2.222 0 1.605-.015 2.897-.015 3.293 0 .32.218.697.825.58C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
};

export function SocialButton({ provider, onClick }: SocialButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.18]"
    >
      {config.icon}
      {config.label}
    </button>
  );
}

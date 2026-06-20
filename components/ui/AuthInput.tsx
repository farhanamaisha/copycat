"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, error, id, ...props }, ref) {
    const inputId = id ?? props.name;

    return (
      <div className="mb-5">
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-white/70 mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-[10px] border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(79,159,255,0.15)] ${
            error
              ? "border-red-400/50 focus:border-red-400/70"
              : "border-white/[0.1] focus:border-[#4f9fff]/60"
          }`}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

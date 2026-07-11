"use client";
import {
  registerUser,
  loginUser,
} from "@/services/api/auth.api";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { AuthInput } from "../ui/AuthInput";
import { SocialButton } from "../ui/SocialButton";

export type AuthMode = "sign-in" | "create-account";

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: FormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthForm({ initialMode = "sign-in" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSignUp = mode === "create-account";

  function switchMode(next: AuthMode) {
    if (next === mode) return;
    setMode(next);
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
  }

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (isSignUp && values.username.trim().length < 3) {
      next.username = "Username must be at least 3 characters.";
    }

    if (!values.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!values.password) {
      next.password = "Password is required.";
    } else if (isSignUp && values.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (isSignUp) {
      if (!values.confirmPassword) {
        next.confirmPassword = "Please confirm your password.";
      } else if (values.confirmPassword !== values.password) {
        next.confirmPassword = "Passwords do not match.";
      }
    }

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const nextErrors = validate();
  setErrors(nextErrors);

  if (Object.keys(nextErrors).length > 0) return;

  setSubmitting(true);

  try {

    let result;

    if (isSignUp) {

      result = await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });

    } else {

      const response = await loginUser({
  email: values.email,
  password: values.password,
});

if (response.accessToken) {
  localStorage.setItem(
    "accessToken",
    response.accessToken
  );

  setSubmitted(true);

  return;
}

setErrors({
  email:
    response.message ??
    "Invalid email or password",
});

    }


    console.log(result);


    if (result.accessToken) {

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      setSubmitted(true);

    } else {

       setErrors({
    email:
      typeof result.message === "string"
        ? result.message
        : result.message?.message || "Authentication failed",
  });

    }


  } catch (error) {

    console.error(error);

    setErrors({
      email: "Something went wrong. Try again.",
    });

  } finally {

    setSubmitting(false);

  }
}

  return (
    <div className="flex w-full flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
      <div className="w-full max-w-[400px]">
        {/* Mobile-only logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#a78bfa] text-lg shadow-[0_0_16px_rgba(79,159,255,0.4)]">
            🐱
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Copy Cat
          </span>
        </div>

        {/* Animated mode toggle */}
        <div className="relative mb-8 grid grid-cols-2 rounded-[12px] border border-white/[0.08] bg-white/[0.04] p-1">
          <div
            className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] shadow-[0_0_20px_rgba(79,159,255,0.35)] transition-transform duration-300 ease-out ${
              isSignUp ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            onClick={() => switchMode("sign-in")}
            className={`relative z-10 rounded-[9px] py-2.5 text-sm font-semibold transition-colors duration-300 ${
              isSignUp ? "text-white/50" : "text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("create-account")}
            className={`relative z-10 rounded-[9px] py-2.5 text-sm font-semibold transition-colors duration-300 ${
              isSignUp ? "text-white" : "text-white/50"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="mb-7">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {isSignUp ? "Create your Clone" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-sm text-white/50">
            {isSignUp
              ? "Set up your account and your Clone is born instantly."
              : "Sign in to keep training your Clone."}
          </p>
        </div>

        {submitted ? (
          <SuccessMessage mode={mode} onReset={() => setSubmitted(false)} />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <SocialButton provider="google" />
              <SocialButton provider="github" />
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs uppercase tracking-wide text-white/30">
                or continue with email
              </span>
              <span className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isSignUp
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                } overflow-hidden`}
              >
                <div className="min-h-0">
                  <AuthInput
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="cosmic_whisker"
                    value={values.username}
                    error={errors.username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("username", e.target.value)
                    }
                    autoComplete="username"
                  />
                </div>
              </div>

              <AuthInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                error={errors.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                autoComplete="email"
              />

              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={values.password}
                error={errors.password}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((v) => !v)}
                onChange={(value) => handleChange("password", value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isSignUp
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                } overflow-hidden`}
              >
                <div className="min-h-0">
                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    visible={showConfirmPassword}
                    onToggleVisible={() =>
                      setShowConfirmPassword((v) => !v)
                    }
                    onChange={(value) =>
                      handleChange("confirmPassword", value)
                    }
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="mb-6 flex justify-end">
                  <a
                    href="#"
                    className="text-xs font-medium text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] px-6 py-3.5 text-[15px] font-semibold tracking-tight text-white shadow-[0_0_30px_rgba(79,159,255,0.35),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(79,159,255,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <Spinner />
                ) : isSignUp ? (
                  "⚡ Create Account"
                ) : (
                  "⚡ Enter Copy Cat"
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-white/40">
              {isSignUp ? (
                <>
                  Already have a Clone?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("sign-in")}
                    className="font-medium text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to Copy Cat?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("create-account")}
                    className="font-medium text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PasswordField — input with show/hide toggle
───────────────────────────────────────────── */
function PasswordField({
  label,
  name,
  placeholder,
  value,
  error,
  visible,
  onToggleVisible,
  onChange,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  error?: string;
  visible: boolean;
  onToggleVisible: () => void;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <AuthInput
        label={label}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        error={error}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={onToggleVisible}
        tabIndex={-1}
        className="absolute right-3.5 top-[38px] text-white/30 transition-colors hover:text-white/60"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
        clipRule="evenodd"
      />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SuccessMessage({
  mode,
  onReset,
}: {
  mode: AuthMode;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#4f9fff]/20 bg-[#4f9fff]/[0.06] p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4f9fff]/10 text-2xl">
        🐱
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">
        {mode === "create-account" ? "Clone created!" : "Welcome back!"}
      </h3>
      <p className="mb-6 text-sm text-white/50">
        {mode === "create-account"
          ? "Your account has been created successfully."
          : "You are now signed in successfully."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-[#4f9fff] hover:text-[#7cb4ff] transition-colors"
      >
        ← Back to form
      </button>
    </div>
  );
}

// apps/frontend/components/posts/CreatePostModal.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { PostType, PostVisibility, PostDraft } from "@/types/systems";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    type: PostType;
    visibility: PostVisibility;
    imageFiles: File[];
    tags: string[];
    aiGenerated: boolean;
  }) => Promise<void>;
  draft?: PostDraft | null;
  onSaveDraft?: (draft: Omit<PostDraft, "id" | "savedAt">) => void;
}

type PostMode = "text" | "image" | "clone";

const VISIBILITY_OPTIONS: { value: PostVisibility; label: string; icon: string }[] = [
  { value: "public", label: "Everyone", icon: "🌍" },
  { value: "followers", label: "Followers", icon: "👥" },
  { value: "clowder", label: "Clowder only", icon: "🐾" },
  { value: "private", label: "Only me", icon: "🔒" },
];

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  draft,
  onSaveDraft,
}: CreatePostModalProps) {
  const [mode, setMode] = useState<PostMode>("text");
  const [content, setContent] = useState(draft?.content ?? "");
  const [visibility, setVisibility] = useState<PostVisibility>("public");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 2000;

  function handleContentChange(value: string) {
    if (value.length <= MAX_CHARS) {
      setContent(value);
      setCharCount(value.length);
    }
  }

  function handleImageSelect(e: import("react").ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newFiles = [...imageFiles, ...files].slice(0, 4);
    setImageFiles(newFiles);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit() {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        content,
        type: mode === "clone" ? "clone_post" : mode === "image" ? "image" : "text",
        visibility,
        imageFiles,
        tags,
        aiGenerated: mode === "clone",
      });
      handleClose();
    } finally {
      setSubmitting(false);
    }
  }

  function handleSaveDraft() {
    onSaveDraft?.({
      content,
      images: imageFiles,
      type: mode === "clone" ? "clone_post" : mode === "image" ? "image" : "text",
      visibility,
      tags,
    });
  }

  function handleClose() {
    setContent("");
    setImageFiles([]);
    setImagePreviews([]);
    setTags([]);
    setTagInput("");
    setMode("text");
    onClose();
  }

  if (!isOpen) return null;

  const canSubmit = content.trim().length > 0 && !submitting;
  const charPercent = (charCount / MAX_CHARS) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] rounded-2xl border border-white/[0.12] bg-[#0d0d1a]/98 shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className="text-[15px] font-bold text-white">Create Post</h2>
          <div className="flex items-center gap-2">
            {onSaveDraft && content.trim() && (
              <button
                onClick={handleSaveDraft}
                className="px-3 py-1.5 rounded-lg text-[12px] text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all"
              >
                Save Draft
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 px-5 pt-4">
          {(["text", "image", "clone"] as PostMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium capitalize transition-all",
                mode === m
                  ? "bg-[#4f9fff]/15 text-[#4f9fff] border border-[#4f9fff]/25"
                  : "text-white/40 hover:text-white/70 border border-transparent"
              )}
            >
              {m === "text" ? "📝" : m === "image" ? "🖼️" : "🐱"}
              {m === "text" ? "Text" : m === "image" ? "Image" : "Clone Post"}
            </button>
          ))}
        </div>

        {/* Clone mode banner */}
        {mode === "clone" && (
          <div className="mx-5 mt-3 px-3 py-2 rounded-xl bg-[#4f9fff]/[0.07] border border-[#4f9fff]/15 flex items-center gap-2">
            <span className="text-base">🐱</span>
            <p className="text-[12px] text-[#4f9fff]/80">
              Cosmo will write this post in your voice based on your training data.
            </p>
          </div>
        )}

        {/* Content area */}
        <div className="px-5 pt-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/60 shrink-0 mt-0.5">
              {mode === "clone" ? "🐱" : "Me"}
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={
                  mode === "clone"
                    ? "What should Cosmo post about? Give a topic or let it decide…"
                    : mode === "image"
                    ? "Add a caption to your image…"
                    : "What's on your mind? Share with your world…"
                }
                rows={5}
                className="w-full bg-transparent text-[14px] text-white/85 placeholder:text-white/25 outline-none resize-none leading-relaxed"
              />

              {/* Image upload area */}
              {mode === "image" && (
                <div className="mt-3">
                  {imagePreviews.length > 0 ? (
                    <div className={cn(
                      "grid gap-2",
                      imagePreviews.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    )}>
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-white/[0.05]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white text-[11px] hover:bg-black/80 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 4 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-video rounded-xl border-2 border-dashed border-white/[0.1] flex items-center justify-center text-white/25 hover:text-white/50 hover:border-white/[0.2] transition-all"
                        >
                          + Add more
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/50 hover:border-[#4f9fff]/30 hover:bg-[#4f9fff]/[0.03] transition-all"
                    >
                      <span className="text-3xl">🖼️</span>
                      <span className="text-[13px]">Click to upload images</span>
                      <span className="text-[11px] text-white/20">Up to 4 images · JPEG, PNG, WebP</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4f9fff]/10 border border-[#4f9fff]/20 text-[12px] text-[#4f9fff]"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-[#4f9fff]/50 hover:text-[#4f9fff] transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 mt-2 border-t border-white/[0.07]">
          <div className="flex items-center gap-3">
            {/* Tag input */}
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[13px] text-white/25">#</span>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag…"
                className="flex-1 bg-transparent text-[13px] text-white/60 placeholder:text-white/20 outline-none max-w-[120px]"
              />
            </div>

            {/* Visibility */}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostVisibility)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[8px] px-2.5 py-1.5 text-[12px] text-white/50 outline-none cursor-pointer hover:border-white/[0.14] transition-colors"
            >
              {VISIBILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0d0d1a]">
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>

            {/* Char counter */}
            <div className="relative w-7 h-7 shrink-0">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                <circle
                  cx="14" cy="14" r="10" fill="none"
                  stroke={charPercent > 90 ? "#ef4444" : charPercent > 75 ? "#fbbf24" : "#4f9fff"}
                  strokeWidth="2.5"
                  strokeDasharray={`${62.8 * charPercent / 100} 62.8`}
                  className="transition-all duration-300"
                />
              </svg>
              {charPercent > 80 && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/60">
                  {MAX_CHARS - charCount}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-5 py-2 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(79,159,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {submitting ? "Posting…" : mode === "clone" ? "🐱 Let Cosmo Post" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

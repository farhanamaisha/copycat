// apps/frontend/app/(dashboard)/settings/page.tsx
"use client";
import { updateProfile, getCurrentUser } from "@/services/api/user.api";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getMyClone, updateClone } from "@/services/api/clone.api";
import {
  CloneAvatarBuilder,
  CloneAvatarSVG,
  DEFAULT_AVATAR,
  type CloneAvatarConfig,
} from "@/components/avatar/CloneAvatarBuilder";

const TABS = ["Profile", "Clone", "Privacy", "Notifications", "Account"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<CloneAvatarConfig>(DEFAULT_AVATAR);

  const [profile, setProfile] = useState({
    displayName: "Cosmic Whisker",
    username: "cosmic_whisker",
    bio: "Building the future of AI identity. Cat person. Night owl. 🐱",
    email: "cosmic@copycat.ai",
    website: "",
    location: "",
    avatarUrl: "",
  });

  const [cloneSettings, setCloneSettings] = useState({
    cloneName: "",
    allowPublicChat: true,
    shareTrainingData: false,
    autoTrain: true,
    cloneVisibility: "public",
    moodDisplay: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showFollowers: true,
    showFollowing: true,
    allowMessages: "followers",
    showOnlineStatus: true,
    showCloneActivity: true,
  });

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    cloneMessages: true,
    trainingComplete: true,
    clowderInvites: true,
    mentions: true,
    emailDigest: false,
    pushEnabled: true,
  });

  // ── Load real data from backend ──────────────────────────────────────────
  useEffect(() => {
    async function loadSettings() {
      try {
        const user = await getCurrentUser();
        const clone = await getMyClone();

        setProfile((prev) => ({
          ...prev,
          displayName: user.displayName || "",
          username: user.username || "",
          bio: user.bio || "",
          email: user.email || "",
          avatarUrl: user.avatarUrl || "",
        }));

        setCloneSettings((prev) => ({
          ...prev,
          cloneName: clone.name || "",
        }));

        // Load saved avatar config from clone if it exists
        if (clone.avatarConfig) {
          try {
            setAvatarConfig(JSON.parse(clone.avatarConfig));
          } catch {
            // use default if parse fails
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    loadSettings();
  }, []);

  // ── Save to backend ───────────────────────────────────────────────────────
  async function handleSave() {
    try {
      if (tab === "Profile") {
        await updateProfile({
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
        });
      }

      if (tab === "Clone") {
        await updateClone({
          name: cloneSettings.cloneName,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  // ── Save avatar config ────────────────────────────────────────────────────
  async function handleSaveAvatar(config: CloneAvatarConfig) {
    setAvatarConfig(config);
    try {
      await updateClone({
        name: cloneSettings.cloneName,
        avatarConfig: JSON.stringify(config),
      });
    } catch (error) {
      console.error("Failed to save avatar:", error);
    }
  }

  return (
    <div className="px-6 py-6 max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[13px] text-white/40 mt-1">Manage your account, Clone, and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 shrink-0 space-y-0.5">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("w-full text-left px-3 py-2.5 rounded-[9px] text-[13px] font-medium transition-all",
                tab === t ? "bg-[#4f9fff]/15 text-[#4f9fff]" : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              )}>
              {t === "Profile" ? "👤" : t === "Clone" ? "🐱" : t === "Privacy" ? "🔒" : t === "Notifications" ? "🔔" : "⚙️"}{" "}
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">

            {/* ── Profile ── */}
            {tab === "Profile" && (
              <div className="space-y-5">
                <h2 className="text-[15px] font-bold text-white">Profile Settings</h2>
                
<div className="flex items-center gap-4">
  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/10 flex items-center justify-center">
    <CloneAvatarSVG config={avatarConfig} size={64} />
  </div>

  <button
    type="button"
    onClick={() => setTab("Clone")}
    className="px-4 py-2 rounded-lg border border-white/[0.1] text-[13px] text-white/60 hover:text-white hover:border-white/20 transition-all"
  >
    Change Avatar
  </button>
</div>


                {[
                  { label: "Display Name", key: "displayName", placeholder: "Your display name" },
                  { label: "Username", key: "username", placeholder: "username" },
                  { label: "Email", key: "email", placeholder: "you@example.com", type: "email" },
                  { label: "Website", key: "website", placeholder: "https://..." },
                  { label: "Location", key: "location", placeholder: "City, Country" },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-medium text-white/50 mb-1.5">{label}</label>
                    <input type={type ?? "text"} value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#4f9fff]/40 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-medium text-white/50 mb-1.5">Bio</label>
                  <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell the world about yourself..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none resize-none focus:border-[#4f9fff]/40 transition-colors" />
                  <p className="text-[11px] text-white/25 mt-1 text-right">{profile.bio.length}/160</p>
                </div>
              </div>
            )}

            {/* ── Clone ── */}
            {tab === "Clone" && (
              <div className="space-y-5">
                <h2 className="text-[15px] font-bold text-white">Clone Settings</h2>

                {/* Clone name */}
                <div>
                  <label className="block text-[12px] font-medium text-white/50 mb-1.5">Clone Name</label>
                  <input value={cloneSettings.cloneName}
                    onChange={(e) => setCloneSettings((p) => ({ ...p, cloneName: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#4f9fff]/40 transition-colors" />
                </div>

                {/* ── Avatar Builder ── */}
                <div className="rounded-2xl border border-[#4f9fff]/15 bg-[#4f9fff]/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/[0.1] shrink-0">
                      <CloneAvatarSVG config={avatarConfig} size={40} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white">Clone Appearance</p>
                      <p className="text-[11px] text-white/40">
                        Design how {cloneSettings.cloneName || "your Clone"} looks
                      </p>
                    </div>
                  </div>
                  <CloneAvatarBuilder
                    initialConfig={avatarConfig}
                    cloneName={cloneSettings.cloneName || "Your Clone"}
                    onSave={handleSaveAvatar}
                  />
                </div>

                {/* Clone visibility */}
                <div>
                  <label className="block text-[12px] font-medium text-white/50 mb-1.5">Clone Visibility</label>
                  <select value={cloneSettings.cloneVisibility}
                    onChange={(e) => setCloneSettings((p) => ({ ...p, cloneVisibility: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#4f9fff]/40 transition-colors">
                    <option value="public" className="bg-[#0d0d1a]">🌍 Public — Anyone can see</option>
                    <option value="followers" className="bg-[#0d0d1a]">👥 Followers only</option>
                    <option value="private" className="bg-[#0d0d1a]">🔒 Private — Only you</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  {[
                    { key: "allowPublicChat",   label: "Allow public Clone chat",  desc: "Let others chat with your Clone" },
                    { key: "shareTrainingData", label: "Share training insights",  desc: "Help improve the platform anonymously" },
                    { key: "autoTrain",         label: "Auto-training mode",       desc: "Clone learns from your posts automatically" },
                    { key: "moodDisplay",       label: "Show Clone mood",          desc: "Display mood indicator on your profile" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <div>
                        <p className="text-[13px] font-medium text-white">{label}</p>
                        <p className="text-[11px] text-white/35 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setCloneSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={cn("w-10 h-6 rounded-full transition-all duration-200 relative",
                          cloneSettings[key as keyof typeof cloneSettings] ? "bg-[#4f9fff]" : "bg-white/[0.12]"
                        )}>
                        <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                          cloneSettings[key as keyof typeof cloneSettings] ? "left-[calc(100%-22px)]" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Privacy ── */}
            {tab === "Privacy" && (
              <div className="space-y-5">
                <h2 className="text-[15px] font-bold text-white">Privacy Settings</h2>
                <div>
                  <label className="block text-[12px] font-medium text-white/50 mb-1.5">Profile Visibility</label>
                  <select value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy((p) => ({ ...p, profileVisibility: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#4f9fff]/40 transition-colors">
                    <option value="public" className="bg-[#0d0d1a]">🌍 Public</option>
                    <option value="followers" className="bg-[#0d0d1a]">👥 Followers only</option>
                    <option value="private" className="bg-[#0d0d1a]">🔒 Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-white/50 mb-1.5">Who can message you</label>
                  <select value={privacy.allowMessages}
                    onChange={(e) => setPrivacy((p) => ({ ...p, allowMessages: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[9px] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#4f9fff]/40 transition-colors">
                    <option value="everyone" className="bg-[#0d0d1a]">Everyone</option>
                    <option value="followers" className="bg-[#0d0d1a]">Followers only</option>
                    <option value="nobody" className="bg-[#0d0d1a]">Nobody</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "showFollowers",    label: "Show followers count" },
                    { key: "showFollowing",    label: "Show following count" },
                    { key: "showOnlineStatus", label: "Show online status" },
                    { key: "showCloneActivity",label: "Show Clone activity" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <p className="text-[13px] font-medium text-white">{label}</p>
                      <button
                        onClick={() => setPrivacy((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={cn("w-10 h-6 rounded-full transition-all duration-200 relative",
                          privacy[key as keyof typeof privacy] ? "bg-[#4f9fff]" : "bg-white/[0.12]"
                        )}>
                        <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                          privacy[key as keyof typeof privacy] ? "left-[calc(100%-22px)]" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {tab === "Notifications" && (
              <div className="space-y-5">
                <h2 className="text-[15px] font-bold text-white">Notification Settings</h2>
                <div className="space-y-3">
                  {[
                    { key: "likes",            label: "Likes",             desc: "When someone likes your post" },
                    { key: "comments",         label: "Comments",          desc: "When someone comments on your post" },
                    { key: "follows",          label: "New followers",     desc: "When someone follows you" },
                    { key: "cloneMessages",    label: "Clone messages",    desc: "When another Clone messages yours" },
                    { key: "trainingComplete", label: "Training complete", desc: "When a training session finishes" },
                    { key: "clowderInvites",   label: "Clowder invites",   desc: "When you're invited to a Clowder" },
                    { key: "mentions",         label: "Mentions",          desc: "When someone mentions you" },
                    { key: "emailDigest",      label: "Email digest",      desc: "Weekly summary via email" },
                    { key: "pushEnabled",      label: "Push notifications",desc: "Browser push notifications" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <div>
                        <p className="text-[13px] font-medium text-white">{label}</p>
                        <p className="text-[11px] text-white/35 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={cn("w-10 h-6 rounded-full transition-all duration-200 relative shrink-0",
                          notifications[key as keyof typeof notifications] ? "bg-[#4f9fff]" : "bg-white/[0.12]"
                        )}>
                        <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                          notifications[key as keyof typeof notifications] ? "left-[calc(100%-22px)]" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Account ── */}
            {tab === "Account" && (
              <div className="space-y-5">
                <h2 className="text-[15px] font-bold text-white">Account Settings</h2>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-[13px] font-semibold text-white mb-1">Change Password</p>
                  <p className="text-[12px] text-white/40 mb-3">Update your password to keep your account secure.</p>
                  <button className="px-4 py-2 rounded-lg border border-white/[0.1] text-[13px] text-white/60 hover:text-white hover:border-white/20 transition-all">
                    Change Password
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <p className="text-[13px] font-semibold text-white mb-1">Export Data</p>
                  <p className="text-[12px] text-white/40 mb-3">Download all your data including Clone training history and memories.</p>
                  <button className="px-4 py-2 rounded-lg border border-white/[0.1] text-[13px] text-white/60 hover:text-white hover:border-white/20 transition-all">
                    Request Export
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-red-400/15 bg-red-400/[0.04]">
                  <p className="text-[13px] font-semibold text-red-400 mb-1">Danger Zone</p>
                  <p className="text-[12px] text-white/40 mb-3">Permanently delete your account and all associated data including your Clone.</p>
                  <button className="px-4 py-2 rounded-lg border border-red-400/30 text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-400/[0.08] transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* ── Save button ── */}
            {tab !== "Account" && tab !== "Clone" && (
              <div className="mt-6 pt-5 border-t border-white/[0.07] flex items-center justify-between">
                {saved && <p className="text-[13px] text-emerald-400 animate-in fade-in duration-200">✓ Changes saved</p>}
                <button onClick={handleSave} className="ml-auto px-6 py-2.5 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(79,159,255,0.4)] transition-all">
                  Save Changes
                </button>
              </div>
            )}
            {tab === "Clone" && (
              <div className="mt-6 pt-5 border-t border-white/[0.07] flex items-center justify-between">
                {saved && <p className="text-[13px] text-emerald-400 animate-in fade-in duration-200">✓ Changes saved</p>}
                <button onClick={handleSave} className="ml-auto px-6 py-2.5 rounded-[9px] bg-gradient-to-br from-[#4f9fff] to-[#7c6dfa] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(79,159,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(79,159,255,0.4)] transition-all">
                  Save Clone Settings
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
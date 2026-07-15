// apps/frontend/store/uiStore.ts
"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  cloneWidgetOpen: boolean;
  activeModal: string | null;

  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setCloneWidgetOpen: (v: boolean) => void;
  toggleCloneWidget: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  cloneWidgetOpen: false,
  activeModal: null,

  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCloneWidgetOpen: (v) => set({ cloneWidgetOpen: v }),
  toggleCloneWidget: () =>
    set((s) => ({ cloneWidgetOpen: !s.cloneWidgetOpen })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
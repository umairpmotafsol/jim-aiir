"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
  action?: { label: string; href: string };
};

type ToastState = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++;
    set({ toasts: [...get().toasts.slice(-2), { ...toast, id }] });
    setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = {
  success: (message: string, action?: Toast["action"]) => useToasts.getState().push({ tone: "success", message, action }),
  error: (message: string) => useToasts.getState().push({ tone: "error", message }),
  info: (message: string, action?: Toast["action"]) => useToasts.getState().push({ tone: "info", message, action }),
};

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
 * MOCK vendor catalogue edits. Products a vendor creates or edits in the
 * Store Manager are kept locally until the backend product API exists.
 * Edits to seed products are stored as overrides keyed by product id.
 */

export type VendorProductDraft = {
  id: number;
  vendor: string;
  name: string;
  regularPrice: number;
  salePrice: number | null;
  stock: number | null;
  categories: string[];
  description: string;
  image: string | null;
  status: "published" | "draft" | "pending";
  deleted?: boolean;
  isNew?: boolean;
};

type State = {
  drafts: Record<number, VendorProductDraft>;
  save: (draft: VendorProductDraft) => void;
  remove: (draft: VendorProductDraft) => void;
};

export const useVendorProducts = create<State>()(
  persist(
    (set, get) => ({
      drafts: {},
      save: (draft) => set({ drafts: { ...get().drafts, [draft.id]: draft } }),
      remove: (draft) => {
        if (draft.isNew) {
          const rest = { ...get().drafts };
          delete rest[draft.id];
          set({ drafts: rest });
        } else {
          set({ drafts: { ...get().drafts, [draft.id]: { ...draft, deleted: true } } });
        }
      },
    }),
    { name: "aiir-vendor-products" },
  ),
);

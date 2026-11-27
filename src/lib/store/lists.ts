"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type IdListState = {
  ids: number[];
  toggle: (id: number) => boolean;
  remove: (id: number) => void;
  clear: () => void;
};

export const useWishlist = create<IdListState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "aiir-wishlist" },
  ),
);

export const COMPARE_LIMIT = 4;

export const useCompare = create<IdListState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        if (has) {
          set({ ids: get().ids.filter((x) => x !== id) });
          return false;
        }
        // Keep the most recent picks when the limit is reached.
        set({ ids: [...get().ids, id].slice(-COMPARE_LIMIT) });
        return true;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "aiir-compare" },
  ),
);

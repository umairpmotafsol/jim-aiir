"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
 * MOCK AUTHENTICATION (frontend only).
 * Accounts live in the visitor's localStorage so every flow can be exercised
 * before jim-aiir-backend exists. Passwords are NOT secured here. Replace
 * login/register/updateProfile with calls to the backend auth API and keep the
 * session in an HttpOnly cookie.
 */

export type Address = {
  firstName: string;
  lastName: string;
  company?: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  phone?: string;
};

export type Account = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: "customer" | "vendor";
  vendorSlug?: string;
  storeName?: string;
  storePhone?: string;
  storeAbout?: string;
  status?: "active" | "pending";
  billing?: Address;
  shipping?: Address;
};

export type PublicAccount = Omit<Account, "password">;

export type AuthResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  accounts: Account[];
  sessionId: string | null;
  login: (identifier: string, password: string) => AuthResult;
  logout: () => void;
  register: (data: Omit<Account, "id" | "displayName"> & { displayName?: string }) => AuthResult;
  updateProfile: (patch: Partial<Omit<Account, "id" | "role" | "password">>) => AuthResult;
  changePassword: (current: string, next: string) => AuthResult;
};

const demoAccounts: Account[] = [
  {
    id: "u-customer",
    email: "customer@aiir.test",
    password: "Password123!",
    firstName: "Aoife",
    lastName: "Byrne",
    displayName: "Aoife",
    role: "customer",
  },
  {
    id: "u-vendor",
    email: "vendor@aiir.test",
    password: "Password123!",
    firstName: "AIIR",
    lastName: "Labs",
    displayName: "AIIR Labs",
    role: "vendor",
    vendorSlug: "aiir",
    storeName: "AIIR Labs",
    status: "active",
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: demoAccounts,
      sessionId: null,
      login: (identifier, password) => {
        const id = identifier.trim().toLowerCase();
        const account = get().accounts.find(
          (a) => a.email.toLowerCase() === id || a.displayName.toLowerCase() === id,
        );
        // One message for both cases so the form doesn't reveal which accounts exist.
        if (!account || account.password !== password) {
          return { ok: false, error: "Incorrect email or password." };
        }
        set({ sessionId: account.id });
        return { ok: true };
      },
      logout: () => set({ sessionId: null }),
      register: (data) => {
        const email = data.email.trim().toLowerCase();
        if (get().accounts.some((a) => a.email.toLowerCase() === email)) {
          return { ok: false, error: "An account is already registered with that email. Please log in." };
        }
        const account: Account = {
          ...data,
          email,
          id: `u-${crypto.randomUUID()}`,
          displayName: data.displayName || data.firstName || email.split("@")[0],
        };
        set({ accounts: [...get().accounts, account], sessionId: account.id });
        return { ok: true };
      },
      updateProfile: (patch) => {
        const { sessionId, accounts } = get();
        if (!sessionId) return { ok: false, error: "You are not logged in." };
        const nextEmail = patch.email?.trim().toLowerCase();
        if (nextEmail && accounts.some((a) => a.id !== sessionId && a.email === nextEmail)) {
          return { ok: false, error: "That email is already used by another account." };
        }
        set({
          accounts: accounts.map((a) =>
            a.id === sessionId ? { ...a, ...patch, ...(nextEmail ? { email: nextEmail } : {}) } : a,
          ),
        });
        return { ok: true };
      },
      changePassword: (current, next) => {
        const { sessionId, accounts } = get();
        const me = accounts.find((a) => a.id === sessionId);
        if (!me) return { ok: false, error: "You are not logged in." };
        if (me.password !== current) return { ok: false, error: "Your current password is incorrect." };
        set({ accounts: accounts.map((a) => (a.id === sessionId ? { ...a, password: next } : a)) });
        return { ok: true };
      },
    }),
    { name: "aiir-auth" },
  ),
);

/** The logged-in account without its password, or null. */
export function useCurrentUser(): PublicAccount | null {
  const account = useAuth((s) => s.accounts.find((a) => a.id === s.sessionId));
  return useMemo(() => {
    if (!account) return null;
    const rest: PublicAccount & { password?: string } = { ...account };
    delete rest.password;
    return rest;
  }, [account]);
}

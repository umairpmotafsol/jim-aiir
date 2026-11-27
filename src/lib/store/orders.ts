"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "./auth";
import type { CartLine } from "./cart";

/* MOCK ORDER STORAGE. Replace placeOrder with the backend checkout API. */

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type Order = {
  id: string;
  number: number;
  createdAt: string;
  status: OrderStatus;
  customerId: string | null;
  email: string;
  phone: string;
  billing: Address;
  shipping: Address;
  notes?: string;
  lines: CartLine[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingMethod: string;
  shippingTotal: number;
  total: number;
  paymentMethod: string;
};

type OrdersState = {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "number" | "createdAt" | "status">) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (input) => {
        const number = 1000 + get().orders.length + 1;
        const order: Order = {
          ...input,
          id: crypto.randomUUID(),
          number,
          createdAt: new Date().toISOString(),
          status: "processing",
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      setStatus: (id, status) =>
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
    }),
    { name: "aiir-orders" },
  ),
);

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Pending payment",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

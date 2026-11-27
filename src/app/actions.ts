"use server";

import { commentSchema, contactSchema, fieldErrors, inquirySchema, newsletterSchema, reviewSchema } from "@/lib/validation";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function valuesOf(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

/*
 * These actions validate on the server and return field errors or a success
 * message. Delivery (email, CRM, moderation queue) is the backend's job: each
 * TODO marks where to call the jim-aiir-backend API.
 */

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ["name", "email", "subject", "message"]);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }
  // TODO(backend): POST /contact with parsed.data
  return { status: "success", message: "Thanks for getting in touch. We'll reply within two working days." };
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ["email"]);
  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message, errors: fieldErrors(parsed.error), values };
  }
  // TODO(backend): POST /newsletter/subscribers with parsed.data.email
  return { status: "success", message: "You're subscribed. Check your inbox to confirm." };
}

export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ["name", "email", "rating", "review", "productId"]);
  const parsed = reviewSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }
  // TODO(backend): POST /products/{productId}/reviews (held for moderation)
  return { status: "success", message: "Thanks! Your review is awaiting approval." };
}

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ["name", "email", "message", "productId", "vendor"]);
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }
  // TODO(backend): POST /inquiries, routed to the vendor's Store Manager inbox
  return { status: "success", message: "Your question has been sent. The vendor will reply by email." };
}

export async function submitComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ["comment", "name", "email", "website", "post"]);
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }
  // TODO(backend): POST /posts/{post}/comments (held for moderation)
  return { status: "success", message: "Your comment is awaiting moderation." };
}

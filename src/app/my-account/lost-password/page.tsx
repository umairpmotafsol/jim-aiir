import type { Metadata } from "next";
import { LostPasswordForm } from "./lost-password-form";

export const metadata: Metadata = { title: "Lost password" };

export default function LostPasswordPage() {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-line p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Reset your password</h2>
      <p className="mt-2 text-sm text-muted">
        Enter your username or email address. You will receive a link to create a new password by email.
      </p>
      <LostPasswordForm />
    </div>
  );
}

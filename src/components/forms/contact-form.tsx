"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";

const initial: FormState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const v = state.status === "error" ? state.values : undefined;
  const e = state.errors ?? {};

  if (state.status === "success") {
    return <Notice tone="success">{state.message}</Notice>;
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" name="name" autoComplete="name" required defaultValue={v?.name} error={e.name} />
        <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={v?.email} error={e.email} />
      </div>
      <Input label="Subject" name="subject" required defaultValue={v?.subject} error={e.subject} />
      <Textarea label="Message" name="message" required rows={6} defaultValue={v?.message} error={e.message} />
      <Button type="submit" loading={pending}>
        Send message
      </Button>
    </form>
  );
}

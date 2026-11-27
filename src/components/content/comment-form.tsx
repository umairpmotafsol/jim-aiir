"use client";

import { useActionState } from "react";
import { submitComment, type FormState } from "@/app/actions";
import { Checkbox, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";

const initial: FormState = { status: "idle" };

/** WordPress-style "Leave a Reply" form. */
export function CommentForm({ postSlug }: { postSlug: string }) {
  const [state, action, pending] = useActionState(submitComment, initial);
  const v = state.status === "error" ? state.values : undefined;
  const e = state.errors ?? {};

  return (
    <section aria-labelledby="reply-title" className="mt-12">
      <h2 id="reply-title" className="text-2xl font-bold">
        Leave a Reply
      </h2>
      <p className="mt-2 text-sm text-muted">
        Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
      </p>
      {state.status === "success" ? (
        <div className="mt-6">
          <Notice tone="success">{state.message}</Notice>
        </div>
      ) : (
        <form action={action} noValidate className="mt-6 space-y-5">
          <input type="hidden" name="post" value={postSlug} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Name" name="name" placeholder="Enter Name *" autoComplete="name" required defaultValue={v?.name} error={e.name} />
            <Input label="Email" name="email" type="email" placeholder="Enter Email *" autoComplete="email" required defaultValue={v?.email} error={e.email} />
          </div>
          <Input label="Website" name="website" type="url" placeholder="Enter Website" autoComplete="url" defaultValue={v?.website} error={e.website} />
          <Checkbox name="remember" label="Save my name, email, and website in this browser for the next time I comment." />
          <Textarea label="Comment" name="comment" placeholder="Enter Comment" required rows={6} defaultValue={v?.comment} error={e.comment} />
          <Button type="submit" loading={pending}>
            Post Comment
          </Button>
        </form>
      )}
    </section>
  );
}

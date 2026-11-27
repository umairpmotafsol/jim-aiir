"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./button";

/** Modal confirmation built on the native <dialog> element (focus trap and Esc for free). */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-3xl p-0 shadow-2xl backdrop:bg-brand-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-7">
        <div className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600">
          <TriangleAlert className="size-6" aria-hidden />
        </div>
        <h2 id="confirm-title" className="mt-5 text-xl font-bold">
          {title}
        </h2>
        {children ? <div className="mt-2 text-sm leading-6 text-muted">{children}</div> : null}
        <div className="mt-7 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} autoFocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/format";

const control =
  "block w-full rounded-xl border bg-white px-4 text-sm text-ink placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-slate-50";

function controlClass(error?: string, extra?: string) {
  return cn(control, error ? "border-red-400" : "border-line", extra);
}

type FieldShellProps = {
  label: ReactNode;
  id: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FieldShell({ label, id, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required ? (
          <span className="text-red-500" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-slate-400"> (optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & { label: ReactNode; error?: string; hint?: ReactNode; wrapperClassName?: string };

export function Input({ label, error, hint, required, wrapperClassName, className, id, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <FieldShell label={label} id={inputId} error={error} hint={hint} required={required} className={wrapperClassName}>
      <input
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={controlClass(error, cn("h-11", className))}
        {...rest}
      />
    </FieldShell>
  );
}

type TextareaProps = ComponentProps<"textarea"> & { label: ReactNode; error?: string; wrapperClassName?: string };

export function Textarea({ label, error, required, wrapperClassName, className, id, ...rest }: TextareaProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <FieldShell label={label} id={inputId} error={error} required={required} className={wrapperClassName}>
      <textarea
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={controlClass(error, cn("min-h-28 py-2.5", className))}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = ComponentProps<"select"> & {
  label: ReactNode;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
};

export function Select({ label, error, required, options, placeholder, wrapperClassName, className, id, ...rest }: SelectProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <FieldShell label={label} id={inputId} error={error} required={required} className={wrapperClassName}>
      <select
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={controlClass(error, cn("h-11", className))}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type CheckboxProps = ComponentProps<"input"> & { label: ReactNode; error?: string };

export function Checkbox({ label, error, className, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={!!error}
          className="mt-0.5 size-4 rounded border-line accent-brand-600"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "light" | "glass" | "accent";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300",
  secondary: "bg-ink text-white hover:bg-slate-800 disabled:bg-slate-400",
  accent: "bg-accent-500 text-ink hover:bg-accent-400 disabled:opacity-60",
  light: "bg-white text-ink shadow-sm ring-1 ring-line hover:bg-brand-50",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
  outline: "border border-line bg-white text-ink hover:border-brand-400 hover:text-brand-700 disabled:text-slate-400",
  ghost: "text-slate-700 hover:bg-slate-100 disabled:text-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean };

export function Button({ variant, size, className, loading, children, disabled, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };

export function LinkButton({ variant, size, className, ...rest }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/format";

/*
 * Placeholder artwork used wherever a photo will go. Each placeholder gets a
 * soft gradient picked from `seed`, so a grid of products still looks varied.
 * Swap in real media by passing `src`: <Media src={url} ... /> renders the
 * image when there is one and the placeholder otherwise.
 */

// Flat, neutral tones; varied slightly by seed so grids don't look identical.
const palettes = ["bg-slate-100", "bg-slate-50", "bg-zinc-100", "bg-gray-100"];

function hash(seed: string | number) {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type PlaceholderProps = {
  seed?: string | number;
  /** Short caption shown under the icon (e.g. the product name). */
  label?: string;
  className?: string;
  /** Size of the icon tile. */
  size?: "sm" | "md" | "lg";
};

/** Fills its (relatively positioned) parent. */
export function Placeholder({ seed = 0, label, className, size = "md" }: PlaceholderProps) {
  const palette = palettes[hash(seed) % palettes.length];
  const icon = size === "sm" ? "size-4" : size === "lg" ? "size-10" : "size-7";
  return (
    <div
      role="img"
      aria-label={label ? `${label} (image coming soon)` : "Image coming soon"}
      className={cn("absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300", palette, className)}
    >
      <ImageIcon className={icon} strokeWidth={1.5} aria-hidden />
      {label && size !== "sm" ? <span className="max-w-[80%] truncate text-xs font-medium text-slate-400">{label}</span> : null}
    </div>
  );
}

/** A real image when `src` is set, otherwise a placeholder. Fills its parent. */
export function Media({
  src,
  alt,
  sizes,
  priority,
  seed,
  label,
  size,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  seed?: string | number;
  label?: string;
  size?: PlaceholderProps["size"];
  className?: string;
}) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  return <Placeholder seed={seed ?? alt} label={label} size={size} />;
}

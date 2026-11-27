"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, ImageOff, PackageX } from "lucide-react";
import { useCurrentUser } from "@/lib/store/auth";
import { useVendorProducts, type VendorProductDraft } from "@/lib/store/vendor-products";
import { toast } from "@/lib/store/toast";
import { fieldErrors, vendorProductSchema } from "@/lib/validation";
import { Input, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/misc";
import { cn } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { useVendorCatalog } from "./use-vendor-catalog";

type Props = { seed: Product[]; categories: Category[]; library: string[]; mode: "new" | "edit" };

export function ProductForm(props: Props) {
  const user = useCurrentUser();
  const id = Number(useSearchParams().get("id"));
  const catalog = useVendorCatalog(props.seed, user?.vendorSlug);
  if (!user?.vendorSlug) return null;

  if (props.mode === "edit") {
    const existing = catalog.find((p) => p.id === id);
    if (!existing) {
      return (
        <EmptyState icon={<PackageX className="size-7" />} title="Product not found" action={<LinkButton href="/store-manager/products">Back to products</LinkButton>}>
          This product doesn&apos;t exist or doesn&apos;t belong to your store.
        </EmptyState>
      );
    }
    return <Editor {...props} vendor={user.vendorSlug} initial={existing} key={existing.id} />;
  }
  return <Editor {...props} vendor={user.vendorSlug} />;
}

function Editor({ categories, library, vendor, initial }: Props & { vendor: string; initial?: VendorProductDraft }) {
  const router = useRouter();
  const save = useVendorProducts((s) => s.save);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<string>(initial?.image ?? "");
  const [selected, setSelected] = useState<string[]>(initial?.categories ?? []);
  const isNew = !initial;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = vendorProductSchema.safeParse({
      name: fd.get("name"),
      regularPrice: fd.get("regularPrice"),
      salePrice: fd.get("salePrice"),
      stock: fd.get("stock"),
      categories: selected,
      description: fd.get("description"),
      image,
      status: fd.get("status"),
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    const d = parsed.data;
    // TODO(backend): POST/PUT to the vendor products API (with real image upload).
    save({
      id: initial?.id ?? Date.now(),
      vendor,
      name: d.name,
      regularPrice: d.regularPrice,
      salePrice: d.salePrice === "" || d.salePrice === undefined ? null : d.salePrice,
      stock: d.stock === "" || d.stock === undefined ? null : d.stock,
      categories: d.categories,
      description: d.description,
      image: image || null,
      status: d.status,
      isNew: initial ? initial.isNew : true,
    });
    toast.success(isNew ? `${d.name} was added to your store.` : `${d.name} was updated.`);
    router.push("/store-manager/products");
  };

  const e = errors;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">{isNew ? "Add a product" : `Edit “${initial.name}”`}</h2>
          <p className="text-sm text-muted">Fields marked * are required.</p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/store-manager/products" variant="outline">
            Cancel
          </LinkButton>
          <Button type="submit">{isNew ? "Save product" : "Save changes"}</Button>
        </div>
      </div>

      {Object.keys(e).length ? <Notice tone="error">Please fix the highlighted fields.</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="card space-y-5 p-6">
            <h3 className="font-bold">General</h3>
            <Input label="Product name" name="name" required defaultValue={initial?.name} error={e.name} />
            <Textarea label="Description" name="description" required rows={6} defaultValue={initial?.description} error={e.description} />
          </section>

          <section className="card p-6">
            <h3 className="font-bold">Pricing & inventory</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Input label="Regular price" name="regularPrice" type="number" min="0" step="0.01" required defaultValue={initial?.regularPrice} error={e.regularPrice} />
              <Input label="Sale price" name="salePrice" type="number" min="0" step="0.01" defaultValue={initial?.salePrice ?? ""} error={e.salePrice} />
              <Input label="Stock" name="stock" type="number" min="0" step="1" defaultValue={initial?.stock ?? ""} error={e.stock} hint="Leave blank if not tracked." />
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-bold">
              Product image <span className="font-normal text-slate-400">(optional)</span>
            </h3>
            <p className="mt-1 text-sm text-muted">Pick an image from the AIIR library. Uploads arrive with the backend.</p>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6" role="radiogroup" aria-label="Product image">
              <button
                type="button"
                role="radio"
                aria-checked={!image}
                onClick={() => setImage("")}
                className={cn("grid aspect-square place-items-center rounded-xl border-2 bg-surface text-slate-400", !image ? "border-brand-600" : "border-transparent")}
              >
                <ImageOff className="size-5" aria-hidden />
                <span className="sr-only">No image</span>
              </button>
              {library.map((src) => (
                <button
                  key={src}
                  type="button"
                  role="radio"
                  aria-checked={image === src}
                  onClick={() => setImage(src)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                    image === src ? "border-brand-600 ring-4 ring-brand-100" : "border-transparent hover:border-brand-300",
                  )}
                >
                  <Image src={src} alt="" fill sizes="6rem" className="object-cover" />
                  {image === src ? (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-brand-600 text-white">
                      <Check className="size-3" aria-hidden />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="relative grid aspect-square place-items-center bg-surface text-slate-300">
              {image ? <Image src={image} alt="Selected product image" fill sizes="22rem" className="object-cover" /> : <ImageOff className="size-10" aria-hidden />}
            </div>
            <p className="p-4 text-center text-xs text-muted">Preview of your main product image</p>
          </section>

          <fieldset className="card p-6">
            <legend className="sr-only">Visibility</legend>
            <h3 className="font-bold">Visibility</h3>
            <div className="mt-4 space-y-2">
              {[
                { value: "published", label: "Published", text: "Visible in your store and the shop." },
                { value: "draft", label: "Draft", text: "Only you can see it." },
              ].map((o) => (
                <label key={o.value} className="flex cursor-pointer gap-3 rounded-xl border border-line p-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                  <input type="radio" name="status" value={o.value} defaultChecked={(initial?.status ?? "published") === o.value} className="mt-1 accent-brand-600" />
                  <span>
                    <span className="block text-sm font-semibold">{o.label}</span>
                    <span className="text-xs text-muted">{o.text}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="card p-6" aria-describedby={e.categories ? "categories-error" : undefined}>
            <legend className="sr-only">Categories</legend>
            <h3 className="font-bold">
              Categories <span className="text-red-500" aria-hidden>*</span>
            </h3>
            <div className="mt-4 space-y-2">
              {categories.map((c) => (
                <label key={c.slug} className={cn("flex items-center gap-3 text-sm", c.parent && "pl-6")}>
                  <input
                    type="checkbox"
                    checked={selected.includes(c.slug)}
                    onChange={(ev) => setSelected((s) => (ev.target.checked ? [...s, c.slug] : s.filter((x) => x !== c.slug)))}
                    className="size-4 rounded accent-brand-600"
                  />
                  {c.name}
                </label>
              ))}
            </div>
            {e.categories ? (
              <p id="categories-error" className="mt-3 text-xs font-medium text-red-600">
                {e.categories}
              </p>
            ) : null}
          </fieldset>
        </div>
      </div>
    </form>
  );
}

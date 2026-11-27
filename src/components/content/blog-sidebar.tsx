import { Media } from "@/components/ui/placeholder";
import Link from "next/link";
import Form from "next/form";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { getCategoryTree, getProducts } from "@/lib/api/catalog";
import { getPosts } from "@/lib/api/content";
import { Price, Rating } from "@/components/ui/misc";

function Widget({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
      {children}
    </section>
  );
}

const listClass = "divide-y divide-line text-sm";
const itemClass = "py-2.5 first:pt-0 last:pb-0";

/** The blog sidebar widgets, in the order the WordPress blog shows them. */
export async function BlogSidebar() {
  const [posts, { items: rated }, tree] = await Promise.all([getPosts(), getProducts({ sort: "rating", perPage: 3 }), getCategoryTree()]);

  const comments = posts
    .flatMap((p) => p.comments.map((c) => ({ ...c, post: p })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const months = [...new Set(posts.map((p) => p.date.slice(0, 7)))].map((m) => ({
    key: m,
    label: new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
  }));
  const categories = [...new Set(posts.map((p) => p.category))].sort();
  const productCategories = tree.flatMap((c) => [c, ...c.children]).filter((c) => c.count > 0).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <aside className="space-y-8 lg:border-l lg:border-line lg:pl-8">
      <section>
        <Form action="/blog" role="search" className="flex overflow-hidden rounded-md border border-line bg-white">
          <label htmlFor="blog-search" className="sr-only">
            Search for:
          </label>
          <input id="blog-search" name="s" type="search" placeholder="Search..." className="min-w-0 flex-1 px-5 py-2.5 text-sm focus:outline-none" />
          <button type="submit" className="grid w-11 place-items-center bg-ink text-white hover:bg-slate-800" aria-label="Search">
            <Search className="size-4" />
          </button>
        </Form>
      </section>

      <Widget title="Recent Posts">
        <ul className={listClass}>
          {posts.slice(0, 5).map((p) => (
            <li key={p.slug} className={itemClass}>
              <Link href={`/blog/${p.slug}`} className="hover:text-brand-700">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      {comments.length ? (
        <Widget title="Recent Comments">
          <ul className={listClass}>
            {comments.map((c, i) => (
              <li key={i} className={itemClass}>
                {c.author} on{" "}
                <Link href={`/blog/${c.post.slug}#comments`} className="hover:text-brand-700">
                  {c.post.title}
                </Link>
              </li>
            ))}
          </ul>
        </Widget>
      ) : null}

      <Widget title="Archives">
        <ul className={listClass}>
          {months.map((m) => (
            <li key={m.key} className={itemClass}>
              {m.label}
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Categories">
        <ul className={listClass}>
          {categories.map((c) => (
            <li key={c} className={itemClass}>
              <Link href={`/blog?category=${encodeURIComponent(c)}`} className="hover:text-brand-700">
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Products By Rating">
        <ul className={listClass}>
          {rated.map((p) => (
            <li key={p.id} className={`${itemClass} flex items-center justify-between gap-3`}>
              <span>
                <Link href={`/product/${p.slug}`} className="font-medium hover:text-brand-700">
                  {p.name}
                </Link>
                {p.reviewCount ? <Rating value={p.rating} className="mt-1" /> : null}
                <Price price={p.price} regularPrice={p.regularPrice} onSale={p.onSale} className="mt-1 text-sm" />
              </span>
              <span className="relative size-12 shrink-0 overflow-hidden rounded-md">
                <Media src={p.images[0]?.thumb} alt={p.name} sizes="3rem" seed={p.name} size="sm" />
              </span>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Product categories">
        <ul className={listClass}>
          {productCategories.map((c) => (
            <li key={c.slug} className={itemClass}>
              <Link href={`/product-category/${c.parent ? `${c.parent}/` : ""}${c.slug}`} className="hover:text-brand-700">
                {c.name} ({c.count})
              </Link>
            </li>
          ))}
        </ul>
      </Widget>
    </aside>
  );
}

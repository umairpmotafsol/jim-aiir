import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";
import { getPost, getPosts } from "@/lib/api/content";
import { getProducts, getVendors } from "@/lib/api/catalog";
import { Breadcrumbs } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/lib/config";
import { images } from "@/lib/images";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    openGraph: { type: "article", publishedTime: post.date, images: post.image ? [post.image] : undefined },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [posts, { items: products }, vendors] = await Promise.all([getPosts(), getProducts({ sort: "rating", perPage: 3 }), getVendors()]);
  const index = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.legalName },
    image: post.image ? [new URL(post.image, site.url).toString()] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="relative isolate overflow-hidden bg-brand-950 text-white">
        {post.image ? <Image src={post.image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40" /> : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/75 to-brand-950/40" aria-hidden />
        <div className="container-page max-w-4xl py-16 sm:py-24">
          <Breadcrumbs tone="dark" items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-100">
            <span className="flex items-center gap-2">
              <UserRound className="size-4" aria-hidden /> {post.author}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden /> {readingTime(post.content)} min read
            </span>
          </p>
        </div>
      </header>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <article>
          {post.image ? (
            <div className="relative -mt-28 mb-10 aspect-[16/9] overflow-hidden rounded-3xl border-4 border-white shadow-lift">
              <Image src={post.image} alt={post.title} fill sizes="(min-width: 1024px) 48rem, 100vw" className="object-cover" />
            </div>
          ) : null}
          <div className="prose-aiir max-w-3xl text-lg">
            {post.content.map((para, i) => (
              <p key={i} className={i === 0 ? "!text-xl !leading-8 !text-ink" : undefined}>
                {para}
              </p>
            ))}
          </div>

          <nav aria-label="More articles" className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {older ? (
              <Link href={`/blog/${older.slug}`} className="card group p-5 hover:border-brand-300">
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  <ArrowLeft className="size-3.5" aria-hidden /> Previous
                </span>
                <span className="mt-2 block font-bold group-hover:text-brand-700">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={`/blog/${newer.slug}`} className="card group p-5 text-right hover:border-brand-300">
                <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  Next <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="mt-2 block font-bold group-hover:text-brand-700">{newer.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        <aside className="space-y-8">
          <section className="card p-6">
            <h2 className="text-lg font-bold">More from the blog</h2>
            <ul className="mt-5 space-y-5">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex gap-4">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-brand-100">
                      {p.image ? <Image src={p.image} alt="" fill sizes="4rem" className="object-cover" /> : null}
                    </span>
                    <span>
                      <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand-700">{p.title}</span>
                      <time dateTime={p.date} className="mt-1 block text-xs text-muted">
                        {formatDate(p.date)}
                      </time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold">Top-rated on AIIR</h2>
            <ul className="mt-5 space-y-4">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}`} className="group flex items-center gap-4">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                      {p.images[0] ? <Image src={p.images[0].thumb} alt="" fill sizes="3.5rem" className="object-cover" /> : null}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold group-hover:text-brand-700">{p.name}</span>
                      <span className="text-xs text-muted">{vendors.find((v) => v.slug === p.vendor)?.name ?? "AIIR"}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative isolate overflow-hidden rounded-2xl p-6 text-white">
            <Image src={images.heroRobot} alt="" fill sizes="20rem" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent" aria-hidden />
            <p className="mt-16 text-lg font-bold">Explore AI tools built by the community</p>
            <LinkButton href="/shop" variant="light" size="sm" className="mt-4">
              Visit the shop <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </section>
        </aside>
      </div>
    </>
  );
}

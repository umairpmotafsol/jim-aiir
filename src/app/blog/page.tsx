import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";
import { getPosts } from "@/lib/api/content";
import { PageHeader } from "@/components/ui/misc";
import { formatDate, readingTime } from "@/lib/format";
import { images } from "@/lib/images";
import type { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, trends and practical guides on artificial intelligence from the AIIR community.",
};

function Meta({ post, light }: { post: Post; light?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium ${light ? "text-brand-100" : "text-muted"}`}>
      <span className="flex items-center gap-1.5">
        <CalendarDays className="size-3.5" aria-hidden />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span className="flex items-center gap-1.5">
        <UserRound className="size-3.5" aria-hidden /> {post.author}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden /> {readingTime(post.content)} min read
      </span>
    </p>
  );
}

export default async function BlogPage() {
  const [featured, ...rest] = await getPosts();

  return (
    <>
      <PageHeader title="Insights on AI" eyebrow="The AIIR blog" image={images.robotDark} crumbs={[{ label: "Blog" }]}>
        Ideas, trends and practical guides from the people building with artificial intelligence.
      </PageHeader>

      <div className="container-page py-14">
        {featured ? (
          <article className="group relative isolate grid overflow-hidden rounded-3xl bg-brand-950 text-white lg:grid-cols-2">
            <div className="relative min-h-72 lg:min-h-[26rem]">
              {featured.image ? (
                <Image src={featured.image} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : null}
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">Featured article</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 line-clamp-3 leading-7 text-brand-100">{featured.excerpt}</p>
              <div className="mt-6">
                <Meta post={featured} light />
              </div>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-900 transition-colors group-hover:bg-accent-400">
                Read article <ArrowRight className="size-4" aria-hidden />
              </span>
            </div>
          </article>
        ) : null}

        {rest.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article key={post.slug} className="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
                  {post.image ? (
                    <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Meta post={post} />
                  <h2 className="mt-3 text-xl font-bold leading-snug">
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-brand-700">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{post.excerpt}</p>
                  <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

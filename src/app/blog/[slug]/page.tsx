import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";
import { getPost, getPosts } from "@/lib/api/content";
import { PageHeader } from "@/components/ui/misc";
import { Media } from "@/components/ui/placeholder";
import { PostMeta } from "@/components/content/post-meta";
import { CommentForm } from "@/components/content/comment-form";
import { site } from "@/lib/config";

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

/** "October 28, 2025 at 7:48 am", the WordPress comment date format. */
function commentDate(iso: string) {
  const d = new Date(`${iso}Z`);
  const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).toLowerCase();
  return `${date} at ${time}`;
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.legalName },
    image: post.image ? [new URL(post.image, site.url).toString()] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader crumbs={[{ label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` }, { label: post.title }]} />

      <div className="py-14">
        <div className="container-page max-w-3xl">
          <article>
            <PostMeta post={post} />
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
              <Media src={post.image} alt={post.title} priority sizes="(min-width: 1024px) 48rem, 100vw" seed={post.slug} size="lg" />
            </div>
            <div>
              <div className="prose-aiir mt-10 text-lg">
                {post.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </article>

          {older || newer ? (
            <nav aria-label="Posts" className="mt-12 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
              {older ? (
                <Link href={`/blog/${older.slug}`} className="group rounded-lg border border-line bg-white p-6 transition-shadow hover:shadow-card">
                  <span className="block font-bold group-hover:text-brand-700">{older.title}</span>
                  <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted">
                    <ArrowLeft className="size-3.5" aria-hidden /> Previous Post
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link href={`/blog/${newer.slug}`} className="group rounded-lg border border-line bg-white p-6 text-right transition-shadow hover:shadow-card">
                  <span className="block font-bold group-hover:text-brand-700">{newer.title}</span>
                  <span className="mt-2 flex items-center justify-end gap-1 text-xs font-semibold text-muted">
                    Next Post <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              ) : null}
            </nav>
          ) : null}

          <div className="mt-12 rounded-lg bg-surface p-6 sm:p-10">
            {post.comments.length ? (
              <section id="comments" aria-labelledby="comments-title">
                <h2 id="comments-title" className="text-2xl font-bold">
                  {post.comments.length} Comment{post.comments.length === 1 ? "" : "s"}
                </h2>
                <ol className="mt-6 divide-y divide-line">
                  {post.comments.map((c, i) => (
                    <li key={i} className="flex gap-5 py-6">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-slate-400 ring-1 ring-line">
                        <UserRound className="size-7" aria-hidden />
                      </span>
                      <div>
                        <p className="font-semibold">{c.author}</p>
                        <time dateTime={c.date} className="text-xs text-muted">
                          {commentDate(c.date)}
                        </time>
                        <p className="mt-3 text-slate-700">{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            <CommentForm postSlug={post.slug} />
          </div>
        </div>
      </div>
    </>
  );
}

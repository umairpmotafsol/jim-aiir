import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Media } from "@/components/ui/placeholder";
import { getPosts } from "@/lib/api/content";
import { Notice, PageHeader, Skeleton } from "@/components/ui/misc";
import { BlogSidebar } from "@/components/content/blog-sidebar";
import { PostMeta } from "@/components/content/post-meta";
import type { Post } from "@/lib/types";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <>
      <PageHeader crumbs={[{ label: "Blog" }]} />
      <div className="container-page py-14">
        <p className="eyebrow">Blog</p>
        <h1 className="mb-10 mt-3 text-4xl font-bold tracking-tight">Latest articles</h1>
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <Suspense fallback={<Skeleton className="h-[40rem]" />}>
            {searchParams.then((sp) => (
              <PostList search={typeof sp.s === "string" ? sp.s : ""} category={typeof sp.category === "string" ? sp.category : ""} />
            ))}
          </Suspense>
          <BlogSidebar />
        </div>
      </div>
    </>
  );
}

async function PostList({ search, category }: { search: string; category: string }) {
  const q = search.trim().toLowerCase();
  const posts = (await getPosts()).filter(
    (p) =>
      (!category || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.content.join(" ").toLowerCase().includes(q)),
  );

  if (!posts.length) {
    return (
      <div>
        <Notice>Sorry, but nothing matched your search terms. Please try again with some different keywords.</Notice>
      </div>
    );
  }
  return (
    <div className="grid content-start gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-slate-300">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden border-b border-line">
        <Media src={post.image} alt="" sizes="(min-width: 1024px) 26rem, 100vw" seed={post.slug} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <PostMeta post={post} />
        <h2 className="mt-3 text-lg font-bold leading-snug">
          <Link href={href} className="hover:text-brand-700">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p>
        <Link href={href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 transition-all">
          Continue Reading <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

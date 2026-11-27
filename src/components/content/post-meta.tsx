import { Folder, MessageSquare, UserRound } from "lucide-react";
import type { Post } from "@/lib/types";

/** Author, category and comment count, as shown above each post. */
export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium text-muted">
      <span className="flex items-center gap-1.5 capitalize">
        <UserRound className="size-3.5" aria-hidden /> {post.author}
      </span>
      <span className="flex items-center gap-1.5">
        <Folder className="size-3.5" aria-hidden /> {post.category}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageSquare className="size-3.5" aria-hidden /> {post.comments.length}
      </span>
    </p>
  );
}

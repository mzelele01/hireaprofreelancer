import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { BlogPost, formatPostDate, readingTime } from "@/lib/storefront/blogs";
import Link from "next/link";

export default function PostCard({ post }: { post: BlogPost }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category)?.name;
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="space-y-2">
        {category ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">{category}</p>
        ) : null}
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold leading-snug text-neutral-900 group-hover:underline">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
          {post.excerpt || post.metaDescription}
        </p>
        <p className="text-xs text-neutral-500">
          {formatPostDate(post.publishedAt || post.createdAt)} · {readingTime(post.content)} min read
        </p>
      </div>
    </Link>
  );
}

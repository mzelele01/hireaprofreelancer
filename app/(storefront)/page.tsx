import CategoryChips from "components/blog/category-chips";
import PostCard from "components/blog/post-card";
import { formatPostDate, getBlogPosts, readingTime } from "lib/storefront/blogs";
import { getStoreSettings } from "lib/storefront/settings";
import { baseUrl } from "lib/utils";
import Link from "next/link";

export const revalidate = 300;

export async function generateMetadata() {
  let title = "Blog";
  let description = "Articles, guides and updates.";
  try {
    const settings = await getStoreSettings();
    title = settings.metaTitle || settings.storeName || title;
    description = settings.metaDescription || description;
  } catch {
    // fall back to defaults
  }
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/` },
    openGraph: { type: "website", title, description, url: baseUrl },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const { posts } = await getBlogPosts({ page: 1, limit: 10 });
  const [featured, ...latest] = posts;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid items-center gap-8 md:grid-cols-2 md:gap-12"
        >
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
            {featured.featuredImage ? (
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Featured</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight text-neutral-900 group-hover:underline md:text-5xl">
              {featured.title}
            </h1>
            <p className="line-clamp-4 text-lg leading-relaxed text-neutral-600">
              {featured.excerpt || featured.metaDescription}
            </p>
            <p className="text-sm text-neutral-500">
              {formatPostDate(featured.publishedAt || featured.createdAt)} · {readingTime(featured.content)} min read
            </p>
          </div>
        </Link>
      ) : (
        <div className="py-20 text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-neutral-900">Welcome</h1>
          <p className="mt-3 text-neutral-600">No posts published yet. Check back soon.</p>
        </div>
      )}

      <div className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Browse by topic
        </h2>
        <CategoryChips />
      </div>

      {latest.length > 0 && (
        <div className="mt-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-neutral-900">
              Latest posts
            </h2>
            <Link href="/blog" className="text-sm font-medium text-neutral-700 hover:underline">
              View all posts →
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

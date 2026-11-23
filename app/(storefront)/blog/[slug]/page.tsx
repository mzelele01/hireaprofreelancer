import ArticleBody from "@/components/blog/article-body";
import PostCard from "@/components/blog/post-card";
import TableOfContents from "@/components/blog/table-of-contents";
import { getCategory } from "@/lib/blog-categories";
import { processArticle } from "@/lib/blog-content";
import { formatPostDate, getBlogPost, getRelatedPosts, readingTime } from "@/lib/storefront/blogs";
import { baseUrl } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return notFound();
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toString(),
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return notFound();

  const related = await getRelatedPosts(post.category, post.slug, 3);
  const published = post.publishedAt || post.createdAt;
  const category = getCategory(post.category);
  const { html, toc } = processArticle(post.content, post.title);
  const showToc = toc.length >= 3;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    articleSection: category?.name,
    keywords: post.tags?.join(", "),
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: new Date(published).toISOString(),
    dateModified: new Date(post.updatedAt || published).toISOString(),
    author: { "@type": "Person", name: post.author || "Editorial Team" },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="pb-14">
        <header className="mx-auto max-w-3xl px-4 pt-10 text-center md:pt-14">
          {category ? (
            <Link
              href={`/blog/category/${post.category}`}
              className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:underline"
            >
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 text-xl leading-relaxed text-neutral-600">{post.excerpt}</p>
          ) : null}
          <p className="mt-6 text-sm text-neutral-500">
            {post.author ? (
              <>
                By <span className="font-medium text-neutral-800">{post.author}</span> ·{" "}
              </>
            ) : null}
            {formatPostDate(published, true)} · {readingTime(post.content)} min read
          </p>
        </header>

        {post.featuredImage ? (
          <div className="mx-auto mt-10 max-w-5xl px-4">
            <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
              <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}

        <div
          className={`mx-auto mt-12 grid max-w-6xl gap-12 px-4 lg:justify-center ${
            showToc ? "lg:grid-cols-[minmax(0,720px)_240px]" : "lg:grid-cols-[minmax(0,720px)]"
          }`}
        >
          <div>
            {showToc ? <TableOfContents items={toc} variant="inline" /> : null}

            <ArticleBody html={html} />

            {post.tags && post.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-400"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            ) : null}

            {post.author ? (
              <div className="mt-12 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-lg font-semibold text-white">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">Written by</p>
                  <p className="font-semibold text-neutral-900">{post.author}</p>
                </div>
              </div>
            ) : null}
          </div>

          {showToc ? <TableOfContents items={toc} variant="sidebar" /> : null}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-neutral-900">
              Keep reading
            </h2>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id.toString()} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

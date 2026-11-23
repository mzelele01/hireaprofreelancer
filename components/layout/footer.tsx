import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { getMenu } from "lib/storefront/content";
import { getStoreSettings } from "lib/storefront/settings";
import Link from "next/link";

export default async function Footer() {
  const [menu, settings] = await Promise.all([
    getMenu("next-js-frontend-footer-menu"),
    getStoreSettings(),
  ]);

  const linkClass = "text-sm text-neutral-600 hover:text-neutral-900 hover:underline";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-neutral-900">
            {settings.storeName}
          </p>
          {settings.metaDescription ? (
            <p className="max-w-xs text-sm leading-relaxed text-neutral-600">{settings.metaDescription}</p>
          ) : null}
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Topics</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/blog" className={linkClass}>All posts</Link>
            </li>
            {BLOG_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/blog/category/${c.slug}`} className={linkClass}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">More</h3>
          <ul className="space-y-2">
            {menu.map((item: { title: string; path: string }) => (
              <li key={item.path}>
                <Link href={item.path} className={linkClass}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-100 py-5 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
      </div>
    </footer>
  );
}

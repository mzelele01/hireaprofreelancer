"use client";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import clsx from "clsx";
import { Menu } from "lib/sfcc/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar({
  pages = [],
  settings,
}: {
  menu?: any[];
  categories?: any[];
  pages?: Menu[];
  settings: Record<string, any>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = Boolean(settings?.navbarDark);

  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/blog", label: "Blog", active: pathname === "/blog" },
    ...BLOG_CATEGORIES.map((c) => ({
      href: `/blog/category/${c.slug}`,
      label: c.name,
      active: pathname === `/blog/category/${c.slug}`,
    })),
  ];

  const linkClass = (active: boolean) =>
    clsx(
      "whitespace-nowrap text-sm font-medium transition-colors",
      active
        ? dark ? "text-white" : "text-neutral-900"
        : dark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900",
    );

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b backdrop-blur",
        dark ? "border-neutral-800 bg-black/95" : "border-neutral-200 bg-white/95",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName}
              className="h-8 w-auto max-w-[160px] object-contain md:h-10"
            />
          ) : (
            <span
              className={clsx(
                "font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight",
                dark ? "text-white" : "text-neutral-900",
              )}
            >
              {settings.storeName}
            </span>
          )}
        </Link>

        <nav className="scrollbar-hide hidden items-center gap-6 overflow-x-auto md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.active)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={clsx("p-2 md:hidden", dark ? "text-white" : "text-neutral-900")}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className={clsx("border-t px-4 py-4 md:hidden", dark ? "border-neutral-800 bg-black" : "border-neutral-200 bg-white")}>
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className={clsx("block py-1 text-base", linkClass(l.active))}>
                  {l.label}
                </Link>
              </li>
            ))}
            {pages.length > 0 && <li className="my-1 border-t border-neutral-200" />}
            {pages.map((p) => (
              <li key={p.path}>
                <Link href={p.path} onClick={() => setOpen(false)} className={clsx("block py-1 text-base", linkClass(false))}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

"use client";

import type { TocItem } from "@/lib/blog-content";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function TableOfContents({
  items,
  variant,
}: {
  items: TocItem[];
  variant: "sidebar" | "inline";
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ul className="space-y-2 border-l border-neutral-200">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            className={clsx(
              "-ml-px block border-l-2 py-0.5 text-sm leading-snug transition-colors",
              i.level === 3 ? "pl-7" : "pl-4",
              active === i.id
                ? "border-red-600 font-medium text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-900",
            )}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "inline") {
    return (
      <details className="mb-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-neutral-900">In this article</summary>
        <nav aria-label="Table of contents" className="mt-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <aside className="hidden lg:block">
      <nav aria-label="Table of contents" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">On this page</p>
        {list}
      </nav>
    </aside>
  );
}

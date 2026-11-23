export type TocItem = { id: string; text: string; level: 2 | 3 };

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const decode = (v: string) =>
  v
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");

const stripTags = (v: string) => decode(v.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

const normalize = (v: string) => v.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const slugify = (v: string) =>
  v
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

export function processArticle(raw: string, title: string): { html: string; toc: TocItem[] } {
  let html = raw || "";

  // Plain-text fallback
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    html = html
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => `<p>${escapeHtml(b).replace(/\n/g, "<br />")}</p>`)
      .join("");
  }

  // Drop a leading heading that just repeats the post title
  const lead = html.match(/^\s*<h([12])[^>]*>([\s\S]*?)<\/h\1>/i);
  if (lead && lead[2] && normalize(stripTags(lead[2])) === normalize(title)) {
    html = html.slice(lead[0].length);
  }

  // Keep a single H1 on the page (the post title)
  html = html.replace(/<h1(\s[^>]*)?>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");

  // Add ids to H2/H3 and collect the table of contents
  const used = new Set<string>();
  const toc: TocItem[] = [];
  html = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = stripTags(inner);
    if (!text) return match;
    const base = slugify(text);
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    const cleanAttrs = String(attrs).replace(/\sid="[^"]*"/i, "");
    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
  });

  return { html, toc };
}

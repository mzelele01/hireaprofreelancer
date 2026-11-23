export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg prose-neutral max-w-none text-neutral-700 prose-headings:scroll-mt-28 prose-headings:font-[family-name:var(--font-playfair)] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900 prose-h2:mb-4 prose-h2:mt-12 prose-h2:text-3xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-2xl prose-p:my-5 prose-p:leading-8 prose-a:font-medium prose-a:text-red-600 prose-a:underline prose-a:underline-offset-4 prose-a:hover:text-red-700 prose-strong:text-neutral-900 prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-neutral-600 prose-img:my-8 prose-img:rounded-xl prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-hr:my-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

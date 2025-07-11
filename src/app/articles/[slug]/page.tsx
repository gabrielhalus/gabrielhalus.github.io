import { notFound } from "next/navigation";
import { articles } from "../_articles";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((article) => article.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      {/* Article Header */}
      <div className="space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl">{article.title}</h1>
          <p className="text-lg text-gray-600">{article.description}</p>
          <p className="text-gray-500">
            {article.author} - {article.readTime} min read &bull; {article.date}
          </p>
        </div>
        <MarkdownRenderer content={article.markdown} />
      </div>
    </div>
  );
}

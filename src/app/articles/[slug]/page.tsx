import { articles } from "../_articles";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const article = articles.find((article) => article.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-lg text-slate-600 leading-relaxed">
                  {article.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="pt-6">
            <MarkdownRenderer content={article.markdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

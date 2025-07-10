"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Copy, Code2, Check, ExternalLink, Quote } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());

  const copyCodeBlock = async (
    code: string,
    blockId: string,
    language: string,
  ) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks((prev) => new Set([...prev, blockId]));
      toast.success(`${language} code copied to clipboard!`);

      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy code");
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <TooltipProvider>
      <div className={`prose prose-slate max-w-none ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Code blocks with syntax highlighting and copy functionality
            code({
              className,
              children,
              inline,
            }: React.DetailedHTMLProps<
              React.HTMLAttributes<HTMLElement>,
              HTMLElement
            > & { inline?: boolean }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              const language = match?.[1] || "text";
              const blockId = `${language}-${codeString.slice(
                0,
                20,
              )}-${Math.random()}`;

              return !inline && match ? (
                <div className="relative group my-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <Badge variant="secondary" className="text-xs font-mono">
                      <Code2 className="w-3 h-3 mr-1" />
                      {language}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyCodeBlock(codeString, blockId, language)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 px-2">
                          {copiedBlocks.has(blockId) ? (
                            <>
                              <Check className="w-3 h-3 mr-1 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy {language} code</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    PreTag="div"
                    className="rounded-lg !bg-slate-900 shadow-sm"
                    customStyle={
                      {
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.6",
                        padding: "1rem",
                      } as React.CSSProperties
                    }>
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm font-mono">
                  {children}
                </code>
              );
            },

            // Enhanced tables
            table({ children }) {
              return (
                <Card className="my-6 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">{children}</table>
                  </div>
                </Card>
              );
            },
            thead({ children }) {
              return <thead className="bg-slate-50">{children}</thead>;
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-4 py-3 text-sm text-slate-900">{children}</td>
              );
            },

            // Enhanced blockquotes
            blockquote({ children }) {
              return (
                <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 my-6">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="text-slate-700">{children}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            },

            // Enhanced headings
            h1({ children }) {
              return (
                <div className="my-8">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    {children}
                  </h1>
                  <Separator />
                </div>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8 pb-2">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">
                  {children}
                </h3>
              );
            },
            h4({ children }) {
              return (
                <h4 className="text-lg font-semibold text-slate-800 mb-2 mt-4">
                  {children}
                </h4>
              );
            },

            // Enhanced links
            a({ href, children }) {
              const isExternal = href?.startsWith("http");
              return (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-400 transition-colors inline-flex items-center gap-1"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}>
                  {children}
                  {isExternal && <ExternalLink className="w-3 h-3" />}
                </a>
              );
            },

            // Enhanced lists
            ul({ children }) {
              return <ul className="space-y-2 my-4">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="space-y-2 my-4">{children}</ol>;
            },
            li({ children }) {
              return (
                <li className="text-slate-700 leading-relaxed">{children}</li>
              );
            },

            // Enhanced paragraphs
            p({ children }) {
              return (
                <p className="text-slate-700 leading-relaxed my-4">
                  {children}
                </p>
              );
            },

            // Enhanced horizontal rules
            hr() {
              return <Separator className="my-8" />;
            },

            // Enhanced images
            img({ src, alt }) {
              return (
                <Card className="my-6 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  {alt && (
                    <CardContent className="pt-3">
                      <p className="text-sm text-slate-600 text-center italic">
                        {alt}
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            },
          }}>
          {content}
        </ReactMarkdown>
      </div>
    </TooltipProvider>
  );
}

import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <article className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Enhanced tables
          table({ children }) {
            return (
              <div className="my-6 w-full overflow-x-auto">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          tr({ children }) {
            return (
              <tr className="even:bg-muted border-t border-gray-200">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-sm">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-200 px-4 py-2 text-sm text-slate-700">
                {children}
              </td>
            );
          },

          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="mt-6 border-l-4 border-gray-200 pl-6 italic text-gray-600">
                {children}
              </blockquote>
            );
          },

          // Headings
          h1({ children }) {
            return (
              <h1 className="scroll-m-20 text-4xl font-bold leading-tight tracking-tight text-center mb-4">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="scroll-m-20 mt-10 border-b pb-2 text-3xl font-semibold tracking-tight">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="scroll-m-20 mt-8 text-2xl font-semibold tracking-tight">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="scroll-m-20 mt-6 text-xl font-semibold tracking-tight">
                {children}
              </h4>
            );
          },

          // Links
          a({ href, children }) {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                className="text-blue-600 underline decoration-blue-300 hover:text-blue-800 hover:decoration-blue-500 transition-colors inline-flex items-center gap-1"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={
                  typeof children === "string" ? children : undefined
                }>
                {children}
                {isExternal && <ExternalLink className="w-3 h-3" />}
              </a>
            );
          },

          // Lists
          ul({ children }) {
            return (
              <ul className="my-4 list-disc list-inside space-y-2">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return <ol className="my-4 list-decimal space-y-2">{children}</ol>;
          },
          li({ children }) {
            return (
              <li className="text-slate-700 leading-relaxed ">{children}</li>
            );
          },

          // Paragraphs
          p({ children }) {
            return <p className="leading-7 my-4 text-slate-800 ">{children}</p>;
          },

          // Strong
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },

          // Horizontal rule
          hr() {
            return <Separator className="my-8" />;
          },

          // Images
          img({ src, alt }) {
            return (
              <figure className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || "/placeholder.svg"}
                  alt={alt || ""}
                  className="w-full h-auto rounded-md border border-gray-200"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="pt-3 text-sm text-center text-slate-600 italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}>
        {content}
      </ReactMarkdown>
    </article>
  );
}

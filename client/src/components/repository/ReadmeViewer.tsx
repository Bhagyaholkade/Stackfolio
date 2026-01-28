import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookOpen } from 'lucide-react';

interface ReadmeViewerProps {
  content: string;
  filename?: string;
}

export function ReadmeViewer({ content, filename = 'README.md' }: ReadmeViewerProps) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{filename}</span>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !className;

              if (isInline) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm" {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match ? match[1] : 'text'}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            },
            a({ href, children, ...props }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            h1({ children, ...props }) {
              return (
                <h1 className="text-2xl font-bold border-b pb-2 mb-4" {...props}>
                  {children}
                </h1>
              );
            },
            h2({ children, ...props }) {
              return (
                <h2 className="text-xl font-semibold border-b pb-2 mb-3 mt-6" {...props}>
                  {children}
                </h2>
              );
            },
            h3({ children, ...props }) {
              return (
                <h3 className="text-lg font-semibold mb-2 mt-4" {...props}>
                  {children}
                </h3>
              );
            },
            ul({ children, ...props }) {
              return (
                <ul className="list-disc pl-6 my-2" {...props}>
                  {children}
                </ul>
              );
            },
            ol({ children, ...props }) {
              return (
                <ol className="list-decimal pl-6 my-2" {...props}>
                  {children}
                </ol>
              );
            },
            li({ children, ...props }) {
              return (
                <li className="my-1" {...props}>
                  {children}
                </li>
              );
            },
            blockquote({ children, ...props }) {
              return (
                <blockquote
                  className="border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground my-4"
                  {...props}
                >
                  {children}
                </blockquote>
              );
            },
            table({ children, ...props }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border" {...props}>
                    {children}
                  </table>
                </div>
              );
            },
            th({ children, ...props }) {
              return (
                <th className="border px-4 py-2 bg-muted text-left" {...props}>
                  {children}
                </th>
              );
            },
            td({ children, ...props }) {
              return (
                <td className="border px-4 py-2" {...props}>
                  {children}
                </td>
              );
            },
            img({ src, alt, ...props }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg"
                  loading="lazy"
                  {...props}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default ReadmeViewer;

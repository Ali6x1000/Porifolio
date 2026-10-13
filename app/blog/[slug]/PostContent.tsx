'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { ReactNode } from "react";

// Define component props and the BlogPost interface
interface BlogPost {
  id: string; title: string; excerpt: string; date: string; readTime: string; slug: string; tags: string[]; content: string; featuredImage?: string;
}
type CodeProps = { node?: any; inline?: boolean; className?: string; children: ReactNode; } & React.HTMLAttributes<HTMLElement>;

const components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="bg-[#0d1117] text-slate-100 border border-border p-4 rounded-lg overflow-x-auto my-6 shadow-lg">
        <code className={`language-${match[1]}`} {...props}>{children}</code>
      </pre>
    ) : (
      <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
    );
  },
  img: ({node, ...props}: {node?: any, src?: string, alt?: string}) => (
    <img className="max-w-full h-auto rounded-lg my-6 shadow-lg" {...props} />
  )
};

// This is the Client Component for displaying the post
export default function PostContent({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand hover:text-brand/80 mb-8 transition-colors">
        <ArrowLeft size={20} />
        Back to Blog
      </Link>

      {post.featuredImage && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img src={post.featuredImage} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        </div>
      )}

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {post.readTime}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
          ))}
        </div>
      </header>

      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-brand">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw, rehypePrism]}
          components={components}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}
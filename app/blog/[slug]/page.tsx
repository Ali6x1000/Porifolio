'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import 'prism-themes/themes/prism-vsc-dark-plus.css'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeRaw from "rehype-raw";
import { ReactNode } from "react";
import { list } from '@vercel/blob';

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>;

// CORRECTED: Add an 'img' component to handle image rendering and styling
const components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-6 shadow-lg">
        <code className={`language-${match[1]}`} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
  // Add this img component to style your markdown images
  img: ({node, ...props}: {node?: any, src?: string, alt?: string}) => (
    <img 
      className="max-w-full h-auto rounded-lg my-6 shadow-lg" 
      {...props} 
    />
  )
};

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  tags: string[]
  content: string
  featuredImage?: string
}





function getBlogPost(slug: string): BlogPost | null {
  if (typeof window === 'undefined') return null
  
  const savedPosts = localStorage.getItem('blog-posts')
  if (!savedPosts) return null
  
  try {
    const posts: BlogPost[] = JSON.parse(savedPosts)
    return posts.find(post => post.slug === slug) || null
  } catch (error) {
    console.error('Error parsing blog posts:', error)
    return null
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return;
      
      setLoading(true);
      try {
        // List blobs to find the correct URL for the given slug
        const { blobs } = await list({ prefix: `posts/${params.slug}.json` });
        if (blobs.length > 0) {
          const postUrl = blobs[0].url;
          const response = await fetch(postUrl); // Fetch the JSON file directly
          const foundPost = await response.json();
          setPost(foundPost);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      }
      setLoading(false);
    };

    fetchPost();
  }, [params.slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        .fraction {
          display: inline-flex;
          flex-direction: column;
          vertical-align: middle;
          text-align: center;
          font-size: 0.9em;
        }
        .numerator {
          border-bottom: 1px solid currentColor;
          padding-bottom: 2px;
        }
        .denominator {
          padding-top: 2px;
        }
        .fraction-bar {
          height: 1px;
          background: currentColor;
          margin: 1px 0;
        }
        .math-block {
          border-left: 4px solid #3b82f6;
        }
        .katex-html {
          line-height: 1.4;
        }
      `}</style>
  
      <article className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
  
            {post.featuredImage && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}
  
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readTime}
                </div>
              </div>
  
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
  
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
  
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
  
            <div className="prose prose-lg max-w-none">
            <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex, rehypeRaw, rehypePrism]}
    components={components}
  >
    {post.content}
  </ReactMarkdown>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
  
}

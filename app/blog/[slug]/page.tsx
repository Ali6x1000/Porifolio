'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

// This would typically fetch from your CMS or markdown files
function getBlogPost(slug: string) {
  const posts: Record<string, any> = {
    'getting-started-nextjs-14': {
      title: 'Getting Started with Next.js 14',
      date: '2024-01-15',
      readTime: '5 min read',
      tags: ['Next.js', 'React', 'Web Development'],
      content: `
# Getting Started with Next.js 14

Next.js 14 introduces several exciting features that make building React applications even better. In this post, we'll explore the key features and how to get started.

## App Directory

The app directory is now stable and provides a new way to structure your Next.js applications with improved routing and layout systems.

## Server Components

Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance.

## Turbopack

Turbopack is the new bundler that's significantly faster than Webpack, providing near-instant updates during development.

## Getting Started

To create a new Next.js 14 project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will set up a new Next.js project with all the latest features enabled by default.
      `
    }
  }
  
  return posts[slug] || null
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return (
      <div className="pt-16 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <article className="section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  )
}

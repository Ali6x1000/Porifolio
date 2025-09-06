'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    
    const savedPosts = localStorage.getItem('blog-posts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Default posts if none saved
      const defaultPosts = [
        {
          title: 'Getting Started with Next.js 14',
          excerpt: 'Learn how to build modern web applications with the latest features in Next.js 14, including the app directory and server components.',
          date: '2024-01-15',
          readTime: '5 min read',
          slug: 'getting-started-nextjs-14',
          tags: ['Next.js', 'React', 'Web Development']
        }
      ]
      setPosts(defaultPosts)
    }
  }, [])

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Thoughts on software development, technology, and computer science
            </p>
          </motion.div>

          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold mb-3 hover:text-primary-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                    >
                      Read more <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

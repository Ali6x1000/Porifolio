'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  featuredImage?: string
  readTime: number
}

interface BlogListProps {
  posts: Post[]
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="md:flex">
            {post.featuredImage && (
              <div className="md:w-1/3">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
            )}
            <div className={`p-6 ${post.featuredImage ? 'md:w-2/3' : 'w-full'}`}>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-gray-500 text-sm">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}

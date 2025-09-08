'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

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


export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // FETCH posts from the API instead of localStorage
    const fetchPosts = async () => {
      setLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchPosts();
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology, and more.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
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
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {post.readTime}
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
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Read more
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import BlogList from './components/BlogList'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  featuredImage?: string
  readTime: number
}

async function getPosts(): Promise<Post[]> {
  try {
    // Use relative URL for internal API calls
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.alinawaf.com' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/posts`, {
      cache: 'no-store' // This ensures fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    
    const posts = await response.json()
    return Array.isArray(posts) ? posts : []
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology, and more.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <Suspense fallback={<div className="text-center">Loading posts...</div>}>
            <BlogList posts={posts} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
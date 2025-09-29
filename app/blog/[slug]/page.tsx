import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import PostContent from './components/PostContent'

interface Post {
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  tags: string[]
  featuredImage?: string
  readTime: number
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.alinawaf.com' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - Ali Nawaf`,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Suspense fallback={<div className="text-center">Loading post...</div>}>
          <PostContent post={post} />
        </Suspense>
      </div>
    </div>
  )
}
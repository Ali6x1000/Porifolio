'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  tags: string[]
  content: string
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Initialize with default posts
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Getting Started with Next.js 14',
          excerpt: 'Learn how to build modern web applications with the latest features in Next.js 14.',
          date: '2024-01-15',
          readTime: '5 min read',
          slug: 'getting-started-nextjs-14',
          tags: ['Next.js', 'React', 'Web Development'],
          content: 'Full blog content here...'
        }
      ]
      setPosts(defaultPosts)
      localStorage.setItem('blog-posts', JSON.stringify(defaultPosts))
    }
  }, [])

  const savePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts)
    localStorage.setItem('blog-posts', JSON.stringify(updatedPosts))
  }

  const handleSave = (post: BlogPost) => {
    if (isCreating) {
      const newPost = { ...post, id: Date.now().toString() }
      savePosts([...posts, newPost])
      setIsCreating(false)
    } else {
      const updatedPosts = posts.map(p => p.id === post.id ? post : p)
      savePosts(updatedPosts)
    }
    setEditingPost(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(p => p.id !== id)
      savePosts(updatedPosts)
    }
  }

  const createNewPost = () => {
    const newPost: BlogPost = {
      id: '',
      title: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      slug: '',
      tags: [],
      content: ''
    }
    setEditingPost(newPost)
    setIsCreating(true)
  }

  if (editingPost) {
    return <BlogPostForm 
      post={editingPost} 
      onSave={handleSave} 
      onCancel={() => {
        setEditingPost(null)
        setIsCreating(false)
      }} 
    />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={createNewPost}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{post.date} • {post.readTime}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 text-gray-600 hover:text-primary-600 rounded"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-gray-600 hover:text-red-600 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlogPostForm({ 
  post, 
  onSave, 
  onCancel 
}: { 
  post: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState(post)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.slug) {
      setFormData(prev => ({ 
        ...prev, 
        slug: prev.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }))
    }
    onSave(formData)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {post.id ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2">
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="5 min read"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="React, Next.js, JavaScript"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={15}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
            placeholder="Write your blog content here..."
            required
          />
        </div>
      </form>
    </div>
  )
}

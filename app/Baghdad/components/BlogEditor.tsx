'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Save, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Quote, Eye, EyeOff } from 'lucide-react'

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
          content: 'Full blog content here...',
          featuredImage: ''
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
      content: '',
      featuredImage: ''
    }
    setEditingPost(newPost)
    setIsCreating(true)
  }

  if (editingPost) {
    return <AdvancedBlogPostForm 
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
                {post.featuredImage && (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
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

function AdvancedBlogPostForm({ 
  post, 
  onSave, 
  onCancel 
}: { 
  post: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState(post)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

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

  const insertText = (before: string, after: string = '') => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    const newText = before + selectedText + after
    
    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end)
    
    setFormData(prev => ({ ...prev, content: newContent }))
    
    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        )
      }
    }, 0)
  }

  const insertMarkdown = (markdown: string) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newContent = 
      formData.content.substring(0, start) + 
      markdown + 
      formData.content.substring(start)
    
    setFormData(prev => ({ ...prev, content: newContent }))
    
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(start + markdown.length, start + markdown.length)
      }
    }, 0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        insertMarkdown(`![Image description](${imageUrl})`)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderPreview = (content: string) => {
    // Simple markdown-to-HTML converter for preview
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary-600 hover:underline">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br>')
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Underline' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Quote, action: () => insertMarkdown('> '), title: 'Quote' },
    { icon: List, action: () => insertMarkdown('* '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), title: 'Numbered List' },
    { icon: Link, action: () => insertText('[Link Text](', ')'), title: 'Link' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {post.id ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
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
        {/* Basic Information */}
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

        {/* Meta Information */}
        <div className="grid md:grid-cols-4 gap-4">
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
          <div className="md:col-span-2">
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

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Featured Image URL</label>
          <input
            type="url"
            value={formData.featuredImage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.featuredImage && (
            <div className="mt-2">
              <img 
                src={formData.featuredImage} 
                alt="Featured" 
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          
          {!isPreviewMode && (
            <>
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                {toolbarButtons.map((button, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={button.action}
                    title={button.title}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                  >
                    <button.icon size={16} />
                  </button>
                ))}
                <div className="border-l mx-2"></div>
                <label className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Upload Image">
                  <Image size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Editor */}
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                rows={20}
                className="w-full p-4 border border-gray-300 rounded-b-lg border-t-0 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
                placeholder="Write your blog content here using Markdown...

Examples:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
`inline code`
```
code block
```
[Link](https://example.com)
![Image](image-url)
> Quote
* Bullet point
1. Numbered list"
                required
              />
            </>
          )}

          {/* Preview */}
          {isPreviewMode && (
            <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[500px]">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderPreview(formData.content) 
                }}
              />
            </div>
          )}

          {/* Helper Text */}
          <div className="mt-2 text-sm text-gray-500">
            <p>Supports Markdown formatting. Use the toolbar buttons or type Markdown directly.</p>
            <p className="mt-1">
              <strong>Quick tips:</strong> **bold**, *italic*, `code`, # heading, [link](url), ![image](url)
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

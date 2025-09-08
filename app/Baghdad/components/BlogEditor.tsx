'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Plus, Edit, Trash2, Save, Bold, Italic, Underline, List, 
  ListOrdered, Link, Image, Code, Quote, Eye, EyeOff, Calculator, Sigma 
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import "prism-themes/themes/prism-vsc-dark-plus.css";
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
      try {
        const parsedPosts = JSON.parse(savedPosts)
        setPosts(Array.isArray(parsedPosts) ? parsedPosts : [])
      } catch (error) {
        console.error('Error parsing saved posts:', error)
        setPosts([])
      }
    } else {
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Getting Started with Next.js 14',
          excerpt: 'Learn how to build modern web applications with the latest features in Next.js 14.',
          date: '2024-01-15',
          readTime: '5 min read',
          slug: 'getting-started-nextjs-14',
          tags: ['Next.js', 'React', 'Web Development'],
          content: `# Getting Started with Next.js 14

Next.js 14 introduces several exciting features that make building React applications even better.

## Mathematical Expressions

You can include mathematical expressions using LaTeX syntax:

Inline math: The formula $E = mc^2$ is Einstein's mass-energy equivalence.

Display math:
$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

Complex equations from an EM algorithm:
$$\\pi_{A}^{\\text{new}} = \\frac{\\sum_{i=1}^{N} \\gamma(z_i=A) \\cdot x_i}{\\sum_{i=1}^{N} \\gamma(z_i=A)}$$
For Coin B, the update is:
$$\\pi_{B}^{\\text{new}} = \\frac{\\sum_{i=1}^{N} (1-\\gamma(z_i=A)) \\cdot x_i}{\\sum_{i=1}^{N} (1-\\gamma(z_i=A))}$$

## Code Examples

\`\`\`javascript
const fibonacci = (n) => {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
\`\`\`

This is a great way to showcase both code and mathematical concepts!`,
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
    const finalPost = {
      ...post,
      slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      id: post.id || Date.now().toString()
    }

    if (isCreating) {
      savePosts([...posts, finalPost])
      setIsCreating(false)
    } else {
      const updatedPosts = posts.map(p => p.id === finalPost.id ? finalPost : p)
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
        <h2 className="text-2xl font-bold">Blog Posts ({posts.length})</h2>
        <button
          onClick={createNewPost}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No blog posts yet.</p>
          <button
            onClick={createNewPost}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Post
          </button>
        </div>
      ) : (
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
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{post.date} • {post.readTime}</p>
                  <p className="text-xs text-gray-400 mt-1">Slug: /{post.slug}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="p-2 text-gray-600 hover:text-primary-600 rounded"
                    title="Edit Post"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded"
                    title="Delete Post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.slug && formData.title) {
      setFormData(prev => ({ 
        ...prev, 
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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
    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end)
    setFormData(prev => ({ ...prev, content: newContent }))
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }
    }, 0)
  }

  const insertMarkdown = (markdown: string) => {
    const textarea = contentRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const newContent = formData.content.substring(0, start) + markdown + formData.content.substring(start)
    setFormData(prev => ({ ...prev, content: newContent }))
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(start + markdown.length, start + markdown.length)
      }
    }, 0)
  }

  const insertLatex = (latex: string) => {
    insertMarkdown(latex)
  }


// Add this state to track uploaded images
const [uploadedImages, setUploadedImages] = useState<string[]>([])

// Enhanced handleImageUpload with preview
// A revised handleImageUpload function for your AdvancedBlogPostForm component

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1. Create a unique ID for this specific upload
  const tempId = `uploading-${Date.now()}-${file.name}`;
  const loadingText = `![Uploading ${file.name}...](${tempId})`;
  
  // 2. Insert the unique placeholder at the cursor position
  insertMarkdown(loadingText + '\n');
  
  try {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Upload failed with status: ' + response.status);
    }

    const { url } = await response.json();

    // 3. Replace the unique placeholder with the final Markdown
    setFormData(prev => ({
      ...prev,
      content: prev.content.replace(loadingText, `![${file.name}](${url})`)
    }));

  } catch (error) {
    console.error('Image upload failed:', error);
    alert('Failed to upload image. Please try again.');
    
    // 4. On error, remove the unique placeholder
    setFormData(prev => ({
      ...prev,
      content: prev.content.replace(loadingText, '')
    }));
  } finally {
      // Clear the file input so the user can upload the same file again
      e.target.value = '';
  }
};


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

  const latexButtons = [
    { icon: Calculator, action: () => insertLatex('$E = mc^2$'), title: 'Inline Math' },
    { icon: Sigma, action: () => insertLatex('$$\\sum_{i=1}^{n} x_i$$'), title: 'Display Math' },
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
        {/* Title and Slug */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value
                setFormData(prev => ({ 
                  ...prev, 
                  title,
                  slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                }))
              }}
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
              placeholder="auto-generated-from-title"
            />
          </div>
        </div>

        {/* Excerpt */}
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

        {/* Date, Read Time, Tags */}
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

        {/* Enhanced Content Editor with LaTeX support */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          
          {!isPreviewMode ? (
            <>
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                {toolbarButtons.map((button, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={button.action}
                    title={button.title}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                  >
                    <button.icon size={18} />
                  </button>
                ))}
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                {latexButtons.map((button, index) => (
                  <button
                    key={`latex-${index}`}
                    type="button"
                    onClick={button.action}
                    title={button.title}
                    className="p-2 hover:bg-gray-200 rounded transition-colors text-blue-600"
                  >
                    <button.icon size={18} />
                  </button>
                ))}
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <label className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Upload Image">
                  <Image size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full p-3 border-x border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your blog post content in Markdown format...

# Example heading
Your content here...

## Math examples:
Inline math: $E = mc^2$
Display math: $$\int_0^\infty e^{-x^2} dx$$

```javascript
// Code blocks work too
console.log('Hello, world!')
```"
                required
              />
            </>
          ) : (
            <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[500px]">
              <div className="prose prose-lg max-w-none">
              <ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex, rehypeRaw]}
  components={{
    code({node, inline, className, children, ...props}: {
      node: any, inline?: boolean, className?: string, children: React.ReactNode
    }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      )
    }
  }}
>
  {formData.content || '*No content yet...*'}
</ReactMarkdown>

              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

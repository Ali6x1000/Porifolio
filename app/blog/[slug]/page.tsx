'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

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

// Enhanced LaTeX rendering function
const renderLatex = (text: string): string => {
  // Handle display math ($$...$$)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
    return `<div class="katex-display math-block bg-gradient-to-r from-blue-50 to-indigo-50 p-6 my-6 rounded-xl border-l-4 border-blue-400 overflow-x-auto shadow-sm">
      <div class="katex-html font-mono text-lg text-center" style="font-family: 'Computer Modern', 'Times New Roman', serif;">${escapeLatex(latex.trim())}</div>
    </div>`
  })
  
  // Handle inline math ($...$)
  text = text.replace(/\$([^$\n]+?)\$/g, (match, latex) => {
    return `<span class="katex-inline math-inline bg-blue-50 px-2 py-1 rounded-md font-mono text-blue-900 border border-blue-200" style="font-family: 'Computer Modern', 'Times New Roman', serif;">${escapeLatex(latex.trim())}</span>`
  })
  
  return text
}

const escapeLatex = (latex: string): string => {
  // Enhanced LaTeX to Unicode/HTML conversion
  return latex
    // Fractions
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span><span class="fraction-bar">—</span><span class="denominator">$2</span></span>')
    // Square roots
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    // Integrals and summations
    .replace(/\\int/g, '∫')
    .replace(/\\sum/g, '∑')
    .replace(/\\prod/g, '∏')
    .replace(/\\infty/g, '∞')
    // Greek letters
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\zeta/g, 'ζ')
    .replace(/\\eta/g, 'η')
    .replace(/\\theta/g, 'θ')
    .replace(/\\iota/g, 'ι')
    .replace(/\\kappa/g, 'κ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\nu/g, 'ν')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\pi/g, 'π')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\tau/g, 'τ')
    .replace(/\\upsilon/g, 'υ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\chi/g, 'χ')
    .replace(/\\psi/g, 'ψ')
    .replace(/\\omega/g, 'ω')
    // Capital Greek letters
    .replace(/\\Gamma/g, 'Γ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Theta/g, 'Θ')
    .replace(/\\Lambda/g, 'Λ')
    .replace(/\\Xi/g, 'Ξ')
    .replace(/\\Pi/g, 'Π')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Upsilon/g, 'Υ')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\Psi/g, 'Ψ')
    .replace(/\\Omega/g, 'Ω')
    // Superscripts and subscripts with braces
    .replace(/\^\\?\{([^}]+)\}/g, '<sup>$1</sup>')
    .replace(/_\\?\{([^}]+)\}/g, '<sub>$1</sub>')
    // Simple superscripts and subscripts
    .replace(/\^(\w)/g, '<sup>$1</sup>')
    .replace(/_(\w)/g, '<sub>$1</sub>')
    // Mathematical operators
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\mp/g, '∓')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\equiv/g, '≡')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\supset/g, '⊃')
    .replace(/\\cap/g, '∩')
    .replace(/\\cup/g, '∪')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\nabla/g, '∇')
    .replace(/\\partial/g, '∂')
    // Arrows
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\leftrightarrow/g, '↔')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftarrow/g, '⇐')
    .replace(/\\Leftrightarrow/g, '⇔')
    // Limits
    .replace(/\\lim/g, 'lim')
    .replace(/\\max/g, 'max')
    .replace(/\\min/g, 'min')
    // Functions
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\exp/g, 'exp')
}

const renderMarkdownWithLatex = (content: string) => {
  // First render LaTeX
  let html = renderLatex(content)
  
  // Then render markdown
  html = html
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-6 text-gray-800">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-3 mt-5 text-gray-700">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-800">$1</em>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded font-mono text-sm text-red-600">$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-6 shadow-lg"><code class="font-mono text-sm">$1</code></pre>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6 shadow-lg" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-400 pl-6 italic bg-blue-50 py-4 my-4 rounded-r-lg">$1</blockquote>')
    .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">• $1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
  
  // Wrap in paragraphs
  html = '<p class="mb-4">' + html + '</p>'
  
  return html
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
    const foundPost = getBlogPost(params.slug)
    setPost(foundPost)
    setLoading(false)
  }, [params.slug])

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
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
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

              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>

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
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownWithLatex(post.content) 
                }}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </motion.div>
        </div>
      </article>
    </>
  )
}

'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FileText, Briefcase, User, UserCircle, FolderOpen } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const BlogEditor = dynamic(() => import('./components/BlogEditor'), { 
  ssr: false,
  loading: () => <div className="p-8 bg-white rounded-lg shadow animate-pulse">Loading...</div>
})

const ProjectEditor = dynamic(() => import('./components/ProjectEditor'), {
  ssr: false,
  loading: () => <div className="p-8 bg-white rounded-lg shadow animate-pulse">Loading...</div>
})

const ResumeEditor = dynamic(() => import('./components/ResumeEditor'), {
  ssr: false,
  loading: () => <div className="p-8 bg-white rounded-lg shadow animate-pulse">Loading...</div>
})

const AboutEditor = dynamic(() => import('./components/AboutEditor'), {
  loading: () => <div className="p-8 text-center">Loading About Editor...</div>
})

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('blog')

  const tabs = [
    { id: 'blog', name: 'Blog Posts', icon: FileText },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'about', name: 'About Me', icon: UserCircle },
    { id: 'resume', name: 'Resume', icon: User }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'blog':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <BlogEditor />
          </Suspense>
        )
      case 'projects':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <ProjectEditor />
          </Suspense>
        )
      case 'about':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <AboutEditor />
          </Suspense>
        )
      case 'resume':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <ResumeEditor />
          </Suspense>
        )
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your portfolio content</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Code } from 'lucide-react'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Define the interface - make sure it matches ProjectEditor
interface Project {
  id: string  // Add id field to match ProjectEditor
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  image: string
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : [])
      } else {
        // Fallback to default projects if API fails
        setProjects(getDefaultProjects())
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects(getDefaultProjects())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultProjects = (): Project[] => [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application with user authentication, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github: 'https://github.com/yourusername/ecommerce',
      demo: 'https://your-ecommerce-demo.com',
      image: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates, drag-and-drop functionality, and team features.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io'],
      github: 'https://github.com/yourusername/taskapp',
      demo: 'https://your-taskapp-demo.com',
      image: '/api/placeholder/400/250'
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'Weather application with location-based forecasts, interactive maps, and historical data visualization.',
      technologies: ['React', 'Chart.js', 'Weather API', 'Tailwind CSS'],
      github: 'https://github.com/yourusername/weather',
      demo: 'https://your-weather-demo.com',
      image: '/api/placeholder/400/250'
    }
  ]

  if (!mounted) {
    return (
      <div className="pt-16">
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">My Projects</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Loading projects...
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="pt-16">
        <section className="section-padding">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of projects showcasing my skills in web development, 
              machine learning, and software engineering.
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
              <p className="text-gray-400 mt-2">Check back soon for new projects!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id} // Use id instead of title for better React keys
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card group hover:scale-105 transition-transform duration-300"
                >
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {project.image && project.image !== '/api/placeholder/400/250' ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <Code className="text-primary-600" size={48} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Github size={20} />
                      Code
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink size={20} />
                        Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Use dynamic import to disable SSR for this component
const Projects = dynamic(() => Promise.resolve(ProjectsContent), {
  ssr: false,
  loading: () => (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </section>
    </div>
  )
})

export default Projects
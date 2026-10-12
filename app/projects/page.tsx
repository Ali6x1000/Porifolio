'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Code } from 'lucide-react'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface Project {
  id: string
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

  if (!mounted || loading) {
    return (
      <div className="pt-24 min-h-screen bg-background relative flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:block hidden" />
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:hidden block" />
        <div className="flex flex-col items-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-background relative pb-20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:block hidden" />
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:hidden block" />
      
      <section className="relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">My Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of projects showcasing my skills in web development, 
              machine learning, and software engineering.
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="h-48 w-full bg-muted relative overflow-hidden flex items-center justify-center">
                    {project.image && project.image !== '/api/placeholder/400/250' ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Code className="text-muted-foreground/30" size={48} />
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-secondary-foreground border border-border/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
                          <Github size={18} /> Code
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
                          <ExternalLink size={18} /> Demo
                        </a>
                      )}
                    </div>
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

const Projects = dynamic(() => Promise.resolve(ProjectsContent), {
  ssr: false,
  loading: () => (
    <div className="pt-24 min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
    </div>
  )
})

export default Projects